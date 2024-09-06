import React, {CSSProperties} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    maxHeight: 290,
    width: 455,
    borderRadius: 9,
    paddingLeft: 5,
    paddingRight: 22,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: colors.white
  },
  titleWrapper: {
    ...spacing.center,
    width: '100%',
    textAlign: 'center',
    marginBottom: 12
  },
  sectionsWrapper: {
    ...spacing.flexHorizontally
  },
  leftSection: {
    ...spacing.centerVertically,
    marginRight: 6
  },
  rightSection: {
    minWidth: 260,
    maxHeight: 230,
    overflowY: 'auto'
  },
  highlightedTitle: {
    ...spacing.center,
    width: '100%',
    marginBottom: 4
  },
  highlightedImage: {
    ...spacing.center,
    maxWidth: 180,
    maxHeight: 130,
    marginBottom: 4
  },
  highlightedConsumption: {
    ...spacing.center,
    alignItems: 'flex-end',
    width: '100%'
  },
  highlightedUnit: {
    ...spacing.center,
    alignItems: 'flex-start',
    marginTop: -4,
    width: '100%'
  },
  listItem: {
    ...spacing.flexVertically,
    width: 248,
    marginBottom: 6
  },
  listItemTitle: {
    ...spacing.flexHorizontally,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    paddingLeft: '1%',
    paddingRight: '1%',
    marginBottom: 4
  },
  listItemBar: {
    width: '100%',
    height: 20,
    borderRadius: 30,
    backgroundColor: colors.percentageBarBackground
  },
  listItemBarPercentage: {
    width: '0%',
    height: 20,
    borderRadius: 30
  },
  listItemBarPercentageText: {
    ...spacing.flex,
    width: '100%',
    height: 20,
    textAlign: 'right',
    color: colors.white,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: 10,
    paddingRight: 10
  },
  heatmapLow: {
    backgroundColor: colors.heatmapLow
  },
  heatmapMedium: {
    backgroundColor: colors.heatmapMedium
  },
  heatmapHigh: {
    backgroundColor: colors.heatmapHigh
  }
}));

export const cardVariantIds = {
  building: 'building',
  floor: 'floor'
};

export type CardVariantId = keyof typeof cardVariantIds;

interface CardVariant {
  id: CardVariantId;
  title: string;
}

export type CardVariants = {[key in CardVariantId]: CardVariant};

const cardVariants: CardVariants = {
  building: {
    id: 'building',
    title: 'HIGHEST BUILDING CONSUMPTION'
  },
  floor: {
    id: 'floor',
    title: 'HIGHEST FLOOR CONSUMPTION'
  }
};

export const barColorVariantIds = {
  high: 'high',
  medium: 'medium',
  low: 'low'
};

export type BarColorVariantId = keyof typeof barColorVariantIds;

const barColorVariantStyle: {[key in BarColorVariantId]: string} = {
  high: 'heatmapHigh',
  medium: 'heatmapMedium',
  low: 'heatmapLow'
};

export interface ListItem {
  title: string;
  barColorVariantId: BarColorVariantId;
  imageUrl: string;
  consumption: number;
  consumptionPercentage: number;
  unit: string;
}

export interface HighestConsumptionCardProps {
  style?: CSSProperties;
  cardVariant: CardVariantId;
  list: ListItem[];
}

export const HighestConsumptionCard = ({style, cardVariant, list}: HighestConsumptionCardProps) => {
  const variant = cardVariants[cardVariant];
  const highlightedItem = list && list.length ? list[0] : null;
  return (
    <div style={{...styles.container, ...style}}>
      <div style={styles.titleWrapper}>
        <Text variant="cardHeader">{variant.title}</Text>
      </div>
      <div style={styles.sectionsWrapper}>
        <div style={styles.leftSection}>
          <div style={styles.highlightedTitle}>
            <Text variant="miniHeader">{highlightedItem?.title || ''}</Text>
          </div>
          <div style={styles.highlightedImage}>
            <img src={highlightedItem?.imageUrl || ''} style={{width: '100%'}} />
          </div>
          <div style={styles.highlightedConsumption}>
            <Text variant="boldNumericValue">
              {highlightedItem && highlightedItem.consumption
                ? highlightedItem.consumption.toLocaleString() || highlightedItem.consumption
                : ''}
            </Text>
          </div>
          <div style={styles.highlightedUnit}>
            <Text variant="miniHeader">{highlightedItem?.unit || ''}</Text>
          </div>
        </div>
        <div style={styles.rightSection}>
          {list.map((item) => {
            const backgroundColor = styles[barColorVariantStyle[item.barColorVariantId]];
            return (
              <div key={`item-${item.title}`} style={styles.listItem}>
                <div style={styles.listItemTitle}>
                  <Text variant="miniLabel">{item.title}</Text>
                  <Text variant="miniHeader">{`${item.consumptionPercentage}%`}</Text>
                </div>
                <div style={styles.listItemBar}>
                  <div style={{...styles.listItemBarPercentage, width: `${item.consumptionPercentage}%`, ...backgroundColor}}>
                    <div style={styles.listItemBarPercentageText}>
                      {/* <Text variant="footNote">{`${item.consumptionPercentage}%`}</Text> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
