import React, {useEffect, useState, useRef, MutableRefObject} from 'react';
import {useSelector} from 'react-redux';
// @ts-ignore
import {fetchFeatures, fetchBuildingsHeatmap} from '../../../services/dashBoard';
import {ErrorNotification, errorNotification} from '../../../components/Utils/Notifications';
import {HeatmapLayer} from '../../../components/Dashboard/Map/Layers';

export type HeatmapLayerRef = boolean;

export const HeatmapLayerContainer = (): JSX.Element => {
  const isMountedRef = useRef<HeatmapLayerRef>() as MutableRefObject<HeatmapLayerRef>;
  const {buildings, district, building} = useSelector((s: any) => s.map);
  const {insightType, dateFilter} = useSelector((s: any) => s.dashboard);
  const {filter, startDate, endDate} = dateFilter;
  const [features, setFeatures] = useState();
  const [geoJson, setGeoJson] = useState<string | null>();

  useEffect((): (() => void) => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  });

  useEffect(() => {
    const fetchFeature = async () => {
      try {
        const data = await fetchFeatures(buildings, 'heatmap');
        if (isMountedRef.current) setFeatures(data);
      } catch (error) {
        errorNotification(error as ErrorNotification);
      }
    };
    fetchFeature();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildings]);

  useEffect(() => {
    const fetchColors = async () => {
      setGeoJson(null); // to reset the heatmap colors every change of insightType
      try {
        const f = await fetchBuildingsHeatmap(filter, insightType, district, features, startDate, endDate);
        if (f && isMountedRef.current) setGeoJson(f);
      } catch (error) {
        errorNotification(error as ErrorNotification);
      }
    };
    if (insightType && features) fetchColors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insightType, dateFilter, features]);

  return geoJson && insightType && !building ? <HeatmapLayer geoJson={geoJson} /> : <></>;
};
