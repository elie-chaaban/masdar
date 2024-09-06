import React, {CSSProperties, useCallback, useEffect, useState} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
//@ts-ignore
import emptyCheckbox from '../../../assets/images/icons/empty-checkbox-icon.png';
//@ts-ignore
import checkedCheckbox from '../../../assets/images/icons/checked-checkbox-icon.png';
//@ts-ignore
import co2Icon from '../../../assets/images/icons/co2-icon.png';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';
//@ts-ignore
import {GrayCloseIcon} from '../../../components/Utils';
import {shallowEqual, useSelector} from 'react-redux';

const COLUMN_CELL_HEIGHT = 170;
const COLUMN_CELL_WIDTH = 220;
const SPACING_COLUMN_WIDTH = 36;

const bordersStyle: CSSProperties = {
  borderBottom: 2,
  borderTop: 0,
  borderLeft: 0,
  borderRight: 0,
  borderStyle: 'solid'
};

const styles: Styles = createStyles(({colors, spacing, commonStyles}) => ({
  container: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '85vh',
    overflow: 'hidden',
    overflowX: 'hidden',
    color: colors.white
  },
  titleWrapper: {
    ...spacing.center,
    textAlign: 'center',
    width: '100%',
    maxHeight: 40,
    backgroundColor: colors.chartsCardHeaderBackground,
    marginBottom: 10,
    paddingTop: 20,
    paddingBottom: 20
  },
  titleText: {
    color: colors.white
  },
  buildingsWrapper: {
    paddingLeft: 170,
    paddingRight: 170,
    ...spacing.flex,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    overflowY: 'auto',
    minHeight: '80%'
  },
  buildingCard: {
    ...spacing.flex,
    ...commonStyles.cardDropShadow,
    ...commonStyles.cardLinearGradient,
    flex: 0,
    minWidth: 230,
    maxWidth: 230,
    height: 165,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 6,
    marginRight: 20,
    marginBottom: 20,
    cursor: 'pointer'
  },
  buildingCardContent: {
    ...spacing.flexVertically,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buildingCardTitle: {
    ...spacing.flexHorizontally,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buildingCardTitleText: {
    textAlign: 'left',
    color: colors.black
  },
  buildingCardCheckbox: {
    width: 30,
    height: 30,
    marginLeft: 4
  },
  buildingCardImage: {
    width: '100%',
    height: 98
  },
  buildingsFooter: {
    ...spacing.flexHorizontally,
    justifyContent: 'flex-start',
    marginTop: 20,
    width: '100%',
    paddingLeft: 170,
    paddingRight: 170
  },
  buildingInsightsFooter: {
    ...spacing.center,
    marginTop: 20
  },
  button: {
    ...spacing.center,
    flex: 0,
    minWidth: 210,
    height: 45,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 4,
    paddingRight: 4,
    cursor: 'pointer'
  },
  buttonText: {
    color: colors.white,
    width: '100%',
    textAlign: 'center'
  },
  blueButton: {
    backgroundColor: colors.textButton
  },
  grayButton: {
    backgroundColor: colors.textButtonGrayed
  },
  lightBackground: {
    backgroundColor: colors.buildingComparisonLightRow
  },
  buildingCardBackground: {
    backgroundColor: colors.buildingComparisonDarkRow
  },
  buildingsInsightsWrapper: {
    ...spacing.centerVertically,
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%'
  },
  buildingColumnWrapper: {
    ...spacing.flexHorizontally,
    marginTop: 10
  },
  buildingColumn: {
    ...spacing.flexHorizontally,
    ...commonStyles.columnBoxShadow,
    justifyContent: 'flex-start'
  },
  buildingColumnHeaderCell: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 12,
    maxWidth: COLUMN_CELL_WIDTH,
    minWidth: COLUMN_CELL_WIDTH
  },
  buildingColumnHeaderCellTitle: {
    width: '100%',
    textAlign: 'left'
  },
  buildingColumnHeaderCellImage: {
    width: '100%',
    height: 95
  },
  buildingColumnDataCell: {
    ...spacing.center,
    maxHeight: COLUMN_CELL_HEIGHT,
    minHeight: COLUMN_CELL_HEIGHT,
    maxWidth: COLUMN_CELL_WIDTH,
    minWidth: COLUMN_CELL_WIDTH,
    textAlign: 'center',
    flexWrap: 'wrap'
  },
  buildingColumnDataCellValueWrapper: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  buildingColumnDataCellValueWrapperWithIcon: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: -9
  },
  buildingColumnDataCellIcon: {
    width: 20,
    height: 10
  },
  buildingColumnDataCellValueText: {
    ...spacing.flex,
    marginBottom: 4
  },
  buildingColumnDataCellValueUnit: {
    ...spacing.flex
  },
  noBorderBottom: {
    borderBottom: 0
  },
  insightsRow: {
    ...spacing.flexHorizontally,
    justifyContent: 'space-around',
    marginLeft: COLUMN_CELL_WIDTH,
    maxHeight: 50
  },
  insightTitleCell: {
    ...spacing.centerVertically,
    ...bordersStyle,
    padding: 0,
    borderBottomColor: colors.white,
    maxWidth: COLUMN_CELL_WIDTH + SPACING_COLUMN_WIDTH * 2,
    minWidth: COLUMN_CELL_WIDTH + SPACING_COLUMN_WIDTH * 2
  },
  insightTitleText: {
    textAlign: 'center'
  },
  spacingColumn: {
    ...spacing.flexVertically,
    maxWidth: SPACING_COLUMN_WIDTH,
    minWidth: SPACING_COLUMN_WIDTH
  },
  buildingInsightValuesWrapper: {
    maxHeight: 800,
    overflowY: 'auto',
    paddingRight: 4
  },
  spacingCell: {
    ...spacing.flexVertically,
    ...bordersStyle,
    minHeight: COLUMN_CELL_HEIGHT,
    borderBottomColor: colors.black
  },
  valuesRow: {
    ...spacing.center,
    borderRadius: 9,
    paddingRight: SPACING_COLUMN_WIDTH
  },
  valuesColumn: {
    ...spacing.center,
    maxWidth: COLUMN_CELL_WIDTH + SPACING_COLUMN_WIDTH * 2,
    minWidth: COLUMN_CELL_WIDTH + SPACING_COLUMN_WIDTH * 2
  },
  closeIcon: {
    position: 'absolute',
    top: -5,
    right: 10
  },
  loadingIcon: {
    marginTop: 3
  }
}));

