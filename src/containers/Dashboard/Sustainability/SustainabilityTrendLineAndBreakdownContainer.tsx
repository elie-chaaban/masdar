import React, {CSSProperties, useEffect, useRef} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {
  SustainabilityTrendLineAndBreakdown,
  SustainabilityTrendLineAndBreakdownVariant
} from '../../../components/Dashboard/SustainabilityTrendLineAndBreakdown';
import {useSelector, shallowEqual} from 'react-redux';
//@ts-ignore
import useFetch, {useFilterCategory} from '../../../hooks';
import {
  fetchElectricityConsumption,
  fetchHvacConsumptionBreakdown,
  fetchLightingSystemsConsumption,
  fetchLiftSystemsConsumption,
  fetchEmergencySystemsConsumption,
  fetchOtherSystemsConsumption,
  fetchCoolingConsumption,
  fetchCarbonEmissionStackedBar,
  fetchEnergyConsumptionStackedBar
  //@ts-ignore
} from '../../../services/energy';
//@ts-ignore
import {fetchWaterDashboard} from '../../../services/water';
//@ts-ignore
import {fetchTotalWasteProductionBreakdown} from '../../../services/waste';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';

export type SustainabilityTrendLineAndBreakdownContainerVariant = SustainabilityTrendLineAndBreakdownVariant;

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    minWidth: '40%',
    height: 280
  },
  condensedContainer: {
    minWidth: 557,
    maxWidth: 557,
    minHeight: 243,
    maxHeight: 243,
    marginLeft: 1,
    backgroundColor: colors.buildingDetailsLightSideBackground
  },
  loadingWrapper: {
    ...spacing.flexVertically,
    justifyContent: 'space-between',
    width: '100%',
    height: 280,
    backgroundColor: colors.chartsCardBackground
  },
  condensendLoadingWrapper: {
    ...spacing.flexVertically,
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 243,
    maxHeight: 243,
    minWidth: 557,
    maxWidth: 557,
    backgroundColor: colors.buildingDetailsBackground
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    height: 280
  },
  condensedContainer: {
    ...spacing.flexVertically,
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 243,
    maxHeight: 243,
    backgroundColor: colors.buildingDetailsBackground
  },
  condensendLoadingWrapper: {
    ...spacing.flexVertically,
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 243,
    maxHeight: 243,
    backgroundColor: colors.buildingDetailsBackground
  }
}));

export interface SustainabilityTrendLineAndBreakdownContainerProps {
  style?: CSSProperties;
  condensed?: boolean;
  selectedInsight?: string;
}

