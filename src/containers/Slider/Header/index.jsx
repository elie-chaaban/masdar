import React, {useCallback} from 'react';
import logo from '../../../assets/images/logo/logo.png';
import {Container, Row, Col} from 'react-bootstrap';
import {useSelector, useDispatch} from 'react-redux';
import {Icon} from '../../../components/Utils';
import {toggleInsightSlider, setIsIntersectionDataSliderOpened} from '../../../reduxStore/actions';

const DashboardHeader = () => {
  const districtInfo = useSelector((s) => s.map.districtInfo);
  const stylingLogoPath = useSelector((s) => s.styling.logoPath);
  const district = useSelector((s) => s.map.district);
  const isOpenInsightSlider = useSelector((s) => s.dashboard.isOpenInsightSlider);
  const isIntersectionDataSliderOpened = useSelector((s) => s.dashboard.isIntersectionDataSliderOpened);
  let insightAccess = useSelector((s) => s.user.access.insights);
  insightAccess = insightAccess.includes(district);
  let intersectionDataAccess = useSelector((s) => s.user.access.interSectionData);
  intersectionDataAccess = intersectionDataAccess.includes(district);
  const {name, location} = districtInfo;
  const dispatch = useDispatch();
  const serverUrl = process.env['REACT_APP_FILES_URL'];

  const handleInsightClick = useCallback(() => {
    dispatch(toggleInsightSlider());
    if (isIntersectionDataSliderOpened) {
      dispatch(setIsIntersectionDataSliderOpened(false));
    }
  }, [dispatch, isIntersectionDataSliderOpened]);

  const handleIntersectionDataClick = useCallback(() => {
    dispatch(setIsIntersectionDataSliderOpened(!isIntersectionDataSliderOpened));
    if (isOpenInsightSlider) {
      dispatch(toggleInsightSlider());
    }
  }, [dispatch, isIntersectionDataSliderOpened, isOpenInsightSlider]);

  return (
    <Container className="dashboard-header d-flex flex-column justify-content-between py-2">
      <Row className="mx-n1">
        <Col xs={9} className="d-flex align-items-center px-1">
          <div className="districtContainer">
            <div className="district-name">{name}</div>
            <div className="districtInfo">{location}</div>
          </div>
        </Col>
        {stylingLogoPath && (
          <Col xs={3} className="d-flex align-items-center px-1">
            <img src={serverUrl + stylingLogoPath} className="img-fluid" alt="logo" />
          </Col>
        )}
        {!stylingLogoPath && (
          <Col xs={3} className="d-flex align-items-center px-1">
            <img src={logo} className="img-fluid" alt="logo" />
          </Col>
        )}
      </Row>
      <div className="d-flex">
        <button
          disabled={!insightAccess}
          className={`insight-btn ${isOpenInsightSlider ? 'active' : ''} ${
            insightAccess ? '' : 'text-secondary'
          } text-center position-relative`}
          onClick={handleInsightClick}
        >
          <span style={{position: 'absolute', top: '48%', left: 5, transform: 'translateY(-50%)'}}>
            <Icon name="security" width="20px" height="20px" />
          </span>
          <span style={{marginLeft: 20}}>INSIGHTS</span>
        </button>
        <button
          disabled={!intersectionDataAccess}
          className={`vendor-charts-btn ${isIntersectionDataSliderOpened ? 'active' : ''} ${
            intersectionDataAccess ? '' : 'text-secondary'
          } text-center position-relative`}
          onClick={handleIntersectionDataClick}
        >
          <span style={{position: 'absolute', top: '48%', left: 5, transform: 'translateY(-50%)'}}>
            <Icon name="Reports" width="20px" height="20px" />
          </span>
          <span style={{marginLeft: 20}}>Intersection Data</span>
        </button>
      </div>
    </Container>
  );
};
export default React.memo(DashboardHeader);
