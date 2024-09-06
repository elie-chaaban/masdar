import React, {memo} from 'react';
import {Layer, Source} from 'react-map-gl';

export interface HeatmapLayerProps {
  geoJson?: string;
}

export const HeatmapLayer = memo(({geoJson}: HeatmapLayerProps) => {
  return (
    <>
      <Source id={`building-heatmap`} type="geojson" data={geoJson} />
      <Layer
        id="building-heatmap"
        type="fill"
        source="building-heatmap"
        paint={{
          'fill-color': ['coalesce', ['get', 'color'], 'grey'],
          'fill-opacity': ['case', ['==', ['get', 'color'], 'grey'], 0, ['==', ['get', 'color'], null], 0, 1]
        }}
        beforeId={`3d-buildings`}
      />
    </>
  );
});
