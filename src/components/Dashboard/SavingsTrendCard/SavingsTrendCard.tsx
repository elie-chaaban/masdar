// @ts-nocheck
import React from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
import {Insight} from '../../../utils/dashboard';
import {SavingsChart} from './SavingsChart';
import {useFilterCategory} from '../../../hooks';
import {shallowEqual, useSelector} from 'react-redux';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    maxHeight: 340,
    width: 455,
    backgroundColor: colors.chartsCardBackground
  },
  condensedContainer: {
    minWidth: 557,
    maxWidth: 557,
    minHeight: 243,
    maxHeight: 243,
    marginLeft: 1,
    backgroundColor: colors.buildingDetailsLightSideBackground
  },
  titleWrapper: {
    ...spacing.centerVertically,
    flex: 0,
    width: '100%',
    textAlign: 'center',
    backgroundColor: colors.chartsCardHeaderBackground,
    color: colors.white,
    paddingTop: 20,
    paddingBottom: 20,
    maxHeight: 40
  },
  condensedTitleWrapper: {
    justifyContent: 'flex-start',
    paddingTop: 12,
    paddingBottom: 0,
    minHeight: 48,
    maxHeight: 48,
    backgroundColor: colors.buildingDetailsSideBackground
  }
}));

const tabletStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  condensedContainer: {
    ...webStyles.condensedContainer,
    minWidth: 400,
    maxWidth: 400
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  condensedContainer: {
    width: '100%',
    minHeight: 243,
    maxHeight: 243,
    justifyContent: 'center',
    backgroundColor: colors.buildingDetailsLightSideBackground
  }
}));

export interface SavingsTrendCardProps {
  style?: CSSProperties;
  insight: Insight;
  data: null;
  condensed?: boolean;
  tabletMode?: boolean;
  mobileMode?: boolean;
}

export const SavingsTrendCard = ({
  insight,
  data,
  style,
  condensed = false,
  tabletMode = false,
  mobileMode = false
}: SavingsTrendCardProps) => {
  const styles = mobileMode ? mobileStyles : tabletMode ? tabletStyles : webStyles;
  const {filter, startDate} = useSelector((s: any) => s.dashboard.dateFilter, shallowEqual);
  const getFilter = useFilterCategory(startDate, filter, condensed);

  return (
    <div
      style={{
        ...styles.container,
        ...style,
        ...(condensed ? styles.condensedContainer : {})
      }}
    >
      <div style={{...styles.titleWrapper, ...(condensed ? styles.condensedTitleWrapper : {})}}>
        <Text variant="cardHeader">{insight} SAVINGS TREND</Text>
      </div>
      <SavingsChart
        categories={getFilter}
        series={data}
        condensed={condensed}
        tabletMode={tabletMode}
        mobileMode={mobileMode}
        insight={insight}
      />
    </div>
  );
};
