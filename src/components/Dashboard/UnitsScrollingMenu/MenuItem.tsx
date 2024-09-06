import React, {useContext, useState} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
import {VisibilityContext} from 'react-horizontal-scrolling-menu';
//@ts-ignore
import UnitDoor from '../../../assets/images/icons/unit-door.png';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    // position: 'relative',
    // zIndex: 999,
    // justifyContent: 'space-between',
    // alignItems: 'center',
    width: 115,
    height: 100,
    cursor: 'pointer',
    marginRight: 36
  },
  top: {
    ...spacing.flex,
    width: '100%',
    minHeight: 50,
    maxHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.white,
    backgroundColor: colors.unitCardTopBackground
  },
  bottom: {
    ...spacing.flexHorizontally,
    width: '100%',
    minHeight: 50,
    maxHeight: 50,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.black
  },
  bottomLeft: {
    ...spacing.center,
    minWidth: 50,
    maxWidth: 50,
    minHeight: 49,
    maxHeight: 49,
    backgroundColor: colors.unitCardBottomLeftBackground
  },
  bottomRight: {
    ...spacing.centerVertically,
    minWidth: 64,
    maxWidth: 64,
    minHeight: 49,
    maxHeight: 49,
    backgroundColor: colors.unitCardBottomRightBackground,
    color: colors.white,
    textAlign: 'center'
  },
  bottomLeftIcon: {
    width: 20.3,
    height: 30
  },
  zoom: {
    transform: 'scale(1.07)'
  }
}));

export interface MenuItemProps {
  zoneId: string;
  savingsPercentage: number;
  title: string;
  onClick?: () => void;
}

export const MenuItem = ({zoneId, savingsPercentage, title, onClick}: MenuItemProps) => {
  const [zoom, setZoom] = useState({});
  const visibility = useContext(VisibilityContext);
  const visible = visibility.isItemVisible(zoneId);
  return (
    <div style={styles.container} onClick={onClick} onMouseEnter={() => setZoom(styles.zoom)} onMouseLeave={() => setZoom({})}>
      <div style={styles.top}>
        <Text variant="largeNumericValue">{`%${savingsPercentage.toFixed(0)}`}</Text>
      </div>
      <div style={styles.bottom}>
        <div style={styles.bottomLeft}>
          <img src={UnitDoor} alt={'unit door'} style={styles.bottomLeftIcon} />
        </div>
        <div style={styles.bottomRight}>
          <Text variant="actionLabelNormal">{`UNIT`}</Text>
          <Text variant="iconLabel">{title}</Text>
        </div>
      </div>
    </div>
  );
};
