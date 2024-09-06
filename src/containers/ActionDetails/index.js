import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
// import PeopleSearch from '../../components/Slider/Security/PeopleSearch';
import {toggleActionSlider} from '../../reduxStore/actions';
import './styles.scss';
import useFetch from '../../hooks';
import {SlideIn, Frame, ExpandableIcon} from '../../components/Utils';
import {getIFramesUrls} from '../../services/user';
import Search from '../../components/Slider/Security/Search';

const ActionDetails = () => {
  const dispatch = useDispatch();
  const map = useSelector((s) => s.map);
  let district,
    building = null;
  if (map) {
    district = map.district || null;
    building = map.building || null;
  }
  const buildingUrls = useFetch(getIFramesUrls, district, building);
  useEffect(() => {
    if (district || building) buildingUrls.fetch(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district, building]);
  const credentials_3dEye = useSelector((s) => s.dashboard.credentials_3dEye, shallowEqual);
  const {open, action, data} = useSelector((s) => s.dashboard.actionSlider, shallowEqual);
  const triggerToggleActionSlider = () => dispatch(toggleActionSlider(action));
  const renderBody = useCallback(() => {
    if (action === 'Search') {
      return <Search />;
    } else {
      let iframe = null;
      if (building) {
        iframe = buildingUrls.response.districtPortals.find(
          (item) => item.section === data.toUpperCase() && item.module === action.toUpperCase() && item.buildingId === building
        );
      } else {
        iframe = buildingUrls.response.districtPortals.find(
          (item) => item.section === data.toUpperCase() && item.module === action.toUpperCase() && item.buildingId === null
        );
      }
      let url = iframe ? iframe.kpiConfiguration.apiUrl : '';
      let extraData = '',
        showLogoDiv = false;

      switch (data) {
        case 'SECURITY_SURVEILLANCE':
          extraData = `?access_token=${credentials_3dEye.accessToken}&refresh_token=${credentials_3dEye.refreshToken}`;
          // showLogoDiv = true;
          break;
        case 'SECURITY_INCIDENTS':
          extraData = `?situationID=${data.situation_id}&windowNumber=1`;
          break;
        case 'ENERGY_DETAILS':
          extraData = `?username=demoadmin&password=demo@NXN2018`;
          break;
        case 'ASSET_DETAILS':
          extraData = ``;
          break;
        default:
          break;
      }
      return <Frame source={url + extraData} showLogoDiv={showLogoDiv} />;
    }
  }, [data, credentials_3dEye, action, buildingUrls, building]);

  return (
    <SlideIn in={open && action !== 'Statistics'} className="dashboard-action-expandable">
      <div className="action-details-container">
        <ExpandableIcon onClick={triggerToggleActionSlider} active={open} inverted />
        {buildingUrls.response && action && action !== 'Statistics' && renderBody()}
      </div>
    </SlideIn>
  );
};
export default ActionDetails;
