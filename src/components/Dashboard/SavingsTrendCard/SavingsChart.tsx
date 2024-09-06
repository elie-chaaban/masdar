import React, {CSSProperties, useMemo, useRef, useEffect, MutableRefObject} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Col} from 'react-bootstrap';
import Highcharts, {Chart} from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {Insight} from '../../../utils/dashboard';
import {Text} from '../../Common/Text';
//@ts-ignore
import hasNodata from '../../../assets/images/icons/no-data.png';

let chartOptions = {
  title: {
    text: null
  },
  chart: {
    backgroundColor: null,
    color: 'white',
    height: '330',
    width: '455',
    type: 'column'
  },
  xAxis: {
    categories: {},
    labels: {
      style: {
        color: '#fff',
        fontSize: 9
      }
    }
  },
  yAxis: [
    {
      labels: {
        format: '{value}',
        style: {
          color: '#fff'
        }
      },
      title: {
        text: '<b>SAVINGS (%)</b>',
        style: {
          color: '#fff'
        }
      }
    }
  ],

  tooltip: {
    pointFormatter: function (): any {
      //@ts-ignore
      // eslint-disable-next-line no-useless-concat
      return `<b style="color: ${this.color}">-</b> ` + `SAVINGS` + ': <b>' + parseFloat(this.y).toFixed(0) + '%</b><br />';
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
  series: {}
};

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    width: '100%',
    height: '100%'
  },
  condensedContainer: {
    minHeight: 195,
    maxHeight: 195
  },
  hasNoData: {
    width: 64,
    height: 64
  },
  footerText: {
    width: '100%',
    textAlign: 'center',
    color: colors.white,
    maxHeight: 16
  },
  hasNoDataContainer: {
    ...spacing.centerVertically,
    width: '100%'
  }
}));

export interface HighChartsProps {
  style?: CSSProperties;
  series: any;
  categories: any;
  insight?: Insight;
  condensed?: boolean;
  tabletMode?: boolean;
  mobileMode?: boolean;
}

interface ChartRef {
  chart: Chart;
  container: any;
}

export const SavingsChart = ({
  style,
  series,
  categories,
  insight,
  condensed = false,
  tabletMode = false,
  mobileMode = false
}: HighChartsProps) => {
  const chartComponent = useRef<ChartRef>() as MutableRefObject<ChartRef>;
  const savings = useMemo(() => {
    const chartSeries = [
      {
        name: 'SAVINGS',
        color: '#4EABA9',
        pointPlacement: 0,
        borderColor: '#4EABA9',
        data: [] as any[]
      },
      {
        name: 'SAVINGS',
        color: 'rgba(173, 54, 83, 0.6)',
        pointPlacement: 0,
        borderColor: 'rgba(173, 54, 83, 0.6)',
        data: [] as any[]
      }
    ];

    series?.forEach((d: number) => {
      if (d >= 0) {
        chartSeries[0].data.push(d);
        chartSeries[1].data.push(null);
      } else {
        chartSeries[0].data.push(null);
        chartSeries[1].data.push(d);
      }
    });
    while (chartSeries[0].data.length < categories.length) {
      chartSeries[0].data.unshift(null);
      chartSeries[1].data.unshift(null);
    }
    return chartSeries;
  }, [categories, series]);

  chartOptions.series = savings;
  chartOptions.xAxis.categories = categories;

  let hasData = false;
  if (series?.length > 0) {
    hasData = true;
  }

  if (condensed) {
    chartOptions.chart.width = '503';
    chartOptions.chart.height = `175`;
    chartOptions.xAxis.categories = categories.map((c: string) => c.substring(0, 5));
    if (tabletMode || mobileMode) chartOptions.chart.width = '400';
    if (window.innerWidth == 390) chartOptions.chart.width = '390';
    if (window.innerWidth <= 375) chartOptions.chart.width = '370';
  } else {
    chartOptions.chart.width = '455';
    chartOptions.chart.height = `330`;
    chartOptions.xAxis.categories = categories;
  }

  let d = {...chartOptions};

  useEffect(() => {
    const chart = chartComponent.current?.chart;

    if (chart) chart.redraw();
  }, [style, series, categories, insight, condensed]);

  return (
    <div style={{...styles.container, ...style, ...(condensed ? styles.condensedContainer : {})}}>
      <Col
        style={{...(condensed ? {paddingTop: 10} : {}), ...(!hasData ? styles.hasNoDataContainer : {})}}
        xs={12}
        className="energy-chart"
      >
        {hasData ? (
          <HighchartsReact ref={chartComponent} data-testid="highChart" highcharts={Highcharts} options={d} />
        ) : (
          <>
            <img style={styles.hasNoData} src={hasNodata} alt="NOData" />
            <div id="footerText" style={styles.footerText}>
              <Text variant="actionLabelBold"> {'Data Unavailable'}</Text>
            </div>
          </>
        )}
      </Col>
    </div>
  );
};
