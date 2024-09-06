import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//@ts-ignore
import VideoPlayer from '../../Utils/VideoPlayer';
//@ts-ignore
import {enableDisableTelusStream} from '../../../services/Stream';

interface SecurityStreamProps {
  data: any;
}

export const SecurityStream = ({data}: SecurityStreamProps) => {
  const handleToggleStream = async (enable: boolean) => {
    await enableDisableTelusStream(enable);
  };
  return (
    <Row>
      {data.map((item: any) => {
        return (
          <Col key={item.id}>
            <VideoPlayer
              id={item.id}
              streamUrl={item.accessUrls.hlsStream}
              streamType={item.streamType}
              showStreamToggle={!!item.showStreamToggle}
              onToggleStream={!!item.showStreamToggle ? handleToggleStream : null}
            />
          </Col>
        );
      })}
    </Row>
  );
};
