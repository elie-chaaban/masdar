/* eslint-disable no-eval */
import instance from '../../api/authenticated';
import apiInstance from '../../api/authenticatedApi';
import axios from 'axios';
import {default as store} from '../../reduxStore';
import {setLoadingFloors, updateMapAssets, updateStreamCameras, store3dEyeCredentials} from '../../reduxStore/actions';
import {getIFramesUrls} from '../user';
import authenticateStream from '../Stream';
import moment from 'moment-mini';
import {districtBuildingFloorsMap} from '../../tempMap';
import {fetchFromCache} from '../utils';
import {dashboardParser} from './dashBoard';

const url = process.env['REACT_APP_FILES_URL'];
const newUrl = 'https://api.masdarcityccc.com/';

const dateFilterType = {
  year: 0,
  month: 1,
  week: 2,
  day: 3
};

const getDistrict = async (districtId, access = undefined) => {
  try {
    const kpi = access ? access.kpi : store.getState().user.access.kpi;
    const promises = [],
      buildings = [];
    promises.push(apiInstance.get(`districts/district/${districtId}`));
    promises.push(getIFramesUrls(districtId));
    promises.push(authenticateStream(districtId));
    promises.push(getMapAssets(districtId));
    const data = await Promise.all(promises);
    Object.keys(kpi).forEach((mod) => {
      kpi[mod].forEach((building) => {
        if (
          !buildings.some((item) => item.id === building.building_id) &&
          data[0].data.buildings.some((item) => item.id === building.building_id && districtId === building.district_id)
        ) {
          buildings.push(data[0].data.buildings.find((item) => item.id === building.building_id));
        }
      });
    });
    const districtInfo = formatDistrict(data[0].data);
    await formatBuildings(buildings);
    store.dispatch(updateStreamCameras(data[2].cameras));
    store.dispatch(store3dEyeCredentials(data[2].credentials_3dEye));
    return {
      info: districtInfo,
      buildings,
      iFrames: data[1],
      cameras: data[2].cameras,
      mapAssets: data[3]
    };
  } catch (e) {
    console.log('e', e);
    throw e;
  }
};

const formatDistrict = (district) => {
  const sliderViewPort = {
    latitude: parseFloat(district.viewPort.sliderLatitude),
    longitude: parseFloat(district.viewPort.sliderLongitude),
    zoom: parseFloat(district.viewPort.sliderZoom),
    pitch: parseFloat(district.viewPort.sliderPitch),
    bearing: parseFloat(district.viewPort.sliderBearing),
    altitude: parseFloat(district.viewPort.sliderAltitude)
  };
  district.viewPort = {
    latitude: parseFloat(district.viewPort.latitude),
    longitude: parseFloat(district.viewPort.longitude),
    zoom: parseFloat(district.viewPort.zoom),
    pitch: parseFloat(district.viewPort.pitch),
    bearing: parseFloat(district.viewPort.bearing),
    altitude: parseFloat(district.viewPort.altitude)
  };
  district.extrusion = district.districtExtrusions.map((e) => `${e.extrusionIdentifier}`);
  district.latitude = district.viewPort.latitude;
  district.longitude = district.viewPort.longitude;
  district.zoom = district.viewPort.zoom;
  district.pitch = district.viewPort.pitch;
  district.bearing = district.viewPort.bearing;
  district.altitude = district.viewPort.altitude;
  return {...district, slider_view_port: sliderViewPort};
};

const getWeather = async (lat, lon) => {
  try {
    const appid = process.env['REACT_APP_WEATHER_API_KEY'];
    const appURL = process.env['REACT_APP_WEATHER_URL'];
    const imageURL = process.env['REACT_APP_WEATHER_IMAGE_URL'];
    const {data} = await axios.get(`${appURL}`, {params: {lat, lon, appid, units: 'metric'}});
    let {name, weather, main} = data;
    const {temp, pressure, humidity, temp_min, temp_max} = main;
    let weather_state_name = weather[0].main;
    const {icon, id} = weather[0];

    return {
      title: name,
      weather: weather_state_name,
      temperature: Math.trunc(temp),
      pressure: pressure,
      humidity: humidity,
      min_temperature: temp_min,
      max_temperature: temp_max,
      icon_id: id,
      icon: `${imageURL}${icon}.png`
    };
  } catch (e) {
    throw e;
  }
};

