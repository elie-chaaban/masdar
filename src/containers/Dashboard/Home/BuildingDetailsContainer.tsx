import React, {useEffect, useCallback, useState} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
//@ts-ignore
import {SlideIn} from '../../../components/Utils';
import {BuildingDetails} from '../../../components/Dashboard/BuildingDetails';
import {Insight} from '../../../utils/dashboard';
import {ImpactCard, ImpactState} from '../../../components/Dashboard/SustainabilityTotalConsumptionCard';
//@ts-ignore
import useFetch from '../../../hooks';
import {
  fetchTotalEnergyConsumption,
  fetchEnergySavings,
  fetchBuildingEnergySavings,
  fetchCarbonEmissionAndTrendLine,
  fetchEnergyConsumptionPercentage,
  fetchHighestEnergyZonesConsumption,
  fetchEnergyZonesHeatmap
  //@ts-ignore
} from '../../../services/energy';
import {
  fetchWaterDashboard,
  fetchWaterSavings,
  fetchBuildingWaterSavings,
  fetchWaterCarbonEmissionAndTrendLine,
  fetchHighestWaterZonesConsumption,
  fetchWaterZonesHeatmap
  //@ts-ignore
} from '../../../services/water';
import {
  fetchTotalWasteProduction,
  fetchOperationsWasteProductionByCategory,
  fetchWasteCarbonEmissionAndTrendLine
  //@ts-ignore
} from '../../../services/waste';
import {
  setSelectedTrendLineOrBreakdown,
  buildingSelection,
  setShowAirQuality,
  setIsBuildingComparisonOpened,
  wasteLocationSelection,
  setDistrictPvProductionChart,
  setIsAirQualityDrillDownOpened,
  toggleActionSlider
  // @ts-ignore
} from '../../../reduxStore/actions';
//@ts-ignore
import {getIFramesUrls} from '../../../services/user';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    position: 'absolute',
    minHeight: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    top: 80,
    left: 48,
    right: 0,
    bottom: 0,
    zIndex: 99,
    backgroundColor: colors.buildingDetailsBackground
  }
}));

const tabletStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...webStyles.container,
    maxWidth: 1318
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...webStyles.container,
    top: 0,
    marginLeft: '-11rem',
    overflow: 'scroll',
    overflowX: 'hidden'
  }
}));

