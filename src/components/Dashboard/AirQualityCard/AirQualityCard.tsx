import React, {CSSProperties, useCallback} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
import './styles.css';

//@ts-ignore
import blueDotIcon from '../../../assets/images/icons/blue-dot-rectangle.png';
//@ts-ignore
import purpleDotIcon from '../../../assets/images/icons/purple-dot-rectangle.png';
//@ts-ignore
import arrowDownIcon from '../../../assets/images/icons/arrow-down-right.png';
//@ts-ignore
import airIcon from '../../../assets/images/icons/air-icon.png';
//@ts-ignore
import compassIcon from '../../../assets/images/icons/compass-icon.png';

import {shallowEqual, useSelector} from 'react-redux';
import {retrieveIconPath} from '../../../utils/dashboard';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 399,
    maxHeight: 399,
    minWidth: 267,
    maxWidth: 267,
    borderRadius: 2,
    cursor: 'pointer'
  },
  titleSection: {
    ...spacing.center,
    width: '100%',
    maxHeight: 47,
    paddingTop: 12,
    paddingLeft: 29.7,
    paddingRight: 45,
    paddingBottom: 13.5,
    color: colors.white,
    backgroundColor: colors.consumptionCardBackground
  },
  compassIcon: {
    width: 23,
    height: 23,
    marginRight: 1
  },
  airIcon: {
    width: 26,
    height: 22
  },
  titleHeaderWrapper: {
    ...spacing.flexVertically,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  titleText: {
    marginLeft: 13
  },
  blueDotIcon: {
    width: 11,
    height: 7
  },
  purpleDotIcon: {
    width: 13,
    height: 7
  },
  parametersTextWrapper: {
    ...spacing.center,
    justifyContent: 'normal',
    width: '100%',
    maxHeight: 49,
    paddingTop: 12,
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 14,
    backgroundColor: colors.consumptionCardBackground
  },
  parametersText: {
    textAlign: 'left',
    color: colors.white,
    minWidth: 110,
    marginLeft: 4
  },
  airQualityParametersSection: {
    ...spacing.centerVertically,
    maxHeight: 303,
    backgroundColor: colors.consumptionCardIconBackground
    // flex: 0
  },
  airQualityParameterCard: {
    ...spacing.center,
    minHeight: 100.5,
    maxHeight: 100.5,
    borderTop: '1px solid #6B6B6B',
    paddingTop: 11,
    paddingBottom: 13.5,
    paddingLeft: 21,
    paddingRight: 14
  },
  airQualityParameterCardLeft: {
    ...spacing.center,
    minWidth: 76,
    maxWidth: 76,
    marginRight: 31
  },
  airQualityParameterCardLeftIcon: {
    width: 76,
    height: 76
  },
  airQualityParameterCardRight: {
    ...spacing.centerVertically,
    minWidth: 125,
    maxWidth: 125
  },
  airQualityParameterCardRightTop: {
    ...spacing.flexHorizontally,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  airQualityParameterCardRightTopValue: {
    ...spacing.centerVertically,
    maxWidth: 43
  },
  airQualityParameterCardRightBottom: {
    ...spacing.center,
    textAlign: 'center',
    color: colors.white,
    marginTop: 6
  },
  airQualityParameterCardTitleWrapper: {
    padding: 5,
    width: '100%',
    backgroundColor: colors.airQualityParameterCardHeader,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    minWidth: 112,
    maxWidth: 112
  },
  airQualityParameterCardTitleText: {
    textAlign: 'left',
    width: '100%',
    color: colors.white
  },
  airQualityParameterCardValuesWrapper: {
    ...spacing.flexHorizontally,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 92,
    maxWidth: 92,
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 8,
    paddingRight: 7,
    backgroundColor: colors.airQualityParameterCard,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4
  },
  airQualityParameterCardFromValueWrapper: {
    ...spacing.flexHorizontally,
    justifyContent: 'center',
    alignContent: 'flex-start',
    minHeight: 31,
    marginTop: 4
  },
  airQualityParameterCardFromValueText: {
    textAlign: 'center',
    width: '100%',
    marginLeft: 2,
    color: colors.white
  },
  airQualityParameterCardFromValueIcon: {
    marginTop: 4
  },
  airQualityParameterCardToValueIcon: {
    alignSelf: 'flex-end',
    marginBottom: 8
  },
  airQualityParameterCardArrowWrapper: {
    ...spacing.flexHorizontally,
    justifyContent: 'center',
    alignContent: 'flex-end',
    minHeight: 30,
    marginRight: 5
  },
  arrowIcon: {
    ...spacing.flex,
    flex: 0,
    alignSelf: 'flex-end',
    width: 14,
    height: 13,
    marginBottom: 4
  },
  airQualityParameterCardToValueWrapper: {
    ...spacing.flexHorizontally,
    justifyContent: 'center',
    alignContent: 'flex-end',
    minHeight: 34
  },
  airQualityParameterCardToValueText: {
    textAlign: 'center',
    width: '100%',
    color: colors.white
  },
  airQualityParameterCardFromValueBottom: {width: 44, height: 4, backgroundColor: '#7EF7FF', borderRadius: 15},
  airQualityParameterCardToValueContainer: {
    ...spacing.center,
    width: 50,
    height: 19,
    backgroundColor: '#59609B',
    borderRadius: 8
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    borderRadius: 2,
    cursor: 'pointer'
  },
  airQualityParameterCard: {
    ...webStyles.airQualityParameterCard,
    minHeight: 77,
    borderTop: 'none'
  },
  airQualityParametersSection: {
    ...webStyles.airQualityParametersSection,
    width: '100%',
    maxHeight: 279
  },
  blueDotIcon: {
    ...webStyles.blueDotIcon,
    marginLeft: '5rem'
  }
}));

