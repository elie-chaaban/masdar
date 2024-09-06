import React, {useCallback, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {
  setCurrentDashboardProps,
  setSelectedDashboard,
  setDateFilter,
  buildingSelection,
  floorSelection,
  setIsBuildingComparisonOpened,
  setShowAirQuality,
  setIsAirQualityDrillDownOpened,
  wasteLocationSelection,
  setSelectedTrendLineOrBreakdown,
  setDistrictPvProductionChart
  // @ts-ignore
} from '../../reduxStore/actions';
import {PeriodSelection, PeriodItemId} from '../../components/Dashboard/PeriodSelection';
import {sideBarListIds} from '../../components/Dashboard/SideBar';
import moment from 'moment-mini';
import {debounceFunction} from '../../utils/dashboard/units';

export const PeriodSelectionContainer = () => {
  const dispatch = useDispatch();
  const {dateFilter} = useSelector((s: any) => s.dashboard);
  const isBuildingComparisonOpened = useSelector((s: any) => s.map.isBuildingComparisonOpened);
  const currentDashboardProps = useSelector((s: any) => s.dashboard.currentDashboardProps);
  const periodSelectionDetails = currentDashboardProps.periodSelection;
  const [isLoading, setIsLoading] = useState(false);

  const triggerSetDateFilter = useCallback(
    (filter: PeriodItemId) => {
      if (dateFilter.filter !== filter) {
        const data = {
          filter: filter,
          startDate: '',
          endDate: ''
        };
        const dateFormat = 'YYYY-MM-DD';
        // eslint-disable-next-line default-case
        switch (filter) {
          case 'day':
            data.startDate = moment().subtract(1, 'days').subtract(13, 'days').format(dateFormat);
            data.endDate = moment().subtract(1, 'days').format(dateFormat);
            break;
          case 'week':
            // data.startDate = moment().subtract(1, 'days').subtract(13, 'weeks').startOf('isoWeek').format(dateFormat);
            data.startDate = moment().subtract(1, 'days').subtract(13, 'weeks').startOf('week').format(dateFormat);
            data.endDate = moment().subtract(1, 'days').format(dateFormat);
            break;
          case 'month':
          case 'year':
            var startDate = moment().subtract(1, 'days').subtract(11, 'months').format('YYYY-MM');
            data.startDate = `${startDate}-01`;
            data.endDate = moment().subtract(1, 'days').format(dateFormat);
            break;
        }
        dispatch(setDateFilter(data));
      }
    },
    [dateFilter.filter, dispatch]
  );

  const cancelLoadingAfterSomeTime = useCallback(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const onSelectPeriod = useCallback(
    (id: PeriodItemId) => {
      debounceFunction(() => {
        setIsLoading(true);
        const props = JSON.parse(JSON.stringify(currentDashboardProps));
        props.periodSelection.selectedOptionId = id;
        dispatch(setCurrentDashboardProps(props));
        triggerSetDateFilter(id);
        cancelLoadingAfterSomeTime();
      }, 200);
    },
    [cancelLoadingAfterSomeTime, currentDashboardProps, dispatch, triggerSetDateFilter]
  );

  const onClickAddComparison = useCallback(() => {
    dispatch(setIsBuildingComparisonOpened(!isBuildingComparisonOpened));
  }, [dispatch, isBuildingComparisonOpened]);

  const onClickBack = useCallback(() => {
    dispatch(setSelectedDashboard(sideBarListIds.home));
    dispatch(buildingSelection());
    dispatch(floorSelection());
    dispatch(setIsAirQualityDrillDownOpened(false));
    dispatch(wasteLocationSelection());
    dispatch(setSelectedTrendLineOrBreakdown(''));
    dispatch(setIsBuildingComparisonOpened(false));
    dispatch(setShowAirQuality(true));
    dispatch(setDistrictPvProductionChart(null));
  }, [dispatch]);

  return (
    <PeriodSelection
      selectedPeriodId={periodSelectionDetails.selectedOptionId}
      loading={isLoading}
      onSelectPeriod={onSelectPeriod}
      onClickAddComparison={onClickAddComparison}
      onClickBack={periodSelectionDetails.showBackButton ? onClickBack : undefined}
    />
  );
};
