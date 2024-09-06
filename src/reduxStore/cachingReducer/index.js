import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  energyConsumption: [],
  waterConsumption: [],
  wasteProduction: [],
  energySavings: [],
  waterSavings: [],
  energyCarbonEmission: [],
  waterCarbonEmission: [],
  wasteCarbonEmission: [],
  operationsWasteProductionByCategory: [],
  constructionWasteProductionByCategory: [],
  wasteLocationsRequests: [],
  buildingSituationsCount: [],
  highestConsumption: [],
  sustainabilityConsumption: [],
  electricityConsumption: [],
  coolingConsumption: [],
  hvacConsumptionBreakdown: [],
  lightingSystemsConsumption: [],
  liftSystemsConsumption: [],
  emergencySystemsConsumption: [],
  otherSystemsConsumption: [],
  buildingsHeatmapRequests: [],
  floorsHeatmapRequests: [],
  tenantHeatmapRequests: [],
  districtPVProductions: [],
  buildingEnergySavings: [],
  buildingWaterSavings: [],
  wasteCarbonEmissionByCategory: [],
  securityRealtimeOperations: [],
  frequencyOfOccurence: [],
  acknowledgmentTime: [],
  securityIncidents: [],
  securityIncidentsCountBySeverity: [],
  airQuality: [],
  energyConsumptionPercentage: [],
  buildingsConsumptionAlerts: [],
  highestEnergyZonesConsumption: [],
  energyZonesHeatmap: [],
  highestWaterZonesConsumption: [],
  waterZonesHeatmap: [],
  wasteProductionBreakdown: []
};

export const cachingSlice = createSlice({
  name: 'caching',
  initialState,
  reducers: {
    setWasteCarbonEmissionByCategory: (state, action) => {
      state.wasteCarbonEmissionByCategory = action.payload;
    },
    setWasteProductionBreakdown: (state, action) => {
      state.wasteProductionBreakdown = action.payload;
    },
    setEnergyConsumption: (state, action) => {
      state.energyConsumption = action.payload;
    },
    setWaterConsumption: (state, action) => {
      state.waterConsumption = action.payload;
    },
    setWasteProduction: (state, action) => {
      state.wasteProduction = action.payload;
    },
    setEnergySavings: (state, action) => {
      state.energySavings = action.payload;
    },
    setWaterSavings: (state, action) => {
      state.waterSavings = action.payload;
    },
    setEnergyCarbonEmission: (state, action) => {
      state.energyCarbonEmission = action.payload;
    },
    setWaterCarbonEmission: (state, action) => {
      state.waterCarbonEmission = action.payload;
    },
    setWasteCarbonEmission: (state, action) => {
      state.wasteCarbonEmission = action.payload;
    },
    setConstructionWasteProductionByCategory: (state, action) => {
      state.constructionWasteProductionByCategory = action.payload;
    },
    setOperationsWasteProductionByCategory: (state, action) => {
      state.operationsWasteProductionByCategory = action.payload;
    },
    setWasteLocationsRequests: (state, action) => {
      state.wasteLocationsRequests = action.payload;
    },
    setBuildingSituationsCount: (state, action) => {
      state.buildingSituationsCount = action.payload;
    },
    setHighestConsumption: (state, action) => {
      state.highestConsumption = action.payload;
    },
    setSustainabilityConsumption: (state, action) => {
      state.sustainabilityConsumption = action.payload;
    },
    setElectricityConsumption: (state, action) => {
      state.electricityConsumption = action.payload;
    },
    setCoolingConsumption: (state, action) => {
      state.coolingConsumption = action.payload;
    },
    setHvacConsumptionBreakdown: (state, action) => {
      state.hvacConsumptionBreakdown = action.payload;
    },
    setLightingSystemsConsumption: (state, action) => {
      state.lightingSystemsConsumption = action.payload;
    },
    setLiftSystemsConsumption: (state, action) => {
      state.liftSystemsConsumption = action.payload;
    },
    setEmergencySystemsConsumption: (state, action) => {
      state.emergencySystemsConsumption = action.payload;
    },
    setOtherSystemsConsumption: (state, action) => {
      state.otherSystemsConsumption = action.payload;
    },
    setBuildingsHeatmapRequests: (state, action) => {
      state.buildingsHeatmapRequests = action.payload;
    },
    setFloorsHeatmapRequests: (state, action) => {
      state.floorsHeatmapRequests = action.payload;
    },
    setTenantHeatmapRequests: (state, action) => {
      state.tenantHeatmapRequests = action.payload;
    },
    setDistrictPVProductions: (state, action) => {
      state.districtPVProductions = action.payload;
    },
    setBuildingEnergySavings: (state, action) => {
      state.buildingEnergySavings = action.payload;
    },
    setbuildingWaterSavings: (state, action) => {
      state.buildingWaterSavings = action.payload;
    },
    setSecurityRealtimeOperations: (state, action) => {
      state.securityRealtimeOperations = action.payload;
    },
    setFrequencyOfOccurence: (state, action) => {
      state.frequencyOfOccurence = action.payload;
    },
    setAcknowledgmentTime: (state, action) => {
      state.acknowledgmentTime = action.payload;
    },
    setSecurityIncidents: (state, action) => {
      state.securityIncidents = action.payload;
    },
    setSecurityIncidentsCountBySeverity: (state, action) => {
      state.securityIncidentsCountBySeverity = action.payload;
    },
    setAirQuality: (state, action) => {
      state.airQuality = action.payload;
    },
    setEnergyConsumptionPercentage: (state, action) => {
      state.energyConsumptionPercentage = action.payload;
    },
    setBuildingsConsumptionAlerts: (state, action) => {
      state.buildingsConsumptionAlerts = action.payload;
    },
    setHighestEnergyZonesConsumption: (state, action) => {
      state.highestEnergyZonesConsumption = action.payload;
    },
    setEnergyZonesHeatmap: (state, action) => {
      state.energyZonesHeatmap = action.payload;
    },
    setHighestWaterZonesConsumption: (state, action) => {
      state.highestWaterZonesConsumption = action.payload;
    },
    setWaterZonesHeatmap: (state, action) => {
      state.waterZonesHeatmap = action.payload;
    }
  }
});

export const {
  setBuildingsConsumptionAlerts,
  setEnergyConsumptionPercentage,
  setSecurityIncidentsCountBySeverity,
  setSecurityIncidents,
  setAcknowledgmentTime,
  setFrequencyOfOccurence,
  setSecurityRealtimeOperations,
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
  setWasteProductionBreakdown,
  setDistrictPVProductions,
  setBuildingEnergySavings,
  setbuildingWaterSavings,
  setWasteCarbonEmissionByCategory,
  setAirQuality,
  setHighestEnergyZonesConsumption,
  setEnergyZonesHeatmap,
  setHighestWaterZonesConsumption,
  setWaterZonesHeatmap
} = cachingSlice.actions;

export default cachingSlice.reducer;
