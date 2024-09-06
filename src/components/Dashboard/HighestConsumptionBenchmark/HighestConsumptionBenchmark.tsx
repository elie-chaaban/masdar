// @ts-nocheck
import React, {CSSProperties, useCallback} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
// @ts-ignore
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {
  buildingSelection,
  wasteLocationSelection
  // @ts-ignore
} from '../../../reduxStore/actions';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    maxHeight: 555,
    width: '100%',
    backgroundColor: colors.chartsCardBackground
  },
  titleWrapper: {
    ...spacing.centerVertically,
    flex: 0,
    width: '100%',
    textAlign: 'center',
    marginBottom: 12,
    backgroundColor: colors.chartsCardHeaderBackground,
    color: colors.white,
    paddingTop: 20,
    paddingBottom: 20,
    maxHeight: 40
  },
  buildingsWrapper: {
    ...spacing.flexHorizontally,
    flexWrap: 'wrap',
    width: '100%',
    alignItems: 'center',
    gap: 3,
    textAlign: 'center',
    overflowX: 'auto',
    paddingLeft: 14,
    paddingBottom: 14
  },
  buildingCardWrapper: {
    ...spacing.flexVertically,
    minHeight: 120,
    maxHeight: 120,
    minWidth: 102,
    maxWidth: 102,
    backgroundColor: colors.buildingCard,
    borderRadius: 9,
    cursor: 'pointer'
  },
  buildingCardImage: {
    minWidth: 102,
    maxWidth: 102,
    minHeight: 42,
    maxHeight: 42
  },
  green: {
    color: colors.buildingCardGreenEfficiency
  },
  yellow: {
    color: colors.buildingCardYellowEfficiency
  },
  red: {
    color: colors.buildingCardRedEfficiency
  },
  buildingNameWrapper: {
    ...spacing.center,
    flex: 0,
    color: colors.white
  }
}));

const tabletStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...webStyles.container,
    width: 420
  },
  buildingCardWrapper: {
    ...webStyles.buildingCardWrapper,
    minWidth: 92,
    maxWidth: 92
  },
  buildingCardImage: {
    ...webStyles.buildingCardImage,
    minWidth: 92,
    maxWidth: 92
  }
}));

const mobileStyles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...spacing.flexVertically,
    maxHeight: 624,
    width: '100%',
    backgroundColor: colors.chartsCardBackground
  },
  buildingCardWrapper: {
    ...webStyles.buildingCardWrapper,
    minWidth: 119,
    maxWidth: 119
  },
  buildingsWrapper: {
    ...webStyles.buildingsWrapper,
    paddingLeft: 27
  },
  buildingsWrapperPRO: {
    ...webStyles.buildingsWrapper,
    paddingLeft: 6
  },
  buildingsWrapperXR: {
    ...webStyles.buildingsWrapper,
    paddingLeft: 20
  },
  buildingCardWrapperSE: {
    ...webStyles.buildingCardWrapper,
    minWidth: 110,
    maxWidth: 110
  },
  buildingsWrapperSE: {
    ...webStyles.buildingsWrapper,
    paddingLeft: 8
  }
}));

export interface ListItem {
  id: string;
  title: string;
  savingsPercentage: number;
  imageUrl: string;
}

export interface HighestConsumptionCardProps {
  style?: CSSProperties;
  list: ListItem[];
}

export const HighestConsumptionBenchmark = ({style, list}: HighestConsumptionCardProps) => {
  const dispatch = useDispatch();
  const {districtInfo, wasteLocations} = useSelector((s: any) => s.map, shallowEqual);
  const {tabletMode, mobileMode} = useSelector((s: any) => s.styling);

  const styles = mobileMode ? mobileStyles : tabletMode ? tabletStyles : webStyles;

  if (window.innerWidth == 390) {
    styles.buildingsWrapper = styles.buildingsWrapperPRO;
  } else if (window.innerWidth == 414) {
    styles.buildingsWrapper = styles.buildingsWrapperXR;
  } else if (window.innerWidth == 375) {
    styles.buildingCardWrapper = styles.buildingCardWrapperSE;
    styles.buildingsWrapper = styles.buildingsWrapperSE;
  }

  const onWasteLocationSelected = useCallback(
    (location: string | null) => {
      if (location) {
        const tempLocations = JSON.parse(JSON.stringify(wasteLocations));
        tempLocations.forEach((l: any) => {
          if (l.location === location) {
            l.active = true;
          } else {
            l.active = false;
          }
        });
      }
      dispatch(wasteLocationSelection(location));
    },
    [dispatch, wasteLocations]
  );

  const selectBuilding = useCallback(
    (building: ListItem) => {
      const found = wasteLocations?.find((w: any) => w.buildingId?.toLowerCase() === building.id.toLowerCase());
      if (found?.location) {
        onWasteLocationSelected(found.location);
      } else {
        onWasteLocationSelected(null);
      }

      dispatch(buildingSelection(building.id));
    },
    [dispatch, onWasteLocationSelected, wasteLocations]
  );

  return (
    <div style={{...styles.container, ...style}}>
      <div style={styles.titleWrapper}>
        <Text variant="cardHeader">{`${districtInfo?.name} City Buildings Efficiency`.toUpperCase()}</Text>
      </div>
      <div style={styles.buildingsWrapper}>
        {list.map((x: ListItem) => (
          <div style={styles.buildingCardWrapper} key={x.id} onClick={() => selectBuilding(x)}>
            <div
              style={
                x.savingsPercentage >= 40 ? styles.green : x.savingsPercentage < 40 && x.savingsPercentage >= 0 ? styles.yellow : styles.red
              }
            >
              <Text variant="largeNumericValue">{Math.abs(x.savingsPercentage.toFixed(0)) === 0 ? 0 : x.savingsPercentage.toFixed(0)}</Text>
              <Text variant="extraBoldNumericValue"> %</Text>
            </div>
            <img style={styles.buildingCardImage} src={x.imageUrl} alt={x.title} />
            <div style={styles.buildingNameWrapper}>
              <Text variant={mobileMode ? 'miniLabel' : 'miniSemiBoldFootLabel'}>{x.title.toUpperCase()}</Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
