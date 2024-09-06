import React, {CSSProperties, useRef, useEffect, MutableRefObject} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Col} from 'react-bootstrap';
import Highcharts, {Chart} from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const data = {
  title: {
    text: null
  },
  chart: {
    type: 'column',
    backgroundColor: null,
    color: 'white',
    height: '240',
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

  yAxis: {
    min: 0,
    labels: {
      style: {
        color: '#fff'
      }
    },
    title: {
      text: 'PRODUCTION (KG)',
      style: {
        color: '#fff'
      }
    }
  },
  tooltip: {
    pointFormatter: function (): any {
      //@ts-ignore
      return `<b style="color: ${this.color}">-</b> ` + this.series.name + ': <b>' + this.y.toLocaleString() + '</b><br />';
    },
    shared: true
  },
  plotOptions: {
    column: {
      borderWidth: 0.5
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
  series: [{}]
};

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
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
  yAxisTitle?: string;
}

interface ChartRef {
  chart: Chart;
  container: any;
}

export const BarChart = ({style, series, categories, condensed = false, tabletMode = false, yAxisTitle}: HighChartsProps) => {
  const chartComponent = useRef<ChartRef>() as MutableRefObject<ChartRef>;
  data.series = series;
  data.xAxis.categories = categories;
  if (yAxisTitle) {
    data.yAxis.title.text = yAxisTitle;
  }
  if (condensed) {
    data.chart.width = `503`;
    data.chart.height = `175`;
    data.xAxis.categories = categories.map((c: string) => c.substring(0, 5));
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
    data.chart.height = `240`;
    data.xAxis.categories = categories;
  }

  let d = {...data};

  useEffect(() => {
    const chart = chartComponent.current?.chart;

    if (chart) chart.redraw();
  }, [style, series, categories, condensed, tabletMode]);

  return (
    <div style={{...styles.container, ...style}}>
      <Col style={{...(condensed ? {paddingTop: 10} : {})}} xs={12} className="energy-chart">
        <HighchartsReact ref={chartComponent} data-testid="highChart" highcharts={Highcharts} options={d} />
      </Col>
    </div>
  );
};
