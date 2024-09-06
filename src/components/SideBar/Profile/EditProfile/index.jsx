import React, {useState, useEffect, useCallback} from 'react';
import {Formik, Form, Field} from 'formik';
import CountrySelect from '../CountrySelect';
import CitySelect from '../CitySelect';
import CustomInput from '../CustomInput';
import CountryCodeSelect from '../PhoneSelect';
import userEditSchema from '../validations/userEdit';
import {updateProfileInfo} from '../../../../services/user';
import {errorNotification, successNotification} from '../../../Utils/Notifications';

const EditProfile = ({countries, profile}) => {
  const {firstName, mobileNumber, city, address1 = '', address2 = '', email, gender} = profile;

  const cityId = city ? city?.id : null;
  const countryId = city ? city?.country?.id : null;
  const countryCode = city ? city?.country?.code : null;

  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countryCities, setCountryCities] = useState([]);
  useEffect(() => {
    if (countries && city && city.id) {
      const selectedCountry = countries.find((c) => c.id === city.country.id);
      setCountryCities(selectedCountry.cities);
    }
  }, [countries, city]);
  const onChangeCountry = useCallback(
    (countryId) => {
      const selectedCountry = countries.find((c) => c.id === countryId);
      if (selectedCountry) {
        setCountryCities(selectedCountry.cities);
      } else {
        setCountryCities([]);
      }
    },
    [countries]
  );
  const updateProfile = async (gender, mobileNumberCountryCode, mobileNumber, cityId, address1, address2) => {
    try {
      setLoading(true);
      await updateProfileInfo(profile, gender, mobileNumberCountryCode, mobileNumber, cityId, address1, address2);
      setEdit(false);
      successNotification('Profile Updated Successfully!');
    } catch (e) {
      errorNotification(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Formik
      initialValues={{
        userName: firstName,
        email: email,
        phone: mobileNumber,
        phoneCode: countryCode,
        country: countryId,
        city: cityId,
        address1: address1,
        address2: address2
      }}
      validationSchema={userEditSchema}
      onSubmit={({phone, phoneCode, country, city, address1, address2}) => {
        if (!loading) updateProfile(gender, phoneCode, phone, city, address1, address2);
      }}
    >
      {({errors, touched, resetForm}) => (
        <Form className="content row">
          <CustomInput name="userName" enabled={false} />
          <CustomInput name="email" type="email" enabled={false} />
          <div className="mt-2 col-12">
            <p>Phone</p>
          </div>
          <div className="col-6">
            <div className="row">
              <CountryCodeSelect name="phoneCode" enabled={edit} />
              <div className="col-9 pl-1">
                <Field
                  className={`form-control ${edit ? 'active' : ''}`}
                  type="number"
                  placeholder="phone number"
                  name="phone"
                  disabled={!edit}
                />
              </div>
              <div className="col-12">
                {((errors.phone && touched.phone) || (errors.phoneCode && touched.phoneCode)) && (
                  <div className="text-danger">{errors.phone || errors.phoneCode}</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-6" />
          <CountrySelect
            countries={countries}
            error={errors.country}
            touched={touched.country}
            name="country"
            enabled={edit}
            onChange={onChangeCountry}
          />
          <CitySelect cities={countryCities} error={errors.city} touched={touched.city} name="city" enabled={edit} />
          <CustomInput name="address1" error={errors.address1} touched={touched.address1} title="address 1" enabled={edit} />
          <CustomInput name="address2" title="address 2" enabled={edit} />
          <div className="col-12 mt-3">
            {edit && (
              <button className="btn mr-2" type="submit">
                {loading ? 'Saving...' : 'Save'}
              </button>
            )}
            <button
              className="btn"
              type="button"
              onClick={() => {
                if (edit) resetForm();
                setEdit(!edit);
              }}
            >
              {edit ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(EditProfile);
