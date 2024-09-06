import moment from 'moment-mini';
import {default as store} from '../reduxStore';
import {
  setEnergyConsumption,
  setWaterConsumption,
  setWasteProduction,
  setEnergySavings,
  setWaterSavings,
  setEnergyCarbonEmission,
  setWaterCarbonEmission,
  setWasteCarbonEmission,
  setOperationsWasteProductionByCategory,
  setConstructionWasteProductionByCategory,
  setWasteLocationsRequests,
  setBuildingSituationsCount,
  setHighestConsumption,
  setSustainabilityConsumption,
  setElectricityConsumption,
  setCoolingConsumption,
  setHvacConsumptionBreakdown,
  setLightingSystemsConsumption,
  setLiftSystemsConsumption,
  setEmergencySystemsConsumption,
  setOtherSystemsConsumption,
  setBuildingsHeatmapRequests,
  setFloorsHeatmapRequests,
  setTenantHeatmapRequests,
  setDistrictPVProductions,
  setBuildingEnergySavings,
  setbuildingWaterSavings,
  setWasteCarbonEmissionByCategory,
  setSecurityRealtimeOperations,
  setFrequencyOfOccurence,
  setAcknowledgmentTime,
  setSecurityIncidents,
  setSecurityIncidentsCountBySeverity,
  setAirQuality,
  setEnergyConsumptionPercentage,
  setBuildingsConsumptionAlerts,
  setHighestEnergyZonesConsumption,
  setEnergyZonesHeatmap,
  setHighestWaterZonesConsumption,
  setWaterZonesHeatmap,
  setWasteProductionBreakdown
} from '../reduxStore/cachingReducer/actions';

const CACHED_API_DISPATCH_ACTION = {
  buildingsConsumptionAlerts: setBuildingsConsumptionAlerts,
  energyConsumption: setEnergyConsumption,
  waterConsumption: setWaterConsumption,
  wasteProduction: setWasteProduction,
  wasteProductionBreakdown: setWasteProductionBreakdown,
  energySavings: setEnergySavings,
  waterSavings: setWaterSavings,
  energyCarbonEmission: setEnergyCarbonEmission,
  waterCarbonEmission: setWaterCarbonEmission,
  wasteCarbonEmission: setWasteCarbonEmission,
  operationsWasteProductionByCategory: setOperationsWasteProductionByCategory,
  constructionWasteProductionByCategory: setConstructionWasteProductionByCategory,
  wasteLocationsRequests: setWasteLocationsRequests,
  buildingSituationsCount: setBuildingSituationsCount,
  highestConsumption: setHighestConsumption,
  sustainabilityConsumption: setSustainabilityConsumption,
  electricityConsumption: setElectricityConsumption,
  coolingConsumption: setCoolingConsumption,
  hvacConsumptionBreakdown: setHvacConsumptionBreakdown,
  lightingSystemsConsumption: setLightingSystemsConsumption,
  liftSystemsConsumption: setLiftSystemsConsumption,
  emergencySystemsConsumption: setEmergencySystemsConsumption,
  otherSystemsConsumption: setOtherSystemsConsumption,
  buildingsHeatmapRequests: setBuildingsHeatmapRequests,
  floorsHeatmapRequests: setFloorsHeatmapRequests,
  tenantHeatmapRequests: setTenantHeatmapRequests,
  districtPVProductions: setDistrictPVProductions,
  buildingEnergySavings: setBuildingEnergySavings,
  buildingWaterSavings: setbuildingWaterSavings,
  wasteCarbonEmissionByCategory: setWasteCarbonEmissionByCategory,
  securityRealtimeOperations: setSecurityRealtimeOperations,
  frequencyOfOccurence: setFrequencyOfOccurence,
  acknowledgmentTime: setAcknowledgmentTime,
  securityIncidents: setSecurityIncidents,
  securityIncidentsCountBySeverity: setSecurityIncidentsCountBySeverity,
  airQuality: setAirQuality,
  energyConsumptionPercentage: setEnergyConsumptionPercentage,
  highestEnergyZonesConsumption: setHighestEnergyZonesConsumption,
  energyZonesHeatmap: setEnergyZonesHeatmap,
  highestWaterZonesConsumption: setHighestWaterZonesConsumption,
  waterZonesHeatmap: setWaterZonesHeatmap
};

