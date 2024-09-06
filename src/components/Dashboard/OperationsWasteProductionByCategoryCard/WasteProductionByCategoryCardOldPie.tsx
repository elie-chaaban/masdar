import React, {CSSProperties} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
//@ts-ignore
import Chart from '../../Utils/Chart';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    maxHeight: 250,
    backgroundColor: colors.chartsCardBackground
  },
  condensedContainer: {
    minWidth: 557,
    maxWidth: 557,
    minHeight: 243,
    maxHeight: 243,
    marginLeft: 1,
    justifyContent: 'center',
    backgroundColor: colors.buildingDetailsLightSideBackground
  },
  titleWrapper: {
    ...spacing.center,
    textAlign: 'center',
    width: '100%',
    maxHeight: 40,
    color: colors.white,
    backgroundColor: colors.chartsCardHeaderBackground,
    paddingTop: 20,
    paddingBottom: 20
  },
  condensedTitleWrapper: {
    minHeight: 48,
    maxHeight: 48,
    backgroundColor: colors.buildingDetailsSideBackground
  },
  sectionsWrapper: {
    ...spacing.center
  }
}));

export interface ListItem {
  id: string;
  name: string;
  y: number;
  z: number;
}

export interface WasteProductionByCategoryCardOldPieProps {
  style?: CSSProperties;
  list: ListItem[];
  condensed?: boolean;
}

export const WasteProductionByCategoryCardOldPie = ({style, list, condensed = false}: WasteProductionByCategoryCardOldPieProps) => {
  return (
    <div style={{...styles.container, ...style, ...(condensed ? styles.condensedContainer : {})}}>
      <div style={{...styles.titleWrapper, ...(condensed ? styles.condensedTitleWrapper : {})}}>
        <Text variant="cardHeader">{'WASTE DATA BY CATEGORY'}</Text>
      </div>
      <div style={styles.sectionsWrapper}>
        <Chart type="variablepie" series={list} height={condensed ? 160 : 200} />
      </div>
    </div>
  );
};
