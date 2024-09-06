import React, {useCallback, CSSProperties, useState} from 'react';
import {Styles} from '../../../types';
// @ts-ignore
import home from '../../../assets/images/sidebar/home.png';
// @ts-ignore
import homeActive from '../../../assets/images/sidebar/home_active.png';
// @ts-ignore
import carbon from '../../../assets/images/sidebar/carbon.png';
// @ts-ignore
import carbonActive from '../../../assets/images/sidebar/carbon_active.png';
// @ts-ignore
import sustainability from '../../../assets/images/sidebar/sustainability.png';
// @ts-ignore
import sustainabilityActive from '../../../assets/images/sidebar/sustainability_active.png';
// @ts-ignore
import water from '../../../assets/images/sidebar/water.png';
// @ts-ignore
import waterActive from '../../../assets/images/sidebar/water_active.png';
// @ts-ignore
import waste from '../../../assets/images/sidebar/waste.png';
// @ts-ignore
import wasteActive from '../../../assets/images/sidebar/waste_active.png';
// @ts-ignore
import weather from '../../../assets/images/sidebar/weather.png';
// @ts-ignore
import profile from '../../../assets/images/sidebar/profile.png';
// @ts-ignore
import profileActive from '../../../assets/images/sidebar/profile_active.png';
// @ts-ignore
import districts from '../../../assets/images/sidebar/districts.png';
// @ts-ignore
import districtsActive from '../../../assets/images/sidebar/districts_active.png';
// @ts-ignore
import multiWindow from '../../../assets/images/sidebar/multiWindow.png';
// @ts-ignore
import multiWindowActive from '../../../assets/images/sidebar/multiWindow_active.png';
// @ts-ignore
import logout from '../../../assets/images/sidebar/logout.png';
// @ts-ignore
import alarmsToggle from '../../../assets/images/sidebar/alarms-toggle-icon.png';
// @ts-ignore
import alarmsToggleActive from '../../../assets/images/sidebar/alarms-toggle-active-icon.png';
// @ts-ignore
import infoIcon from '../../../assets/images/sidebar/info.png';

import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
import 'animate.css';
import {useSelector} from 'react-redux';
import {retrieveIconPath} from '../../../utils/dashboard';
// @ts-ignore
import {selectThemeProperties} from '../../../reduxStore/selectors';
import './navbar.css';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    flex: 1,
    height: '100%',
    maxWidth: 50,
    paddingTop: 8,
    paddingBottom: 8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: colors.sidebar
  },
  topSection: {
    ...spacing.centerVertically,
    justifyContent: 'flex-start'
  },
  bottomSection: {
    ...spacing.centerVertically,
    justifyContent: 'flex-end'
  },
  defaultIcon: {
    width: 80,
    height: 80,
    cursor: 'pointer'
  },
  iconLabel: {
    color: colors.white
  },
  itemWrapper: {
    ...spacing.flexVertically,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeItem: {
    backgroundColor: colors.sidePanelItemActiveBackground
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    position: 'relative',
    minWidth: '100%',
    maxWidth: '100%',
    zIndex: 9999,
    color: colors.white,
    height: 0
  },
  topSection: {
    ...spacing.centerVertically,
    justifyContent: 'flex-start',
    marginTop: 19
  },
  bottomSection: {
    ...spacing.centerVertically,
    justifyContent: 'flex-end'
    // marginTop: '166em'
  },
  defaultIcon: {
    width: 80,
    height: 80,
    cursor: 'pointer'
  },
  iconLabel: {
    color: colors.white
  },
  itemWrapper: {
    ...spacing.flexVertically,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  activeItem: {
    backgroundColor: colors.sidePanelItemActiveBackground
  }
}));

export const sideBarListIds = {
  home: 'home',
  energy: 'energy',
  water: 'water',
  waste: 'waste',
  carbon: 'carbon',
  weather: 'weather',
  landing: 'landing',
  profile: 'profile',
  districts: 'districts',
  multiWindow: 'multiWindow',
  alarms: 'alarms',
  logout: 'logout'
};

export type SideBarListItemId = keyof typeof sideBarListIds;

interface SideBarItem {
  id: SideBarListItemId;
  defaultIcon: string;
  iconName?: string;
  activeIconName?: string;
  label: string;
  defaultActiveIcon?: string;
  style?: CSSProperties;
}

export type SideBarList = {[key in SideBarListItemId]: SideBarItem};

