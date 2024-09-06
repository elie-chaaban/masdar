import React, {CSSProperties} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
import {IntensityChart} from './IntensityChart';
import {IntensitySplineChart} from './IntensitySplineChart';
import {IntensityColumnChart} from './IntensityColumnChart';
import {IntensityAreaSplineChart} from './IntensityAreaSplineChart';
//@ts-ignore
import {Chart, Legend} from '../../Utils';
import './styles.css';
import {unitFormatter, Insight, Intensity, TrendLineOrBreakdown, formatDecimals} from '../../../utils/dashboard';
import {TotalCarbonEmission} from './TotalCarbonEmission';
import {TotalAreaSplineCarbonEmission} from './TotalAreaSplineCarbonEmission';
import {TotalAreaColumnCarbonEmission} from './TotalAreaColumnCarbonEmission';
import {EnergyConsumptionSpline} from './EnergyConsumptionSpline';
import {EnergyConsumptionColumn} from './EnergyConsumptionColumn';
import {EnergyConsumptionAreaSpline} from './EnergyConsumptionAreaSpline';
import {useSelector} from 'react-redux';
import {BarChart} from './BarChart';
import {WasteProductionBreakdown} from './WasteProductionBreakdown';
import {WasteAreaProductionBreakdown} from './WasteAreaProductionBreakdown';
import {WasteColumnProductionBreakdown} from './WasteColumnProductionBreakdown';
//@ts-ignore
import {
  getChartTypeIfExists,
  SustainabilityTrendLineAndBreakdownTypes,
  SustainabilityTrendLineAndBreakdownVariants
} from '../../../utils/chartConfigurations';
import {EnergyConsumptionStackedChart} from './EnergyConsumptionStackedChart';

export const FILTER_PV_CHART_INDEX: any = {
  year: 0,
  month: 1,
  week: 2,
  day: 3
};

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    backgroundColor: colors.chartsCardBackground
  },
  condensedContainer: {
    minWidth: 503,
    maxWidth: 503,
    minHeight: 243,
    maxHeight: 243,
    marginLeft: 1,
    justifyContent: 'center',
    backgroundColor: colors.buildingDetailsLightSideBackground
  },
  title: {
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
  condensedTitle: {
    minHeight: 48,
    maxHeight: 48,
    backgroundColor: colors.buildingDetailsSideBackground
  },
  chartWrapper: {
    ...spacing.flexVertically,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  legendsWrapper: {
    ...spacing.flexHorizontally,
    width: '100%',
    justifyContent: 'space-evenly'
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  condensedContainer: {
    width: '100%',
    minHeight: 243,
    maxHeight: 243,
    justifyContent: 'center',
    backgroundColor: colors.buildingDetailsLightSideBackground
  }
}));

export type SustainabilityTrendLineAndBreakdownVariant = keyof typeof SustainabilityTrendLineAndBreakdownVariants;

export interface SustainabilityTrendLineAndBreakdownProps {
  style?: CSSProperties;
  variant: SustainabilityTrendLineAndBreakdownVariant;
  series: any;
  categories: any;
  condensed?: boolean;
  chartTitle?: string;
}

