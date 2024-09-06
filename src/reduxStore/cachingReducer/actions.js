import {
  setEnergyConsumption as setEnergyConsumptionAction,
  setWaterConsumption as setWaterConsumptionAction,
  setWasteProduction as setWasteProductionAction,
  setEnergySavings as setEnergySavingsAction,
  setWaterSavings as setWaterSavingsAction,
  setEnergyCarbonEmission as setEnergyCarbonEmissionAction,
  setWaterCarbonEmission as setWaterCarbonEmissionAction,
  setWasteCarbonEmission as setWasteCarbonEmissionAction,
  setConstructionWasteProductionByCategory as setConstructionWasteProductionByCategoryAction,
  setOperationsWasteProductionByCategory as setOperationsWasteProductionByCategoryAction,
  setWasteLocationsRequests as setWasteLocationsRequestsAction,
  setBuildingSituationsCount as setBuildingSituationsCountAction,
  setHighestConsumption as setHighestConsumptionAction,
  setSustainabilityConsumption as setSustainabilityConsumptionAction,
  setElectricityConsumption as setElectricityConsumptionAction,
  setCoolingConsumption as setCoolingConsumptionAction,
  setHvacConsumptionBreakdown as setHvacConsumptionBreakdownAction,
  setLightingSystemsConsumption as setLightingSystemsConsumptionAction,
  setLiftSystemsConsumption as setLiftSystemsConsumptionAction,
  setEmergencySystemsConsumption as setEmergencySystemsConsumptionAction,
  setOtherSystemsConsumption as setOtherSystemsConsumptionAction,
  setBuildingsHeatmapRequests as setBuildingsHeatmapRequestsAction,
  setFloorsHeatmapRequests as setFloorsHeatmapRequestsAction,
  setTenantHeatmapRequests as setTenantHeatmapRequestsAction,
  setDistrictPVProductions as setDistrictPVProductionsAction,
  setBuildingEnergySavings as setBuildingEnergySavingsAction,
  setbuildingWaterSavings as setbuildingWaterSavingsAction,
  setWasteCarbonEmissionByCategory as setWasteCarbonEmissionByCategoryAction,
  setSecurityRealtimeOperations as setSecurityRealtimeOperationsAction,
  setFrequencyOfOccurence as setFrequencyOfOccurenceAction,
  setAcknowledgmentTime as setAcknowledgmentTimeAction,
  setSecurityIncidents as setSecurityIncidentsAction,
  setSecurityIncidentsCountBySeverity as setSecurityIncidentsCountBySeverityAction,
  setAirQuality as setAirQualityAction,
  setEnergyConsumptionPercentage as setEnergyConsumptionPercentageAction,
  setBuildingsConsumptionAlerts as setBuildingsConsumptionAlertsAction,
  setHighestEnergyZonesConsumption as setHighestEnergyZonesConsumptionAction,
  setEnergyZonesHeatmap as setEnergyZonesHeatmapAction,
  setHighestWaterZonesConsumption as setHighestWaterZonesConsumptionAction,
  setWaterZonesHeatmap as setWaterZonesHeatmapAction,
  setWasteProductionBreakdown as setWasteProductionBreakdownAction
} from './index';

export const setWasteProductionBreakdown = (payload) => (dispatch) => {
  dispatch(setWasteProductionBreakdownAction(payload));
};
export const setBuildingsConsumptionAlerts = (payload) => (dispatch) => {
  dispatch(setBuildingsConsumptionAlertsAction(payload));
};
export const setSecurityIncidentsCountBySeverity = (payload) => (dispatch) => {
  dispatch(setSecurityIncidentsCountBySeverityAction(payload));
};
export const setSecurityIncidents = (payload) => (dispatch) => {
  dispatch(setSecurityIncidentsAction(payload));
};
export const setAcknowledgmentTime = (payload) => (dispatch) => {
  dispatch(setAcknowledgmentTimeAction(payload));
};
export const setFrequencyOfOccurence = (payload) => (dispatch) => {
  dispatch(setFrequencyOfOccurenceAction(payload));
};
export const setSecurityRealtimeOperations = (payload) => (dispatch) => {
  dispatch(setSecurityRealtimeOperationsAction(payload));
};
export const setWasteCarbonEmissionByCategory = (payload) => (dispatch) => {
  dispatch(setWasteCarbonEmissionByCategoryAction(payload));
};
export const setbuildingWaterSavings = (payload) => (dispatch) => {
  dispatch(setbuildingWaterSavingsAction(payload));
};
export const setBuildingEnergySavings = (payload) => (dispatch) => {
  dispatch(setBuildingEnergySavingsAction(payload));
};
export const setEnergyConsumption = (payload) => (dispatch) => {
  dispatch(setEnergyConsumptionAction(payload));
};

