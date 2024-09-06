import apiInstance from '../../api/authenticatedApi';
import LocalStorageService from '../LocalStorage';
import {logoutActions} from '../../reduxStore/actions';
import {default as store} from '../../reduxStore';
import {db} from '../../db';

const TokenService = LocalStorageService.getService();

const DistrictSectionType = {
  Insights: 0,
  BAReports: 1,
  Reports: 2,
  LightPole: 3,
  IntersectionData: 4,
  EnergyAnalysis: 5,
  AssetsAnalysis: 6,
  MultiWindow: 7,
  Alarms: 8,
  PvProduction: 9
};

const loginUser = async () => {
  try {
    window.location.href = `${process.env['REACT_APP_AUTH_ENDPOINT']}auth/authorize?resource=${process.env['REACT_APP_AUTH_RESOURCE']}`;
  } catch (error) {
    throw error;
  }
};

const saveLoggedInUser = async (data) => {
  try {
    await TokenService.setToken(data);
  } catch (error) {
    throw error;
  }
};

const logoutUserRequest = async () => {
  try {
    await db.delete();
    window.location.href = `${process.env['REACT_APP_FE_HOST']}/logout`;
  } catch (error) {
    throw error;
  }
};

const logoutUser = async () => {
  try {
    store.dispatch(logoutActions());
  } catch (error) {
    throw error;
  }
};

const getUserRoleDetails = async () => {
  try {
    const tokenSet = await TokenService.getTokenSet();
    // const userInfo = JSON.parse(Buffer.from(tokenSet.id_token.split('.')[1], 'base64').toString());
    const {data: user} = await apiInstance.get(`users/user-by-email?Email=${tokenSet.email}`);
    if (user.userRoles.length === 0) {
      return;
    }
    TokenService.setUserId(user.id);
    const {data: modulesData} = await apiInstance.get(`users/module?MaxResultCount=1000`);
    // const {data: owner} = await apiInstance.get(`users/owner/${user.ownerId}`);
    const modules = modulesData.items;
    const userRole = user.userRoles[0].role;
    const kpi = setRolesFront(modules, userRole);
    const access = setAccess(userRole);
    const roleDistrictSectionAccesses = userRole.roleDistrictSectionAccesses.filter((i) => i.isActive === true);
    const reports = setReportsRoles(modules, roleDistrictSectionAccesses);
    const energyAnalysis = setEnergyAnalysisRoles(roleDistrictSectionAccesses);
    const assetsAnalysis = setAssetsAnalysisRoles(roleDistrictSectionAccesses);
    const BAReports = setBAReportsRoles(roleDistrictSectionAccesses);
    const insights = setInsightsRoles(roleDistrictSectionAccesses);
    const lightPoles = setLightPoleRoles(roleDistrictSectionAccesses);
    const alarms = setAlarmsRoles(roleDistrictSectionAccesses);
    const multiWindows = setMultiWindowRoles(roleDistrictSectionAccesses);
    const interSectionData = setIntersectionData(roleDistrictSectionAccesses);
    const pvProduction = setPvProductionRoles(roleDistrictSectionAccesses);
    const stylingTemplate = user.userRoles[0].role.owner.ownerConfiguration.stylingTemplate;
    const darkStylingTemplate = user.userRoles[0].role.owner.ownerConfiguration.darkStylingTemplate;
    const ownerTheme = user.userRoles[0].role.owner.ownerConfiguration.ownerTheme;
    const ownerChartConfigurations = user.userRoles[0].role.owner.ownerChartConfigurations;
    const roleZones = userRole.roleZones;
    const roleDistricts = userRole.roleDistricts;
    return {
      mapboxAccessToken: user.userRoles[0].role.owner.ownerConfiguration.mapboxAccessToken,
      mapboxStyleUrl: user.userRoles[0].role.owner.ownerConfiguration.styleUrl,
      mapType: user.userRoles[0].role.owner.ownerConfiguration.mapType ?? 0,
      esriApiKey: user.userRoles[0].role.owner.ownerConfiguration.esriApiKey,
      esriWebScenePortalId: user.userRoles[0].role.owner.ownerConfiguration.esriWebScenePortalId,
      esriWebSceneBaseMap: user.userRoles[0].role.owner.ownerConfiguration.esriWebSceneBaseMap,
      lightPoles,
      BAReports,
      insights,
      reports,
      kpi,
      stylingTemplate,
      interSectionData,
      energyAnalysis,
      assetsAnalysis,
      access,
      alarms,
      multiWindows,
      ownerTheme,
      darkStylingTemplate,
      pvProduction,
      roleZones,
      roleDistricts,
      ownerChartConfigurations
    };
  } catch (error) {
    throw error;
  }
};

