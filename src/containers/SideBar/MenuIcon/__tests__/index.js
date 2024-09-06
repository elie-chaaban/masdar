import React from 'react';
import {shallow} from 'enzyme';
import MenuIcon from '..';

test('Menu Icons Component', () => {
  const click = jest.fn();
  const dom = shallow(<MenuIcon isActive={true} click={click} toolTip="district selection" />);
  expect(dom.find('#district')).toHaveLength(1);
  expect(dom.find('button').hasClass('active')).toBeTruthy();
  expect(dom.find('.tooltip-side').text()).toBe('district selection');
  dom.find('button').simulate('click');
  expect(click).toBeCalledTimes(1);
  expect(click).toBeCalledWith('district');
  dom.setProps({isActive: false, type: 'logout'});
  expect(dom.find('#district')).toHaveLength(0);
  expect(dom.find('[data-testid="logout"]')).toHaveLength(1);
  expect(dom.find('button').hasClass('active')).toBeFalsy();
  dom.setProps({isActive: false, type: 'buildingCost'});
  expect(dom.find('[data-testid="logout"]')).toHaveLength(0);
  expect(dom.find('[data-testid="buildingCost"]')).toHaveLength(1);
  dom.setProps({isActive: false, type: 'reports'});
  expect(dom.find('[data-testid="buildingCost"]')).toHaveLength(0);
  expect(dom.find('[data-testid="reports"]')).toHaveLength(1);
  dom.setProps({isActive: false, type: 'profile'});
  expect(dom.find('[data-testid="reports"]')).toHaveLength(0);
  expect(dom.find('[data-testid="profile"]')).toHaveLength(1);
});
