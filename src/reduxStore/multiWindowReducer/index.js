import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isMultiWindowModalOpened: false,
  isWindowNumberModalOpened: false,
  activeWindows: [],
  multiWindowModalMode: 'normal',
  multiWindowConfig: null,
  dynamicContentType: null,
  dynamicContentTabKey: null,
  openAssetAnalysis: null,
  activeWindow: null
};

export const multiWindowSlice = createSlice({
  name: 'multiWindow',
  initialState,
  reducers: {
    toggleMultiWindowModal: (state, action) => {
      state.isMultiWindowModalOpened = !state.isMultiWindowModalOpened;
      state.multiWindowModalMode = action.payload;
    },
    setActiveWindows: (state, action) => {
      state.activeWindows = action.payload;
    },
    setActiveWindow: (state, action) => {
      state.activeWindow = action.payload;
    },
    setMultiWindowConfig: (state, action) => {
      state.multiWindowConfig = action.payload;
    },
    setDynamicContentType: (state, action) => {
      state.dynamicContentType = action.payload.contentType;
      state.dynamicContentTabKey = action.payload.contentTabKey;
      state.openAssetAnalysis = action.payload.openAssetAnalysis;
    },
    showHideWindowNumberModal: (state, action) => {
      state.isWindowNumberModalOpened = action.payload;
    },
    setOpenAssetAnalysis: (state, action) => {
      state.openAssetAnalysis = action.payload;
    }
  }
});

export const {
  toggleMultiWindowModal,
  setActiveWindows,
  setActiveWindow,
  setMultiWindowConfig,
  setDynamicContentType,
  showHideWindowNumberModal,
  setOpenAssetAnalysis
} = multiWindowSlice.actions;

export default multiWindowSlice.reducer;
