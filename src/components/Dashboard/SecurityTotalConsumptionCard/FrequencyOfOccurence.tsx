import React, {useMemo} from 'react';
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
    height: 20,
    borderRadius: 8
  },
  legend: {
    ...spacing.center
  },
  legendColor: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 2
  },
  totalsContainer: {
    ...spacing.flexVertically,
    maxWidth: 180,
    height: 130,
    borderRadius: 6,
    backgroundColor: colors.sideCardsBackground,
    padding: 10,
    marginRight: 8
  },
  chart: {
    minWidth: 240,
    height: 130,
    borderRadius: 6,
    backgroundColor: colors.sideCardsBackground,
    padding: 10
  },
  row: {
    ...spacing.center,
    height: 20
  },
  rowTotal: {
    ...spacing.center,
    justifyContent: 'flex-end',
    paddingRight: 5,
    maxWidth: 35,
    height: 20,
    backgroundColor: colors.incidentTypeCountBackground,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    color: colors.frequencyOfOccurenceTotal
  },
  rowName: {
    ...spacing.center,
    justifyContent: 'flex-start',
    maxWidth: 130,
    height: 20,
    backgroundColor: colors.frequencyOfOccurenceType,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    paddingLeft: 4
  }
}));

const chartOptions = {
  title: {
    text: null
  },
  chart: {
    height: 120,
    width: 240,
    backgroundColor: null,
    spacingLeft: 0,
    spacingRight: 0
  },
  yAxis: {
    labels: {
      style: {
        color: 'black'
      }
    },
    title: {
      offset: 0,
      margin: 0,
      text: null,
      style: {
        color: 'black'
      }
    }
  },
  xAxis: {
    categories: [],
    lineWidth: 0,
    visible: false,
    minorGridLineWidth: 0,
    lineColor: 'transparent',
    labels: {
      style: {
        color: 'black',
        style: {
          fontSize: 8
        }
      },
      align: 'right',
      rotation: 270
    },
    title: {
      text: null
    }
  },
  legend: {
    enabled: false
  },
  tooltip: {
    shared: true,
    style: {
      fontSize: '0.7vw'
    }
  },
  plotOptions: {
    line: {
      marker: {
        enabled: false
      }
    },
    column: {
      borderWidth: 0
    }
  },
  series: []
};

export interface FrequencyOfOccurenceProps {
  data: any;
}

export const FrequencyOfOccurence = ({data}: FrequencyOfOccurenceProps) => {
  chartOptions.xAxis.categories = data?.xaxis;
  chartOptions.series = data?.trendLine;

  const rows = useMemo(() => {
    return [
      {
        id: 'accessControl',
        title: 'ACCESS CONTROL',
        color: '#63B0C0',
        total:
          data?.trendLine
            ?.filter((x: any) => x.name === 'Access Control')[0]
            ?.data?.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) ?? 0
      },
      {
        id: 'criminalIncident',
        title: 'CRIMINAL INCIDENT',
        color: '#84374A',
        total:
          data?.trendLine
            ?.filter((x: any) => x.name === 'Criminal Incident')[0]
            ?.data?.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) ?? 0
      },
      {
        id: 'faultAlarms',
        title: 'FAULT ALARMS',
        color: '#39566B',
        total:
          data?.trendLine
            ?.filter((x: any) => x.name === 'Fault Alarms')[0]
            ?.data?.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) ?? 0
      },
      {
        id: 'others',
        title: 'OTHERS',
        color: '#F6CA67',
        total:
          data?.trendLine
            ?.filter((x: any) => x.name === 'Others')[0]
            ?.data?.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) ?? 0
      },
      {
        id: 'safety',
        title: 'SAFETY',
        color: '#746986',
        total:
          data?.trendLine
            ?.filter((x: any) => x.name === 'Safety')[0]
            ?.data?.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) ?? 0
      }
    ];
  }, [data]);

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <Text variant="iconLabel">FREQUENCY OF OCCURRENCE BY TYPE</Text>
      </div>
      <div style={styles.content}>
        <div style={styles.totalsContainer}>
          {rows.map((row) => (
            <div style={styles.row} key={row.id}>
              <div style={styles.rowTotal}>
                <Text variant="textLink">{row.total}</Text>
              </div>
              <div style={styles.rowName}>
                <div style={{...styles.legendColor, backgroundColor: row.color}} />
                <Text variant="footNoteBold">{row.title}</Text>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.chart}>
          <HighchartsReact data-testid="highChart" highcharts={Highcharts} options={chartOptions} />
        </div>
      </div>
      <div style={styles.footer}>
        {rows.map((row) => (
          <div style={styles.legend} key={row.id}>
            <div style={{...styles.legendColor, backgroundColor: row.color}} />
            <Text variant="miniLabelSemiBold">{row.title}</Text>
          </div>
        ))}
      </div>
    </div>
  );
};
