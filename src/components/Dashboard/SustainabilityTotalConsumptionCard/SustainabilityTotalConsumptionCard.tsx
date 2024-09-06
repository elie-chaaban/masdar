import React, {useCallback, CSSProperties} from 'react';
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {Styles} from '../../../types';
// @ts-ignore
import energyIcon from '../../../assets/images/icons/blue_energy_consumption.png';
// @ts-ignore
import waterIcon from '../../../assets/images/icons/blue_water_consumption.png';
// @ts-ignore
import wasteIcon from '../../../assets/images/icons/blue_waste_consumption.png';
// @ts-ignore
import upArrowIcon from '../../../assets/images/icons/red-up-arrow-icon.png';
// @ts-ignore
import downArrowIcon from '../../../assets/images/icons/green-down-arrow-icon.png';
// @ts-ignore
import carIcon from '../../../assets/images/icons/car-icon.png';
//@ts-ignore
import co2Icon from '../../../assets/images/icons/blue_carbon_icon.png';
//@ts-ignore
import greenSmallArrowDown from '../../../assets/images/icons/green_small_arrow_down.png';
//@ts-ignore
import redSmallArrowUp from '../../../assets/images/icons/red_small_arrow_up.png';
//@ts-ignore
import blueSmallRectangle from '../../../assets/images/icons/blue_small_rectangle.png';
//@ts-ignore
import hasNodata from '../../../assets/images/icons/no-data.png';

