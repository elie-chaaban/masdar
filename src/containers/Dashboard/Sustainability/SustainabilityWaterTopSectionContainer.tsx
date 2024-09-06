import React, {useCallback, useEffect} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {shallowEqual, useSelector} from 'react-redux';
import {SustainabilityTrendLineAndBreakdownContainer} from './SustainabilityTrendLineAndBreakdownContainer';
import {
  fetchWaterDashboard,
  fetchWaterSavings
  //@ts-ignore
} from '../../../services/water';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';
//@ts-ignore
import useFetch from '../../../hooks';
import {
  ImpactCard,
  ImpactState,
  SustainabilityTotalConsumptionCard
} from '../../../components/Dashboard/SustainabilityTotalConsumptionCard';
import {Insight, Intensity, UnitFormat, unitFormatter, valueFormatter} from '../../../utils/dashboard';
import {TotalConsumptionCardPropsGenerator} from '../../../utils/TotalConsumptionCardPropsGenerator';

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

export const SustainabilityWaterTopSectionContainer = () => {
  const {insight} = useSelector((s: any) => s.dashboard);
  const {filter, startDate, endDate} = useSelector((s: any) => s.dashboard.dateFilter, shallowEqual);
  const {district} = useSelector((s: any) => s.map, shallowEqual);
  const water = useFetch(fetchWaterDashboard, filter, startDate, endDate, district, null, null);
  const waterSavings = useFetch(fetchWaterSavings, filter, startDate, endDate, district);

  const {tabletMode} = useSelector((s: any) => s.styling);
  const styles = tabletMode ? tabletStyles : webStyles;

  useEffect(() => {
    water.fetch(true);
    waterSavings.fetch(true);

    return () => {
      water.isMountedRef.current = false;
      waterSavings.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insight, filter, district]);

  const getImpactCard = useCallback((): ImpactCard | undefined => {
    let carsSaved = 0;
    let yearImpactData = null;
    let insightType: Insight = Insight.ENERGY;

    yearImpactData = waterSavings?.response?.savingsPercentage || 0;
    insightType = Insight.WATER;
    carsSaved = parseInt(waterSavings?.response?.carsSaved?.toString() || '0');

    const impactCard: ImpactCard = {
      impactInsight: insightType,
      impactValue: Math.abs(yearImpactData),
      impactState: yearImpactData >= 0 ? ImpactState.drop : ImpactState.raise,
      carsSaved: carsSaved
    };

    return impactCard;
  }, [waterSavings?.response?.savingsPercentage, waterSavings?.response?.carsSaved]);

  const minWidth = '100%';

  return (
    <div style={styles.container} className="animate__animated animate__fadeIn">
      {water?.isLoading || waterSavings?.isLoading ? (
        <div style={styles.loadingWrapper}>
          <Loader height="220px" margin={0} />
        </div>
      ) : (
        <SustainabilityTotalConsumptionCard
          cardVariant="water"
          {...TotalConsumptionCardPropsGenerator.init('water', water?.response).getProps()}
          style={styles.totalConsumptionCard}
          impactCard={getImpactCard()}
          onClickCard={() => {}}
        />
      )}
      <SustainabilityTrendLineAndBreakdownContainer
        style={{
          minWidth
        }}
      />
    </div>
  );
};
