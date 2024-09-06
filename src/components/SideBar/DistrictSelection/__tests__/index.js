import React from 'react';
import {mockStore} from '../../../../testUtils';
import moment from 'moment-mini';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {act} from 'react-dom/test-utils';
import DistrictSelect from '..';
let resolve;
const data = [
  {
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
  }
];
jest.mock('../../../../services/dashBoard', () => ({
  ...jest.requireActual('../../../../services/dashBoard'),
  fetchDistrictsInfo: () =>
    new Promise((res) => {
      resolve = res;
    })
}));
let click = jest.fn();
test('District selection Open', async () => {
  let dom;
  const store = mockStore({
    map: {district: '1', districts: [1]},
    dashboard: {dateFilter: {startDate: moment().subtract('11', 'month'), endDate: moment()}}
  });
  await act(async () => {
    dom = mount(
      <Provider store={store}>
        <DistrictSelect click={click} active={true} />
      </Provider>
    );
  });
  dom.update();
  expect(dom).toMatchSnapshot();
  expect(dom.find('.district-selection').not('div')).toHaveLength(1);
  expect(dom.find('Loader')).toHaveLength(1);
  expect(dom.find('.district-card')).toHaveLength(0);
  await act(async () => {
    resolve(data);
  });
  dom.update();
  expect(dom).toMatchSnapshot();
  expect(dom.find('Loader')).toHaveLength(0);
  expect(dom.find('.district-card')).toHaveLength(1);
  expect(dom.find('Memo(DistrictInfo)').prop('active')).toBeTruthy();
  expect(dom.find('Memo(DistrictInfo)').prop('district')).toEqual(data[0]);
  await act(async () => {
    dom.find('Memo(DistrictInfo)').props().onClick();
  });
  dom.mount();
  jest.clearAllMocks();
  store.clearActions();
});

test('District selection Open', async () => {
  let dom;
  const store = mockStore({
    map: {district: '1', districts: [1]},
    dashboard: {dateFilter: {startDate: moment().subtract('11', 'month'), endDate: moment()}}
  });
  await act(async () => {
    dom = mount(
      <Provider store={store}>
        <DistrictSelect active={false} click={click} />
      </Provider>
    );
  });
  dom.update();
  expect(dom).toMatchSnapshot();
  expect(dom.find('Animate').prop('enter')).toBeFalsy();
  expect(dom.find('Animate').children()).toHaveLength(0);
  dom.mount();
  jest.clearAllMocks();
});
