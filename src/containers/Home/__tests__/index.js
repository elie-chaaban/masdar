import React from 'react';
import {Provider} from 'react-redux';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';
import {mockStore} from '../../../testUtils';
import Home from '..';

jest.mock('../../../components/Map', () => ({
  __esModule: true,
  default: () => <div />
}));
jest.mock('../../Dashboard', () => ({
  __esModule: true,
  default: () => <div />
}));
jest.mock('../../Slider', () => ({
  __esModule: true,
  default: () => <div />
}));
jest.mock('../../ActionDetails', () => ({
  __esModule: true,
  default: () => <div />
}));
jest.mock('../../SideBar', () => ({
  __esModule: true,
  default: () => <div />
}));
jest.mock('../../../components/Utils/Modal', () => ({
  __esModule: true,
  default: () => <div />
}));
jest.mock('../../../components/Utils/MultiWindowModal', () => ({
  __esModule: true,
  default: () => <div />
}));
jest.mock('../../../components/Utils/WindowNumberModal', () => ({
  __esModule: true,
  default: () => <div />
}));
jest.mock('../../DynamicContent', () => ({
  __esModule: true,
  default: () => <div />
}));
jest.mock('../../../components/IntersectionDataSlider', () => ({
  __esModule: true,
  default: () => <div />
}));
test('Home component', async () => {
  const state = () => ({
    dashboard: {
      isMultiWindowModalOpened: false,
      multiWindowModalMode: 'normal',
      dynamicContentType: null,
      activeWindowAction: null,
      activeWindowId: null,
      activeWindows: [],
      multiWindowConfig: null,
      dateFilter: {
        filter: 'year',
        startDate: '2020-05-01',
        endDate: '2020-09-01'
      },
      isOpenInsightSlider: false
    },
    map: {
      district: '1',
      districtInfo: {
        name: 'telus',
        location: 'canada',
        longitude: 43,
        latitude: 20
      }
    },
    user: {
      access: {
        insights: ['1']
      }
    }
  });
  const store = mockStore(state());
  let dom;
  await act(async () => {
    dom = mount(
      <Provider store={store}>
        <Home />
      </Provider>
    );
  });
  dom.update();
  expect(dom).toMatchSnapshot();
  expect(dom.find("[data-testid='sidebar']")).toHaveLength(1);
  expect(dom.find("[data-testid='map']")).toHaveLength(1);
  expect(dom.find("[data-testid='dashboard']")).toHaveLength(1);
  expect(dom.find("[data-testid='slider']")).toHaveLength(1);
  expect(dom.find("[data-testid='actions']")).toHaveLength(1);
  expect(dom.find("[data-testid='insightSlider']")).toHaveLength(1);
  expect(dom.find("[data-testid='modal']")).toHaveLength(1);
  expect(dom.find("[data-testid='multiWindowModal']")).toHaveLength(1);
  expect(dom.find("[data-testid='windowNumberModal']")).toHaveLength(1);
  expect(dom.find("[data-testid='dynamicContent']")).toHaveLength(1);
});
