import React, {useEffect} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {shallowEqual, useSelector} from 'react-redux';
import {SustainabilityTotalConsumptionCard} from '../../../components/Dashboard/SustainabilityTotalConsumptionCard';
//@ts-ignore
import {
  fetchTotalWasteProduction,
  fetchOperationsWasteProductionByCategory,
  fetchConstructionWasteProductionByCategory
  //@ts-ignore
} from '../../../services/waste';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';
//@ts-ignore
import useFetch from '../../../hooks';
import {Insight, UnitFormat, unitFormatter, valueFormatter} from '../../../utils/dashboard';
import {OperationsWasteProductionByCategoryCard} from '../../../components/Dashboard/OperationsWasteProductionByCategoryCard';
import {ConstructionWasteProductionByCategoryCard} from '../../../components/Dashboard/ConstructionWasteProductionByCategoryCard';
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

export const SustainabilityWasteTopSectionContainer = () => {
  const {insight} = useSelector((s: any) => s.dashboard);
  const {filter, startDate, endDate} = useSelector((s: any) => s.dashboard.dateFilter, shallowEqual);
  const {district} = useSelector((s: any) => s.map);
  const wasteProduction = useFetch(fetchTotalWasteProduction, filter, startDate, endDate, district, null, null);
  const wasteProductionByCategory = useFetch(fetchOperationsWasteProductionByCategory, filter, startDate, endDate, district, null, null);
  const constructionWasteProductionByCategory = useFetch(
    fetchConstructionWasteProductionByCategory,
    filter,
    startDate,
    endDate,
    district,
    null,
    null
  );

  const {tabletMode} = useSelector((s: any) => s.styling);
  const styles = tabletMode ? tabletStyles : webStyles;

  useEffect(() => {
    wasteProduction.fetch(true);
    wasteProductionByCategory.fetch(true);
    constructionWasteProductionByCategory.fetch(true);
    return () => {
      wasteProduction.isMountedRef.current = false;
      wasteProductionByCategory.isMountedRef.current = false;
      constructionWasteProductionByCategory.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insight, filter, district]);

  return (
    <div style={styles.container} className="animate__animated animate__fadeIn">
      {wasteProduction?.isLoading ? (
        <div style={styles.loadingWrapper}>
          <Loader height="220px" margin={0} />
        </div>
      ) : (
        <SustainabilityTotalConsumptionCard
          style={styles.totalConsumptionCard}
          cardVariant="waste"
          {...TotalConsumptionCardPropsGenerator.init('waste', wasteProduction?.response).getProps()}
          rightColumnValue={`${wasteProduction?.response?.divertedPercentage ?? 0}`}
          rightColumnUnit={'DIVERTED FROM LANDFILL'}
          onClickCard={() => {}}
        />
      )}
      {wasteProductionByCategory.isLoading ? (
        <div style={{...styles.loadingWrapper, ...{maxHeight: 250}}}>
          <Loader height="220px" margin={0} />
        </div>
      ) : (
        <OperationsWasteProductionByCategoryCard list={wasteProductionByCategory?.response || []} />
      )}
      {wasteProductionByCategory.isLoading ? (
        <div style={{...styles.loadingWrapper, ...{maxHeight: 250}}}>
          <Loader height="220px" margin={0} />
        </div>
      ) : (
        <ConstructionWasteProductionByCategoryCard list={constructionWasteProductionByCategory?.response || []} />
      )}
    </div>
  );
};
