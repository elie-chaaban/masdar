import React from 'react';
import {shallow} from 'enzyme';
import IndexWithIcon from '..';

describe('Index with Icon', () => {
  it('should have passed prpos', () => {
    const dom = shallow(<IndexWithIcon icon="url" subtitle="subtitle" text="text" prefix="$" postfix="%" />);
    expect(dom).toMatchSnapshot();
    expect(dom.find('img').prop('src')).toBe('url');
    expect(dom.find('.prefix').text()).toBe('$');
    expect(dom.find('.postfix').text()).toBe('%');
    expect(dom.find('h3').text()).toBe('text');
    expect(dom.find('.subtitle').text()).toBe('subtitle');
  });
});
