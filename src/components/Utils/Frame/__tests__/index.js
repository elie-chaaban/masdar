import React from 'react';
import {shallow} from 'enzyme';
import Frame from '..';

test('Frame', () => {
  const dom = shallow(<Frame source="url" />);
  expect(dom.find('iframe').prop('src')).toBe('url');
  expect(dom).toMatchSnapshot();
});
