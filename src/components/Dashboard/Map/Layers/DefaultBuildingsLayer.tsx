import React, {memo} from 'react';
import {Layer} from 'react-map-gl';

export type Extrusion = string[];

export interface DefaultBuildingsProps {
  extrusion: Extrusion;
}

export const DefaultBuildingsLayer = memo(({extrusion}: DefaultBuildingsProps) => (
  <>
    <Layer
      id="3d-buildings"
      source="composite"
      source-layer="building"
      type="fill-extrusion"
      minzoom={1}
      paint={{
        'fill-extrusion-color': '#aaa',
        'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['coalesce', ['get', 'height'], 0]],
        'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['coalesce', ['get', 'min_height'], 0]],
        'fill-extrusion-opacity': 0
      }}
      filter={!extrusion ? ['all'] : ['all', ...extrusion.map((id) => ['!=', ['id'], parseInt(id)])]}
    />
  </>
));
