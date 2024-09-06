import React, {CSSProperties} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
import {isNumber} from 'lodash';
//@ts-ignore
import cleanElectricityImage from '../../../assets/images/icons/clean-electricity-image.png';
import {formatDecimals} from '../../../utils/dashboard';
import {useSelector} from 'react-redux';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 166,
    maxHeight: 166,
    minWidth: 267,
    maxWidth: 267,
    borderRadius: 2,
    cursor: 'pointer'
  },
  topSection: {
    ...spacing.flexHorizontally,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.consumptionCardBackground,
    color: colors.white,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 22,
    paddingRight: 17,
    minWidth: 267,
    minHeight: 78
  },
  topSectionLeftSide: {
    ...spacing.flexVertically,
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: 124,
    maxHeight: 50
  },
  topSectionRightSide: {
    ...spacing.center,
    maxWidth: 25,
    height: '100%'
  },
  valueText: {
    textAlign: 'left',
    color: colors.cleanElectricityBottomCard,
    width: '100%'
  },
  labelText: {
    textAlign: 'left',
    color: colors.white,
    width: '100%',
    lineHeight: '15px'
  },
  image: {
    width: 28,
    height: 28
  },
  percentageValue: {
    textAlign: 'center',
    color: colors.cleanElectricityBottomCard
  },
  bottomSection: {
    ...spacing.center,
    backgroundColor: colors.consumptionCardIconBackground,
    minWidth: 267,
    minHeight: 88,
    maxHeight: 88,
    borderRadius: 2,
    paddingTop: 12,
    paddingBottom: 16,
    color: colors.white
  },
  bottomSectionLeftSide: {
    ...spacing.center,
    maxWidth: 67,
    marginRight: 6
  },
  bottomSectionRightSide: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    alignItems: 'center',
    maxWidth: 165,
    lineHeight: '15px'
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...webStyles.container,
    marginRight: 80
  },
  topSection: {
    ...webStyles.topSection,
    minWidth: 430
  },
  topSectionLeftSide: {
    ...webStyles.topSectionLeftSide,
    marginLeft: '6rem'
  },
  bottomSection: {
    ...webStyles.bottomSection,
    minWidth: 430
  }
}));

export interface CleanElectricityCardProps {
  style?: CSSProperties;
  value: number;
  percentageValue?: number;
  onClick: () => void;
  districtName: string;
  numberOfBuildingsWithData: number;
}

export const CleanElectricityCard = ({
  value,
  percentageValue,
  onClick,
  style,
  districtName,
  numberOfBuildingsWithData
}: CleanElectricityCardProps) => {
  const {mobileMode} = useSelector((s: any) => s.styling);
  const styles = mobileMode ? mobileStyles : webStyles;
  return (
    <div style={{...styles.container, ...style}} onClick={onClick}>
      <div style={styles.topSection}>
        <div
          style={{
            ...styles.topSectionLeftSide,
            ...(window.innerWidth <= 390 ? {marginLeft: '13rem'} : {})
          }}
        >
          <Text style={styles.valueText} variant="boldCardHeader">
            {value ? (isNumber(value) ? formatDecimals(value, 0) : value) : '0'}
          </Text>
          <Text style={styles.labelText} variant="actionLabelBold">
            {'GENERATED CLEAN ELECTRICITY (MWh)'}
          </Text>
        </div>
        <div style={styles.topSectionRightSide}>
          <img style={styles.image} src={cleanElectricityImage} alt="clean-electricity" />
        </div>
      </div>
      <div style={styles.bottomSection}>
        <div style={styles.bottomSectionLeftSide}>
          <Text style={styles.percentageValue} variant="largeNumericValue">
            {`${percentageValue ? formatDecimals(percentageValue, 0) : 0}%`}
          </Text>
        </div>
        <div style={styles.bottomSectionRightSide}>
          <Text variant="actionLabelBold">{`of the consumed`}</Text>
          <Text variant="actionLabelBold">{`electricity in the ${numberOfBuildingsWithData}`}</Text>
          <Text variant="actionLabelBold">{`connected buildings`}</Text>
        </div>
      </div>
    </div>
  );
};
