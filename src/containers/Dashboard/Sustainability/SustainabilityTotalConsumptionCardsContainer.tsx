import React, {useCallback, useEffect} from 'react';
import {
  SustainabilityTotalConsumptionCard,
  CardVariantId,
  ImpactState,
  ImpactCard
} from '../../../components/Dashboard/SustainabilityTotalConsumptionCard';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {
  setSelectedDashboard,
  setSelectedTrendLineOrBreakdown,
  setIsBuildingComparisonOpened,
  wasteLocationSelection,
  buildingSelection,
  setShowAirQuality,
  setDistrictPvProductionChart,
  setIsAirQualityDrillDownOpened
  // @ts-ignore
} from '../../../reduxStore/actions';

import {sideBarListIds} from '../../../components/Dashboard/SideBar';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';

//@ts-ignore
import useFetch from '../../../hooks';
import {
  fetchTotalEnergyConsumption,
  fetchEnergySavings,
  fetchDistrictPVProductions
  //@ts-ignore
} from '../../../services/energy';
import {
  fetchWaterDashboard,
  fetchWaterSavings
  //@ts-ignore
} from '../../../services/water';
import {
  fetchTotalWasteProduction
  //@ts-ignore
} from '../../../services/waste';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';
import {Insight} from '../../../utils/dashboard';
import {TotalConsumptionCardPropsGenerator} from '../../../utils/TotalConsumptionCardPropsGenerator';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    justifyContent: 'center',
    alignItems: 'flex-end',
    maxHeight: '100%',
    width: '100%',
    rowGap: 8
  },
  loadingWrapper: {
    ...spacing.centerVertically,
    minHeight: 164,
    maxHeight: 221,
    maxWidth: 512,
    minWidth: 512,
    borderRadius: 2,
    backgroundColor: colors.consumptionCardBackground
  }
}));

const tabletStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  loadingWrapper: {
    ...webStyles.loadingWrapper,
    maxWidth: 418,
    minWidth: 418
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  loadingWrapper: {
    ...webStyles.loadingWrapper,
    paddingLeft: 100
  }
}));

