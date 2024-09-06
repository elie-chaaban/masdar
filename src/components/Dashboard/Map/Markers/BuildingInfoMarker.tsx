import React, {CSSProperties, useCallback} from 'react';
import {Styles} from '../../../../types';
import {Marker, Anchor, PointLike} from 'react-map-gl';
import {Text} from '../../../Common/Text';
// @ts-ignore
import buildingInfoIcon from '../../../../assets/images/icons/building-info-icon.png';
// @ts-ignore
import buildingInfoIconActive from '../../../../assets/images/icons/building-info-active-icon.png';
//@ts-ignore
import Loader from '../../../Utils/Loader';
import 'animate.css';
import {createStyles} from '../../../../theme';
import {isNumber} from 'lodash';
import {formatDecimals} from '../../../../utils/dashboard';
import {BuildingInfoDetailsRow} from '../../../../hooks/useBuildingsInfoData';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  contentContainer: {
    ...spacing.flexHorizontally,
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'absolute',
    top: 0,
    left: 18,
    minWidth: 310,
    maxWidth: 310,
    minHeight: 102,
    maxHeight: 102,
    cursor: 'default'
  },
  detailsWrapper: {
    ...spacing.flexVertically,
    border: 'solid',
    minWidth: 310,
    maxWidth: 310,
    borderColor: colors.black,
    backgroundColor: colors.black
  },
  detailsRow: {
    ...spacing.flexHorizontally,
    width: '100%',
    minHeight: 21,
    maxHeight: 21,
    borderWidth: 4,
    borderRadius: 2
  },
  valueCell: {
    ...spacing.center,
    flex: 0,
    minWidth: 50,
    maxWidth: 50,
    height: '100%',
    borderWidth: 1,
    borderColor: colors.black,
    backgroundColor: colors.infoValueCellBackground
  },
  valueText: {
    textAlign: 'center',
    width: '100%',
    color: colors.white
  },
  labelCell: {
    ...spacing.center,
    flex: 0,
    minWidth: 254,
    maxWidth: 254,
    height: '100%',
    borderWidth: 1,
    borderColor: colors.black,
    backgroundColor: colors.infoLabelCellBackground
  },
  labelText: {
    textAlign: 'center',
    width: '100%',
    color: colors.white
  },
  activeInfoIcon: {
    width: 'auto',
    height: 'auto',
    marginRight: 2
  },
  infoIcon: {
    width: 'auto',
    height: 'auto'
  },
  buildingNameCell: {
    ...spacing.center,
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: colors.infoLabelCellBackground
  },
  buildingNameRow: {
    ...spacing.flexHorizontally,
    width: '100%',
    minHeight: 25,
    maxHeight: 25
  }
}));

export interface BuildingInfoMarkerProps {
  style?: CSSProperties;
  id: string;
  longitude: number;
  latitude: number;
  anchor: Anchor;
  offset: PointLike;
  active: boolean;
  rows: BuildingInfoDetailsRow[];
  loading: boolean;
  buildingName: string;
  onMouseEnter: (id: string) => void;
  onMouseLeave: (id: string) => void;
}

export const BuildingInfoMarker = ({
  style,
  id,
  longitude,
  latitude,
  offset,
  anchor,
  active,
  rows,
  loading,
  buildingName,
  onMouseEnter,
  onMouseLeave
}: BuildingInfoMarkerProps) => {
  const handleOnMouseEnter = useCallback(() => {
    onMouseEnter(id);
  }, [id, onMouseEnter]);

  const handleOnMouseLeave = useCallback(() => {
    onMouseLeave(id);
  }, [id, onMouseLeave]);

  return (
    <Marker longitude={longitude} latitude={latitude} anchor={anchor} offset={offset}>
      {active ? (
        <div style={styles.contentContainer} onMouseLeave={handleOnMouseLeave} className="animate__animated animate__fadeIn">
          <img src={buildingInfoIconActive} style={styles.activeInfoIcon} alt="Building Info" />
          <div style={styles.detailsWrapper}>
            <div style={styles.buildingNameRow}>
              <div style={styles.buildingNameCell}>
                <Text style={styles.labelText} variant="textLink">
                  {buildingName.toUpperCase()}
                </Text>
              </div>
            </div>
            {!loading ? (
              rows.map((row) => (
                <div key={`details-row-${row.label}`} style={styles.detailsRow}>
                  <div style={styles.valueCell}>
                    <Text style={styles.valueText} variant="textLink">
                      {row?.value ? (isNumber(row.value) ? formatDecimals(row.value, 1) : row.value) : '0'}
                    </Text>
                  </div>
                  <div style={styles.labelCell}>
                    <Text style={styles.labelText} variant="actionLabel">
                      {row?.label || ''}
                    </Text>
                  </div>
                </div>
              ))
            ) : (
              <Loader height="102px" margin={0} />
            )}
          </div>
        </div>
      ) : (
        <div style={styles.container} onMouseEnter={handleOnMouseEnter} className="animate__animated animate__fadeIn">
          <img src={buildingInfoIcon} style={styles.infoIcon} alt="Building Info" />
        </div>
      )}
    </Marker>
  );
};
