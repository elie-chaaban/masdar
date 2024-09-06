import {useCallback, useEffect} from 'react';
// @ts-ignore
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
// @ts-ignore
import {Intensity, TrendLineOrBreakdown, UnitFormat, unitFormatter, valueFormatter} from '../utils/dashboard';
// @ts-ignore
import {setBuildingsInfoLoading, setBuildingsInfo} from '../reduxStore/actions';
//@ts-ignore
import {fetchTotalEnergyConsumption, fetchCarbonEmissionAndTrendLine, fetchEnergySavings} from '../services/energy';
//@ts-ignore
import {fetchWaterDashboard, fetchWaterSavings, fetchWaterCarbonEmissionAndTrendLine} from '../services/water';
//@ts-ignore
import {fetchWasteCarbonEmissionAndTrendLine} from '../services/waste';
import {PointLike} from 'mapbox-gl';

export interface BuildingInfo {
  id: string;
  name: string;
  active: boolean;
  longitude: number;
  latitude: number;
  offset: PointLike;
  carsEmissionsRemoved: number;
  carbonFootprint: string;
  carbonFootprintUnit: string;
  energyConsumptionValue: string;
  energyConsumptionValueUnit: string;
  waterConsumptionValue: string;
  waterConsumptionValueUnit: string;
}

export interface BuildingInfoDetailsRow {
  label: string;
  value: number | string;
}

const useBuildingsInfoData = () => {
  const dispatch = useDispatch();
  const {buildings, district} = useSelector((s: any) => s.map);
  const {filter, startDate, endDate} = useSelector((s: any) => s.dashboard.dateFilter, shallowEqual);

  const access = useSelector((s: any) => s.user.access.kpi);
  const hasEnergyAccess = access['energy']?.some((b: any) => b.district_id === district);
  const hasWaterAccess = access['water']?.some((b: any) => b.district_id === district);
  const hasCarbonAccess = access['carbon']?.some((b: any) => b.district_id === district);
  const hasWasteAccess = access['waste']?.some((b: any) => b.district_id === district);

  const fetchBuildingsInfo = async () => {
    if (buildings?.length) {
      dispatch(setBuildingsInfoLoading(true));
      const buildingsInfo: BuildingInfo[] = [];
      const promises = buildings
        ?.filter((b: any) => b.hasData)
        .map(async (b: any) => {
          //Consumptions
          const energyConsumption = hasEnergyAccess
            ? await fetchTotalEnergyConsumption(filter, startDate, endDate, district, b.id)
            : {kwh: 0};
          const water = hasWaterAccess ? await fetchWaterDashboard(filter, startDate, endDate, district, b.id) : {kwh: 0};
          //Cars emissions
          const energySavings = hasEnergyAccess ? await fetchEnergySavings(filter, startDate, endDate, district, b.id) : {carsSaved: 0};
          const waterSavings = hasWaterAccess ? await fetchWaterSavings(filter, startDate, endDate, district, b.id) : {carsSaved: 0};

          //Carbon Footprint
          const energyCarbonEmission =
            hasCarbonAccess && hasEnergyAccess
              ? await fetchCarbonEmissionAndTrendLine(filter, startDate, endDate, district, b.id)
              : {value: 0};
          const waterCarbonEmission =
            hasCarbonAccess && hasWaterAccess
              ? await fetchWaterCarbonEmissionAndTrendLine(filter, startDate, endDate, district, b.id)
              : {value: 0};
          const wasteCarbonEmission =
            hasCarbonAccess && hasWasteAccess
              ? await fetchWasteCarbonEmissionAndTrendLine(filter, startDate, endDate, district, b.id)
              : {value: 0};

          const carsEmissionsRemoved = (energySavings?.carsSaved || 0) + (waterSavings?.carsSaved || 0);
          const carbonFootprint = valueFormatter(
            TrendLineOrBreakdown.CARBON,
            (energyCarbonEmission?.value || 0) + (waterCarbonEmission?.value || 0) + (wasteCarbonEmission?.value || 0),
            UnitFormat.String
          );
          const energyConsumptionValue = valueFormatter(Intensity.ENERGY_INTENSITY, energyConsumption?.kwh, UnitFormat.String);
          const waterConsumptionValue = valueFormatter(Intensity.WATER_INTENSITY, water?.kwh, UnitFormat.String);

          buildingsInfo.push({
            id: b.id,
            name: b.name,
            active: false,
            longitude: parseFloat(b.alarmLongitude),
            latitude: parseFloat(b.alarmLatitude),
            offset: [-18, -60],
            carsEmissionsRemoved,
            carbonFootprint: carbonFootprint as string,
            carbonFootprintUnit: unitFormatter(
              TrendLineOrBreakdown.CARBON,
              (energyCarbonEmission?.value || 0) + (waterCarbonEmission?.value || 0) + (wasteCarbonEmission?.value || 0)
            ),
            energyConsumptionValue: energyConsumptionValue as string,
            energyConsumptionValueUnit: unitFormatter(Intensity.ENERGY_INTENSITY, energyConsumption?.kwh),
            waterConsumptionValue: waterConsumptionValue as string,
            waterConsumptionValueUnit: unitFormatter(Intensity.WATER_INTENSITY, water?.kwh)
          });
        });
      await Promise.all(promises);
      dispatch(setBuildingsInfo(JSON.parse(JSON.stringify(buildingsInfo))));
      dispatch(setBuildingsInfoLoading(false));
    }
  };

  const getRows = useCallback(
    (buildingInfo: BuildingInfo): BuildingInfoDetailsRow[] => {
      const rows: BuildingInfoDetailsRow[] = [];
      //CAR EMISSIONS REMOVED
      if (hasWaterAccess || hasEnergyAccess) rows.push({label: 'Cars Removed', value: buildingInfo.carsEmissionsRemoved});
      //CARBON FOOTPRINT
      if (hasCarbonAccess && (hasEnergyAccess || hasWaterAccess || hasWasteAccess))
        rows.push({
          label: `Carbon FootPrint (${buildingInfo.carbonFootprintUnit})`,
          value: buildingInfo.carbonFootprint
        });
      //ENERGY CONSUMPTION (KWh/SQM)
      if (hasEnergyAccess)
        rows.push({
          label: `Energy Consumption (${buildingInfo.energyConsumptionValueUnit})`,
          value: buildingInfo.energyConsumptionValue
        });
      //WATER CONSUMPTION (L/SQM)
      if (hasWaterAccess)
        rows.push({
          label: `Water Consumption (${buildingInfo.waterConsumptionValueUnit})`,
          value: buildingInfo.waterConsumptionValue
        });
      return rows;
    },
    [hasWaterAccess, hasEnergyAccess, hasCarbonAccess, hasWasteAccess]
  );

  return {getRows, fetchBuildingsInfo};
};

export default useBuildingsInfoData;
