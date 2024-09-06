import React, {useEffect} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../../components/Common/Text';
import {shallowEqual, useSelector} from 'react-redux';
//@ts-ignore
import {fetchBuildingsHeatmap} from '../../../services/dashBoard';
//@ts-ignore
import useFetch from '../../../hooks';
// @ts-ignore
import buildingGreen from '../../../assets/images/heatmap/building_green.png';
// @ts-ignore
import buildingRed from '../../../assets/images/heatmap/building_red.png';
// @ts-ignore
import buildingYellow from '../../../assets/images/heatmap/building_yellow.png';
import * as _ from 'lodash';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.center,
    justifyContent: 'center',
    maxWidth: 1050,
    backgroundColor: 'transparent',
    margin: 'auto',
    color: colors.white,
    borderRadius: 4,
    minHeight: 56,
    maxHeight: 56,
    border: 'solid',
    borderWidth: 1,
    borderColor: colors.black,
    paddingLeft: 4,
    paddingRight: 4
  },
  innerContainer: {
    ...spacing.center,
    justifyContent: 'center',
    backgroundColor: colors.collectedDataBackground,
    color: colors.white,
    borderRadius: 4,
    minHeight: 48,
    maxHeight: 48,
    paddingLeft: 10
  },
  title: {
    ...spacing.center,
    justifyContent: 'flex-start',
    columnGap: 10
  },
  buildingIcon: {
    width: 28,
    height: 35,
    marginRight: 10
  },
  insightBuildings: {
    ...spacing.center,
    justifyContent: 'space-evenly',
    columnGap: 5,
    borderLeft: 'solid',
    borderWidth: 1,
    borderColor: colors.collectedDataBorder
  }
}));

export const SustainabilityCollectedDataContainer = () => {
  const {district} = useSelector((s: any) => s.map, shallowEqual);
  const {dateFilter} = useSelector((s: any) => s.dashboard);
  const {filter, startDate, endDate} = dateFilter;
  const energyHeatMap = useFetch(fetchBuildingsHeatmap, filter, 'energy', district, null, startDate, endDate);
  const waterHeatMap = useFetch(fetchBuildingsHeatmap, filter, 'water', district, null, startDate, endDate);
  const isLoading = energyHeatMap.isLoading || waterHeatMap.isLoading;

  const energyGreenBuildings =
    _.filter(energyHeatMap.response?.buildingHeatMaps, function (o) {
      if (o.color === 'green') return o;
    }).length ?? 0;
  const energyYellowBuildings =
    _.filter(energyHeatMap.response?.buildingHeatMaps, function (o) {
      if (o.color === 'yellow') return o;
    }).length ?? 0;
  const energyRedBuildings =
    _.filter(energyHeatMap.response?.buildingHeatMaps, function (o) {
      if (o.color === 'red') return o;
    }).length ?? 0;

  const waterGreenBuildings =
    _.filter(waterHeatMap.response?.buildingHeatMaps, function (o) {
      if (o.color === 'green') return o;
    }).length ?? 0;
  const waterYellowBuildings =
    _.filter(waterHeatMap.response?.buildingHeatMaps, function (o) {
      if (o.color === 'yellow') return o;
    }).length ?? 0;
  const waterRedBuildings =
    _.filter(waterHeatMap.response?.buildingHeatMaps, function (o) {
      if (o.color === 'red') return o;
    }).length ?? 0;

  useEffect(() => {
    energyHeatMap.fetch(true);
    waterHeatMap.fetch(true);

    return () => {
      energyHeatMap.isMountedRef.current = false;
      waterHeatMap.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district, filter]);

  const insightsHeatMap = _.concat(
    waterHeatMap.response?.buildingHeatMaps?.filter((x: any) => x.color !== 'gray') ?? [],
    energyHeatMap.response?.buildingHeatMaps?.filter((x: any) => x.color !== 'gray') ?? []
  );

  return (
    <div style={styles.container} className="animate__animated animate__fadeIn">
      <div style={styles.innerContainer}>
        {isLoading && <Loader margin={0} />}
        {!isLoading && (
          <>
            <div style={styles.title}>
              <Text variant="cardHeader">Collected Data: </Text>
              <Text variant="cardHeader">{_.uniqBy(insightsHeatMap, 'buildingId').length ?? 0} Buildings</Text>
            </div>
            <div style={styles.insightBuildings}>
              <div>
                <Text variant="cardHeader">Energy: </Text>
              </div>
              <div>
                <img src={buildingGreen} alt="building-green" style={styles.buildingIcon} />
                <Text variant="cardHeader">{energyGreenBuildings}</Text>
              </div>
              <div>
                <img src={buildingYellow} alt="building-yellow" style={styles.buildingIcon} />
                <Text variant="cardHeader">{energyYellowBuildings}</Text>
              </div>
              <div>
                <img src={buildingRed} alt="building-red" style={styles.buildingIcon} />
                <Text variant="cardHeader">{energyRedBuildings}</Text>
              </div>
            </div>
            <div style={styles.insightBuildings}>
              <div>
                <Text variant="cardHeader">Water: </Text>
              </div>
              <div>
                <img src={buildingGreen} alt="building-green" style={styles.buildingIcon} />
                <Text variant="cardHeader">{waterGreenBuildings}</Text>
              </div>
              <div>
                <img src={buildingYellow} alt="building-yellow" style={styles.buildingIcon} />
                <Text variant="cardHeader">{waterYellowBuildings}</Text>
              </div>
              <div>
                <img src={buildingRed} alt="building-red" style={styles.buildingIcon} />
                <Text variant="cardHeader">{waterRedBuildings}</Text>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
