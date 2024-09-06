import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  icons: []
};

export const themeIconsSlice = createSlice({
  name: 'themeIcons',
  initialState,
  reducers: {
    setOwnerTheme: (state, action) => {
      state.name = action.payload;
    },
    setOwnerThemeIcons: (state, action) => {
      state.icons = action.payload;
    }
  }
});

export const {setOwnerThemeIcons, setOwnerTheme} = themeIconsSlice.actions;

export default themeIconsSlice.reducer;
