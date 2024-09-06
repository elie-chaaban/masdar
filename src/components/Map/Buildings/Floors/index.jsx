import React, {useEffect, useState, useRef, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {fetchFloorsHeatmap} from '../../../../services/dashBoard';
import {errorNotification} from '../../../Utils/Notifications';
import SelectedFloor from './SelectedFloor';
import BuildingFloors from './BuildingFloors';

const Floors = () => {
  const {insight, dateFilter} = useSelector((s) => s.dashboard);
  const {filter, startDate, endDate} = dateFilter;
  const {buildings, building, isLoadingFloors, floor} = useSelector((s) => s.map);
  const selectBuilding = buildings.find((b) => b.id === building);
  const [floors, setFloors] = useState();
  const show = floors && !isLoadingFloors;
  const isMountedRef = useRef();
  const selectedFloor = useMemo(
    () => (floors && floor ? floors.features.find((f) => f.properties.floor === floor) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [floors, floor]
  );

  useEffect(
    () => {
      const fetchFloors = async () => {
        try {
          const data = await fetchFloorsHeatmap(selectBuilding, filter, startDate, endDate, insight);
          if (isMountedRef) setFloors(data);
        } catch (error) {
          errorNotification(error);
        }
      };
      fetchFloors();
      return () => (isMountedRef.current = false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [building, dateFilter, insight]
  );
  return show ? (
    <>
      <BuildingFloors feature={floors} />
      {selectedFloor && <SelectedFloor feature={selectedFloor} />}
    </>
  ) : null;
};
export default React.memo(Floors);
