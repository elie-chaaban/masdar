import React, {useEffect} from 'react';
import {LoaderFull} from '../components/Utils';
import {useDispatch} from 'react-redux';
import {saveLoggedInUser} from '../services/auth';
import {authenticateUser} from '../reduxStore/actions';
import Login from '../containers/Login';
import {DashboardContainer} from '../containers/Dashboard/DashboardContainer';
import {ReactLocation, useNavigate, useMatch} from 'react-location';
import LocalStorageService from '../services/LocalStorage';
import {useAuthContext} from '@asgardeo/auth-react';
const TokenService = LocalStorageService.getService();

const HomeRoute = () => {
  const {state, getIDToken, getAccessToken, getBasicUserInfo} = useAuthContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = TokenService.isLoggedIn();

  useEffect(() => {
    if (state.isAuthenticated) {
      const preloadEsp = () => {
        const popup = window.open('https://esp.masdarcityccc.com', '_blank', 'width=10,height=10,left=0,top=0');
        if (popup) {
          setTimeout(() => popup.close(), 3000);
        }
      };
      const saveTokenData = async () => {
        const idToken = await getIDToken();
        const accessToken = await getAccessToken();
        const basicUserInfo = await getBasicUserInfo();
        const userInfo = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
        const tokenSet = {
          access_token: accessToken,
          refresh_token: '',
          scope: 'email openid profile',
          id_token: idToken,
          token_type: 'bearer',
          expires_at: userInfo.exp,
          email: basicUserInfo.email || ''
        };
        if (idToken && accessToken) {
          await saveLoggedInUser(tokenSet);
          dispatch(authenticateUser());
          navigate({to: '/', replace: true});
        }
      };
      preloadEsp();
      saveTokenData();
    }
  }, [state, getIDToken, navigate, getAccessToken, getBasicUserInfo, dispatch]);

  return state.isAuthenticated && isLoggedIn ? <DashboardContainer /> : <Login />;
};

const LoginRoute = () => {
  const {state} = useAuthContext();
  return state?.isAuthenticated ? <DashboardContainer /> : <Login />;
};

const LogoutRoute = () => {
  const navigate = useNavigate();
  const {signOut} = useAuthContext();
  useEffect(() => {
    const logout = async () => {
      await TokenService.clearToken();
      await signOut(() => {
        navigate({to: '/', replace: true});
      });
    };
    logout();
  }, [navigate, signOut]);

  return <Login />;
};

const IBMSLogoutRoute = () => {
  useEffect(() => {
    const logout = async () => {
      await TokenService.clearToken();
      const popup = window.open(
        'https://api.asgardeo.io/t/zaintechmasdar/samlsso?spEntityID=https://ibms.masdarcityccc.com:443/saml/&slo=true',
        '_blank',
        'width=600,height=400'
      );
      if (popup) {
        setTimeout(() => {
          popup.close();
          window.location.href = 'https://ibms.masdarcityccc.com/logout';
        }, 5 * 1000);
      } else {
        alert('Popup was blocked by the browser.');
      }
    };
    logout();
  }, []);

  return <div></div>;
};

export const routes = [
  {
    path: '/',
    element: <HomeRoute />
  },
  {
    path: '/login',
    element: <LoginRoute />,
    loader: async ({search}) => {
      const token = search.token;
      return {token};
    }
  },
  {
    path: '/logout',
    element: <LogoutRoute />
  },
  {
    path: '/ibms/logout',
    element: <IBMSLogoutRoute />
  },
  {
    path: '*',
    element: () => import('../containers/404Page').then((module) => <module.default />)
  }
];

export const location = new ReactLocation();
