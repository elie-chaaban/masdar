import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';
import EnergySlider from '../../components/Slider/Energy';
import SecuritySlider from '../../components/Slider/Security';
import './styles.scss';
import FloorSlider from '../../components/Slider/FloorSlider';
import Header from '../../components/Slider/Header';
import MobilitySlider from '../../components/Slider/Mobility';
import {SlideIn, Loader} from '../../components/Utils';
import DashboardHeader from './Header';

const Slider = () => {
  const insight = useSelector((s) => s.dashboard.insight);
  const {building, isLoadingFloors} = useSelector((s) => s.map);
  const showSlider = useSelector((s) => s.dashboard.showSlider);
  const isOpenInsightSlider = useSelector((s) => s.dashboard.isOpenInsightSlider);
  const isIntersectionDataSliderOpened = useSelector((s) => s.dashboard.isIntersectionDataSliderOpened);
  const active = showSlider && !!insight && !isOpenInsightSlider && !isIntersectionDataSliderOpened;
  const triggerWidowResize = useCallback(() => {
    if (building) window.dispatchEvent(new Event('resize'));
  }, [building]);

  return (
    <SlideIn
      in={active}
      className={`slider-details-container dark-container ${insight === 'energy' ? 'transparent-gray' : ''}`}
      onAnimationEnd={triggerWidowResize}
    >
      <DashboardHeader data-testid="insightHeader" />
      {insight !== 'energy' && (
        <div className="header">
          <Header data-testid="header" showMarker={insight === 'energy'} />
        </div>
      )}
      {building && !isLoadingFloors ? <FloorSlider data-testid="floorSlider" /> : building ? <Loader height="20px" margin={0} /> : null}
      {insight === 'energy' && <EnergySlider data-testid="energy" />}
      {insight === 'security' && <SecuritySlider data-testid="security" />}
      {insight === 'mobility' && <MobilitySlider data-testid="mobility" />}
    </SlideIn>
  );
};
export default Slider;
