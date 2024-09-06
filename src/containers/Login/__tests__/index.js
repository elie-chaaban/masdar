import React from 'react';
import {Provider} from 'react-redux';
import Login from '..';
import {mockStore} from '../../../testUtils';
import {mount} from 'enzyme';
import {act} from 'react-dom/test-utils';

jest.mock('../../../components/Utils/Notifications', () => ({
  ...jest.requireActual('../../../components/Utils/Notifications'),
  successNotification: jest.fn(),
  errorNotification: jest.fn()
}));

// let resolve;
// jest.mock('../../../services/auth', () => ({
//   ...jest.requireActual('../../../services/auth'),
//   loginUser: jest.fn(
//     () =>
//       new Promise((res) => {
//         resolve = res;
//       })
//   )
// }));
// jest.mock('../../../reduxStore/authReducer/actions.js', () => ({
//   __esModule: true,
//   default: () => ({
//     type: 'AUTHENTICATE_USER'
//   })
// }));
// test('Login Page without expire', async () => {
//   let dom, username, password;
//   const store = mockStore({user: {isExpireModalOpen: false}});
//   await act(async () => {
//     dom = mount(
//       <Provider store={store}>
//         <Login />
//       </Provider>
//     );
//   });
//   username = dom.find("input[name='userName']");
//   password = dom.find("input[type='password']");
//   expect(dom.find('.text-warning')).toHaveLength(0);
//   expect(dom).toMatchSnapshot();
//   expect(dom.find('form.login-form')).toHaveLength(1);
//   const submit = () => dom.find("button[type='submit']").simulate('submit');
//   await act(async () => {
//     submit();
//   });
//   dom.update();
//   let errors = dom.find('.invalid-feedback');
//   errors.forEach(function (item) {
//     expect(item.text()).toBe('Required');
//   });
//   await act(async () => {
//     await username.simulate('change', {
//       target: {value: 'ad', name: 'userName'}
//     });
//     await password.simulate('change', {
//       target: {value: 'ad', name: 'password'}
//     });
//     submit();
//   });
//   dom.update();
//   errors = dom.find('.invalid-feedback');
//   errors.forEach(function (item) {
//     expect(item.text()).toBe('Too Short!');
//   });
//   await act(async () => {
//     await username.simulate('change', {
//       target: {value: 'adelc', name: 'userName'}
//     });
//     await password.simulate('change', {
//       target: {value: '12345678', name: 'password'}
//     });
//   });
//   dom.update();
//   errors = dom.find('.invalid-feedback');
//   expect(errors).toHaveLength(0);
//   await act(async () => {
//     submit();
//   });
//   dom.update();
//   expect(dom.find("[type='submit']").text()).toBe('login In! Please wait...');
//   await act(async () => {
//     resolve(true);
//   });
//   dom.update();
//   expect(dom.find("[type='submit']").text()).toBe('Login');
//   expect(store.getActions()).toHaveLength(1);
//   expect(store.getActions()[0]).toEqual({type: 'AUTHENTICATE_USER'});
//   jest.clearAllMocks();
//   dom.unmount();
// });
test('Login Page with expire', async () => {
  let dom;
  const store = mockStore({user: {isExpireModalOpen: true}});
  await act(async () => {
    dom = mount(
      <Provider store={store}>
        <Login />
      </Provider>
    );
  });
  expect(dom).toMatchSnapshot();
  // expect(dom.find('.text-warning')).toHaveLength(1);
  jest.clearAllMocks();
  dom.unmount();
});
