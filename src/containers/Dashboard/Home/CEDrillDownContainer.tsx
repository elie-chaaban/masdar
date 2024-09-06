import React, {useCallback, useEffect} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';
import {
  FILTER_PV_CHART_INDEX,
  SustainabilityTrendLineAndBreakdown
} from '../../../components/Dashboard/SustainabilityTrendLineAndBreakdown';
// @ts-ignore
import {setDistrictPvProductionChart} from '../../../reduxStore/actions';
//@ts-ignore
import {fetchDistrictPVProductions} from '../../../services/energy';
//@ts-ignore
import useFetch from '../../../hooks';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 48,
    minWidth: '100%',
    maxWidth: '100%',
    zIndex: 9999,
    color: colors.white
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999
  },
  bottomSection: {
    ...spacing.flexHorizontally,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.chartsCardBackground,
    gap: 20
  },
  pvProductionTrendLine: {
    maxWidth: 500
  }
}));

const tabletStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...webStyles.container,
    minWidth: 1318,
    maxWidth: 1318
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...webStyles.container,
    left: 0,
    maxWidth: '98%',
    minWidth: '98%'
  },
  bottomSection: {
    ...webStyles.bottomSection,
    flexDirection: 'column',
    gap: 0
  }
}));

export const CEDrillDownContainer = () => {
  const dispatch = useDispatch();
  const {tabletMode, mobileMode} = useSelector((s: any) => s.styling);
  const styles = mobileMode ? mobileStyles : tabletMode ? tabletStyles : webStyles;
  const {district, buildings} = useSelector((s: any) => s.map, shallowEqual);
  const {districtPvProductionChart, dateFilter} = useSelector((s: any) => s.dashboard);
  const {filter} = dateFilter;

  const buildingPVProductions = useFetch(fetchDistrictPVProductions, district, '74894f39-bb41-73b0-09f2-3a0b82a7280c');

  useEffect(() => {
    if (district) {
      buildingPVProductions.fetch(true);
    }
    return () => {
      buildingPVProductions.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district]);

  const closeContainer = useCallback(() => {
    dispatch(setDistrictPvProductionChart(null));
  }, [dispatch]);

  return (
    <div style={styles.overlay} onClick={closeContainer}>
      <div className="animate__animated animate__fadeInUp" style={styles.container}>
        <div style={styles.bottomSection}>
          {!districtPvProductionChart ? (
            <Loader height="100px" margin={0} color={'#fff'} />
          ) : (
            <SustainabilityTrendLineAndBreakdown
              variant="pvProductionTrendLine"
              style={styles.pvProductionTrendLine}
              series={districtPvProductionChart[FILTER_PV_CHART_INDEX[filter]]}
              categories={districtPvProductionChart[FILTER_PV_CHART_INDEX[filter]].categories}
              chartTitle="MASDAR 10 MW CLEAN ELECTRICITY"
            />
          )}
          {buildingPVProductions?.isLoading ? (
            <Loader height="100px" margin={0} color={'#fff'} />
          ) : (
            <SustainabilityTrendLineAndBreakdown
              variant="pvProductionTrendLine"
              style={styles.pvProductionTrendLine}
              series={buildingPVProductions?.response?.chart[FILTER_PV_CHART_INDEX[filter]]}
              categories={buildingPVProductions?.response?.chart[FILTER_PV_CHART_INDEX[filter]].categories}
              chartTitle="IRENA GENERATED CLEAN ELECTRICITY"
            />
          )}
        </div>
      </div>
    </div>
  );
};
