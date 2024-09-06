import React, {useState, Suspense, useEffect} from 'react';
import {Formik, Form} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {authenticateUser, toggleExpireModal} from '../../reduxStore/actions';
import {LoaderFull} from '../../components/Utils';
import {errorNotification} from '../../components/Utils/Notifications';
import {useAuthContext} from '@asgardeo/auth-react';
import {isMobile} from 'react-device-detect';

import './style.scss';

const Login = () => {
  const {signIn} = useAuthContext();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {isExpireModalOpen} = useSelector((s) => s.user);

  const login = async () => {
    try {
      setLoading(true);
      await signIn();
      dispatch(authenticateUser());
    } catch (error) {
      console.log(error);
      errorNotification(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isExpireModalOpen) {
      var timeout = setTimeout(() => {
        console.log('run');
        dispatch(toggleExpireModal());
      }, 3000);
    }
    return () => {
      if (isExpireModalOpen) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Suspense fallback={<LoaderFull />}>
      <Formik initialValues={{}} onSubmit={() => login()}>
        {({errors, touched}) => (
          <Form className="login-form shadow-lg ">
            {/* <img src={logo} alt="logo" className="img-fluid d-block mx-auto logo" />   */}
            <button
              disabled={loading}
              className="btn px-5 text-white d-block mx-auto login-btn"
              name="Login"
              type="submit"
              style={isMobile ? {fontSize: 20} : {}}
            >
              {loading ? 'Logging In..' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
    </Suspense>
  );
};
export default Login;
