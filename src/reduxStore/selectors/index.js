import {createSelector} from '@reduxjs/toolkit';

export const selectThemeProperties = createSelector([(state) => state.styling], (styling) => styling.properties[styling.theme]);
export const selectThemeImages = createSelector([(state) => state.styling], (styling) => styling.images[styling.theme]);
