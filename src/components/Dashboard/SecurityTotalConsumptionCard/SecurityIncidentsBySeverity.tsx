import React from 'react';
import {Styles} from '../../../types';

import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.centerVertically,
    maxWidth: 360,
    borderRadius: 9,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 18,
    paddingBottom: 5,
    backgroundColor: colors.white,
    textAlign: 'center',
    maxHeight: 220
  },
  title: {
    ...spacing.center,
    textAlign: 'center',
    width: '100%',
    marginBottom: 20,
    maxHeight: 30
  },
  content: {
    ...spacing.center,
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10
  },
  totalContainer: {
    width: 115,
    height: 90,
    borderRadius: 6,
    backgroundColor: colors.securityIncidentsTotalBackground,
    color: colors.white
  },
  legendContainer: {
    ...spacing.center
  },
  legend: {
    ...spacing.centerVertically,
    width: 30,
    height: 18
  },
  legendColor: {width: 4, height: 16, marginRight: 4},
  legendHeader: {
    ...spacing.center
  }
}));

interface SecurityIncidentsBySeverityData {
  low: number;
  medium: number;
  high: number;
}

export interface SecurityIncidentsBySeverityProps {
  data: SecurityIncidentsBySeverityData;
}

export const SecurityIncidentsBySeverity = ({data}: SecurityIncidentsBySeverityProps) => {
  const totalIncidents = data?.low + data?.medium + data?.high;
  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <Text variant="iconLabel">SECURITY INCIDENTS BY SEVERITY</Text>
      </div>
      <div style={styles.content}>
        <div style={styles.totalContainer}>
          <Text variant="cardHeader">TOTAL</Text>
          <div>
            <Text variant="extraLargeNumericValue">{totalIncidents}</Text>
          </div>
        </div>
        <div style={styles.legendContainer}>
          <div style={styles.legend}>
            <div style={styles.legendHeader}>
              <div style={{...styles.legendColor, backgroundColor: '#63B0C0'}} />
              <Text variant="actionLabel">Low</Text>
            </div>
            <Text variant="largeNumericValue">{data?.low}</Text>
          </div>
          <div style={styles.legend}>
            <div style={styles.legendHeader}>
              <div style={{...styles.legendColor, backgroundColor: '#84374A'}} />
              <Text variant="actionLabel">Medium</Text>
            </div>
            <Text variant="largeNumericValue">{data?.medium}</Text>
          </div>
          <div style={styles.legend}>
            <div style={styles.legendHeader}>
              <div style={{...styles.legendColor, backgroundColor: '#39566B'}} />
              <Text variant="actionLabel">High</Text>
            </div>
            <Text variant="largeNumericValue">{data?.high}</Text>
          </div>
        </div>
      </div>
    </div>
  );
};
