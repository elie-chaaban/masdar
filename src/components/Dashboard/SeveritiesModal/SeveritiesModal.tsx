import React, {CSSProperties} from 'react';
import {Styles} from '../../../types';

import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';

import 'animate.css';
import './styles.css';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    width: 260,
    height: 125,
    backgroundColor: colors.transparentLight
  },
  titleWrapper: {
    ...spacing.flex,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    textAlign: 'center'
  },
  severities: {
    ...spacing.flexHorizontally
  },
  severity: {
    ...spacing.flexVertically
  },
  header: {
    ...spacing.center,
    width: '100%',
    minHeight: 40,
    textAlign: 'center'
  },
  headerText: {
    color: colors.white
  },
  value: {
    ...spacing.center,
    width: '100%',
    minHeight: 55,
    textAlign: 'center'
  },
  valueBorders: {
    borderLeft: 1,
    borderLeftStyle: 'solid',
    borderLeftColor: colors.white,
    borderRight: 1,
    borderRightStyle: 'solid',
    borderRightColor: colors.white
  },
  valueText: {},
  lifeAndSafetyBackground: {
    backgroundColor: colors.heatmapHigh
  },
  criticalBackground: {
    backgroundColor: colors.heatmapMedium
  },
  maintenanceBackground: {
    backgroundColor: colors.heatmapLow
  }
}));

export interface Severity {
  lifeSafety: number;
  critical: number;
  maintenance: number;
}

export interface SeveritiesModalProps {
  style?: CSSProperties;
  title: string;
  severity: Severity;
}

export const SeveritiesModal = ({style, title, severity}: SeveritiesModalProps) => {
  return (
    <div style={{...styles.container, ...(style ? style : {})}} className="animate__animated animate__bounceIn">
      <div style={styles.titleWrapper}>
        <Text variant="actionLabel">{title}</Text>
      </div>
      <div style={styles.severities}>
        <div style={styles.severity}>
          <div style={{...styles.header, ...styles.lifeAndSafetyBackground}}>
            <Text style={styles.headerText} variant="miniHeader">
              {'LIFE & SAFETY'}
            </Text>
          </div>
          <div style={styles.value}>
            <Text style={styles.valueText} variant="largeSemiBoldNumericValue">
              {severity.lifeSafety}
            </Text>
          </div>
        </div>
        <div style={styles.severity}>
          <div style={{...styles.header, ...styles.criticalBackground}}>
            <Text style={styles.headerText} variant="miniHeader">
              {'CRITICAL'}
            </Text>
          </div>
          <div style={{...styles.value, ...styles.valueBorders}}>
            <Text style={styles.valueText} variant="largeSemiBoldNumericValue">
              {severity.critical}
            </Text>
          </div>
        </div>
        <div style={styles.severity}>
          <div style={{...styles.header, ...styles.maintenanceBackground}}>
            <Text style={styles.headerText} variant="miniHeader">
              {'MAINTENANCE'}
            </Text>
          </div>
          <div style={styles.value}>
            <Text style={styles.valueText} variant="largeSemiBoldNumericValue">
              {severity.maintenance}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};
