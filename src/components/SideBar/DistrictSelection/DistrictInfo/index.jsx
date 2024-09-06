import React from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectDistrict,
  toggleInsight,
  toggleSlider,
  setIFrames,
  toggleInsightSlider,
  setIsIntersectionDataSliderOpened,
  toggleActionSlider
} from '../../../../reduxStore/actions';

const DistrictInfo = ({district, onClick, active}) => {
  const {name, location} = district.info.info;
  const dispatch = useDispatch();
  const {showSlider, insight, isOpenInsightSlider, isIntersectionDataSliderOpened, actionSlider} = useSelector((s) => s.dashboard);
  const changeDistrict = () => {
    if (!active) {
      onClick();
      // i need to close all iFrames and insights
      if (showSlider) dispatch(toggleSlider());
      if (insight) dispatch(toggleInsight(null));
      if (isOpenInsightSlider) dispatch(toggleInsightSlider());
      if (isIntersectionDataSliderOpened) dispatch(setIsIntersectionDataSliderOpened(false));
      if (actionSlider.open) dispatch(toggleActionSlider());
      dispatch(selectDistrict(district.info));
      dispatch(setIFrames(district.info.iFrames));
    }
  };
  return (
    <div className="district-card m-4" onClick={changeDistrict}>
      <div className="row px-4">
        <div className="col-7 p-0">
          <div className={active ? 'active' : ''}>
            <img className="img-fluid" src={district.image} alt="district" />
          </div>
          <div className="desc">
            <h5>{name}</h5>
            <p>{location}</p>
          </div>
        </div>
        <div className="col-5 p-0 pl-1 d-flex justify-content-between  flex-column">
          <div className="insights-info">
            <p>
              <span>{district.indexes.energy}</span> <small>Sustainability</small>
            </p>
          </div>
          <div className="insights-info">
            <p>
              <span>{district.indexes.security}</span> <small>Security</small>
            </p>
          </div>
          <div className="insights-info">
            <p>
              <span>{district.indexes.mobility}</span> <small>Mobility</small>
            </p>
          </div>
          <div className="insights-info">
            <p>
              <span>{district.indexes.facilities}</span> <small>Economy</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

DistrictInfo.propTypes = {
  district: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired
};
export default React.memo(DistrictInfo);
