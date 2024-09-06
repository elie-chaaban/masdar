import React from 'react';
import {Col} from 'react-bootstrap';

import './style.scss';

const Legend = ({color, children, margin = '', rounded = false, className = '', ...props}) => {
  return (
    <Col xs="auto" className={`legend ${margin} ${className}`} {...props}>
      <span className="color-indicator" style={{backgroundColor: color, borderRadius: rounded ? 50 : 0}}></span>
      {children}
    </Col>
  );
};

export default Legend;
