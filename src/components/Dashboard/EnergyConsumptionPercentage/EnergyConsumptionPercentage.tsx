import React, {CSSProperties} from 'react';
import 'react-circular-progressbar/dist/styles.css';
import {Styles} from '../../../types';

import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
import {useSelector} from 'react-redux';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    maxHeight: 220,
    backgroundColor: colors.chartsCardBackground
  },
  condensedContainer: {
    position: 'relative',
    left: 295,
    top: -105,
    minHeight: 100,
    maxHeight: 100,
    minWidth: 158,
    maxWidth: 158,
    backgroundColor: colors.buildingDetailsLightSideBackground
  },
  verticalContainer: {
    position: 'inherit',
    left: 0,
    minHeight: 100,
    maxHeight: 100,
    minWidth: 264,
    maxWidth: 264,
    backgroundColor: colors.buildingDetailsLightSideBackground
  },
  title: {
    ...spacing.center,
    textAlign: 'center',
    width: '100%',
    maxHeight: 40,
    color: colors.white,
    backgroundColor: colors.chartsCardHeaderBackground,
    marginBottom: 10,
    paddingTop: 20,
    paddingBottom: 20
  },
  headerWrapper: {
    ...spacing.flexHorizontally,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 18,
    maxWidth: 275,
    minWidth: 275,
    minHeight: 48,
    maxHeight: 48,
    backgroundColor: colors.buildingDetailsSideBackground
  },
  headerTitle: {
    width: '100%',
    textAlign: 'center',
    color: colors.white
  },
  content: {
    ...spacing.center,
    columnGap: 5,
    color: colors.white,
    textAlign: 'center'
  },
  numberContainer: {
    backgroundColor: '#2F2D28',
    width: 98,
    height: 90,
    textAlign: 'center',
    borderRadius: 9,
    marginTop: 10
  },
  number: {
    verticalAlign: 'middle',
    lineHeight: '90px'
  },
  condensedNumberContainer: {
    width: 70,
    height: 64
  },
  condensedNumber: {
    lineHeight: '64px'
  }
}));

const mobileStyles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  condensedContainer: {
    ...webStyles.condensedContainer,
    left: 215
  }
}));

export interface EnergyConsumptionPercentageProps {
  style?: CSSProperties;
  electricityPercentage: number;
  coolingPercentage: number;
  condensed?: boolean;
  vertical?: boolean;
}

export const EnergyConsumptionPercentage = ({
  style,
  electricityPercentage,
  coolingPercentage,
  condensed = false,
  vertical = false
}: EnergyConsumptionPercentageProps) => {
  const {mobileMode} = useSelector((s: any) => s.styling);
  const styles = mobileMode ? mobileStyles : webStyles;
  return (
    <div
      id="electricity"
      style={{
        ...styles.container,
        ...style,
        ...(condensed ? styles.condensedContainer : {}),
        ...(vertical ? styles.verticalContainer : {})
      }}
    >
      {!condensed && (
        <div style={styles.title}>
          <Text variant="cardHeader">ENERGY CONSUMPTION</Text>
        </div>
      )}
      <div id="content" style={styles.content}>
        <div>
          <Text variant={condensed ? 'footNoteBold' : 'textLink'}>ELECTRICITY</Text>
          <div style={{...styles.numberContainer, ...(condensed ? styles.condensedNumberContainer : {})}}>
            <Text
              variant={condensed ? 'header' : 'largeNumericValue'}
              style={{...styles.number, ...(condensed ? styles.condensedNumber : {})}}
            >{`${electricityPercentage}%`}</Text>
          </div>
        </div>
        {coolingPercentage > 0 ? (
          <div style={condensed ? {marginLeft: 10} : {}}>
            <Text variant={condensed ? 'footNoteBold' : 'textLink'}>COOLING</Text>
            <div style={{...styles.numberContainer, ...(condensed ? styles.condensedNumberContainer : {})}}>
              <Text
                variant={condensed ? 'header' : 'largeNumericValue'}
                style={{...styles.number, ...(condensed ? styles.condensedNumber : {})}}
              >{`${coolingPercentage}%`}</Text>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
