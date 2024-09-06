import React from 'react';
import {shallow} from 'enzyme';
import SideBar from '..';
import {withHooks} from 'jest-react-hooks-shallow';
import {act} from 'react-dom/test-utils';
import {logoutUser} from '../../../services/auth';
jest.mock('../../../services/auth', () => ({
  ...jest.requireActual('../../../services/auth'),
  logoutUser: jest.fn()
}));
test('side Bar Component', () => {
  withHooks(async () => {
    const dom = shallow(<SideBar />);
    expect(dom).toMatchSnapshot();
    expect(dom.find('.hamburger').hasClass('is-active')).toBeTruthy();
    expect(dom.find('.nxn-left-sideBar').hasClass('is-active')).toBeTruthy();
    dom.find('Memo(MenuIcon)').forEach((icon) => {
      expect(icon.prop('isActive')).toBeFalsy();
    });
    dom.find('[type="logout"]').props().click();
    expect(logoutUser).toBeCalledTimes(1);
    expect(dom.find('Profile').prop('active')).toBeFalsy();
    expect(dom.find('DistrictSelect').prop('active')).toBeFalsy();
    expect(dom.find('Memo(Reports)').prop('active')).toBeFalsy();
    expect(dom.find('BuildingAdvisor').prop('active')).toBeFalsy();
    await act(async () => {
      dom.find('.hamburger').simulate('click');
    });
    dom.update();
    expect(dom.find('.hamburger').hasClass('is-active')).toBeFalsy();
    expect(dom.find('.nxn-left-sideBar').hasClass('is-active')).toBeFalsy();
    await act(async () => {
      dom.find('Memo(MenuIcon)').at(0).props().click('profile');
    });
    dom.update();
    expect(dom.find("[isActive='true']")).toHaveLength(1);
    expect(dom.find("[type='profile']").prop('isActive')).toBeTruthy();
    expect(dom.find('Profile').prop('active')).toBeTruthy();
    expect(dom.find('DistrictSelect').prop('active')).toBeFalsy();
    expect(dom.find('Memo(Reports)').prop('active')).toBeFalsy();
    expect(dom.find('BuildingAdvisor').prop('active')).toBeFalsy();
    await act(async () => {
      dom.find('Memo(MenuIcon)').at(0).props().click('district');
    });
    dom.update();
    expect(dom.find("[isActive='true']")).toHaveLength(1);
    expect(dom.find('Memo(MenuIcon)').at(0).prop('isActive')).toBeTruthy();
    expect(dom.find('Profile').prop('active')).toBeFalsy();
    expect(dom.find('DistrictSelect').prop('active')).toBeTruthy();
    expect(dom.find('Memo(Reports)').prop('active')).toBeFalsy();
    expect(dom.find('BuildingAdvisor').prop('active')).toBeFalsy();
    await act(async () => {
      dom.find('Memo(MenuIcon)').at(0).props().click('reports');
    });
    dom.update();
    expect(dom.find("[isActive='true']")).toHaveLength(1);
    expect(dom.find("[type='reports']").prop('isActive')).toBeTruthy();
    expect(dom.find('Profile').prop('active')).toBeFalsy();
    expect(dom.find('DistrictSelect').prop('active')).toBeFalsy();
    expect(dom.find('Memo(Reports)').prop('active')).toBeTruthy();
    expect(dom.find('BuildingAdvisor').prop('active')).toBeFalsy();
    await act(async () => {
      dom.find('Memo(MenuIcon)').at(0).props().click('buildingCost');
    });
    dom.update();
    expect(dom.find("[isActive='true']")).toHaveLength(1);
    expect(dom.find("[type='buildingCost']").prop('isActive')).toBeTruthy();
    expect(dom.find('Profile').prop('active')).toBeFalsy();
    expect(dom.find('DistrictSelect').prop('active')).toBeFalsy();
    expect(dom.find('Memo(Reports)').prop('active')).toBeFalsy();
    expect(dom.find('BuildingAdvisor').prop('active')).toBeTruthy();
  });
});
