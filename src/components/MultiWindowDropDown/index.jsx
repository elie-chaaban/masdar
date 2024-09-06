import React, {useState, useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import './styles.scss';

const MultiWindowDropDown = ({onGo}) => {
  const multiWindowConfig = useSelector((s) => s.multiWindow.multiWindowConfig);
  const [activeWindow, setActiveWindow] = useState(null);
  const [gridWindows, setGridWindows] = useState([]);
  const [gridStyle, setGridStyle] = useState({});
  useEffect(() => {
    if (multiWindowConfig) {
      setGridWindows(multiWindowConfig.multiScreenLayoutWindows);
      setGridStyle({
        display: 'grid',
        gridTemplateAreas: multiWindowConfig.layoutStyle,
        gridGap: '2px',
        padding: '5px'
      });
    }
  }, [multiWindowConfig]);
  const onWindowClick = (win) => {
    setActiveWindow(win);
  };
  const onGoClick = useCallback(() => {
    onGo(activeWindow);
  }, [onGo, activeWindow]);
  return (
    <div className="multiWindowDropDown">
      <div style={gridStyle} className="active-windows">
        {gridWindows.map((win) => (
          <div
            key={win.windowId}
            style={{gridArea: win.windowId}}
            className={`active-window ${activeWindow && win.windowId === activeWindow.windowId ? 'selected' : ''}`}
            onClick={() => onWindowClick(win)}
          >
            <div className="intenal-active-window">
              <span>{win.windowName}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="btn" onClick={onGoClick}>
        {'GO'}
      </button>
    </div>
  );
};

export default MultiWindowDropDown;
