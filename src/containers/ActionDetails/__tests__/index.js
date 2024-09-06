import React from 'react';
import mockResponse from '../mock';
import {mockStore} from '../../../testUtils';
import {mount} from 'enzyme';
import ActionDetails from '..';
import {Provider} from 'react-redux';

jest.mock('../../../components/Slider/Security/PeopleSearch', () => ({
  __esModule: true,
  default: () => <div id="peopleSearch" />
}));
test('Action Details component People Search', () => {
  let store = mockStore({
    dashboard: {
      iFrames: mockResponse,
      credentials_3dEye: {accessToken: 'jfjfw134', refreshToken: 'refresh'},
      actionSlider: {data: null, action: 'Search', open: true}
    }
  });
  let dom = mount(
    <Provider store={store}>
      <ActionDetails />
    </Provider>
  );
  expect(dom).toMatchSnapshot();
  expect(dom.find('SlideIn').prop('in')).toBeTruthy();
  expect(dom.find('#peopleSearch')).toHaveLength(0);
  expect(dom.find('Frame')).toHaveLength(0);
  expect(dom.find('Memo(ExpandableIcon)').prop('active')).toBeTruthy();
  dom.find('Memo(ExpandableIcon)').props().onClick();
  expect(store.getActions()).toHaveLength(1);
  expect(store.getActions()[0]).toEqual({type: 'TOGGLE_ACTION_SLIDER', action: 'Search', data: null});
  dom.unmount();
  jest.clearAllMocks();
});
test('Action Details component energy', () => {
  let store = mockStore({
    dashboard: {
      iFrames: mockResponse,
      credentials_3dEye: {accessToken: 'jfjfw134', refreshToken: 'refresh'},
      actionSlider: {data: null, action: 'energy', open: true}
    }
  });
  let dom = mount(
    <Provider store={store}>
      <ActionDetails />
    </Provider>
  );
  // const url = mockResponse.find((item) => item.section === 'ENERGY' || item.module === 'ENERGY').portal_url;
  expect(dom.find('#peopleSearch')).toHaveLength(0);
  expect(dom.find('Frame')).toHaveLength(0);
  // expect(dom.find('Frame').prop('source')).toBe(url + '?username="demoadmin"&password="demo@NXN2018"');
  dom.unmount();
  jest.clearAllMocks();
});
test('Action Details component SECURITY INCIDENTS', () => {
  let store = mockStore({
    dashboard: {
      iFrames: mockResponse,
      credentials_3dEye: {accessToken: 'jfjfw134', refreshToken: 'refresh'},
      actionSlider: {data: {situation_id: '2'}, action: 'SECURITY_INCIDENTS', open: true}
    }
  });
  let dom = mount(
    <Provider store={store}>
      <ActionDetails />
    </Provider>
  );
  // const url = mockResponse.find((item) => item.section === 'SECURITY_INCIDENTS' || item.module === 'SECURITY_INCIDENTS').portal_url;
  expect(dom.find('#peopleSearch')).toHaveLength(0);
  expect(dom.find('Frame')).toHaveLength(0);
  // expect(dom.find('Frame').prop('source')).toBe(url + '?situationID=2&windowNumber=1');
  dom.unmount();
  jest.clearAllMocks();
});
test('Action Details component SECURITY SURVEILLANCE', () => {
  let store = mockStore({
    dashboard: {
      iFrames: mockResponse,
      credentials_3dEye: {accessToken: 'jfjfw134', refreshToken: 'refresh'},
      actionSlider: {data: {situation_id: '2'}, action: 'SECURITY_SURVEILLANCE', open: true}
    }
  });
  let dom = mount(
    <Provider store={store}>
      <ActionDetails />
    </Provider>
  );
  // const url = mockResponse.find((item) => item.section === 'SECURITY_SURVEILLANCE' || item.module === 'SECURITY_SURVEILLANCE').portal_url;
  expect(dom.find('#peopleSearch')).toHaveLength(0);
  expect(dom.find('Frame')).toHaveLength(0);
  // expect(dom.find('Frame').prop('source')).toBe(url + '?access_token=jfjfw134&refresh_token=refresh');
  dom.unmount();
  jest.clearAllMocks();
});
test('Action Details component Statistics', () => {
  let store = mockStore({
    dashboard: {
      iFrames: mockResponse,
      credentials_3dEye: {accessToken: 'jfjfw134', refreshToken: 'refresh'},
      actionSlider: {data: {situation_id: '2'}, action: 'Statistics', open: true}
    }
  });
  let dom = mount(
    <Provider store={store}>
      <ActionDetails />
    </Provider>
  );
  expect(dom.find('SlideIn').prop('in')).toBeFalsy();
  expect(dom.find('#peopleSearch')).toHaveLength(0);
  expect(dom.find('Frame')).toHaveLength(0);
  expect(dom.find('Memo(ExpandableIcon)')).toHaveLength(0);
  dom.unmount();
  jest.clearAllMocks();
});
