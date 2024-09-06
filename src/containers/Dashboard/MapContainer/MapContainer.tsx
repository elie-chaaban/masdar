import React, {useRef, useEffect, useState, useCallback, MutableRefObject, CSSProperties, useMemo} from 'react';
import {MapLayerMouseEvent} from 'mapbox-gl';
import {ViewStateChangeEvent} from 'react-map-gl';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {useSelector, useDispatch} from 'react-redux';

import {
  buildingSelection,
  floorSelection,
  setIsAddAssetModalOpened,
  setTempAsset,
  updateMapAsset,
  wasteLocationSelection,
  setWasteLocations as setWasteLocationsAction,
  getBuildingsConsumptionAlerts
  // @ts-ignore
} from '../../../reduxStore/actions';
import {Map} from '../../../components/Dashboard/Map';
import {DefaultBuildingsLayer, BuildingLayer, AssetLayer, AlarmLayer} from '../../../components/Dashboard/Map/Layers';
import {MBMapRef} from '../../../components/Dashboard/Map/Layers/Utils';
// @ts-ignore
import Floors from '../../../components/Map/Buildings/Floors';
import {HeatmapLayerContainer} from './HeatmapLayerContainer';
//@ts-ignore
import {fetchAlarms} from '../../../services/dashBoard';
//@ts-ignore
import {fetchWasteLocations} from '../../../services/waste';
//@ts-ignore
import {AlarmMarker, AlarmVariant} from '../../../components/Dashboard/Map/Markers';
import {SeveritiesModal} from '../../../components/Dashboard/SeveritiesModal';
import {BuildingInfo, BuildingsInfoContainer} from './BuildingsInfoContainer';
import {
  FILTER_PV_CHART_INDEX,
  SustainabilityTrendLineAndBreakdown
} from '../../../components/Dashboard/SustainabilityTrendLineAndBreakdown';
import {AirQualityDrillDownContainer} from '../Home/AirQualityDrillDownContainer';
import 'animate.css';
import {Esri3DModel, EsriMap, EsriMapRef} from '../../../components/Dashboard/EsriMap';
import Camera from '@arcgis/core/Camera';
import Point from '@arcgis/core/geometry/Point';
import useBuildingsInfoData from '../../../hooks/useBuildingsInfoData';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flex
  },
  alarmModal: {
    position: 'absolute',
    top: 80,
    left: 0
  },
  pvProductionWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.lightBackground
  },
  pvProductionTrendLine: {
    borderRadius: 0
  }
}));

export interface MapContainerProps {
  style?: CSSProperties;
  mapStyle?: CSSProperties;
}

