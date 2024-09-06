import {ColorPalette, ValidColorPalettes} from './colors';
import {Spacing} from './spacing';
import {CommonStyles} from './commonStyles';

export const themes = {
  default: {
    colorPaletteId: 'default' as ValidColorPalettes
  }
};

export interface Theme {
  id: string;
  spacing: Spacing;
  colors: ColorPalette;
  commonStyles: CommonStyles;
}
