import {useCallback, useEffect, useState} from 'react';
// @ts-ignore
import {useDispatch} from 'react-redux';
// @ts-ignore
import {setOpenLanding} from '../reduxStore/actions';
const domEvents = ['click', 'scroll', 'keypress', 'mousemove'];

const IDLE_TIMEOUT = 600000; // 10 minutes

const useIdleTimeoutHandler = () => {
  const dispatch = useDispatch();
  const [reset, setReset] = useState(Date.now());

  const resetFn = useCallback(() => {
    setReset(Date.now());
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(setOpenLanding(true));
    }, IDLE_TIMEOUT);

    return clearTimeout.bind(null, id);
  }, [dispatch, reset]);

  useEffect(() => {
    domEvents.forEach((event) => document.addEventListener(event, resetFn));
    return () => {
      domEvents.forEach((event) => document.removeEventListener(event, resetFn));
    };
  }, [resetFn]);
};

export default useIdleTimeoutHandler;
