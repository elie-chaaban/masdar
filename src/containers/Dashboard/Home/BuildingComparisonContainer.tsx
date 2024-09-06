import React, {useState, useCallback} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {BuildingComparison, Building, BuildingInsightsDetails} from '../../../components/Dashboard/BuildingComparison';
import {Insight, Intensity, UnitFormat, unitFormatter, valueFormatter} from '../../../utils/dashboard';
// @ts-ignore
import {setIsBuildingComparisonOpened} from '../../../reduxStore/actions';
//@ts-ignore
import {fetchTotalEnergyConsumption, fetchCarbonEmissionAndTrendLine} from '../../../services/energy';
//@ts-ignore
import {fetchWaterDashboard, fetchWaterCarbonEmissionAndTrendLine} from '../../../services/water';
//@ts-ignore
import {fetchTotalWasteProduction, fetchWasteCarbonEmissionAndTrendLine} from '../../../services/waste';
//@ts-ignore
import {SlideIn} from '../../../components/Utils';
import {
  fetchRealTimeOperations,
  fetchFrequencyOfOccurence,
  fetchAcknowledgmentTime,
  fetchSecurityIncidentsCountBySeverity
  //@ts-ignore
} from '../../../services/security';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flex,
    position: 'absolute',
    maxHeight: 970,
    top: 0,
    left: 48,
    right: 0,
    bottom: 0,
    zIndex: 100002,
    backgroundColor: colors.buildingComparisonBackground,
    backdropFilter: 'blur(5.5px)'
  },
  containerIncreaseHeight: {
    maxHeight: 1100,
    top: 70
  },
  wasteDivertedValueWrapper: {
    display: 'flex',
    minHeight: 55,
    alignItems: 'flex-end'
  }
}));