import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
import {isNumber} from 'lodash';
import {
  formatDecimals,
  Insight,
  retrieveIconPath,
  TrendLineOrBreakdown,
  UnitFormat,
  unitFormatter,
  valueFormatter
} from '../../../utils/dashboard';
import {useSelector} from 'react-redux';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.centerVertically,
    minHeight: 164,
    maxHeight: 221,
    maxWidth: 512,
    minWidth: 512,
    borderRadius: 2,
    backgroundColor: colors.consumptionCardBackground,
    cursor: 'pointer'
  },
  condensedContainer: {
    minHeight: 243,
    maxHeight: 243,
    minWidth: 474,
    maxWidth: 474,
    marginLeft: 1,
    backgroundColor: colors.buildingDetailsLightSideBackground
  },
  verticalContainer: {
    flexDirection: 'column',
    minHeight: 0,
    maxHeight: 373,
    minWidth: 264,
    maxWidth: 264,
    marginLeft: 0,
    backgroundColor: colors.buildingDetailsLightSideBackground
  },
  headerWrapper: {
    ...spacing.flexHorizontally,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 18,
    maxWidth: 649,
    minWidth: 474,
    minHeight: 48,
    maxHeight: 48,
    backgroundColor: colors.buildingDetailsSideBackground
  },
  verticalHeaderWrapper: {
    maxWidth: 264,
    minWidth: 264,
    minHeight: 48,
    maxHeight: 48
  },
  headerTitle: {
    width: '100%',
    textAlign: 'center',
    color: colors.white
  },
  sections: {
    ...spacing.flexHorizontally,
    width: '100%',
    maxHeight: 164
  },
  condensedSections: {
    maxHeight: 195
  },
  leftSection: {
    ...spacing.centerVertically,
    minWidth: 188,
    maxHeight: 164,
    backgroundColor: colors.consumptionCardIconBackground
  },
  condensedLeftSection: {
    minHeight: 195,
    maxHeight: 195
  },
  rightSection: {
    ...spacing.flexVertically
    //minWidth: 316
  },
  verticalRightSection: {
    minWidth: 264
  },
  condensedRightSection: {
    minHeight: 195,
    maxHeight: 195
  },
  icon: {
    ...spacing.flex,
    marginBottom: 15
  },
  iconLabel: {
    ...spacing.flex,
    maxWidth: 150,
    maxHeight: 40,
    color: colors.white
  },
  title: {
    width: '100%',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 16,
    maxHeight: 16
  },
  condensedTitle: {
    marginBottom: 25,
    marginTop: 25,
    maxHeight: 12
  },
  energyCondensedTitle: {
    maxWidth: 300,
    minWidth: 300
  },
  verticalCondensedTitle: {
    marginBottom: 0,
    marginTop: 0,
    maxHeight: 0
  },
  titleText: {
    color: colors.white
  },
  carbonValues: {
    ...spacing.flex,
    justifyContent: 'center',
    maxHeight: 35,
    minHeight: 35,
    width: '100%'
    // paddingLeft: 16,
    // paddingRight: 16
  },
  values: {
    ...spacing.flex,
    justifyContent: 'center',
    maxHeight: 66,
    minHeight: 66,
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16
  },
  energyCondensedValues: {
    minWidth: 300,
    maxWidth: 300
  },
  verticalEnergyCondensedValues: {
    minWidth: 264,
    maxWidth: 264
  },
  valueWithTitleWrapper: {
    ...spacing.flexVertically,
    justifyContent: 'space-between',
    alignItems: 'center',
    maxHeight: 35,
    minHeight: 35
  },
  valueWrapper: {
    ...spacing.flexVertically,
    justifyContent: 'space-between',
    alignItems: 'center',
    maxHeight: 66,
    minHeight: 66
  },
  baseline: {
    ...spacing.center,
    minHeight: 12,
    maxHeight: 12,
    minWidth: 104,
    borderRadius: 4,
    color: colors.white,
    backgroundColor: colors.textButton,
    marginBottom: 4
  },
  unit: {
    ...spacing.flex,
    textAlign: 'center',
    color: colors.white,
    maxHeight: 16
  },
  value: {
    ...spacing.flex,
    maxHeight: 35,
    minHeight: 35,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8
  },
  valueTitle: {
    ...spacing.flex,
    textAlign: 'center',
    color: colors.white
  },
  impactWrapper: {
    ...spacing.center,
    width: '100%',
    borderTop: '1px solid #6B6B6B',
    maxHeight: 50
  },
  impactCard: {
    ...spacing.center,
    justifyContent: 'space-between',
    borderRadius: 4,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 5,
    paddingBottom: 5,
    maxWidth: 478.91,
    maxHeight: 36,
    marginTop: 11,
    marginBottom: 10,
    backgroundColor: colors.consumptionCardInnerCardBackground
  },
  condensedImpactCardWrapper: {
    ...spacing.flex,
    width: '100%',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 0,
    marginBottom: 0
  },
  condensedImpactCard: {
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 0,
    marginBottom: 0
  },
  verticalImpactCard: {
    flexDirection: 'column',
    width: 235,
    minHeight: 60
  },
  impactItem: {
    ...spacing.center
  },
  impactCardHighBackground: {
    // backgroundColor: colors.impactCardContainerHigh
    backgroundColor: colors.consumptionCardInnerCardBackground
  },
  impactCardLowBackground: {
    // backgroundColor: colors.impactCardContainerLow
    backgroundColor: colors.consumptionCardInnerCardBackground
  },
  impactIcon: {
    width: 20,
    height: 20,
    marginRight: 6
  },
  carIcon: {
    width: 28,
    height: 13,
    marginRight: 6
  },
  impactValueText: {
    color: colors.white
  },
  titleWithValueWrapper: {
    ...spacing.centerVertically,
    minWidth: 233,
    maxWidth: 233,
    maxHeight: 80,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 6,
    paddingBottom: 8,
    marginTop: 25,
    borderRadius: 9,
    backgroundColor: colors.consumptionCardInnerCardBackground,
    marginBottom: 7,
    color: colors.white,
    alignSelf: 'center'
  },
  titleValue: {
    ...spacing.centerVertically,
    maxHeight: 50
    // alignItems: 'baseline'
  },
  preValue: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    alignItems: 'center',
    maxHeight: 33,
    maxWidth: 48,
    color: colors.consumptionCardPositivePercentage
  },
  preNegativeValue: {
    color: colors.consumptionCardNegativePercentage
  },
  greenSmallArrowDown: {
    width: 10.91,
    height: 12,
    marginBottom: 1
  },
  baselineLegendWrapper: {
    ...spacing.flex,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxHeight: 21,
    marginTop: 13.7
  },
  baselineLegend: {
    ...spacing.flexHorizontally,
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 90,
    maxHeight: 21,
    color: colors.white
  },
  blueSmallRectangle: {
    width: 15.27,
    height: 7,
    marginRight: 10.91
  },
  wasteCircularProgressbarWrapper: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    alignItems: 'center',
    maxHeight: 84
  },
  wasteCircularProgressbar: {
    ...spacing.center,
    width: 70,
    height: 70
  },
  wasteCircularProgressbarLabelWrapper: {
    ...spacing.center,
    color: colors.white,
    textAlign: 'center',
    maxHeight: 24,
    maxWidth: 98.18,
    marginTop: 5
  },
  extraMarginTop: {
    marginTop: -90
  },
  hasNoData: {
    width: 64,
    height: 64,
    marginTop: -15
  },
  noDataContainer: {
    ...spacing.centerVertically
  },
  noDataText: {
    ...spacing.flex,
    textAlign: 'center',
    color: colors.white,
    maxHeight: 16,
    marginTop: 10
  }
}));

const tabletStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...webStyles.container,
    maxWidth: 418,
    minWidth: 418
  },
  condensedContainer: {
    ...webStyles.condensedContainer,
    minWidth: 400,
    maxWidth: 400
  },
  headerWrapper: {
    ...webStyles.headerWrapper,
    maxWidth: 400,
    minWidth: 400
  },
  leftSection: {
    ...webStyles.leftSection,
    minWidth: 156
  },
  rightSection: {
    ...webStyles.rightSection,
    minWidth: 262
  },
  iconLabel: {
    ...webStyles.iconLabel,
    maxWidth: 140
  }
}));

const mobileStyles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...webStyles.container,
    minWidth: '100%',
    maxWidth: '100%'
  },
  values: {
    ...webStyles.values,
    marginBottom: 37
  },
  hasNoData: {
    width: 47,
    height: 47,
    marginTop: 4
  },
  valueWrapper: {
    ...webStyles.valueWrapper,
    marginTop: 6
  },
  impactItem: {
    ...webStyles.impactItem,
    marginLeft: -45
  },
  titleWithValueWrapper: {
    ...webStyles.titleWithValueWrapper,
    minWidth: 140,
    maxWidth: 140
  },
  baseline: {
    ...webStyles.baseline,
    minWidth: 70
  },
  wasteCircularProgressbar: {
    ...webStyles.wasteCircularProgressbar,
    marginTop: -23
  },
  wasteCircularProgressbarLabelWrapper: {
    ...webStyles.wasteCircularProgressbarLabelWrapper,
    marginTop: 15
  },
  condensedContainer: {
    width: '100%',
    minHeight: 243,
    maxHeight: 243,
    justifyContent: 'center',
    backgroundColor: colors.buildingDetailsLightSideBackground
  },
  headerWrapper: {
    ...spacing.flexHorizontally,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 18,
    width: '100%',
    minHeight: 48,
    maxHeight: 48,
    backgroundColor: colors.buildingDetailsSideBackground
  },
  energyCondensedValues: {
    paddingRight: 48,
    paddingLeft: 0,
    minWidth: 224,
    maxWidth: 224,
    marginBottom: 26
  },
  condensedImpactCard: {
    ...webStyles.condensedImpactCard,
    marginBottom: 3
  }
}));

export enum ImpactState {
  raise = 'raise',
  drop = 'drop'
}

const impactTextByInsight = (insight: Insight, impactState: ImpactState, value: number): string => {
  switch (insight) {
    case Insight.ENERGY:
      return `${value.toFixed(0)}% Energy ${impactState === ImpactState.drop ? 'saved' : 'to offset'}`;
    case Insight.WATER:
      return `${value.toFixed(0)}% Water ${impactState === ImpactState.drop ? 'saved' : 'to offset'}`;
    case Insight.WASTE:
      return `${value.toFixed(0)}% Waste ${impactState === ImpactState.drop ? 'saved' : 'to offset'}`;
    default:
      return '';
  }
};

