import React from 'react';
import {Field} from 'formik';
import PropTypes from 'prop-types';

const CitySelect = ({name, enabled, cities, error, touched}) => {
  return (
    <div className="mt-2 col-6">
      <p>City</p>
      <Field name={name}>
        {({
          field // { name, value, onChange, onBlur }
        }) => (
          <>
            <select disabled={!enabled} {...field} className={`select-city ${enabled ? 'active' : ''}`}>
              <option value="">select city</option>
              {cities.map(({id, name}) => (
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
CitySelect.protoTypes = {
  name: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  cities: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.string.isRequired, name: PropTypes.string.isRequired})),
  error: PropTypes.string,
  touched: PropTypes.bool.isRequired
};
export default CitySelect;
