import React, {useCallback, useEffect, useMemo} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {shallowEqual, useSelector} from 'react-redux';
//@ts-ignore
import {fetchHighestConsumption} from '../../../services/energy';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';
//@ts-ignore
import useFetch from '../../../hooks';
import {percentageFormatter} from '../../../utils/dashboard';
import {HighestConsumptionBenchmark} from '../../../components/Dashboard/HighestConsumptionBenchmark';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    justifyContent: 'center',
    maxWidth: 455
  },
  highestConsumptionBenchmarkCard: {
    minHeight: 380,
    maxHeight: 555
  },
  loadingWrapper: {
    ...spacing.flexVertically,
    maxHeight: 340,
    width: 455,
    backgroundColor: colors.chartsCardBackground
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
  container: {
    ...spacing.flexVertically,
    justifyContent: 'center',
    width: '100%',
    marginTop: 10
  }
}));

export const SustainabilityEnergySideSectionContainer = () => {
  const {insight} = useSelector((s: any) => s.dashboard);
  const {filter, startDate, endDate} = useSelector((s: any) => s.dashboard.dateFilter, shallowEqual);
  const {buildings, district} = useSelector((s: any) => s.map, shallowEqual);
  const accessModules = useSelector((s: any) => s.user.access.modules);
  const highestConsumption = useFetch(fetchHighestConsumption, insight, filter, 'buildings', startDate, endDate, district, null);

  const {tabletMode, mobileMode} = useSelector((s: any) => s.styling);
  const styles = mobileMode ? mobileStyles : tabletMode ? tabletStyles : webStyles;

  useEffect(() => {
    highestConsumption.fetch(true);
    return () => {
      highestConsumption.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insight, filter, district]);

  const mapper = useCallback((item: any) => {
    const foundBuilding = buildings.find((b: any) => b.id === item.buildingId);
    const imageUrl = `${process.env['REACT_APP_FILES_URL']}${foundBuilding.imageFile.filePath}`;
    const savingsPercentage = percentageFormatter(item.savingsPercentage);

    return {
      title: item.title,
      savingsPercentage,
      id: item.buildingId,
      imageUrl
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const highestConsumptionList = useMemo(() => {
    return highestConsumption?.response?.data?.map(mapper) || [];
  }, [highestConsumption?.response?.data, mapper]);

  return (
    <div style={styles.container} className="animate__animated animate__fadeIn">
      {highestConsumption?.isLoading ? (
        <div style={styles.loadingWrapper}>
          <Loader height="340px" margin={0} />
        </div>
      ) : (
        <HighestConsumptionBenchmark
          list={highestConsumptionList}
          style={accessModules?.length <= 1 ? styles.highestConsumptionBenchmarkCard : {}}
        />
      )}
    </div>
  );
};
