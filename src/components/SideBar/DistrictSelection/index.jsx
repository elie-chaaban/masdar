import React, {useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import DistrictInfo from './DistrictInfo';
import {fetchDistrictsInfo} from '../../../services/dashBoard';
import './style.scss';
import useFetch from '../../../hooks';
import Loader from '../../Utils/Loader';
import {Animate} from '../../Utils';

const DistrictSelect = ({active, click}) => {
  const {districts, district, districtsData} = useSelector((s) => s.map);
  const {startDate, endDate} = useSelector((s) => s.dashboard.dateFilter);
  const {response, isLoading, fetch, isMountedRef} = useFetch(fetchDistrictsInfo, startDate, endDate, districts, districtsData);
  const close = useCallback(() => click('district'), [click]);

  useEffect(() => {
    fetch();
    return () => (isMountedRef.current = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Animate options={{duration: 500}} className="district-selection" enter={active} unMountOnExit>
      <h5 className="title">Select District</h5>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="district-card-container">
          {response &&
            response.map((d, key) => (
              <DistrictInfo onClick={close} active={district === d.info.info.id} district={d} key={d.info.info.id} />
            ))}
        </div>
      )}
    </Animate>
  );
};

export default DistrictSelect;
