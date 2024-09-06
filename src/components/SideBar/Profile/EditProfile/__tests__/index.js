import React from 'react';
import {getCountryCallingCode} from 'react-phone-number-input/input';
import {updateProfileInfo} from '../../../../../services/user';
import EditProfile from '..';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';
import {errorNotification, successNotification} from '../../../../Utils/Notifications';

jest.mock('../../../../Utils/Notifications', () => ({
  errorNotification: jest.fn(),
  successNotification: jest.fn()
}));

let resolve, reject;
jest.mock('react-phone-number-input/input', () => ({
  ...jest.requireActual('react-phone-number-input/input'),
  getCountries: () => ['LB', 'AE']
}));
jest.mock('../../../../../services/user', () => ({
  ...jest.mock('../../../../../services/user'),
  updateProfileInfo: jest.fn(
    () =>
      new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      })
  )
}));
const profile = {
  firstName: 'adel96',
  mobileNumber: 9352,
  mobileNumberCountryCode: '961',
  address1: 'edde',
  gender: 'male',
  address2: '',
  email: 'adel@gmail.com',
  city: {id: 'cityId1', name: 'Dubai', country: {id: 'countryId1', code: '961', cities: [{id: 'cityId1', name: 'Beirut'}]}}
};
const countries = [
  {id: 'countryId1', name: 'Lebanon', code: '961', cities: [{id: 'cityId1', name: 'Beirut'}]},
  {id: 'countryId2', name: 'United Arab Emirates', code: '971', cities: [{id: 'cityId2', name: 'Dubai'}]}
];

