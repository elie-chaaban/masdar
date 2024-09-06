import React, {useEffect, useState, useRef, useCallback} from 'react';
import videojs from 'video.js';
import Switch from '../../Utils/Switch';
import {SlashCircle, Camera} from 'react-bootstrap-icons';
import captureFrame from 'capture-frame';
import './styles.css';

const VideoPlayer = ({id, streamType, streamUrl, showStreamToggle, onToggleStream}) => {
  let videoNode = useRef();
  const [player, setPlayer] = useState(null);
  const [activeStream, setActiveStream] = useState(false);

  useEffect(() => {
    const config = {
      autoplay: true,
      controls: true,
      fluid: true,
      sources: [
        {
          src: streamUrl,
          type: streamType
        }
      ]
    };

    const playerInstance = videojs(videoNode, config, function onPlayerReady() {
      console.log('onPlayerReady');
    });
    setPlayer(playerInstance);

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [player, streamType, streamUrl]);

  const handleActivateStreamChange = useCallback(
    (isChecked) => {
      setActiveStream(isChecked);
      if (onToggleStream) onToggleStream(isChecked);
    },
    [onToggleStream]
  );

  const takeSnapshot = () => {
    const frame = captureFrame(`.video-${id} > video`);

    const image = document.createElement('a');
    document.body.appendChild(image);
    image.href = window.URL.createObjectURL(new window.Blob([frame.image]));
    image.download = `camera-snapshot-${id}-${Date.now()}.png`;
    image.click();
    image.remove();
  };

  return (
    <div>
      <div data-vjs-player>
        {showStreamToggle && (
          <div className="stream-activation-wrapper">
            <Switch checked={activeStream} onChange={handleActivateStreamChange} />
          </div>
        )}
        <div className="stream-snapshot-wrapper">
          <Camera color="white" size={16} onClick={takeSnapshot} />
        </div>
        {showStreamToggle && !activeStream && (
          <div className="disabled-stream-div">
            <div className="stream-disabled-icon">
              <SlashCircle color="black" size={30} />
            </div>
          </div>
        )}
        <video ref={(node) => (videoNode = node)} className={`video-js video-${id}`} loop></video>
      </div>
    </div>
  );
};

export default React.memo(VideoPlayer);
