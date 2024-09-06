import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  login: false,
  checkedUser: false,
  access: undefined,
  isExpireModalOpen: false,
  chartConfigurations: []
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserAccess: (state, action) => {
      const {login, access} = action.payload;
      state.login = login;
      state.access = access;
      state.checkedUser = true;
    },
    toggleExpireModal: (state) => {
      state.isExpireModalOpen = !state.isExpireModalOpen;
    },
    setModulesAccess: (state, action) => {
      state.access.modules = action.payload;
    },
    setChartConfigurations: (state, action) => {
      state.chartConfigurations = action.payload;
    }
  }
});

export const {setUserAccess, toggleExpireModal, setModulesAccess, setChartConfigurations} = userSlice.actions;

export default userSlice.reducer;
