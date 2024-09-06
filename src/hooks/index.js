import {useState, useCallback, useRef, useMemo} from 'react';
import {errorNotification} from '../components/Utils/Notifications';
import moment from 'moment-mini';

const useFetch = (cb, ...params) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(undefined);
  const isMountedRef = useRef(null);
  return {
    isLoading,
    response,
    isMountedRef,
    reset: () => {
      setResponse(undefined);
      setIsLoading(false);
    },
    fetch: async (reload = false, useLoading = true) => {
      try {
        if (!isMountedRef.current) isMountedRef.current = true;
        if ((!response || reload) && useLoading) setIsLoading(true);
        const data = await cb(...params);
        if (isMountedRef.current) {
          if (data) {
            setResponse(Array.isArray(data) ? [...data] : {...data});
          } else setResponse();
        }
      } catch (e) {
        console.log('useFetch', e);
        errorNotification(e);
        if (isMountedRef.current) setResponse();
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    }
  };
};
const useChartFilter = () => {
  const chart = useRef();
  return {
    setChart: useCallback((e) => (chart.current = e), []),
    onClick: useCallback((name) => {
      chart.current.series.forEach((f) => {
        if (chart.current.filterBy && chart.current.filterBy === name) {
          f.setVisible(true);
        } else {
          if (name !== f.name) f.setVisible(false);
          else f.setVisible(true);
        }
      });
      if (!chart.current.filterBy || chart.current.filterBy !== name) {
        chart.current.filterBy = name;
      } else {
        chart.current.filterBy = undefined;
      }
    }, [])
  };
};

const useFilterCategory = (startDate, filter, condensed = false) => {
  const getFilter = useMemo(() => {
    let data = [];
    switch (filter) {
      case 'month':
      case 'year':
        for (let i = 0; i < 12; i++) {
          if (condensed) {
            data.push(moment(startDate).add(i, 'months').format('MMM'));
          } else {
            data.push(moment(startDate).add(i, 'months').format('MMM-YYYY'));
          }
        }
        break;
      case 'week':
        for (let i = 0; i < 14; i++) {
          let week = moment(startDate, 'YYYY-MM-DD').add(i, 'weeks').week();
          let yM = moment(startDate, 'YYYY-MM-DD').add(i, 'week').format('MMM-YYYY');
          if (condensed) {
            data.push('W ' + week);
          } else {
            data.push('week ' + week + '-' + yM);
          }
        }
        break;
      case 'day':
        for (let i = 0; i < 14; i++) {
          let day = moment(startDate).add(i, 'days');
          if (condensed) {
            day = day.format('DD-MM');
          } else {
            day = day.format('DD-MMM-YYYY');
          }
          data.push(day);
        }
        break;
      default:
        break;
    }
    return data;
  }, [startDate, filter, condensed]);
  return getFilter;
};

export default useFetch;
export {useChartFilter, useFilterCategory};
