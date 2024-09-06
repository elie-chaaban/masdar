import React, {useCallback, CSSProperties} from 'react';
import {Styles} from '../../../../types';
import {Marker, Anchor, PointLike} from 'react-map-gl';
// @ts-ignore
import alarmBillIcon from '../../../../assets/images/icons/alarm-bill-icon.png';
// @ts-ignore
import treesIcon from '../../../../assets/images/icons/white-tree-icon.png';

import {createStyles} from '../../../../theme';
import {Severity} from '../../SeveritiesModal';

import 'animate.css';
import './styles.css';
import {Text} from '../../../Common/Text';
import {formatDecimals} from '../../../../utils/dashboard/units';

const BORDER_RADIUS = 5;
const ZOOM = 1;

const styles: Styles = createStyles(({colors, spacing, commonStyles}) => ({
  container: {
    ...spacing.flexHorizontally,
    ...commonStyles.cardDropShadow,
    borderRadius: BORDER_RADIUS,
    minHeight: 30
  },
  iconWrapper: {
    ...spacing.center,
    minWidth: 28 * ZOOM,
    backgroundColor: colors.alarmBillBackground,
    borderTopLeftRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS
  },
  alarmCountWrapper: {
    ...spacing.center,
    minWidth: 38 * ZOOM,
    backgroundColor: colors.alarmMarkerBackground,
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS
  },
  billAlarmBackground: {
    backgroundColor: colors.alarmBillBackground
  },
  treeAlarmBackground: {
    backgroundColor: colors.treeAlarmBackground
  },
  alarmIcon: {
    width: 'auto',
    height: 'auto'
  }
}));

export enum AlarmVariant {
  BILL = 'BILL',
  TREE = 'TREE'
}

export interface AlarmMarkerProps {
  style?: CSSProperties;
  variant: AlarmVariant;
  longitude: number;
  latitude: number;
  anchor: Anchor;
  offset: PointLike;
  severity?: Severity;
  value?: number;
}

export const AlarmMarker = ({style, variant, longitude, latitude, offset, anchor, severity, value}: AlarmMarkerProps) => {
  const calculateTotal = useCallback((): number => {
    if (severity) {
      return severity.lifeSafety + severity.critical + severity.maintenance;
    }
    return 0;
  }, [severity]);
  return (
    <Marker longitude={longitude} latitude={latitude} anchor={anchor} offset={offset}>
      <div style={styles.container}>
        <div style={{...styles.iconWrapper, ...(variant === AlarmVariant.TREE ? styles.treeAlarmBackground : styles.billAlarmBackground)}}>
          <img src={variant === AlarmVariant.TREE ? treesIcon : alarmBillIcon} style={styles.alarmIcon} alt="Alarm" />
        </div>
        <div style={styles.alarmCountWrapper}>
          <Text variant="textLink">{variant === AlarmVariant.TREE ? value && formatDecimals(value, 0) : calculateTotal()}</Text>
        </div>
      </div>
    </Marker>
  );
};
