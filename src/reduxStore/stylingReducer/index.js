import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  theme: 'default',
  properties: {
    default: {},
    dark: {}
  },
  tabletMode: false,
  mobileMode: false,
  images: {
    default: {
      logoUrl: null,
      headerImageUrl: null
    },
    dark: {
      logoUrl: null,
      headerImageUrl: null
    }
  }
};

export const stylingSlice = createSlice({
  name: 'styling',
  initialState,
  reducers: {
    setStylingTemplateProperties: (state, action) => {
      state.properties.default = action.payload;
    },
    setDarkStylingTemplateProperties: (state, action) => {
      state.properties.dark = action.payload;
    },
    setStylingTemplateImages: (state, action) => {
      const {logoUrl, headerImageUrl} = action.payload;
      state.images.default.logoUrl = logoUrl;
      state.images.default.headerImageUrl = headerImageUrl;
    },
    setDarkStylingTemplateImages: (state, action) => {
      const {logoUrl, headerImageUrl} = action.payload;
      state.images.dark.logoUrl = logoUrl;
      state.images.dark.headerImageUrl = headerImageUrl;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'default' ? 'dark' : 'default';
    },
    setTabletMode: (state, action) => {
      state.tabletMode = action.payload;
    },
    setMobileMode: (state, action) => {
      state.mobileMode = action.payload;
    }
  }
});

export const {
  setStylingTemplateProperties,
  setDarkStylingTemplateProperties,
  setStylingTemplateImages,
  setDarkStylingTemplateImages,
  toggleTheme,
  setTabletMode,
  setMobileMode
} = stylingSlice.actions;

export default stylingSlice.reducer;
