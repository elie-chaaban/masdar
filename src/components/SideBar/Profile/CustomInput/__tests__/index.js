import React from 'react';
import {shallow} from 'enzyme';
import CustomInput from '..';

test('Custom Input Component', () => {
  let dom = shallow(<CustomInput name="user" enabled={true} touched={false} />);
  expect(dom).toMatchSnapshot();
  expect(dom.find('.text-danger')).toHaveLength(0);
  expect(dom.find('p').text()).toBe('user');
  expect(dom.find('.col-6')).toHaveLength(1);
  expect(dom.find('.active')).toHaveLength(1);
  expect(dom.find('Field').prop('placeholder')).toBe('user');
  expect(dom.find('Field').prop('disabled')).toBeFalsy();
  expect(dom.find('Field').prop('type')).toBe('text');
  dom.setProps({title: 'userName', type: 'email', className: 'col-4', error: 'invalid user name', touched: true, enabled: false});
  expect(dom.find('.col-6')).toHaveLength(0);
  expect(dom.find('.col-4')).toHaveLength(1);
  expect(dom.find('.active')).toHaveLength(0);
  expect(dom.find('Field').prop('disabled')).toBeTruthy();
  expect(dom.find('p').text()).toBe('userName');
  expect(dom.find('Field').prop('placeholder')).toBe('userName');
  expect(dom.find('.text-danger')).toHaveLength(1);
  expect(dom.find('.text-danger').text()).toBe('invalid user name');
});
