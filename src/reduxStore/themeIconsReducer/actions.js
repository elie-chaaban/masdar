import {setOwnerTheme as setOwnerThemeAction, setOwnerThemeIcons as setOwnerThemeIconsAction} from './index';

export const setOwnerTheme =
  (name = null, themeIcons = []) =>
  (dispatch) => {
    dispatch(setOwnerThemeAction(name));
    const icons = themeIcons.reduce((obj, item) => Object.assign(obj, {[item.field]: item.file?.filePath}), {});
    dispatch(setOwnerThemeIconsAction(icons));
  };