export const SustainabilityTotalConsumptionCardsContainer = () => {
  const dispatch = useDispatch();

  const {insight} = useSelector((s: any) => s.dashboard);
  const {floor, building, district, showBuildingDetails} = useSelector((s: any) => s.map);
  const {filter, startDate, endDate} = useSelector((s: any) => s.dashboard.dateFilter, shallowEqual);

  const access = useSelector((s: any) => s.user.access.kpi);
  const hasEnergyAccess = access['energy']?.some((b: any) => b.district_id === district);
  const hasWaterAccess = access['water']?.some((b: any) => b.district_id === district);
  const hasWasteAccess = access['waste']?.some((b: any) => b.district_id === district);

  const {tabletMode, mobileMode} = useSelector((s: any) => s.styling);

  const styles = mobileMode ? mobileStyles : tabletMode ? tabletStyles : webStyles;

  const energyConsumption = useFetch(
    fetchTotalEnergyConsumption,
    filter,
    startDate,
    endDate,
    district,
    showBuildingDetails ? null : building,
    floor
  );
  const water = useFetch(fetchWaterDashboard, filter, startDate, endDate, district, showBuildingDetails ? null : building, floor);
  const wasteProduction = useFetch(fetchTotalWasteProduction, filter, startDate, endDate, district, showBuildingDetails ? null : building);

  const energySavings = useFetch(fetchEnergySavings, filter, startDate, endDate, district, showBuildingDetails ? null : building);
  const waterSavings = useFetch(fetchWaterSavings, filter, startDate, endDate, district, showBuildingDetails ? null : building);

  const districtPVProductions = useFetch(fetchDistrictPVProductions, district);

  useEffect(() => {
    if (hasEnergyAccess) energyConsumption.fetch(true); //i need to load it always to refresh the cards
    if (hasWaterAccess) water.fetch(true);
    if (hasEnergyAccess) energySavings.fetch(true);
    if (hasWaterAccess) waterSavings.fetch(true);
    return () => {
      energyConsumption.isMountedRef.current = false;
      water.isMountedRef.current = false;
      energySavings.isMountedRef.current = false;
      waterSavings.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insight, filter, district, floor]);

  useEffect(() => {
    if (hasWasteAccess) wasteProduction.fetch(true);
    return () => {
      wasteProduction.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insight, filter, district]);

  useEffect(() => {
    if (!showBuildingDetails) {
      if (hasEnergyAccess) energyConsumption.fetch(true); //i need to load it always to refresh the cards
      if (hasWaterAccess) water.fetch(true);
      if (hasEnergyAccess) energySavings.fetch(true);
      if (hasWaterAccess) waterSavings.fetch(true);
    }
    return () => {
      energyConsumption.isMountedRef.current = false;
      water.isMountedRef.current = false;
      energySavings.isMountedRef.current = false;
      waterSavings.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insight, filter, showBuildingDetails, building]);

  useEffect(() => {
    if (hasWasteAccess && !showBuildingDetails) wasteProduction.fetch(true);
    return () => {
      wasteProduction.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insight, filter, showBuildingDetails, building]);

  useEffect(() => {
    if (district) {
      districtPVProductions.fetch(true);
    }
    return () => {
      districtPVProductions.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district]);

  const onClickCard = useCallback(
    (id: CardVariantId) => {
      switch (id) {
        case 'energy': {
          dispatch(buildingSelection());
          dispatch(setIsAirQualityDrillDownOpened(false));
          dispatch(wasteLocationSelection());
          dispatch(setSelectedDashboard(sideBarListIds.energy));
          dispatch(setSelectedTrendLineOrBreakdown(null));
          dispatch(setIsBuildingComparisonOpened(false));
          dispatch(setShowAirQuality(false));
          dispatch(setDistrictPvProductionChart(null));
          break;
        }
        case 'water': {
          dispatch(buildingSelection());
          dispatch(setIsAirQualityDrillDownOpened(false));
          dispatch(wasteLocationSelection());
          dispatch(setSelectedDashboard(sideBarListIds.water));
          dispatch(setSelectedTrendLineOrBreakdown(null));
          dispatch(setIsBuildingComparisonOpened(false));
          dispatch(setShowAirQuality(false));
          dispatch(setDistrictPvProductionChart(null));
          break;
        }
        case 'waste': {
          dispatch(buildingSelection());
          dispatch(setIsAirQualityDrillDownOpened(false));
          dispatch(setSelectedDashboard(sideBarListIds.waste));
          dispatch(setSelectedTrendLineOrBreakdown(null));
          dispatch(setIsBuildingComparisonOpened(false));
          dispatch(setShowAirQuality(false));
          dispatch(setDistrictPvProductionChart(null));
          break;
        }
        case 'carbon': {
          dispatch(buildingSelection());
          dispatch(setIsAirQualityDrillDownOpened(false));
          dispatch(wasteLocationSelection());
          dispatch(setSelectedDashboard(sideBarListIds.carbon));
          dispatch(setSelectedTrendLineOrBreakdown(null));
          dispatch(setIsBuildingComparisonOpened(false));
          dispatch(setShowAirQuality(false));
          dispatch(setDistrictPvProductionChart(null));
          break;
        }
      }
    },
    [dispatch]
  );

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

  return (
    <div style={styles.container}>
      {hasEnergyAccess ? (
        energyConsumption.isLoading ? (
          <div style={styles.loadingWrapper}>
            <Loader height="220px" margin={0} />
          </div>
        ) : (
          <SustainabilityTotalConsumptionCard
            cardVariant="energy"
            {...TotalConsumptionCardPropsGenerator.init('energy', energyConsumption?.response).getProps()}
            impactCard={getImpactCard(Insight.ENERGY)}
            onClickCard={onClickCard}
          />
        )
      ) : (
        <></>
      )}
      {hasWaterAccess ? (
        water.isLoading ? (
          <div style={styles.loadingWrapper}>
            <Loader height="220px" margin={0} />
          </div>
        ) : (
          <SustainabilityTotalConsumptionCard
            cardVariant="water"
            {...TotalConsumptionCardPropsGenerator.init('water', water?.response).getProps()}
            impactCard={getImpactCard(Insight.WATER)}
            onClickCard={onClickCard}
          />
        )
      ) : (
        <></>
      )}
      {hasWasteAccess ? (
        wasteProduction.isLoading ? (
          <div style={styles.loadingWrapper}>
            <Loader height="220px" margin={0} />
          </div>
        ) : (
          <SustainabilityTotalConsumptionCard
            cardVariant="waste"
            {...TotalConsumptionCardPropsGenerator.init('waste', wasteProduction?.response).getProps()}
            rightColumnValue={`${wasteProduction?.response?.divertedPercentage ?? 0}`}
            rightColumnUnit={'DIVERTED FROM LANDFILL'}
            onClickCard={onClickCard}
          />
        )
      ) : (
        <></>
      )}
    </div>
  );
};
