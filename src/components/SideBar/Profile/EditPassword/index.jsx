import React, {useState} from 'react';
import {Formik, Form, Field} from 'formik';
import passwordValidation from '../validations/password';
import {Col, Row} from 'react-bootstrap';
import {strengthColor, strengthIndicator} from './strength';
import {updatePassword} from '../../../../services/user';
import PropTypes from 'prop-types';
import {errorNotification, successNotification} from '../../../Utils/Notifications';

const EditPassword = ({click, profile}) => {
  const [indicator, setIndicator] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const checkPassStrength = (value) => {
    const count = strengthIndicator(value);
    setIndicator(strengthColor(count));
  };
  const updatePass = async (password) => {
    try {
      setLoading(true);
      await updatePassword(profile, password);
      click();
      successNotification('Password Updated Successfully!');
    } catch (error) {
      errorNotification(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Formik
      initialValues={{
        password: '',
        passwordConfirmation: ''
      }}
      validationSchema={passwordValidation}
      onSubmit={({password}) => {
        if (!loading) updatePass(password);
      }}
    >
      {({errors, touched, handleChange}) => {
        return (
          <Form className="password-form row">
            <div className="mt-4 col-6">
              <p>Password</p>
              <Field
                className="form-control"
                placeholder="password"
                name="password"
                type="password"
                onChange={(e) => {
                  handleChange(e);
                  checkPassStrength(e.target.value);
                }}
              />
              {errors.password && touched.password ? <div className="text-danger">{errors.password}</div> : null}
            </div>
            <div className=" mt-4  col-6 d-flex flex-column justify-content-center">
              <div className="password-strength">
                <p>Password strength</p>
                <div data-testid="indicator-bar" className={`bar ${indicator ? indicator.class : ''}`}></div>
                {indicator && <p data-testid="indicator-text">{indicator.label}</p>}
              </div>
            </div>
            <div className="mt-4 col-6">
              <p>Confirm Password</p>
              <Field className="form-control" placeholder="password Confirmation" name="passwordConfirmation" type="password" />
              {errors.passwordConfirmation && touched.passwordConfirmation ? (
                <div className="text-danger">{errors.passwordConfirmation}</div>
              ) : null}
            </div>
            <Col xs={12}>
              <Row>
                <Col xs={6}>
                  <button className="btn mt-3" type="submit">
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </Col>
              </Row>
            </Col>
          </Form>
        );
      }}
    </Formik>
  );
};
EditPassword.protoTypes = {
  click: PropTypes.func.isRequired
};
export default EditPassword;
