import {
  buildingSelection as buildingSelectionAction,
  floorSelection as floorSelectionAction,
  wasteLocationSelection as wasteLocationSelectionAction,
  selectDistrict,
  setDistricts,
  updateMapAssets,
  setLoadingFloors,
  setInFloorCamera,
  setDistrictsData as setDistrictsDataAction,
  setIsAddAssetModalOpened as setIsAddAssetModalOpenedAction,
  setAddAssetFeatureEnabled as setAddAssetFeatureEnabledAction,
  setWasteLocations as setWasteLocationsAction,
  setIsBuildingComparisonOpened as setIsBuildingComparisonOpenedAction,
  setShowAlarms as setShowAlarmsAction,
  setShowAirQuality as setShowAirQualityAction,
  setBuildingsInfoLoading as setBuildingsInfoLoadingAction,
  setBuildingsInfo as setBuildingsInfoAction,
  setActiveBuildingInfoId as setActiveBuildingInfoIdAction,
  setBuildingsConsumptionAlerts as setBuildingsConsumptionAlertsAction,
  setZones as setZonesAction,
  setRoleDistricts as setRoleDistrictsAction,
  setPlaySequenceAnimation as setPlaySequenceAnimationAction
} from './index';
import MultiWindow from '../../services/MultiWindow';
import {fetchBuildingsConsumptionAlarms} from '../../services/dashBoard';

const buildingSelection =
  (payload, showBuildingDetails = true, holdTrigger = false) =>
  (dispatch, getState) => {
    const activeWindow = getState().multiWindow.activeWindow;
    if (activeWindow && !holdTrigger) {
      MultiWindow.selectABuilding(activeWindow.windowId, payload);
    }
    dispatch(buildingSelectionAction({buildingId: payload, showBuildingDetails}));
  };

const setDistrictsData = (payload) => (dispatch, getState) => {
  dispatch(setDistrictsDataAction(payload));
};

const floorSelection =
  (payload, holdTrigger = false) =>
  (dispatch, getState) => {
    const activeWindow = getState().multiWindow.activeWindow;
    if (activeWindow && !holdTrigger) {
      MultiWindow.selectAFloor(activeWindow.windowId, payload);
    }
    dispatch(floorSelectionAction(payload));
  };

const wasteLocationSelection = (payload) => (dispatch, getState) => {
  dispatch(wasteLocationSelectionAction(payload));
};

const setIsAddAssetModalOpened =
  (open, enableAddition, coords = null) =>
  (dispatch, getState) => {
    if (!open) {
      if (enableAddition) {
        const mapAssets = [...getState().map.mapAssets];
        mapAssets.splice(mapAssets.length - 1, 1);
        dispatch(updateMapAssets(mapAssets));
      }
      dispatch(setAddAssetFeatureEnabled(open, enableAddition));
    }
    dispatch(setIsAddAssetModalOpenedAction({open, coords}));
  };
const setAddAssetFeatureEnabled =
  (enabled, add = true) =>
  (dispatch, getState) => {
    dispatch(setAddAssetFeatureEnabledAction({enabled, add}));
  };
const setTempAsset = (coords, rotation) => (dispatch, getState) => {
  const tempAsset = {
    id: `temp-asset-${Math.random() * 10000}`,
    coordinates: [coords.lng, coords.lat],
    rotation: [Math.PI / 2, rotation / (114.59155902616465 / 2), 0],
    scale: '14.5e-8',
    ambientLight: 4,
    url: 'gltf-icons/streetlight-green04.gltf'
  };
  let mapAssets = [...getState().map.mapAssets];
  const addAssetFlag = getState().map.addAssetFlag;
  if (mapAssets) {
    if (addAssetFlag) {
      mapAssets.push(tempAsset);
      dispatch(setAddAssetFeatureEnabled(true, false));
    } else {
      mapAssets.splice(mapAssets.length - 1, 1);
      mapAssets.push(tempAsset);
    }
    dispatch(updateMapAssets(mapAssets));
  }
};
const updateMapAsset =
  (asset, select = false) =>
  (dispatch, getState) => {
    let mapAssets = [...getState().map.mapAssets];
    if (mapAssets) {
      const mapAssetIndex = mapAssets.findIndex((a) => a.asset_id === asset.asset_id);
      mapAssets[mapAssetIndex].id = `${mapAssets[mapAssetIndex].id}-${Math.random() * 10000}`;
      mapAssets[mapAssetIndex].ambientLight = select ? 4 : 2;
      dispatch(updateMapAssets(mapAssets));
    }
  };

const setWasteLocations = (payload) => (dispatch) => {
  dispatch(setWasteLocationsAction(payload));
};

const setIsBuildingComparisonOpened = (payload) => (dispatch) => {
  dispatch(setIsBuildingComparisonOpenedAction(payload));
};

const setShowAlarms = (payload) => (dispatch) => {
  dispatch(setShowAlarmsAction(payload));
};

const setShowAirQuality = (payload) => (dispatch) => {
  dispatch(setShowAirQualityAction(payload));
};

const setBuildingsInfoLoading = (payload) => (dispatch) => {
  dispatch(setBuildingsInfoLoadingAction(payload));
};

const setBuildingsInfo = (payload) => (dispatch) => {
  dispatch(setBuildingsInfoAction(payload));
};

const setActiveBuildingInfoId = (payload) => (dispatch) => {
  dispatch(setActiveBuildingInfoIdAction(payload));
};

const getBuildingsConsumptionAlerts = (district, startDate, endDate) => async (dispatch) => {
  const data = await fetchBuildingsConsumptionAlarms(district, startDate, endDate);
  dispatch(setBuildingsConsumptionAlertsAction(data));
};

const setZones = (payload) => async (dispatch) => {
  dispatch(setZonesAction(payload));
};

const setRoleDistricts = (payload) => async (dispatch) => {
  dispatch(setRoleDistrictsAction(payload));
};

const setPlaySequenceAnimation = (payload) => async (dispatch) => {
  dispatch(setPlaySequenceAnimationAction(payload));
};

export {
  getBuildingsConsumptionAlerts,
  floorSelection,
  wasteLocationSelection,
  setInFloorCamera,
  selectDistrict,
  buildingSelection,
  setDistricts,
  setDistrictsData,
  setLoadingFloors,
  updateMapAssets,
  setIsAddAssetModalOpened,
  setAddAssetFeatureEnabled,
  setTempAsset,
  updateMapAsset,
  setWasteLocations,
  setIsBuildingComparisonOpened,
  setShowAlarms,
  setShowAirQuality,
  setBuildingsInfoLoading,
  setBuildingsInfo,
  setActiveBuildingInfoId,
  setZones,
  setRoleDistricts,
  setPlaySequenceAnimation
};
