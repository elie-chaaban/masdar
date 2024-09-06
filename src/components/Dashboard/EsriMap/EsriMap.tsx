import React, {forwardRef, useCallback, useState, useEffect, MutableRefObject, CSSProperties, useRef} from 'react';
import Camera from '@arcgis/core/Camera';
import SceneView from '@arcgis/core/views/SceneView';
import esriConfig from '@arcgis/core/config';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import ObjectSymbol3DLayer from '@arcgis/core/symbols/ObjectSymbol3DLayer';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import PointSymbol3D from '@arcgis/core/symbols/PointSymbol3D';
import WebScene from '@arcgis/core/WebScene';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import _, {isNumber} from 'lodash';
import {BuildingInfo, BuildingInfoDetailsRow} from '../../../hooks/useBuildingsInfoData';
import {formatDecimals} from '../../../utils/dashboard';

const styles: Styles = createStyles(({colors, spacing}) => ({
  map: {
    width: '100%',
    height: '100%'
  }
}));

export type EsriModelType = 'building' | 'shell';

export interface Esri3DModel {
  id: string;
  name: string;
  url: string;
  modelUrl: string;
  shellUrl: string;
  modelType: EsriModelType;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  hasData: boolean;
}
export interface EsriInitialViewPort {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
  altitude: number;
}

export interface BuildingConsumptionAlert {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  waterDifference: number;
  energyDifference: number;
}
export interface EsriMapProps {
  apiKey: string;
  esriWebScenePortalId: string;
  esriWebSceneBaseMap: string;
  onModelClick: (model: Esri3DModel) => void;
  onDeselect: () => void;
  models?: Esri3DModel[];
  style?: CSSProperties;
  initialViewPort: EsriInitialViewPort;
  zoomLevel?: number;
  buildingsInfo: BuildingInfo[];
  buildingsInfoLoading: boolean;
  getRows: (buildingInfo: BuildingInfo) => BuildingInfoDetailsRow[];
  buildingsConsumptionAlerts: BuildingConsumptionAlert[];
}

export interface EsriMapRef extends HTMLDivElement {
  goTo: (esriCameraProps: Camera) => void;
  removeGraphic: (graphicId: string) => void;
  addGraphic: (model: Esri3DModel) => void;
  addBuildingInfo: (model: BuildingInfo) => void;
  webscene: WebScene;
  sceneView: SceneView;
  graphicsLayer: GraphicsLayer;
}

function customEasing(t: number) {
  return 1 - Math.abs(Math.sin(-1.7 + t * 4.5 * Math.PI)) * Math.pow(0.5, t * 10);
}

