import React, {ReactNode, useEffect, useCallback, useMemo} from 'react';
import {Styles} from '../../types';
import {createStyles} from '../../theme';
import {SideBarContainer} from './SideBarContainer';
import {HeaderContainer} from './HeaderContainer';
import {PeriodSelectionContainer} from './PeriodSelectionContainer';
import {useDispatch, useSelector} from 'react-redux';
//@ts-ignore
import {LoaderFull} from '../../components/Utils';
//@ts-ignore
import ActionSlider from '../ActionSlider';
import Landing from './Landing';
import useIdleTimeoutHandler from '../../hooks/useIdleTimeoutHandler';
//@ts-ignore
import {setActiveWindows, setMultiWindowConfig, removeActiveWindow, setTabletMode, setMobileMode} from '../../reduxStore/actions';
//@ts-ignore
import MultiWindowModal from '../../components/Utils/MultiWindowModal';
//@ts-ignore
import MWBroadcastChannel from '../../services/MWBroadcastChannel';
import ModulesSwitcherContainer from './ModulesSwitcherContainer';
import {SecurityHomeContainer} from './Security/SecurityHomeContainer';
import {BuildingComparisonContainer} from './Home/BuildingComparisonContainer';
import {SustainabilityHomeTopSectionContainer} from './Sustainability/SustainabilityHomeTopSectionContainer';
import {SustainabilityEnergyTopSectionContainer} from './Sustainability/SustainabilityEnergyTopSectionContainer';
import {SustainabilityWaterTopSectionContainer} from './Sustainability/SustainabilityWaterTopSectionContainer';
import {SustainabilityWasteTopSectionContainer} from './Sustainability/SustainabilityWasteTopSectionContainer';
import {SustainabilityCarbonTopSectionContainer} from './Sustainability/SustainabilityCarbonTopSectionContainer';
import {MapContainer} from './MapContainer/MapContainer';
import {SustainabilityEnergySideSectionContainer} from './Sustainability/SustainabilityEnergySideSectionContainer';
import {SustainaibilityHeatmapContainer} from './Sustainability/SustainaibilityHeatmapContainer';
import {SustainabilityHomeSideSectionContainer} from './Sustainability/SustainabilityHomeSideSectionContainer';
import {SustainabilityWaterSideSectionContainer} from './Sustainability/SustainabilityWaterSideSectionContainer';
import {SustainabilityWasteSideSectionContainer} from './Sustainability/SustainabilityWasteSideSectionContainer';
import {SustainabilityCarbonSideSectionContainer} from './Sustainability/SustainabilityCarbonSideSectionContainer';
import {SustainabilityCollectedDataContainer} from './Sustainability/SustainabilityCollectedDataContainer';
import {BuildingDetailsContainer} from './Home/BuildingDetailsContainer';
import {AirQualityDrillDownContainer} from './Home/AirQualityDrillDownContainer';
import {CEDrillDownContainer} from './Home/CEDrillDownContainer';
import {isTablet, isMobile} from 'react-device-detect';

const broadcastChannel = MWBroadcastChannel.getService();
broadcastChannel.startListening();

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexHorizontally,
    height: '100%',
    width: '100%',
    padding: 0,
    margin: 0,
    backgroundColor: colors.globalBackground
  },
  sidebar: {
    ...spacing.flex,
    flex: 0,
    backgroundColor: colors.sidebar
  },
  main: {
    ...spacing.flexVertically,
    width: '100%',
    maxWidth: '100%'
  },
  header: {
    ...spacing.flex,
    maxHeight: 80,
    maxWidth: '100%'
  },
  periodSelection: {
    ...spacing.flex,
    maxHeight: 40
  },
  contentContainer: {
    ...spacing.flexHorizontally
  },
  leftSectionContainer: {
    ...spacing.flex,
    position: 'absolute',
    top: 170,
    left: 86,
    justifyContent: 'flex-start',
    paddingLeft: 19,
    paddingRight: 19,
    width: 550,
    maxWidth: 550,
    maxHeight: 879,
    zIndex: 10,
    height: '100%'
  },
  rightSectionContainer: {
    ...spacing.flex,
    position: 'absolute',
    top: 180,
    right: 0,
    justifyContent: 'flex-end',
    paddingLeft: 19,
    paddingRight: 19,
    maxWidth: 550,
    maxHeight: 970,
    zIndex: 10,
    height: '100%'
  },
  topSectionContainer: {
    ...spacing.flexVertically,
    position: 'absolute',
    width: '100%',
    top: 80,
    zIndex: 12,
    background: colors.periodSelectionContainerBackground,
    minHeight: 60,
    paddingLeft: 60,
    paddingRight: 60
  },
  mapStyle: {
    position: 'absolute',
    top: 82,
    bottom: 0,
    right: 0,
    left: 49,
    maxWidth: '100%',
    minHeight: 920
  },
  sustainabilityCollectedDataContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%'
  }
}));

const tabletStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...webStyles.container,
    width: 1318
  },
  main: {
    ...webStyles.main,
    maxWidth: 1318
  },
  header: {
    ...webStyles.header,
    maxWidth: 1318,
    minWidth: 1318
  },
  leftSectionContainer: {
    ...webStyles.leftSectionContainer,
    top: 100,
    width: 456,
    maxWidth: 456,
    minWidth: 456,
    maxHeight: 920
  },
  rightSectionContainer: {
    ...webStyles.rightSectionContainer,
    top: 110,
    width: 456,
    left: 380,
    maxWidth: 456,
    minWidth: 456,
    maxHeight: 920
  },
  topSectionContainer: {
    ...webStyles.topSectionContainer,
    width: 1318
  },
  mapStyle: {
    ...webStyles.mapStyle,
    maxWidth: 1318
  },
  sustainabilityCollectedDataContainer: {
    ...webStyles.sustainabilityCollectedDataContainer,
    width: 1318
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    height: '100%',
    width: '100%',
    padding: 0,
    margin: 0,
    backgroundColor: colors.globalBackground,
    overflow: 'scroll',
    overflowX: 'hidden'
  },
  sidebar: {
    height: 0
  },
  main: {
    ...spacing.flexVertically,
    width: '100%',
    maxWidth: '100%'
  },
  header: {
    ...spacing.flex,
    maxHeight: 80,
    maxWidth: '100%'
  },
  contentContainer: {
    ...spacing.flexVertically
  }
}));

