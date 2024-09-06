import axios from 'axios';
import LocalStorageService from '../services/LocalStorage';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import {default as store} from '../reduxStore';
import {logoutActions} from '../reduxStore/actions';
import {successNotification} from '../components/Utils/Notifications';

const TokenService = LocalStorageService.getService();

const instance = axios.create({
  baseURL: process.env['REACT_APP_URL'],
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 50000
});
instance.interceptors.request.use((request) => {
  request.headers['Authorization'] = `${TokenService.getAccessToken()}`;
  return request;
});

const refreshAuthLogic = (failedRequest) => {
  let c = TokenService.getRefreshToken();
  return axios
    .get(process.env['REACT_APP_URL'] + `auth/refresh-token?refresh_token=${c.refresh_token}`)
    .then(({data}) => {
      TokenService.setToken(data);
      failedRequest.response.config.headers['Authorization'] = data.access_token;
      return Promise.resolve();
    })
    .catch((err) => {
      setTimeout(() => {
        successNotification('Session Expired!', 'warning');
      }, 3000);
      store.dispatch(logoutActions());
      return Promise.reject(err);
    });
};

createAuthRefreshInterceptor(instance, refreshAuthLogic);

export default instance;
