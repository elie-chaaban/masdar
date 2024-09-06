import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import moment from 'moment-mini';
//@ts-ignore
import Loader from '../../Utils/Loader';
import {createStyles} from '../../../theme';
import {Styles} from '../../../types';
import {Text} from '../../Common/Text';
import {useDispatch} from 'react-redux';
//@ts-ignore
import {toggleActionSlider} from '../../../reduxStore/actions';

const styles: Styles = createStyles(({colors, spacing}) => ({
  headerRow: {
    ...spacing.center,
    color: colors.white,
    backgroundColor: colors.gridHeaderRowBackground
  },
  incidentCell: {
    textAlign: 'center',
    overflowWrap: 'break-word',
    padding: 5
  },
  incidentRow: {
    ...spacing.center,
    color: colors.white,
    backgroundColor: colors.gridHeaderRowBackground,
    cursor: 'pointer'
  },
  emptyIncidentsData: {
    ...spacing.center,
    backgroundColor: colors.white,
    padding: 10
  },
  lightBackground: {
    backgroundColor: colors.lightBackground,
    color: colors.black
  },
  darkBackground: {
    backgroundColor: colors.buildingCard,
    color: colors.black
  },
  incidentContent: {
    maxHeight: 550,
    overflowY: 'auto',
    overflowX: 'hidden'
  }
}));

const IncidentsTable = ({isLoading, response}: any) => {
  const dispatch = useDispatch();
  const triggerToggleActionSlider = (data: any) => dispatch(toggleActionSlider('security', 'SECURITY_INCIDENTS', data));
  return (
    <div>
      <Row style={styles.headerRow}>
        <Col xs={2} style={styles.incidentCell}>
          <Text variant="iconLabel">Status</Text>
        </Col>
        <Col xs={3} style={styles.incidentCell}>
          <Text variant="iconLabel">Type</Text>
        </Col>
        <Col xs={2} style={styles.incidentCell}>
          <Text variant="iconLabel">Location</Text>
        </Col>
        <Col xs={3} style={styles.incidentCell}>
          <Text variant="iconLabel">Description</Text>
        </Col>
        <Col xs={2} style={styles.incidentCell}>
          <Text variant="iconLabel">Created</Text>
        </Col>
      </Row>
      <div style={styles.incidentContent}>
        {isLoading ? (
          <Loader color="#304250" />
        ) : response && response?.length > 0 ? (
          response?.map((data: any, index: number) => {
            const lightBackground = index % 2 === 0;
            return (
              <Row
                style={{...styles.incidentRow, ...(lightBackground ? styles.lightBackground : styles.darkBackground)}}
                key={index + data.status}
                onClick={() => triggerToggleActionSlider(data)}
              >
                <Col xs={2} style={styles.incidentCell}>
                  <Text>{data.status ? data.status.toUpperCase() : ''}</Text>
                </Col>
                <Col xs={3} style={styles.incidentCell}>
                  <Text>{data.type ? data.type.toUpperCase() : ''}</Text>
                </Col>
                <Col xs={2} style={styles.incidentCell}>
                  <Text>{data.location ? data.location?.toUpperCase() : ''}</Text>
                </Col>
                <Col xs={3} style={styles.incidentCell}>
                  <Text>{data.description ? data.description?.toUpperCase() : ''}</Text>
                </Col>
                <Col xs={2} style={styles.incidentCell}>
                  <Text> {`${moment(data.created).format('DD-MM-YYYY HH:MM:SS')}`}</Text>
                </Col>
              </Row>
            );
          })
        ) : (
          <Row style={styles.emptyIncidentsData}>
            <Text variant="footNoteBold">No data found</Text>
          </Row>
        )}
      </div>
    </div>
  );
};

export default IncidentsTable;
