import React, {CSSProperties, useRef, useEffect, MutableRefObject, useMemo} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {TrendLineOrBreakdown, UnitFormat, unitFormatter, valueFormatter} from '../../../utils/dashboard';
import {Text} from '../../Common/Text';
import Highcharts, {Chart} from 'highcharts';
import itemSeries from 'highcharts/modules/item-series';
import HighchartsReact from 'highcharts-react-official';
import {useSelector} from 'react-redux';

itemSeries(Highcharts);

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    maxHeight: 250,
    backgroundColor: colors.chartsCardBackground
  },
  condensedContainer: {
    minWidth: 557,
    maxWidth: 557,
    minHeight: 243,
    maxHeight: 243,
    justifyContent: 'center',
    marginLeft: 1,
    backgroundColor: colors.buildingDetailsLightSideBackground
  },
  titleWrapper: {
    ...spacing.center,
    textAlign: 'center',
    width: '100%',
    maxHeight: 40,
    color: colors.white,
    backgroundColor: colors.chartsCardHeaderBackground,
    marginBottom: 10,
    paddingTop: 20,
    paddingBottom: 20
  },
  condensedTitleWrapper: {
    minHeight: 48,
    maxHeight: 48,
    backgroundColor: colors.buildingDetailsSideBackground
  },
  sectionsWrapper: {
    ...spacing.flexHorizontally,
    justifyContent: 'center',
    alignItems: 'center'
  },
  values: {
    ...spacing.center,
    width: '60%'
  },
  condensedValues: {
    minWidth: 150,
    maxWidth: 150,
    columnGap: 10
  },
  valueWithTitleWrapper: {
    ...spacing.centerVertically,
    maxHeight: 75,
    color: colors.white
  },
  valueUnitWrapper: {
    ...spacing.flexVertically,
    alignItems: 'center'
  },
  unit: {
    ...spacing.flex,
    textAlign: 'center'
  },
  value: {
    ...spacing.flex,
    maxHeight: 25,
    textAlign: 'center'
  },
  valueTitle: {
    ...spacing.flex,
    textAlign: 'center'
  },
  energyBorder: {
    height: 7,
    width: 50,
    borderRadius: 9,
    background: '#246490'
  },
  waterBorder: {
    height: 7,
    width: 50,
    borderRadius: 9,
    background: '#392D57'
  },
  wasteBorder: {
    height: 7,
    width: 50,
    borderRadius: 9,
    background: '#4EABA9'
  }
}));

const tabletStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  condensedContainer: {
    ...webStyles.condensedContainer,
    minWidth: 400,
    maxWidth: 400
  },
  values: {
    ...webStyles.values,
    ...spacing.flexVertically
  },
  valueWithTitleWrapper: {
    ...webStyles.valueWithTitleWrapper,
    marginBottom: 4
  },
  valueUnitWrapper: {
    ...webStyles.valueUnitWrapper,
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  unit: {
    ...webStyles.unit,
    marginLeft: 2
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  values: {
    ...webStyles.values,
    flexDirection: 'column',
    gap: 10
  },
  condensedContainer: {
    width: '100%',
    minHeight: 243,
    maxHeight: 243,
    justifyContent: 'center',
    backgroundColor: colors.buildingDetailsLightSideBackground
  }
}));

export interface ListItem {
  value: number | string;
}

export interface CarbonEmissionByCategoryCardProps {
  style?: CSSProperties;
  energyCarbonTotalValue: number;
  waterCarbonTotalValue: number;
  wasteCarbonTotalValue: number;
  condensed?: boolean;
}

const data = {
  chart: {
    height: '200',
    width: '300',
    type: 'item',
    backgroundColor: null
  },
  title: {
    text: null
  },
  legend: {
    enabled: false
  },
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 600
        },
        chartOptions: {
          series: [
            {
              dataLabels: {
                distance: -30
              }
            }
          ]
        }
      }
    ]
  },
  series: []
};

interface ChartRef {
  chart: Chart;
  container: any;
}

