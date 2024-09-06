import React from 'react';
import {createRoot} from 'react-dom/client';
import {Router, Outlet} from 'react-location';
import {Provider} from 'react-redux';
import ReactNotification from 'react-notifications-component';
import {default as store} from './reduxStore';
import * as serviceWorker from './serviceWorker';
import {location, routes} from './routes';
import {AuthProvider} from '@asgardeo/auth-react';

import './assets/animation.css';
import 'react-notifications-component/dist/theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import './media-query.scss';

const root = createRoot(document.getElementById('root'));
root.render(
  <AuthProvider
    config={{
      signInRedirectURL: process.env['REACT_APP_AZGARDEO_SIGN_IN_REDIRECT_URL'],
      signOutRedirectURL: process.env['REACT_APP_AZGARDEO_SIGN_OUT_REDIRECT_URL'],
      clientID: process.env['REACT_APP_AZGARDEO_CLIENT_ID'],
      baseUrl: process.env['REACT_APP_AZGARDEO_BASE_URL'],
      scope: ['openid', 'profile', 'email']
    }}
  >
    <Router routes={routes} location={location}>
      <Provider store={store}>
        <ReactNotification />
        <Outlet />
      </Provider>
    </Router>
  </AuthProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
