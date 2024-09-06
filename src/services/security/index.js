import instance from '../../api/authenticated';
import apiInstance from '../../api/authenticatedApi';
import {fetchFromCache} from '../utils';
import dConfig from './config/dashboard';
import {securityDashboardParser} from './security';

const dateFilterTypes = {
  year: 0,
  month: 1,
  week: 2,
  day: 3
};

const fetchSecurityDashboard = async (filter, startDate, endDate, district, building = null, floor = null) => {
  try {
    let security = {};
    const promises = dConfig.map((d) => {
      var url = `security/${d.url}?DistrictId=${district}${building ? `&BuildingId=${building}` : ''}`;
      url = url + `${floor ? `&FloorId=${floor}` : ''}${`&StartDate=${startDate}`}`;
      url = url + `${`&EndDate=${endDate}`}${`&Filter=${dateFilterTypes[filter]}`}`;
      return apiInstance.get(url);
    });

    const data = await Promise.all(promises);
    data.forEach((d, i) => {
      security[dConfig[i].label] = dConfig[i].callback(d.data, filter);
    });
    return security;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const fetchRealTimeOperations = async (startDate, endDate, district, building = null, floor = null, filter) => {
  try {
    let url = `security/real-time-operations?DistrictId=${district}&Filter=${dateFilterTypes[filter]}${
      building ? `&BuildingId=${building}` : ''
    }`;
    url += `&StartDate=${startDate}&EndDate=${endDate}${floor ? `&floorId=${floor}` : ''}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return securityDashboardParser.realTimeOperations(data, filter);
    };

    const response = await fetchFromCache('securityRealtimeOperations', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchFrequencyOfOccurence = async (startDate, endDate, district, building = null, floor = null, filter) => {
  try {
    let url = `security/frequency-of-occurrence-by-type-trend-line?DistrictId=${district}&Filter=${dateFilterTypes[filter]}${
      building ? `&BuildingId=${building}` : ''
    }`;
    url += `&StartDate=${startDate}&EndDate=${endDate}${floor ? `&floorId=${floor}` : ''}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return securityDashboardParser.frequencyOfOccurence(data, filter);
    };

    const response = await fetchFromCache('frequencyOfOccurence', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchAcknowledgmentTime = async (startDate, endDate, district, building = null, floor = null, filter) => {
  try {
    let url = `security/acknowledgment-time?DistrictId=${district}&Filter=${dateFilterTypes[filter]}${
      building ? `&BuildingId=${building}` : ''
    }`;
    url += `&StartDate=${startDate}&EndDate=${endDate}${floor ? `&floorId=${floor}` : ''}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return securityDashboardParser.acknowledgmentTime(data, filter);
    };

    const response = await fetchFromCache('acknowledgmentTime', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchSecurityIncidents = async (startDate, endDate, district, building = null, floor = null, filter) => {
  try {
    var url = `security/security-incidents?DistrictId=${district}${building ? `&BuildingId=${building}` : ''}`;
    url = url + `${floor ? `&FloorId=${floor}` : ''}${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}${`&Filter=${dateFilterTypes[filter]}`}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('securityIncidents', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchSecurityIncidentsCountBySeverity = async (startDate, endDate, district, building = null, floor = null, filter) => {
  try {
    var url = `security/security-incidents-count-by-severity?DistrictId=${district}${building ? `&BuildingId=${building}` : ''}`;
    url = url + `${floor ? `&FloorId=${floor}` : ''}${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}${`&Filter=${dateFilterTypes[filter]}`}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('securityIncidentsCountBySeverity', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchTrafficAnalysisBreakdown = async () => {
  try {
    const response = await apiInstance.get('security/traffic-analysis-breakdown');
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchSecuritySlider = async (startDate, endDate, district, building = null, floor = null, filter) => {
  try {
    let security = {};
    const {data: incidents} = await fetchSecurityIncidents(startDate, endDate, district, building, floor, dateFilterTypes[filter]);
    security['SI'] = incidents;

    const {data: traffic} = await fetchTrafficAnalysisBreakdown();
    security['TA'] = traffic;

    return security;
  } catch (error) {
    throw error;
  }
};

const fetchSecuritySearchTypeParameterValues = async (searchTypeId, searchTypeParameterId, districtId, buildingId, floorId) => {
  try {
    const params = {districtId: parseInt(districtId), searchTypeParameterId, searchTypeId};
    if (buildingId) params['buildingId'] = parseInt(buildingId);
    if (floorId) params['floorId'] = parseInt(floorId);
    const result = await instance.get('security/securitySearchTypeParameterValues', {params});
    return result.data;
  } catch (error) {
    throw error;
  }
};

const fetchSecuritySearchTypeFilters = async (searchTypeId, districtId, buildingId, floorId) => {
  try {
    const params = {searchTypeId, districtId: parseInt(districtId)};
    if (buildingId) params['buildingId'] = parseInt(buildingId);
    if (floorId) params['floorId'] = parseInt(floorId);
    const result = await instance.get('security/searchFilters', {params});
    return result.data;
  } catch (error) {
    throw error;
  }
};

const fetchSecuritySearch = async (searchTypeId, districtId, buildingId, floorId, params, filters) => {
  try {
    const body = {searchTypeId, districtId: parseInt(districtId), params, filters};
    if (buildingId) body['buildingId'] = parseInt(buildingId);
    if (floorId) body['floorId'] = parseInt(floorId);
    const result = await instance.post('security/search', body, {timeout: 60000});
    return result.data;
  } catch (error) {
    throw error;
  }
};
export {
  fetchSecurityIncidents,
  fetchAcknowledgmentTime,
  fetchRealTimeOperations,
  fetchSecurityDashboard,
  fetchSecuritySlider,
  fetchSecuritySearchTypeParameterValues,
  fetchSecuritySearch,
  fetchSecuritySearchTypeFilters,
  fetchFrequencyOfOccurence,
  fetchSecurityIncidentsCountBySeverity
};