const list: SideBarList = {
  home: {
    id: 'home',
    defaultIcon: home,
    defaultActiveIcon: homeActive,
    iconName: 'home-icon',
    activeIconName: 'active-home-icon',
    label: 'HOME',
    style: {
      width: 48,
      height: 48
    }
  },
  energy: {
    id: 'energy',
    defaultIcon: sustainability,
    label: 'ENERGY',
    defaultActiveIcon: sustainabilityActive,
    style: {
      width: 48,
      height: 48
    }
  },
  water: {
    id: 'water',
    defaultIcon: water,
    label: 'WATER',
    defaultActiveIcon: waterActive,
    style: {
      width: 48,
      height: 48
    }
  },
  waste: {
    id: 'waste',
    defaultIcon: waste,
    label: 'WASTE',
    defaultActiveIcon: wasteActive,
    style: {
      width: 48,
      height: 48
    }
  },
  carbon: {
    id: 'carbon',
    defaultIcon: carbon,
    label: 'CO2e',
    defaultActiveIcon: carbonActive,
    style: {
      width: 48,
      height: 48
    }
  },
  weather: {
    id: 'weather',
    defaultIcon: weather,
    label: 'WEATHER'
  },
  landing: {
    id: 'landing',
    defaultIcon: infoIcon,
    label: 'CCC',
    defaultActiveIcon: infoIcon,
    style: {
      width: 24,
      height: 24
    }
  },
  profile: {
    id: 'profile',
    defaultIcon: profile,
    label: 'PROFILE',
    defaultActiveIcon: profileActive,
    style: {
      width: 48,
      height: 48
    }
  },
  districts: {
    id: 'districts',
    defaultIcon: districts,
    label: 'DISTRICTS',
    defaultActiveIcon: districtsActive,
    style: {
      width: 48,
      height: 48
    }
  },
  multiWindow: {
    id: 'multiWindow',
    defaultIcon: multiWindow,
    label: 'DISPLAY',
    defaultActiveIcon: multiWindowActive,
    style: {
      width: 48,
      height: 48
    }
  },
  logout: {
    id: 'logout',
    defaultIcon: logout,
    label: 'LOGOUT',
    style: {
      width: 48,
      height: 48
    }
  },
  alarms: {
    id: 'alarms',
    defaultIcon: alarmsToggle,
    label: 'ALARMS',
    defaultActiveIcon: alarmsToggleActive,
    style: {
      width: 24,
      height: 27.5,
      marginTop: 8,
      marginBottom: 8
    }
  }
};

export interface SideBarProps {
  style?: CSSProperties;
  show?: boolean;
  top?: SideBarListItemId[];
  bottom?: SideBarListItemId[];
  activeIds: SideBarListItemId[];
  onClick: (id: SideBarListItemId) => void;
}

