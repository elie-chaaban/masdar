import React, {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
// import {setSearchSliderActive} from '../../../../reduxStore/actions';
import {Tabs, Tab} from 'react-bootstrap';
import {Icon} from '../../../Utils';
import {FaceTab} from './FaceTab';
import {ObjectTab} from './ObjectTab';
import {EventTab} from './EventTab';
// import './styles.scss';

const availableTabs = {
  Face: 'face',
  Object: 'object',
  Event: 'event'
};

const availableTabsIcons = {
  [availableTabs.Face]: 'SearchFaceIcon',
  [availableTabs.Object]: 'SearchObjectIcon',
  [availableTabs.Event]: 'SearchEventIcon'
};

const Title = ({title, selected, tabKey}) => {
  return (
    <div className="tab-title-wrapper">
      <Icon name={`${availableTabsIcons[tabKey]}${selected ? 'Selected' : ''}`} className="tab-title-icon" />
      <span className={`tab-title-text ${selected && 'selected'}`}>{title}</span>
    </div>
  );
};

const Search = () => {
  // const dispatch = useDispatch();
  const {floor, building, district} = useSelector((state) => state.map);
  const [activeTab, setActiveTab] = useState(availableTabs.Event);

  const onSelectTab = useCallback((selectedTab) => {
    setActiveTab(selectedTab);
  }, []);

  return (
    <div className="search-container">
      <div className="search-header">
        <Icon name="Search" className="icon" />
        <p className="title">SEARCH</p>
      </div>
      <div className="search-sections">
        <Tabs defaultActiveKey="profile" onSelect={onSelectTab} activeKey={activeTab} id="uncontrolled-tab-example">
          <Tab
            className={`search-tab-btn ${activeTab === availableTabs.Event ? 'selected' : ''}`}
            eventKey={availableTabs.Event}
            title={<Title title="Event" tabKey={availableTabs.Event} selected={activeTab === availableTabs.Event} />}
          >
            <EventTab floorId={floor} buildingId={building} districtId={district} />
          </Tab>
          <Tab
            className={`search-tab-btn ${activeTab === availableTabs.Object ? 'selected' : ''}`}
            eventKey={availableTabs.Object}
            title={<Title title="Object" tabKey={availableTabs.Object} selected={activeTab === availableTabs.Object} />}
          >
            <ObjectTab floorId={floor} buildingId={building} districtId={district} />
          </Tab>

          <Tab
            className={`search-tab-btn ${activeTab === availableTabs.Face ? 'selected' : ''}`}
            eventKey={availableTabs.Face}
            title={<Title title="Face" tabKey={availableTabs.Face} selected={activeTab === availableTabs.Face} />}
          >
            <FaceTab floorId={floor} buildingId={building} districtId={district} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};
export default Search;
