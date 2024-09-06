import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ModulesSwitcher, {moduleIds, ModuleListItemId} from '../../components/Dashboard/ModulesSwitcher/ModulesSwitcher';

import {
  setSelectedModule,
  setSelectedDashboard,
  setSelectedTrendLineOrBreakdown,
  buildingSelection,
  setShowAirQuality,
  setIsBuildingComparisonOpened,
  wasteLocationSelection,
  setDistrictPvProductionChart,
  setIsAirQualityDrillDownOpened,
  setModulesAccess
  // @ts-ignore
} from '../../reduxStore/actions';

const ModulesSwitcherContainer = () => {
  const {selectedModule} = useSelector((s: any) => s.dashboard);
  const dispatch = useDispatch();

  const [modules, setModules] = useState<ModuleListItemId[]>([]);
  const {district} = useSelector((s: any) => s.map);
  const access = useSelector((s: any) => s.user.access.kpi);

  const hasEnergyAccess = access['energy']?.some((b: any) => b.district_id === district);
  const hasWaterAccess = access['water']?.some((b: any) => b.district_id === district);
  const hasWasteAccess = access['waste']?.some((b: any) => b.district_id === district);
  const hasCarbonAccess = access['carbon']?.some((b: any) => b.district_id === district);

  const hasSecurityAccess = access['security']?.some((b: any) => b.district_id === district);

  const hasSustainabilityAccess = hasEnergyAccess || hasWaterAccess || hasWasteAccess || hasCarbonAccess;
  const hasMobilityAccess = false;
  useEffect(() => {
    const accessModules: ModuleListItemId[] = [];
    if (hasSustainabilityAccess) accessModules.push(moduleIds.sustainability as ModuleListItemId);
    if (hasSecurityAccess) accessModules.push(moduleIds.security as ModuleListItemId);
    if (hasMobilityAccess) accessModules.push(moduleIds.mobility as ModuleListItemId);
    dispatch(setModulesAccess(accessModules));
    setModules(accessModules);
  }, [hasSustainabilityAccess, hasSecurityAccess, hasMobilityAccess, dispatch]);

  const onItemClick = useCallback(
    (id: ModuleListItemId) => {
      dispatch(setSelectedModule(id));
      dispatch(buildingSelection());
      dispatch(setIsAirQualityDrillDownOpened(false));
      dispatch(wasteLocationSelection());
      dispatch(setSelectedDashboard('home'));
      dispatch(setSelectedTrendLineOrBreakdown(''));
      dispatch(setIsBuildingComparisonOpened(false));
      dispatch(setShowAirQuality(true));
      dispatch(setDistrictPvProductionChart(null));
    },
    [dispatch]
  );

  useEffect(() => {
    if (!hasSustainabilityAccess && selectedModule === 'sustainability') {
      if (hasSecurityAccess) onItemClick('security');
    }
  }, [modules, hasSustainabilityAccess, hasSecurityAccess, selectedModule, onItemClick]);

  if (modules.length <= 1) return <></>;
  return <ModulesSwitcher modules={modules} onClick={onItemClick} activeId={selectedModule} />;
};

export default ModulesSwitcherContainer;
