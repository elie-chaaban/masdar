import React, {useEffect, useState} from 'react';
import {CustomLayerProps, loadModel, onAdd, render, raycast, onRemove} from './Utils';
import {Layer} from 'react-map-gl';
//@ts-ignore
import AlarmGLTF from '../../../../assets/gltfs/alarm.gltf';

export const AlarmLayer = React.memo(
  ({
    district,
    alarm: {
      id,
      url,
      coordinates,
      scale,
      rotation,
      altitude,
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
          id: `alarm-3d-model-${id}`,
          type: 'custom' as CustomLayerProps['type'],
          renderingMode: '3d' as CustomLayerProps['renderingMode'],
          alarmId: id,
          modelId: id,
          district
        };
        const gltf = await loadModel(url);
        // const gltf = await loadModel(AlarmGLTF);
        const alarm = null; //await loadModel(process.env['REACT_APP_FILES_URL'] + 'gltf-icons/alert.gltf');
        const layer: CustomLayerProps = {
          ...properties,
          render: () => {}
        };
        layer.onAdd = onAdd(
          layer,
          'alarms',
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
          },
          alarm
        );
        layer.render = render(layer, coordinates, scale, rotation, altitude);
        layer.onRemove = onRemove('alarms', `alarm-3d-model-${id}`);
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
      altitude,
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