export const setWaterConsumption = (payload) => (dispatch) => {
  dispatch(setWaterConsumptionAction(payload));
};

export const setWasteProduction = (payload) => (dispatch) => {
  dispatch(setWasteProductionAction(payload));
};

export const setEnergySavings = (payload) => (dispatch) => {
  dispatch(setEnergySavingsAction(payload));
};

export const setWaterSavings = (payload) => (dispatch) => {
  dispatch(setWaterSavingsAction(payload));
};

export const setEnergyCarbonEmission = (payload) => (dispatch) => {
  dispatch(setEnergyCarbonEmissionAction(payload));
};

export const setWaterCarbonEmission = (payload) => (dispatch) => {
  dispatch(setWaterCarbonEmissionAction(payload));
};

export const setWasteCarbonEmission = (payload) => (dispatch) => {
  dispatch(setWasteCarbonEmissionAction(payload));
};

export const setOperationsWasteProductionByCategory = (payload) => (dispatch) => {
  dispatch(setOperationsWasteProductionByCategoryAction(payload));
};
export const setConstructionWasteProductionByCategory = (payload) => (dispatch) => {
  dispatch(setConstructionWasteProductionByCategoryAction(payload));
};

export const setWasteLocationsRequests = (payload) => (dispatch) => {
  dispatch(setWasteLocationsRequestsAction(payload));
};

export const setBuildingSituationsCount = (payload) => (dispatch) => {
  dispatch(setBuildingSituationsCountAction(payload));
};

export const setHighestConsumption = (payload) => (dispatch) => {
  dispatch(setHighestConsumptionAction(payload));
};

export const setSustainabilityConsumption = (payload) => (dispatch) => {
  dispatch(setSustainabilityConsumptionAction(payload));
};

export const setElectricityConsumption = (payload) => (dispatch) => {
  dispatch(setElectricityConsumptionAction(payload));
};

export const setCoolingConsumption = (payload) => (dispatch) => {
  dispatch(setCoolingConsumptionAction(payload));
};

export const setHvacConsumptionBreakdown = (payload) => (dispatch) => {
  dispatch(setHvacConsumptionBreakdownAction(payload));
};

export const setLightingSystemsConsumption = (payload) => (dispatch) => {
  dispatch(setLightingSystemsConsumptionAction(payload));
};

export const setLiftSystemsConsumption = (payload) => (dispatch) => {
  dispatch(setLiftSystemsConsumptionAction(payload));
};

export const setEmergencySystemsConsumption = (payload) => (dispatch) => {
  dispatch(setEmergencySystemsConsumptionAction(payload));
};

export const setOtherSystemsConsumption = (payload) => (dispatch) => {
  dispatch(setOtherSystemsConsumptionAction(payload));
};

export const setBuildingsHeatmapRequests = (payload) => (dispatch) => {
  dispatch(setBuildingsHeatmapRequestsAction(payload));
};

export const setFloorsHeatmapRequests = (payload) => (dispatch) => {
  dispatch(setFloorsHeatmapRequestsAction(payload));
};

export const setTenantHeatmapRequests = (payload) => (dispatch) => {
  dispatch(setTenantHeatmapRequestsAction(payload));
};

export const setDistrictPVProductions = (payload) => (dispatch) => {
  dispatch(setDistrictPVProductionsAction(payload));
};

export const setAirQuality = (payload) => (dispatch) => {
  dispatch(setAirQualityAction(payload));
};

export const setEnergyConsumptionPercentage = (payload) => (dispatch) => {
  dispatch(setEnergyConsumptionPercentageAction(payload));
};

export const setHighestEnergyZonesConsumption = (payload) => (dispatch) => {
  dispatch(setHighestEnergyZonesConsumptionAction(payload));
};

export const setEnergyZonesHeatmap = (payload) => (dispatch) => {
  dispatch(setEnergyZonesHeatmapAction(payload));
};

export const setHighestWaterZonesConsumption = (payload) => (dispatch) => {
  dispatch(setHighestWaterZonesConsumptionAction(payload));
};

export const setWaterZonesHeatmap = (payload) => (dispatch) => {
  dispatch(setWaterZonesHeatmapAction(payload));
};
