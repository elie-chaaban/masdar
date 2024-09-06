import apiInstance from '../../api/authenticatedApi';
import {waterDashboardParser} from './water';
import {fetchFromCache} from '../utils';

const dateFilterType = {
  year: 0,
  month: 1,
  week: 2,
  day: 3
};

const fetchWaterDashboard = async (filter, startDate, endDate, districtId, buildingId = null, floorId = null, zoneId = null) => {
  try {
    var url = `water/water-consumption?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${floorId ? `&FloorId=${floorId}` : ''}`;
    url = url + `${zoneId ? `&ZoneId=${zoneId}` : ''}`;
    url = url + `${`&StartDate=${startDate}&EndDate=${endDate}`}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return waterDashboardParser.waterConsumption(data, filter);
    };

    const response = await fetchFromCache('waterConsumption', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchWaterSavings = async (filter, startDate, endDate, districtId, buildingId = null, floorId = null, zoneId = null) => {
  try {
    let url = `savings/water-savings?DistrictId=${districtId}&Filter=${dateFilterType[filter]}${
      buildingId ? `&BuildingId=${buildingId}` : ''
    }${floorId ? `&FloorId=${floorId}` : ''}${zoneId ? `&ZoneId=${zoneId}` : ''}`;
    url += `&StartDate=${startDate}&EndDate=${endDate}`;
    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('waterSavings', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchBuildingWaterSavings = async (filter, startDate, endDate, districtId, buildingId) => {
  try {
    let url = `savings/building-savings?DistrictId=${districtId}&Filter=${dateFilterType[filter]}&BuildingId=${buildingId}`;
    url += `&StartDate=${startDate}&EndDate=${endDate}&Type=water`;
    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };
    const response = await fetchFromCache('buildingWaterSavings', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchWaterCarbonEmissionAndTrendLine = async (
  filter,
  startDate,
  endDate,
  districtId,
  buildingId = null,
  floorId = null,
  zoneId = null
) => {
  try {
    let url = `water/carbon-emission-and-trendline?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${floorId ? `&FloorId=${floorId}` : ''}`;
    url = url + `${zoneId ? `&ZoneId=${zoneId}` : ''}`;
    url = url + `${`&StartDate=${startDate}`}${`&EndDate=${endDate}`}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('waterCarbonEmission', url, fetch);
    return waterDashboardParser.carbonEmissionAndTrendLine(JSON.parse(JSON.stringify(response)), filter);
  } catch (error) {
    throw error;
  }
};

const fetchHighestWaterZonesConsumption = async (filter, startDate, endDate, districtId, buildingId = null) => {
  try {
    let url = `water/highest-zones-consumption?DistrictId=${districtId}&Filter=${dateFilterType[filter]}${
      buildingId ? `&BuildingId=${buildingId}` : ''
    }`;
    url += `&StartDate=${startDate}&EndDate=${endDate}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('highestWaterZonesConsumption', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchWaterZonesHeatmap = async (filter, startDate, endDate, districtId, buildingId = null) => {
  try {
    let url = `heatmap/zones-water-heat-map?DistrictId=${districtId}&Filter=${dateFilterType[filter]}${
      buildingId ? `&BuildingId=${buildingId}` : ''
    }`;
    url += `&StartDate=${startDate}&EndDate=${endDate}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('waterZonesHeatmap', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

export {
  fetchWaterDashboard,
  fetchWaterSavings,
  fetchWaterCarbonEmissionAndTrendLine,
  fetchBuildingWaterSavings,
  fetchHighestWaterZonesConsumption,
  fetchWaterZonesHeatmap
};
