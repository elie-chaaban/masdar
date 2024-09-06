import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {
  setSelectedDashboard,
  setSelectedTrendLineOrBreakdown,
  setIsBuildingComparisonOpened,
  wasteLocationSelection,
  buildingSelection,
  setShowAirQuality,
  setDistrictPvProductionChart,
  setIsAirQualityDrillDownOpened
  // @ts-ignore
} from '../../../reduxStore/actions';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';
//@ts-ignore
import {fetchDistrictPVProductions, fetchCarbonEmissionAndTrendLine, fetchEnergyConsumptionStackedBar} from '../../../services/energy';
//@ts-ignore
import {fetchWaterCarbonEmissionAndTrendLine} from '../../../services/water';
//@ts-ignore
import {fetchWasteCarbonEmissionAndTrendLine} from '../../../services/waste';
//@ts-ignore
import {getWeather, getCOMeasurement, fetchAirQuality} from '../../../services/dashBoard';
import {CleanElectricityCard} from '../../../components/Dashboard/CleanElectricityCard';
import {FILTER_PV_CHART_INDEX} from '../../../components/Dashboard/SustainabilityTrendLineAndBreakdown';
//@ts-ignore
import useFetch from '../../../hooks';
import {AirQualityCard} from '../../../components/Dashboard/AirQualityCard';
import {CardVariantId, SustainabilityTotalConsumptionCard} from '../../../components/Dashboard/SustainabilityTotalConsumptionCard';
import {sideBarListIds} from '../../../components/Dashboard/SideBar';

//@ts-ignore
import airTempRectangle from '../../../assets/images/icons/air_temp_rectangle.png';
//@ts-ignore
import airCoRectangle from '../../../assets/images/icons/air_co_rectangle.png';
//@ts-ignore
import airHumidityRectangle from '../../../assets/images/icons/air_humidity_rectangle.png';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    justifyContent: 'center',
    alignItems: 'flex-end',
    maxHeight: '100%',
    width: '100%',
    flex: 0,
    rowGap: 8
  },
  cleanElectricityCard: {minHeight: 166, maxHeight: 166},
  airQualityCard: {minHeight: 399, maxHeight: 399},
  loadingWrapper: {
    ...spacing.centerVertically,
    minHeight: 164,
    maxHeight: 221,
    maxWidth: 512,
    minWidth: 512,
    borderRadius: 2,
    backgroundColor: colors.consumptionCardBackground
  },
  cleanElectricityLoadingWrapper: {
    minHeight: 166,
    maxHeight: 166,
    minWidth: 267,
    maxWidth: 267
  },
  airQualityLoadingWrapper: {
    minHeight: 399,
    maxHeight: 399,
    minWidth: 267,
    maxWidth: 267
  }
}));

const tabletStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  loadingWrapper: {
    ...webStyles.loadingWrapper,
    maxWidth: 418,
    minWidth: 418
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  cleanElectricityLoadingWrapper: {
    minHeight: 166,
    maxHeight: 166,
    width: '100%'
  },
  airQualityLoadingWrapper: {
    minHeight: 399,
    maxHeight: 399,
    width: '100%'
  },
  loadingWrapper: {
    ...webStyles.loadingWrapper,
    paddingLeft: 100
  }
}));

