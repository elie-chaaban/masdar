import React from 'react';
import {useSelector} from 'react-redux';
import './style.scss';

const LoaderFull = ({color = 'white'}) => {
  const {mobileMode} = useSelector((s: any) => s.styling);
  return (
    <div className="loader-container">
      <div className="text-center">
        <div className="lds-ellipsis">
          <div style={{backgroundColor: color}}></div>
          <div style={{backgroundColor: color}}></div>
          <div style={{backgroundColor: color}}></div>
          <div style={{backgroundColor: color}}></div>
        </div>
        {mobileMode ? <p className="mobileLoader">Loading...</p> : <p>Loading...</p>}
      </div>
    </div>
  );
};
export default LoaderFull;
