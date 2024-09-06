import React from 'react';
import {withHooks} from 'jest-react-hooks-shallow';
import {shallow} from 'enzyme';
import {act} from 'react-dom/test-utils';
import Profile from '..';
let resolve;
const profile = {info: {is_cms_user: 1, first_name: 'adel', last_name: 'chamas'}, countries: ['LB', 'AE']};
jest.mock('../../../../services/user', () => ({
  ...jest.requireActual('../../../../services/user'),
  getProfileInfo: () =>
    new Promise((res) => {
      resolve = res;
    })
}));

test('Active Profile Component', () => {
  withHooks(async () => {
    const click = jest.fn();
    let dom = shallow(<Profile active={true} click={click} />);
    dom.update();
    expect(dom.find('.profile')).toHaveLength(1);
    expect(dom).toMatchSnapshot();
    dom.find('.back').simulate('click');
    expect(click).toBeCalledTimes(1);
    expect(dom.find('Loader')).toHaveLength(1);
    expect(dom.find('Animate').prop('enter')).toBeTruthy();
    expect(dom.find('.content')).toHaveLength(0);
    await act(async () => resolve(profile));
    dom.update();
    expect(dom.find('Loader')).toHaveLength(0);
    expect(dom.find('.content')).toHaveLength(1);
    expect(dom.find('h3').text()).toBe(profile.info.first_name + ' ' + profile.info.last_name);
    expect(dom.find('button').at(1).text()).toBe('Change Password');
    expect(dom.find('.mt-4 p').text()).toBe('Administrator');
    expect(dom.find('Memo(EditProfile)').prop('countries')).toBe(profile.countries);
    expect(dom.find('Memo(EditProfile)').prop('profile')).toBe(profile.info);
    expect(dom.find('Animate').at(1).prop('enter')).toBeFalsy();
    expect(dom.find('EditPassword')).toHaveLength(1);
    await act(async () => {
      dom.find('button').at(1).simulate('click');
    });
    dom.update();
    expect(dom.find('Animate').at(1).prop('enter')).toBeTruthy();
    await act(async () => {
      dom.find('EditPassword').props().click();
    });
    dom.update();
    expect(dom.find('Animate').at(1).prop('enter')).toBeFalsy();
    jest.clearAllMocks();
  });
});
