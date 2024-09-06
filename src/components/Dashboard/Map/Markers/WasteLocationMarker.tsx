import React, {CSSProperties, useCallback} from 'react';
import {Styles} from '../../../../types';
import {Marker, Anchor, PointLike} from 'react-map-gl';
// @ts-ignore
import wasteLocation from '../../../../assets/images/icons/waste-location-marker.png';
// @ts-ignore
import wasteLocationActive from '../../../../assets/images/icons/waste-location-active-marker.png';

import {createStyles} from '../../../../theme';

import 'animate.css';
import './styles.css';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.center
  },
  alarmIcon: {
    width: 'auto',
    height: 'auto'
  }
}));

export interface WasteLocationMarkerProps {
  style?: CSSProperties;
  location: string;
  longitude: number;
  latitude: number;
  anchor: Anchor;
  offset: PointLike;
  active: boolean;
  onClick: (location: string) => void;
}

export const WasteLocationMarker = ({style, location, longitude, latitude, offset, anchor, active, onClick}: WasteLocationMarkerProps) => {
  const handleOnClick = useCallback(() => {
    onClick(location);
  }, [location, onClick]);
  return (
    <Marker longitude={longitude} latitude={latitude} anchor={anchor} offset={offset} onClick={handleOnClick}>
      {active ? (
        <img src={wasteLocationActive} style={styles.alarmIcon} alt="Waste Location" />
      ) : (
        <img src={wasteLocation} style={styles.alarmIcon} alt="Waste Location" />
      )}
    </Marker>
  );
};
