import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  district: undefined,
  districts: undefined,
  inFloorCamera: undefined,
  building: undefined,
  floor: undefined,
  wasteLocation: undefined,
  wasteLocations: undefined,
  isLoadingFloors: false,
  buildings: undefined,
  zones: undefined,
  roleDistricts: undefined,
  mapAssets: undefined,
  isAddAssetModalOpened: false,
  addAssetModalCoords: null,
  isAddAssetFeatureEnabled: false,
  isBuildingComparisonOpened: false,
  showAlarms: false,
  showAirQuality: true,
  addAssetFlag: false,
  districtInfo: undefined,
  districtsData: [],
  districtReports: [],
  buildingsInfoLoading: false,
  buildingsInfo: [],
  activeBuildingInfoId: undefined,
  showBuildingDetails: true,
  playSequenceAnimation: false,
  heatMap: {
    show: false,
    data: undefined
  },
  buildingsConsumptionAlerts: []
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    buildingSelection: (state, {payload}) => {
      const building = payload.buildingId === state.building || payload.buildingId === undefined ? null : payload.buildingId;
      state.building = building;
      state.floor = undefined;
      state.inFloorCamera = undefined;
      state.isLoadingFloors = building ? true : false;
      state.showBuildingDetails = payload.showBuildingDetails;
    },
    floorSelection: (state, {payload}) => {
      const floor = payload === state.floor || payload === '' ? undefined : payload;
      state.floor = floor;
      state.inFloorCamera = undefined;
    },
    wasteLocationSelection: (state, {payload}) => {
      const wasteLocation = payload === state.wasteLocation || payload === '' ? undefined : payload;
      state.wasteLocation = wasteLocation;
    },
    selectDistrict: (state, {payload}) => {
      state.district = payload.info.id;
      state.districtInfo = payload.info;
      state.buildings = payload.buildings;
      state.mapAssets = payload.mapAssets;
      state.building = undefined;
      state.inFloorCamera = undefined;
      state.floor = undefined;
      state.heatMap = {
        show: false,
        data: undefined
      };
    },
    setDistricts: (state, {payload}) => {
      state.districts = payload;
    },
    setZones: (state, {payload}) => {
      state.zones = payload;
    },
    setRoleDistricts: (state, {payload}) => {
      state.roleDistricts = payload;
    },
    setDistrictsData: (state, {payload}) => {
      state.districtsData = payload;
    },
    updateMapAssets: (state, {payload}) => {
      state.mapAssets = payload;
    },
    setLoadingFloors: (state, {payload}) => {
      state.isLoadingFloors = payload;
    },
    setInFloorCamera: (state, {payload}) => {
      state.inFloorCamera = state.inFloorCamera === payload ? null : payload;
    },
    setIsAddAssetModalOpened: (state, {payload}) => {
      state.isAddAssetModalOpened = payload.open;
      state.addAssetModalCoords = payload.coords;
    },
    setAddAssetFeatureEnabled: (state, {payload}) => {
      state.isAddAssetFeatureEnabled = payload.enabled;
      state.addAssetFlag = payload.add;
    },
    setWasteLocations: (state, {payload}) => {
      state.wasteLocations = payload;
    },
    setIsBuildingComparisonOpened: (state, {payload}) => {
      state.isBuildingComparisonOpened = payload;
    },
    setShowAlarms: (state, {payload}) => {
      state.showAlarms = payload;
    },
    setShowAirQuality: (state, {payload}) => {
      state.showAirQuality = payload;
    },
    setBuildingsInfoLoading: (state, {payload}) => {
      state.buildingsInfoLoading = payload;
    },
    setBuildingsInfo: (state, {payload}) => {
      state.buildingsInfo = payload;
    },
    setActiveBuildingInfoId: (state, {payload}) => {
      state.activeBuildingInfoId = payload;
    },
    setBuildingsConsumptionAlerts: (state, {payload}) => {
      state.buildingsConsumptionAlerts = payload;
    },
    setPlaySequenceAnimation: (state, {payload}) => {
      state.playSequenceAnimation = payload;
    }
  }
});

export const {
  buildingSelection,
  floorSelection,
  selectDistrict,
  setDistricts,
  setDistrictsData,
  updateMapAssets,
  setLoadingFloors,
  setInFloorCamera,
  setIsAddAssetModalOpened,
  setAddAssetFeatureEnabled,
  wasteLocationSelection,
  setWasteLocations,
  setIsBuildingComparisonOpened,
  setShowAlarms,
  setShowAirQuality,
  setBuildingsInfoLoading,
  setBuildingsInfo,
  setActiveBuildingInfoId,
  setBuildingsConsumptionAlerts,
  setZones,
  setRoleDistricts,
  setPlaySequenceAnimation
} = mapSlice.actions;

export default mapSlice.reducer;