const setBAReportsRoles = (roleDistrictSectionAccesses) => {
  let bareportsAccesses = roleDistrictSectionAccesses.filter((a) => a.sectionType === DistrictSectionType.BAReports);
  bareportsAccesses = bareportsAccesses.map((a) => a.districtId);
  return bareportsAccesses;
};

const setInsightsRoles = (roleDistrictSectionAccesses) => {
  let insightsAccesses = roleDistrictSectionAccesses.filter((a) => a.sectionType === DistrictSectionType.Insights);
  insightsAccesses = insightsAccesses.map((a) => a.districtId);
  return insightsAccesses;
};

const setLightPoleRoles = (roleDistrictSectionAccesses) => {
  let lightPoleAccesses = roleDistrictSectionAccesses.filter((a) => a.sectionType === DistrictSectionType.LightPole);
  lightPoleAccesses = lightPoleAccesses.map((a) => a.districtId);
  return lightPoleAccesses;
};

const setIntersectionData = (roleDistrictSectionAccesses) => {
  let interSectionDataAccesses = roleDistrictSectionAccesses.filter((a) => a.sectionType === DistrictSectionType.IntersectionData);
  interSectionDataAccesses = interSectionDataAccesses.map((a) => a.districtId);
  return interSectionDataAccesses;
};

const setReportsRoles = (modules, roleDistrictSectionAccesses) => {
  const reportsAccesses = roleDistrictSectionAccesses.filter((a) => a.sectionType === DistrictSectionType.Reports);
  const reports = {};
  modules.forEach((module) => {
    const districtIds = reportsAccesses.filter((a) => a.moduleId === module.id).map((a) => a.districtId);
    reports[module.name.toLowerCase()] = districtIds;
  });
  return reports;
};

const setEnergyAnalysisRoles = (roleDistrictSectionAccesses) => {
  let energyAnalysisAccesses = roleDistrictSectionAccesses.filter((a) => a.sectionType === DistrictSectionType.EnergyAnalysis);
  energyAnalysisAccesses = energyAnalysisAccesses.map((a) => a.districtId);
  return energyAnalysisAccesses;
};

const setAssetsAnalysisRoles = (roleDistrictSectionAccesses) => {
  let assetsAnalysisAccesses = roleDistrictSectionAccesses.filter((a) => a.sectionType === DistrictSectionType.AssetsAnalysis);
  assetsAnalysisAccesses = assetsAnalysisAccesses.map((a) => a.districtId);
  return assetsAnalysisAccesses;
};

const setMultiWindowRoles = (roleDistrictSectionAccesses) => {
  let multiWindowAccesses = roleDistrictSectionAccesses.filter((a) => a.sectionType === DistrictSectionType.MultiWindow);
  multiWindowAccesses = multiWindowAccesses.map((a) => a.districtId);
  return multiWindowAccesses;
};

const setAlarmsRoles = (roleDistrictSectionAccesses) => {
  let alarmsAccesses = roleDistrictSectionAccesses.filter((a) => a.sectionType === DistrictSectionType.Alarms);
  alarmsAccesses = alarmsAccesses.map((a) => a.districtId);
  return alarmsAccesses;
};

const setPvProductionRoles = (roleDistrictSectionAccesses) => {
  let pvProductionAccesses = roleDistrictSectionAccesses.filter((a) => a.sectionType === DistrictSectionType.PvProduction);
  pvProductionAccesses = pvProductionAccesses.map((a) => a.districtId);
  return pvProductionAccesses;
};

const setRolesFront = (modules, userRole) => {
  const moduleRoles = {};
  let userBuildings = [];
  if (userRole.roleBuildings) {
    userRole.roleBuildings.forEach((r) => {
      userBuildings.push({
        building_id: r.buildingId,
        buildingName: r.building.name,
        district_id: r.building.districtId,
        districtName: r.building.district.name
      });
    });
  }
  modules.forEach((module) => {
    if (userRole.roleModules.find((rm) => rm.moduleId === module.id)) {
      moduleRoles[module.name.toLowerCase()] = userBuildings;
    }
  });

  return moduleRoles;
};

const setAccess = (userRole) => {
  const access = {
    districts: [],
    buildings: [],
    floors: [],
    zones: []
  };
  if (userRole.roleDistricts) {
    userRole.roleDistricts.forEach((r) => {
      access.districts.push(r.districtId);
    });
  }
  if (userRole.roleBuildings) {
    userRole.roleBuildings.forEach((r) => {
      access.buildings.push(r.buildingId);
    });
  }
  if (userRole.roleFloors) {
    userRole.roleFloors.forEach((r) => {
      access.floors.push(r.floorId);
    });
  }
  if (userRole.roleZones) {
    userRole.roleZones.forEach((r) => {
      access.zones.push(r.zoneId);
    });
  }

  return access;
};
export {loginUser, saveLoggedInUser, logoutUserRequest, logoutUser, getUserRoleDetails};
