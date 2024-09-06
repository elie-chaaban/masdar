import React, {useCallback, useEffect} from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import './styles.scss';
import useFetch from '../../hooks';
import {Frame} from '../../components/Utils';
import {getIFramesUrls} from '../../services/user';

const DynamicContentFrame = ({type}) => {
  const map = useSelector((s) => s.map);
  let district,
    building = null;
  if (map) {
    district = map.district || null;
    building = map.building || null;
  }
  const buildingUrls = useFetch(getIFramesUrls, district, building);
  useEffect(() => {
    if (district || building) buildingUrls.fetch(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district, building]);
  const credentials_3dEye = useSelector((s) => s.dashboard.credentials_3dEye, shallowEqual);
  const renderBody = useCallback(() => {
    const iframe = buildingUrls.response.districtPortals.find(
      (item) => item.section === type.toUpperCase() || item.module === type.toUpperCase()
    );
    let url = iframe.kpiConfiguration.apiUrl;
    let extraData = '',
      showLogoDiv = false;
    switch (type) {
      case 'SECURITY_SURVEILLANCE':
        extraData = `?access_token=${credentials_3dEye.accessToken}&refresh_token=${credentials_3dEye.refreshToken}`;
        // showLogoDiv = true;
        break;
      case 'energy':
        extraData = `?username=demoadmin&password=demo@NXN2018`;
        break;
      case 'ASSET_DETAILS':
        extraData = ``;
        break;
      default:
        break;
    }
    return <Frame source={url + extraData} showLogoDiv={showLogoDiv} />;
  }, [buildingUrls.response, type, credentials_3dEye.accessToken, credentials_3dEye.refreshToken]);

  return <div className="dynamic-content-frame">{buildingUrls.response && renderBody()}</div>;
};
export default DynamicContentFrame;
