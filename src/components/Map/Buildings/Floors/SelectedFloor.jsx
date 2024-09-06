import React from 'react';
import {Source, Layer} from 'react-map-gl';

const SelectedFloor = ({feature}) => (
  <>
    <Source id="selected-floor" type="geojson" data={feature} />
    <Layer
      id="selected-floor"
      type="fill-extrusion"
      source="selected-floor"
      paint={{
        'fill-extrusion-color': ['get', 'color'],
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': ['get', 'baseHeight'],
        'fill-extrusion-opacity': 1
      }}
    />
  </>
);
export default React.memo(SelectedFloor);
