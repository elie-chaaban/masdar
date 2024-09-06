import React, {CSSProperties, useEffect, useCallback} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {ConsumptionCard, ConsumptionCardItem} from '../../../components/Dashboard/ConsumptionCard';
import {useSelector, shallowEqual} from 'react-redux';
//@ts-ignore
import {fetchSustainabilityConsumption} from '../../../services/energy';
//@ts-ignore
import useFetch from '../../../hooks';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';
import {valueFormatter, unitFormatter, Insight, TrendLineOrBreakdown, UnitFormat} from '../../../utils/dashboard';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    minWidth: '20%',
    height: 280,
    marginRight: 30
  }
}));

export interface ConsumptionCardContainerProps {
  style?: CSSProperties;
}

export const ConsumptionCardContainer = ({style = {}}: ConsumptionCardContainerProps) => {
  const selectedTrendLineOrBreakdown = useSelector((s: any) => s.dashboard.selectedTrendLineOrBreakdown);
  const {insight} = useSelector((s: any) => s.dashboard);
  const {floor, building, district, wasteLocation} = useSelector((s: any) => s.map);
  const {filter, startDate, endDate} = useSelector((s: any) => s.dashboard.dateFilter, shallowEqual);

  let selected = insight;
  if (selectedTrendLineOrBreakdown && selectedTrendLineOrBreakdown.length) {
    selected = selectedTrendLineOrBreakdown;
  }

  const sustainabilityConsumption = useFetch(
    fetchSustainabilityConsumption,
    insight,
    filter,
    selected,
    startDate,
    endDate,
    district,
    building,
    wasteLocation
  );

  useEffect(() => {
    sustainabilityConsumption.fetch(true); //i need to load it always to refresh the cards
    return () => {
      sustainabilityConsumption.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insight, filter, district, building, floor, wasteLocation, selectedTrendLineOrBreakdown]);

  const formatValue = useCallback(
    (value: number): string => {
      switch (selected) {
        case 'energy':
          return valueFormatter(Insight.ENERGY, value, UnitFormat.String) as string;
        case 'electricity':
          return valueFormatter(TrendLineOrBreakdown.ELECTRICITY, value, UnitFormat.String) as string;
        case 'cooling':
          return valueFormatter(TrendLineOrBreakdown.COOLING, value, UnitFormat.String) as string;
        case 'water':
          return valueFormatter(Insight.WATER, value, UnitFormat.String) as string;
        case 'waste':
          return valueFormatter(Insight.WASTE, value, UnitFormat.String) as string;
        default:
          return '0';
      }
    },
    [selected]
  );

  const formatUnit = useCallback(
    (value: number): string => {
      switch (selected) {
        case 'energy':
          return unitFormatter(Insight.ENERGY, value);
        case 'electricity':
          return unitFormatter(TrendLineOrBreakdown.ELECTRICITY, value);
        case 'cooling':
          return unitFormatter(TrendLineOrBreakdown.COOLING, value);
        case 'water':
          return unitFormatter(Insight.WATER, value);
        case 'waste':
          return unitFormatter(Insight.WASTE, value);
        default:
          return '';
      }
    },
    [selected]
  );

  const getTotalAndCommonItems = useCallback(
    (response: any): ConsumptionCardItem[] => {
      let items: ConsumptionCardItem[] = [];
      if (response) {
        items = [
          {
            value: formatValue(response?.totalConsumption),
            unit: formatUnit(response?.totalConsumption),
            progress: 0,
            label: 'TOTAL BUILDING'
          },
          {
            value: formatValue(response?.commonAreasConsumption),
            unit: formatUnit(response?.commonAreasConsumption),
            progress: 0,
            label: 'COMMON AREAS'
          }
        ];
      } else {
        items = [
          {value: '0', unit: formatUnit(0), progress: 0, label: 'TOTAL BUILDING'},
          {value: '0', unit: formatUnit(0), progress: 0, label: 'COMMON AREAS'}
        ];
      }
      return items;
    },
    [formatUnit, formatValue]
  );

  const getWasteProductionItems = useCallback(
    (response: any): ConsumptionCardItem[] => {
      let items: ConsumptionCardItem[] = [];
      if (response) {
        items = [
          {
            value: formatValue(response?.recyclable),
            unit: formatUnit(response?.recyclable),
            progress: 0,
            label: 'RECYCLABLE'
          },
          {
            value: formatValue(response?.nonRecyclable),
            unit: formatUnit(response?.nonRecyclable),
            progress: 0,
            label: 'NON-RECYCLABLE'
          },
          {
            value: formatValue(response?.hazardous),
            unit: formatUnit(response?.hazardous),
            progress: 0,
            label: 'HAZARDOUS'
          }
        ];
      } else {
        items = [
          {value: '0', unit: formatUnit(0), progress: 0, label: 'RECYCLABLE'},
          {value: '0', unit: formatUnit(0), progress: 0, label: 'NON-RECYCLABLE'},
          {value: '0', unit: formatUnit(0), progress: 0, label: 'HAZARDOUS'}
        ];
      }
      return items;
    },
    [formatUnit, formatValue]
  );

  let title = '';
  let items: ConsumptionCardItem[] = [];

  switch (selected) {
    case 'energy':
      title = 'ENERGY CONSUMPTION';
      items = getTotalAndCommonItems(sustainabilityConsumption?.response);
      break;
    case 'electricity':
      title = 'ELECTRICITY CONSUMPTION';
      items = getTotalAndCommonItems(sustainabilityConsumption?.response);
      break;
    case 'cooling':
      title = 'COOLING CONSUMPTION';
      items = getTotalAndCommonItems(sustainabilityConsumption?.response);
      break;
    case 'water':
      title = 'WATER CONSUMPTION';
      items = getTotalAndCommonItems(sustainabilityConsumption?.response);
      break;
    case 'waste':
      items = getWasteProductionItems(sustainabilityConsumption?.response);
      title = 'WASTE PRODUCTION';
      break;
    default:
      break;
  }

  return sustainabilityConsumption.isLoading ? (
    <Loader height="100px" margin={0} />
  ) : (
    <ConsumptionCard style={{...styles.container, ...style}} title={title} items={items} />
  );
};
