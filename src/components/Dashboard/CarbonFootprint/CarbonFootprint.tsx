import React, {CSSProperties} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
//@ts-ignore
import co2Icon from '../../../assets/images/icons/co2-icon.png';
//@ts-ignore
import treeIcon from '../../../assets/images/icons/tree-icon.png';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexHorizontally,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 26,
    paddingRight: 26,
    backgroundColor: colors.transparentLight
  },
  logoWrapper: {
    ...spacing.center
  },
  logoIcon: {
    // width: '100%'
  },
  logoText: {
    color: colors.black,
    textAlign: 'left',
    marginLeft: 6
  },
  carbonEmissionWrapper: {
    ...spacing.flexHorizontally,
    justifyContent: 'center',
    alignItems: 'baseline',
    width: '100%',
    height: '100%',
    marginLeft: 44
  },
  carbonEmissionValue: {
    color: colors.black
  },
  carbonEmissionUnit: {
    ...spacing.flex,
    alignItems: 'flex-end',
    marginLeft: 6,
    height: '100%'
  },
  offsetByWrapper: {
    ...spacing.flexHorizontally,
    justifyContent: 'center',
    alignItems: 'baseline',
    width: '100%',
    marginLeft: 44
  },
  offsetByText: {
    ...spacing.flex,
    alignItems: 'flex-end',
    color: colors.black,
    minWidth: 70
  },
  offsetByValue: {
    ...spacing.flex,
    alignItems: 'flex-end',
    color: colors.black,
    marginLeft: 6,
    marginRight: 4,
    height: '100%'
  },
  offsetByIcon: {
    width: 28,
    height: 33
  }
}));

export interface CarbonFootprintProps {
  style?: CSSProperties;
  carbonEmission: number | string;
  unit: string;
  offsetBy: number | string;
}

export const CarbonFootprint = ({style, carbonEmission, unit, offsetBy}: CarbonFootprintProps) => {
  return (
    <div style={{...styles.container, ...style}}>
      <div style={styles.logoWrapper}>
        <img src={co2Icon} style={styles.logoIcon} alt="carbon-icon" />
        <Text variant="iconLabel" style={styles.logoText}>
          {'CARBON FOOTPRINT'}
        </Text>
      </div>
      <div style={styles.carbonEmissionWrapper}>
        <Text variant="largeNumericValue" style={styles.carbonEmissionValue}>
          {carbonEmission}
        </Text>
        <Text variant="actionLabelBold" style={styles.carbonEmissionUnit}>
          {unit}
        </Text>
      </div>
      <div style={styles.offsetByWrapper}>
        <Text variant="actionLabelBold" style={styles.offsetByText}>
          {'OFFSET BY'}
        </Text>
        <Text variant="largeNumericValue" style={styles.offsetByValue}>
          {offsetBy}
        </Text>
        <img src={treeIcon} style={styles.offsetByIcon} alt="tree-icon" />
      </div>
    </div>
  );
};