const getCOMeasurement = async (lat, lon) => {
  try {
    const appid = process.env['REACT_APP_WEATHER_API_KEY'];
    const appURL = process.env['REACT_APP_AIR_POLLUTION_URL'];
    const {data} = await axios.get(`${appURL}`, {params: {lat, lon, appid}});
    let {list} = data;
    if (!list || list?.length === 0)
      return {
        no2: 0,
        so2: 0,
        o3: 0,
        co: 0
      };
    const {components} = list[0];
    const {no2, so2, o3, co} = components;
    return {
      no2,
      so2,
      o3,
      co
    };
  } catch (e) {
    throw e;
  }
};

const getIndexes = async (startDate, endDate, filter, district, building = undefined) => {
  try {
    let data = {
      environment: {},
      security: {},
      mobility: {}
    };
    var url = 'energy/index?DistrictId=' + district + '&Filter=' + dateFilterType[filter];
    if (building != null && building !== undefined) url = url + '&BuildingId=' + building;
    const {data: energy} = await apiInstance.get(url);
    data.environment.index = energy.index;
    data.environment.trendLine = energy.trendLine;
    data.environment.xaxis = energy.xAxis;
    url = 'security/index?DistrictId=' + district + '&Filter=' + dateFilterType[filter] + '&EndDate=' + endDate;
    if (building != null && building !== undefined) url = url + '&BuildingId=' + building;
    const {data: security} = await apiInstance.get(url);
    data.security.index = security.index;
    data.security.trendLine = security.trendLine;
    data.security.xaxis = security.xAxis;

    data.mobility.index = 24;
    data.mobility.trendLine = [634802, 104152, 227742, 171919, 161977, 229843, 268309, 145990, 228426, 96410, 93801, 314910];
    data.mobility.xaxis = [
      'May-2021',
      'Jun-2021',
      'Jul-2021',
      'Aug-2021',
      'Sep-2021',
      'Oct-2021',
      'Nov-2021',
      'Dec-2021',
      'Jan-2022',
      'Feb-2022',
      'Mar-2022',
      'Apr-2022'
    ];
    return data;
  } catch (e) {
    throw e;
  }
};

const formatBuildings = async (buildings) => {
  try {
    const promises = buildings.map(async (building) => {
      building.rotation = eval(building.rotation);
      building.coordinates = [parseFloat(building.longitude), parseFloat(building.latitude)];
      building.ambientLight = parseInt(building.ambientLight);
      building.buildingUrl = `heatmap/building-feature?BuildingId=${building.id}`;
      building.heatmapUrl = `heatmap/heat-map-feature?BuildingId=${building.id}`;
      building.buildingZoom = {
        center: [parseFloat(building.buildingZoom.centerLatitude), parseFloat(building.buildingZoom.centerLongitude)],
        offset: [parseInt(building.buildingZoom.offsetX), parseInt(building.buildingZoom.offsetY)],
        zoom: parseFloat(building.buildingZoom.zoom),
        bearing: parseFloat(building.buildingZoom.bearing),
        speed: parseFloat(building.buildingZoom.speed),
        curve: parseFloat(building.buildingZoom.curve),
        altitude: parseFloat(building.buildingZoom.altitude),
        pitch: parseInt(building.buildingZoom.pitch)
      };

      try {
        building.url = `${url}${building.gltfUrl}`;
      } catch (error) {
        building.url = null;
      }

      building.heatmap = `${newUrl}${building.heatmapUrl}`;
      building.buildingDetails = `${url}district/building/details`;
      building.buildingHeatMapDetails = `${url}district/heatmap`;
      building.building = `${url}${building.buildingUrl}`;

      try {
        building.shell_gltf_url = `${url}${building.shellGltfUrl}`;
      } catch (error) {
        building.shell_gltf_url = undefined;
      }

      building.floors.forEach((floor) => {
        floor.coordinates = [parseFloat(floor.longitude), parseFloat(floor.latitude)];
        floor.ambientLight = parseInt(floor.ambientLight);
        floor.directionalLight = parseInt(floor.directionalLight);
        floor.rotation = eval(floor.rotation);
        floor.url = `${url}${floor.gltfUrl}`;
      });
    });
    await Promise.all(promises);
    return buildings;
  } catch (e) {
    throw e;
  }
};

const fetchFloorsHeatmap = async (building, filter, fromDate, toDate, insight) => {
  if (!store.getState().map.isLoadingFloors) store.dispatch(setLoadingFloors(true));
  const floors = building.floors.map((record) => record.id);
  try {
    const additionalParams = `?BuildingId=${building.id}&floorIds=${floors}&Filter=${dateFilterType[filter]}&StartDate=${fromDate}&EndDate=${toDate}`;
    const {data} = await apiInstance.get(`/heatmap/building-and-floors-${insight}-heat-map${additionalParams}`);
    store.dispatch(setLoadingFloors(false));
    return data;
  } catch (error) {
    throw error;
  }
};

