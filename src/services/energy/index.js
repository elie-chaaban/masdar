// import instance from '../../api/authenticated';
import apiInstance from '../../api/authenticatedApi';
import dConfig from './config/dashboard';
// import oldSConfig from './config/oldSlider';
import moment from 'moment-mini';
// import {districtBuildingFloorsMap} from '../../tempMap';
import {energyDashboardParser} from './energy';
import {fetchFromCache} from '../utils';

const insightsType = {
  security: 0,
  mobility: 1,
  energy: 2,
  economy: 3
};

const dateFilterType = {
  year: 0,
  month: 1,
  week: 2,
  day: 3
};

const fetchEnergyDashboard = async (filter, startDate, endDate, districtId, buildingId = null, floorId = null) => {
  try {
    let energy = {};
    const promises = dConfig.map((d) => {
      var url = `energy/${d.url}?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
      url = url + `${floorId ? `&FloorId=${floorId}` : ''}${`&StartDate=${startDate}`}`;
      url = url + `${`&EndDate=${endDate}`}`;
      return apiInstance.get(url);
    });
    const data = await Promise.all(promises);

    data.forEach((d, i) => {
      energy[dConfig[i].label] = dConfig[i].callback(d.data, filter);
    });
    return energy;
  } catch (error) {
    throw error;
  }
};

const fetchEnergySlider = async (filter, startDate, endDate, districtId, buildingId, floorId) => {
  // const startD = startDate;
  // const endD = endDate;
  try {
    let energy = {};
    // let promises = oldSConfig.map((d, i) => {
    //   startDate = oldSConfig[i].startDate || startD;
    //   endDate = oldSConfig[i].endDate || endD;
    //   return instance.get('kpi/' + d.url, {
    //     params: {
    //       filter,
    //       startDate,
    //       endDate,
    //       districtId: districtBuildingFloorsMap[districtId].id,
    //       buildingId: buildingId === null ? null : districtBuildingFloorsMap[districtId].buildings[buildingId].id,
    //       floorId: floorId === null ? null : districtBuildingFloorsMap[districtId].buildings[buildingId].floors[floorId]
    //     },
    //     timeout: 150000
    //   });
    // });

    // const data = await Promise.all(promises);
    // data.forEach((d, i) => {
    //   energy[oldSConfig[i].label] = oldSConfig[i].callback(d.data, filter);
    // });

    return energy;
  } catch (error) {
    throw error;
  }
};

const fetchBuildingSituationsCount = async (insight, startDate, endDate, districtId, buildingId) => {
  try {
    var url = `energy/building-situations-count?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}${`&Insight=${insightsType[insight]}`}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);

      let {buildingSituationsCount} = data;
      const floors = [...new Set(buildingSituationsCount.map((f) => f.FloorId))];
      const response = floors.map((f) => ({
        FloorId: f,
        data: [
          ...buildingSituationsCount
            .filter((b) => b.FloorId === f)
            .map(({CategoryType, Severity, Count}) => ({CategoryType, Severity, Count}))
        ]
      }));
      return response;
    };

    const response = await fetchFromCache('buildingSituationsCount', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchSustainabilityTargets = async (filter, endDate, districtId, buildingId, floorId) => {
  try {
    var url;
    var period = filter === 'year' ? 0 : 1;
    var year = moment(endDate).year();
    var month = filter === 'year' ? 0 : moment(endDate).month() + 1;
    if (floorId) {
      url = `floors/floor-sustainability-target-by-floor-id-and-period?floorId=${floorId}`;
      url = url + `&period=${period}&year=${year}&month=${month}`;
    } else if (buildingId) {
      url = `buildings/building-sustainability-target-by-building-id-and-period?buildingId=${buildingId}`;
      url = url + `&period=${period}&year=${year}&month=${month}`;
    } else {
      url = `districts/district-sustainability-target-by-district-id-and-period?districtId=${districtId}`;
      url = url + `&period=${period}&year=${year}&month=${month}`;
    }
    const {data} = await apiInstance.get(url);
    return data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const fetchHighestConsumption = async (insight, filter, type, startDate, endDate, districtId, buildingId) => {
  try {
    let url = `${insight}/highest-${type === 'buildings' ? 'buildings' : 'floors'}-consumption?DistrictId=${districtId}`;
    url = url + `${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('highestConsumption', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchSustainabilityConsumption = async (insight, filter, subsystem, startDate, endDate, districtId, buildingId, wasteLocationId) => {
  try {
    let url = `${insight}/sustainability-consumption?DistrictId=${districtId}`;
    url = url + `${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${wasteLocationId ? `&WasteLocationId=${wasteLocationId}` : ''}`;
    url = url + `${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}`;
    url = url + `&Type=${subsystem}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('sustainabilityConsumption', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchEnergyConsumptionStackedBar = async (
  filter,
  startDate,
  endDate,
  districtId,
  buildingId = null,
  floorId = null,
  zoneId = null
) => {
  try {
    let energy = {};

    let electrictyUrl = `energy/electricity-consumption?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    electrictyUrl = electrictyUrl + `${floorId ? `&FloorId=${floorId}` : ''}`;
    electrictyUrl = electrictyUrl + `${zoneId ? `&ZoneId=${zoneId}` : ''}`;
    electrictyUrl = electrictyUrl + `${`&StartDate=${startDate}`}${`&EndDate=${endDate}`}`;
    electrictyUrl = electrictyUrl + `&filter=${dateFilterType[filter]}`;

    const fetchElectricityConsumption = async () => {
      const {data} = await apiInstance.get(electrictyUrl);
      return data;
    };

    const electricityResponse = await fetchFromCache('electricityConsumption', electrictyUrl, fetchElectricityConsumption);
    energy.electricity = electricityResponse;

    let coolingUrl = `energy/cooling-consumption?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    coolingUrl = coolingUrl + `${floorId ? `&FloorId=${floorId}` : ''}`;
    coolingUrl = coolingUrl + `${zoneId ? `&ZoneId=${zoneId}` : ''}`;
    coolingUrl = coolingUrl + `${`&StartDate=${startDate}`}${`&EndDate=${endDate}`}`;
    coolingUrl = coolingUrl + `&filter=${dateFilterType[filter]}`;

    const fetchCoolingConsumption = async () => {
      const {data} = await apiInstance.get(coolingUrl);
      return data;
    };

    const coolingResponse = await fetchFromCache('coolingConsumption', coolingUrl, fetchCoolingConsumption);
    energy.cooling = coolingResponse;

    return energyDashboardParser.energyConsumptionStackedBar(energy, filter);
  } catch (error) {
    throw error;
  }
};

const fetchTotalEnergyConsumption = async (filter, startDate, endDate, districtId, buildingId = null, floorId = null, zoneId = null) => {
  try {
    let url = `energy/energy-consumption?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${floorId ? `&FloorId=${floorId}` : ''}`;
    url = url + `${zoneId ? `&ZoneId=${zoneId}` : ''}`;
    url = url + `${`&StartDate=${startDate}&EndDate=${endDate}`}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('energyConsumption', url, fetch);
    return energyDashboardParser.energyConsumption(response, filter);
  } catch (error) {
    throw error;
  }
};

const fetchElectricityConsumption = async (filter, startDate, endDate, districtId, buildingId = null, floorId = null) => {
  try {
    let url = `energy/electricity-consumption?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${floorId ? `&FloorId=${floorId}` : ''}${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('electricityConsumption', url, fetch);
    return energyDashboardParser.electricityConsumption(response, filter);
  } catch (error) {
    throw error;
  }
};

const fetchCoolingConsumption = async (filter, startDate, endDate, districtId, buildingId = null, floorId = null) => {
  try {
    let url = `energy/cooling-consumption?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${floorId ? `&FloorId=${floorId}` : ''}${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return energyDashboardParser.coolingConsumption(data, filter);
    };

    const response = await fetchFromCache('coolingConsumption', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchHvacConsumptionBreakdown = async (filter, startDate, endDate, districtId, buildingId = null, floorId = null) => {
  try {
    let url = `energy/hvac-consumption-breakdown?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${floorId ? `&FloorId=${floorId}` : ''}${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return energyDashboardParser.hvacConsumptionBreakdown(data, filter);
    };

    const response = await fetchFromCache('hvacConsumptionBreakdown', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchLightingSystemsConsumption = async (filter, startDate, endDate, districtId, buildingId = null, floorId = null) => {
  try {
    let url = `energy/lighting-systems-consumption?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${floorId ? `&FloorId=${floorId}` : ''}${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return energyDashboardParser.lightingSystemsConsumption(data, filter);
    };

    const response = await fetchFromCache('lightingSystemsConsumption', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchLiftSystemsConsumption = async (filter, startDate, endDate, districtId, buildingId = null, floorId = null) => {
  try {
    let url = `energy/lift-systems-consumption?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${floorId ? `&FloorId=${floorId}` : ''}${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return energyDashboardParser.liftSystemsConsumption(data, filter);
    };

    const response = await fetchFromCache('liftSystemsConsumption', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchEmergencySystemsConsumption = async (filter, startDate, endDate, districtId, buildingId = null, floorId = null) => {
  try {
    let url = `energy/emergency-systems-consumption?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${floorId ? `&FloorId=${floorId}` : ''}${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return energyDashboardParser.emergencySystemsConsumption(data, filter);
    };

    const response = await fetchFromCache('emergencySystemsConsumption', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchOtherSystemsConsumption = async (filter, startDate, endDate, districtId, buildingId = null, floorId = null) => {
  try {
    let url = `energy/other-systems-consumption?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${floorId ? `&FloorId=${floorId}` : ''}${`&StartDate=${startDate}`}`;
    url = url + `${`&EndDate=${endDate}`}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return energyDashboardParser.otherSystemsConsumption(data, filter);
    };

    const response = await fetchFromCache('otherSystemsConsumption', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchCarbonEmissionAndTrendLine = async (
  filter,
  startDate,
  endDate,
  districtId,
  buildingId = null,
  floorId = null,
  zoneId = null
) => {
  try {
    let url = `energy/carbon-emission-and-trendline?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${floorId ? `&FloorId=${floorId}` : ''}`;
    url = url + `${zoneId ? `&ZoneId=${zoneId}` : ''}`;
    url = url + `${`&StartDate=${startDate}`}${`&EndDate=${endDate}`}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('energyCarbonEmission', url, fetch);
    return energyDashboardParser.carbonEmissionAndTrendLine(JSON.parse(JSON.stringify(response)), filter);
  } catch (error) {
    throw error;
  }
};

const fetchEnergySavings = async (filter, startDate, endDate, districtId, buildingId = null, floorId = null, zoneId = null) => {
  try {
    let url = `savings/energy-savings?DistrictId=${districtId}&Filter=${dateFilterType[filter]}${
      buildingId ? `&BuildingId=${buildingId}` : ''
    }${floorId ? `&FloorId=${floorId}` : ''}${zoneId ? `&ZoneId=${zoneId}` : ''}`;
    url += `&StartDate=${startDate}&EndDate=${endDate}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('energySavings', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchBuildingEnergySavings = async (filter, startDate, endDate, districtId, buildingId) => {
  try {
    let url = `savings/building-savings?DistrictId=${districtId}&Filter=${dateFilterType[filter]}&BuildingId=${buildingId}`;
    url += `&StartDate=${startDate}&EndDate=${endDate}&Type=energy`;
    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };
    const response = await fetchFromCache('buildingEnergySavings', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchCarbonEmissionStackedBar = async (
  filter,
  startDate,
  endDate,
  hasCarbonAccess,
  hasEnergyAccess,
  hasWaterAccess,
  hasWasteAccess,
  districtId,
  buildingId = null,
  floorId = null,
  zoneId = null
) => {
  try {
    let carbon = {};
    if (hasCarbonAccess && hasEnergyAccess) {
      let energyUrl = `energy/carbon-emission-and-trendline?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
      energyUrl = energyUrl + `${floorId ? `&FloorId=${floorId}` : ''}`;
      energyUrl = energyUrl + `${zoneId ? `&ZoneId=${zoneId}` : ''}`;
      energyUrl = energyUrl + `${`&StartDate=${startDate}`}${`&EndDate=${endDate}`}`;
      energyUrl = energyUrl + `&filter=${dateFilterType[filter]}`;
      const fetchEnergyCarbon = async () => {
        const {data} = await apiInstance.get(energyUrl);
        return data;
      };

      const energyResponse = await fetchFromCache('energyCarbonEmission', energyUrl, fetchEnergyCarbon);
      carbon.energy = energyResponse;
    }
    if (hasCarbonAccess && hasWaterAccess) {
      let waterUrl = `water/carbon-emission-and-trendline?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
      waterUrl = waterUrl + `${floorId ? `&FloorId=${floorId}` : ''}`;
      waterUrl = waterUrl + `${zoneId ? `&ZoneId=${zoneId}` : ''}`;
      waterUrl = waterUrl + `${`&StartDate=${startDate}`}${`&EndDate=${endDate}`}`;
      waterUrl = waterUrl + `&filter=${dateFilterType[filter]}`;

      const fetchWaterCarbon = async () => {
        const {data} = await apiInstance.get(waterUrl);
        return data;
      };

      const waterResponse = await fetchFromCache('waterCarbonEmission', waterUrl, fetchWaterCarbon);
      carbon.water = waterResponse;
    }
    if (hasCarbonAccess && hasWasteAccess) {
      let wasteUrl = `waste/carbon-emission-and-trendline?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
      wasteUrl = wasteUrl + `${floorId ? `&FloorId=${floorId}` : ''}`;
      wasteUrl = wasteUrl + `${zoneId ? `&ZoneId=${zoneId}` : ''}`;
      wasteUrl = wasteUrl + `${`&StartDate=${startDate}`}${`&EndDate=${endDate}`}`;
      wasteUrl = wasteUrl + `&filter=${dateFilterType[filter]}`;

      const fetchWasteCarbon = async () => {
        const {data} = await apiInstance.get(wasteUrl);
        return data;
      };

      const wasteResponse = await fetchFromCache('wasteCarbonEmission', wasteUrl, fetchWasteCarbon);
      carbon.waste = wasteResponse;
    }
    return energyDashboardParser.carbonEmissionStackedBar(carbon, filter, hasCarbonAccess, hasEnergyAccess, hasWaterAccess, hasWasteAccess);
  } catch (error) {
    throw error;
  }
};

const fetchDistrictPVProductions = async (districtId, buildingId) => {
  try {
    const year = moment().year();
    let url = `energy/last12months-district-pv-production?DistrictId=${districtId}${
      buildingId ? `&BuildingId=${buildingId}` : ''
    }&Year=${year}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return energyDashboardParser.districtPVProductions(data);
    };

    const response = await fetchFromCache('districtPVProductions', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchEnergyConsumptionPercentage = async (
  filter,
  startDate,
  endDate,
  districtId,
  buildingId = null,
  floorId = null,
  zoneId = null
) => {
  try {
    let url = `energy/energy-consumption-percentage?DistrictId=${districtId}${buildingId ? `&BuildingId=${buildingId}` : ''}`;
    url = url + `${floorId ? `&FloorId=${floorId}` : ''}`;
    url = url + `${zoneId ? `&ZoneId=${zoneId}` : ''}`;
    url = url + `${`&StartDate=${startDate}&EndDate=${endDate}`}`;
    url = url + `&filter=${dateFilterType[filter]}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return energyDashboardParser.energyConsumptionPercentage(data);
    };

    const response = await fetchFromCache('energyConsumptionPercentage', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchHighestEnergyZonesConsumption = async (filter, startDate, endDate, districtId, buildingId = null) => {
  try {
    let url = `energy/highest-zones-consumption?DistrictId=${districtId}&Filter=${dateFilterType[filter]}${
      buildingId ? `&BuildingId=${buildingId}` : ''
    }`;
    url += `&StartDate=${startDate}&EndDate=${endDate}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('highestEnergyZonesConsumption', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

const fetchEnergyZonesHeatmap = async (filter, startDate, endDate, districtId, buildingId = null) => {
  try {
    let url = `heatmap/zones-energy-heat-map?DistrictId=${districtId}&Filter=${dateFilterType[filter]}${
      buildingId ? `&BuildingId=${buildingId}` : ''
    }`;
    url += `&StartDate=${startDate}&EndDate=${endDate}`;

    const fetch = async () => {
      const {data} = await apiInstance.get(url);
      return data;
    };

    const response = await fetchFromCache('energyZonesHeatmap', url, fetch);
    return response;
  } catch (error) {
    throw error;
  }
};

export {
  fetchEnergyConsumptionPercentage,
  fetchCarbonEmissionStackedBar,
  fetchEnergyDashboard,
  fetchEnergySlider,
  fetchBuildingSituationsCount,
  fetchSustainabilityTargets,
  fetchHighestConsumption,
  fetchSustainabilityConsumption,
  fetchTotalEnergyConsumption,
  fetchElectricityConsumption,
  fetchCoolingConsumption,
  fetchHvacConsumptionBreakdown,
  fetchLightingSystemsConsumption,
  fetchLiftSystemsConsumption,
  fetchEmergencySystemsConsumption,
  fetchOtherSystemsConsumption,
  fetchCarbonEmissionAndTrendLine,
  fetchEnergySavings,
  fetchDistrictPVProductions,
  fetchBuildingEnergySavings,
  fetchEnergyConsumptionStackedBar,
  fetchHighestEnergyZonesConsumption,
  fetchEnergyZonesHeatmap
};
