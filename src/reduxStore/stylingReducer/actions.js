import {
  setStylingTemplateProperties as setStylingTemplatePropertiesAction,
  setDarkStylingTemplateProperties as setDarkStylingTemplatePropertiesAction,
  setStylingTemplateImages as setStylingTemplateImagesAction,
  setDarkStylingTemplateImages as setDarkStylingTemplateImagesAction,
  toggleTheme as toggleThemeAction,
  setTabletMode as setTabletModeAction,
  setMobileMode as setMobileModeAction
} from './index';

export const setStylingTemplateProperties =
  (properties = [], logoUrl = null, headerImageUrl = null) =>
  (dispatch) => {
    dispatch(setStylingTemplateImagesAction({logoUrl, headerImageUrl}));
    properties = properties.reduce((obj, item) => Object.assign(obj, {[item.field]: item.value}), {});
    let stylingProperties = {};
    Object.keys(properties).forEach(function (property) {
      stylingProperties[property] = JSON.parse(properties[property]);
    });
    dispatch(setStylingTemplatePropertiesAction(stylingProperties));
  };

export const setDarkStylingTemplateProperties =
  (properties = [], logoUrl = null, headerImageUrl = null) =>
  (dispatch) => {
    dispatch(setDarkStylingTemplateImagesAction({logoUrl, headerImageUrl}));
    properties = properties.reduce((obj, item) => Object.assign(obj, {[item.field]: item.value}), {});
    let stylingProperties = {};
    Object.keys(properties).forEach(function (property) {
      stylingProperties[property] = JSON.parse(properties[property]);
    });
    dispatch(setDarkStylingTemplatePropertiesAction(stylingProperties));
  };

export const toggleTheme = () => (dispatch) => {
  dispatch(toggleThemeAction());
};

export const setTabletMode = (payload) => (dispatch) => {
  dispatch(setTabletModeAction(payload));
};

export const setMobileMode = (payload) => (dispatch) => {
  dispatch(setMobileModeAction(payload));
};
