import React from 'react';
import {Field} from 'formik';
import PropTypes from 'prop-types';

const CustomInput = ({className = 'col-6', type = 'text', name, enabled, title = null, error, touched}) => (
  <div className={`mt-2 ${className}`}>
    <p>{title ? title : name}</p>
    <Field
      className={`form-control ${enabled ? 'active' : ''}`}
      type={type}
      placeholder={title ? title : name}
      name={name}
      disabled={!enabled}
    />
    {error && touched ? <div className="text-danger">{error}</div> : null}
  </div>
);

CustomInput.protoTypes = {
  name: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.bool.isRequired
};

export default CustomInput;