export const SustainabilityHomeSideSectionContainer = () => {
  const dispatch = useDispatch();
  const {district, buildings} = useSelector((s: any) => s.map, shallowEqual);
  const {dateFilter, districtPvProductionChart} = useSelector((s: any) => s.dashboard);
  const showAirQuality = useSelector((s: any) => s.map.showAirQuality);
  const {filter, startDate, endDate} = dateFilter;
  const districtPVProductions = useFetch(fetchDistrictPVProductions, district);
  const isAirQualityDrillDownOpened = useSelector((s: any) => s.dashboard.isAirQualityDrillDownOpened);
  const districtInfo = useSelector((s: any) => s.map.districtInfo, shallowEqual);
  const {longitude, latitude, name} = districtInfo;
  const districtAirQuality = useFetch(fetchAirQuality, district);
  const weatherInfo = useFetch(getWeather, latitude, longitude);
  const coMeasurements = useFetch(getCOMeasurement, latitude, longitude);
  const isAirQualityLoading = districtAirQuality.isLoading || weatherInfo.isLoading || coMeasurements.isLoading;
  const accessModules = useSelector((s: any) => s.user.access.modules);
  const access = useSelector((s: any) => s.user.access.kpi);
  const hasCarbonAccess = access['carbon']?.some((b: any) => b.district_id === district);
  const hasEnergyAccess = access['energy']?.some((b: any) => b.district_id === district);
  const hasWaterAccess = access['water']?.some((b: any) => b.district_id === district);
  const hasWasteAccess = access['waste']?.some((b: any) => b.district_id === district);

  const {pvProduction} = useSelector((s: any) => s.user.access);
  const hasPvProductionAccess = pvProduction?.includes(district);

  const {tabletMode, mobileMode} = useSelector((s: any) => s.styling);
  const styles = mobileMode ? mobileStyles : tabletMode ? tabletStyles : webStyles;

  //Carbon Footprint
  const energyCarbonEmission = useFetch(fetchCarbonEmissionAndTrendLine, filter, startDate, endDate, district);
  const waterCarbonEmission = useFetch(fetchWaterCarbonEmissionAndTrendLine, filter, startDate, endDate, district);
  const wasteCarbonEmission = useFetch(fetchWasteCarbonEmissionAndTrendLine, filter, startDate, endDate, district);

  const energyData = useFetch(fetchEnergyConsumptionStackedBar, filter, startDate, endDate, district);

  const buildingPVProductions = useFetch(fetchDistrictPVProductions, district, '74894f39-bb41-73b0-09f2-3a0b82a7280c');

  const numberOfBuildingsWithData = buildings?.filter((x: any) => x.hasData === true)?.length ?? 0;

  useEffect(() => {
    weatherInfo.fetch();
    coMeasurements.fetch();
    return () => {
      coMeasurements.isMountedRef.current = false;
      weatherInfo.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);

  useEffect(() => {
    if (hasCarbonAccess) {
      if (hasEnergyAccess) energyCarbonEmission.fetch(true);
      if (hasWaterAccess) waterCarbonEmission.fetch(true);
      if (hasWasteAccess) wasteCarbonEmission.fetch(true);
    }
    return () => {
      energyCarbonEmission.isMountedRef.current = false;
      waterCarbonEmission.isMountedRef.current = false;
      wasteCarbonEmission.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, district]);

  useEffect(() => {
    districtAirQuality.fetch(true);
    energyData.fetch(true);

    return () => {
      energyData.isMountedRef.current = false;
      districtAirQuality.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district]);

  const getGeneratedCleanElectricityPercentage = useCallback(() => {
    let districtProduction = districtPVProductions?.response?.chart[FILTER_PV_CHART_INDEX[filter]]?.production;
    let buildingProduction = buildingPVProductions?.response?.chart[FILTER_PV_CHART_INDEX[filter]]?.production;
    if (districtProduction && buildingProduction) {
      districtProduction = parseFloat(districtProduction.replace(/,/g, ''));
      buildingProduction = parseFloat(buildingProduction.replace(/,/g, ''));
      const totalProduction = districtProduction + buildingProduction;
      if (energyData?.response && energyData.response?.chart[0]?.data) {
        const electricityConsumptionData = energyData.response.chart[0].data;
        if (filter === 'year') {
          const electricityConsumption = electricityConsumptionData.reduce((total: number, c: number) => total + c, 0);
          if (electricityConsumption === 0) return 0;
          return (totalProduction / (electricityConsumption / 1000)) * 100;
        } else {
          if (electricityConsumptionData[electricityConsumptionData.length - 1] === 0) return 0;
          return (totalProduction / (electricityConsumptionData[electricityConsumptionData.length - 1] / 1000)) * 100;
        }
      }
    }
    return 0;
  }, [buildingPVProductions?.response?.chart, districtPVProductions?.response?.chart, energyData.response, filter]);

  const airQualityValues = useMemo(() => {
    const coValue = districtAirQuality.response?.airQuality?.find((x: any) => x.name === 'co')?.value;
    return [
      {
        id: 'temp',
        title: 'TEMPERATURE (c°)',
        districtValue: districtAirQuality.response?.airQuality?.find((x: any) => x.name === 'temperature')?.value ?? 0,
        cityValue: weatherInfo.response?.max_temperature ?? 0,
        icon: airTempRectangle
      },
      {
        id: 'co',
        title: 'CO(µg/m3)',
        districtValue: coValue ? coValue * 1145 : 0,
        cityValue: coMeasurements.response?.co ?? 0,
        icon: airCoRectangle
      },
      {
        id: 'humidity',
        title: 'Humidity(%)',
        districtValue: districtAirQuality.response?.airQuality?.find((x: any) => x.name === 'humidity')?.value ?? 0,
        cityValue: weatherInfo.response?.humidity ?? 0,
        icon: airHumidityRectangle
      }
    ];
  }, [coMeasurements.response?.co, districtAirQuality.response, weatherInfo.response?.humidity, weatherInfo.response?.max_temperature]);

  const onCleanElectricityClick = useCallback(() => {
    dispatch(setIsAirQualityDrillDownOpened(false));
    if (
      hasPvProductionAccess &&
      !districtPvProductionChart &&
      districtPVProductions?.response?.chart?.length &&
      (filter === 'year' || filter === 'month')
    ) {
      dispatch(setDistrictPvProductionChart(districtPVProductions?.response?.chart));
    } else {
      dispatch(setDistrictPvProductionChart(null));
    }
  }, [dispatch, districtPVProductions?.response?.chart, districtPvProductionChart, filter, hasPvProductionAccess]);

  useEffect(() => {
    if (district) {
      districtPVProductions.fetch(true);
      buildingPVProductions.fetch(true);
    }
    return () => {
      districtPVProductions.isMountedRef.current = false;
      buildingPVProductions.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district]);

  const onAirQualityClick = () => {
    dispatch(setDistrictPvProductionChart(null));
    dispatch(setIsAirQualityDrillDownOpened(!isAirQualityDrillDownOpened));
  };

  const onClickCarbonCard = useCallback(
    (id: CardVariantId) => {
      dispatch(buildingSelection());
      dispatch(setIsAirQualityDrillDownOpened(false));
      dispatch(wasteLocationSelection());
      dispatch(setSelectedDashboard(sideBarListIds.carbon));
      dispatch(setSelectedTrendLineOrBreakdown(null));
      dispatch(setIsBuildingComparisonOpened(false));
      dispatch(setShowAirQuality(false));
      dispatch(setDistrictPvProductionChart(null));
    },
    [dispatch]
  );

  return (
    <div style={styles.container} className="animate__animated animate__fadeIn">
      {hasCarbonAccess ? (
        energyCarbonEmission.isLoading || waterCarbonEmission.isLoading || wasteCarbonEmission.isLoading ? (
          <div style={styles.loadingWrapper}>
            <Loader height="220px" margin={0} />
          </div>
        ) : (
          <SustainabilityTotalConsumptionCard
            cardVariant="carbon"
            carbonCard={{
              energyValue: energyCarbonEmission?.response?.value ?? 0,
              waterValue: waterCarbonEmission?.response?.value ?? 0,
              wasteValue: wasteCarbonEmission?.response?.value ?? 0,
              showDrillDown: true
            }}
            onClickCard={onClickCarbonCard}
          />
        )
      ) : (
        <></>
      )}
      {districtPVProductions.isLoading || buildingPVProductions.isLoading ? (
        <div style={{...styles.loadingWrapper, ...styles.cleanElectricityLoadingWrapper}}>
          <Loader height="220px" margin={0} />
        </div>
      ) : (
        <CleanElectricityCard
          value={
            parseFloat(districtPVProductions?.response?.chart[FILTER_PV_CHART_INDEX[filter]]?.production?.replace(/,/g, '')) +
            parseFloat(buildingPVProductions?.response?.chart[FILTER_PV_CHART_INDEX[filter]]?.production?.replace(/,/g, ''))
          }
          percentageValue={getGeneratedCleanElectricityPercentage()}
          onClick={onCleanElectricityClick}
          style={accessModules?.length <= 1 ? styles.cleanElectricityCard : {}}
          districtName={name}
          numberOfBuildingsWithData={numberOfBuildingsWithData}
        />
      )}
      {isAirQualityLoading ? (
        <div style={{...styles.loadingWrapper, ...styles.airQualityLoadingWrapper}}>
          <Loader height="220px" margin={0} />
        </div>
      ) : showAirQuality ? (
        <AirQualityCard
          onClick={mobileMode ? undefined : onAirQualityClick}
          list={airQualityValues}
          style={accessModules?.length <= 1 ? styles.airQualityCard : {}}
        />
      ) : null}
    </div>
  );
};
