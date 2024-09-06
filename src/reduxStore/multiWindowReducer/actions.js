import {
  setActiveWindows as setActiveWindowsAction,
  setActiveWindow as setActiveWindowAction,
  toggleMultiWindowModal as toggleMultiWindowModalAction,
  setMultiWindowConfig as setMultiWindowConfigAction,
  setDynamicContentType as setDynamicContentTypeAction,
  showHideWindowNumberModal as showHideWindowNumberModalAction,
  setOpenAssetAnalysis as setOpenAssetAnalysisAction
} from './index';
import MultiWindow from '../../services/MultiWindow';
import {getMultiWindowConfig} from '../../services/dashBoard';
import {v4 as uuidv4} from 'uuid';

export const toggleMultiWindowModal = (mode) => (dispatch, getState) => {
  const {activeWindow, isMultiWindowModalOpened} = getState().multiWindow;
  if (activeWindow && !isMultiWindowModalOpened) {
    MultiWindow.showWindowNumberModal(activeWindow.windowId, true);
  } else {
    MultiWindow.showWindowNumberModal(null, false);
  }
  dispatch(toggleMultiWindowModalAction(mode ? mode : 'normal'));
};

export const setActiveWindows = () => (dispatch) => {
  const activeWindows = MultiWindow.getAllWindows();
  dispatch(setActiveWindowsAction(activeWindows));
};

export const removeActiveWindow = () => (dispatch, getState) => {
  const {activeWindow} = getState().multiWindow;
  MultiWindow.deleteWindow(activeWindow.windowId);
};

export const addToActiveWindows = (id) => (dispatch) => {
  MultiWindow.refreshWindows();
  let activeWindows = MultiWindow.getAllWindows();
  const new_window = {
    windowId: id ? id : uuidv4(),
    windowName: activeWindows.length ? activeWindows.length + 1 : 1
  };
  MultiWindow.pushWindow(new_window);
  dispatch(setActiveWindowAction(new_window));
  activeWindows = MultiWindow.getAllWindows();
  dispatch(setActiveWindowsAction(activeWindows));
};

export const showDynamicContentContainer =
  (win, type, payload = {}) =>
  (dispatch, getState) => {
    const {activeWindow} = getState().multiWindow;
    if (activeWindow) {
      MultiWindow.displayDynamicContentContainer(activeWindow.windowId, win.windowId, type, payload);
    }
  };

export const setMultiWindowConfig = () => async (dispatch) => {
  const mwConfig = await getMultiWindowConfig();
  dispatch(setMultiWindowConfigAction(mwConfig));
};

export const setDynamicContentType = (payload) => (dispatch) => {
  dispatch(setDynamicContentTypeAction(payload));
};

export const showHideWindowNumberModal = (payload) => (dispatch) => {
  dispatch(showHideWindowNumberModalAction(payload));
};

export const setOpenAssetAnalysis = (payload) => async (dispatch) => {
  dispatch(setOpenAssetAnalysisAction(payload));
};