const carImpactTextByImpactState = (impactState: ImpactState, value: number): string => {
  return `${formatDecimals(value, 0)} Cars ${impactState === ImpactState.drop ? 'removed' : 'to offset'}`;
};

export const cardVariantIds = {
  energy: 'energy',
  water: 'water',
  waste: 'waste',
  carbon: 'carbon'
};

export type CardVariantId = keyof typeof cardVariantIds;

interface CardVariant {
  id: CardVariantId;
  defaultIcon: string;
  iconName?: string;
  iconLabel: string;
  title: string;
  width: number;
  height: number;
  condensed: {
    iconWidth: number;
    iconHeight: number;
  };
}

export type CardVariants = {[key in CardVariantId]: CardVariant};

const cardVariants: CardVariants = {
  energy: {
    id: 'energy',
    defaultIcon: energyIcon,
    iconName: 'energy-consumption-icon',
    iconLabel: 'ENERGY CONSUMPTION',
    title: '',
    width: 43.54,
    height: 44.52,
    condensed: {
      iconWidth: 24,
      iconHeight: 24
    }
  },
  water: {
    id: 'water',
    defaultIcon: waterIcon,
    iconName: 'water-consumption-icon',
    iconLabel: 'WATER CONSUMPTION',
    title: '',
    width: 54.61,
    height: 35,
    condensed: {
      iconWidth: 24,
      iconHeight: 24
    }
  },
  waste: {
    id: 'waste',
    defaultIcon: wasteIcon,
    iconName: 'waste-production-icon',
    iconLabel: 'WASTE PRODUCTION',
    title: '',
    width: 43.64,
    height: 35.45,
    condensed: {
      iconWidth: 26,
      iconHeight: 24
    }
  },
  carbon: {
    id: 'carbon',
    defaultIcon: co2Icon,
    iconName: 'carbon-footprint-icon',
    iconLabel: 'CARBON FOOTPRINT',
    title: '',
    width: 58.79,
    height: 31.35,
    condensed: {
      iconWidth: 24,
      iconHeight: 24
    }
  }
};

export interface ImpactCard {
  impactInsight: Insight;
  impactValue: number;
  impactState: ImpactState;
  carsSaved: number;
}

export interface CarbonCard {
  energyValue: number | string;
  waterValue: number | string;
  wasteValue: number | string;
  showDrillDown?: boolean;
}

export interface SustainabilityTotalConsumptionCardProps {
  style?: CSSProperties;
  cardVariant: CardVariantId;
  condensed?: boolean;
  vertical?: boolean;
  leftColumnValue?: number | string;
  leftColumnPreValue?: number | string;
  bottomLeftColumnValue?: number | string;
  leftColumnUnit?: string;
  rightColumnValue?: number | string;
  bottomRightColumnValue?: number | string;
  rightColumnUnit?: string;
  impactCard?: ImpactCard;
  carbonCard?: CarbonCard;
  onClickCard: (id: CardVariantId) => void;
  children?: React.ReactNode;
}

