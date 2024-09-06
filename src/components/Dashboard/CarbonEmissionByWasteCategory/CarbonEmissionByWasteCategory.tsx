import React, {CSSProperties} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
// @ts-ignore
import organicWaste from '../../../assets/images/icons/organic_waste.png';
// @ts-ignore
import nonRecyclableWaste from '../../../assets/images/icons/non_recyclable_waste.png';
// @ts-ignore
import recyclableWaste from '../../../assets/images/icons/recyclable_waste.png';
// @ts-ignore
import hazardousWaste from '../../../assets/images/icons/hazardous_waste.png';
import {Insight, UnitFormat, formatDecimals, unitFormatter, valueFormatter} from '../../../utils/dashboard';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 14,
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: colors.white
  },
  titleWrapper: {
    textAlign: 'center',
    marginBottom: 30
  },
  cardWrapper: {
    ...spacing.flexHorizontally,
    justifyContent: 'center'
  },
  card: {
    ...spacing.flexVertically,
    width: 170,
    height: 150,
    backgroundColor: '#F2F6F8',
    borderRadius: 8,
    marginRight: 20,
    paddingLeft: '1rem',
    paddingTop: '1rem'
  },
  icon: {
    width: 20,
    height: 23,
    marginBottom: 5
  }
}));

export interface CarbonEmissionByWasteCategoryItem {
  organicTotal: number;
  recyclableTotal: number;
  nonRecyclableTotal: number;
  hazardousTotal: number;
}

export interface CarbonEmissionByWasteCategoryProps {
  style?: CSSProperties;
  items: CarbonEmissionByWasteCategoryItem;
}

export const CarbonEmissionByWasteCategory = ({style, items}: CarbonEmissionByWasteCategoryProps) => {
  return (
    <div style={{...styles.container, ...style}}>
      <div style={styles.titleWrapper}>
        <Text variant="cardHeader">CO2 EMISSION BY CATEGORY</Text>
      </div>

      <div style={styles.cardWrapper}>
        <div style={styles.card}>
          <img src={organicWaste} alt="Organic Waste" style={styles.icon} />
          <Text variant="optionLabel">Organic</Text>
          <Text variant="largeNumericValue">{valueFormatter(Insight.WASTE, formatDecimals(items.organicTotal, 0), UnitFormat.String)}</Text>
          <Text variant="actionLabel">{unitFormatter(Insight.WASTE, items.organicTotal)}</Text>
        </div>
        <div style={styles.card}>
          <img src={nonRecyclableWaste} alt="Non Recyclable Waste" style={styles.icon} />
          <Text variant="optionLabel">Non Recyclable</Text>
          <Text variant="largeNumericValue">
            {valueFormatter(Insight.WASTE, formatDecimals(items.nonRecyclableTotal, 0), UnitFormat.String)}
          </Text>
          <Text variant="actionLabel">{unitFormatter(Insight.WASTE, items.nonRecyclableTotal)}</Text>
        </div>
        <div style={styles.card}>
          <img src={recyclableWaste} alt="Recyclable Waste" style={styles.icon} />
          <Text variant="optionLabel">Recyclable</Text>
          <Text variant="largeNumericValue">
            {valueFormatter(Insight.WASTE, formatDecimals(items.recyclableTotal, 0), UnitFormat.String)}
          </Text>
          <Text variant="actionLabel">{unitFormatter(Insight.WASTE, items.recyclableTotal)}</Text>
        </div>
        <div style={{...styles.card, marginRight: 0}}>
          <img src={hazardousWaste} alt="Hazardous Waste" style={{...styles.icon, width: 25}} />
          <Text variant="optionLabel">Hazardous</Text>
          <Text variant="largeNumericValue">
            {valueFormatter(Insight.WASTE, formatDecimals(items.hazardousTotal, 0), UnitFormat.String)}
          </Text>
          <Text variant="actionLabel">{unitFormatter(Insight.WASTE, items.hazardousTotal)}</Text>
        </div>
      </div>
    </div>
  );
};
