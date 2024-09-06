import dashboardReducer from '../dashBoardReducer';
import userReducer from '../userReducer';
import mapReducer from '../mapReducer';
import multiWindowReducer from '../multiWindowReducer';
import stylingReducer from '../stylingReducer';
import cachingReducer from '../cachingReducer';
import themeIconsReducer from '../themeIconsReducer';

export const reducers = {
  user: userReducer,
  dashboard: dashboardReducer,
  map: mapReducer,
  multiWindow: multiWindowReducer,
  styling: stylingReducer,
  caching: cachingReducer,
  themeIcons: themeIconsReducer
};
