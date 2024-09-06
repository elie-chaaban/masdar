import React from 'react';
import {Field} from 'formik';
import PropTypes from 'prop-types';

const CountrySelect = ({name, enabled, countries, error, touched, onChange}) => {
  return (
    <div className="mt-2 col-6">
      <p>Country</p>
      <Field name={name}>
        {({
          field // { name, value, onChange, onBlur }
        }) => (
          <>
            <select
              disabled={!enabled}
              {...field}
              className={`select-country ${enabled ? 'active' : ''}`}
              onChange={(e) => {
                onChange(e.target.value);
                field.onChange(e);
              }}
            >
              <option value="">select country</option>
              {countries.map(({id, name}) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            {error && touched ? <div className="text-danger">{error}</div> : null}
          </>
        )}
      </Field>
    </div>
  );
};
CountrySelect.protoTypes = {
  name: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  countries: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.string.isRequired, name: PropTypes.string.isRequired})),
  error: PropTypes.string,
  touched: PropTypes.bool.isRequired
};
export default CountrySelect;
