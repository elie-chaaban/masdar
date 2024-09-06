import React from 'react';
import EditPassword from '..';
import {act} from 'react-dom/test-utils';
import {mount} from 'enzyme';

let resolve;
jest.mock('../../../../../services/user', () => ({
  ...jest.requireActual('../../../../../services/user'),
  updatePassword: jest.fn(
    () =>
      new Promise((res) => {
        resolve = res;
      })
  )
}));

describe('Edit Password Component', () => {
  let dom;
  const click = jest.fn();
  beforeEach(() => {
    dom = mount(<EditPassword click={click} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
    dom.unmount();
  });
  it('should match snapshot', () => {
    expect(dom).toMatchSnapshot();
  });
  test('default inputs', () => {
    expect(dom.find('input[name="password"]').prop('value')).toBe('');
    expect(dom.find('input[name="passwordConfirmation"]').prop('value')).toBe('');
    expect(dom.find('.text-danger')).toHaveLength(0);
    expect(dom.find('[data-testid="indicator-text"]')).toHaveLength(0);
    expect(dom.find('[data-testid="indicator-bar"]').prop('className')).toBe('bar ');
  });
  it('should validate required inputs', async () => {
    await act(async () => {
      dom.find('button').simulate('submit');
    });
    dom.update();
    expect(dom.find('.text-danger')).toHaveLength(2);
    expect(dom.find('.text-danger').at(0).text()).toBe('required');
    expect(dom.find('.text-danger').at(1).text()).toBe('required');
  });
  it('should validate password confirmation to match password', async () => {
    await act(async () => {
      await dom.find('input[name="password"]').simulate('change', {target: {value: 'pass123', name: 'password'}});
      await dom.find('input[name="passwordConfirmation"]').simulate('change', {target: {value: 'pass13', name: 'passwordConfirmation'}});
      dom.find('button').simulate('submit');
    });
    dom.update();
    expect(dom.find('.text-danger')).toHaveLength(1);
    expect(dom.find('.text-danger').text()).toBe('Passwords must match');
  });
  it('should show password indicator', async () => {
    await act(async () => {
      await dom.find('input[name="password"]').simulate('change', {target: {value: 'he', name: 'password'}});
      dom.update();
      expect(dom.find('[data-testid="indicator-bar"]').hasClass('verylow')).toBeTruthy();
      expect(dom.find('[data-testid="indicator-text"]').find('p').text()).toBe('Very Weak');
      await dom.find('input[name="password"]').simulate('change', {target: {value: 'password123', name: 'password'}});
      dom.update();
      expect(dom.find('[data-testid="indicator-bar"]').hasClass('low')).toBeTruthy();
      expect(dom.find('[data-testid="indicator-text"]').find('p').text()).toBe('Weak');
      await dom.find('input[name="password"]').simulate('change', {target: {value: 'password123@', name: 'password'}});
      dom.update();
      expect(dom.find('[data-testid="indicator-bar"]').hasClass('strong')).toBeTruthy();
      expect(dom.find('[data-testid="indicator-text"]').find('p').text()).toBe('Strong');
      await dom.find('input[name="password"]').simulate('change', {target: {value: 'Password123@', name: 'password'}});
      dom.update();
      expect(dom.find('[data-testid="indicator-bar"]').hasClass('verystrong')).toBeTruthy();
      expect(dom.find('[data-testid="indicator-text"]').find('p').text()).toBe('Very Strong');
    });
  });
  test('password submission', async () => {
    await act(async () => {
      await dom.find('input[name="password"]').simulate('change', {target: {value: 'Password123@', name: 'password'}});
      await dom
        .find('input[name="passwordConfirmation"]')
        .simulate('change', {target: {value: 'Password123@', name: 'passwordConfirmation'}});
      dom.find('button').simulate('submit');
    });
    dom.update();
    expect(dom.find('button').text()).toBe('Saving...');
    expect(click).toHaveBeenCalledTimes(0);
    await act(async () => {
      resolve();
    });
    expect(dom.find('button').text()).toBe('Save');
    expect(click).toHaveBeenCalledTimes(1);
  });
});
