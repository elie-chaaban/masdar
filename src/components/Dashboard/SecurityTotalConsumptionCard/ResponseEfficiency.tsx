import React from 'react';
import {Styles} from '../../../types';

import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

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
  legend: {
    ...spacing.center
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4
  },
  chart: {
    width: 220,
    height: 95,
    borderRadius: 6,
    backgroundColor: colors.buildingCard,
    margin: 2
  }
}));

const resolutionChartOptions = {
  title: {
    text: null
  },
  chart: {
    backgroundColor: 'transparent',
    height: 95,
    width: 215,
    spacingLeft: 2,
    spacingRight: 2,
    spacingBottom: 2
  },
  xAxis: {
    categories: {},
    labels: {
      style: {
        color: 'black',
        fontSize: 9
      }
    }
  },

  yAxis: [
    {
      min: 0,
      title: {text: null},
      labels: {
        style: {
          color: 'gray'
        },
        x: -3
      }
    },
    {
      title: {
        enabled: false
      },
      labels: {
        format: '{value}°F',
        style: {
          color: 'gray'
        },
        x: 3
      },

      opposite: true
    }
  ],
  tooltip: {
    pointFormatter: function (): any {
      //@ts-ignore
      return `<b style="color: ${this.color}">-</b> ` + this.series.name + ': <b>' + this.y.toString().replace(/ /g, '') + '</b><br />';
    },
    shared: true
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      borderWidth: 0.5
    },
    line: {
      lineWidth: 1
    }
  },
  legend: {
    enabled: false
  },
  series: []
};

const responseChartOptions = {
  title: {
    text: null
  },
  chart: {
    backgroundColor: 'transparent',
    height: 95,
    width: 215,
    spacingLeft: 2,
    spacingRight: 2,
    spacingBottom: 2
  },
  xAxis: {
    categories: {},
    labels: {
      style: {
        color: 'black',
        fontSize: 9
      }
    }
  },

  yAxis: [
    {
      min: 0,
      title: {text: null},
      labels: {
        style: {
          color: 'gray'
        },
        x: -3
      }
    },
    {
      title: {
        enabled: false
      },
      labels: {
        format: '{value}°F',
        style: {
          color: 'gray'
        },
        x: 3
      },

      opposite: true
    }
  ],
  tooltip: {
    pointFormatter: function (): any {
      //@ts-ignore
      return `<b style="color: ${this.color}">-</b> ` + this.series.name + ': <b>' + this.y.toString().replace(/ /g, '') + '</b><br />';
    },
    shared: true
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      borderWidth: 0.5
    },
    line: {
      lineWidth: 1
    }
  },
  legend: {
    enabled: false
  },
  series: []
};

export interface ResponseEfficiencyProps {
  data: any;
}

export const ResponseEfficiency = ({data}: ResponseEfficiencyProps) => {
  resolutionChartOptions.series = data?.acknowledgementTime_chartData;
  resolutionChartOptions.xAxis.categories = data?.acknowledgementTime_xaxis;

  responseChartOptions.series = data?.responseTime_chartData;
  responseChartOptions.xAxis.categories = data?.responseTime_xaxis;
  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <Text variant="iconLabel">RESPONSE EFFICIENCY</Text>
      </div>
      <div style={styles.content}>
        <div>
          <Text variant="securityCardCaption">RESOLUTION TIME (SEC)</Text>
          <div style={styles.chart}>
            <HighchartsReact data-testid="highChart" highcharts={Highcharts} options={resolutionChartOptions} />
          </div>
        </div>
        <div>
          <Text variant="securityCardCaption">RESPONSE TIME (SEC)</Text>
          <div style={styles.chart}>
            <HighchartsReact data-testid="highChart" highcharts={Highcharts} options={responseChartOptions} />
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
