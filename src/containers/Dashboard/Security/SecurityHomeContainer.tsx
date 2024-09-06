import React, {useCallback, useEffect, useState} from 'react';
import {
  FrequencyOfOccurence,
  RealtimeOperationalSummary,
  ResponseEfficiency,
  SecurityIncidentsBySeverity
} from '../../../components/Dashboard/SecurityTotalConsumptionCard';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
//@ts-ignore
import useFetch from '../../../hooks';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';
import {shallowEqual, useSelector} from 'react-redux';
import {
  fetchRealTimeOperations,
  fetchFrequencyOfOccurence,
  fetchAcknowledgmentTime,
  fetchSecurityIncidentsCountBySeverity
  //@ts-ignore
} from '../../../services/security';
import {Text} from '../../../components/Common/Text';
import {SecurityHomeTabsContainer} from './SecurityHomeTabsContainer';
import {SecurityStream} from '../../../components/Dashboard/SecurityStream';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    height: '100%',
    width: '100%'
  },
  top: {
    ...spacing.flexHorizontally,
    justifyContent: 'space-evenly',
    width: '100%',
    columnGap: 8,
    maxHeight: 220,
    marginBottom: 8
  },
  bottom: {
    ...spacing.flexHorizontally,
    flex: 0,
    justifyContent: 'flex-start',
    borderRadius: 9,
    padding: 8,
    backgroundColor: colors.white
  },
  cameraContainer: {
    textAlign: 'center',
    width: 580,
    marginRight: 20
  }
}));

export const SecurityHomeContainer = () => {
  const {filter, startDate, endDate} = useSelector((s: any) => s.dashboard.dateFilter, shallowEqual);
  const {streamCameras} = useSelector((s: any) => s.dashboard);
  const {floor, building, district, districtInfo} = useSelector((s: any) => s.map);
  const accessModules = useSelector((s: any) => s.user.access.modules);
  const realtimeOperations = useFetch(fetchRealTimeOperations, startDate, endDate, district, building, floor, filter);
  const securityIncidentsCountBySeverity = useFetch(
    fetchSecurityIncidentsCountBySeverity,
    startDate,
    endDate,
    district,
    building,
    floor,
    filter
  );
  const frequencyOfOccurence = useFetch(fetchFrequencyOfOccurence, startDate, endDate, district, building, floor, filter);
  const acknowledgmentTime = useFetch(fetchAcknowledgmentTime, startDate, endDate, district, building, floor, filter);

  const minHeight = accessModules?.length <= 1 ? {minHeight: 705} : {minHeight: 665};
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    realtimeOperations.fetch(true);
    frequencyOfOccurence.fetch(true);
    acknowledgmentTime.fetch(true);
    securityIncidentsCountBySeverity.fetch(true);
    return () => {
      realtimeOperations.isMountedRef.current = false;
      frequencyOfOccurence.isMountedRef.current = false;
      acknowledgmentTime.isMountedRef.current = false;
      securityIncidentsCountBySeverity.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, district, building, floor]);

  useEffect(() => {
    let defaultCameras: any = districtInfo.districtDefaultCameras.map((dc: any) => dc.cameraIdentifier);

    if (defaultCameras) {
      let cameras = [];
      if (streamCameras) {
        cameras = streamCameras.filter((c: any) => defaultCameras.includes(c.id));
      }
      setCameras(cameras);
    } else {
      setCameras([]);
    }
    // eslint-disable-next-line
  }, [streamCameras, building, floor]);

  return (
    <div style={styles.container} className="animate__animated animate__fadeIn">
      <div style={styles.top}>
        {realtimeOperations.isLoading ? (
          <Loader height="120px" margin={0} />
        ) : (
          <RealtimeOperationalSummary data={realtimeOperations?.response} />
        )}
        {securityIncidentsCountBySeverity.isLoading ? (
          <Loader height="120px" margin={0} />
        ) : (
          <SecurityIncidentsBySeverity data={securityIncidentsCountBySeverity?.response} />
        )}
        {acknowledgmentTime.isLoading ? <Loader height="120px" margin={0} /> : <ResponseEfficiency data={acknowledgmentTime?.response} />}
        {frequencyOfOccurence.isLoading ? (
          <Loader height="120px" margin={0} />
        ) : (
          <FrequencyOfOccurence data={frequencyOfOccurence?.response} />
        )}
      </div>

      <div style={{...styles.bottom, ...minHeight}}>
        <div style={styles.cameraContainer}>
          {!cameras ? (
            <Loader color="#304250" />
          ) : cameras.length === 0 ? (
            <Text variant="actionLabelBold">Cameras are offline</Text>
          ) : (
            <SecurityStream data={cameras} />
          )}
        </div>
        <SecurityHomeTabsContainer />
      </div>
    </div>
  );
};
