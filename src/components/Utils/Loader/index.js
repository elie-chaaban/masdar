import React from 'react';
import {Row} from 'react-bootstrap';
import {Animate} from '../';
import PropTypes from 'prop-types';
import './style.scss';

const Loader = ({color = '#fff', height = '100%', children, margin = 20}) => {
  return (
    <Row className="justify-content-md-center align-items-center" style={{color, margin, height, minHeight: height, zIndex: 10000000}}>
      <Animate options={{duration: 500}} className="text-center">
        <div className="lds-ellipsis">
          <div style={{backgroundColor: color}}></div>
          <div style={{backgroundColor: color}}></div>
          <div style={{backgroundColor: color}}></div>
          <div style={{backgroundColor: color}}></div>
        </div>
        {children}
      </Animate>
    </Row>
  );
};

Loader.propTypes = {
  color: PropTypes.string,
  height: PropTypes.string,
  children: PropTypes.node
};
export default Loader;
