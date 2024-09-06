import React, {useMemo} from 'react';
import {Styles} from '../../../types';

import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const openChartOptions = {
  title: {
    text: null
  },
  chart: {
    backgroundColor: 'transparent',
    height: 95,
    width: 125,
    plotShadow: false,
    margin: 0,
    type: 'pie'
  },
  plotOptions: {
    pie: {
      allowPointSelect: false,
      cursor: 'pointer',
      dataLabels: {
        enabled: false
      },
      showInLegend: false,
      borderWidth: 0
    }
  },
  legend: {
    enabled: false
  },
  tooltip: {enabled: true},
  series: {}
};

const completedChartOptions = {
  title: {
    text: null
  },
  chart: {
    backgroundColor: 'transparent',
    height: 95,
    width: 125,
    plotShadow: false,
    margin: 0,
    type: 'pie'
  },
  plotOptions: {
    pie: {
      allowPointSelect: false,
      cursor: 'pointer',
      dataLabels: {
        enabled: false
      },
      showInLegend: false,
      borderWidth: 0
    }
  },
  legend: {
    enabled: false
  },
  tooltip: {enabled: true},
  series: {}
};
const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.centerVertically,
    borderRadius: 9,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 18,
    paddingBottom: 5,
    backgroundColor: colors.white,
    textAlign: 'center',
    maxHeight: 220
  },
  title: {
    ...spacing.center,
    textAlign: 'center',
    width: '100%',
    marginBottom: 20,
    maxHeight: 30
  },
  content: {
    ...spacing.center,
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10
  },
  footer: {
    ...spacing.center,
    backgroundColor: colors.securityChartsLegendBackground,
    width: '100%',
    height: 24,
    borderRadius: 8
  },
  innerContent: {
    ...spacing.center,
    justifyContent: 'space-around'
  },
  chartContainer: {
    width: 125,
    height: 95,
    backgroundColor: colors.buildingCard,
    borderRadius: 6
  },
  legend: {
    ...spacing.center
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4
  }
}));

export interface RealtimeOperationalSummaryProps {
  data: any;
}

export const RealtimeOperationalSummary = ({data}: RealtimeOperationalSummaryProps) => {
  const openData = useMemo(() => {
    let series = data?.openIncidentsChart?.data;
    return {
      data: series,
      colorByPoint: true,
      innerSize: '55%',
      name: data?.openIncidentsChart?.name
    };
  }, [data]);

  const completedData = useMemo(() => {
    let series = data?.completedIncidentsChart?.data;
    return {
      data: series,
      colorByPoint: true,
      innerSize: '55%',
      name: data?.completedIncidentsChart?.name
    };
  }, [data]);

  openChartOptions.series = [openData];
  completedChartOptions.series = [completedData];

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <Text variant="iconLabel">REALTIME OPERATIONAL SUMMARY</Text>
      </div>
      <div style={styles.content}>
        <div style={{flex: 1}}>
          <Text variant="securityCardCaption">OPEN</Text>
          <div style={styles.innerContent}>
            <div style={styles.chartContainer}>
              <HighchartsReact data-testid="highChart" highcharts={Highcharts} options={openChartOptions} />
            </div>
            <div style={styles.totalContainer}>
              <div>
                <Text variant="securityCardCaption">Total</Text>
              </div>
              <div>
                <Text variant="largeNumericValue">{data?.openIncidentsChart?.total}</Text>
              </div>
            </div>
          </div>
        </div>
        <div style={{flex: 1}}>
          <Text variant="securityCardCaption">COMPLETED</Text>
          <div style={styles.innerContent}>
            <div style={styles.chartContainer}>
              <HighchartsReact data-testid="highChart" highcharts={Highcharts} options={completedChartOptions} />
            </div>
            <div style={styles.totalContainer}>
              <div>
                <Text variant="securityCardCaption">Total</Text>
              </div>
              <div>
                <Text variant="largeNumericValue">{data?.completedIncidentsChart?.total}</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={styles.footer}>
        <div style={styles.legend}>
          <div style={{...styles.legendColor, backgroundColor: '#63B0C0'}} />
          <Text variant="actionLabel">Low</Text>
        </div>
        <div style={styles.legend}>
          <div style={{...styles.legendColor, backgroundColor: '#84374A'}} />
          <Text variant="actionLabel">Medium</Text>
        </div>
        <div style={styles.legend}>
          <div style={{...styles.legendColor, backgroundColor: '#39566B'}} />
          <Text variant="actionLabel">High</Text>
        </div>
      </div>
    </div>
  );
};
