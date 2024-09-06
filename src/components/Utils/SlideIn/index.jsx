import React from 'react';
import Animate from '../Animate';

const SlideIn = ({in: inProp, children, exited, entered, onAnimationEnd, stylingProperties, style, ...props}) => (
  <Animate
    animation="fadeRight"
    enter={inProp}
    options={{duration: 500}}
    onAnimationEnd={onAnimationEnd}
    stylingProperties={{...stylingProperties, ...style}}
    {...props}
    unMountOnExit
  >
    {children}
  </Animate>
);

export default SlideIn;