export const SustainabilityTrendLineAndBreakdown = ({
  style,
  variant,
  series: seriesProp,
  categories,
  condensed = false,
  chartTitle
}: SustainabilityTrendLineAndBreakdownProps) => {
  const {district} = useSelector((s: any) => s.map);
  const access = useSelector((s: any) => s.user.access.kpi);
  const {chartConfigurations} = useSelector((s: any) => s.user);
  const {tabletMode, mobileMode} = useSelector((s: any) => s.styling);
  const hasEnergyAccess = access['energy']?.some((b: any) => b.district_id === district);
  const hasWaterAccess = access['water']?.some((b: any) => b.district_id === district);
  const hasWasteAccess = access['waste']?.some((b: any) => b.district_id === district);
  const hasCarbonAccess = access['carbon']?.some((b: any) => b.district_id === district);
  if (variant !== 'hvac' && variant !== 'carbon' && variant !== 'pvProductionTrendLine' && !condensed) {
    categories = categories.map((category: string) => category.slice(0, category.indexOf('-')).toUpperCase());
  }
  const styles = mobileMode ? mobileStyles : webStyles;
  let legends: any = [];
  let chartType = '';
  let title = '';
  let leftYLabel = undefined;
  let rightYLabel = undefined;
  let seriesName = undefined;
  let xAxisValueSuffix = '';
  let xAxisTitle = '';
  let yAxisTitle = '';
  let series = seriesProp ? JSON.parse(JSON.stringify(seriesProp)) : [];

  const chartTypeConf = chartConfigurations?.find((x: any) => x.chart?.name?.toLowerCase() === variant.toLowerCase());

  if (variant === SustainabilityTrendLineAndBreakdownVariants.carbon) {
    chartType =
      getChartTypeIfExists('carbon', chartTypeConf?.chartType?.name) ||
      SustainabilityTrendLineAndBreakdownTypes.carbon.stackedWithTrendline;
    title = 'CARBON FOOTPRINT';
    if (hasCarbonAccess && hasEnergyAccess) legends.push({label: 'ENERGY', color: '#84374A'});
    if (hasCarbonAccess && hasWaterAccess) legends.push({label: 'WATER', color: '#4D7389'});
    if (hasCarbonAccess && hasWasteAccess) legends.push({label: 'WASTE', color: '#4EABA9'});
    if (hasCarbonAccess && (hasEnergyAccess || hasWaterAccess || hasWasteAccess)) legends.push({label: 'Total', color: '#F5C557'});
  } else if (variant === SustainabilityTrendLineAndBreakdownVariants.energy) {
    chartType =
      getChartTypeIfExists('energy', chartTypeConf?.chartType?.name) || SustainabilityTrendLineAndBreakdownTypes.energy.stackedColumn;
    leftYLabel = unitFormatter(Insight.ENERGY);
    title = 'ENERGY CONSUMPTION TREND';
    rightYLabel = unitFormatter(Intensity.ENERGY_INTENSITY);
    legends = [
      {label: `ELECTRICITY`, color: '#5CBAE2'},
      {label: `ELECTRICITY INTENSITY`, color: '#5CBAE2'},
      {label: `COOLING`, color: '#9D7AB2'},
      {label: `COOLING INTENSITY`, color: '#9D7AB2'},
      {label: `INTENSITY`, color: '#F2994A'}
    ];
    if (series && series[0]?.data) {
      series[0].data = series[0].data.map((i: number) => Number(formatDecimals(i / 1000, 2, false)));
    }
    if (series && series[1]?.data) {
      series[1].data = series[1].data.map((i: number) => Number(formatDecimals(i, 2, false)));
    }
    if (series && series[2]?.data) {
      series[2].data = series[2].data.map((i: number) => Number(formatDecimals(i / 1000, 2, false)));
    }
    if (series && series[3]?.data) {
      series[3].data = series[3].data.map((i: number) => Number(formatDecimals(i, 2, false)));
    }
    if (series && series[4]?.data) {
      series[4].data = series[4].data.map((i: number) => Number(formatDecimals(i, 2, false)));
    }
  } else if (variant === SustainabilityTrendLineAndBreakdownVariants.water) {
    chartType =
      getChartTypeIfExists('water', chartTypeConf?.chartType?.name) || SustainabilityTrendLineAndBreakdownTypes.water.columnWithTrendline;
    leftYLabel = unitFormatter(Insight.WATER);
    if (series && series[0]?.data) {
      series[0].data = series[0].data.map((i: number) => Number(formatDecimals(i, 2, false)));
    }
    if (series && series[1]?.data) {
      series[1].data = series[1].data.map((i: number) => Number(formatDecimals(i * 1000, 2, false)));
    }
    rightYLabel = unitFormatter(Intensity.WATER_INTENSITY);
    title = 'WATER CONSUMPTION TREND';
    legends = [
      {label: `CONSUMPTION (${unitFormatter(Insight.WATER)})`, color: '#5CBAE2'},
      {label: unitFormatter(Intensity.WATER_INTENSITY), color: '#F2994A'}
    ];
    if (series && series[0]) {
      series[0].color = '#5CBAE2';
    }
    if (series && series[1]) {
      series[1].color = '#F2994A';
    }
  } else if (variant === SustainabilityTrendLineAndBreakdownVariants.waste) {
    chartType =
      getChartTypeIfExists('waste', chartTypeConf?.chartType?.name) || SustainabilityTrendLineAndBreakdownTypes.waste.stackedWithTrendline;
    title = 'WASTE PRODUCTION TREND';
    legends = [{label: `WASTE PRODUCTION (${unitFormatter(Insight.WASTE)})`, color: '#3398C3'}];
    if (series && series[0]) {
      series[0].color = '#3398C3';
    }
  } else if (variant === 'pvProduction') {
    chartType = 'chart';
    xAxisValueSuffix = 'MWh';
    xAxisTitle = 'PRODUCTION';
    title = 'PV PLANT ENERGY GENERATED TREND';
    seriesName = 'Production';
    legends = [{label: `PRODUCTION (MWh)`, color: '#4EABA9'}];
  } else if (variant === 'pvProductionTrendLine') {
    chartType = 'barChart';
    xAxisValueSuffix = 'MWh';
    xAxisTitle = 'PRODUCTION';
    title = 'GENERATED CLEAN ELECTRICITY TREND';
    seriesName = 'Production';
    yAxisTitle = 'Production (MWh)';
    legends = [{label: `PRODUCTION (MWh)`, color: '#4EABA9'}];
    series.color = '#4EABA9';
    series = [series];
  }

  title = chartTitle ? chartTitle : title;

  return (
    <div
      style={{
        ...styles.container,
        ...style,
        ...(condensed ? styles.condensedContainer : {})
      }}
    >
      <div style={{...styles.title, ...(condensed ? styles.condensedTitle : {})}}>
        <Text variant="cardHeader">{title}</Text>
      </div>
      {chartType === 'chart' && (
        <div style={styles.chartWrapper}>
          <Chart
            type="Line2"
            marker={false}
            series={series}
            categories={categories}
            xAxisValueSuffix={xAxisValueSuffix}
            xAxisTitle={xAxisTitle}
            seriesName={seriesName}
          />
          <div style={styles.legendsWrapper}>
            {legends.map((legend: any) => (
              <Legend key={`chart-legend-${legend.label}`} color={legend.color}>
                {legend.label}
              </Legend>
            ))}
          </div>
        </div>
      )}
      {chartType === 'barChart' && (
        <BarChart series={series} categories={categories} condensed={condensed} tabletMode={tabletMode} yAxisTitle={yAxisTitle} />
      )}
      {variant === 'water' && chartType === SustainabilityTrendLineAndBreakdownTypes.water.columnWithTrendline && (
        <IntensityChart
          series={series}
          categories={categories}
          leftYLabel={leftYLabel}
          rightYLabel={rightYLabel}
          condensed={condensed}
          tabletMode={tabletMode}
          mobileMode={mobileMode}
        />
      )}
      {variant === 'water' && chartType === SustainabilityTrendLineAndBreakdownTypes.water.spline && (
        <IntensitySplineChart
          series={series}
          categories={categories}
          leftYLabel={leftYLabel}
          rightYLabel={rightYLabel}
          condensed={condensed}
          tabletMode={tabletMode}
          mobileMode={mobileMode}
        />
      )}
      {variant === 'water' && chartType === SustainabilityTrendLineAndBreakdownTypes.water.column && (
        <IntensityColumnChart
          series={series}
          categories={categories}
          leftYLabel={leftYLabel}
          rightYLabel={rightYLabel}
          condensed={condensed}
          tabletMode={tabletMode}
          mobileMode={mobileMode}
        />
      )}
      {variant === 'water' && chartType === SustainabilityTrendLineAndBreakdownTypes.water.areaSpline && (
        <IntensityAreaSplineChart
          series={series}
          categories={categories}
          leftYLabel={leftYLabel}
          rightYLabel={rightYLabel}
          condensed={condensed}
          tabletMode={tabletMode}
          mobileMode={mobileMode}
        />
      )}
      {variant === 'carbon' && chartType === SustainabilityTrendLineAndBreakdownTypes.carbon.stackedWithTrendline && (
        <TotalCarbonEmission
          series={series}
          categories={categories}
          condensed={condensed}
          tabletMode={tabletMode}
          mobileMode={mobileMode}
        />
      )}
      {variant === 'carbon' && chartType === SustainabilityTrendLineAndBreakdownTypes.carbon.areaSpline && (
        <TotalAreaSplineCarbonEmission
          series={series}
          categories={categories}
          condensed={condensed}
          tabletMode={tabletMode}
          mobileMode={mobileMode}
        />
      )}
      {variant === 'carbon' && chartType === SustainabilityTrendLineAndBreakdownTypes.carbon.column && (
        <TotalAreaColumnCarbonEmission
          series={series}
          categories={categories}
          condensed={condensed}
          tabletMode={tabletMode}
          mobileMode={mobileMode}
        />
      )}
      {variant === 'waste' && chartType === SustainabilityTrendLineAndBreakdownTypes.waste.stackedWithTrendline && (
        <WasteProductionBreakdown
          series={series}
          categories={categories}
          condensed={condensed}
          tabletMode={tabletMode}
          mobileMode={mobileMode}
        />
      )}
      {variant === 'waste' && chartType === SustainabilityTrendLineAndBreakdownTypes.waste.area && (
        <WasteAreaProductionBreakdown
          series={series}
          categories={categories}
          condensed={condensed}
          tabletMode={tabletMode}
          mobileMode={mobileMode}
        />
      )}
      {variant === 'waste' && chartType === SustainabilityTrendLineAndBreakdownTypes.waste.column && (
        <WasteColumnProductionBreakdown
          series={series}
          categories={categories}
          condensed={condensed}
          tabletMode={tabletMode}
          mobileMode={mobileMode}
        />
      )}

      {variant === 'energy' && chartType === SustainabilityTrendLineAndBreakdownTypes.energy.stackedColumn && (
        <EnergyConsumptionStackedChart
          series={series}
          categories={categories}
          condensed={condensed}
          tabletMode={tabletMode}
          mobileMode={mobileMode}
        />
      )}
      {variant === 'energy' && chartType === SustainabilityTrendLineAndBreakdownTypes.energy.spline && (
        <EnergyConsumptionSpline
          series={series}
          categories={categories}
          condensed={condensed}
          tabletMode={tabletMode}
          mobileMode={mobileMode}
        />
      )}
      {variant === 'energy' && chartType === SustainabilityTrendLineAndBreakdownTypes.energy.column && (
        <EnergyConsumptionColumn
          series={series}
          categories={categories}
          condensed={condensed}
          tabletMode={tabletMode}
          mobileMode={mobileMode}
        />
      )}
      {variant === 'energy' && chartType === SustainabilityTrendLineAndBreakdownTypes.energy.areaSpline && (
        <EnergyConsumptionAreaSpline
          series={series}
          categories={categories}
          condensed={condensed}
          tabletMode={tabletMode}
          mobileMode={mobileMode}
        />
      )}
    </div>
  );
};
