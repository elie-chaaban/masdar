import React, {forwardRef, ReactNode, CSSProperties} from 'react';
import ReactMapGL, {NavigationControl, MapRef, MapLayerMouseEvent, ViewStateChangeEvent} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';

const styles: Styles = createStyles(({colors, spacing}) => ({
  map: {
    width: '100%',
    height: '100%'
  },
  navigationControl: {
    left: 10,
    bottom: 10
  }
}));

export interface MapProps {
  style?: CSSProperties;
  styleUrl: string;
  accessToken: string;
  onClick?: (e: MapLayerMouseEvent) => void;
  onMove?: (e: ViewStateChangeEvent) => void;
  onLoad?: () => void;
  children?: ReactNode;
}

export const Map = forwardRef<MapRef, MapProps>(({style, styleUrl, accessToken, onClick, onLoad, onMove, children}, ref) => {
  return (
    <ReactMapGL
      ref={ref}
      style={{...styles.map, ...style}}
      mapStyle={styleUrl}
      mapboxAccessToken={accessToken}
      attributionControl={true}
      onClick={onClick}
      onLoad={onLoad}
      onMove={onMove}
      antialias={true}
    >
      {/* <NavigationControl style={styles.navigationControl} /> */}
      {children}
    </ReactMapGL>
  );
});
