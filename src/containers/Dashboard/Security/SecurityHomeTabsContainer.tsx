import React, {useCallback, useEffect, useState} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../../components/Common/Text';

// @ts-ignore
import incidentsPNG from '../../../assets/images/tabs/incidents-tab.png';
// @ts-ignore
import surveillancePNG from '../../../assets/images/tabs/surveillance-tab.png';
// @ts-ignore
import videoPNG from '../../../assets/images/tabs/video-tab.png';
// @ts-ignore
import searchPNG from '../../../assets/images/tabs/search-tab.png';
import IncidentsTable from '../../../components/Dashboard/IncidentsTable';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
// @ts-ignore
import {fetchSecurityIncidents} from '../../../services/security';
//@ts-ignore
import {toggleActionSlider} from '../../../reduxStore/actions';
// @ts-ignore
import useFetch from '../../../hooks';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    overflow: 'hidden'
  },
  tabsHeader: {
    ...spacing.center,
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: colors.tabBackground,
    maxHeight: 58
  },
  tabHeader: {
    ...spacing.center,
    color: colors.white,
    cursor: 'pointer'
  },
  activeTabHeader: {
    ...spacing.center,
    minHeight: 58,
    backgroundColor: colors.activeTabBackground
  },
  tabIcon: {
    marginRight: 10
  }
}));

export const SecurityHomeTabsContainer = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string>('incidents');
  const {filter, startDate, endDate} = useSelector((s: any) => s.dashboard.dateFilter, shallowEqual);
  const {floor, building, district} = useSelector((s: any) => s.map);
  const access = useSelector((s: any) => s.user.access.kpi);
  const securityIncidents = useFetch(fetchSecurityIncidents, startDate, endDate, district, building, floor, filter);
  const hasSecurityIncidentsAccess = access['securityincidents']?.some((b: any) => b.district_id === district);
  const hasSecuritySearchAccess = access['securitysearch']?.some((b: any) => b.district_id === district);
  const hasSecurityVideoAiAccess = access['securityvideoai']?.some((b: any) => b.district_id === district);
  const hasSecuritySurveillanceAccess = access['securitysurveillance']?.some((b: any) => b.district_id === district);

  const hasTabsAccess = hasSecurityIncidentsAccess || hasSecuritySearchAccess || hasSecurityVideoAiAccess || hasSecuritySurveillanceAccess;

  useEffect(() => {
    if (hasSecurityIncidentsAccess) securityIncidents.fetch(true);
    return () => {
      securityIncidents.isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, district, building, floor]);

  useEffect(() => {
    if (activeTab === 'incidents' && !hasSecurityIncidentsAccess) {
      if (hasSecuritySearchAccess) setActiveTab('search');
      else setActiveTab('');
    }
  }, [activeTab, hasSecurityIncidentsAccess, hasSecuritySearchAccess]);

  const openIncidents = () => setActiveTab('incidents');
  const openSearch = () => setActiveTab('search');

  const openSurveillance = useCallback(() => {
    dispatch(toggleActionSlider('security', 'SECURITY_SURVEILLANCE'));
  }, [dispatch]);
  const openVideoAI = useCallback(() => {
    dispatch(toggleActionSlider('security', 'VIDEO_AI'));
  }, [dispatch]);

  if (!hasTabsAccess) return <></>;

  return (
    <div style={styles.container}>
      <div style={styles.tabsHeader}>
        {hasSecurityIncidentsAccess && (
          <div style={{...styles.tabHeader, ...(activeTab === 'incidents' ? styles.activeTabHeader : {})}} onClick={openIncidents}>
            <img src={incidentsPNG} alt="Incidents" style={styles.tabIcon} />
            <Text variant="textButton">Incidents</Text>
          </div>
        )}
        {hasSecuritySurveillanceAccess && (
          <div style={styles.tabHeader} onClick={openSurveillance}>
            <img src={surveillancePNG} alt="Surveillance" style={styles.tabIcon} />
            <Text variant="textButton">Surveillance</Text>
          </div>
        )}
        {hasSecurityVideoAiAccess && (
          <div style={styles.tabHeader} onClick={openVideoAI}>
            <img src={videoPNG} alt="Video AI" style={styles.tabIcon} />
            <Text variant="textButton">Video AI</Text>
          </div>
        )}
        {hasSecuritySearchAccess && (
          <div style={{...styles.tabHeader, ...(activeTab === 'search' ? styles.activeTabHeader : {})}} onClick={openSearch}>
            <img src={searchPNG} alt="Search" style={styles.tabIcon} />
            <Text variant="textButton">Search</Text>
          </div>
        )}
      </div>
      <div style={styles.tabContent}>
        {activeTab === 'incidents' && <IncidentsTable response={securityIncidents.response} isLoading={securityIncidents.isLoading} />}
        {activeTab === 'search' && <div>SEARCH</div>}
      </div>
    </div>
  );
};
