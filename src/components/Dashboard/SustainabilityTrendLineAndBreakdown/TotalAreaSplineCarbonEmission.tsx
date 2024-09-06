import React, {CSSProperties, useRef, useEffect, MutableRefObject} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Col} from 'react-bootstrap';
import Highcharts, {Chart} from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {Text} from '../../Common/Text';
//@ts-ignore
import hasNodata from '../../../assets/images/icons/no-data.png';

const data = {
  title: {
    text: null
  },
  chart: {
    backgroundColor: null,
    color: 'white',
    height: '200',
    width: '425'
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
      min: 0,
      title: {
        text: 'CARBON FOOTPRINT (KG)',
        style: {
          color: '#fff'
        }
      },
      labels: {
        style: {
          color: '#fff'
        },
        x: -3
      }
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
    enabled: true,
    itemStyle: {
      color: 'gray'
    },
    useHTML: true,
    labelFormatter: function (): any {
      //@ts-ignore
      if (this.options.visible === false) return `<span style="color:gray">${this.name}</span>`;
      //@ts-ignore
      return `<span style="color: #fff">${this.name}</span>`;
    }
  },
  series: []
};

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    width: '100%',
    height: '100%'
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
    width: '100%',
    height: '100%'
  }
}));

export interface HighChartsProps {
  style?: CSSProperties;
  series: any;
  categories: any;
  condensed?: boolean;
  tabletMode?: boolean;
  mobileMode?: boolean;
}

interface ChartRef {
  chart: Chart;
  container: any;
}

export const TotalAreaSplineCarbonEmission = ({
  style,
  series,
  categories,
  condensed = false,
  tabletMode = false,
  mobileMode = false
}: HighChartsProps) => {
  const chartComponent = useRef<ChartRef>() as MutableRefObject<ChartRef>;
  data.series = series;
  data.xAxis.categories = categories;

  let hasData = false;
  if (series.length > 0) {
    series.forEach((element: any) => {
      element.type = 'areaspline';
      element.data.forEach((el: any) => {
        if (el !== 0) hasData = true;
      });
    });
  }

  if (condensed) {
    data.chart.width = `503`;
    data.chart.height = `175`;
    data.xAxis.categories = categories.map((c: string) => c.substring(0, 5));
    if (mobileMode) data.chart.width = '400';
    if (window.innerWidth == 390) data.chart.width = '390';
    if (window.innerWidth <= 375) data.chart.width = '370';
  } else {
    if (tabletMode || window.innerWidth == 414) {
      data.chart.width = '418';
    } else if (window.innerWidth == 390) {
      data.chart.width = '390';
    } else if (window.innerWidth <= 375) {
      data.chart.width = '370';
    } else if (window.innerWidth <= 412) {
      data.chart.width = '400';
    } else {
      data.chart.width = '425';
    }
    data.chart.height = `300`;
    data.xAxis.categories = categories;
  }

  let d = {...data};

  useEffect(() => {
    const chart = chartComponent.current?.chart;

    if (chart) chart.redraw();
  }, [style, series, categories, condensed, tabletMode]);
  return (
    <div style={{...styles.container, ...style}}>
      <Col
        style={{...(condensed ? {paddingTop: 10} : {}), ...(!hasData ? styles.hasNoDataContainer : {})}}
        xs={12}
        className="energy-chart"
      >
        {hasData ? (
          <HighchartsReact ref={chartComponent} data-testid="highChart" highcharts={Highcharts} options={d} />
        ) : (
          <>
            <img style={styles.hasNodata} src={hasNodata} alt="NOData" />
            <div id="footerText" style={styles.footerText}>
              <Text variant="actionLabelBold"> {'Data Unavailable'}</Text>
            </div>
          </>
        )}
      </Col>
    </div>
  );
};
