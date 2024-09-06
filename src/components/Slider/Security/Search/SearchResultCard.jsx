import React, {useCallback} from 'react';
import {Col, Row} from 'react-bootstrap';
import moment from 'moment';
// import {Icon} from '../../../Utils';

export const SearchResultCard = (props) => {
  const {createdAt, camera, behaviorType, image, onClick} = props;
  const handleClick = useCallback(() => {
    onClick(props);
  }, [onClick, props]);
  return (
    <div key={props.id} className="search-card" onClick={handleClick}>
      <Row>
        {image ? (
          <Col xs={6} className="search-card-left">
            <img className="search-card-image" src={image} alt="camera" />
          </Col>
        ) : null}
        <Col xs={image ? 6 : 12} className="search-card-right">
          <div className="search-card-title">{behaviorType}</div>
          <div className="search-card-separator"></div>
          <div className="search-card-subtitle">{(camera ? camera : '') + ' ' + moment(createdAt, 'x').format('YYYY-MM-DD hh:mm:ss')}</div>
          <div className="search-card-footer"></div>
        </Col>
      </Row>
    </div>
  );
};
