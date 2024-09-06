import React from 'react';
import {useSelector} from 'react-redux';
import './index.scss';

const WindowNumberModal = () => {
  const isWindowNumberModalOpened = useSelector((s) => s.multiWindow.isWindowNumberModalOpened);
  const activeWindow = useSelector((s) => s.multiWindow.activeWindow);
  return (
    <div
      className="custom-window-modal shadow"
      style={{transform: `scale(${isWindowNumberModalOpened ? '1' : '0'})`, opacity: `${isWindowNumberModalOpened ? '1' : '0'}`}}
    >
      <div className="screen-number">{activeWindow && activeWindow.windowName}</div>
    </div>
  );
};

export default React.memo(WindowNumberModal);
