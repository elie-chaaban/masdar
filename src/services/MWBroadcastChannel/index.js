import {default as store} from '../../reduxStore';
import {
  BC_NEW_WINDOW,
  BC_REMOVE_WINDOW,
  BC_TOGGLE_INSIGHT,
  BC_SELECT_A_BUILDING,
  BC_SELECT_A_FLOOR,
  BC_SHOW_WINDOW_NUMBER_MODAL,
  BC_SHOW_DYNAMIC_CONTENT_CONTAINER
} from '../MultiWindow/action-types';
import {
  setSelectedDashboard,
  buildingSelection,
  floorSelection,
  setActiveWindows,
  setDynamicContentType,
  showHideWindowNumberModal
} from '../../reduxStore/actions';
import MultiWindow from '../../services/MultiWindow';
const BROADCAST_CHANNEL_NAME = 'C&I_active_windows';

const MWBroadcastChannel = (function () {
  var _service;
  var _broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  function _getService() {
    if (!_service) {
      _service = this;
      return _service;
    }
    return _service;
  }
  function _startListening() {
    const dispatch = store.dispatch;
    _broadcastChannel.onmessage = (ev) => {
      const message = ev.data;
      switch (message.action) {
        case BC_NEW_WINDOW:
          MultiWindow.refreshWindows();
          dispatch(setActiveWindows(MultiWindow.getAllWindows()));
          break;
        case BC_REMOVE_WINDOW:
          MultiWindow.refreshWindows();
          dispatch(setActiveWindows(MultiWindow.getAllWindows()));
          break;
        case BC_SHOW_WINDOW_NUMBER_MODAL: {
          MultiWindow.refreshWindows();
          const {activeWindow, isMultiWindowModalOpened} = store.getState().multiWindow;
          if (activeWindow && !isMultiWindowModalOpened && message.data.sendingWindowId !== activeWindow.windowId) {
            dispatch(showHideWindowNumberModal(message.data.show));
          } else {
            dispatch(showHideWindowNumberModal(false));
          }
          break;
        }
        case BC_SHOW_DYNAMIC_CONTENT_CONTAINER: {
          const {activeWindow} = store.getState().multiWindow;
          if (activeWindow && message.data.sendingWindowId !== activeWindow.windowId && message.data.toScreenId === activeWindow.windowId) {
            if (message.data.insight) {
              dispatch(setSelectedDashboard(message.data.insight, true));
            }
            dispatch(
              setDynamicContentType({
                contentType: message.data.contentType,
                contentTabKey: message.data.tabKey,
                openAssetAnalysis: message.data.openAssetAnalysis
              })
            );
          }
          break;
        }
        case BC_SELECT_A_BUILDING: {
          const {activeWindow} = store.getState().multiWindow;
          if (activeWindow && message.data.sendingWindowId !== activeWindow.windowId) {
            dispatch(buildingSelection(message.data.buildingId, true));
          }
          break;
        }
        case BC_SELECT_A_FLOOR: {
          const {activeWindow} = store.getState().multiWindow;
          if (activeWindow && message.data.sendingWindowId !== activeWindow.windowId) {
            dispatch(floorSelection(message.data.floorId, true));
          }
          break;
        }
        case BC_TOGGLE_INSIGHT: {
          const {activeWindow} = store.getState().multiWindow;
          if (activeWindow && message.data.sendingWindowId !== activeWindow.windowId) {
            dispatch(setSelectedDashboard(message.data.insight, true));
          }
          break;
        }
        default:
          console.log();
          break;
      }
      console.log('broadcastChannel ev', ev);
    };
  }
  function _postMessage(message) {
    _broadcastChannel.postMessage(message);
  }
  return {
    getService: _getService,
    startListening: _startListening,
    postMessage: _postMessage
  };
})();
export default MWBroadcastChannel;
