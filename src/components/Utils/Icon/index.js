import React from 'react';
import PropTypes from 'prop-types';
import {iconTypes} from './config';

const Icon = ({name, ...props}) => {
  const IconComponent = iconTypes[name];
  return IconComponent ? <IconComponent {...props} /> : null;
};

Icon.propTypes = {
  name: PropTypes.string.isRequired
};
export default Icon;
