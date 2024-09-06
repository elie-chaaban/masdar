import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import './index.scss';
import {toggleMultiWindowModal, addToActiveWindows} from '../../../reduxStore/actions';

const MultiWindowModal = () => {
  const isMultiWindowModalOpened = useSelector((s) => s.multiWindow.isMultiWindowModalOpened);
  const multiWindowConfig = useSelector((s) => s.multiWindow.multiWindowConfig);
  const activeWindow = useSelector((s) => s.multiWindow.activeWindow);
  const activeWindows = useSelector((s) => s.multiWindow.activeWindows);
  const [gridWindows, setGridWindows] = useState([]);
  const [gridStyle, setGridStyle] = useState({});
  let showAddActiveWindow = true;
  if (activeWindow) {
    showAddActiveWindow = activeWindows.findIndex((w) => w.windowId === activeWindow.windowId) === -1;
  }
  const dispatch = useDispatch();
  const onWindowClick = (win) => {
    const selectedAlready = activeWindows.findIndex((w) => w.windowId === win.windowId) !== -1;
    if (showAddActiveWindow && !selectedAlready) {
      dispatch(addToActiveWindows(win.windowId));
    }
  };
  useEffect(() => {
    if (multiWindowConfig) {
      setGridWindows(multiWindowConfig.multiScreenLayoutWindows);
      setGridStyle({
        display: 'grid',
        gridTemplateAreas: multiWindowConfig.layoutStyle,
        gridGap: '10px',
        padding: '10px'
      });
    }
  }, [multiWindowConfig]);
  return (
    <div
      className="custom-modal shadow"
      style={{transform: `scale(${isMultiWindowModalOpened ? '1' : '0'})`, opacity: `${isMultiWindowModalOpened ? '1' : '0'}`}}
    >
      <div className="close-btn" onClick={() => dispatch(toggleMultiWindowModal())}></div>
      <div className="container">
        <div className="header-text">Multi-Display</div>
        {showAddActiveWindow && <div className="task-text">Please Select Your Active Display</div>}
        <div style={gridStyle} className="active-windows">
          {gridWindows.map((win) => {
            const selectedAlready = activeWindows.findIndex((w) => w.windowId === win.windowId) !== -1;
            return (
              <div
                key={win.windowId}
                style={{gridArea: win.windowId}}
                className={`active-window ${selectedAlready ? 'selected' : ''} ${
                  activeWindow && activeWindow.windowId === win.windowId ? 'active' : ''
                }`}
                onClick={() => onWindowClick(win)}
              >
                <div className="intenal-active-window">
                  <span>{win.windowName}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MultiWindowModal);
