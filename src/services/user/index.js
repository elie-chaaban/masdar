import axios from 'axios';
import apiInstance from '../../api/authenticatedApi';
import LocalStorageService from '../LocalStorage';
const TokenService = LocalStorageService.getService();

const getProfileInfo = async () => {
  try {
    const tokenSet = await TokenService.getTokenSet();
    const userInfo = JSON.parse(Buffer.from(tokenSet.id_token.split('.')[1], 'base64').toString());
    const {data: user} = await apiInstance.get(`users/user-by-email?Email=${userInfo.email}`);
    const {data: countriesList} = await apiInstance.get('users/country');
    return {info: user, countries: countriesList.items};
  } catch (error) {
    throw error;
  }
};

const updateProfileInfo = async (profile, gender, mobileNumberCountryCode, mobileNumber, cityId, address1, address2) => {
  try {
    const user = {...profile};
    delete user.userRoles;
    delete user.city;
    await apiInstance.put(`users/user/${user.id}`, {
      ...user,
      gender,
      mobileNumberCountryCode: `${mobileNumberCountryCode}`,
      mobileNumber: `${mobileNumber}`,
      address1,
      address2,
      cityId
    });
  } catch (error) {
    throw error;
  }
};
const updatePassword = async (userData, password) => {
  const user = {...userData};
  delete user.userRoles;
  delete user.city;
  try {
    await apiInstance.post(`${process.env['REACT_APP_AUTH_ENDPOINT']}auth/updateuserpassword`, {
      email: user.email,
      password
    });

    await apiInstance.put(`users/user/${user.id}`, {
      ...user,
      password
    });
  } catch (error) {
    throw error;
  }
};
const getIFramesUrls = async (districtId, buildingId) => {
  try {
    const {data: portals} = await apiInstance.get(
      `districts/district-portals-by-district-or-building-id?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`
    );
    return portals;
  } catch (error) {
    throw error;
  }
};

const getIsDistrictAggregating = async (districtId, roleId) => {
  try {
    const result = await apiInstance.get(
      `/users/management/is-district-aggregating-by-district-id-and-role-id?districtId=${districtId}&roleId=${roleId}`
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export {getProfileInfo, updatePassword, updateProfileInfo, getIFramesUrls, getIsDistrictAggregating};