export const BuildingDetailsContainer = (): JSX.Element => {
  const dispatch = useDispatch();
  const [selectedTenantInsight, setSelectedTenantInsight] = useState(Insight.ENERGY);
  const {insight, actionSlider} = useSelector((s: any) => s.dashboard);
  const {floor, building, district, wasteLocation, buildings, zones} = useSelector((s: any) => s.map);
  const {filter, startDate, endDate} = useSelector((s: any) => s.dashboard.dateFilter, shallowEqual);

  const selectedBuilding = buildings.find((b: any) => b?.id?.toLowerCase() === building?.toLowerCase());

  const accessModules = useSelector((s: any) => s.user.access.modules);

  const access = useSelector((s: any) => s.user.access.kpi);
  const hasEnergyAccess = access['energy']?.some((b: any) => b.district_id === district);
  const hasWaterAccess = access['water']?.some((b: any) => b.district_id === district);
  const hasWasteAccess = access['waste']?.some((b: any) => b.district_id === district);
  const hasCarbonAccess = access['carbon']?.some((b: any) => b.district_id === district);

  const {energyAnalysis, assetsAnalysis} = useSelector((s: any) => s.user.access);
  const hasEnergyAnalysisAccess = energyAnalysis?.includes(district);
  const hasAssetsAnalysisAccess = assetsAnalysis?.includes(district);

  const energyConsumption = useFetch(fetchTotalEnergyConsumption, filter, startDate, endDate, district, building, floor);
  const energyConsumptionPercentage = useFetch(fetchEnergyConsumptionPercentage, filter, startDate, endDate, district, building);
  const water = useFetch(fetchWaterDashboard, filter, startDate, endDate, district, building, floor);
  const wasteProduction = useFetch(fetchTotalWasteProduction, filter, startDate, endDate, district, wasteLocation, building);

  const energySavings = useFetch(fetchEnergySavings, filter, startDate, endDate, district, building);
  const waterSavings = useFetch(fetchWaterSavings, filter, startDate, endDate, district, building);

  const buildingEnergySavings = useFetch(fetchBuildingEnergySavings, filter, startDate, endDate, district, building);
  const buildingWaterSavings = useFetch(fetchBuildingWaterSavings, filter, startDate, endDate, district, building);

  const operationsWasteProductionByCategory = useFetch(
    fetchOperationsWasteProductionByCategory,
    filter,
    startDate,
    endDate,
    district,
    wasteLocation,
    building
  );

  //Carbon Footprint
  const energyCarbonEmission = useFetch(fetchCarbonEmissionAndTrendLine, filter, startDate, endDate, district, building);
  const waterCarbonEmission = useFetch(fetchWaterCarbonEmissionAndTrendLine, filter, startDate, endDate, district, building);
  const wasteCarbonEmission = useFetch(fetchWasteCarbonEmissionAndTrendLine, filter, startDate, endDate, district, building);

  const {tabletMode, mobileMode} = useSelector((s: any) => s.styling);

  const buildingUrls = useFetch(getIFramesUrls, district, building);

  const [showTenantsAnalytics, setShowTenantsAnalytics] = useState(false);
  const [selectedZone, setSelectedZone] = useState<any>();
  const [searchText, setSearchText] = useState('');

  const zoneId = selectedZone?.zone?.id;

  const styles = mobileMode ? mobileStyles : tabletMode ? tabletStyles : webStyles;

  const tenantEnergyConsumption = useFetch(fetchTotalEnergyConsumption, filter, startDate, endDate, district, building, floor, zoneId);
  const tenantEnergyConsumptionPercentage = useFetch(
    fetchEnergyConsumptionPercentage,
    filter,
    startDate,
    endDate,
    district,
    building,
    null,
    zoneId
  );
  const tenantWater = useFetch(fetchWaterDashboard, filter, startDate, endDate, district, building, floor, zoneId);
  const tenantEnergyCarbonEmission = useFetch(
    fetchCarbonEmissionAndTrendLine,
    filter,
    startDate,
    endDate,
    district,
    building,
    null,
    zoneId
  );
  const tenantWaterCarbonEmission = useFetch(
    fetchWaterCarbonEmissionAndTrendLine,
    filter,
    startDate,
    endDate,
    district,
    building,
    null,
    zoneId
  );
  const tenantEnergySavings = useFetch(fetchEnergySavings, filter, startDate, endDate, district, building, null, zoneId);
  const tenantWaterSavings = useFetch(fetchWaterSavings, filter, startDate, endDate, district, building, null, zoneId);

  const highestEnergyZonesConsumption = useFetch(fetchHighestEnergyZonesConsumption, filter, startDate, endDate, district, building);
  const highestWaterZonesConsumption = useFetch(fetchHighestWaterZonesConsumption, filter, startDate, endDate, district, building);
  const energyZonesHeatmap = useFetch(fetchEnergyZonesHeatmap, filter, startDate, endDate, district, building);
  const waterZonesHeatmap = useFetch(fetchWaterZonesHeatmap, filter, startDate, endDate, district, building);

  useEffect(() => {
    if (highestEnergyZonesConsumption?.response && zones && !selectedZone) {
      const highestEnergyConsumptionZone = highestEnergyZonesConsumption.response.data?.[0];
      if (highestEnergyConsumptionZone) {
        const found = zones.find((zone: any) => zone.zone.name === highestEnergyConsumptionZone.title);
        setSelectedZone(found);
        setSearchText(highestEnergyConsumptionZone.title);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zones, highestEnergyZonesConsumption]);

  useEffect(() => {
    if (showTenantsAnalytics) {
      if (selectedTenantInsight === Insight.ENERGY) {
        highestEnergyZonesConsumption.fetch(true);
        energyZonesHeatmap.fetch(true);
      } else {
        highestWaterZonesConsumption.fetch(true);
        waterZonesHeatmap.fetch(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, district, building, showTenantsAnalytics, selectedTenantInsight]);

  useEffect(() => {
    if (showTenantsAnalytics && zoneId) {
      if (selectedTenantInsight === Insight.ENERGY) {
        tenantEnergyConsumption.fetch(true);
        tenantEnergyConsumptionPercentage.fetch(true);
        tenantEnergyCarbonEmission.fetch(true);
        tenantEnergySavings.fetch(true);
      } else {
        tenantWater.fetch(true);
        tenantWaterCarbonEmission.fetch(true);
        tenantWaterSavings.fetch(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTenantsAnalytics, selectedTenantInsight, filter, district, building, zoneId]);

  useEffect(() => {
    if (district || building) buildingUrls.fetch(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district, building]);

  useEffect(() => {
    if (hasEnergyAccess) {
      energyConsumption.fetch(true);
      energyConsumptionPercentage.fetch(true);
    }
    if (hasWaterAccess) water.fetch(true);
    if (hasEnergyAccess) energySavings.fetch(true);
    if (hasWaterAccess) waterSavings.fetch(true);

    if (hasCarbonAccess) {
      if (hasEnergyAccess) energyCarbonEmission.fetch(true);
      if (hasWaterAccess) waterCarbonEmission.fetch(true);
      if (hasWasteAccess) wasteCarbonEmission.fetch(true);
    }

    buildingEnergySavings.fetch(true);
    buildingWaterSavings.fetch(true);
    return () => {
      energyConsumption.isMountedRef.current = false;
      energyConsumptionPercentage.isMountedRef.current = false;
      water.isMountedRef.current = false;
      energySavings.isMountedRef.current = false;
      waterSavings.isMountedRef.current = false;
      buildingEnergySavings.isMountedRef.current = false;
      buildingWaterSavings.isMountedRef.current = false;
      energyCarbonEmission.isMountedRef.current = false;
      waterCarbonEmission.isMountedRef.current = false;
      wasteCarbonEmission.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insight, filter, district, building, floor]);

  useEffect(() => {
    if (hasWasteAccess) wasteProduction.fetch(true);
    operationsWasteProductionByCategory.fetch(true);
    return () => {
      wasteProduction.isMountedRef.current = false;
      operationsWasteProductionByCategory.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insight, filter, district, wasteLocation, building]);

  const getImpactCard = useCallback(
    (insightType: Insight): ImpactCard | undefined => {
      let carsSaved = 0;
      let yearImpactData = null;

      switch (insightType) {
        case Insight.ENERGY:
          yearImpactData = energySavings?.response?.savingsPercentage || 0;
          carsSaved = parseInt(energySavings?.response?.carsSaved?.toString() || '0');
          break;
        case Insight.WATER:
          yearImpactData = waterSavings?.response?.savingsPercentage || 0;
          carsSaved = parseInt(waterSavings?.response?.carsSaved?.toString() || '0');
          break;
        case Insight.WASTE:
          yearImpactData = 0;
          carsSaved = 0;
          return undefined;
        default:
          return undefined;
      }

      const impactCard: ImpactCard = {
        impactInsight: insightType,
        impactValue: Math.abs(yearImpactData),
        impactState: yearImpactData >= 0 ? ImpactState.drop : ImpactState.raise,
        carsSaved: carsSaved
      };

      return impactCard;
    },
    [
      energySavings?.response?.savingsPercentage,
      energySavings?.response?.carsSaved,
      waterSavings?.response?.savingsPercentage,
      waterSavings?.response?.carsSaved
    ]
  );

  const onBackButtonClick = useCallback(() => {
    dispatch(buildingSelection());
    dispatch(setIsAirQualityDrillDownOpened(false));
    dispatch(wasteLocationSelection());
    dispatch(setSelectedTrendLineOrBreakdown(null));
    dispatch(setIsBuildingComparisonOpened(false));
    dispatch(setShowAirQuality(true));
    dispatch(setDistrictPvProductionChart(null));
    if (actionSlider.open) dispatch(toggleActionSlider());
  }, [actionSlider.open, dispatch]);

  const onSustainabilityAnalysisClick = useCallback(() => {
    if (mobileMode) {
      const iframe = buildingUrls?.response?.districtPortals?.find(
        (item: any) => item.section === 'ENERGY_DETAILS' && item.module === 'ENERGY' && item.buildingId === building
      );
      const url = iframe ? iframe.kpiConfiguration.apiUrl : '';
      window.open(url, '_blank');
    } else {
      dispatch(toggleActionSlider('energy', 'ENERGY_DETAILS'));
    }
  }, [building, buildingUrls?.response?.districtPortals, dispatch, mobileMode]);

  const onBuildingManagementClick = useCallback(() => {
    const iframe = buildingUrls?.response?.districtPortals?.find(
      (item: any) => item.section === 'ASSET_DETAILS' && item.module === 'ENERGY' && item.buildingId === building
    );
    const url = iframe ? iframe.kpiConfiguration.apiUrl : '';
    // dispatch(toggleActionSlider('energy', 'ASSET_DETAILS'));
    window.open(url, '_blank');
  }, [building, buildingUrls?.response?.districtPortals]);

  const onClickConsumptionType = useCallback((insight: Insight) => {
    setSelectedTenantInsight(insight);
  }, []);

  const onTenantsAnalyticsClick = useCallback(() => {
    setShowTenantsAnalytics(!showTenantsAnalytics);
  }, [showTenantsAnalytics]);

  const onSearchTextChange = useCallback((e: any) => {
    const value = e.target.value;
    setSearchText(value?.toUpperCase());
  }, []);

  const onSearchUnit = useCallback(
    (unitName: string) => {
      const found = zones.find((zone: any) => zone.zone.name === unitName);
      setSelectedZone(found);
    },
    [zones]
  );

  return (
    <SlideIn in animation={'slideUp'} style={styles.container}>
      <BuildingDetails
        buildingImageSource={`${process.env['REACT_APP_FILES_URL']}${selectedBuilding?.imageFile?.filePath}`}
        buildingName={selectedBuilding?.name}
        buildingArea={selectedBuilding?.area}
        buildingEnergyProfile={selectedBuilding?.energyProfile ?? ''}
        buildingTotalFloors={selectedBuilding?.floors?.length || 0}
        hasEnergyAccess={hasEnergyAccess}
        energyConsumption={energyConsumption}
        energyConsumptionPercentage={energyConsumptionPercentage}
        hasWaterAccess={hasWaterAccess}
        water={water}
        hasWasteAccess={hasWasteAccess}
        wasteProduction={wasteProduction}
        accessModules={accessModules}
        buildingEnergySavings={buildingEnergySavings}
        buildingWaterSavings={buildingWaterSavings}
        wasteProductionByCategory={operationsWasteProductionByCategory}
        hasCarbonAccess={hasCarbonAccess}
        energyCarbonEmission={energyCarbonEmission}
        waterCarbonEmission={waterCarbonEmission}
        wasteCarbonEmission={wasteCarbonEmission}
        getImpactCard={getImpactCard}
        onBackButtonClick={onBackButtonClick}
        onSustainabilityAnalysisClick={onSustainabilityAnalysisClick}
        onBuildingManagementClick={onBuildingManagementClick}
        tabletMode={tabletMode}
        hasEnergyAnalysisAccess={hasEnergyAnalysisAccess}
        hasAssetsAnalysisAccess={hasAssetsAnalysisAccess}
        showTenantsAnalyticsButton={selectedBuilding.showTenantsAnalytics}
        showTenantsAnalytics={showTenantsAnalytics}
        maximumNumberOfUnits={selectedBuilding?.maximumNumberOfUnits}
        selectedTenantInsight={selectedTenantInsight}
        onClickConsumptionType={onClickConsumptionType}
        onTenantsAnalyticsClick={onTenantsAnalyticsClick}
        onSearchTextChange={onSearchTextChange}
        searchText={searchText}
        onSearchUnit={onSearchUnit}
        selectedZone={selectedZone}
        tenantEnergyConsumption={searchText ? tenantEnergyConsumption : {isLoading: false}}
        tenantEnergyConsumptionPercentage={searchText ? tenantEnergyConsumptionPercentage : {isLoading: false}}
        tenantEnergyCarbonEmission={searchText ? tenantEnergyCarbonEmission : {isLoading: false}}
        tenantEnergySavings={searchText ? tenantEnergySavings : {isLoading: false}}
        tenantWater={searchText ? tenantWater : {isLoading: false}}
        tenantWaterCarbonEmission={searchText ? tenantWaterCarbonEmission : {isLoading: false}}
        tenantWaterSavings={searchText ? tenantWaterSavings : {isLoading: false}}
        blocks={selectedTenantInsight === Insight.ENERGY ? energyZonesHeatmap : waterZonesHeatmap}
        highestZonesConsumption={selectedTenantInsight === Insight.ENERGY ? highestEnergyZonesConsumption : highestWaterZonesConsumption}
      />
    </SlideIn>
  );
};