export interface Building {
  id: string;
  imageUrl: string;
  name: string;
}

export interface BuildingInsightValue {
  id: string;
  value: number | string;
  unit: string;
  icon?: boolean;
  valueWrapperCustomStyle?: Styles;
}

export interface BuildingInsightsDetails {
  id: string;
  imageUrl: string;
  name: string;
  energy: BuildingInsightValue[];
  water: BuildingInsightValue[];
  waste: BuildingInsightValue[];
  realTimeOperations: BuildingInsightValue[];
  securityIncidentsCountBySeverity: BuildingInsightValue[];
  frequencyOfOccurence: BuildingInsightValue[];
  acknowledgmentTime: BuildingInsightValue[];
}

export interface BuildingComparisonProps {
  style?: CSSProperties;
  showLoading?: boolean;
  showInsights: boolean;
  buildings: Building[];
  buildingsInsights: BuildingInsightsDetails[];
  onClickComparison: (buildingIds: string[]) => void;
  onClickCancel: () => void;
  onClickClose: () => void;
}

export const BuildingComparison = ({
  style,
  showLoading,
  showInsights,
  buildings,
  buildingsInsights,
  onClickComparison,
  onClickCancel,
  onClickClose
}: BuildingComparisonProps) => {
  const {filter} = useSelector((s: any) => s.dashboard.dateFilter, shallowEqual);
  const {selectedModule} = useSelector((s: any) => s.dashboard);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const access = useSelector((s: any) => s.user.access.kpi);
  const {district} = useSelector((s: any) => s.map);
  const hasEnergyAccess = access['energy']?.some((b: any) => b.district_id === district) ?? false;
  const hasWaterAccess = access['water']?.some((b: any) => b.district_id === district);
  const hasWasteAccess = access['waste']?.some((b: any) => b.district_id === district);

  const onBuildingCardClick = useCallback(
    (buildingId: string) => {
      const temp = JSON.parse(JSON.stringify(selectedIds));
      const found = temp.indexOf(buildingId) !== -1;
      if (found) {
        temp.splice(temp.indexOf(buildingId), 1);
      } else {
        temp.push(buildingId);
      }
      setSelectedIds(temp);
    },
    [selectedIds]
  );

  const renderBuildingCard = useCallback(
    (b: Building): JSX.Element => {
      return (
        <div key={`comparison-building-${b.id}`} style={styles.buildingCard} onClick={() => onBuildingCardClick(b.id)}>
          <div style={styles.buildingCardContent}>
            <div style={styles.buildingCardTitle}>
              <Text style={styles.buildingCardTitleText} variant="boldCardHeader">
                {b.name}
              </Text>
              <img
                style={styles.buildingCardCheckbox}
                src={selectedIds.find((id: string) => b.id === id) ? checkedCheckbox : emptyCheckbox}
                alt="checkbox-icon"
              />
            </div>
            <img style={styles.buildingCardImage} src={b.imageUrl} alt="building" />
          </div>
        </div>
      );
    },
    [onBuildingCardClick, selectedIds]
  );

  const renderBuildingColumnDataCell = useCallback((values: BuildingInsightValue[]): JSX.Element => {
    return (
      <div style={styles.buildingColumnDataCell}>
        {values.map((v) => {
          return (
            <div
              key={`building-insights-data-cell-${v.id}`}
              style={v.icon ? styles.buildingColumnDataCellValueWrapperWithIcon : styles.buildingColumnDataCellValueWrapper}
            >
              {v.icon && <img style={styles.buildingColumnDataCellIcon} src={co2Icon} alt="CO2" />}
              <div style={{...v.valueWrapperCustomStyle}}>
                <Text style={styles.buildingColumnDataCellValueText} variant="extraBoldNumericValue">
                  {v.value}
                </Text>
              </div>
              <Text style={styles.buildingColumnDataCellValueUnit} variant="actionLabelBold">
                {v.unit}
              </Text>
            </div>
          );
        })}
      </div>
    );
  }, []);

  const renderSustainabilityBuildingsInsights = useCallback((): JSX.Element => {
    return (
      <div style={styles.buildingsInsightsWrapper}>
        <div style={styles.insightsRow}>
          {hasEnergyAccess && (
            <div style={styles.insightTitleCell}>
              <Text style={styles.insightTitleText} variant="iconLabel">
                {'ENERGY\nCONSUMPTION'}
              </Text>
            </div>
          )}
          {hasEnergyAccess && <div style={styles.spacingColumn} />}
          {hasWaterAccess && (
            <div style={styles.insightTitleCell}>
              <Text style={styles.insightTitleText} variant="iconLabel">
                {'WATER\nCONSUMPTION'}
              </Text>
            </div>
          )}
          {hasWaterAccess && <div style={styles.spacingColumn} />}
          {hasWasteAccess && (
            <div style={styles.insightTitleCell}>
              <Text style={styles.insightTitleText} variant="iconLabel">
                {'WASTE\nPRODUCTION'}
              </Text>
            </div>
          )}
        </div>
        <div style={styles.buildingInsightValuesWrapper}>
          {buildingsInsights.map((b, index) => {
            const lightBackground = index % 2 === 0;
            return (
              <div key={`building-insight-${b.id}`} style={styles.buildingColumnWrapper}>
                <div key={`building-insights-column-${b.id}`} style={{...styles.buildingColumn}}>
                  <div style={styles.buildingColumnHeaderCell}>
                    <Text style={styles.buildingColumnHeaderCellTitle} variant="boldCardHeader">
                      {b.name}
                    </Text>
                    <img style={styles.buildingColumnHeaderCellImage} src={b.imageUrl} alt="building" />
                  </div>
                  <div style={{...styles.valuesRow, ...(lightBackground ? styles.lightBackground : styles.buildingCardBackground)}}>
                    <div style={styles.spacingColumn} />
                    {b.energy?.length && hasEnergyAccess ? (
                      <div style={{...styles.valuesColumn}}>{renderBuildingColumnDataCell(b.energy)}</div>
                    ) : null}
                    {b.energy?.length && hasEnergyAccess ? <div style={styles.spacingColumn} /> : null}
                    {b.water?.length && hasWaterAccess ? (
                      <div style={{...styles.valuesColumn}}>{renderBuildingColumnDataCell(b.water)}</div>
                    ) : null}
                    {b.water?.length && hasWaterAccess ? <div style={styles.spacingColumn} /> : null}
                    {b.waste?.length && hasWasteAccess ? (
                      <div style={{...styles.valuesColumn}}>{renderBuildingColumnDataCell(b.waste)}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [buildingsInsights, renderBuildingColumnDataCell, hasEnergyAccess, hasWaterAccess, hasWasteAccess]);

  const renderSecurityBuildingsInsights = useCallback((): JSX.Element => {
    return (
      <div style={styles.buildingsInsightsWrapper}>
        <div style={styles.insightsRow}>
          <div style={styles.insightTitleCell}>
            <Text style={styles.insightTitleText} variant="iconLabel">
              {'REALTIME OPERATIONAL\nSUMMARY'}
            </Text>
          </div>
          <div style={styles.spacingColumn} />
          <div style={styles.insightTitleCell}>
            <Text style={styles.insightTitleText} variant="iconLabel">
              {'SECURITY INCIDENTS BY\nSEVERITY'}
            </Text>
          </div>
          <div style={styles.spacingColumn} />
          <div style={styles.insightTitleCell}>
            <Text style={styles.insightTitleText} variant="iconLabel">
              {'RESPONSE EFFICIENCY'}
            </Text>
          </div>
          <div style={styles.spacingColumn} />
          <div style={styles.insightTitleCell}>
            <Text style={styles.insightTitleText} variant="iconLabel">
              {'FREQUENCY OF\nOCCURRENCE BY TYPE'}
            </Text>
          </div>
        </div>
        <div style={styles.buildingInsightValuesWrapper}>
          {buildingsInsights.map((b, index) => {
            const lightBackground = index % 2 === 0;
            return (
              <div key={`building-insight-${b.id}`} style={styles.buildingColumnWrapper}>
                <div key={`building-insights-column-${b.id}`} style={{...styles.buildingColumn}}>
                  <div style={styles.buildingColumnHeaderCell}>
                    <Text style={styles.buildingColumnHeaderCellTitle} variant="boldCardHeader">
                      {b.name}
                    </Text>
                    <img style={styles.buildingColumnHeaderCellImage} src={b.imageUrl} alt="building" />
                  </div>
                  <div style={{...styles.valuesRow, ...(lightBackground ? styles.lightBackground : styles.buildingCardBackground)}}>
                    <div style={styles.spacingColumn} />
                    <div style={styles.valuesColumn}>{renderBuildingColumnDataCell(b.realTimeOperations)}</div>
                    <div style={styles.spacingColumn} />
                    <div style={styles.valuesColumn}>{renderBuildingColumnDataCell(b.securityIncidentsCountBySeverity)}</div>
                    <div style={styles.spacingColumn} />
                    <div style={styles.valuesColumn}>{renderBuildingColumnDataCell(b.acknowledgmentTime)}</div>
                    <div style={styles.spacingColumn} />
                    <div style={styles.valuesColumn}>{renderBuildingColumnDataCell(b.frequencyOfOccurence)}</div>
                    <div style={styles.spacingColumn} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingsInsights, renderBuildingColumnDataCell, hasEnergyAccess, hasWaterAccess, hasWasteAccess]);

  useEffect(() => {
    onClickComparison(selectedIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div style={{...styles.container, ...style}}>
      <div style={styles.titleWrapper}>
        <Text style={styles.titleText} variant="cardHeader">
          {'BUILDING COMPARISON'}
        </Text>
        {showLoading && (
          <div style={styles.loadingIcon}>
            <Loader color="#fff" />
          </div>
        )}
        <div style={styles.closeIcon}>
          <GrayCloseIcon active={true} onClick={onClickClose} />
        </div>
      </div>
      {showLoading
        ? null
        : showInsights
        ? selectedModule === 'sustainability'
          ? renderSustainabilityBuildingsInsights()
          : selectedModule === 'security'
          ? renderSecurityBuildingsInsights()
          : null
        : null}
      {!showInsights && !showLoading && <div style={styles.buildingsWrapper}>{buildings.map((b: Building) => renderBuildingCard(b))}</div>}
      {!showInsights && !showLoading && (
        <div style={styles.buildingsFooter}>
          <div style={{...styles.button, ...styles.blueButton, marginRight: 30}} onClick={() => onClickComparison(selectedIds)}>
            <Text style={styles.buttonText} variant="textButton">
              {'COMPARE'}
            </Text>
          </div>
          <div style={{...styles.button, ...styles.grayButton}} onClick={onClickCancel}>
            <Text style={styles.buttonText} variant="textButton">
              {'CANCEL'}
            </Text>
          </div>
        </div>
      )}
    </div>
  );
};