const noop = () => {};

const requestTimeout = (fn, delay, registerCancel) => {
  const start = new Date().getTime();

  const loop = () => {
    const delta = new Date().getTime() - start;

    if (delta >= delay) {
      fn();
      registerCancel(noop);
      return;
    }

    const raf = requestAnimationFrame(loop);
    registerCancel(() => cancelAnimationFrame(raf));
  };

  const raf = requestAnimationFrame(loop);
  registerCancel(() => cancelAnimationFrame(raf));
};

export const fetchFromCache = async (key, url, fetch) => {
  let response = null;
  const dispatch = store.dispatch;
  const cache = store.getState().caching[key];

  if (cache?.length) {
    const foundIndex = cache.findIndex((i) => i.url === url);
    if (foundIndex !== -1) {
      const found = cache[foundIndex];
      if (moment().isBefore(moment(found.expiry))) {
        response = found.data ? found.data : {};
      }
    }
  }

  if (!response) {
    response = await fetch();
    const cachedResponse = {
      url: url,
      expiry: moment().add(1, 'day').valueOf(),
      data: response
    };

    const cache = store.getState().caching[key];
    const cacheClone = JSON.parse(JSON.stringify(cache));
    const foundIndex = cache.findIndex((i) => i.url === url);
    if (foundIndex !== -1) {
      const found = cache[foundIndex];
      if (moment().isBefore(moment(found.expiry))) {
        response = found.data ? found.data : {};
      } else {
        cacheClone.splice(foundIndex, 1);
      }
    }
    cacheClone.push(cachedResponse);

    dispatch(CACHED_API_DISPATCH_ACTION[key](cacheClone));
  }

  const promise = () =>
    new Promise((resolve, reject) => {
      let cancel = noop;
      const registerCancel = (fn) => {
        cancel = fn;
      };

      requestTimeout(
        () => {
          cancel();
          resolve(response);
        },
        0,
        registerCancel
      );
    });

  return await promise();
};

const formatDecimals = (num, decimals, withThousandsSeparator = true) => {
  if (!withThousandsSeparator) {
    if (num >= 10) return +parseFloat(num).toFixed(0);
    return +parseFloat(num).toFixed(decimals);
  }
  if (num >= 10) return Number(+parseFloat(num).toFixed(0)).toLocaleString();
  return Number(+parseFloat(num).toFixed(decimals)).toLocaleString();
};

const fixed = (num) => +num.toFixed(1);

const fixedDecimals = (num, decimals) => +num.toFixed(decimals);

const getDate = (date, filter) => {
  switch (filter) {
    case 'year':
    case 'month':
      return moment(date).add(3, 'days').format('YYYY-MMM');
    case 'week':
      return `week ${moment(date).add(3, 'days').week()} ${moment(date).add(3, 'days').format('MMM-YYYY')}`;
    case 'day':
      return moment(date).format('DD-MM-YYYY');
    default:
      break;
  }
};

const addMissingDates = (filter, categories) => {
  if (filter === 'year' || filter === 'month') {
    if (categories.length === 0) categories.push(getDate(moment(new Date()), filter));
    while (categories.length < 12) {
      const nDate = getDate(moment(categories[0], 'YYYY-MMM').subtract(1, 'months'), filter);
      categories = [nDate, ...categories];
    }
  } else if (filter === 'week') {
    if (categories.length === 0) categories.push(getDate(moment(new Date()), filter));
    while (categories.length < 14) {
      var weekNo = categories[0].substring(categories[0].indexOf(' ') + 1, categories[0].lastIndexOf(' '));
      var MonthAndYear = categories[0].substring(categories[0].lastIndexOf(' ') + 1);
      const nDate = getDate(moment(MonthAndYear, 'MMM-YYYY').day('Monday').week(weekNo).subtract(1, 'week'), filter);
      categories = [nDate, ...categories];
    }
  } else if (filter === 'day') {
    if (categories.length === 0) categories.push(getDate(moment(new Date()), filter));
    while (categories.length < 14) {
      const nDate = getDate(moment(categories[0], 'DD-MM-YYYY').subtract(1, 'day'), filter);
      categories = [nDate, ...categories];
    }
  }
  return categories;
};
export {fixed, fixedDecimals, getDate, formatDecimals, addMissingDates};