export const CarbonEmissionParliamentByCategoryCard = ({
  style,
  energyCarbonTotalValue,
  waterCarbonTotalValue,
  wasteCarbonTotalValue,
  condensed = false
}: CarbonEmissionByCategoryCardProps) => {
  const chartComponent = useRef<ChartRef>() as MutableRefObject<ChartRef>;
  const {district} = useSelector((s: any) => s.map);
  const access = useSelector((s: any) => s.user.access.kpi);
  const hasEnergyAccess = access['energy']?.some((b: any) => b.district_id === district);
  const hasWaterAccess = access['water']?.some((b: any) => b.district_id === district);
  const hasWasteAccess = access['waste']?.some((b: any) => b.district_id === district);
  const hasCarbonAccess = access['carbon']?.some((b: any) => b.district_id === district);
  const total = energyCarbonTotalValue + waterCarbonTotalValue + wasteCarbonTotalValue;

  let energyCarbonTotalValues = parseInt(((energyCarbonTotalValue / total) * 100).toString().split('.')[0]);
  let waterCarbonTotalValues = parseInt(((waterCarbonTotalValue / total) * 100).toString().split('.')[0]);
  let wasteCarbonTotalValues = parseInt(((wasteCarbonTotalValue / total) * 100).toString().split('.')[0]);

  const {tabletMode, mobileMode} = useSelector((s: any) => s.styling);
  const styles = mobileMode ? mobileStyles : tabletMode ? tabletStyles : webStyles;

  const series = useMemo(() => {
    return {
      name: 'Values',
      keys: ['name', 'y', 'color', 'label'],
      // data: [
      //   hasCarbonAccess && hasEnergyAccess && {color: '#246490', id: 'energy', name: 'Energy', y: (energyCarbonTotalValue / total) * 100},
      //   hasCarbonAccess && hasWaterAccess && {color: '#392D57', id: 'water', name: 'Water', y: (waterCarbonTotalValue / total) * 100},
      //   hasCarbonAccess && hasWasteAccess && {color: '#4EABA9', id: 'waste', name: 'Waste', y: (wasteCarbonTotalValue / total) * 100}
      // ],
      data: [
        ['Energy', energyCarbonTotalValues, '#246490', null],
        ['Water', waterCarbonTotalValues, '#392D57', null],
        ['Waste', wasteCarbonTotalValues, '#4EABA9', null]
      ],
      dataLabels: {
        enabled: true,
        format: '{point.label}',
        style: {
          textOutline: '3px contrast'
        }
      },

      // Circular options
      center: ['50%', '88%'],
      size: '170%',
      startAngle: -100,
      endAngle: 100
    };
  }, [
    energyCarbonTotalValues,
    waterCarbonTotalValues,
    wasteCarbonTotalValues
    // total
    // hasCarbonAccess,
    // hasWasteAccess,
    // hasEnergyAccess,
    // hasWaterAccess
  ]);

  data.series = [series] as any;
  if (condensed) {
    data.chart.width = `356`;
    data.chart.height = `150`;
  } else {
    data.chart.width = `300`;
    data.chart.height = `200`;
  }

  let d = {...data};

  useEffect(() => {
    const chart = chartComponent.current?.chart;

    if (chart) chart.redraw();
  }, [style, series, condensed, tabletMode]);

  return (
    <div style={{...styles.container, ...(condensed ? styles.condensedContainer : {}), ...style}}>
      <div style={{...styles.titleWrapper, ...(condensed ? styles.condensedTitleWrapper : {})}}>
        <Text variant="cardHeader">CARBON FOOTPRINT BREAKDOWN</Text>
      </div>
      <div style={styles.sectionsWrapper}>
        <HighchartsReact ref={chartComponent} data-testid="highChart" highcharts={Highcharts} options={d} />
        <div style={{...styles.values, ...(condensed ? styles.condensedValues : {})}}>
          {hasCarbonAccess && hasEnergyAccess && (
            <div style={{...styles.valueWithTitleWrapper}}>
              <div style={styles.energyBorder} />
              <div style={styles.valueTitle}>
                <Text variant={mobileMode ? 'actionLabelBoldMobileUI' : 'actionLabelBold'}>{'ENERGY'}</Text>
              </div>
              <div style={styles.valueUnitWrapper}>
                <div style={styles.value}>
                  <Text variant={mobileMode ? 'actionLabelBoldMobileUI' : 'iconLabel'}>
                    {valueFormatter(TrendLineOrBreakdown.CARBON, energyCarbonTotalValue, UnitFormat.String)}
                  </Text>
                </div>
                <div style={styles.unit}>
                  <Text variant={mobileMode ? 'actionLabelBoldMobileUI' : 'actionLabelBold'}>
                    {unitFormatter(TrendLineOrBreakdown.CARBON, energyCarbonTotalValue)}{' '}
                  </Text>
                </div>
              </div>
            </div>
          )}
          {hasCarbonAccess && hasWaterAccess && (
            <div style={styles.valueWithTitleWrapper}>
              <div style={styles.waterBorder} />
              <div style={styles.valueTitle}>
                <Text variant={mobileMode ? 'actionLabelBoldMobileUI' : 'actionLabelBold'}>{'WATER'}</Text>
              </div>
              <div style={styles.valueUnitWrapper}>
                <div style={styles.value}>
                  <Text variant={mobileMode ? 'actionLabelBoldMobileUI' : 'iconLabel'}>
                    {valueFormatter(TrendLineOrBreakdown.CARBON, waterCarbonTotalValue, UnitFormat.String)}
                  </Text>
                </div>
                <div style={styles.unit}>
                  <Text variant={mobileMode ? 'actionLabelBoldMobileUI' : 'actionLabelBold'}>
                    {unitFormatter(TrendLineOrBreakdown.CARBON, waterCarbonTotalValue)}{' '}
                  </Text>
                </div>
              </div>
            </div>
          )}
          {hasCarbonAccess && hasWasteAccess && (
            <div style={styles.valueWithTitleWrapper}>
              <div style={styles.wasteBorder} />
              <div style={styles.valueTitle}>
                <Text variant={mobileMode ? 'actionLabelBoldMobileUI' : 'actionLabelBold'}>{'WASTE'}</Text>
              </div>
              <div style={styles.valueUnitWrapper}>
                <div style={styles.value}>
                  <Text variant={mobileMode ? 'actionLabelBoldMobileUI' : 'iconLabel'}>
                    {valueFormatter(TrendLineOrBreakdown.CARBON, wasteCarbonTotalValue, UnitFormat.String)}
                  </Text>
                </div>
                <div style={styles.unit}>
                  <Text variant={mobileMode ? 'actionLabelBoldMobileUI' : 'actionLabelBold'}>
                    {unitFormatter(TrendLineOrBreakdown.CARBON, wasteCarbonTotalValue)}{' '}
                  </Text>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
