import React, {useEffect} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {shallowEqual, useSelector} from 'react-redux';
//@ts-ignore
import {fetchCarbonEmissionAndTrendLine} from '../../../services/energy';
//@ts-ignore
import {fetchWaterCarbonEmissionAndTrendLine} from '../../../services/water';
//@ts-ignore
import {fetchWasteCarbonEmissionAndTrendLine} from '../../../services/waste';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';
//@ts-ignore
import useFetch from '../../../hooks';
import {SustainabilityTotalConsumptionCard} from '../../../components/Dashboard/SustainabilityTotalConsumptionCard';
import {CarbonEmissionByCategoryCard} from '../../../components/Dashboard/CarbonEmissionByCategoryCard';
import {CarbonEmissionSemiCircleByCategoryCard} from '../../../components/Dashboard/CarbonEmissionByCategoryCard/CarbonEmissionSemiCircleByCategoryCard';
import {CarbonEmissionParliamentByCategoryCard} from '../../../components/Dashboard/CarbonEmissionByCategoryCard/CarbonEmissionParliamentByCategoryCard';
import {getChartTypeIfExists, SustainabilityTrendLineAndBreakdownTypes} from '../../../utils/chartConfigurations';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    justifyContent: 'center',
    alignItems: 'space-between',
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

export const SustainabilityCarbonTopSectionContainer = () => {
  const {filter, startDate, endDate} = useSelector((s: any) => s.dashboard.dateFilter, shallowEqual);
  const {district} = useSelector((s: any) => s.map);
  const {chartConfigurations} = useSelector((s: any) => s.user);
  const access = useSelector((s: any) => s.user.access.kpi);
  const hasEnergyAccess = access['energy']?.some((b: any) => b.district_id === district);
  const hasWaterAccess = access['water']?.some((b: any) => b.district_id === district);
  const hasWasteAccess = access['waste']?.some((b: any) => b.district_id === district);

  const {tabletMode} = useSelector((s: any) => s.styling);
  const styles = tabletMode ? tabletStyles : webStyles;

  const energyCarbonEmission = useFetch(fetchCarbonEmissionAndTrendLine, filter, startDate, endDate, district, null);
  const waterCarbonEmission = useFetch(fetchWaterCarbonEmissionAndTrendLine, filter, startDate, endDate, district, null);
  const wasteCarbonEmission = useFetch(fetchWasteCarbonEmissionAndTrendLine, filter, startDate, endDate, district, null);
  const isCarbonLoading = energyCarbonEmission.isLoading || waterCarbonEmission.isLoading || wasteCarbonEmission.isLoading;
  const chartTypeConf = chartConfigurations?.find((x: any) => x.chart?.name?.toLowerCase() === `carbonemissionbycategory`);

  let chartType =
    getChartTypeIfExists('carbonEmissionByCategory', chartTypeConf?.chartType?.name) ||
    SustainabilityTrendLineAndBreakdownTypes.carbonEmissionByCategory.donut;

  useEffect(() => {
    if (hasEnergyAccess) energyCarbonEmission.fetch(true);
    if (hasWaterAccess) waterCarbonEmission.fetch(true);
    if (hasWasteAccess) wasteCarbonEmission.fetch(true);
    return () => {
      energyCarbonEmission.isMountedRef.current = false;
      waterCarbonEmission.isMountedRef.current = false;
      wasteCarbonEmission.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, district]);

  return (
    <div style={styles.container} className="animate__animated animate__fadeIn">
      {isCarbonLoading ? (
        <div style={styles.loadingWrapper}>
          <Loader height="220px" margin={0} />
        </div>
      ) : (
        <SustainabilityTotalConsumptionCard
          cardVariant="carbon"
          carbonCard={{
            energyValue: energyCarbonEmission?.response?.value ?? 0,
            waterValue: waterCarbonEmission?.response?.value ?? 0,
            wasteValue: wasteCarbonEmission?.response?.value ?? 0,
            showDrillDown: false
          }}
          onClickCard={() => {}}
        />
      )}
      {isCarbonLoading ? (
        <div style={{...styles.loadingWrapper, ...{maxHeight: 250}}}>
          <Loader height="220px" margin={0} />
        </div>
      ) : chartType === SustainabilityTrendLineAndBreakdownTypes.carbonEmissionByCategory.donut ? (
        <CarbonEmissionByCategoryCard
          energyCarbonTotalValue={energyCarbonEmission?.response?.value || 0}
          waterCarbonTotalValue={waterCarbonEmission?.response?.value || 0}
          wasteCarbonTotalValue={wasteCarbonEmission?.response?.value || 0}
        />
      ) : chartType === SustainabilityTrendLineAndBreakdownTypes.carbonEmissionByCategory.semiCircle ? (
        <CarbonEmissionSemiCircleByCategoryCard
          energyCarbonTotalValue={energyCarbonEmission?.response?.value || 0}
          waterCarbonTotalValue={waterCarbonEmission?.response?.value || 0}
          wasteCarbonTotalValue={wasteCarbonEmission?.response?.value || 0}
        />
      ) : chartType === SustainabilityTrendLineAndBreakdownTypes.carbonEmissionByCategory.parliamentBar ? (
        <CarbonEmissionParliamentByCategoryCard
          energyCarbonTotalValue={energyCarbonEmission?.response?.value || 0}
          waterCarbonTotalValue={waterCarbonEmission?.response?.value || 0}
          wasteCarbonTotalValue={wasteCarbonEmission?.response?.value || 0}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
};
