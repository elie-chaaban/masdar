import React, {useState, useCallback, useEffect} from 'react';
import './styles.scss';
import {Icon} from '../../components/Utils';
import {useSelector, useDispatch} from 'react-redux';
import {DistrictSelect, Profile, Reports, Weather, BuildingAdvisor} from '../../components/SideBar';
import {logoutUserRequest} from '../../services/auth';
import {errorNotification} from '../../components/Utils/Notifications';
import {
  setIsIntersectionDataSliderOpened,
  setInsightSliderState,
  setShowSlider,
  toggleMultiWindowModal,
  setAddAssetFeatureEnabled
} from '../../reduxStore/actions';
import MenuIcon from './MenuIcon';

function SideBar() {
  const [menu, setMenu] = useState();
  const [active, setActive] = useState(true);
  const dispatch = useDispatch();
  const isMultiWindowModalOpened = useSelector((s) => s.multiWindow.isMultiWindowModalOpened);
  const isAddAssetFeatureEnabled = useSelector((s) => s.map.isAddAssetFeatureEnabled);
  const district = useSelector((s) => s.map.district);
  const lightPoleAccess = useSelector((s) => s.user.access.lightPoles);
  const hasLightPoleAccess = lightPoleAccess.includes(district);
  const buildingAdvisorAccess = useSelector((s) => s.user.access.BAReports);
  const hasBuildingAdvisorAccess = buildingAdvisorAccess.includes(district);
  const triggerToggleMultiWindowModal = () => dispatch(toggleMultiWindowModal());
  const triggerSetShowSlider = () => dispatch(setShowSlider(false));
  const triggerSetAddAssetFeature = (v) => {
    dispatch(setAddAssetFeatureEnabled(v));
    dispatch(setIsIntersectionDataSliderOpened(false));
    dispatch(setInsightSliderState(false));
  };
  const logout = useCallback(async () => {
    try {
      await logoutUserRequest();
    } catch (error) {
      errorNotification(error);
    }
  }, []);
  const setActiveView = useCallback((view) => {
    setMenu((prevState) => (prevState === view ? null : view));
  }, []);
  const handleMultiWindowItemClick = () => {
    setActiveView('multiWindow');
    triggerToggleMultiWindowModal();
  };
  const handleAddStreetLightClick = () => {
    setActiveView('addStreetLight');
    triggerSetAddAssetFeature(!isAddAssetFeatureEnabled);
    triggerSetShowSlider();
  };
  useEffect(() => {
    if (!isMultiWindowModalOpened && menu === 'multiWindow') {
      setMenu(null);
    }
  }, [menu, isMultiWindowModalOpened]);
  useEffect(() => {
    if (!isAddAssetFeatureEnabled && menu === 'addStreetLight') {
      setMenu(null);
    }
  }, [menu, isAddAssetFeatureEnabled]);
  return (
    <>
      <button
        className={`hamburger hamburger--elastic ${active ? 'is-active' : ''}`}
        type="button"
        onClick={() => {
          if (active) setMenu();
          setActive((prev) => !prev);
        }}
      >
        <span className="hamburger-box">
          <span className="hamburger-inner"></span>
        </span>
      </button>
      <div className={`nxn-left-sideBar ${active ? 'is-active' : ''}`}>
        <MenuIcon type="profile" isActive={menu === 'profile'} click={setActiveView} toolTip="Profile" />
        <MenuIcon isActive={menu === 'district'} click={setActiveView} toolTip="District Selection" />
        <MenuIcon type="reports" isActive={menu === 'reports'} click={setActiveView} toolTip="Reports" />
        {hasBuildingAdvisorAccess && (
          <MenuIcon type="buildingCost" isActive={menu === 'buildingCost'} click={setActiveView} toolTip="Building Avoidable Cost" />
        )}
        <MenuIcon
          type="multiWindow"
          isActive={menu === 'multiWindow'}
          click={handleMultiWindowItemClick}
          toolTip="Multi Window Support"
          marginClass={hasLightPoleAccess ? '' : 'mb-auto'}
        />
        {hasLightPoleAccess && (
          <MenuIcon
            type="addStreetLight"
            isActive={menu === 'addStreetLight'}
            click={handleAddStreetLightClick}
            marginClass="mb-auto"
            toolTip="Add Street Light"
          />
        )}
        <div className="left-sideBar-section">
          <Profile active={menu === 'profile'} click={setActiveView} />
          <DistrictSelect active={menu === 'district'} click={setActiveView} />
          <Reports active={menu === 'reports'} click={setActiveView} />
          <BuildingAdvisor active={menu === 'buildingCost'} click={setActiveView} />
        </div>
        <div className="left-sideBar-section">
          <div className="hover-side">
            <Weather />
          </div>
          <div className="hover-side mt-4 d-flex justify-content-center">
            <Icon name="infoicon" className="expandable-icon clickable" width="20" height="20" />
          </div>
          <MenuIcon type="logout" isActive={false} click={logout} toolTip="Logout" marginClass="mt-2" />
        </div>
      </div>
    </>
  );
}
export default SideBar;