export interface AirQualityParameter {
  id: string;
  title: string;
  districtValue: number;
  cityValue: number;
  icon: string;
}

export interface AirQualityCardProps {
  style?: CSSProperties;
  list: AirQualityParameter[];
  onClick?: () => void;
}

export const AirQualityCard = ({list, onClick, style}: AirQualityCardProps) => {
  const {icons} = useSelector((s: any) => s.themeIcons);
  const {districtInfo} = useSelector((s: any) => s.map, shallowEqual);
  const {mobileMode} = useSelector((s: any) => s.styling);
  const styles = mobileMode ? mobileStyles : webStyles;

  const renderCard = useCallback(
    (item: AirQualityParameter): JSX.Element => {
      return (
        <div key={`air-quality-parameter-card-${item.id}`} style={styles.airQualityParameterCard}>
          <div style={styles.airQualityParameterCardLeft}>
            <img style={styles.airQualityParameterCardLeftIcon} src={item.icon} alt="" />
          </div>
          <div style={styles.airQualityParameterCardRight}>
            <div style={styles.airQualityParameterCardRightTop}>
              <div style={styles.airQualityParameterCardRightTopValue}>
                <Text style={styles.airQualityParameterCardFromValueText} variant="extraBoldNumericValue">
                  {item.districtValue.toFixed(0)}
                </Text>
                <div style={styles.airQualityParameterCardFromValueBottom}></div>
              </div>
              <div style={styles.airQualityParameterCardRightTopValue}>
                <div style={styles.airQualityParameterCardToValueContainer}>
                  <Text style={styles.airQualityParameterCardToValueText} variant="iconLabel">
                    {item.cityValue.toFixed(0)}
                  </Text>
                </div>
              </div>
            </div>
            <div style={styles.airQualityParameterCardRightBottom}>
              <Text variant="actionLabelBold">{item.title}</Text>
            </div>
          </div>
        </div>
      );
    },
    [styles]
  );

  return (
    <div style={{...styles.container}} onClick={onClick}>
      <div style={styles.titleSection}>
        <img
          style={styles.compassIcon}
          src={icons['compass-icon'] ? `${retrieveIconPath(icons['compass-icon'])}` : compassIcon}
          alt="compass"
        />
        <img style={styles.airIcon} src={icons['air-icon'] ? `${retrieveIconPath(icons['air-icon'])}` : airIcon} alt="air" />
        <Text style={styles.titleText} variant="iconLabel">
          {'AIR QUALITY'}
        </Text>
      </div>
      <div style={styles.airQualityParametersSection}>{list && list.map((item) => renderCard(item))}</div>
      <div style={styles.parametersTextWrapper}>
        <img
          style={{
            ...styles.blueDotIcon,
            ...(window.innerWidth <= 390 ? {marginLeft: '13rem'} : {})
          }}
          src={blueDotIcon}
          alt="blue-dot"
        />
        <Text style={styles.parametersText} variant="actionLabelNormal">
          {`${districtInfo?.name.toUpperCase()} City`}
        </Text>
        <img style={styles.purpleDotIcon} src={purpleDotIcon} alt="yellow-dot" />
        <Text style={styles.parametersText} variant="actionLabelNormal">
          {'Abu Dhabi'}
        </Text>
      </div>
    </div>
  );
};
