import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import './index.scss';
import {toggleModal} from '../../../reduxStore/actions';

const Modal = () => {
  const isOpenModal = useSelector((s) => s.dashboard.isOpenModal);
  const qrCode = useSelector((s) => s.dashboard.qrCode);
  const dispatch = useDispatch();
  return (
    <div className="custom-modal shadow" style={{transform: `scale(${isOpenModal ? '1' : '0'})`, opacity: `${isOpenModal ? '1' : '0'}`}}>
      <div className="close-btn" onClick={() => dispatch(toggleModal())}></div>
      <div className="qrCode-img">
        <a className="download-btn" href={qrCode} download="QRcode.png" role="button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" width="25" height="25">
            <path
              fill="white"
              d="M168 345.941V44c0-6.627-5.373-12-12-12h-56c-6.627 0-12 5.373-12 12v301.941H41.941c-21.382 0-32.09 25.851-16.971 40.971l86.059 86.059c9.373 9.373 24.569 9.373 33.941 0l86.059-86.059c15.119-15.119 4.411-40.971-16.971-40.971H168z"
            ></path>
          </svg>
        </a>
        <img src={qrCode} alt="qrCode" />
      </div>
    </div>
  );
};

export default React.memo(Modal);
