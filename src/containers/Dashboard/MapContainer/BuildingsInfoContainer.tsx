import React, {useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
// @ts-ignore
import {setActiveBuildingInfoId} from '../../../reduxStore/actions';
import {BuildingInfoMarker} from '../../../components/Dashboard/Map/Markers';
import {PointLike} from 'mapbox-gl';
import useBuildingsInfoData, {BuildingInfoDetailsRow} from '../../../hooks/useBuildingsInfoData';

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

export const BuildingsInfoContainer = (): JSX.Element => {
  const dispatch = useDispatch();
  const {buildingsInfo, activeBuildingInfoId, buildingsInfoLoading} = useSelector((s: any) => s.map);
  const {getRows} = useBuildingsInfoData();

  const onMouseEnter = useCallback(
    (id: string) => {
      dispatch(setActiveBuildingInfoId(id));
    },
    [dispatch]
  );

  const onMouseLeave = useCallback(
    (id: string) => {
      dispatch(setActiveBuildingInfoId(null));
    },
    [dispatch]
  );

  return buildingsInfo?.map((bi: BuildingInfo) => (
    <BuildingInfoMarker
      key={`building-info-marker-${bi.id}`}
      id={bi.id}
      longitude={bi.longitude}
      latitude={bi.latitude}
      offset={bi.offset}
      anchor="center"
      active={bi.id === activeBuildingInfoId}
      rows={getRows(bi)}
      loading={buildingsInfoLoading}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      buildingName={bi.name}
    />
  ));
};
