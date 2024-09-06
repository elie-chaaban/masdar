import LocalStorageService from '../LocalStorage';
import MWBroadcastChannel from '../MWBroadcastChannel';
import {
  BC_NEW_WINDOW,
  BC_REMOVE_WINDOW,
  BC_TOGGLE_INSIGHT,
  BC_SELECT_A_BUILDING,
  BC_SELECT_A_FLOOR,
  BC_SHOW_WINDOW_NUMBER_MODAL,
  BC_SHOW_DYNAMIC_CONTENT_CONTAINER
} from './action-types';

const broadcastChannel = MWBroadcastChannel.getService();
const StorageService = LocalStorageService.getService();

class MultiWindow {
  constructor() {
    this.activeWindows = [];
    this._prepareActiveWindows();
  }

  _prepareActiveWindows = () => {
    const activeWindows = StorageService.getActiveWindows();
    if (activeWindows) {
      this.activeWindows = JSON.parse(activeWindows);
    } else {
      this.activeWindows = [];
    }
  };

  _updateStoredWindows = () => {
    StorageService.setActiveWindows(JSON.stringify(this.activeWindows));
  };

  pushWindow = (win) => {
    this.activeWindows.push(win);
    this._updateStoredWindows();
    this._postMessage({
      action: BC_NEW_WINDOW,
      data: {
        ...win
      }
    });
  };

  refreshWindows = () => {
    this._prepareActiveWindows();
  };

  getAllWindows = () => {
    return this.activeWindows;
  };

  getWindow = (id) => {
    const foundIndex = this.activeWindows.findIndex((w) => w.windowId === id);
    if (foundIndex !== -1) {
      return this.activeWindows[foundIndex];
    } else {
      return null;
    }
  };

  deleteWindow = (id) => {
    if (this.activeWindows) {
      const foundIndex = this.activeWindows.findIndex((w) => w.windowId === id);
      const removedWindow = {
        ...this.activeWindows[foundIndex]
      };
      this.activeWindows.splice(foundIndex, 1);
      this._updateStoredWindows();
      this._postMessage({
        action: BC_REMOVE_WINDOW,
        data: {
          ...removedWindow
        }
      });
    }
  };

  clearWindows = () => {
    if (this.activeWindows) {
      this.activeWindows = [];
      this._updateStoredWindows();
    }
  };

  showWindowNumberModal = (id, show) => {
    this._postMessage({
      action: BC_SHOW_WINDOW_NUMBER_MODAL,
      data: {
        sendingWindowId: id,
        show
      }
    });
  };

  displayDynamicContentContainer = (sendingWindowId, toScreenId, contentType, payload) => {
    this._postMessage({
      action: BC_SHOW_DYNAMIC_CONTENT_CONTAINER,
      data: {
        sendingWindowId,
        toScreenId,
        contentType,
        ...payload
      }
    });
  };

  selectABuilding = (sendingWindowId, buildingId) => {
    this._postMessage({
      action: BC_SELECT_A_BUILDING,
      data: {
        sendingWindowId,
        buildingId
      }
    });
  };

  selectAFloor = (sendingWindowId, floorId) => {
    this._postMessage({
      action: BC_SELECT_A_FLOOR,
      data: {
        sendingWindowId,
        floorId
      }
    });
  };

  toggleInsight = (sendingWindowId, insight) => {
    this._postMessage({
      action: BC_TOGGLE_INSIGHT,
      data: {
        sendingWindowId,
        insight
      }
    });
  };

  _postMessage = (message) => {
    broadcastChannel.postMessage(message);
  };
}

const multiWindow = new MultiWindow();
export default multiWindow;
