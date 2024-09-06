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
    backgroundColor: null,
    color: 'white',
    height: '200',
    width: ''
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
      title: {text: 'KWH'},
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
    enabled: true,
    itemStyle: {
      color: 'gray'
    },
    useHTML: true,
    labelFormatter: function (): any {
      //@ts-ignore
      if (this.options.visible === false) return `<span style="color:gray">${this.name}</span>`;
      //@ts-ignore
      return `<span style="color: ${this.color}">${this.name}</span>`;
    }
  },
  series: []
};

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    width: '100%',
    height: '100%'
  }
}));

interface ChartRef {
  chart: Chart;
  container: any;
}

export interface HighChartsProps {
  style?: CSSProperties;
  series: any;
  categories: any;
  condensed?: boolean;
  tabletMode?: boolean;
}

export const HvacConsumption = ({style, series, categories, condensed = false, tabletMode = false}: HighChartsProps) => {
  const chartComponent = useRef<ChartRef>() as MutableRefObject<ChartRef>;
  data.series = series;
  data.xAxis.categories = categories;

  if (condensed) {
    data.chart.width = `503`;
    data.chart.height = `175`;
    data.xAxis.categories = categories.map((c: string) => c.substring(0, 5));
  } else {
    if (tabletMode) {
      data.chart.width = '418';
    } else {
      data.chart.width = '';
    }
    data.chart.height = `200`;
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
