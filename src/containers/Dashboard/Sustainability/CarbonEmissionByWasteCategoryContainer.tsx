import React, {CSSProperties, useEffect, useMemo} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {
  CarbonEmissionByWasteCategory,
  CarbonEmissionByWasteCategoryItem
  //@ts-ignore
} from '../../../components/Dashboard/CarbonEmissionByWasteCategory';
import {useSelector} from 'react-redux';
//@ts-ignore
import {fetchWasteCarbonEmissionByCategory} from '../../../services/waste';
//@ts-ignore
import useFetch from '../../../hooks';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    minWidth: '40%',
    height: 280
  }
}));

export interface CarbonEmissionByWasteCategoryContainerProps {
  style?: CSSProperties;
}

export const CarbonEmissionByWasteCategoryContainer = ({style = {}}: CarbonEmissionByWasteCategoryContainerProps) => {
  const {floor, building, district} = useSelector((s: any) => s.map);
  const {filter, startDate, endDate} = useSelector((s: any) => s.dashboard.dateFilter);

  const carbonEmissionByWasteCategory = useFetch(fetchWasteCarbonEmissionByCategory, filter, startDate, endDate, district, building, floor);

  useEffect(() => {
    carbonEmissionByWasteCategory.fetch(true); //i need to load it always to refresh the cards
    return () => {
      carbonEmissionByWasteCategory.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, filter, district, building, floor]);

  const carbonEmissionByWasteCategoryData = useMemo(() => {
    const items: CarbonEmissionByWasteCategoryItem = {
      organicTotal: carbonEmissionByWasteCategory.response?.organicTotal ?? 0,
      recyclableTotal: carbonEmissionByWasteCategory.response?.recyclableTotal ?? 0,
      nonRecyclableTotal: carbonEmissionByWasteCategory.response?.nonRecyclableTotal ?? 0,
      hazardousTotal: carbonEmissionByWasteCategory.response?.hazardousTotal ?? 0
    };
    return items;
  }, [carbonEmissionByWasteCategory.response]);

  return carbonEmissionByWasteCategory.isLoading ? (
    <Loader height="100px" margin={0} />
  ) : (
    <CarbonEmissionByWasteCategory style={{...styles.container, ...style}} items={carbonEmissionByWasteCategoryData} />
  );
};
