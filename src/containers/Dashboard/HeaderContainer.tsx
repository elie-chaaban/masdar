import React, {useState, useEffect, useMemo} from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {Header} from '../../components/Dashboard/Header';
import {SideBarListItemId} from '../../components/Dashboard/SideBar';
// @ts-ignore
import {selectThemeImages} from '../../reduxStore/selectors';
import {ModuleListItemId} from '../../components/Dashboard/ModulesSwitcher';
import useIsDistrictAggregating from '../../hooks/useIsDistrictAggregating';

export const moduleHeaderTitles: {[key in ModuleListItemId]: string} = {
  sustainability: 'SMART SUSTAINABILITY',
  security: 'SMART SECURITY',
  mobility: 'SMART MOBILITY'
};

export const headerTitles: {[key in SideBarListItemId]: string} = {
  home: 'CITY VIEW',
  energy: 'ENERGY',
  water: 'WATER',
  waste: 'WASTE',
  carbon: 'CARBON FOOTPRINT',
  weather: 'weather',
  profile: 'profile',
  landing: 'landing',
  districts: 'districts',
  multiWindow: 'multiWindow',
  logout: 'logout',
  alarms: 'alarms'
};

export const HeaderContainer = () => {
  const {logoUrl, headerImageUrl} = useSelector(selectThemeImages) as any;
  const {currentDashboardProps, selectedModule} = useSelector((s: any) => s.dashboard, shallowEqual);
  const {buildings, districtInfo, building, wasteLocations, wasteLocation} = useSelector((s: any) => s.map);
  const insight = useSelector((s: any) => s.dashboard.insight);
  const [headerTitle, setHeaderTitle] = useState(headerTitles.home);
  const isAggregating = useIsDistrictAggregating();

  useEffect(() => {
    let title = '';
    const headerDetails = currentDashboardProps.header;
    if (headerDetails) {
      if ((headerDetails.titleId as SideBarListItemId) === 'home') {
        title = `${districtInfo?.name.toUpperCase()} ${headerTitles[headerDetails.titleId as SideBarListItemId]} | ${
          moduleHeaderTitles[selectedModule as ModuleListItemId]
        }`;
      } else {
        if (!building) {
          title = `${districtInfo?.name.toUpperCase()} | ${moduleHeaderTitles[selectedModule as ModuleListItemId]} | ${
            headerTitles[headerDetails.titleId as SideBarListItemId]
          }`;
        } else {
          const foundBuilding = buildings.find((b: any) => b.id === building);
          if (foundBuilding) {
            title = `${foundBuilding?.name?.toUpperCase()}  | ${moduleHeaderTitles[selectedModule as ModuleListItemId]}`;
          }
        }
      }
    }
    setHeaderTitle(title);
  }, [currentDashboardProps, selectedModule, districtInfo, buildings, building, insight, wasteLocation, wasteLocations]);

  return <Header headerImage={logoUrl} title={headerTitle} headerBackgroundImage={headerImageUrl} isAggregating={isAggregating} />;
};
