import React, {useCallback, useState, useEffect} from 'react';
import {fetchSecuritySearch, fetchSecuritySearchTypeFilters} from '../../../../services/security';
import {uploadFaceImage} from '../../../../services/search';
import {default as DateRangePicker} from 'react-bootstrap-daterangepicker';
import {MultilevelDropdown} from './MultilevelDropdown';
import 'bootstrap-daterangepicker/daterangepicker.css';
import {SearchResultCard} from './SearchResultCard';
import {Row, Col, Button} from 'react-bootstrap';
import {Formik, Form, Field} from 'formik';
import Loader from '../../../Utils/Loader';
import Dropdown from 'react-dropdown';
import {Icon} from '../../../Utils';
import Arrow from './Arrow';
import moment from 'moment';
import * as Yup from 'yup';
import './styles.scss';

const validation = Yup.object().shape({
  searchText: Yup.string().nullable(),
  cameraId: Yup.string().nullable(),
  datePeriod: Yup.object().nullable(),
  faceImage: Yup.object().nullable()
});

export const FaceTab = (props) => {
  const {floorId, buildingId, districtId} = props;
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedDate, setSelectedDate] = useState([moment(), moment()]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [faceImageId, setFaceImageId] = useState(null);
  const [faceImageType, setFaceImageType] = useState(null);
  const [faceImage, setFaceImage] = useState(null);

  const [cameraOptions, setCameraOptions] = useState([]);
  const [eventTypeOptions, setEventTypeOptions] = useState([]);
  const [objectTypeOptions, setObjectTypeOptions] = useState([]);
  useEffect(() => {
    const fetchFilters = async () => {
      const filters = await fetchSecuritySearchTypeFilters(3, districtId);
      const cameraFilter = filters['Filter-1'];
      const cameraFilterOptions = cameraFilter.options;
      setCameraOptions([
        {label: <span>{'Select a Camera'}</span>, filterId: cameraFilter.id, title: 'Select a Camera', value: 'CAMERA_DEFAULT_OPTION'},
        ...cameraFilterOptions.map((option) => ({
          label: <span>{option.title}</span>,
          filterId: cameraFilter.id,
          title: option.title,
          value: option.value
        }))
      ]);

      const objectTypeFilter = filters['Filter-2'];
      const objectTypeFilterOptions = objectTypeFilter.options;
      setObjectTypeOptions(
        objectTypeFilterOptions.map((option) => ({
          label: <span>{option.title}</span>,
          filterId: objectTypeFilter.id,
          title: option.title,
          value: option.value
        }))
      );

      const eventTypeFilter = filters['Filter-3'];
      const eventTypeFilterOptions = eventTypeFilter.options;
      setEventTypeOptions(
        eventTypeFilterOptions.map((option) => ({
          label: <span>{option.title}</span>,
          filterId: eventTypeFilter.id,
          title: option.title,
          value: option.value
        }))
      );
    };

    fetchFilters();
  }, [floorId, buildingId, districtId]);
  const [menu, setMenu] = useState([
    {
      title: 'Event Type',
      value: 'event-type',
      options: eventTypeOptions
    },
    {
      title: 'Object Type',
      value: 'object-type',
      options: objectTypeOptions
    }
  ]);
  useEffect(() => {
    setMenu([
      {
        title: 'Event Type',
        value: 'event-type',
        options: eventTypeOptions
      },
      {
        title: 'Object Type',
        value: 'object-type',
        options: objectTypeOptions
      }
    ]);
  }, [eventTypeOptions, objectTypeOptions]);
  const formatDateValue = useCallback(() => {
    return `${selectedDate[0].format('MMM D, YYYY')} - ${selectedDate[1].format('MMM D, YYYY')}`;
  }, [selectedDate]);

  const triggerSubmit = useCallback((submitForm) => {
    // submitForm();
  }, []);
  const handleDateRangeChange = useCallback(
    (start, end, setFieldValue, submitForm) => {
      setSelectedDate([moment(start), moment(end)]);
      setFieldValue('datePeriod', {
        start: moment(start).valueOf(),
        end: moment(end).valueOf()
      });
      triggerSubmit(submitForm);
    },
    [triggerSubmit]
  );

  const onFilterDropdownClick = useCallback(
    ({title, filterId, value}, submitForm) => {
      const foundFilter = selectedFilters.find((filter) => filter.value === value);
      if (!foundFilter) {
        const found = selectedFilters.find((filter) => filter.filterId === filterId);
        if (found) {
          const newFilters = selectedFilters.filter((filter) => filter.filterId !== filterId);
          newFilters.push({title, filterId, value});
          setSelectedFilters(newFilters);
          triggerSubmit(submitForm);
        } else {
          const newFilters = [...selectedFilters];
          newFilters.push({title, filterId, value});
          setSelectedFilters(newFilters);
          triggerSubmit(submitForm);
        }
      }
    },
    [selectedFilters, triggerSubmit]
  );
  const removeSelectedFilter = useCallback(
    (value, submitForm) => {
      const newFilters = selectedFilters.filter((filter) => filter.value !== value);
      setSelectedFilters(newFilters);
      triggerSubmit(submitForm);
    },
    [selectedFilters, triggerSubmit]
  );
  const submit = useCallback(
    async (values) => {
      try {
        setLoading(true);
        let params = {};
        const filters = [];

        const searchCamera = cameraOptions.find((o) => o.title.toLowerCase() === values.searchText.toLowerCase());
        if (searchCamera) {
          filters.push({filterId: searchCamera.filterId, optionId: searchCamera.value});
        }
        const searchEventType = eventTypeOptions.find((o) => o.title.toLowerCase() === values.searchText.toLowerCase());
        if (searchEventType) {
          filters.push({filterId: searchEventType.filterId, optionId: searchEventType.value});
        }
        const searchObjectType = objectTypeOptions.find((o) => o.title.toLowerCase() === values.searchText.toLowerCase());
        if (searchObjectType) {
          filters.push({filterId: searchObjectType.filterId, optionId: searchObjectType.value});
        }
        if (values.datePeriod) {
          params.startDate = values.datePeriod.start;
          params.endDate = values.datePeriod.end;
        }
        if (faceImageId && faceImageType) {
          params.personImage = faceImageId;
          params.personImageType = faceImageType;
        }
        if (values.cameraId && values.cameraId.value && values.cameraId.value !== 'CAMERA_DEFAULT_OPTION') {
          filters.push({filterId: values.cameraId.filterId, optionId: values.cameraId.value});
        }
        selectedFilters.forEach((filter) => {
          filters.push({filterId: filter.filterId, optionId: filter.value});
        });
        const personResponse = await fetchSecuritySearch(3, districtId, buildingId, floorId, params, filters);
        const person = personResponse[0].data[0];
        params = {};
        if (values.datePeriod) {
          params.startDate = values.datePeriod.start;
          params.endDate = values.datePeriod.end;
        }
        params.personId = person.id;
        const result = await fetchSecuritySearch(3, districtId, buildingId, floorId, params, filters);
        if (result && result.length) {
          let data = [];
          result.forEach((records) => {
            data = [...data, ...records.data];
          });
          setResults(data);
        } else {
          setResults([]);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    },
    [cameraOptions, eventTypeOptions, objectTypeOptions, selectedFilters, districtId, buildingId, floorId, faceImageId, faceImageType]
  );
  const uploadImage = useCallback(async (image) => {
    try {
      const imageId = await uploadFaceImage(image);
      setFaceImage(image.path);
      setFaceImageId(imageId);
      setFaceImageType(image.type);
    } catch (error) {}
  }, []);
  const triggerUploadImage = useCallback(
    (image) => {
      uploadImage(image);
    },
    [uploadImage]
  );
  return (
    <div className="tab-content-container">
      <Formik
        initialValues={{
          searchText: '',
          cameraId: '',
          datePeriod: null,
          faceImage: null
        }}
        validationSchema={validation}
        onSubmit={submit}
      >
        {({values, submitForm, setFieldValue, handleChange, errors, touched}) => (
          <Form>
            <Row>
              <Col xs={3} className="">
                <Field
                  name="searchText"
                  type="text"
                  className="search-text form-control w-100 d-block"
                  placeholder="Search names here"
                  onChange={(e) => handleChange(e)}
                  onKeyPress={(e) => {
                    if (e.keyCode === 13) triggerSubmit(submitForm);
                  }}
                />
              </Col>
              <Col xs={1}></Col>
              <Col xs={2} className="dropdown-container">
                <Dropdown
                  controlClassName="ViewDropdown"
                  menuClassName="DropdownMenu"
                  options={cameraOptions}
                  arrowOpen={<Arrow rotation={180} />}
                  arrowClosed={<Arrow />}
                  name="cameraId"
                  onChange={(option) => {
                    setFieldValue('cameraId', option);
                    triggerSubmit(submitForm);
                  }}
                  value={values.cameraId}
                  placeholder="Select a Camera"
                />
              </Col>
              <Col xs={3}>
                <Button className="upload-image-btn">
                  <input
                    name="faceImage"
                    id="feceImage"
                    type="file"
                    onChange={(event) => {
                      // const size = event.currentTarget.files[0].size;
                      // const type = event.currentTarget.files[0].type;
                      // const reader = new FileReader();
                      // reader.onload = (e) => {
                      //   setFieldValue('faceImage', {
                      //     size,
                      //     type,
                      //     data: reader.result
                      //   });
                      //   triggerSubmit(submitForm);
                      // };
                      // reader.readAsDataURL(event.currentTarget.files[0]);
                      triggerUploadImage(event.currentTarget.files[0]);
                    }}
                  />
                  <span style={{marginRight: 10}}>Upload Photo</span>
                  <Icon name="UploadIcon" className="upload-image-icon" />
                </Button>
              </Col>
              <Col xs={3}>
                <DateRangePicker
                  initialSettings={{
                    startDate: selectedDate[0],
                    endDate: selectedDate[1]
                  }}
                  onCallback={(start, end, label) => handleDateRangeChange(start, end, setFieldValue, submitForm)}
                >
                  <div className="date-range-container">
                    <span className="selected-date-range-label">{formatDateValue()}</span>
                    <Icon name="CalendarIcon" className="calendar-icon" />
                  </div>
                </DateRangePicker>
              </Col>
            </Row>
            <Row className="filter-row">
              <Col xs={1}>
                <MultilevelDropdown
                  menu={menu}
                  active={selectedFilters.length > 0}
                  onClick={(option) => onFilterDropdownClick(option, submitForm)}
                />
              </Col>
              <Col xs={10} style={{display: 'flex'}}>
                {selectedFilters.map((filter) => (
                  <div key={`filter-${filter.filterId}`} className="selected-filter">
                    <span className="selected-filter-text">{filter.title}</span>
                    <Icon
                      name="CrossIcon"
                      className="remove-selected-filter-icon"
                      onClick={() => removeSelectedFilter(filter.value, submitForm)}
                    />
                  </div>
                ))}
              </Col>
              <Col xs={1} style={{display: 'flex', justifyContent: 'flex-end'}}>
                <div className="search-button">
                  <Icon name="Search" className="search-button-icon" onClick={submitForm} />
                </div>
              </Col>
            </Row>
            <div className="results">
              {loading ? (
                <Loader margin={0} />
              ) : (
                <Row className="result-row">
                  {results &&
                    results.map((result) => (
                      <Col key={result.id} xs={4}>
                        <SearchResultCard image={faceImage} {...result} />
                      </Col>
                    ))}
                </Row>
              )}
            </div>
            <div>
              <div id="output" class="section-wrapper"></div>
              <div id="buff" class="section-wrapper"></div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
