import {useEffect, useRef, useState} from 'react';
//@ts-ignore
import {getIsDistrictAggregating} from '../services/user';
import {useSelector} from 'react-redux';
import * as _ from 'lodash';

const useIsDistrictAggregating = () => {
  const {district} = useSelector((s: any) => s.map);
  const {access} = useSelector((s: any) => s.user);
  const firstRoleId = _.get(access?.roleDistricts, '[0].roleId', null);
  const [isAggregating, setIsAggregating] = useState(false);
  const prevIsAggregatingRef = useRef(isAggregating);

  useEffect(() => {
    const checkDistrictStatus = async () => {
      try {
        const result = await getIsDistrictAggregating(district, firstRoleId);
        const currentIsAggregating = result.isAggregating;

        if (!currentIsAggregating && prevIsAggregatingRef.current) {
          window.location.reload();
        } else {
          setIsAggregating(currentIsAggregating);
        }
        prevIsAggregatingRef.current = currentIsAggregating;
      } catch (error) {}
    };

    checkDistrictStatus();
    const intervalId = setInterval(checkDistrictStatus, 10000);

    return () => clearInterval(intervalId);
  }, [district, firstRoleId]);

  return isAggregating;
};

export default useIsDistrictAggregating;
