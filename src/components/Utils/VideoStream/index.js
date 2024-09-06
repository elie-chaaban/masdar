import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';

import './styles.scss';

const VideoStream = ({streamUrl, wrapperClassName}) => {
  return (
    <div className={wrapperClassName ? wrapperClassName : 'player-wrapper'}>
      <ReactPlayer url={streamUrl} playing width="100%" height="100%" controls={true} pip={true} />
    </div>
  );
};

VideoStream.propTypes = {
  streamUrl: PropTypes.string.isRequired
};
export default React.memo(VideoStream);
