import apiInstance from '../../api/authenticatedApi';
import {wasteDashboardParser} from './waste';
import {fetchFromCache} from '../utils';

const dateFilterType = {
  year: 0,
  month: 1,
  week: 2,
  day: 3
};

export const fetchTotalWasteProduction = async (filter, startDate, endDate, districtId, location = null, buildingId = null) => {
  try {
    let url = `waste/waste-production?DistrictId=${districtId}${
      location ? `&Location=${location}` : buildingId ? '&Location=EMPTYLOCATION' : ''
    }`;
    url = url + `${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}`;
    url = url + `${`&Filter=${dateFilterType[filter]}`}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return wasteDashboardParser.wasteProduction(data, filter);
    };

    const response = await fetchFromCache('wasteProduction', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchTotalWasteProductionBreakdown = async (filter, startDate, endDate, districtId, location = null, buildingId = null) => {
  try {
    let url = `waste/waste-production-breakdown?DistrictId=${districtId}${
      location ? `&Location=${location}` : buildingId ? '&Location=EMPTYLOCATION' : ''
    }`;
    url = url + `${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}`;
    url = url + `${`&Filter=${dateFilterType[filter]}`}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return wasteDashboardParser.wasteProductionBreakdown(data, filter);
    };

    const response = await fetchFromCache('wasteProductionBreakdown', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchOperationsWasteProductionByCategory = async (
  filter,
  startDate,
  endDate,
  districtId,
  location = null,
  buildingId = null
) => {
  try {
    let url = `waste/operations-waste-production-by-category?DistrictId=${districtId}${
      location ? `&Location=${location}` : buildingId ? '&Location=EMPTYLOCATION' : ''
    }`;
    url = url + `${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}`;
    url = url + `${`&Filter=${dateFilterType[filter]}`}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return wasteDashboardParser.operationsWasteProductionByCategory(data, filter);
    };

    const response = await fetchFromCache('operationsWasteProductionByCategory', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchConstructionWasteProductionByCategory = async (
  filter,
  startDate,
  endDate,
  districtId,
  location = null,
  buildingId = null
) => {
  try {
    let url = `waste/construction-waste-production-by-category?DistrictId=${districtId}${
      location ? `&Location=${location}` : buildingId ? '&Location=EMPTYLOCATION' : ''
    }`;
    url = url + `${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}`;
    url = url + `${`&Filter=${dateFilterType[filter]}`}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return wasteDashboardParser.constructionWasteProductionByCategory(data, filter);
    };

    const response = await fetchFromCache('constructionWasteProductionByCategory', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchWasteLocations = async (districtId) => {
  try {
    const url = `waste/waste-location/waste-grouped-locations-by-district-id/${districtId}`;
    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('wasteLocationsRequests', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchWasteCarbonEmissionAndTrendLine = async (
  filter,
  startDate,
  endDate,
  districtId,
  buildingId = null,
  floorId = null,
  zoneId = null
) => {
  try {
    let url = `waste/carbon-emission-and-trendline?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${floorId ? `&FloorId=${floorId}` : ''}`;
    url = url + `${zoneId ? `&ZoneId=${zoneId}` : ''}`;
    url = url + `${`&StartDate=${startDate}`}${`&EndDate=${endDate}`}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('wasteCarbonEmission', url, fetch);
    return wasteDashboardParser.carbonEmissionAndTrendLine(JSON.parse(JSON.stringify(response)), filter);
  } catch (error) {
    throw error;
  }
};

export const fetchWasteCarbonEmissionByCategory = async (
  filter,
  startDate,
  endDate,
  districtId,
  buildingId = null,
  floorId = null,
  zoneId = null
) => {
  try {
    let url = `waste/carbon-emission-by-category?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${floorId ? `&FloorId=${floorId}` : ''}`;
    url = url + `${zoneId ? `&ZoneId=${zoneId}` : ''}`;
    url = url + `${`&StartDate=${startDate}`}${`&EndDate=${endDate}`}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('wasteCarbonEmissionByCategory', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};
