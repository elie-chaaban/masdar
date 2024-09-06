import React from 'react';
import PropTypes from 'prop-types';
import logo from '../../../assets/images/logo/logo.svg';
import './styles.scss';

const Frame = ({source, showLogoDiv}) => {
  return (
    <>
      {showLogoDiv && (
        <div className="nxn-logo-div">
          <img className="nxn-logo-image" src={logo} alt="logo"></img>
        </div>
      )}
      <iframe src={source} frameBorder={'0'} style={{width: '100%', height: '100vh'}} title={'iframe'} />
    </>
  );
};

Frame.propTypes = {
  source: PropTypes.string.isRequired
};
export default Frame;
