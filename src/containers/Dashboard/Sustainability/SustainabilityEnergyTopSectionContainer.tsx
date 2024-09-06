import React, {useCallback, useEffect} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {shallowEqual, useSelector} from 'react-redux';
import {SustainabilityTrendLineAndBreakdownContainer} from './SustainabilityTrendLineAndBreakdownContainer';
import {
  ImpactCard,
  ImpactState,
  SustainabilityTotalConsumptionCard
} from '../../../components/Dashboard/SustainabilityTotalConsumptionCard';
import {Insight, Intensity, UnitFormat, unitFormatter, valueFormatter} from '../../../utils/dashboard';
import {
  fetchTotalEnergyConsumption,
  fetchEnergySavings,
  fetchEnergyConsumptionPercentage
  //@ts-ignore
} from '../../../services/energy';
//@ts-ignore
import useFetch from '../../../hooks';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';
import {EnergyConsumptionPercentage} from '../../../components/Dashboard/EnergyConsumptionPercentage';
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

export const SustainabilityEnergyTopSectionContainer = () => {
  const {insight} = useSelector((s: any) => s.dashboard);
  const {filter, startDate, endDate} = useSelector((s: any) => s.dashboard.dateFilter, shallowEqual);
  const {district} = useSelector((s: any) => s.map, shallowEqual);
  const energyConsumption = useFetch(fetchTotalEnergyConsumption, filter, startDate, endDate, district);
  const energySavings = useFetch(fetchEnergySavings, filter, startDate, endDate, district);
  const energyConsumptionPercentage = useFetch(fetchEnergyConsumptionPercentage, filter, startDate, endDate, district);

  const {tabletMode} = useSelector((s: any) => s.styling);
  const styles = tabletMode ? tabletStyles : webStyles;

  useEffect(() => {
    energyConsumption.fetch(true);
    energySavings.fetch(true);
    energyConsumptionPercentage.fetch(true);

    return () => {
      energyConsumption.isMountedRef.current = false;
      energySavings.isMountedRef.current = false;
      energyConsumptionPercentage.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insight, filter, district]);

  const minWidth = '80%';

  const getImpactCard = useCallback((): ImpactCard | undefined => {
    let carsSaved = 0;
    let yearImpactData = null;
    let insightType: Insight = Insight.ENERGY;

    yearImpactData = energySavings?.response?.savingsPercentage || 0;
    insightType = Insight.ENERGY;
    carsSaved = parseInt(energySavings?.response?.carsSaved?.toString() || '0');

    const impactCard: ImpactCard = {
      impactInsight: insightType,
      impactValue: Math.abs(yearImpactData),
      impactState: yearImpactData >= 0 ? ImpactState.drop : ImpactState.raise,
      carsSaved: carsSaved
    };

    return impactCard;
  }, [energySavings?.response?.savingsPercentage, energySavings?.response?.carsSaved]);

  return (
    <div style={styles.container} className="animate__animated animate__fadeIn">
      {energyConsumption?.isLoading || energySavings?.isLoading ? (
        <div style={styles.loadingWrapper}>
          <Loader height="220px" margin={0} />
        </div>
      ) : (
        <SustainabilityTotalConsumptionCard
          cardVariant="energy"
          {...TotalConsumptionCardPropsGenerator.init('energy', energyConsumption?.response).getProps()}
          style={styles.totalConsumptionCard}
          impactCard={getImpactCard()}
          onClickCard={() => {}}
        />
      )}
      {energyConsumptionPercentage?.isLoading ? (
        <div style={{...styles.loadingWrapper, ...{maxHeight: 220}}}>
          <Loader height="220px" margin={0} />
        </div>
      ) : (
        <EnergyConsumptionPercentage
          coolingPercentage={energyConsumptionPercentage.response?.coolingPercentage ?? 0}
          electricityPercentage={energyConsumptionPercentage.response?.electricityPercentage ?? 0}
        />
      )}
      <SustainabilityTrendLineAndBreakdownContainer
        style={{
          minWidth
        }}
      />
      {/* {building && <AnalysisButtonsContainer />} */}
    </div>
  );
};
