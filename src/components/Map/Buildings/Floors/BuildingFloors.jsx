import React from 'react';
import {Source, Layer} from 'react-map-gl';

const BuildingFloors = ({feature}) => {
  return (
    <>
      <Source id="floors" type="geojson" data={feature} />
      <Layer
        id="floors"
        type="fill-extrusion"
        source="floors"
        paint={{
          'fill-extrusion-color': ['get', 'color'],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'baseHeight'],
          'fill-extrusion-opacity': 0.5
        }}
      />
    </>
  );
};
export default React.memo(BuildingFloors);
