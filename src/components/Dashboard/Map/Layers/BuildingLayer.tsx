import React, {useEffect, useState, useCallback} from 'react';
import {CustomLayerProps, loadModel, onAdd, render, raycast, onRemove} from './Utils';
import {useSelector} from 'react-redux';
import {Layer} from 'react-map-gl';

export const BuildingLayer = React.memo(
  ({
    district,
    building: {
      id,
      url,
      coordinates,
      scale,
      rotation,
      ambientLight,
      dirlight,
      shell_gltf_url,
      isHeatmapEnabled,
      firstDirectionalLightPositionX,
      firstDirectionalLightPositionY,
      firstDirectionalLightPositionZ,
      secondDirectionalLightPositionX,
      secondDirectionalLightPositionY,
      secondDirectionalLightPositionZ
    }
  }: any) => {
    const [layer, setLayer] = useState<CustomLayerProps | null>(null);
    const [shellLayer, setShellLayer] = useState<CustomLayerProps | null>(null);
    const buildingId = useSelector((s: any) => s.map.building);

    const prepareLayer = useCallback(
      async (gltfUrl: string, gltfType: 'layer' | 'shell') => {
        const properties = {
          id: `building-3d-model-${id}-${gltfType === 'layer' ? 'layer' : 'shell'}`,
          type: 'custom' as CustomLayerProps['type'],
          renderingMode: '3d' as CustomLayerProps['renderingMode'],
          buildingId: id,
          modelId: id,
          district
        };
        const gltf = await loadModel(gltfUrl);
        const layer: CustomLayerProps = {
          ...properties,
          render: () => {}
        };
        layer.onAdd = onAdd(
          layer,
          'layers3d',
          gltf,
          {color: 0xffffff, intensity: ambientLight},
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
        layer.onRemove = onRemove('layers3d', `building-3d-model-${id}-${gltfType === 'layer' ? 'layer' : 'shell'}`);
        layer.render = render(layer, coordinates, scale, rotation, 0);
        layer.raycast = raycast(layer);
        if (gltfType === 'layer') {
          setShellLayer(null);
          setLayer(layer);
        } else {
          setLayer(null);
          setShellLayer(layer);
        }
      },
      [
        id,
        coordinates,
        scale,
        rotation,
        ambientLight,
        dirlight,
        district,
        firstDirectionalLightPositionX,
        firstDirectionalLightPositionY,
        firstDirectionalLightPositionZ,
        secondDirectionalLightPositionX,
        secondDirectionalLightPositionY,
        secondDirectionalLightPositionZ
      ]
    );

    useEffect(() => {
      if (!isHeatmapEnabled) {
        if (buildingId) {
          if (buildingId === id) {
            //Selected
            prepareLayer(shell_gltf_url, 'shell');
          } else {
            //Not selected
            prepareLayer(url, 'layer');
          }
        } else {
          //Not selected
          prepareLayer(url, 'layer');
        }
      }
    }, [buildingId, id, url, shell_gltf_url, isHeatmapEnabled, prepareLayer]);

    useEffect(() => {
      prepareLayer(url, 'layer');
    }, [id, url, prepareLayer]);

    if (layer) {
      return <Layer {...layer} />;
    } else if (shellLayer) {
      return <Layer {...shellLayer} />;
    } else {
      return null;
    }
  }
);
