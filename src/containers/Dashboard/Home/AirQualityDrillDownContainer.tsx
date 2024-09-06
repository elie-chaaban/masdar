import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
// @ts-ignore
import {fetchHourlyBuildingsCo, fetchHourlyBuildingsTemperature, fetchHourlyBuildingsHumidity} from '../../../services/dashBoard';
//@ts-ignore
import useFetch from '../../../hooks';
import {useDispatch, useSelector} from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';
import {Text} from '../../../components/Common/Text';
import {TextButton} from '../../../components/Common/TextButton';
// @ts-ignore
import {setIsAirQualityDrillDownOpened} from '../../../reduxStore/actions';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 48,
    minWidth: '100%',
    maxWidth: '100%',
    zIndex: 9999,
    color: colors.white
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 300,
    zIndex: 999
  },
  hourlyAirQualityDrillDownTrendLine: {
    borderRadius: 0
  },
  bottomSection: {
    ...spacing.flexHorizontally,
    justifyContent: 'center',
    backgroundColor: colors.chartsCardBackground
  },
  title: {
    ...spacing.center,
    textAlign: 'center',
    width: '100%',
    marginBottom: 20,
    maxHeight: 30
  },
  switchesContainer: {
    ...spacing.centerVertically,
    minWidth: '15%'
  },
  button: {
    width: 290,
    minHeight: 57,
    maxHeight: 57,
    marginBottom: 20
  },
  chartContainer: {
    ...spacing.flexVertically,
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    padding: 23,
    backgroundColor: colors.consumptionCardBackground,
    flex: 2
  },
  rightSection: {minWidth: '70%', minHeight: 300}
}));

const data = {
  title: {
    text: null
  },

  chart: {
    backgroundColor: null,
    color: 'white',
    height: '200'
  },
  yAxis: {
    title: {
      text: ''
    }
  },

  xAxis: {
    categories: []
  },

  legend: {
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'bottom'
  },

  plotOptions: {},

  series: []
};

const tabletStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...webStyles.container,
    minWidth: 1318,
    maxWidth: 1318
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...webStyles.container,
    marginBottom: 40,
    minWidth: '88%',
    maxWidth: '88%'
  },
  bottomSection: {
    ...webStyles.bottomSection,
    marginRight: 124
  },
  button: {
    ...webStyles.button,
    width: 104,
    maxHeight: 41,
    minHeight: 41,
    marginRight: 20
  },
  chartContainer: {
    ...webStyles.chartContainer,
    marginLeft: 22,
    width: '116%'
  },
  rightSection: {
    ...webStyles.rightSection,
    marginRight: -52
  }
}));

export const AirQualityDrillDownContainer = () => {
  const dispatch = useDispatch();
  const {tabletMode, mobileMode} = useSelector((s: any) => s.styling);
  const dataRef = useRef({loadingSource: {isLoading: true}, chartData: null as any});
  const [activeView, setActiveView] = useState<string>('co');
  const [activeViewText, setActiveViewText] = useState<string>('Last 24 Hours CO Trendline');
  const {district} = useSelector((s: any) => s.map);
  const hourlyBuildingsCo = useFetch(fetchHourlyBuildingsCo, district);
  const hourlyBuildingsTemperature = useFetch(fetchHourlyBuildingsTemperature, district);
  const hourlyBuildingsHumidity = useFetch(fetchHourlyBuildingsHumidity, district);

  const styles = mobileMode ? mobileStyles : tabletMode ? tabletStyles : webStyles;

  useEffect(() => {
    switch (activeView) {
      case 'co':
        hourlyBuildingsCo.fetch(true);
        break;
      case 'humidity':
        hourlyBuildingsHumidity.fetch(true);
        break;
      case 'temperature':
        hourlyBuildingsTemperature.fetch(true);
        break;
    }
    return () => {
      hourlyBuildingsCo.isMountedRef.current = false;
      hourlyBuildingsTemperature.isMountedRef.current = false;
      hourlyBuildingsHumidity.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district, activeView]);

  switch (activeView) {
    case 'co':
      dataRef.current.loadingSource = hourlyBuildingsCo;
      dataRef.current.chartData = {
        ...data,
        series: hourlyBuildingsCo.response?.chart ?? [],
        xAxis: {
          ...data.xAxis,
          categories: hourlyBuildingsCo.response?.categories ?? []
        }
      };
      break;
    case 'humidity':
      dataRef.current.loadingSource = hourlyBuildingsHumidity;
      dataRef.current.chartData = {
        ...data,
        series: hourlyBuildingsHumidity.response?.chart ?? [],
        xAxis: {
          ...data.xAxis,
          categories: hourlyBuildingsHumidity.response?.categories ?? []
        }
      };
      break;
    case 'temperature':
      dataRef.current.loadingSource = hourlyBuildingsTemperature;
      dataRef.current.chartData = {
        ...data,
        series: hourlyBuildingsTemperature.response?.chart ?? [],
        xAxis: {
          ...data.xAxis,
          categories: hourlyBuildingsTemperature.response?.categories ?? []
        }
      };
      break;
  }

  const switchToCo = () => {
    setActiveView('co');
    setActiveViewText('Last 24 Hours CO Trendline');
  };
  const switchToHumidity = () => {
    setActiveView('humidity');
    setActiveViewText('Last 24 Hours Humidity Trendline');
  };
  const switchToTemperature = () => {
    setActiveView('temperature');
    setActiveViewText('Last 24 Hours Temperature Trendline');
  };

  const closeContainer = useCallback(() => {
    dispatch(setIsAirQualityDrillDownOpened(false));
  }, [dispatch]);

  return (
    <div>
      <div style={styles.overlay} onClick={closeContainer}></div>
      <div className="animate__animated animate__fadeInUp" style={styles.container}>
        <div style={styles.bottomSection}>
          <div style={styles.switchesContainer}>
            <TextButton text="CO" style={styles.button} toggled={activeView === 'co'} onClick={switchToCo} />
            <TextButton text="HUMIDITY" style={styles.button} toggled={activeView === 'humidity'} onClick={switchToHumidity} />
            <TextButton text="TEMPERATURE" style={styles.button} toggled={activeView === 'temperature'} onClick={switchToTemperature} />
          </div>
          <div style={styles.rightSection}>
            {dataRef.current.loadingSource.isLoading ? (
              <Loader height="100px" margin={0} color={'#fff'} />
            ) : (
              <div style={styles.chartContainer}>
                <div style={styles.title}>
                  <Text variant="cardHeader">{activeViewText}</Text>
                </div>
                <HighchartsReact data-testid="highChart" highcharts={Highcharts} options={dataRef.current.chartData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