export const SustainabilityTrendLineAndBreakdownContainer = ({
  style = {},
  condensed = false,
  selectedInsight
}: SustainabilityTrendLineAndBreakdownContainerProps) => {
  const dataRef = useRef({loadingSource: {isLoading: true}, chartData: null});
  const {mobileMode} = useSelector((s: any) => s.styling);
  const styles = mobileMode ? mobileStyles : webStyles;
  const {insight} = useSelector((s: any) => s.dashboard);
  const selectedTrendLineOrBreakdown = useSelector((s: any) => s.dashboard.selectedTrendLineOrBreakdown);
  const {floor, building, district, wasteLocation} = useSelector((s: any) => s.map);
  const access = useSelector((s: any) => s.user.access.kpi);
  const hasEnergyAccess = access['energy']?.some((b: any) => b.district_id === district);
  const hasWaterAccess = access['water']?.some((b: any) => b.district_id === district);
  const hasWasteAccess = access['waste']?.some((b: any) => b.district_id === district);
  const hasCarbonAccess = access['carbon']?.some((b: any) => b.district_id === district);
  const {filter, startDate, endDate} = useSelector((s: any) => s.dashboard.dateFilter, shallowEqual);
  const getFilter = useFilterCategory(startDate, filter, condensed);
  const hvacConsumptionBreakdown = useFetch(fetchHvacConsumptionBreakdown, filter, startDate, endDate, district, building, floor);
  const electricityConsumption = useFetch(fetchElectricityConsumption, filter, startDate, endDate, district, building, floor);
  const lightingSystemsConsumption = useFetch(fetchLightingSystemsConsumption, filter, startDate, endDate, district, building, floor);
  const liftSystemsConsumption = useFetch(fetchLiftSystemsConsumption, filter, startDate, endDate, district, building, floor);
  const emergencySystemsConsumption = useFetch(fetchEmergencySystemsConsumption, filter, startDate, endDate, district, building, floor);
  const otherSystemsConsumption = useFetch(fetchOtherSystemsConsumption, filter, startDate, endDate, district, building, floor);
  const coolingConsumption = useFetch(fetchCoolingConsumption, filter, startDate, endDate, district, building, floor);
  const water = useFetch(fetchWaterDashboard, filter, startDate, endDate, district, building, floor);
  const wasteProduction = useFetch(fetchTotalWasteProductionBreakdown, filter, startDate, endDate, district, wasteLocation, building);

  //Carbon Footprint
  const carbonData = useFetch(
    fetchCarbonEmissionStackedBar,
    filter,
    startDate,
    endDate,
    hasCarbonAccess,
    hasEnergyAccess,
    hasWaterAccess,
    hasWasteAccess,
    district,
    building
  );

  const energyData = useFetch(fetchEnergyConsumptionStackedBar, filter, startDate, endDate, district, building);

  useEffect(() => {
    let selected = insight;
    if (selectedTrendLineOrBreakdown && selectedTrendLineOrBreakdown.length) {
      selected = selectedTrendLineOrBreakdown;
    }

    if (selectedInsight) {
      selected = selectedInsight;
    }

    switch (selected) {
      case 'energy':
        energyData.fetch(true);
        break;
      case 'water':
        water.fetch(true);
        break;
      case 'electricity':
        electricityConsumption.fetch(true);
        break;
      case 'hvac':
        hvacConsumptionBreakdown.fetch(true);
        break;
      case 'lighting':
        lightingSystemsConsumption.fetch(true);
        break;
      case 'lift':
        liftSystemsConsumption.fetch(true);
        break;
      case 'emergency':
        emergencySystemsConsumption.fetch(true);
        break;
      case 'others':
        otherSystemsConsumption.fetch(true);
        break;
      case 'cooling':
        coolingConsumption.fetch(true);
        break;
      case 'carbon':
        carbonData.fetch(true);
        break;
    }
    return () => {
      energyData.isMountedRef.current = false;
      water.isMountedRef.current = false;
      electricityConsumption.isMountedRef.current = false;
      hvacConsumptionBreakdown.isMountedRef.current = false;
      lightingSystemsConsumption.isMountedRef.current = false;
      liftSystemsConsumption.isMountedRef.current = false;
      emergencySystemsConsumption.isMountedRef.current = false;
      otherSystemsConsumption.isMountedRef.current = false;
      coolingConsumption.isMountedRef.current = false;
      carbonData.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insight, filter, district, building, floor, selectedTrendLineOrBreakdown]);

  useEffect(() => {
    if (hasWasteAccess) wasteProduction.fetch(true);

    return () => {
      wasteProduction.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insight, filter, district, wasteLocation, building]);

  let selected = insight;
  if (selectedTrendLineOrBreakdown && selectedTrendLineOrBreakdown.length) {
    selected = selectedTrendLineOrBreakdown;
  }

  if (selectedInsight) {
    selected = selectedInsight;
  }

  switch (selected) {
    case 'energy':
      dataRef.current.loadingSource = energyData;
      dataRef.current.chartData = energyData?.response?.chart;
      break;
    case 'water':
      dataRef.current.loadingSource = water;
      dataRef.current.chartData = water?.response?.chart;
      break;
    case 'waste':
      const waste = JSON.stringify(wasteProduction?.response?.chart);
      const wasteProductionClone = waste ? JSON.parse(waste) : [];
      if (filter !== 'day') {
        const lastIndex = wasteProductionClone[0]?.data?.length - 1 || -1;
        if (lastIndex !== -1) {
          wasteProductionClone[0].data.splice(lastIndex, 1);
        }
      }
      dataRef.current.loadingSource = wasteProduction;
      dataRef.current.chartData = wasteProductionClone;
      break;
    case 'electricity':
      dataRef.current.loadingSource = electricityConsumption;
      dataRef.current.chartData = electricityConsumption?.response?.chart;
      break;
    case 'hvac':
      dataRef.current.loadingSource = hvacConsumptionBreakdown;
      dataRef.current.chartData = hvacConsumptionBreakdown?.response?.chart;
      break;
    case 'lighting':
      dataRef.current.loadingSource = lightingSystemsConsumption;
      dataRef.current.chartData = lightingSystemsConsumption?.response?.chart;
      break;
    case 'lift':
      dataRef.current.loadingSource = liftSystemsConsumption;
      dataRef.current.chartData = liftSystemsConsumption?.response?.chart;
      break;
    case 'emergency':
      dataRef.current.loadingSource = emergencySystemsConsumption;
      dataRef.current.chartData = emergencySystemsConsumption?.response?.chart;
      break;
    case 'others':
      dataRef.current.loadingSource = otherSystemsConsumption;
      dataRef.current.chartData = otherSystemsConsumption?.response?.chart;
      break;
    case 'cooling':
      dataRef.current.loadingSource = coolingConsumption;
      dataRef.current.chartData = coolingConsumption?.response?.chart;
      break;
    case 'carbon':
      dataRef.current.loadingSource = carbonData;
      dataRef.current.chartData = carbonData?.response?.chart;
      break;
  }

  return (
    <div
      style={{
        ...styles.container,
        ...style,
        ...(condensed ? styles.condensedContainer : {})
      }}
    >
      {dataRef.current.loadingSource.isLoading ? (
        <div style={{...styles.loadingWrapper, ...(condensed ? styles.condensendLoadingWrapper : {})}}>
          <Loader height={condensed ? '195px' : '280px'} margin={0} />
        </div>
      ) : (
        <SustainabilityTrendLineAndBreakdown
          variant={selected}
          series={dataRef.current.chartData}
          categories={getFilter}
          condensed={condensed}
        />
      )}
    </div>
  );
};
