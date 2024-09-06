import React from 'react';
import {useSelector} from 'react-redux';
import EnergySlider from '../../components/Slider/Energy';
import SecuritySlider from '../../components/Slider/Security';
import MobilitySlider from '../../components/Slider/Mobility';
import Search from '../../components/Slider/Security/Search';
import DistrictInsight from '../../components/Insights/DistrictInsight';
import InsightSlider from '../../components/InsightSlider';
import Header from '../../components/Slider/Header';
import DynamicContentFrame from '../DynamicContentFrame';

import './styles.scss';

const DynamicContent = () => {
  const dynamicContentType = useSelector((s) => s.multiWindow.dynamicContentType);
  if (!dynamicContentType) {
    return null;
  }
  return (
    <div className="dynamic-content-container">
      {dynamicContentType === 'energy-insight' || dynamicContentType === 'security-insight' || dynamicContentType === 'mobility-insight' ? (
        <div className="header">
          <Header data-testid="header" showMarker={dynamicContentType === 'energy-insight'} />
        </div>
      ) : null}
      {dynamicContentType === 'district-energy-insight' && <DistrictInsight flexDisplay={true} data-testid="districtEnergyInsight" />}
      {dynamicContentType === 'district-security-insight' && <DistrictInsight flexDisplay={true} data-testid="districtSecurityInsight" />}
      {dynamicContentType === 'district-mobility-insight' && <DistrictInsight flexDisplay={true} data-testid="districtMobilityInsight" />}
      {dynamicContentType === 'energy-insight' && <EnergySlider showInFullscreen={true} data-testid="energy" />}
      {dynamicContentType === 'security-insight' && <SecuritySlider showInFullscreen={true} data-testid="security" />}
      {dynamicContentType === 'mobility-insight' && <MobilitySlider showInFullscreen={true} data-testid="mobility" />}
      {dynamicContentType === 'insights-panel' && <InsightSlider showInFullscreen={true} data-testid="insights-panel" />}
      {dynamicContentType === 'SECURITY_SURVEILLANCE' && (
        <DynamicContentFrame type={'SECURITY_SURVEILLANCE'} data-testid="dynamic-content-frame" />
      )}
      {dynamicContentType === 'Search' && <Search />}
    </div>
  );
};
export default DynamicContent;
