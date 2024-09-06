import React from 'react';
import Icon from '../Icon';
import PropTypes from 'prop-types';
import Animate from '../Animate';

const ExpandableIcon = ({onClick, active, inverted = false, ...props}) => {
  return (
    <Animate enter={active} options={{duration: 500}} {...props} unMountOnExit>
      <Icon
        name={inverted ? 'ExpandableInverted' : 'Expandable'}
        className="expandable-icon clickable"
        onClick={onClick}
        width="25"
        height="50"
      />
    </Animate>
  );
};
ExpandableIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  inverted: PropTypes.bool
};
export default React.memo(ExpandableIcon);
