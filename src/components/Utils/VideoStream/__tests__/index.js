import React from 'react';
import {shallow} from 'enzyme';
import VideoStream from '..';

test('video Stream', () => {
  const dom = shallow(<VideoStream streamUrl="url" />);
  expect(dom).toMatchSnapshot();
  expect(dom.find('ReactPlayer').prop('url')).toBe('url');
});
