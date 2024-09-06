import {configure, ShallowWrapper} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import enableHooks from 'jest-react-hooks-shallow';
enableHooks(jest, {dontMockByDefault: true});

configure({adapter: new Adapter()});

ShallowWrapper.prototype.findByTestId = function (id) {
  return this.find(`[data-testid="${id}"]`);
};
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {}
    };
  };
global.BroadcastChannel = global.BroadcastChannel || function () {};
// jest.mock('./components/Commons/Notifications', () => ({
//   successNotification: jest.fn(),
//   errorNotification: jest.fn()
// }));
// window.HTMLElement.prototype.scrollIntoView = jest.fn();
// global.document.createRange = () => ({
//   setStart: () => {},
//   setEnd: () => {},
//   commonAncestorContainer: {
//     nodeName: 'BODY',
//     ownerDocument: document
//   }
// });