export const MapContainer = ({style, mapStyle}: MapContainerProps) => {
  const dispatch = useDispatch();
  const {getRows, fetchBuildingsInfo} = useBuildingsInfoData();
  const mapRef = useRef<MBMapRef>() as MutableRefObject<MBMapRef>;
  const {
    buildings,
    district,
    isLoadingFloors,
    districtInfo,
    building,
    showAlarms,
    buildingsInfo,
    activeBuildingInfoId,
    buildingsInfoLoading,
    playSequenceAnimation
  } = useSelector((s: any) => s.map);
  const mapAssets = useSelector((s: any) => s.map.mapAssets);
  const [selectedMapAsset, setSelectedMapAsset] = useState(null);

  const {access, kpi, mapboxAccessToken, mapboxStyleUrl, mapType, esriApiKey, esriWebScenePortalId, esriWebSceneBaseMap} = useSelector(
    (s: any) => s.user.access
  );

  const {
    isOpenInsightSlider,
    districtPvProductionChart,
    isAirQualityDrillDownOpened,
    insight,
    showSlider,
    isIntersectionDataSliderOpened,
    dateFilter
  } = useSelector((s: any) => s.dashboard);
  const {filter, startDate, endDate} = dateFilter;
  const {buildingsConsumptionAlerts, isAddAssetFeatureEnabled} = useSelector((s: any) => s.map);
  const {longitude, latitude, zoom, bearing, pitch, altitude, extrusion, slider_view_port} = districtInfo;
  const [currentSelectedBuilding, setCurrentSelectedBuilding] = useState<any>(null);
  const [buildingsAlarms, setBuildingsAlarms] = useState<any>([]);
  const [floorsAlarms, setFloorsAlarms] = useState<any>([]);
  const [selectedAlarm, setSelectedAlarm] = useState<any>(null);
  const [wasteLocations, setWasteLocations] = useState<any>([]);
  const [savedTrees, setSavedTrees] = useState<any>([]);
  const [esriModels, setEsriModels] = useState([]);
  const esriSelectedModel = useRef<Esri3DModel | null>();
  const esriMapRef = useRef<EsriMapRef>() as MutableRefObject<EsriMapRef>;
  const hasWasteAccess = kpi['waste']?.some((b: any) => b.district_id === district);

  useEffect(() => {
    if (buildings?.length > 0) {
      const tempBuildings = buildings.map((b: any) => ({
        id: b.id,
        url: b.url,
        modelUrl: b.url,
        shellUrl: b.shell_gltf_url,
        modelType: 'building',
        coordinates: {
          latitude: b.coordinates[1],
          longitude: b.coordinates[0]
        },
        name: b.name,
        hasData: b.hasData
      }));
      setEsriModels(tempBuildings);
    }
  }, [buildings]);

  useEffect(() => {
    if (district && startDate && endDate) {
      dispatch(getBuildingsConsumptionAlerts(district, startDate, endDate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district, startDate, endDate]);

  useEffect(() => {
    if (buildings && district && startDate && endDate && filter) {
      setTimeout(fetchBuildingsInfo, 10000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildings, district, endDate, filter, startDate]);

  useEffect(() => {
    if (!hasWasteAccess) return;
    const fetch = async () => {
      let locations = await fetchWasteLocations(district);
      locations.map((l: any) => ({...l, active: false}));
      setWasteLocations(locations);
      dispatch(setWasteLocationsAction(locations));
    };

    fetch();
  }, [dispatch, district, insight, hasWasteAccess]);

  useEffect(() => {
    const {longitude, latitude, zoom, bearing, pitch} = districtInfo;
    setTimeout(() => {
      mapRef?.current?.getMap()?.flyTo({
        center: {
          lat: latitude,
          lng: longitude
        },
        zoom: zoom,
        pitch: pitch,
        bearing: bearing
      });
    }, 200);
  }, [districtInfo, mapRef]);

  useEffect(() => {
    if (buildings) {
      const found = buildings.find((b: any) => b.id === building);
      if (found) setCurrentSelectedBuilding(found);
    } else {
      setCurrentSelectedBuilding(null);
    }
  }, [building, buildings]);

  const selectMapAsset = useCallback(
    (asset: any) => {
      if (asset) {
        if (selectedMapAsset) {
          dispatch(updateMapAsset(selectedMapAsset, false));
        }
        dispatch(updateMapAsset(asset, true));
      } else {
        if (selectedMapAsset) {
          dispatch(updateMapAsset(selectedMapAsset, false));
        }
      }
      setSelectedMapAsset(asset);
    },
    [dispatch, selectedMapAsset, setSelectedMapAsset]
  );

  const changeViewport = useCallback(({zoom, pitch, bearing, latitude, longitude, altitude}: any) => {
    setTimeout(() => {
      if (mapType === 0) {
        mapRef?.current?.getMap()?.flyTo({
          center: {
            lat: latitude,
            lng: longitude
          },
          zoom: zoom,
          pitch: pitch,
          bearing: bearing
        });
      } else {
        let cam = new Camera({
          position: new Point({
            x: longitude,
            y: latitude,
            z: altitude
          }),
          fov: zoom,
          heading: bearing,
          tilt: pitch
        });
        esriMapRef.current?.goTo(cam);
      }
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onWasteLocationSelected = useCallback(
    (location: string | null) => {
      if (location) {
        const tempLocations = JSON.parse(JSON.stringify(wasteLocations));
        tempLocations.forEach((l: any) => {
          if (l.location === location) {
            l.active = true;
          } else {
            l.active = false;
          }
        });
        setWasteLocations(tempLocations);
      }
      dispatch(wasteLocationSelection(location));
    },
    [dispatch, wasteLocations]
  );

  const selectABuilding = useCallback(
    (building: any) => {
      const found = wasteLocations.find((w: any) => w.buildingId?.toLowerCase() === building.id.toLowerCase());
      const clickedBuilding = buildings.find((b: any) => building.id.toLowerCase() === b.id.toLowerCase());
      if (!clickedBuilding?.hasData) return;
      if (found?.location) {
        onWasteLocationSelected(found.location);
      } else {
        onWasteLocationSelected(null);
      }
      const alarm = buildingsAlarms.find((a: any) => a.buildingId.toLowerCase() === building.id.toLowerCase());
      if (alarm) {
        setSelectedAlarm({
          ...alarm,
          severityTitle: `${building.name.toUpperCase()} ALARMS`,
          severityDetails: {
            critical: alarm.critical,
            maintenance: alarm.maintenance,
            lifeSafety: alarm.lifeSafety
          }
        });
      }
      dispatch(buildingSelection(building.id));
      if (mapType !== 1) {
        const vPort = {longitude: building.buildingZoom.center[0], latitude: building.buildingZoom.center[1], ...building.buildingZoom};
        if (!isIntersectionDataSliderOpened && !isOpenInsightSlider && !showSlider) changeViewport(vPort);
      }
    },
    [
      buildings,
      buildingsAlarms,
      changeViewport,
      dispatch,
      isIntersectionDataSliderOpened,
      isOpenInsightSlider,
      mapType,
      onWasteLocationSelected,
      showSlider,
      wasteLocations
    ]
  );

  const deselectAnySelectedBuilding = useCallback(() => {
    esriSelectedModel.current = null;
    if (selectedAlarm) {
      setSelectedAlarm(null);
      return;
    }
    if (building) {
      onWasteLocationSelected('');
      dispatch(buildingSelection());
      if (mapType !== 1) {
        const vPort = {zoom, pitch, bearing, longitude, latitude, altitude};
        if (!isIntersectionDataSliderOpened && !isOpenInsightSlider && !showSlider) changeViewport(vPort);
      }
    }
  }, [
    altitude,
    bearing,
    building,
    changeViewport,
    dispatch,
    isIntersectionDataSliderOpened,
    isOpenInsightSlider,
    latitude,
    longitude,
    mapType,
    onWasteLocationSelected,
    pitch,
    selectedAlarm,
    showSlider,
    zoom
  ]);

  const selectAFloor = useCallback(
    (floorId: string) => {
      setSelectedAlarm(null);
      dispatch(floorSelection(floorId));
    },
    [dispatch]
  );

  const onClick = useCallback(
    (click: MapLayerMouseEvent) => {
      if (click) {
        if (isAddAssetFeatureEnabled) {
          const coords = {lng: click.lngLat.lng, lat: click.lngLat.lat};
          dispatch(setIsAddAssetModalOpened(true, false, coords));
          dispatch(setTempAsset(coords, 270));
        }

        // Find what did we hit, what is the clicked model
        let clickedModelId: string | null = null;
        mapRef?.current?.getMap().layers3d?.forEach((layer) => {
          const hit = layer && layer.raycast && layer.raycast(click);
          if (hit) {
            clickedModelId = hit;
          }
        });

        // Find what alarm we clicked
        let clickedAlarmId: string | null = null;
        mapRef?.current?.getMap().alarms?.forEach((layer) => {
          const hit = layer && layer.raycast && layer.raycast(click);
          if (hit) {
            clickedAlarmId = hit;
          }
        });

        // Check if the clicked is a map asset
        const selectedAsset = mapAssets.find((a: any) => clickedModelId === a.asset_id);
        if (selectedAsset) {
          // select the map asset and return
          selectMapAsset(selectedAsset);
          return;
        } else {
          selectMapAsset(null);
        }

        // Check if the clicked is an alarm
        const selectedAlarm = floorsAlarms.find((a: any) => clickedAlarmId === a.id);
        if (selectedAlarm) {
          // select the map asset and return
          setSelectedAlarm(selectedAlarm);
          return;
        }

        let hasBuildingAccess = false;
        if (clickedModelId && access && !isLoadingFloors) {
          hasBuildingAccess = access.buildings.indexOf(clickedModelId) !== -1;
        }

        const isTheClickedAFloor = mapRef?.current
          ?.getMap()
          .queryRenderedFeatures(click.point)
          .some(({layer}) => layer.id === 'floors');

        if (hasBuildingAccess && !isTheClickedAFloor) {
          // Building selection
          const clickedBuilding = buildings.find((b: any) => clickedModelId === b.id);
          if (clickedBuilding) {
            // select the building
            selectABuilding(clickedBuilding);
          } else {
            // deselect any selected building
            deselectAnySelectedBuilding();
          }
        } else {
          // Floor selection
          const features = mapRef?.current?.getMap().queryRenderedFeatures(click.point);
          if (!features.length) {
            // deselect any selected building
            deselectAnySelectedBuilding();
          } else {
            if (features && features[0].properties && features[0].properties.floor) {
              // select a floor
              selectAFloor(features[0].properties.floor);
            } else {
              // deselect any selected building
              deselectAnySelectedBuilding();
            }
          }
        }
      }
    },
    [
      isAddAssetFeatureEnabled,
      mapAssets,
      floorsAlarms,
      access,
      isLoadingFloors,
      dispatch,
      selectMapAsset,
      buildings,
      selectABuilding,
      deselectAnySelectedBuilding,
      selectAFloor
    ]
  );

  const groupAlarms = useCallback(
    (alarms: {buildingId: string; floorNb: number; floorId: string; critical: number; maintenance: number; lifeSafety: number}[]) => {
      const buildingsAlarmsList = [];
      const buildingLevelAlarm: any = {};

      const findFloor = (floorId: string) => {
        for (let i = 0; i < buildings.length; i++) {
          const building = buildings[i];
          for (let j = 0; j < building.floors.length; j++) {
            const floor = building.floors[j];
            if (floor.id.toLowerCase() === floorId.toLowerCase()) {
              return floor;
            }
          }
        }
        return null;
      };

      alarms.forEach((alarm) => {
        if (!buildingLevelAlarm.hasOwnProperty(alarm.buildingId)) {
          const building = buildings.find((b: any) => b.id.toLowerCase() === alarm.buildingId.toLowerCase());
          buildingLevelAlarm[alarm.buildingId] = {
            buildingId: alarm.buildingId,
            critical: 0,
            maintenance: 0,
            lifeSafety: 0,
            latitude: building.alarmLatitude || 0,
            longitude: building.alarmLongitude || 0,
            offsetX: building.alarmOffsetX || 0,
            offsetY: building.alarmOffsetY || -80,
            title: `${building.name.toUpperCase()} ALARMS`,
            floors: []
          };
        }
        buildingLevelAlarm[alarm.buildingId].critical += alarm.critical ? alarm.critical : 0;
        buildingLevelAlarm[alarm.buildingId].maintenance += alarm.maintenance ? alarm.maintenance : 0;
        buildingLevelAlarm[alarm.buildingId].lifeSafety += alarm.lifeSafety ? alarm.lifeSafety : 0;
        const associatedFloor = findFloor(alarm.floorId);
        if (associatedFloor && (alarm.critical || alarm.maintenance || alarm.lifeSafety)) {
          buildingLevelAlarm[alarm.buildingId].floors.push({
            id: `floor-${alarm.floorId}-alarm`,
            url: 'https://cdistrict.blob.core.windows.net/uploads/floor-alarm.gltf',
            coordinates: [
              associatedFloor.alarmLongitude ? parseFloat(associatedFloor.alarmLongitude) : 0,
              associatedFloor.alarmLatitude ? parseFloat(associatedFloor.alarmLatitude) : 0
            ],
            scale: associatedFloor.alarmScale || 4e-8,
            rotation: associatedFloor.alarmRotation ? eval(associatedFloor.alarmRotation) : [Math.PI / 2, 0.91, 0],
            ambientLight: 1,
            dirlight: 1,
            altitude: associatedFloor.alarmBaseHeight || 0,
            firstDirectionalLightPositionX: 0,
            firstDirectionalLightPositionY: 0,
            firstDirectionalLightPositionZ: 0,
            secondDirectionalLightPositionX: 0,
            secondDirectionalLightPositionY: 0,
            secondDirectionalLightPositionZ: 0,
            severityTitle: `${associatedFloor.name.toUpperCase()} ALARMS`,
            severityDetails: {
              critical: alarm.critical,
              maintenance: alarm.maintenance,
              lifeSafety: alarm.lifeSafety
            }
          });
        }
      });

      for (let key in buildingLevelAlarm) {
        const buildingAlarm = buildingLevelAlarm[key];
        if (buildingAlarm.critical || buildingAlarm.maintenance || buildingAlarm.lifeSafety) {
          buildingsAlarmsList.push(buildingAlarm);
        }
      }

      setBuildingsAlarms(buildingsAlarmsList);
    },
    [buildings]
  );

  useEffect(() => {
    if (building) {
      const selectedBuildingAlarms = buildingsAlarms.find((b: any) => b.buildingId.toLowerCase() === building.toLowerCase());
      setFloorsAlarms(selectedBuildingAlarms?.floors || []);
    } else {
      setFloorsAlarms([]);
    }
  }, [building, buildingsAlarms]);

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchAlarms(district);
      if (response && response.alarms) {
        groupAlarms(response.alarms);
      }
    };
    if (!floorsAlarms.length) fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district, buildings, groupAlarms]);

  useEffect(() => {
    let layers = mapRef?.current?.getMap().layers3d;
    let alarmsLayer = mapRef?.current?.getMap().alarms;
    layers &&
      layers.forEach((e: any) => {
        e.scene.visible = e.buildingId === building && e.district === district && !isLoadingFloors ? false : true;
      });
    alarmsLayer &&
      alarmsLayer.forEach((e: any) => {
        e.scene.visible = e.buildingId === building && !isLoadingFloors ? false : true;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef, building, isLoadingFloors]);

  useEffect(() => {
    let vPort;
    if (isIntersectionDataSliderOpened || isOpenInsightSlider || showSlider) {
      vPort = slider_view_port;
      if (building) {
        const clicked = buildings.find((b: any) => building === b.id);
        if (clicked) {
          vPort = {longitude: clicked.buildingZoom.center[0], latitude: clicked.buildingZoom.center[1], ...clicked.buildingZoom};
        } else {
          vPort = {zoom, pitch, bearing, longitude, latitude, altitude};
        }
      } else {
        vPort = {zoom, pitch, bearing, longitude, latitude, altitude};
      }
    } else {
      if (building) {
        const clicked = buildings.find((b: any) => building === b.id);
        if (clicked) {
          vPort = {longitude: clicked.buildingZoom.center[0], latitude: clicked.buildingZoom.center[1], ...clicked.buildingZoom};
        } else {
          vPort = {zoom, pitch, bearing, longitude, latitude, altitude};
        }
      } else {
        vPort = {zoom, pitch, bearing, longitude, latitude, altitude};
      }
    }
    if (mapType !== 1) {
      changeViewport(vPort);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersectionDataSliderOpened, isOpenInsightSlider, showSlider, building]);

  // const onSelectedAlarmClick = useCallback(() => {
  //   setSelectedAlarm(null);
  // }, []);

  const onEsriDeselect = useCallback(() => {
    if (esriMapRef) {
      if (esriSelectedModel.current) {
        // esriMapRef.current?.removeGraphic(esriSelectedModel.current.id);
        // esriSelectedModel.current.url =
        //   esriSelectedModel.current.modelType === 'shell' ? esriSelectedModel.current.modelUrl : esriSelectedModel.current.shellUrl;
        // esriSelectedModel.current.modelType = esriSelectedModel.current.modelType === 'shell' ? 'building' : 'shell';
        // esriMapRef.current?.addGraphic({...esriSelectedModel.current});
      }
    }
    deselectAnySelectedBuilding();
  }, [deselectAnySelectedBuilding]);

  const onEsriModelClick = useCallback(
    (model: Esri3DModel) => {
      if (esriMapRef) {
        const isSameBuilding = model.id.toLowerCase() === esriSelectedModel.current?.id.toLowerCase();
        if (esriSelectedModel.current) onEsriDeselect();
        if (isSameBuilding) return;

        // Building selection
        const clickedBuilding = buildings.find((b: any) => model.id.toLowerCase() === b.id.toLowerCase());

        if (clickedBuilding) {
          esriSelectedModel.current = model;
          selectABuilding(clickedBuilding);
          // esriMapRef.current?.removeGraphic(model.id);
          // model.url = model.modelType === 'shell' ? model.modelUrl : model.shellUrl;
          // model.modelType = model.modelType === 'shell' ? 'building' : 'shell';
          // esriMapRef.current?.addGraphic({...model});
        } else {
          onEsriDeselect();
        }
      }
    },
    [buildings, onEsriDeselect, selectABuilding]
  );

  const onMove = (e: ViewStateChangeEvent) => {
    console.log({
      bearing: e.viewState.bearing,
      latitude: e.viewState.latitude,
      longitude: e.viewState.longitude,
      zoom: e.viewState.zoom,
      pitch: e.viewState.pitch
    });
  };

  const districtInitialViewPort = useMemo(() => {
    return {
      longitude: districtInfo?.longitude,
      latitude: districtInfo?.latitude,
      altitude: districtInfo?.altitude,
      zoom: districtInfo?.zoom,
      bearing: districtInfo?.bearing,
      pitch: districtInfo?.pitch
    };
  }, [districtInfo]);

  const [zoomLevel, setZoomLevel] = useState(19.3);

  useEffect(() => {
    window.addEventListener('resize', () => {
      const browserZoomLevel = Math.round(window.devicePixelRatio * 100);
      const zoom = browserZoomLevel / 100;
      setZoomLevel(19.3 * zoom);
    });
  }, []);

  const updateCameraFocusedBuilding = useCallback(
    (building: any) => {
      dispatch(buildingSelection(building.id, false));
      const vPort = {longitude: building.buildingZoom.center[0], latitude: building.buildingZoom.center[1], ...building.buildingZoom};
      changeViewport(vPort);
      console.log('fly to', building);
    },
    [changeViewport, dispatch]
  );

  const intervalId = useRef<any>(null);

  useEffect(() => {
    if (playSequenceAnimation) {
      const filteredBuildings = buildings.filter((b: any) => b.hasData);
      const maxIndex = filteredBuildings.length;
      let buildingIndex = 0;

      intervalId.current = setInterval(() => {
        updateCameraFocusedBuilding(filteredBuildings[buildingIndex]);
        if (buildingIndex + 1 < maxIndex) {
          buildingIndex = buildingIndex + 1;
        } else {
          buildingIndex = 0;
        }
      }, 25000);
    } else {
      clearInterval(intervalId.current);
    }

    return () => clearInterval(intervalId.current);
  }, [playSequenceAnimation, buildings, updateCameraFocusedBuilding]);

  return (
    <div style={{...styles.container, ...style}}>
      {mapType === 1 ? (
        <EsriMap
          ref={esriMapRef}
          style={mapStyle}
          apiKey={esriApiKey}
          models={esriModels}
          onModelClick={onEsriModelClick}
          esriWebScenePortalId={esriWebScenePortalId}
          esriWebSceneBaseMap={esriWebSceneBaseMap}
          initialViewPort={districtInitialViewPort}
          zoomLevel={zoomLevel}
          onDeselect={onEsriDeselect}
          buildingsInfoLoading={buildingsInfoLoading}
          buildingsInfo={buildingsInfo}
          getRows={getRows}
          buildingsConsumptionAlerts={buildingsConsumptionAlerts}
        />
      ) : (
        <Map style={mapStyle} ref={mapRef} styleUrl={mapboxStyleUrl} accessToken={mapboxAccessToken} onClick={onClick} onMove={onMove}>
          <DefaultBuildingsLayer extrusion={extrusion} />
          {currentSelectedBuilding && currentSelectedBuilding.isHeatmapEnabled && <Floors />}
          <HeatmapLayerContainer />
          {buildings.map((b: any) => (
            <BuildingLayer mapRef={mapRef} district={district} building={b} key={b.id} />
          ))}
          {mapAssets.map((a: any) => (
            <AssetLayer district={district} key={a.id} asset={a} />
          ))}
          {showAlarms && floorsAlarms.map((a: any) => <AlarmLayer district={district} key={a.id} alarm={a} />)}
          {showAlarms && selectedAlarm && (
            <SeveritiesModal style={styles.alarmModal} title={selectedAlarm.severityTitle} severity={selectedAlarm.severityDetails} />
          )}
          <BuildingsInfoContainer />
          {isAirQualityDrillDownOpened && <AirQualityDrillDownContainer />}

          {districtPvProductionChart && filter && (
            <div style={styles.pvProductionWrapper} className="animate__animated animate__fadeInUp">
              <SustainabilityTrendLineAndBreakdown
                variant="pvProduction"
                style={styles.pvProductionTrendLine}
                series={districtPvProductionChart[FILTER_PV_CHART_INDEX[filter]]}
                categories={districtPvProductionChart[FILTER_PV_CHART_INDEX[filter]].categories}
              />
            </div>
          )}
          {/* {insight === 'waste' &&
          wasteLocations &&
          wasteLocations.map((wasteLocation: any) => (
            <WasteLocationMarker
              location={wasteLocation.location}
              key={`building-alarm-${wasteLocation.id}`}
              latitude={wasteLocation.latitude}
              longitude={wasteLocation.longitude}
              anchor="center"
              offset={[0, 0]}
              active={wasteLocation.active}
              onClick={onWasteLocationSelected}
            />
          ))} */}
          {showAlarms &&
            !building &&
            buildingsAlarms?.map((alarm: any) => (
              <AlarmMarker
                key={`building-alarm-${alarm.buildingId}`}
                variant={AlarmVariant.BILL}
                latitude={alarm.latitude}
                longitude={alarm.longitude}
                anchor="center"
                offset={[alarm.offsetX, alarm.offsetY]}
                severity={{lifeSafety: alarm.lifeSafety, critical: alarm.critical, maintenance: alarm.maintenance}}
              />
            ))}
        </Map>
      )}
    </div>
  );
};