export const SustainabilityTotalConsumptionCard = ({
  style,
  cardVariant,
  condensed = false,
  vertical = false,
  leftColumnPreValue,
  leftColumnValue,
  bottomLeftColumnValue,
  leftColumnUnit,
  rightColumnValue,
  bottomRightColumnValue,
  rightColumnUnit,
  impactCard,
  carbonCard,
  onClickCard,
  children
}: SustainabilityTotalConsumptionCardProps) => {
  const {icons} = useSelector((s: any) => s.themeIcons);
  const {district} = useSelector((s: any) => s.map);
  const access = useSelector((s: any) => s.user.access.kpi);
  const {tabletMode, mobileMode} = useSelector((s: any) => s.styling);
  const hasEnergyAccess = access['energy']?.some((b: any) => b.district_id === district);
  const hasWaterAccess = access['water']?.some((b: any) => b.district_id === district);
  const hasWasteAccess = access['waste']?.some((b: any) => b.district_id === district);
  const hasCarbonAccess = access['carbon']?.some((b: any) => b.district_id === district);
  const variant = cardVariants[cardVariant];
  const styles = mobileMode ? mobileStyles : tabletMode ? tabletStyles : webStyles;
  const setOnClick = useCallback(
    (id: CardVariantId): (() => void) => {
      return () => onClickCard(id);
    },
    [onClickCard]
  );
  const calculateTotalCarbon = useCallback((): string => {
    if (carbonCard) {
      const energy =
        hasCarbonAccess && hasEnergyAccess
          ? isNumber(carbonCard.energyValue)
            ? carbonCard.energyValue
            : parseFloat(carbonCard.energyValue)
          : 0;
      const water =
        hasCarbonAccess && hasWaterAccess
          ? isNumber(carbonCard.waterValue)
            ? carbonCard.waterValue
            : parseFloat(carbonCard.waterValue)
          : 0;
      const waste =
        hasCarbonAccess && hasWasteAccess
          ? isNumber(carbonCard.wasteValue)
            ? carbonCard.wasteValue
            : parseFloat(carbonCard.wasteValue)
          : 0;
      let total = energy + water + waste;
      total = total > 1000 ? total / 1000 : total;
      return formatDecimals(total, 0);
    }
    return '0';
  }, [carbonCard, hasCarbonAccess, hasWasteAccess, hasEnergyAccess, hasWaterAccess]);

  const calculateTotalCarbonUnit = useCallback((): string => {
    if (carbonCard) {
      const energy =
        hasCarbonAccess && hasEnergyAccess
          ? isNumber(carbonCard.energyValue)
            ? carbonCard.energyValue
            : parseFloat(carbonCard.energyValue)
          : 0;
      const water =
        hasCarbonAccess && hasWaterAccess
          ? isNumber(carbonCard.waterValue)
            ? carbonCard.waterValue
            : parseFloat(carbonCard.waterValue)
          : 0;
      const waste =
        hasCarbonAccess && hasWasteAccess
          ? isNumber(carbonCard.wasteValue)
            ? carbonCard.wasteValue
            : parseFloat(carbonCard.wasteValue)
          : 0;
      let total = energy + water + waste;
      const unit = total > 1000 ? 'TONS' : 'KG';
      return unit;
    }
    return '0';
  }, [carbonCard, hasCarbonAccess, hasWasteAccess, hasEnergyAccess, hasWaterAccess]);

  const renderCarbonValues = useCallback((): JSX.Element => {
    if (!carbonCard || !carbonCard.showDrillDown) {
      return <></>;
    }
    return (
      <div style={styles.carbonValues}>
        {hasCarbonAccess && hasEnergyAccess && (
          <div style={styles.valueWithTitleWrapper}>
            <div style={styles.valueTitle}>
              <Text variant="actionLabelBold">{'ENERGY'}</Text>
            </div>
            <div style={styles.value}>
              <Text variant={mobileMode ? 'actionLabelNormal' : 'actionLabelBold'}>
                {`${valueFormatter(TrendLineOrBreakdown.CARBON, carbonCard.energyValue, UnitFormat.String)} ${unitFormatter(
                  TrendLineOrBreakdown.CARBON,
                  carbonCard.energyValue
                )}`}
              </Text>
            </div>
          </div>
        )}
        {hasCarbonAccess && hasWaterAccess && (
          <div style={styles.valueWithTitleWrapper}>
            <div style={styles.valueTitle}>
              <Text variant="actionLabelBold">{'WATER'}</Text>
            </div>
            <div style={styles.value}>
              <Text variant={mobileMode ? 'actionLabelNormal' : 'actionLabelBold'}>
                {`${valueFormatter(TrendLineOrBreakdown.CARBON, carbonCard.waterValue, UnitFormat.String)} ${unitFormatter(
                  TrendLineOrBreakdown.CARBON,
                  carbonCard.waterValue
                )}`}
              </Text>
            </div>
          </div>
        )}
        {hasCarbonAccess && hasWasteAccess && (
          <div style={styles.valueWithTitleWrapper}>
            <div style={styles.valueTitle}>
              <Text variant="actionLabelBold">{'WASTE'}</Text>
            </div>
            <div style={styles.value}>
              <Text variant={mobileMode ? 'actionLabelNormal' : 'actionLabelBold'}>
                {`${valueFormatter(TrendLineOrBreakdown.CARBON, carbonCard.wasteValue, UnitFormat.String)} ${unitFormatter(
                  TrendLineOrBreakdown.CARBON,
                  carbonCard.wasteValue
                )}`}
              </Text>
            </div>
          </div>
        )}
      </div>
    );
  }, [carbonCard, styles, hasCarbonAccess, hasEnergyAccess, hasWaterAccess, hasWasteAccess, mobileMode]);

  const renderImpactCard = useCallback(() => {
    return (
      impactCard && (
        <div
          style={{
            ...styles.impactCard,
            ...(condensed ? styles.condensedImpactCard : {}),
            ...(vertical ? styles.verticalImpactCard : {}),
            ...(cardVariant === 'energy' && !vertical && condensed ? styles.extraMarginTop : {}),
            // ...(impactCard.impactState === ImpactState.raise ? styles.impactCardHighBackground : styles.impactCardLowBackground)
            ...styles.impactCardLowBackground
          }}
        >
          <div
            style={{
              ...styles.impactItem,
              flex: 1,
              ...(window.innerWidth <= 390 ? {marginLeft: -16} : {})
            }}
          >
            <img
              style={styles.impactIcon}
              // src={impactCard.impactState === ImpactState.raise ? upArrowIcon : downArrowIcon}
              src={icons['down-arrow-icon'] ? `${retrieveIconPath(icons['down-arrow-icon'])}` : downArrowIcon}
              alt="impact-icon"
            />
            {/* <Text variant={impactCard.impactState === ImpactState.raise ? 'actionLabelBold' : 'textLink'} style={styles.impactValueText}>
                {impactTextByInsight(impactCard.impactInsight, impactCard.impactState, impactCard.impactValue)}
              </Text> */}
            <Text variant={condensed || mobileMode ? 'actionLabelBold' : 'textLink'} style={styles.impactValueText}>
              {impactTextByInsight(impactCard.impactInsight, impactCard.impactState, impactCard.impactValue)}
            </Text>
          </div>
          <div style={{...styles.impactItem, flex: 1, ...(mobileMode ? {marginRight: -31} : {})}}>
            <img style={styles.carIcon} src={icons['car-icon'] ? `${retrieveIconPath(icons['car-icon'])}` : carIcon} alt="car-icon" />
            {/* <Text variant={impactCard.impactState === ImpactState.raise ? 'actionLabelBold' : 'textLink'} style={styles.impactValueText}>
                {carImpactTextByImpactState(impactCard.impactState, impactCard.carsSaved)}
              </Text> */}
            <Text variant={condensed || mobileMode ? 'actionLabelBold' : 'textLink'} style={styles.impactValueText}>
              {carImpactTextByImpactState(impactCard.impactState, impactCard.carsSaved)}
            </Text>
          </div>
        </div>
      )
    );
  }, [condensed, vertical, styles, icons, impactCard, cardVariant, mobileMode]);

  return variant ? (
    <div
      style={{
        ...styles.container,
        ...(impactCard && impactCard.impactState === ImpactState.drop ? {maxHeight: 221} : {maxHeight: 164}),
        ...(condensed ? styles.condensedContainer : {}),
        ...(vertical ? styles.verticalContainer : {}),
        ...style
      }}
      onClick={setOnClick(cardVariant)}
    >
      {condensed && (
        <div style={{...styles.headerWrapper, ...(vertical ? styles.verticalHeaderWrapper : {})}}>
          <img style={{maxWidth: variant.condensed.iconWidth, maxHeight: variant.condensed.iconHeight}} src={variant.defaultIcon} alt="" />
          <div style={styles.headerTitle}>
            <Text variant="iconLabel">{variant.iconLabel}</Text>
          </div>
        </div>
      )}
      {/* ...(window.innerWidth <= 390 ? {marginLeft: 14} : {}) */}
      <div style={{...styles.sections, ...(condensed ? styles.condensedSections : {})}}>
        {!condensed && (
          <div
            style={{
              ...styles.leftSection,
              ...(condensed ? styles.condensedLeftSection : {})
            }}
          >
            <img
              // src={icons[variant.iconName!] ? `${retrieveIconPath(icons[variant.iconName!])}` : variant.defaultIcon}
              src={variant.defaultIcon}
              style={{...styles.icon, maxWidth: variant.width, maxHeight: variant.height}}
              alt="insight-icon"
            />
            <div style={styles.iconLabel}>
              <Text variant="iconLabel">{variant.iconLabel}</Text>
            </div>
          </div>
        )}
        <div
          style={{
            ...styles.rightSection,
            ...(condensed ? styles.condensedRightSection : {}),
            ...(vertical ? styles.verticalRightSection : {})
          }}
        >
          {variant.id === 'carbon' ? (
            <div style={styles.titleWithValueWrapper}>
              <Text variant="actionLabelBold" style={{...styles.titleText, minHeight: 16}}>
                {variant.title}
              </Text>
              <div style={styles.titleValue}>
                <Text variant="largeNumericValue">{calculateTotalCarbon()}</Text>
                <Text style={{marginTop: -5}} variant="actionLabelBold">
                  {calculateTotalCarbonUnit()}
                </Text>
              </div>
            </div>
          ) : (
            <div
              style={{
                ...styles.title,
                ...(condensed ? styles.condensedTitle : {}),
                ...(variant.id === 'energy' && condensed ? styles.energyCondensedTitle : {}),
                ...(vertical ? styles.verticalCondensedTitle : {})
              }}
            >
              <Text variant={condensed ? 'actionLabelBold' : 'textLink'} style={styles.titleText}>
                {variant.title}
              </Text>
            </div>
          )}
          {variant.id === 'carbon' && carbonCard ? (
            renderCarbonValues()
          ) : (
            <div
              style={{
                ...styles.values,
                ...(variant.id === 'waste' ? {marginTop: 16} : {}),
                ...(variant.id === 'energy' && condensed ? styles.energyCondensedValues : {}),
                ...(variant.id === 'energy' && condensed && vertical ? styles.verticalEnergyCondensedValues : {})
              }}
            >
              {leftColumnPreValue && (
                <div style={{...styles.preValue, ...(parseInt(leftColumnPreValue.toString()) >= 0 ? {} : styles.preNegativeValue)}}>
                  <img
                    style={styles.greenSmallArrowDown}
                    src={parseInt(leftColumnPreValue.toString()) >= 0 ? greenSmallArrowDown : redSmallArrowUp}
                    alt=""
                  />
                  <Text variant="boldCardHeader">
                    {`${
                      isNumber(leftColumnPreValue)
                        ? Math.abs(leftColumnPreValue).toLocaleString()
                        : Math.abs(parseFloat(leftColumnPreValue))
                    }%`}
                  </Text>
                </div>
              )}
              {leftColumnValue && (
                <div id="noDataDiv" style={styles.valueWrapper}>
                  {leftColumnValue === '0' ? (
                    <div style={styles.noDataContainer}>
                      <img style={styles.hasNoData} src={hasNodata} alt="NOData" />
                      <div style={styles.noDataText}>
                        <Text variant="actionLabelBold"> {'Data Unavailable'}</Text>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div id="leftcolumnvalue" style={styles.value}>
                        <Text variant={mobileMode ? 'boldNumericValue' : 'largeNumericValue'}>
                          {isNumber(leftColumnValue) ? leftColumnValue.toLocaleString() : leftColumnValue}
                        </Text>
                      </div>

                      {variant.id !== 'waste' && (
                        <div style={styles.baseline}>
                          <Text variant={mobileMode ? 'actionLabelNormal' : 'actionLabelBold'}>{bottomLeftColumnValue}</Text>
                        </div>
                      )}
                      <div id="leftcolumnUnit" style={styles.unit}>
                        <Text variant="actionLabelBold"> {leftColumnUnit}</Text>
                      </div>
                    </>
                  )}
                </div>
              )}
              {rightColumnValue &&
                (variant.id === 'waste' ? (
                  <div style={styles.wasteCircularProgressbarWrapper}>
                    {rightColumnValue !== '0' ? (
                      <>
                        <div id="circularbar" style={styles.wasteCircularProgressbar}>
                          <CircularProgressbar
                            value={isNumber(rightColumnValue) ? rightColumnValue : parseInt(rightColumnValue)}
                            text={`${rightColumnValue}%`}
                            styles={buildStyles({
                              pathColor: `#8EFF8B`,
                              strokeLinecap: 'round',
                              textSize: '24px',
                              textColor: 'white',
                              trailColor: '#403E3E'
                            })}
                          />
                        </div>
                        <div style={styles.wasteCircularProgressbarLabelWrapper}>
                          <Text variant={'footNoteBold'}>{rightColumnUnit}</Text>
                        </div>
                      </>
                    ) : (
                      <div style={styles.noDataContainer}>
                        <img style={styles.hasNoData} src={hasNodata} alt="NOData" />
                        <div style={styles.noDataText}>
                          <Text variant="actionLabelBold"> {'Data Unavailable'}</Text>
                        </div>
                      </div>
                    )}
                  </div>
                ) : rightColumnValue === '0' ? (
                  <div style={styles.noDataContainer}>
                    <img style={styles.hasNoData} src={hasNodata} alt="NOData" />
                    <div style={styles.noDataText}>
                      <Text variant="actionLabelBold"> {'Data Unavailable'}</Text>
                    </div>
                  </div>
                ) : (
                  <>
                    <div id="noDataDiv1" style={styles.valueWrapper}>
                      <div style={styles.value}>
                        <Text variant={mobileMode ? 'boldNumericValue' : 'largeNumericValue'}>
                          {isNumber(rightColumnValue) ? rightColumnValue.toLocaleString() : rightColumnValue}
                        </Text>
                      </div>
                      <div style={styles.baseline}>
                        <Text variant={mobileMode ? 'actionLabelNormal' : 'actionLabelBold'}>{bottomRightColumnValue}</Text>
                      </div>
                      <div style={styles.unit}>
                        <Text variant="actionLabelBold">{rightColumnUnit}</Text>
                      </div>
                    </div>
                  </>
                ))}
            </div>
          )}
          {variant.id === 'waste' || variant.id === 'carbon' ? (
            <div style={{minHeight: 13}}></div>
          ) : (
            <div
              style={{
                ...styles.baselineLegendWrapper,
                ...(condensed ? {marginTop: 4} : {}),
                ...(condensed && variant.id === 'energy' ? {maxWidth: 300} : {})
              }}
            >
              {mobileMode ? (
                ''
              ) : (
                <div style={styles.baselineLegend}>
                  <img style={styles.blueSmallRectangle} src={blueSmallRectangle} alt="" />
                  <Text variant="actionLabelBold">{'Baseline'}</Text>
                </div>
              )}
            </div>
          )}
          {children}
          {condensed && impactCard && impactCard.impactState === ImpactState.drop && (
            <div id="condensed1" style={styles.condensedImpactCardWrapper}>
              {renderImpactCard()}
            </div>
          )}
        </div>
      </div>
      {!condensed && impactCard && impactCard.impactState === ImpactState.drop && (
        <div style={styles.impactWrapper}>{renderImpactCard()}</div>
      )}
    </div>
  ) : (
    <></>
  );
};
