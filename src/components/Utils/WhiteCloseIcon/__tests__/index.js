import React from 'react';
import {shallow} from 'enzyme';
import ExpandableIcon from '..';

describe('Expandable icon', () => {
  const click = jest.fn();
  test('component work flow', () => {
    const dom = shallow(<ExpandableIcon onClick={click} active={false} />);
    expect(dom).toMatchSnapshot();
    expect(dom.find('Animate').prop('enter')).toBeFalsy();
    expect(dom.find('Icon').prop('name')).toBe('Expandable');
    dom.find('Icon').simulate('click');
    expect(click).toBeCalled();
    dom.setProps({active: true, inverted: true});
    expect(dom.find('Animate').prop('enter')).toBeTruthy();
    expect(dom.find('Icon').prop('name')).toBe('ExpandableInverted');
  });
});
