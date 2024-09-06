import React, {useMemo} from 'react';
import {getCountries, getCountryCallingCode} from 'react-phone-number-input/input';
import {Field} from 'formik';

const CountryCodeSelect = ({name, enabled}) => {
  const countryCode = useMemo(() => {
    let codes = [];
    getCountries().forEach((country) => {
      codes.push(getCountryCallingCode(country));
    });
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    return codes.filter(onlyUnique);
  }, []);
  return (
    <div className=" col-3 pr-1">
      <Field name={name}>
        {({
          field // { name, value, onChange, onBlur }
        }) => (
          <select {...field} className={`select-country ${enabled ? 'active' : ''}`} disabled={!enabled}>
            <option value="">code</option>
            {countryCode.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        )}
      </Field>
    </div>
  );
};
export default CountryCodeSelect;
