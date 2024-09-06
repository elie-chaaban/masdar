import React, {CSSProperties} from 'react';
import {Styles} from '../../../types';
import {createStyles, PrimaryPalette} from '../../../theme';
import {Text} from '../../Common/Text';
import {CircularProgressbarWithChildren} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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
  progressCardsWrapper: {
    ...spacing.flexHorizontally,
    justifyContent: 'space-around',
    width: '100%'
  },
  progressCard: {
    ...spacing.flexVertically,
    maxWidth: 115,
    maxHeight: 140
  },
  smallProgressCard: {
    maxWidth: 90
  },
  progressCardLabel: {
    ...spacing.flex,
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 10
  },
  valueText: {
    // color: colors.white
  },
  labelText: {
    textAlign: 'center'
  }
}));

export interface ConsumptionCardItem {
  value: string;
  unit: string;
  progress: number;
  label: string;
}

export interface ConsumptionCardProps {
  style?: CSSProperties;
  title: string;
  items: ConsumptionCardItem[];
}

export const ConsumptionCard = ({style, title, items}: ConsumptionCardProps) => {
  return (
    <div style={{...styles.container, ...style}}>
      <div style={styles.titleWrapper}>
        <Text variant="cardHeader">{title}</Text>
      </div>
      <div style={styles.progressCardsWrapper}>
        {items.map((item) => (
          <div
            key={`circular-progress-card-${item.label}`}
            style={{...styles.progressCard, ...(items.length > 2 ? styles.smallProgressCard : {})}}
          >
            <CircularProgressbarWithChildren
              // background
              // backgroundPadding={6}
              counterClockwise={true}
              value={item.progress}
              styles={{
                path: {stroke: PrimaryPalette.heatmapLow},
                // trail: {stroke: 'transparent'},
                background: {fill: PrimaryPalette.textButton}
              }}
            >
              <Text style={styles.valueText} variant="iconLabel">
                {item.value || 0}
              </Text>
              <Text style={styles.valueText} variant="miniHeader">
                {item.unit}
              </Text>
            </CircularProgressbarWithChildren>
            <div style={styles.progressCardLabel}>
              <Text style={styles.labelText} variant="normal">
                {item.label}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
