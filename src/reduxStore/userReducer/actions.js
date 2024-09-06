import {
  setUserAccess as setUserAccessAction,
  toggleExpireModal as toggleExpireModalAction,
  setModulesAccess as setModulesAccessAction,
  setChartConfigurations as setChartConfigurationsAction
} from './index';
import {getUserRoleDetails, logoutUserRequest} from '../../services/auth';
import {errorNotification, successNotification} from '../../components/Utils/Notifications';
import {setDistricts, selectDistrict, setDistrictsData, setZones, setRoleDistricts} from '../mapReducer/actions';
import {setStylingTemplateProperties, setDarkStylingTemplateProperties} from '../stylingReducer/actions';
import {getDistrict} from '../../services/dashBoard';

import moment from 'moment';
import ls from 'local-storage';
import {setIFrames, setOwnerTheme} from '../actions';

export const authenticateUser = () => async (dispatch) => {
  try {
    const login = ls.get('login');
    if (login) {
      const data = await getUserRoleDetails();
      if (data === undefined) {
        successNotification('No access found for this user', 'warning');
        dispatch(logoutActions());
      }
      let districts = [];
      let hasAccessToAnyDistrictOrBuilding = false;
      Object.keys(data.kpi).forEach((mod) => {
        data.kpi[mod].forEach((building) => {
          if (hasAccessToAnyDistrictOrBuilding === false) hasAccessToAnyDistrictOrBuilding = data.kpi[mod].length > 0 ? true : false;
          if (!districts.some((item) => item === building.district_id)) districts.push(building.district_id);
        });
      });
      if (hasAccessToAnyDistrictOrBuilding === false) {
        successNotification('You do not have access on any Districts', 'warning');
        dispatch(logoutActions());
        return;
      }

      let districtsInfos = [];
      const districtsPromises = districts.map(async (districtId) => {
        const districtInfo = await getDistrict(districtId, data);
        districtsInfos.push(districtInfo);
      });
      await Promise.all(districtsPromises);
      districtsInfos = districtsInfos.sort((a, b) => moment(a.info.creationTime).valueOf() - moment(b.info.creationTime).valueOf());
      districts = districtsInfos.map((d) => d.info.id);
      const districtInfo = districtsInfos[0];
      dispatch(setDistricts(districts));
      dispatch(setZones(data.roleZones));
      dispatch(setRoleDistricts(data.roleDistricts));
      dispatch(setUserAccess(login, data));
      dispatch(selectDistrict(districtInfo));
      dispatch(setIFrames(districtInfo.iFrames));
      dispatch(setDistrictsData(districtsInfos));
      dispatch(setOwnerTheme(data.ownerTheme?.name, data.ownerTheme?.ownerThemeIcons));
      dispatch(setChartConfigurationsAction(data?.ownerChartConfigurations ?? []));
      dispatch(
        setStylingTemplateProperties(
          data.stylingTemplate?.stylingTemplateProperties,
          data.stylingTemplate?.logoFile?.filePath,
          data.stylingTemplate?.headerFile?.filePath
        )
      );
      dispatch(
        setDarkStylingTemplateProperties(
          data.darkStylingTemplate?.stylingTemplateProperties,
          data.darkStylingTemplate?.logoFile?.filePath,
          data.darkStylingTemplate?.headerFile?.filePath
        )
      );
    } else {
      dispatch(logoutActions());
    }
  } catch (error) {
    dispatch(logoutActions());
    errorNotification(error);
  }
};

export const setUserAccess =
  (login = false, access = null) =>
  (dispatch) => {
    dispatch(setUserAccessAction({login, access}));
  };
export const toggleExpireModal = () => (dispatch) => {
  dispatch(toggleExpireModalAction());
};

export const logoutActions = () => async (dispatch) => {
  dispatch(setUserAccess());
  await logoutUserRequest();
};

export const setModulesAccess = (modules) => (dispatch) => {
  dispatch(setModulesAccessAction(modules));
};
