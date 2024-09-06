import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {mockStore} from '../../../../../testUtils';
import DistrictInfo from '..';

const data = {
  info: {
    info: {
      id: '1',
      name: 'Telus HQ',
      location: 'Edmonton, Canada',
      extrusion: ['59', '88', '79', '78', '80', '32', '8', '2', '4', '22', '3', '5', '60'],
      latitude: 53.54310552517575,
      longitude: -113.49581660415623,
      zoom: 15.721944548645808
    }
  },
  image: 'url',
  indexes: {mobility: 74, security: 62, facilities: 23, energy: 23}
};
const store = mockStore({});
const click = jest.fn();
test('District Info not selected ', async () => {
  const dom = mount(
    <Provider store={store}>
      <DistrictInfo district={data} onClick={click} active={false} />
    </Provider>
  );
  expect(dom).toMatchSnapshot();
  expect(dom.find('.district-card')).toHaveLength(1);
  expect(dom.find('.active')).toHaveLength(0);
  expect(dom.find('img').prop('src')).toBe('url');
  expect(dom.find('.desc').html()).toEqual('<div class="desc"><h5>Telus HQ</h5><p>Edmonton, Canada</p></div>');
  expect(dom.find('.insights-info').at(0).find('span').text()).toBe('23');
  expect(dom.find('.insights-info').at(1).find('span').text()).toBe('23');
  expect(dom.find('.insights-info').at(2).find('span').text()).toBe('62');
  expect(dom.find('.insights-info').at(3).find('span').text()).toBe('74');
  dom.find('.district-card').simulate('click');
  expect(click).toBeCalled();
  jest.clearAllMocks();
  dom.unmount();
});

test('District Info selected ', () => {
  const dom = mount(
    <Provider store={store}>
      <DistrictInfo district={data} onClick={click} active={true} />
    </Provider>
  );
  expect(dom).toMatchSnapshot();
  expect(dom.find('.active')).toHaveLength(1);
  dom.find('.district-card').simulate('click');
  expect(click).toBeCalledTimes(0);
  jest.clearAllMocks();
  dom.unmount();
});
