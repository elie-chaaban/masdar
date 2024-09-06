import React, {CSSProperties} from 'react';
import {Styles} from '../../../../types';
import {Marker, Anchor, PointLike} from 'react-map-gl';

import {createStyles} from '../../../../theme';
import {SeveritiesModal, Severity} from '../../SeveritiesModal';

import 'animate.css';
import './styles.css';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.center
  }
}));

export interface SeverityMarkerProps {
  style?: CSSProperties;
  longitude: number;
  latitude: number;
  anchor: Anchor;
  offset: PointLike;
  title: string;
  severity: Severity;
  onClick: () => void;
}

export const SeverityMarker = ({style, longitude, latitude, offset, anchor, title, severity, onClick}: SeverityMarkerProps) => {
  return (
    <Marker longitude={longitude} latitude={latitude} anchor={anchor} offset={offset} onClick={onClick}>
      <SeveritiesModal title={title} severity={severity} />
    </Marker>
  );
};