export const SideBar = ({style, show, top, bottom, activeIds, onClick}: SideBarProps) => {
  // to change burger classes
  let burgerClass = 'burger-bar';
  let menuClass = 'menu';
  if (window.innerWidth == 390) {
    burgerClass = 'burger-bar12PRO';
    menuClass = 'menuPRO';
  } else if (window.innerWidth == 414) {
    burgerClass = 'burger-barXR';
    menuClass = 'menuXR';
  } else if (window.innerWidth == 375) {
    burgerClass = 'burger-barSE';
    menuClass = 'menuSE';
  } else if (window.innerWidth == 412) {
    burgerClass = 'burger-barS20';
  }

  // to change burger classes
  const [burger_class, setBurgerClass] = useState('' + burgerClass + ' unclicked');
  const [menu_class, setMenuClass] = useState('' + menuClass + '  hidden');
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  const stylingProperties = useSelector(selectThemeProperties) as any;
  const {icons} = useSelector((s: any) => s.themeIcons);
  const {mobileMode} = useSelector((s: any) => s.styling);
  const styles = mobileMode ? mobileStyles : webStyles;

  const setOnClick = useCallback(
    (id: SideBarListItemId): (() => void) => {
      return () => onClick(id);
    },
    [onClick]
  );

  const getIcon = (id: SideBarListItemId) => {
    const isActive = activeIds.indexOf(id) !== -1;
    if (isActive) {
      return icons[list[id].activeIconName!]
        ? `${retrieveIconPath(icons[list[id].activeIconName!])}`
        : list[id].defaultActiveIcon
        ? list[id].defaultActiveIcon
        : list[id].defaultIcon;
    } else {
      return icons[list[id].iconName!] ? `${retrieveIconPath(icons[list[id].iconName!])}` : list[id].defaultIcon;
    }
  };

  // toggle burger menu change
  const updateMenu = () => {
    if (!isMenuClicked) {
      setBurgerClass('' + burgerClass + '  clicked');
      setMenuClass('' + menuClass + ' visible');
    } else {
      setBurgerClass('' + burgerClass + '  unclicked');
      setMenuClass('' + menuClass + ' hidden');
    }
    setIsMenuClicked(!isMenuClicked);
  };

  return show ? (
    <div
      style={{
        ...styles.container,
        ...(style ? style : {}),
        ...stylingProperties?.sideBarBackgroundColor,
        ...(!show ? {width: 0} : {})
      }}
      className={show ? 'animate__animated animate__slideInLeft' : 'animate__animated animate__slideOutLeft'}
    >
      {mobileMode ? (
        <>
          <div onClick={updateMenu}>
            <nav>
              <div className="burger-menu">
                <div className={burger_class}></div>
                <div className={burger_class}></div>
                <div className={burger_class}></div>
              </div>
            </nav>

            <div className={menu_class}>
              <div style={styles.topSection}>
                {top?.map((id) => (
                  <div
                    style={{
                      ...styles.itemWrapper,
                      ...(activeIds.indexOf(id) !== -1 ? (!list[id].defaultActiveIcon ? styles.activeItem : {}) : {})
                    }}
                    key={`sidebar-item-${id}`}
                    onClick={setOnClick(id)}
                  >
                    <img src={getIcon(id)} style={{...styles.icon, ...(list[id].style ? list[id].style : {})}} alt="side-panel-icon" />
                    <Text style={{...styles.iconLabel, ...stylingProperties?.sideBarTextColor}} variant="miniSemiBoldFootLabel">
                      {list[id].label}
                    </Text>
                  </div>
                ))}
              </div>
              <div style={styles.bottomSection}>
                {bottom?.map((id) => (
                  <div
                    style={{
                      ...styles.itemWrapper,
                      ...(activeIds.indexOf(id) !== -1 ? (!list[id].defaultActiveIcon ? styles.activeItem : {}) : {})
                    }}
                    key={`sidebar-item-${id}`}
                    onClick={setOnClick(id)}
                  >
                    <img
                      src={
                        activeIds.indexOf(id) !== -1
                          ? list[id].defaultActiveIcon
                            ? list[id].defaultActiveIcon
                            : list[id].defaultIcon
                          : list[id].defaultIcon
                      }
                      style={{...styles.icon, ...(list[id].style ? list[id].style : {})}}
                      alt="side-panel-icon"
                    />
                    <Text style={{...styles.iconLabel, ...stylingProperties?.sideBarTextColor}} variant="miniSemiBoldFootLabel">
                      {list[id].label}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={styles.topSection}>
            {top?.map((id) => (
              <div
                style={{
                  ...styles.itemWrapper,
                  ...(activeIds.indexOf(id) !== -1 ? (!list[id].defaultActiveIcon ? styles.activeItem : {}) : {})
                }}
                key={`sidebar-item-${id}`}
                onClick={setOnClick(id)}
              >
                <img src={getIcon(id)} style={{...styles.icon, ...(list[id].style ? list[id].style : {})}} alt="side-panel-icon" />
                <Text style={{...styles.iconLabel, ...stylingProperties?.sideBarTextColor}} variant="miniSemiBoldFootLabel">
                  {list[id].label}
                </Text>
              </div>
            ))}
          </div>
          <div style={styles.bottomSection}>
            {bottom?.map((id) => (
              <div
                style={{
                  ...styles.itemWrapper,
                  ...(activeIds.indexOf(id) !== -1 ? (!list[id].defaultActiveIcon ? styles.activeItem : {}) : {})
                }}
                key={`sidebar-item-${id}`}
                onClick={setOnClick(id)}
              >
                <img
                  src={
                    activeIds.indexOf(id) !== -1
                      ? list[id].defaultActiveIcon
                        ? list[id].defaultActiveIcon
                        : list[id].defaultIcon
                      : list[id].defaultIcon
                  }
                  style={{...styles.icon, ...(list[id].style ? list[id].style : {})}}
                  alt="side-panel-icon"
                />
                <Text style={{...styles.iconLabel, ...stylingProperties?.sideBarTextColor}} variant="miniSemiBoldFootLabel">
                  {list[id].label}
                </Text>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  ) : (
    <div style={styles.collapseContainer}></div>
  );
};
