import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';
import Row from 'react-bootstrap/Row';

const IndexWithIcon = ({icon, subtitle, text, prefix, postfix}) => {
  return (
    <div className="index-with-icon-container">
      <div className="index-icon-container">
        <img src={icon} alt="index-icon" style={{width: 30}} />
      </div>
      <Row className="align-items-center no-gutters">
        <span className="prefix align-self-end">{prefix}</span>
        <h3>{text}</h3>
        <span className="postfix align-self-end">{postfix}</span>
      </Row>
      <div className="subtitle">{subtitle}</div>
    </div>
  );
};

IndexWithIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  prefix: PropTypes.string,
  postfix: PropTypes.string
};

export default IndexWithIcon;
