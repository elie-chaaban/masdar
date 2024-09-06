import React, {useCallback, useEffect, useState} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import {
  buildingSelection,
  wasteLocationSelection,
  setWasteLocations as setWasteLocationsAction
  //@ts-ignore
} from '../../../reduxStore/actions';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';
//@ts-ignore
import {fetchBuildingsHeatmap} from '../../../services/dashBoard';
//@ts-ignore
import {fetchWasteLocations} from '../../../services/waste';
// @ts-ignore
import buildingImage from '../../../assets/images/heatmap/building_green.png';
import {Text} from '../../../components/Common/Text';
import {ScrollingMenu} from '../../../components/Dashboard/ScrollingMenu';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  topSection: {
    ...spacing.flexVertically,
    flex: 0,
    backgroundColor: colors.heatmapBackground,
    textAlign: 'center',
    minHeight: 84,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 48
  },
  scrollingMenuLeft: {
    ...spacing.center,
    alignItems: 'center',
    justifyContent: 'center'
  },
  floorTenantSwitches: {
    ...spacing.flexHorizontally,
    flex: 0,
    justifyContent: 'center'
  },
  floorTenantSwitchButton: {
    ...spacing.center,
    alignItems: 'flex-end',
    color: colors.white,
    cursor: 'pointer',
    paddingTop: 2
  },
  floorTenantSwitchButtonInActive: {
    color: colors.white
  },
  energyIntensityHeader: {
    ...spacing.flexHorizontally,
    justifyContent: 'center',
    paddingTop: 2,
    maxHeight: 25
  },
  energyIntensityHeaderLabel: {
    ...spacing.flexHorizontally,
    justifyContent: 'center',
    color: colors.white
  }
}));

const tabletStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  topSection: {
    ...webStyles.topSection,
    minWidth: 1318,
    maxWidth: 1318
  },
  scrollingMenuLeft: {
    ...webStyles.scrollingMenuLeft,
    display: 'block'
  }
}));

export const SustainaibilityHeatmapContainer = () => {
  const dispatch = useDispatch();
  const {tabletMode} = useSelector((s: any) => s.styling);
  const {buildings, district} = useSelector((s: any) => s.map, shallowEqual);
  const {insight, dateFilter} = useSelector((s: any) => s.dashboard);
  const {filter, startDate, endDate} = dateFilter;
  const [list, setList] = useState<{id: string; title: string; imageUrl: string}[]>([]);
  const [buildingsHeatMapColors, setBuildingsHeatMapColors] = useState<any>();
  const [wasteLocations, setWasteLocations] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const access = useSelector((s: any) => s.user.access.kpi);
  const hasWasteAccess = access['waste']?.some((b: any) => b.district_id === district);

  const styles = tabletMode ? tabletStyles : webStyles;

  const buildingMapper = useCallback(
    (item: any) => {
      let imageUrl = process.env['REACT_APP_FILES_URL'] || '';
      const foundHeatMap = buildingsHeatMapColors?.buildingHeatMaps?.find((h: any) => h.buildingId === item.id);
      if (foundHeatMap) {
        switch (foundHeatMap.color) {
          case 'gray':
            imageUrl += item.heatmapEmptyImageFile?.filePath;
            break;
          case 'green':
            imageUrl += item.heatmapLowImageFile?.filePath;
            break;
          case 'yellow':
            imageUrl += item.heatmapMediumImageFile?.filePath;
            break;
          case 'red':
            imageUrl += item.heatmapHighImageFile?.filePath;
            break;
          default:
            imageUrl = buildingImage;
        }
      }
      return {
        id: item.id,
        title: item.name,
        imageUrl: imageUrl
      };
    },
    [buildingsHeatMapColors?.buildingHeatMaps]
  );

  const populateWithBuildings = useCallback(() => {
    if (buildings && buildings.length) {
      const newList = buildings.filter((w: any) => w.hasData).map(buildingMapper);
      setList(newList);
    }
  }, [buildings, buildingMapper]);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const buildingsHeatMapColors = await fetchBuildingsHeatmap(filter, insight, district, null, startDate, endDate);
      setBuildingsHeatMapColors(buildingsHeatMapColors);
      setIsLoading(false);
    };

    if (insight !== 'waste' && insight !== 'carbon') {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district, filter, insight]);

  useEffect(() => {
    if (!hasWasteAccess) return;
    const fetch = async () => {
      let locations = await fetchWasteLocations(district);
      locations.map((l: any) => ({...l, active: false}));
      setWasteLocations(locations);
      dispatch(setWasteLocationsAction(locations));
    };

    fetch();
  }, [dispatch, district, hasWasteAccess]);

  useEffect(() => {
    populateWithBuildings();
  }, [buildings, populateWithBuildings]);

  useEffect(() => {
    populateWithBuildings();
  }, [populateWithBuildings]);

  const onItemClick = useCallback(
    (buildingId: string) => {
      setList([]);
      const found = wasteLocations.find((w: any) => w.buildingId?.toLowerCase() === buildingId.toLowerCase());
      if (found) {
        dispatch(wasteLocationSelection(found.location));
      }
      dispatch(buildingSelection(buildingId));
    },
    [dispatch, wasteLocations]
  );

  const renderEnergyIntensityHeader = useCallback(() => {
    const consumptionType = insight === 'energy' ? 'ENERGY' : insight === 'water' ? 'WATER' : '';
    return (
      <div style={styles.energyIntensityHeader}>
        <div style={styles.energyIntensityHeaderLabel}>
          <Text variant="actionLabel">{`${consumptionType} INTENSITY HEATMAP`}</Text>
        </div>
      </div>
    );
  }, [insight, styles]);
  const renderScrollingMenu = useCallback((): JSX.Element => {
    return (
      <div style={styles.topSection}>
        {renderEnergyIntensityHeader()}
        <div style={styles.topSectionSelectionContainer}>
          {isLoading ? (
            <Loader height="62px" margin={0} color="#fff" />
          ) : (
            <ScrollingMenu style={styles.scrollingMenuLeft} onItemClick={onItemClick} list={list} />
          )}
        </div>
      </div>
    );
  }, [isLoading, list, styles, onItemClick, renderEnergyIntensityHeader]);
  return renderScrollingMenu();
};
