import {Styles} from '../types';
import {colorPaletteById} from './colors';
import {spacing} from './spacing';
import {commonStyles} from './commonStyles';
import {Theme} from './theme';
// @ts-ignore
import store from '../reduxStore';

export const createStyles = (styling: (theme: Theme) => Styles) => {
  const selectedThemeId = store.getState().styling.theme;
  const colors = colorPaletteById(selectedThemeId);

  const theme: Theme = {
    id: 'default',
    colors: colors,
    spacing: spacing,
    commonStyles: commonStyles
  };
  return styling(theme);
};