export const DashboardContainer = () => {
  useIdleTimeoutHandler();
  const dispatch = useDispatch();
  const {currentDashboardProps, isOpenLanding, isAirQualityDrillDownOpened, selectedModule, districtPvProductionChart, dateFilter} =
    useSelector((s: any) => s.dashboard);

  const isBuildingComparisonOpened = useSelector((s: any) => s.map.isBuildingComparisonOpened);
  const districts = useSelector((s: any) => s.map.districts);
  const districtsData = useSelector((s: any) => s.map.districtsData);
  const districtInfo = useSelector((s: any) => s.map.districtInfo);
  const access = useSelector((s: any) => s.user.access);
  const doneLoading = districts && access && districtsData.length;
  const accessModules = useSelector((s: any) => s.user?.access?.modules);
  const {building, showBuildingDetails} = useSelector((s: any) => s.map);
  const {filter} = dateFilter;
  const {tabletMode, mobileMode} = useSelector((s: any) => s.styling);
  const styles = mobileMode ? mobileStyles : tabletMode ? tabletStyles : webStyles;
  const mapContainerStyle = useMemo(() => {
    const sidebarDetails = currentDashboardProps.sidebar;
    switch (sidebarDetails.selectedId) {
      case 'home':
        return {
          minHeight: accessModules?.length <= 1 ? 710 : 675
        };
      case 'energy':
      case 'water':
      case 'waste':
        return {};
    }
  }, [currentDashboardProps.sidebar, accessModules]);

  useEffect(() => {
    dispatch(setTabletMode(isTablet));
    dispatch(setMobileMode(isMobile));
    dispatch(setMultiWindowConfig());
    dispatch(setActiveWindows());
    window.addEventListener('unload', (event) => {
      dispatch(removeActiveWindow());
    });
  }, [dispatch]);

  useEffect(() => {
    if (!districtInfo) return;
    document.title = `${districtInfo?.name}`;
  }, [districtInfo]);

  const renderTop = useCallback((): ReactNode => {
    const sidebarDetails = currentDashboardProps.sidebar;
    // if (isOpenLanding) return <Landing />;
    if (selectedModule === 'sustainability') {
      switch (sidebarDetails.selectedId) {
        case 'home':
          return <SustainabilityHomeTopSectionContainer />;
        case 'energy':
          return <SustainabilityEnergyTopSectionContainer />;
        case 'water':
          return <SustainabilityWaterTopSectionContainer />;
        case 'waste':
          return <SustainabilityWasteTopSectionContainer />;
        case 'carbon':
          return <SustainabilityCarbonTopSectionContainer />;
      }
    } else if (selectedModule === 'security')
      switch (sidebarDetails.selectedId) {
        case 'home':
          return <SecurityHomeContainer />;
      }
  }, [currentDashboardProps.sidebar, selectedModule]);

  const renderSide = useCallback((): ReactNode => {
    const sidebarDetails = currentDashboardProps.sidebar;
    // if (isOpenLanding) return <Landing />;
    if (selectedModule === 'sustainability') {
      switch (sidebarDetails.selectedId) {
        case 'home':
          return <SustainabilityHomeSideSectionContainer />;
        case 'energy':
          return <SustainabilityEnergySideSectionContainer />;
        case 'water':
          return <SustainabilityWaterSideSectionContainer />;
        case 'waste':
          return <SustainabilityWasteSideSectionContainer />;
        case 'carbon':
          return <SustainabilityCarbonSideSectionContainer />;
      }
    } else if (selectedModule === 'security')
      switch (sidebarDetails.selectedId) {
        case 'home':
          return <SecurityHomeContainer />;
      }
  }, [currentDashboardProps.sidebar, selectedModule]);

  const renderBottom = useCallback((): ReactNode => {
    const sidebarDetails = currentDashboardProps.sidebar;
    // if (isOpenLanding) return <Landing />;
    if (selectedModule === 'sustainability') {
      switch (sidebarDetails.selectedId) {
        case 'home':
          return (
            <div style={styles.sustainabilityCollectedDataContainer}>
              <SustainabilityCollectedDataContainer />
            </div>
          );
        case 'energy':
          return building ? <></> : <SustainaibilityHeatmapContainer />;
        case 'water':
          return building ? <></> : <SustainaibilityHeatmapContainer />;
        case 'waste':
          return <></>;
        case 'carbon':
          return <></>;
      }
    } else if (selectedModule === 'security')
      switch (sidebarDetails.selectedId) {
        case 'home':
          return <SecurityHomeContainer />;
      }
  }, [currentDashboardProps.sidebar, selectedModule, styles.sustainabilityCollectedDataContainer, building]);

  return doneLoading ? (
    <div style={styles.container}>
      <div id="sidebar" style={styles.sidebar}>
        <SideBarContainer />
      </div>
      <div style={styles.main}>
        <div
          id="header"
          style={{
            ...styles.header
          }}
        >
          <HeaderContainer />
        </div>
        <div>
          <div style={styles.contentContainer}>
            <div style={styles.topSectionContainer}>
              <ModulesSwitcherContainer />
              <div style={styles.periodSelection}>
                <PeriodSelectionContainer />
              </div>
            </div>
            <div id="renderTop" style={styles.leftSectionContainer}>
              {renderTop()}
            </div>
            <div style={styles.rightSectionContainer}>{renderSide()}</div>
            {!mobileMode && <MapContainer style={mapContainerStyle} mapStyle={styles.mapStyle} />}
          </div>
          {!mobileMode ? renderBottom() : ''}
          {isAirQualityDrillDownOpened && access?.mapType === 1 && <AirQualityDrillDownContainer />}
          {districtPvProductionChart && filter && (filter === 'year' || filter === 'month') && <CEDrillDownContainer />}
        </div>
        {isBuildingComparisonOpened && <BuildingComparisonContainer />}
        {building && showBuildingDetails && <BuildingDetailsContainer />}
      </div>
      <ActionSlider />
      <MultiWindowModal />
    </div>
  ) : (
    <LoaderFull />
  );
};