export const BuildingComparisonContainer = (): JSX.Element => {
  const dispatch = useDispatch();
  const {buildings, wasteLocations, district} = useSelector((s: any) => s.map);
  const {selectedModule} = useSelector((s: any) => s.dashboard);
  const {filter, startDate, endDate} = useSelector((s: any) => s.dashboard.dateFilter, shallowEqual);
  const access = useSelector((s: any) => s.user.access.kpi);
  const hasEnergyAccess = access['energy']?.some((b: any) => b.district_id === district);
  const hasWaterAccess = access['water']?.some((b: any) => b.district_id === district);
  const hasCarbonAccess = access['carbon']?.some((b: any) => b.district_id === district);
  const hasWasteAccess = access['waste']?.some((b: any) => b.district_id === district);
  const accessModules = useSelector((s: any) => s.user.access.modules);
  const [buildingsInsights, setBuildingsInsights] = useState<BuildingInsightsDetails[]>([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const prepareBuildings = useCallback((): Building[] => {
    const temp: Building[] = [];
    buildings.forEach((b: any) => {
      if (b.hasData) {
        if (b.imageFile?.filePath) {
          const imageUrl = `${process.env['REACT_APP_FILES_URL']}${b.imageFile.filePath}`;
          temp.push({...b, imageUrl});
        }
      }
    });
    return temp;
  }, [buildings]);

  const onDismiss = useCallback(() => {
    dispatch(setIsBuildingComparisonOpened(false));
  }, [dispatch]);

  const fetchSustainabilityBuildingInsights = useCallback(
    async (buildingId: string): Promise<BuildingInsightsDetails> => {
      const foundBuilding = buildings.find((b: any) => b.id === buildingId);
      const imageUrl = `${process.env['REACT_APP_FILES_URL']}${foundBuilding.imageFile.filePath}`;
      const foundWasteLocation = wasteLocations?.find((w: any) => w.buildingId === buildingId);
      const wasteLocation = foundWasteLocation?.location || '';

      let wasteProduction = {
        waste: 0,
        divertedPercentage: 0
      };

      if (wasteLocation && hasWasteAccess) {
        wasteProduction = await fetchTotalWasteProduction(filter, startDate, endDate, district, wasteLocation, buildingId);
      }

      const energyConsumption = hasEnergyAccess
        ? await fetchTotalEnergyConsumption(filter, startDate, endDate, district, buildingId)
        : {energy: 0, kwh: 0};
      const waterConsumption = hasWaterAccess
        ? await fetchWaterDashboard(filter, startDate, endDate, district, buildingId)
        : {water: 0, kwh: 0};
      const energyCarbonEmission =
        hasCarbonAccess & hasEnergyAccess
          ? await fetchCarbonEmissionAndTrendLine(filter, startDate, endDate, district, buildingId)
          : {value: 0};
      const waterCarbonEmission =
        hasCarbonAccess & hasWaterAccess
          ? await fetchWaterCarbonEmissionAndTrendLine(filter, startDate, endDate, district, buildingId)
          : {value: 0};
      const wasteCarbonEmission =
        hasCarbonAccess & hasWasteAccess
          ? await fetchWasteCarbonEmissionAndTrendLine(filter, startDate, endDate, district, buildingId)
          : {value: 0};

      const energy = [];

      if (hasEnergyAccess) {
        energy.push({
          id: 'energy-consumption',
          value: valueFormatter(Insight.ENERGY, energyConsumption?.energy, UnitFormat.String),
          unit: unitFormatter(Insight.ENERGY, energyConsumption?.energy)
        });
        energy.push({
          id: 'energy-intensity',
          value: valueFormatter(Intensity.ENERGY_INTENSITY, energyConsumption?.kwh, UnitFormat.String),
          unit: unitFormatter(Intensity.ENERGY_INTENSITY)
        });
        if (hasCarbonAccess)
          energy.push({
            id: 'energy-co2',
            value: valueFormatter(Insight.CARBON, energyCarbonEmission.value, UnitFormat.String),
            unit: 'CO2 ' + unitFormatter(Insight.CARBON, energyCarbonEmission?.value)
          });
      }

      const water = [];
      if (hasWaterAccess) {
        water.push({
          id: 'water-consumption',
          value: valueFormatter(Insight.WATER, waterConsumption?.water, UnitFormat.String),
          unit: unitFormatter(Insight.WATER)
        });
        water.push({
          id: 'water-intensity',
          value: valueFormatter(Intensity.WATER_INTENSITY, waterConsumption?.kwh, UnitFormat.String),
          unit: unitFormatter(Intensity.WATER_INTENSITY, waterConsumption?.kwh)
        });
        if (hasCarbonAccess)
          water.push({
            id: 'water-co2',
            value: valueFormatter(Insight.CARBON, waterCarbonEmission.value, UnitFormat.String),
            unit: 'CO2 ' + unitFormatter(Insight.CARBON, waterCarbonEmission?.value)
          });
      }

      const waste = [];
      if (hasWasteAccess) {
        waste.push({
          id: 'waste-production',
          value: valueFormatter(Insight.WASTE, wasteProduction?.waste, UnitFormat.String),
          unit: unitFormatter(Insight.WASTE, wasteProduction?.waste)
        });
        if (hasCarbonAccess) {
          waste.push({
            id: 'waste-co2',
            value: valueFormatter(Insight.CARBON, wasteCarbonEmission.value, UnitFormat.String),
            unit: 'CO2 ' + unitFormatter(Insight.CARBON, wasteCarbonEmission?.value)
          });
        }
        waste.push({
          id: 'waste-diverted',
          value: `${wasteProduction?.divertedPercentage} %`,
          unit: 'LANDFILL DIVERSION',
          valueWrapperCustomStyle: styles.wasteDivertedValueWrapper
        });
      }

      return {
        ...foundBuilding,
        imageUrl,
        energy,
        water,
        waste
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [buildings, district, endDate, filter, startDate, wasteLocations]
  );

  const fetchSecurityBuildingInsights = useCallback(
    async (buildingId: string): Promise<BuildingInsightsDetails> => {
      const foundBuilding = buildings.find((b: any) => b.id === buildingId);
      const imageUrl = `${process.env['REACT_APP_FILES_URL']}${foundBuilding.imageFile.filePath}`;
      const realtimeOperationsData = await fetchRealTimeOperations(startDate, endDate, district, buildingId, null, filter);
      const securityIncidentsCountBySeverityData = await fetchSecurityIncidentsCountBySeverity(
        startDate,
        endDate,
        district,
        buildingId,
        null,
        filter
      );
      const frequencyOfOccurenceData = await fetchFrequencyOfOccurence(startDate, endDate, district, buildingId, null, filter);
      const acknowledgmentTimeData = await fetchAcknowledgmentTime(startDate, endDate, district, buildingId, null, filter);
      const realTimeOperations = [];
      realTimeOperations.push({
        id: 'real-time-open-operations',
        value: realtimeOperationsData?.openIncidentsChart?.total ?? 0,
        unit: 'OPEN'
      });
      realTimeOperations.push({
        id: 'real-time-completed-operations',
        value: realtimeOperationsData?.completedIncidentsChart?.total ?? 0,
        unit: 'COMPLETED'
      });

      const securityIncidentsCountBySeverity = [];
      securityIncidentsCountBySeverity.push({
        id: 'low-security-incidents-count',
        value: securityIncidentsCountBySeverityData?.low ?? 0,
        unit: 'LOW'
      });
      securityIncidentsCountBySeverity.push({
        id: 'medium-security-incidents-count',
        value: securityIncidentsCountBySeverityData.medium ?? 0,
        unit: 'MEDIUM'
      });
      securityIncidentsCountBySeverity.push({
        id: 'high-security-incidents-count',
        value: securityIncidentsCountBySeverityData.high ?? 0,
        unit: 'HIGH'
      });

      const acknowledgmentTime = [];
      acknowledgmentTime.push({
        id: 'low-acknowledgment-time',
        value:
          acknowledgmentTimeData?.acknowledgementTime_chartData
            ?.find((item: any) => item.name.toLowerCase() === 'low')
            .data.reduce((val: number, cur: number) => (val += cur), 0) ?? 0,
        unit: 'LOW'
      });
      acknowledgmentTime.push({
        id: 'medium-acknowledgment-time',
        value:
          acknowledgmentTimeData?.acknowledgementTime_chartData
            ?.find((item: any) => item.name.toLowerCase() === 'medium')
            .data.reduce((val: number, cur: number) => (val += cur), 0) ?? 0,
        unit: 'MEDIUM'
      });
      acknowledgmentTime.push({
        id: 'high-acknowledgment-time',
        value:
          acknowledgmentTimeData?.acknowledgementTime_chartData
            ?.find((item: any) => item.name.toLowerCase() === 'high')
            .data.reduce((val: number, cur: number) => (val += cur), 0) ?? 0,
        unit: 'HIGH'
      });

      const frequencyOfOccurence = [];
      frequencyOfOccurence.push({
        id: 'accessControl-frequency-of-occurence',
        value:
          frequencyOfOccurenceData?.trendLine
            ?.filter((x: any) => x.name === 'Access Control')[0]
            ?.data?.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) ??
          0 ??
          0,
        unit: 'ACCESS CONTROL'
      });
      frequencyOfOccurence.push({
        id: 'criminalIncident-frequency-of-occurence',
        value:
          frequencyOfOccurenceData?.trendLine
            ?.filter((x: any) => x.name === 'Criminal Incident')[0]
            ?.data?.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) ??
          0 ??
          0,
        unit: 'CRIMINAL INCIDENT'
      });
      frequencyOfOccurence.push({
        id: 'faultAlarms-frequency-of-occurence',
        value:
          frequencyOfOccurenceData?.trendLine
            ?.filter((x: any) => x.name === 'Fault Alarms')[0]
            ?.data?.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) ??
          0 ??
          0,
        unit: 'FAULT ALARMS'
      });
      frequencyOfOccurence.push({
        id: 'others-frequency-of-occurence',
        value:
          frequencyOfOccurenceData?.trendLine
            ?.filter((x: any) => x.name === 'Others')[0]
            ?.data?.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) ??
          0 ??
          0,
        unit: 'OTHERS'
      });
      frequencyOfOccurence.push({
        id: 'safety-frequency-of-occurence',
        value:
          frequencyOfOccurenceData?.trendLine
            ?.filter((x: any) => x.name === 'Safety')[0]
            ?.data?.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) ??
          0 ??
          0,
        unit: 'SAFETY'
      });

      return {
        ...foundBuilding,
        imageUrl,
        realTimeOperations,
        securityIncidentsCountBySeverity,
        frequencyOfOccurence,
        acknowledgmentTime
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [buildings, district, endDate, filter, startDate, wasteLocations]
  );

  const onClickComparison = useCallback(
    async (buildingsIds: string[]) => {
      if (buildingsIds && buildingsIds.length) {
        setShowLoading(true);
        const temp: BuildingInsightsDetails[] = [];
        const promises = buildingsIds.map(async (buildingId) => {
          const buildingInsights =
            selectedModule === 'sustainability'
              ? await fetchSustainabilityBuildingInsights(buildingId)
              : await fetchSecurityBuildingInsights(buildingId);
          temp.push(buildingInsights);
        });
        await Promise.all(promises);
        setBuildingsInsights(temp);
        setShowLoading(false);
        setShowInsights(true);
      }
    },
    [selectedModule, fetchSustainabilityBuildingInsights, fetchSecurityBuildingInsights]
  );

  return (
    <SlideIn in animation={'slideUp'} style={{...styles.container, ...(accessModules?.length <= 1 ? styles.containerIncreaseHeight : {})}}>
      <BuildingComparison
        showLoading={showLoading}
        showInsights={showInsights}
        buildings={prepareBuildings()}
        buildingsInsights={buildingsInsights}
        onClickCancel={onDismiss}
        onClickClose={onDismiss}
        onClickComparison={onClickComparison}
      />
    </SlideIn>
  );
};
