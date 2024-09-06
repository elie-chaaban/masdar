import {useRef, useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {colorPaletteById} from './colors';
import {spacing} from './spacing';
import {commonStyles} from './commonStyles';
import {Theme, themes} from './theme';

export const useTheme = () => {
  const theme = useRef<Theme>();
  const selectedThemeId: keyof typeof themes = useSelector((s: any) => s.styling.theme);

  useEffect(() => {
    theme.current = {
      id: selectedThemeId,
      colors: colorPaletteById(themes[selectedThemeId].colorPaletteId),
      spacing: spacing,
      commonStyles: commonStyles
    };
  }, [selectedThemeId]);

  return {
    getTheme: useCallback(() => theme.current, [])
  };
};

export * from './styles';
export * from './colors';
