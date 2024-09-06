import React, {useCallback, useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
//@ts-ignore
import useFetch from '../../hooks';
//@ts-ignore
import {getIFramesUrls} from '../../services/user';
//@ts-ignore
import {toggleActionSlider} from '../../reduxStore/actions';
//@ts-ignore
import {SlideIn, Frame, ExpandableIcon, WhiteCloseIcon} from '../../components/Utils';
//@ts-ignore
import Search from '../../components/Slider/Security/Search';
import './styles.css';
import {Styles} from '../../types';
import {createStyles} from '../../theme';
import {Text} from '../../components/Common/Text';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '80vw',
    zIndex: 10000
  },
  detailsContainer: {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
    marginLeft: 0,
    backgroundColor: colors.actionSliderBackground,
    zIndex: 10001
  },
  securityModuleContainer: {
    width: '100vw',
    top: 'auto'
  },
  securityModuleDetailsContainer: {
    height: '93vh'
  },
  securityHeaderContainer: {
    ...spacing.center,
    width: '100%',
    backgroundColor: colors.actionSliderBackground,
    height: 50
  },
  closeContainer: {position: 'absolute', top: 0},
  title: {
    color: colors.white
  }
}));

const ActionSlider = () => {
  const dispatch = useDispatch();
  const {district, building} = useSelector((s: any) => s.map);
  const buildingUrls = useFetch(getIFramesUrls, district, building);
  const credentials_3dEye = useSelector((s: any) => s.dashboard.credentials_3dEye, shallowEqual);
  const {open, module, section, data} = useSelector((s: any) => s.dashboard.actionSlider, shallowEqual);
  const triggerToggleActionSlider = () => dispatch(toggleActionSlider(module, section, data));
  const [animationName, setAnimationName] = useState<string>();
  const [moduleStyle, setModuleStyle] = useState<any>();
  const [moduleDetailsStyle, setModuleDetailsStyle] = useState<any>();

  useEffect(() => {
    if (animationName && !module) {
      if (animationName === 'slideUp') setAnimationName('slideDown');
      if (animationName === 'fadeRight') setAnimationName('fadeRight');
      return;
    }
    if (module?.toUpperCase() === 'SECURITY') {
      setAnimationName('slideUp');
      setModuleStyle(styles.securityModuleContainer);
      return setModuleDetailsStyle(styles.securityModuleDetailsContainer);
    }
    if (module?.toUpperCase() === 'ENERGY') {
      setAnimationName('fadeRight');
      setModuleStyle({});
      return setModuleDetailsStyle({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module]);

  useEffect(() => {
    if (district || building) buildingUrls.fetch(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district, building]);

  const renderBody = useCallback(() => {
    if (section === 'Search') {
      return <Search />;
    } else {
      let iframe = null;
      if (building) {
        iframe = buildingUrls.response.districtPortals.find(
          (item: any) => item.section === section.toUpperCase() && item.module === module.toUpperCase() && item.buildingId === building
        );
      } else {
        iframe = buildingUrls.response.districtPortals.find(
          (item: any) => item.section === section.toUpperCase() && item.module === module.toUpperCase() && item.buildingId === null
        );
      }

      let url = iframe ? iframe.kpiConfiguration.apiUrl : '';
      let extraData = '',
        showLogoDiv = false;

      switch (section) {
        case 'SECURITY_SURVEILLANCE':
          extraData = `?access_token=${credentials_3dEye.accessToken}&refresh_token=${credentials_3dEye.refreshToken}`;
          // showLogoDiv = true;
          break;
        case 'SECURITY_INCIDENTS':
          extraData = `?situationID=${data.situationId}&windowNumber=1`;
          break;
        case 'VIDEO_AI':
          extraData = ``;
          break;
        case 'ENERGY_DETAILS':
          extraData = `?username=demoadmin&password=demo@NXN2018`;
          break;
        case 'ASSET_DETAILS':
          extraData = ``;
          break;
        default:
          break;
      }
      return <Frame source={url + extraData} showLogoDiv={showLogoDiv} />;
    }
  }, [data, credentials_3dEye, module, section, buildingUrls, building]);

  return (
    <SlideIn in={open && section !== 'Statistics'} animation={animationName} style={{...styles.container, ...moduleStyle}}>
      <div style={{...styles.detailsContainer, ...moduleDetailsStyle}}>
        {module?.toUpperCase() === 'ENERGY' && <ExpandableIcon onClick={triggerToggleActionSlider} active={open} inverted />}
        {module?.toUpperCase() === 'SECURITY' && (
          <div style={styles.securityHeaderContainer}>
            <Text variant="actionSliderTitle" style={styles.title}>
              SMART SECURITY
            </Text>
            <WhiteCloseIcon onClick={triggerToggleActionSlider} active={open} inverted stylingProperties={styles.closeContainer} />
          </div>
        )}
        {buildingUrls.response && section && section !== 'Statistics' && renderBody()}
      </div>
    </SlideIn>
  );
};

export default ActionSlider;
