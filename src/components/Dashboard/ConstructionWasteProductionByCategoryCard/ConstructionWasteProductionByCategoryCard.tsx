import React, {CSSProperties, useRef, useEffect, MutableRefObject} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
import Highcharts, {Chart} from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

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
    marginLeft: 1,
    justifyContent: 'center',
    backgroundColor: colors.buildingDetailsLightSideBackground
  },
  titleWrapper: {
    ...spacing.center,
    textAlign: 'center',
    width: '100%',
    maxHeight: 40,
    color: colors.white,
    backgroundColor: colors.chartsCardHeaderBackground,
    paddingTop: 20,
    paddingBottom: 20
  },
  condensedTitleWrapper: {
    minHeight: 48,
    maxHeight: 48,
    backgroundColor: colors.buildingDetailsSideBackground
  },
  sectionsWrapper: {
    ...spacing.center
  }
}));

const tabletStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  condensedContainer: {
    ...webStyles.condensedContainer,
    minWidth: 400,
    maxWidth: 400
  }
}));

const data = {
  title: {
    text: null
  },
  chart: {
    type: 'column',
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

  yAxis: {
    min: 0,
    labels: {
      style: {
        color: '#fff'
      },
      //@ts-ignore
      formatter: function () {
        //@ts-ignore
        return this.axis.defaultLabelFormatter.call(this) + '%';
      }
    },
    title: {
      text: ''
    }
  },
  tooltip: {
    pointFormatter: function (): any {
      return (
        //@ts-ignore
        '<b>' + this.options.production.toLocaleString() + ' KGs</b><br />'
      );
    },
    shared: true
  },
  plotOptions: {
    column: {
      colorByPoint: true,
      borderWidth: 0.5,
      dataLabels: {
        enabled: true,
        format: '{y:,.0f} %'
      }
    }
  },
  colors: ['#A7A87D', '#4C8051', '#7D3B53'],
  legend: {
    enabled: false
  },
  series: [{}]
};

export interface ListItem {
  id: string;
  name: string;
  y: number;
  z: number;
}

export interface ConstructionWasteProductionByCategoryCardProps {
  style?: CSSProperties;
  list: any;
  condensed?: boolean;
  tabletMode?: boolean;
}

interface ChartRef {
  chart: Chart;
  container: any;
}

export const ConstructionWasteProductionByCategoryCard = ({
  style,
  list,
  condensed = false,
  tabletMode = false
}: ConstructionWasteProductionByCategoryCardProps) => {
  const styles = tabletMode ? tabletStyles : webStyles;
  const chartComponent = useRef<ChartRef>() as MutableRefObject<ChartRef>;
  data.series = list?.chart;
  data.xAxis.categories = ['Non Recyclable', 'Recyclable', 'Hazardous'];

  if (condensed) {
    data.chart.width = `503`;
    data.chart.height = `190`;

    if (tabletMode) {
      data.chart.width = `400`;
    }
  } else {
    data.chart.width = '425';
    data.chart.height = `200`;
  }

  let d = {...data};

  useEffect(() => {
    const chart = chartComponent.current?.chart;

    if (chart) chart.redraw();
  }, [style, list, condensed]);

  return (
    <div style={{...styles.container, ...style, ...(condensed ? styles.condensedContainer : {})}}>
      <div style={{...styles.titleWrapper, ...(condensed ? styles.condensedTitleWrapper : {})}}>
        <Text variant="cardHeader">{'CONSTRUCTION WASTE DATA BY CATEGORY'}</Text>
      </div>
      <div style={styles.sectionsWrapper}>
        <HighchartsReact ref={chartComponent} data-testid="highChart" highcharts={Highcharts} options={d} />
      </div>
    </div>
  );
};
