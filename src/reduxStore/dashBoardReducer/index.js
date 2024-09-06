import moment from 'moment-mini';
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  insight: null,
  slider: null,
  showSlider: false,
  isOpenInsightSlider: false,
  isOpenModal: false,
  qrCode: null,
  actionSlider: {
    open: false,
    data: null,
    module: null,
    section: null
  },
  dateFilter: {
    filter: 'year',
    startDate: `${moment().subtract(1, 'days').subtract(11, 'months').format('YYYY-MM')}-01`,
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD')
  },
  streamCameras: [],
  credentials_3dEye: undefined,
  iFrames: undefined,
  searchSliderActive: false,
  isVendorChartsOpened: false,
  isIntersectionDataSliderOpened: false,
  insightType: 'energy',
  currentDashboardProps: {
    sidebar: {selectedId: 'home'},
    header: {titleId: 'home'},
    periodSelection: {showBackButton: false, selectedOptionId: 'year'}
  },
  selectedModule: 'sustainability',
  selectedTrendLineOrBreakdown: '',
  districtPvProductionChart: null,
  energyRequest: null,
  waterRequest: null,
  isOpenLanding: true,
  isAirQualityDrillDownOpened: false
};

export const dashBoardSlice = createSlice({
  name: 'dashBoard',
  initialState,
  reducers: {
    setInsight: (state, {payload}) => {
      state.insight = payload;
    },
    toggleInsight: (state, {payload}) => {
      if (state.insight !== payload) {
        state.insight = payload;
      } else {
        state.insight = null;
        state.showSlider = false;
        state.actionSlider = {
          open: false,
          data: null,
          module: null,
          section: null
        };
      }
      state.isOpenInsightSlider = false;
    },
    toggleSlider: (state) => {
      state.showSlider = !state.showSlider;
    },
    setOpenLanding: (state, action) => {
      if (state.isOpenLanding === action.payload) return;
      state.isOpenLanding = action.payload;
    },
    store3dEyeCredentials: (state, action) => {
      state.credentials_3dEye = action.payload;
    },
    toggleInsightSlider: (state) => {
      state.isOpenInsightSlider = !state.isOpenInsightSlider;
    },
    setInsightSliderState: (state, action) => {
      state.isOpenInsightSlider = action.payload;
    },
    setDateFilter: (state, action) => {
      state.dateFilter = action.payload;
    },
    toggleActionSlider: (state, action) => {
      state.actionSlider = {
        open: !state.actionSlider.open,
        data: state.actionSlider.open ? null : action.payload.data,
        module: state.actionSlider.open ? null : action.payload.module,
        section: state.actionSlider.open ? null : action.payload.section
      };
    },
    setShowSlider: (state, action) => {
      state.showSlider = action.payload;
    },
    toggleModal: (state, action) => {
      state.isOpenModal = action.payload.isOpen;
      state.qrCode = action.payload.qrCode;
    },
    setSearchSliderActive: (state, action) => {
      state.searchSliderActive = action.payload;
    },
    setIsIntersectionDataSliderOpened: (state, action) => {
      state.isIntersectionDataSliderOpened = action.payload;
    },
    updateStreamCameras: (state, action) => {
      state.streamCameras = action.payload;
    },
    setIFrames: (state, action) => {
      state.iFrames = action.payload;
    },
    setInsightType: (state, action) => {
      state.insightType = action.payload;
    },
    setSelectedModule: (state, action) => {
      state.selectedModule = action.payload;
    },
    setCurrentDashboardProps: (state, action) => {
      state.currentDashboardProps = action.payload;
    },
    setSelectedTrendLineOrBreakdown: (state, action) => {
      state.selectedTrendLineOrBreakdown = action.payload;
    },
    setEnergyRequest: (state, action) => {
      state.energyRequest = action.payload;
    },
    setWaterRequest: (state, action) => {
      state.waterRequest = action.payload;
    },
    setDistrictPvProductionChart: (state, action) => {
      state.districtPvProductionChart = action.payload;
    },
    setIsAirQualityDrillDownOpened: (state, action) => {
      state.isAirQualityDrillDownOpened = action.payload;
    }
  }
});

export const {
  setSelectedModule,
  setInsight,
  toggleInsight,
  toggleSlider,
  store3dEyeCredentials,
  toggleInsightSlider,
  setInsightSliderState,
  setDateFilter,
  toggleActionSlider,
  setShowSlider,
  toggleModal,
  setSearchSliderActive,
  setIsIntersectionDataSliderOpened,
  updateStreamCameras,
  setIFrames,
  setInsightType,
  setCurrentDashboardProps,
  setSelectedTrendLineOrBreakdown,
  setEnergyRequest,
  setWaterRequest,
  setOpenLanding,
  setDistrictPvProductionChart,
  setIsAirQualityDrillDownOpened
} = dashBoardSlice.actions;

export default dashBoardSlice.reducer;
