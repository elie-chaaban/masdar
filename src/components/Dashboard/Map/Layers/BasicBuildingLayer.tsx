import React, {useEffect, useState} from 'react';
import {CustomLayerProps, loadModel, basicOnAdd, render} from './Utils';
import {Layer} from 'react-map-gl';

export const BasicBuildingLayer = React.memo(({building: {id, url, coordinates, scale, rotation, ambientLight, dirlight}}: any) => {
  const [layer, setLayer] = useState<CustomLayerProps | null>(null);
  useEffect(() => {
    const prepareLayer = async () => {
      const properties = {
        id: `basic-building-3d-model-${id}`,
        type: 'custom' as CustomLayerProps['type'],
        renderingMode: '3d' as CustomLayerProps['renderingMode']
      };
      const gltf = await loadModel(url);
      const layer: CustomLayerProps = {
        ...properties,
        render: () => {}
      };
      layer.onAdd = basicOnAdd(layer, gltf, {color: 0x404040, intensity: ambientLight});
      layer.render = render(layer, coordinates, scale, rotation, 2);
      setLayer(layer);
    };
    prepareLayer();
  }, [id, coordinates, scale, rotation, url, ambientLight, dirlight]);
  return layer ? <Layer {...layer} /> : null;
});