const fetchFeatures = async (buildings, label) => {
  try {
    const features = {type: 'FeatureCollection', features: []};
    const promises = buildings.map((b) => apiInstance.get(b[label]));
    const data = await Promise.all(promises);
    data.forEach((d) => features.features.push(d.data));
    return features;
  } catch (error) {
    throw error;
  }
};
const fetchDistrictsInfo = async (startDate, endDate, districts, districtsData) => {
  try {
    const info = [];
    for (let i = 0; i < districts.length; i++) {
      let id = districts[i];
      info.push({
        info: districtsData.find((d) => d.info.id === id),
        indexes: {
          mobility: 0,
          security: 0,
          facilities: 0,
          energy: 0
        },
        image: null
      });
    }
    return info;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const fetchBuildingsHeatmap = async (filter, insightType, district, features, startDate, endDate) => {
  const url = `heatmap/district-${insightType}-heat-map?DistrictId=${district}&Filter=${
    dateFilterType[filter]
  }&StartDate=${startDate}&EndDate=${endDate}&dummy-features-param=${features ? 'YES' : 'NO'}`;
  try {
    const fetch = async () => {
      const {data: colors} = await apiInstance.get(url);
      if (colors.buildingHeatMaps && Array.isArray(colors.buildingHeatMaps) && features) {
        const f = {...features};
        colors.buildingHeatMaps.forEach((color) => {
          if (f.features.find((feature) => feature.properties['building'] === color['buildingId']))
            f.features.find((feature) => feature.properties['building'] === color['buildingId']).properties.color = color['color'];
        });
        console.log('f', f);
        return f;
      } else {
        return colors;
      }
    };

    const response = await fetchFromCache('buildingsHeatmapRequests', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};
const fetchBuildingFloorsHeatmap = async (filter, insightType, buildingId, startDate, endDate) => {
  const url = `heatmap/building-${insightType}-heat-map?BuildingId=${buildingId}&Filter=${dateFilterType[filter]}&StartDate=${startDate}&EndDate=${endDate}`;
  try {
    const fetch = async () => {
      const {data: colors} = await apiInstance.get(url);
      return colors;
    };
    const response = await fetchFromCache('floorsHeatmapRequests', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};
const fetchTenantHeatmap = async (filter, insightType, buildingId, startDate, endDate) => {
  const url = `heatmap/tenant-${insightType}-heat-map?BuildingId=${buildingId}&Filter=${dateFilterType[filter]}&StartDate=${startDate}&EndDate=${endDate}`;
  try {
    const fetch = async () => {
      const {data: colors} = await apiInstance.get(url);
      return colors;
    };

    const response = await fetchFromCache('tenantHeatmapRequests', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};
const getAlarms = async (districtId) => {
  try {
    let {data} = await apiInstance.get('districts/district-alerts-by-district-id', {params: {districtId}});
    const {streamCameras} = store.getState().dashboard;
    console.log(data);
    data = data.districtAlerts.map((d) => {
      const cameraUrl = streamCameras.find((item) => parseInt(d.cameraId) === item.id)?.accessUrls.dashStream;
      delete d.cameraId;
      return {
        ...d,
        cameraUrl,
        coordinates: [parseFloat(d.longitude), parseFloat(d.latitude)],
        createdDate: moment(d.creationTime).format('hh:mm a - MMM DD')
      };
    });
    return data;
  } catch (error) {
    throw error;
  }
};
const getMapAssets = async (districtId) => {
  try {
    let {data} = await apiInstance.get('districts/district-map-assets-by-district-id', {params: {districtId}});
    const assets = data.districtMapAssets.map((asset) => ({
      ...asset,
      id: 'asset-' + asset.id,
      asset_id: asset.id,
      rotation: eval(asset.rotation),
      ambientLight: parseInt(asset.ambientLight),
      coordinates: [parseFloat(asset.longitude), parseFloat(asset.latitude)],
      url: asset.gltfUrl
    }));
    return assets;
  } catch (error) {
    throw error;
  }
};
const getDeviceStatus = async (iccid) => {
  try {
    let {data} = await instance('district/getDeviceStatus', {params: {iccid}});
    return data;
  } catch (error) {
    throw error;
  }
};
const activateDeactivateDevice = async (assetId, iccid, activate) => {
  try {
    const districtId = store.getState().map.district;
    const dispatch = store.dispatch;

    await instance('district/activateDeActivateDevice', {params: {iccid, asset_id: assetId, activate}});

    const assets = await getMapAssets(districtId);
    dispatch(updateMapAssets(assets));
  } catch (error) {
    throw error;
  }
};
const getMultiWindowConfig = async () => {
  try {
    let {data} = await apiInstance.get('multi-screen-layout/d784258e-76e0-2b8e-d818-39ffe91287ad');
    return data;
  } catch (error) {
    throw error;
  }
};
const saveMapAsset = async (type, iccid, lat, lon, rotation) => {
  try {
    const districtId = store.getState().map.district;
    const dispatch = store.dispatch;
    await instance({
      method: 'post',
      url: 'district/saveMapAsset',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        district_id: districtBuildingFloorsMap[districtId].id,
        type,
        iccid,
        lat,
        lon,
        rotation: `[Math.PI / 2, ${rotation / (114.59155902616465 / 2)}, 0]`
      })
    });
    const assets = await getMapAssets(districtId);
    dispatch(updateMapAssets(assets));
    return;
  } catch (error) {
    throw error;
  }
};

const getIntersectionData = async (district_id) => {
  try {
    let {data} = await instance('district/intersectionData', {params: {district_id: districtBuildingFloorsMap[district_id].id}});
    return data;
  } catch (error) {
    throw error;
  }
};

const fetchAlarms = async (district) => {
  try {
    let {data} = await apiInstance.get(`alarms?districtId=${district}`);
    return data;
  } catch (error) {
    throw error;
  }
};

const fetchHourlyBuildingsCo = async (district) => {
  try {
    let url = `buildings/hourly-buildings-co?DistrictId=${district}`;
    let {data} = await apiInstance.get(url);
    return dashboardParser.hourlyBuildingsCo(data.hourlyBuildingsCo);
  } catch (error) {
    throw error;
  }
};

const fetchHourlyBuildingsTemperature = async (district) => {
  try {
    let url = `buildings/hourly-buildings-temperature?DistrictId=${district}`;

    let {data} = await apiInstance.get(url);
    return dashboardParser.hourlyBuildingsTemperature(data.hourlyBuildingsTemperature);
  } catch (error) {
    throw error;
  }
};

const fetchHourlyBuildingsHumidity = async (district) => {
  try {
    let url = `buildings/hourly-buildings-humidity?DistrictId=${district}`;

    let {data} = await apiInstance.get(url);
    return dashboardParser.hourlyBuildingsHumidity(data.hourlyBuildingsHumidity);
  } catch (error) {
    throw error;
  }
};

const fetchAirQuality = async (district) => {
  try {
    let url = `districts/air-quality?DistrictId=${district}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('airQuality', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchBuildingsConsumptionAlarms = async (district, startDate, endDate) => {
  const energyUrl = `energy/buildings-energy-consumption-alarms?DistrictId=${district}&StartDate=${startDate}&EndDate=${endDate}`;
  const waterUrl = `water/buildings-water-consumption-alarms?DistrictId=${district}&StartDate=${startDate}&EndDate=${endDate}`;
  try {
    const fetch = async () => {
      const promises = [apiInstance.get(energyUrl), apiInstance.get(waterUrl)];
      const data = await Promise.all(promises);
      const energyData = data.length && data.length > 0 ? data[0].data?.buildings : [];
      const waterData = data.length && data.length > 1 ? data[1].data?.buildings : [];

      const combinedArray = [...energyData, ...waterData];
      const result = Object.values(
        combinedArray.reduce((acc, obj) => {
          const {buildingId, latitude, longitude, name} = obj;

          if (!acc[buildingId]) {
            acc[buildingId] = {
              buildingId,
              latitude,
              longitude,
              name,
              waterDifference: 0,
              energyDifference: 0
            };
          }

          acc[buildingId].energyDifference = energyData.find((x) => x.buildingId === buildingId)?.difference ?? 0;
          acc[buildingId].waterDifference = waterData.find((x) => x.buildingId === buildingId)?.difference ?? 0;

          return acc;
        }, {})
      );
      console.log(result);
      return result;
    };

    const response = await fetchFromCache('buildingsConsumptionAlerts', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

export {
  fetchBuildingsConsumptionAlarms,
  getDistrict,
  getAlarms,
  getIndexes,
  fetchFloorsHeatmap,
  getWeather,
  fetchFeatures,
  fetchDistrictsInfo,
  fetchBuildingsHeatmap,
  fetchBuildingFloorsHeatmap,
  fetchTenantHeatmap,
  getMultiWindowConfig,
  getMapAssets,
  activateDeactivateDevice,
  saveMapAsset,
  getIntersectionData,
  getDeviceStatus,
  getCOMeasurement,
  fetchAlarms,
  fetchHourlyBuildingsCo,
  fetchHourlyBuildingsTemperature,
  fetchHourlyBuildingsHumidity,
  fetchAirQuality
};
