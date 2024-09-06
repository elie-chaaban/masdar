import React, {useEffect, useState} from 'react';
import {CustomLayerProps, loadModel, onAdd, render, raycast, onRemove} from './Utils';
import {Layer} from 'react-map-gl';

export const AssetLayer = React.memo(
  ({
    district,
    asset: {
      id,
      url,
      coordinates,
      scale,
      rotation,
      ambientLight,
      dirlight,
      firstDirectionalLightPositionX,
      firstDirectionalLightPositionY,
      firstDirectionalLightPositionZ,
      secondDirectionalLightPositionX,
      secondDirectionalLightPositionY,
      secondDirectionalLightPositionZ
    }
  }: any) => {
    const [layer, setLayer] = useState<CustomLayerProps | null>(null);
    useEffect(() => {
      const prepareLayer = async () => {
        const properties = {
          id: `asset-3d-model-${id}`,
          type: 'custom' as CustomLayerProps['type'],
          renderingMode: '3d' as CustomLayerProps['renderingMode'],
          assetId: id,
          modelId: id,
          district
        };
        const gltf = await loadModel(process.env['REACT_APP_FILES_URL'] + url);
        const layer: CustomLayerProps = {
          ...properties,
          render: () => {}
        };
        layer.onAdd = onAdd(
          layer,
          'assets',
          gltf,
          {color: 0x404040, intensity: ambientLight},
          {
            color: 0xffffff,
            intensity: dirlight,
            first: {
              x: Math.floor(firstDirectionalLightPositionX),
              y: Math.floor(firstDirectionalLightPositionY),
              z: Math.floor(firstDirectionalLightPositionZ)
            },
            second: {
              x: Math.floor(secondDirectionalLightPositionX),
              y: Math.floor(secondDirectionalLightPositionY),
              z: Math.floor(secondDirectionalLightPositionZ)
            }
          }
        );
        layer.onRemove = onRemove('assets', `asset-3d-model-${id}`);
        layer.render = render(layer, coordinates, scale, rotation, 0);
        layer.raycast = raycast(layer);
        setLayer(layer);
      };
      prepareLayer();
    }, [
      id,
      district,
      coordinates,
      scale,
      rotation,
      url,
      ambientLight,
      dirlight,
      firstDirectionalLightPositionX,
      firstDirectionalLightPositionY,
      firstDirectionalLightPositionZ,
      secondDirectionalLightPositionX,
      secondDirectionalLightPositionY,
      secondDirectionalLightPositionZ
    ]);
    return layer ? <Layer {...layer} /> : null;
  }
);
