import React, {useCallback, useEffect, useState} from 'react';
import {SideBar, sideBarListIds, SideBarListItemId} from '../../components/Dashboard/SideBar';
import {
  setSelectedDashboard,
  setSelectedTrendLineOrBreakdown,
  buildingSelection,
  setShowAirQuality,
  setIsBuildingComparisonOpened,
  setShowAlarms,
  wasteLocationSelection,
  setOpenLanding,
  setDistrictPvProductionChart,
  setIsAirQualityDrillDownOpened,
  toggleMultiWindowModal,
  toggleActionSlider
  // @ts-ignore
} from '../../reduxStore/actions';
import {useSelector, useDispatch} from 'react-redux';
//@ts-ignore
import {logoutUserRequest} from '../../services/auth';
import {errorNotification, ErrorNotification} from '../../components/Utils/Notifications';
//@ts-ignore
import {Profile, DistrictSelect} from '../../components/SideBar';

export const SideBarContainer = () => {
  const dispatch = useDispatch();
  const currentDashboardProps = useSelector((s: any) => s.dashboard.currentDashboardProps);
  const {selectedModule, actionSlider} = useSelector((s: any) => s.dashboard);
  const {showAirQuality, showAlarms, district} = useSelector((s: any) => s.map);
  const sidebarDetails = currentDashboardProps.sidebar;
  const [showProfile, setShowProfile] = useState(false);
  const [showDistricts, setShowDistricts] = useState(false);
  const [topList, setTopList] = useState<SideBarListItemId[]>([]);
  const [bottomList, setBottomList] = useState<SideBarListItemId[]>([]);
  const {kpi: access, alarms, multiWindows} = useSelector((s: any) => s.user.access);

  const hasAlarmsAccess = alarms?.includes(district);
  const hasMultiWindowsAccess = multiWindows?.includes(district);

  useEffect(() => {
    const TOP_LIST: SideBarListItemId[] = [];
    // TOP_LIST.push(sideBarListIds.landing as SideBarListItemId);
    TOP_LIST.push(sideBarListIds.home as SideBarListItemId);
    switch (selectedModule) {
      case 'sustainability':
        if (access['energy']?.some((b: any) => b.district_id === district)) {
          TOP_LIST.push(sideBarListIds.energy as SideBarListItemId);
        }
        if (access['water']?.some((b: any) => b.district_id === district)) {
          TOP_LIST.push(sideBarListIds.water as SideBarListItemId);
        }
        if (access['waste']?.some((b: any) => b.district_id === district)) {
          TOP_LIST.push(sideBarListIds.waste as SideBarListItemId);
        }
        if (access['carbon']?.some((b: any) => b.district_id === district)) {
          TOP_LIST.push(sideBarListIds.carbon as SideBarListItemId);
        }
        setTopList(TOP_LIST);
        break;
      case 'security':
        setTopList(TOP_LIST);
        break;
      case 'mobility':
        setTopList(TOP_LIST);
        break;
    }

    const BOTTOM_LIST: SideBarListItemId[] = [];
    // BOTTOM_LIST.push(sideBarListIds.weather as SideBarListItemId)
    if (hasMultiWindowsAccess) BOTTOM_LIST.push(sideBarListIds.multiWindow as SideBarListItemId);
    BOTTOM_LIST.push(sideBarListIds.profile as SideBarListItemId);
    // BOTTOM_LIST.push(sideBarListIds.districts as SideBarListItemId)
    if (hasAlarmsAccess) BOTTOM_LIST.push(sideBarListIds.alarms as SideBarListItemId);
    BOTTOM_LIST.push(sideBarListIds.logout as SideBarListItemId);
    setBottomList(BOTTOM_LIST);
  }, [district, access, hasMultiWindowsAccess, hasAlarmsAccess, selectedModule]);

  const logout = useCallback(async () => {
    try {
      await logoutUserRequest();
    } catch (error) {
      errorNotification(error as ErrorNotification);
    }
  }, []);

  const onProfileClick = useCallback(() => {
    setShowProfile((prev) => !prev);
  }, []);

  const onDistrictsClick = useCallback(() => {
    setShowDistricts((prev) => !prev);
  }, []);

  const onItemClick = useCallback(
    (id: SideBarListItemId) => {
      switch (id) {
        case 'home':
          dispatch(buildingSelection());
          dispatch(setIsAirQualityDrillDownOpened(false));
          dispatch(wasteLocationSelection());
          dispatch(setSelectedDashboard(id));
          dispatch(setSelectedTrendLineOrBreakdown(''));
          dispatch(setIsBuildingComparisonOpened(false));
          dispatch(setShowAirQuality(true));
          dispatch(setDistrictPvProductionChart(null));
          if (actionSlider.open) dispatch(toggleActionSlider());
          break;
        case 'energy':
          dispatch(buildingSelection());
          dispatch(setIsAirQualityDrillDownOpened(false));
          dispatch(wasteLocationSelection());
          dispatch(setSelectedDashboard(id));
          dispatch(setSelectedTrendLineOrBreakdown(null));
          dispatch(setIsBuildingComparisonOpened(false));
          dispatch(setShowAirQuality(false));
          dispatch(setDistrictPvProductionChart(null));
          if (actionSlider.open) dispatch(toggleActionSlider());
          break;
        case 'water':
          dispatch(buildingSelection());
          dispatch(setIsAirQualityDrillDownOpened(false));
          dispatch(wasteLocationSelection());
          dispatch(setSelectedDashboard(id));
          dispatch(setSelectedTrendLineOrBreakdown(null));
          dispatch(setIsBuildingComparisonOpened(false));
          dispatch(setShowAirQuality(false));
          dispatch(setDistrictPvProductionChart(null));
          if (actionSlider.open) dispatch(toggleActionSlider());
          break;
        case 'carbon':
          dispatch(buildingSelection());
          dispatch(setIsAirQualityDrillDownOpened(false));
          dispatch(wasteLocationSelection());
          dispatch(setSelectedDashboard(id));
          dispatch(setSelectedTrendLineOrBreakdown(null));
          dispatch(setIsBuildingComparisonOpened(false));
          dispatch(setShowAirQuality(false));
          dispatch(setDistrictPvProductionChart(null));
          if (actionSlider.open) dispatch(toggleActionSlider());
          break;
        case 'waste':
          dispatch(buildingSelection());
          dispatch(setIsAirQualityDrillDownOpened(false));
          dispatch(wasteLocationSelection());
          dispatch(setSelectedDashboard(id));
          dispatch(setSelectedTrendLineOrBreakdown(null));
          dispatch(setIsBuildingComparisonOpened(false));
          dispatch(setShowAirQuality(false));
          dispatch(setDistrictPvProductionChart(null));
          if (actionSlider.open) dispatch(toggleActionSlider());
          break;
        case 'landing':
          dispatch(setOpenLanding(true));
          break;
        case 'weather':
          dispatch(setShowAirQuality(!showAirQuality));
          break;
        case 'profile':
          onProfileClick();
          break;
        case 'districts':
          onDistrictsClick();
          break;
        case 'multiWindow':
          dispatch(toggleMultiWindowModal());
          break;
        case 'logout':
          logout();
          break;
        case 'alarms':
          dispatch(setShowAlarms(!showAlarms));
          break;
      }
    },
    [dispatch, logout, onDistrictsClick, onProfileClick, showAirQuality, showAlarms, actionSlider]
  );

  let activeIds: SideBarListItemId[] = [];

  if (showAlarms) {
    activeIds.push(sidebarDetails.selectedId);
    activeIds.push(sideBarListIds.alarms as SideBarListItemId);
  } else {
    activeIds.push(sidebarDetails.selectedId);
  }

  return (
    <div>
      <SideBar show top={topList} bottom={bottomList} activeIds={activeIds} onClick={onItemClick} />
      <div>
        <Profile active={showProfile} click={onProfileClick} />
        <DistrictSelect active={showDistricts} click={onDistrictsClick} />
      </div>
    </div>
  );
};
