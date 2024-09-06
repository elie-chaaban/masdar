import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import config from './config';

const Animate = ({enter, animation, unMountOnExit, options, children, onAnimationEnd, stylingProperties, ...props}) => {
  const [mount, setMount] = useState(false);
  const style = {
    animationName: `${animation}${enter ? 'In' : 'Out'}`,
    animationDuration: `${options.duration}ms`,
    animationDelay: `${options.delay}ms`,
    animationFillMode: options.fillMode,
    animationTimingFunction: options.timingFunction,
    animationPlayState: options.playState,
    animationDirection: options.direction,
    animationIterationCount: options.count
  };
  useEffect(() => {
    if (enter) setMount(true);
  }, [enter]);
  return mount || !unMountOnExit ? (
    <div
      {...props}
      style={{...style, ...stylingProperties}}
      onAnimationEnd={() => {
        if (!enter && unMountOnExit) {
          if (onAnimationEnd) onAnimationEnd();
          setMount(false);
        }
      }}
    >
      {children}
    </div>
  ) : null;
};

Animate.protoTypes = {
  enter: PropTypes.bool,
  animation: PropTypes.string,
  onAnimationEnd: PropTypes.func,
  unMountOnExit: PropTypes.bool,
  options: PropTypes.shape({
    duration: PropTypes.number,
    delay: PropTypes.number,
    fillMode: PropTypes.oneOf(config.fillMode),
    timingFunction: PropTypes.string,
    playState: PropTypes.oneOf(config.playState),
    direction: PropTypes.oneOf(config.direction),
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(config.count)])
  })
};
Animate.defaultProps = {
  enter: true,
  animation: 'fade',
  unMountOnExit: false,
  onAnimationEnd: null,
  options: {
    duration: 1000,
    delay: 0,
    fillMode: 'forwards',
    timingFunction: 'linear',
    playState: 'running	',
    direction: 'normal',
    count: 'initial'
  }
};
export default Animate;
