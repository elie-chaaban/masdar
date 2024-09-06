import axios from 'axios';
import LocalStorageService from '../services/LocalStorage';
import {successNotification} from '../components/Utils/Notifications';
import {logoutActions} from '../reduxStore/actions';
import {default as store} from '../reduxStore';
import axiosRetry from 'axios-retry';

const TokenService = LocalStorageService.getService();

const instance = axios.create({
  baseURL: 'https://api.masdarcityccc.com',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 240000
});

axiosRetry(instance, {
  retries: 5, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000; // time interval between retries
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return !error || !error?.response || error.response.status === 504 || error.response.status === 502 || error.response.status === 499;
  }
});

axiosRetry(instance, {
  retries: 2, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry 401 attempt: ${retryCount}`);
    return retryCount * 1000; // time interval between retries
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return !error || !error?.response || error.response.status === 401;
  }
});

instance.interceptors.request.use((request) => {
  request.headers['Authorization'] = `Bearer ${TokenService.getAccessToken()}`;
  request.headers['UserId'] = TokenService.getUserId();
  request.timeout = 240000;
  return request;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.response) {
      if (error.response.status === 408 || error.response.status === 502 || error.response.status === 504) {
        successNotification('API Request Timed Out', 'warning');
      }
      if (error.response.status === 401) {
        successNotification('Session Expired!', 'warning');
        store.dispatch(logoutActions());
      }
    }
  }
);

export default instance;