export const EsriMap = forwardRef<EsriMapRef, EsriMapProps>(
  (
    {
      apiKey,
      models,
      onModelClick,
      style,
      esriWebScenePortalId,
      esriWebSceneBaseMap,
      initialViewPort,
      zoomLevel,
      onDeselect,
      buildingsInfo,
      buildingsInfoLoading,
      getRows,
      buildingsConsumptionAlerts
    },
    ref
  ) => {
    const [graphics, setGraphics] = useState<Graphic[]>([]);
    const [consumptionAlerts, setConsumptionAlerts] = useState<Graphic[]>([]);
    const mapRef: MutableRefObject<EsriMapRef> = ref as MutableRefObject<EsriMapRef>;
    const mapOnClickRef = useRef<IHandle>();
    const mapOnMoveRef = useRef<IHandle>();

    useEffect(() => {
      if (!consumptionAlerts.length && mapRef?.current?.graphicsLayer && buildingsConsumptionAlerts?.length) {
        const newGraphics: Graphic[] = [];
        buildingsConsumptionAlerts.forEach((alert) => {
          if (alert.waterDifference === 0 && alert.energyDifference === 0) return;
          let alarmText = ``;
          if (alert.energyDifference > 0 && alert.waterDifference > 0) {
            alarmText = `${alert.energyDifference}% Energy Consumption\n${alert.waterDifference}% Water Consumption`;
          } else if (alert.energyDifference > 0) {
            alarmText = `${alert.energyDifference}% Energy Consumption`;
          } else if (alert.waterDifference > 0) {
            alarmText = `${alert.waterDifference}% Water Consumption`;
          }

          const textSymbol = {
            type: 'text',
            color: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.40)',
            text: alarmText,
            verticalAlignment: 'middle',
            font: {
              size: 8,
              weight: 'bold'
            }
          };
          const textSymbolPoint = new Point({
            x: alert.longitude,
            y: alert.latitude,
            z: 999
          });

          const graphic = new Graphic({
            symbol: textSymbol,
            geometry: textSymbolPoint
          });
          mapRef.current.graphicsLayer.add(graphic);
          newGraphics.push(graphic);
        });
        setConsumptionAlerts(newGraphics);
      }
    }, [consumptionAlerts.length, mapRef, buildingsConsumptionAlerts]);

    useEffect(() => {
      if (!graphics.length && mapRef?.current?.graphicsLayer && models?.length) {
        const newGraphics: Graphic[] = [];
        models.forEach((model) => {
          const point = new Point({
            x: model.coordinates.longitude, //Longitude
            y: model.coordinates.latitude, //Latitude
            z: 0
          });

          const symbol = new ObjectSymbol3DLayer({
            resource: {
              href: model.url
            },
            anchor: 'origin',
            castShadows: true,
            heading: 37
          });

          const pointSymbol = new PointSymbol3D({
            symbolLayers: [symbol]
          });

          const pointGraphic = new Graphic({
            geometry: point,
            symbol: pointSymbol,
            attributes: {id: model.id, type: 'building', name: model.name, hasData: model.hasData}
          });

          mapRef.current.graphicsLayer.add(pointGraphic);
          newGraphics.push(pointGraphic);
        });
        setGraphics(newGraphics);
      }
    }, [graphics.length, mapRef, models]);

    useEffect(() => {
      if (mapRef?.current?.sceneView && models?.length) {
        if (mapOnClickRef.current) {
          mapOnClickRef.current.remove();
        }
        const remove = mapRef.current.sceneView.on('click', async (e: any) => {
          const res = await mapRef.current.sceneView.hitTest(e);

          if (res.results?.length > 0) {
            //@ts-ignore
            const graphic = res.results[0].graphic;
            if (graphic && graphic.attributes?.type === 'building') {
              const model = models?.find((m) => m.id === graphic.attributes.id);
              if (model) {
                onModelClick(model);
              }
            }
          } else {
            onDeselect();
          }
        });
        mapOnClickRef.current = remove;
      }
    }, [mapRef, models, onDeselect, onModelClick]);

    const removeGraphic = useCallback(
      (graphicId: string) => {
        if (mapRef) {
          // const graphic = graphics.find((g) => g.attributes.id === graphicId);
          // const foundIndex = graphics.findIndex((g) => g.attributes.id === graphicId);
          // if (graphic) {
          //   mapRef.current.graphicsLayer.remove(graphic);
          // }
          // if (foundIndex !== -1) {
          //   graphics.splice(foundIndex, 1);
          //   setGraphics(graphics);
          // }
        }
      },
      [mapRef]
    );

    const addGraphic = useCallback(
      (model: Esri3DModel) => {
        if (mapRef) {
          const point = new Point({
            x: model.coordinates.longitude, //Longitude
            y: model.coordinates.latitude, //Latitude
            z: 0
          });

          const symbol = new ObjectSymbol3DLayer({
            resource: {
              href: model.url
            },
            anchor: 'origin',
            castShadows: true,
            heading: 37
          });

          const pointSymbol = new PointSymbol3D({
            symbolLayers: [symbol]
          });

          const pointGraphic = new Graphic({
            geometry: point,
            symbol: pointSymbol,
            attributes: {id: model.id, type: 'building'}
          });

          mapRef.current.graphicsLayer.add(pointGraphic);
          graphics.push(pointGraphic);
          setGraphics(graphics);
        }
      },
      [graphics, mapRef]
    );

    const goTo = useCallback(
      (esriCameraProps: Camera) => {
        if (mapRef) {
          mapRef.current.sceneView.goTo(esriCameraProps);
        }
      },
      [mapRef]
    );

    useEffect(() => {
      if (mapRef) {
        mapRef.current.removeGraphic = removeGraphic;
        mapRef.current.goTo = goTo;
        mapRef.current.addGraphic = addGraphic;
      }
    }, [mapRef, addGraphic, removeGraphic, goTo]);

    useEffect(() => {
      esriConfig.apiKey = apiKey;
      esriConfig.request.timeout = 999999999;
      if (mapRef) {
        const webscene = new WebScene({
          portalItem: {
            id: esriWebScenePortalId
          },
          basemap: esriWebSceneBaseMap ? esriWebSceneBaseMap : 'arcgis-navigation' // 'arcgis-community' is the default
        });
        mapRef.current.webscene = webscene;

        const sceneView = new SceneView({
          qualityProfile: 'high',
          container: mapRef.current,
          map: webscene,
          constraints: {
            altitude: {
              min: 0,
              max: 1000
            },
            clipDistance: {
              near: 50,
              far: 100000,
              mode: 'manual'
            }
          },
          camera: {
            position: {x: initialViewPort.longitude, y: initialViewPort.latitude, z: initialViewPort.altitude},
            fov: initialViewPort.zoom,
            heading: initialViewPort.bearing,
            tilt: initialViewPort.pitch
          }
        });
        //@ts-ignore
        sceneView.environment = {
          //@ts-ignore
          lighting: {
            type: 'sun',
            directShadowsEnabled: true,
            date: new Date('January 1, 2022 10:00:00 UTC')
          }
        };

        mapRef.current.sceneView = sceneView;
        const graphicsLayer = new GraphicsLayer({
          id: 'graphicsLayer',
          elevationInfo: {mode: 'on-the-ground'}
        });

        sceneView.map.add(graphicsLayer);

        mapRef.current.graphicsLayer = graphicsLayer;

        sceneView.when(() => {
          sceneView.popup.autoOpenEnabled = false;
          // webscene.allLayers.forEach((layer) => {
          //   if (layer.type === 'building-scene') {
          //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
          //     const buildingExplorer = new BuildingExplorer({
          //       view: sceneView,
          //       layers: [layer]
          //     });
          //   }
          // });
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiKey, esriWebSceneBaseMap, esriWebScenePortalId, mapRef, initialViewPort]);

    useEffect(() => {
      if (mapOnMoveRef.current) mapOnMoveRef.current.remove();
      const onMove = mapRef.current?.sceneView.on(
        'pointer-move',
        _.debounce((event) => {
          mapRef.current?.sceneView.hitTest(event).then((res) => {
            if (res.results.length > 0) {
              //@ts-ignore
              const graphic = res.results[0].graphic;
              if (graphic && graphic.attributes?.type === 'building') {
                const graphicHasData = graphic.attributes?.hasData;
                if (!graphicHasData) return mapRef.current?.sceneView.popup.close();
                const graphicId = graphic.attributes?.id;
                const graphicName = graphic.attributes?.name;
                if (graphicId) {
                  const buildingInfo = buildingsInfo.find((x) => x.id === graphicId);
                  if (buildingsInfoLoading) {
                    const popupTemplate = new PopupTemplate({
                      title: `<div><h6>${graphicName}</h6></div>`,
                      content: `<div><p>Loading, please wait..</p></div>`
                    });
                    graphic.popupTemplate = popupTemplate;
                    mapRef.current?.sceneView.popup.open({
                      location: graphic.geometry,
                      features: [graphic]
                    });
                    mapRef.current?.sceneView.popup.open({
                      location: graphic.geometry,
                      features: [graphic]
                    });
                  } else if (buildingInfo) {
                    const rows = getRows(buildingInfo);
                    const content = rows
                      .map((row: BuildingInfoDetailsRow) => {
                        return `<div><span>${row?.value ? (isNumber(row.value) ? formatDecimals(row.value, 1) : row.value) : '0'}: ${
                          row?.label || ''
                        }</span></div>`;
                      })
                      .join('');
                    const popupTemplate = new PopupTemplate({
                      title: `<div><h6>${buildingInfo.name.toUpperCase()}</h6></div>`,
                      content: content
                    });
                    graphic.popupTemplate = popupTemplate;
                    mapRef.current?.sceneView.popup.open({
                      location: graphic.geometry,
                      features: [graphic]
                    });
                  }
                }
              } else {
                mapRef.current?.sceneView.popup.close();
              }
            } else {
              mapRef.current?.sceneView.popup.close();
            }
          });
        }, 200)
      );
      mapOnMoveRef.current = onMove;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buildingsInfoLoading, buildingsInfo]);

    useEffect(() => {
      if (mapRef.current.sceneView && zoomLevel) {
        mapRef.current.sceneView.zoom = zoomLevel;
      }
    }, [mapRef, zoomLevel]);

    console.log('camera', {
      latitude: mapRef.current?.sceneView?.camera.position.latitude,
      longitude: mapRef.current?.sceneView?.camera.position.longitude,
      altitude: mapRef.current?.sceneView?.camera.position.z,
      zoom: mapRef.current?.sceneView?.camera.fov,
      pitch: mapRef.current?.sceneView?.camera.tilt,
      bearing: mapRef.current?.sceneView?.camera.heading
    });
    return <div ref={mapRef} style={{...styles.map, ...style}}></div>;
  }
);