describe('Edit Profile Component', () => {
  let dom;
  beforeEach(async () => {
    await act(async () => {
      dom = mount(<EditProfile profile={profile} countries={countries} />);
    });
  });
  afterEach(() => {
    dom.unmount();
    jest.clearAllMocks();
  });
  it('should match snapshot', () => {
    expect(dom).toMatchSnapshot();
  });
  it('should all input disabled by default and have passed props value', () => {
    expect(dom.find('input.active')).toHaveLength(0);
    expect(dom.find('select.active')).toHaveLength(0);
    expect(dom.find('button')).toHaveLength(1);
    expect(dom.find('button').text()).toBe('Edit');
    expect(dom.find('.text-danger')).toHaveLength(0);
    expect(dom.find('input[name="userName"]').prop('disabled')).toBeTruthy();
    expect(dom.find('input[name="email"]').prop('disabled')).toBeTruthy();
    expect(dom.find('select[name="phoneCode"]').prop('disabled')).toBeTruthy();
    expect(dom.find('input[name="phone"]').prop('disabled')).toBeTruthy();
    expect(dom.find('select[name="country"]').prop('disabled')).toBeTruthy();
    expect(dom.find('select[name="city"]').prop('disabled')).toBeTruthy();
    expect(dom.find('input[name="address1"]').prop('disabled')).toBeTruthy();
    expect(dom.find('input[name="address2"]').prop('disabled')).toBeTruthy();

    expect(dom.find('input[name="userName"]').prop('value')).toBe('adel96');
    expect(dom.find('input[name="email"]').prop('value')).toBe('adel@gmail.com');
    expect(dom.find('select[name="phoneCode"]').prop('value')).toBe('961');
    expect(dom.find('input[name="phone"]').prop('value')).toBe(9352);
    expect(dom.find('select[name="country"]').prop('value')).toBe('countryId1');
    expect(dom.find('select[name="city"]').prop('value')).toBe('cityId1');
    expect(dom.find('input[name="address1"]').prop('value')).toBe('edde');
    expect(dom.find('input[name="address2"]').prop('value')).toBe('');
  });
  test('Phone code select input', () => {
    const options = dom.find('select[name="phoneCode"]').find('option');
    expect(options).toHaveLength(3);
    expect(options.at(0).prop('value')).toBe('');
    expect(options.at(1).text()).toBe('' + getCountryCallingCode('LB'));
    expect(options.at(0).text()).toBe('code');
    expect(options.at(1).prop('value')).toBe(getCountryCallingCode('LB'));
    expect(options.at(2).text()).toBe('' + getCountryCallingCode('AE'));
    expect(options.at(2).prop('value')).toBe(getCountryCallingCode('AE'));
  });
  test('Country select input', () => {
    const options = dom.find('select[name="country"]').find('option');
    expect(options).toHaveLength(3);
    expect(options.at(0).text()).toBe('select country');
    expect(options.at(0).prop('value')).toBe('');
    expect(options.at(1).text()).toBe('Lebanon');
    expect(options.at(1).prop('value')).toBe('countryId1');
    expect(options.at(2).text()).toBe('United Arab Emirates');
    expect(options.at(2).prop('value')).toBe('countryId2');
  });
  test('City select input', () => {
    const options = dom.find('select[name="city"]').find('option');
    expect(options).toHaveLength(1);
    expect(options.at(0).text()).toBe('select city');
    expect(options.at(0).prop('value')).toBe('');
  });
  it('should enable all inputs on edit button click', async () => {
    await act(async () => {
      dom.find('button').simulate('click');
    });
    dom.update();
    expect(dom.find('button')).toHaveLength(2);
    expect(dom.find('button').at(0).text()).toBe('Save');
    expect(dom.find('button').at(1).text()).toBe('Cancel');
    expect(dom.find('input.active')).toHaveLength(3);
    expect(dom.find('select.active')).toHaveLength(3);
    expect(dom.find('input[name="userName"]').prop('disabled')).toBeTruthy();
    expect(dom.find('input[name="email"]').prop('disabled')).toBeTruthy();
    expect(dom.find('select[name="phoneCode"]').prop('disabled')).toBeFalsy();
    expect(dom.find('input[name="phone"]').prop('disabled')).toBeFalsy();
    expect(dom.find('select[name="country"]').prop('disabled')).toBeFalsy();
    expect(dom.find('select[name="city"]').prop('disabled')).toBeFalsy();
    expect(dom.find('input[name="address1"]').prop('disabled')).toBeFalsy();
    expect(dom.find('input[name="address2"]').prop('disabled')).toBeFalsy();
  });
  it('should validate required input fields', async () => {
    await act(async () => {
      await dom.find('button').simulate('click');
      await dom.find('select[name="country"]').simulate('change', {target: {value: '', name: 'country'}});
      await dom.find('input[name="phone"]').simulate('change', {target: {value: '', name: 'phone'}});
      await dom.find('select[name="city"]').simulate('change', {target: {value: '', name: 'city'}});
      await dom.find('input[name="address1"]').simulate('change', {target: {value: '', name: 'address1'}});
      dom.find('button').at(0).simulate('submit');
    });
    dom.update();
    expect(dom.find('select[name="country"]').prop('value')).toBe('');
    expect(dom.find('.text-danger')).toHaveLength(4);
    dom.find('.text-danger').forEach((text) => {
      expect(text.text()).toBe('required');
    });
    await act(async () => {
      await dom.find('input[name="phone"]').simulate('change', {target: {value: 123, name: 'phone'}});
      await dom.find('select[name="phoneCode"]').simulate('change', {target: {value: '', name: 'phoneCode'}});
      dom.find('button').at(0).simulate('submit');
    });
    dom.update();
    expect(dom.find('.text-danger')).toHaveLength(4);
  });
  test('form submit', async () => {
    await act(async () => {
      await dom.find('button').simulate('click');
      await dom.find('select[name="country"]').simulate('change', {target: {value: 'countryId1', name: 'country'}});
      await dom.find('input[name="phone"]').simulate('change', {target: {value: 7629, name: 'phone'}});
      await dom.find('select[name="city"]').simulate('change', {target: {value: 'cityId1', name: 'city'}});
      await dom.find('input[name="address1"]').simulate('change', {target: {value: 'port', name: 'address1'}});
      dom.find('button').at(0).simulate('submit');
    });
    dom.update();
    expect(dom.find('button').at(0).text()).toBe('Saving...');
    await act(async () => {
      resolve();
    });
    dom.update();
    expect(dom.find('button')).toHaveLength(1);
    expect(dom.find('button').text()).toBe('Edit');
    expect(successNotification).toBeCalledTimes(1);
    expect(successNotification).toBeCalledWith('Profile Updated Successfully!');
    expect(errorNotification).toBeCalledTimes(0);
    expect(updateProfileInfo).toBeCalledTimes(1);
    expect(updateProfileInfo).toBeCalledWith(expect.any(Object), 'male', '961', 7629, 'cityId1', 'port', '');
  });
  test('error on form submit ', async () => {
    await act(async () => {
      await dom.find('button').simulate('click');
      await dom.find('select[name="country"]').simulate('change', {target: {value: 'countryId1', name: 'country'}});
      await dom.find('input[name="phone"]').simulate('change', {target: {value: 7629, name: 'phone'}});
      await dom.find('select[name="city"]').simulate('change', {target: {value: 'cityId1', name: 'city'}});
      await dom.find('input[name="address1"]').simulate('change', {target: {value: 'port', name: 'address1'}});
      dom.find('button').at(0).simulate('submit');
    });
    await act(async () => {
      reject({response: {status: 500}});
    });
    expect(errorNotification).toBeCalledTimes(1);
    expect(errorNotification).toBeCalledWith({response: {status: 500}});
    expect(successNotification).toBeCalledTimes(0);
    expect(dom.find('button')).toHaveLength(2);
    expect(dom.find('button').at(0).text()).toBe('Save');
  });
  test('reset form on cancellation', async () => {
    await act(async () => {
      await dom.find('button').simulate('click');
      await dom.find('select[name="country"]').simulate('change', {target: {value: 'countryId1', name: 'country'}});
      await dom.find('input[name="phone"]').simulate('change', {target: {value: 7629, name: 'phone'}});
      await dom.find('select[name="city"]').simulate('change', {target: {value: 'cityId1', name: 'city'}});
      await dom.find('input[name="address1"]').simulate('change', {target: {value: 'port', name: 'address1'}});
    });
    dom.update();
    expect(dom.find('select[name="country"]').prop('value')).toBe('countryId1');
    expect(dom.find('input[name="phone"]').prop('value')).toBe(7629);
    expect(dom.find('select[name="city"]').prop('value')).toBe('cityId1');
    expect(dom.find('input[name="address1"]').prop('value')).toBe('port');
    await act(async () => {
      dom.find('button').at(1).simulate('click');
    });
    dom.update();
    expect(dom.find('select[name="phoneCode"]').prop('disabled')).toBeTruthy();
    expect(dom.find('input[name="phone"]').prop('disabled')).toBeTruthy();
    expect(dom.find('select[name="country"]').prop('disabled')).toBeTruthy();
    expect(dom.find('select[name="city"]').prop('disabled')).toBeTruthy();
    expect(dom.find('input[name="address1"]').prop('disabled')).toBeTruthy();
    expect(dom.find('input[name="address2"]').prop('disabled')).toBeTruthy();
    expect(dom.find('select[name="country"]').prop('value')).toBe('countryId1');
    expect(dom.find('input[name="phone"]').prop('value')).toBe(9352);
    expect(dom.find('select[name="city"]').prop('value')).toBe('cityId1');
    expect(dom.find('input[name="address1"]').prop('value')).toBe('edde');
    expect(dom.find('button')).toHaveLength(1);
    expect(dom.find('button').text()).toBe('Edit');
  });
});
