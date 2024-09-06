import {default as store} from '..';
import {buildingSelection} from '../actions';
import {
  setInsight as setInsightAction,
  toggleInsight as toggleInsightAction,
  toggleSlider as toggleSliderAction,
  store3dEyeCredentials as store3dEyeCredentialsAction,
  toggleInsightSlider as toggleInsightSliderAction,
  setInsightSliderState as setInsightSliderStateAction,
  setDateFilter as setDateFilterAction,
  toggleActionSlider as toggleActionSliderAction,
  setShowSlider as setShowSliderAction,
  toggleModal as toggleModalAction,
  setSearchSliderActive as setSearchSliderActiveAction,
  setIsIntersectionDataSliderOpened as setIsIntersectionDataSliderOpenedAction,
  updateStreamCameras as updateStreamCamerasAction,
  setIFrames as setIFramesAction,
  setInsightType as setInsightTypeAction,
  setCurrentDashboardProps as setCurrentDashboardPropsAction,
  setSelectedTrendLineOrBreakdown as setSelectedTrendLineOrBreakdownAction,
  setEnergyRequest as setEnergyRequestAction,
  setWaterRequest as setWaterRequestAction,
  setOpenLanding as setOpenLandingAction,
  setDistrictPvProductionChart as setDistrictPvProductionChartAction,
  setIsAirQualityDrillDownOpened as setIsAirQualityDrillDownOpenedAction,
  setSelectedModule as setSelectedModuleAction
} from './index';
import MultiWindow from '../../services/MultiWindow';

export const toggleInsight =
  (newInsight, holdTrigger = false) =>
  (dispatch, getState) => {
    const activeWindow = getState().multiWindow.activeWindow;
    const {building, district} = getState().map;
    const {insight} = getState().dashboard;
    if (
      building &&
      (insight === newInsight ||
        !store.getState().user.access.kpi[insight].some((b) => b.district_id === district && b.building_id === building))
    )
      store.dispatch(buildingSelection());
    if (activeWindow && !holdTrigger) {
      MultiWindow.toggleInsight(activeWindow.windowId, newInsight);
    }
    dispatch(toggleInsightAction(newInsight));
  };

export const setOpenLanding = (openLanding) => (dispatch) => {
  dispatch(setOpenLandingAction(openLanding));
};
export const toggleSlider = () => (dispatch) => {
  dispatch(toggleSliderAction());
};

export const setInsightType = (newInsightType) => (dispatch) => {
  dispatch(setInsightTypeAction(newInsightType));
};

export const store3dEyeCredentials = (payload) => (dispatch) => {
  dispatch(store3dEyeCredentialsAction(payload));
};

export const toggleInsightSlider = () => (dispatch) => {
  dispatch(toggleInsightSliderAction());
};

export const setInsightSliderState = (payload) => (dispatch) => {
  dispatch(setInsightSliderStateAction(payload));
};

export const setDateFilter = (payload) => (dispatch) => {
  dispatch(setDateFilterAction(payload));
};

export const toggleActionSlider =
  (module, section, data = null) =>
  (dispatch) => {
    dispatch(toggleActionSliderAction({module, section, data}));
  };

export const setShowSlider = (payload) => (dispatch) => {
  dispatch(setShowSliderAction(payload));
};

export const toggleModal =
  (qrCode = null) =>
  (dispatch) => {
    dispatch(toggleModalAction({isOpen: qrCode ? true : false, qrCode: qrCode}));
  };

export const setSearchSliderActive = (active) => (dispatch) => {
  dispatch(setSearchSliderActiveAction(active));
};

export const setIsIntersectionDataSliderOpened = (payload) => (dispatch) => {
  dispatch(setIsIntersectionDataSliderOpenedAction(payload));
};
export const updateStreamCameras = (payload) => (dispatch) => {
  dispatch(updateStreamCamerasAction(payload));
};
export const setIFrames = (payload) => (dispatch) => {
  dispatch(setIFramesAction(payload));
};

export const setCurrentDashboardProps = (payload) => (dispatch) => {
  dispatch(setCurrentDashboardPropsAction(payload));
};

export const setSelectedModule = (newModule) => (dispatch) => {
  dispatch(setSelectedModuleAction(newModule));
};

export const setSelectedDashboard =
  (id, holdTrigger = false) =>
  (dispatch, getState) => {
    const activeWindow = getState().multiWindow.activeWindow;
    const currentDashboardProps = getState().dashboard.currentDashboardProps;
    const props = JSON.parse(JSON.stringify(currentDashboardProps));
    let insight = '';

    switch (id) {
      case 'home':
        props.periodSelection.showBackButton = false;
        props.sidebar.selectedId = id;
        props.header.titleId = id;
        insight = '';
        break;
      case 'energy':
        props.periodSelection.showBackButton = true;
        props.sidebar.selectedId = id;
        props.header.titleId = id;
        insight = 'energy';
        break;
      case 'water':
        props.periodSelection.showBackButton = true;
        props.sidebar.selectedId = id;
        props.header.titleId = id;
        insight = 'water';
        break;
      case 'carbon':
        props.periodSelection.showBackButton = true;
        props.sidebar.selectedId = id;
        props.header.titleId = id;
        insight = 'carbon';
        break;
      case 'waste':
        props.periodSelection.showBackButton = true;
        props.sidebar.selectedId = id;
        props.header.titleId = id;
        insight = 'waste';
        break;
      case 'weather':
        break;
      case 'profile':
        break;
      case 'districts':
        break;
      case 'multiWindow':
        break;
      case 'logout':
        break;
      case 'alarms':
        break;
      default:
        break;
    }

    if (activeWindow && !holdTrigger) {
      MultiWindow.toggleInsight(activeWindow.windowId, insight);
    }

    dispatch(setInsightAction(insight));
    dispatch(setCurrentDashboardPropsAction(props));
  };

export const setSelectedTrendLineOrBreakdown = (payload) => (dispatch) => {
  dispatch(setSelectedTrendLineOrBreakdownAction(payload));
};

export const setEnergyRequest = (payload) => (dispatch) => {
  dispatch(setEnergyRequestAction(payload));
};

export const setWaterRequest = (payload) => (dispatch) => {
  dispatch(setWaterRequestAction(payload));
};

export const setDistrictPvProductionChart = (payload) => (dispatch) => {
  dispatch(setDistrictPvProductionChartAction(payload));
};

export const setIsAirQualityDrillDownOpened = (payload) => (dispatch) => {
  dispatch(setIsAirQualityDrillDownOpenedAction(payload));
};
