import React, {useCallback} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import './styles.scss';
import {Text} from '../../Common/Text';
import {Insight, Intensity, UnitFormat, unitFormatter, valueFormatter} from '../../../utils/dashboard';
import {ImpactState, SustainabilityTotalConsumptionCard} from '../SustainabilityTotalConsumptionCard';
import {EnergyConsumptionPercentage} from '../EnergyConsumptionPercentage';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
//@ts-ignore
import SearchIcon from '../../../assets/images/icons/small-search.png';
import {UnitsScrollingMenu} from '../UnitsScrollingMenu';
//@ts-ignore
import Loader from '../../Utils/Loader';
import {TotalConsumptionCardPropsGenerator} from '../../../utils/TotalConsumptionCardPropsGenerator';
import {useSelector} from 'react-redux';

const webStyles: Styles = createStyles(({colors, spacing, commonStyles}) => ({
  container: {
    ...spacing.flexVertically,
    maxWidth: 1536
  },
  topHeader: {
    ...spacing.flexHorizontally,
    background: colors.buildingDetailsSideBackground,
    color: colors.white
  },
  unitDetailsHeader: {
    ...spacing.flex,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 266,
    height: 48,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.black
  },
  unitHeatmapHeader: {
    ...spacing.flex,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 1270,
    height: 48,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.black
  },
  topUnitsHeader: {
    ...spacing.flex,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 266 + 1270,
    paddingTop: 10,
    paddingBottom: 10,
    height: 48,
    color: colors.white
  },
  sections: {
    ...spacing.flexHorizontally,
    backgroundColor: colors.buildingDetailsLightSideBackground
  },
  leftSection: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    minWidth: 264,
    height: 660,
    borderLeftWidth: 1,
    borderLeftStyle: 'solid',
    borderLeftColor: colors.black,
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: colors.black,
    color: colors.white
  },
  leftSectionSearchBox: {
    ...spacing.flex,
    minWidth: 264,
    maxHeight: 66,
    padding: 16
  },
  leftSectionUnitName: {
    ...spacing.flex,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 264,
    maxHeight: 53,
    padding: 16
  },
  leftSectionEnergyConsumption: {},
  leftSectionCarbonFootprint: {},
  rightSection: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    minWidth: 1270,
    height: 666,
    borderLeftWidth: 1,
    borderLeftStyle: 'solid',
    borderLeftColor: colors.black
  },
  rightSectionHeader: {
    ...spacing.flexHorizontally,
    justifyContent: 'center',
    alignItems: 'baseline',
    minWidth: 1270,
    maxHeight: 42,
    marginTop: 10,
    marginBottom: 24,
    color: colors.white
  },
  consumptionType: {
    ...spacing.flexVertically,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 210,
    height: 42,
    cursor: 'pointer'
  },
  consumptionTypeUnderline: {
    minWidth: 234,
    height: 4,
    borderRadius: 8,
    backgroundColor: colors.textButton,
    marginTop: 2
  },
  searchInput: {
    background: 'white !important',
    fontSize: 12,
    width: '70%',
    height: 38,
    marginTop: 0
  },
  searchButton: {
    ...spacing.flex,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20
  },
  searchIcon: {
    width: 15,
    height: 14
  },
  heatmapGridWrapper: {
    width: '100%',
    height: '100%',
    paddingLeft: 50,
    overflow: 'scroll'
  },
  topUnitsWrapper: {
    width: 1536,
    height: 223,
    paddingTop: 38,
    backgroundColor: colors.buildingDetailsLightSideBackground
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  mobileFontSize: {
    fontSize: 18
  }
}));

interface Zone {
  id: string;
  name: string;
  color: string;
}

interface Floor {
  floorName: string;
  zones: Zone[];
}

interface Block {
  blocName: string;
  floors: Floor[];
}

interface Response {
  blocs: Block[];
}

function generateDynamicResponse(numBlocks: number, numFloors: number, numZones: number): Response {
  let response: Response = {blocs: []};

  for (let blockNumber = 1; blockNumber <= numBlocks; blockNumber++) {
    let block: Block = {
      blocName: `Block ${blockNumber}`,
      floors: []
    };

    for (let floorNumber = 1; floorNumber <= numFloors; floorNumber++) {
      let floor: Floor = {
        floorName: `Floor ${floorNumber}`,
        zones: []
      };

      for (let zoneNumber = 1; zoneNumber <= numZones; zoneNumber++) {
        let zone: Zone = {
          id: `z${blockNumber}-${floorNumber}-${zoneNumber}`,
          name: `Zone ${blockNumber}-${floorNumber}-${zoneNumber}`,
          color: 'green'
        };
        floor.zones.push(zone);
      }

      block.floors.push(floor);
    }

    response.blocs.push(block);
  }

  return response;
}

function calculateBlockSize(containerWidth: number, containerHeight: number, maxBlocks: number) {
  const containerArea = containerWidth * containerHeight;
  const maxBlockArea = containerArea / maxBlocks;

  let blockSize = Math.floor(Math.sqrt(maxBlockArea));
  let blocksPerWidth = Math.floor(containerWidth / blockSize);
  let blocksPerHeight = Math.floor(containerHeight / blockSize);

  while (blocksPerWidth * blocksPerHeight < maxBlocks) {
    blockSize--;
    blocksPerWidth = Math.floor(containerWidth / blockSize);
    blocksPerHeight = Math.floor(containerHeight / blockSize);
  }

  return {
    blockSize,
    countPerRow: blocksPerWidth,
    countPerColumn: blocksPerHeight
  };
}

interface TenantAnalysisProps {
  blocks: any;
  maximumNumberOfUnits: number;
  highestZonesConsumption: any;
  tenantEnergyConsumption: any;
  tenantEnergyConsumptionPercentage: any;
  tenantEnergyCarbonEmission: any;
  tenantEnergySavings: any;
  tenantWater: any;
  tenantWaterCarbonEmission: any;
  tenantWaterSavings: any;
  selectedInsight: Insight;
  onClickConsumptionType: (insight: Insight) => void;
  onSearchTextChange: (e: any) => void;
  searchText: string;
  selectedZone: any;
  onSearchUnit: (unitName: string) => void;
}

export const TenantAnalysis = ({
  blocks,
  maximumNumberOfUnits,
  highestZonesConsumption,
  selectedInsight,
  onClickConsumptionType,
  onSearchTextChange,
  searchText = '',
  selectedZone,
  onSearchUnit,
  tenantEnergyConsumption,
  tenantEnergyConsumptionPercentage,
  tenantEnergyCarbonEmission,
  tenantEnergySavings,
  tenantWater,
  tenantWaterCarbonEmission,
  tenantWaterSavings
}: TenantAnalysisProps) => {
  const {mobileMode} = useSelector((s: any) => s.styling);
  const styles = mobileMode ? mobileStyles : webStyles;
  // Generate an array of columns
  const getColumns = useCallback(() => {
    if (blocks?.response?.blocs) {
      let theBlocks = JSON.parse(JSON.stringify(blocks?.response?.blocs));
      // let theBlocks = generateDynamicResponse(5, 8, 30).blocs;

      theBlocks.forEach((block: any) => {
        block.floors.forEach((floor: any) => {
          floor.zones.sort((a: any, b: any) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();

            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
        });
      });

      let minMaxWidth = 0;
      if (theBlocks.length > 0) {
        minMaxWidth = (1050 - theBlocks.length * 10) / theBlocks.length;
      }

      let minMaxHeight = 0;
      if (theBlocks.length && theBlocks[0].floors.length) {
        minMaxHeight = (450 - theBlocks[0].floors.length * 10) / theBlocks[0].floors.length;
      }

      const gridDimensions = calculateBlockSize(minMaxWidth, minMaxHeight, maximumNumberOfUnits);
      minMaxWidth = gridDimensions.countPerRow * gridDimensions.blockSize + 10;
      minMaxHeight = gridDimensions.countPerColumn * gridDimensions.blockSize + 10;

      const columnsArray = Array.from({length: theBlocks.length || 0}, (_, colIndex) => (
        <>
          {colIndex === 0 && (
            <div className="floors-labels">
              {Array.from({length: theBlocks[colIndex].floors.length}, (_, floorIndex) => (
                <div className="floor-label" style={{...styles.mobileFontSize, marginBottom: minMaxHeight - 36 + 10}}>{`${
                  theBlocks[colIndex].floors.length - floorIndex
                }F`}</div>
              ))}
            </div>
          )}
          <div key={colIndex} className="column">
            <div className="column-label" style={styles.mobileFontSize ? {fontSize: 18} : {}}>
              {theBlocks[colIndex].blocName}
            </div>
            {/* Generate floors for each column */}
            {Array.from({length: theBlocks[colIndex].floors.length}, (_, floorIndex) => (
              <div key={floorIndex} className="floor">
                {/* Wrap squares in an additional div */}
                <div
                  className="square-container"
                  style={{
                    minWidth: minMaxWidth,
                    maxWidth: minMaxWidth,
                    minHeight: minMaxHeight,
                    maxHeight: minMaxHeight
                  }}
                >
                  {/* Generate squares for each floor */}
                  {Array.from({length: maximumNumberOfUnits}, (_, squareIndex) => (
                    <div
                      key={squareIndex}
                      className="square sqhov"
                      style={
                        theBlocks[colIndex].floors[floorIndex].zones[squareIndex]
                          ? {
                              backgroundColor: theBlocks[colIndex].floors[floorIndex].zones[squareIndex].color,
                              borderColor: 'white',
                              width: gridDimensions.blockSize,
                              height: gridDimensions.blockSize
                            }
                          : {
                              backgroundColor: '#434343',
                              borderColor: '#5F5F5F',
                              width: gridDimensions.blockSize,
                              height: gridDimensions.blockSize
                            }
                      }
                      onClick={() => {
                        const block = theBlocks[colIndex].floors[floorIndex].zones[squareIndex];
                        if (block) {
                          onSearchTextChange({target: {value: block.name}});
                          onSearchUnit(block.name);
                        }
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ));
      return columnsArray;
    }
    return [];
  }, [blocks?.response?.blocs, maximumNumberOfUnits, onSearchTextChange, onSearchUnit, styles]);
  return (
    <div style={styles.container}>
      <div style={styles.topHeader}>
        <div style={styles.unitDetailsHeader}>
          <Text variant="textLink">{'UNIT DETAILS'}</Text>
        </div>
        <div style={styles.unitHeatmapHeader}>
          <Text variant="textLink">{'UNIT HEATMAP'}</Text>
        </div>
      </div>
      <div style={styles.sections}>
        <div style={styles.leftSection}>
          <div style={styles.leftSectionSearchBox}>
            <InputGroup className="mb-3">
              <Form.Control
                style={styles.searchInput}
                placeholder="Search Unit Name"
                aria-label="Unit Name"
                aria-describedby="basic-addon2"
                onChange={onSearchTextChange}
                onKeyUp={(e: any) => {
                  if (e.keyCode === 13) {
                    onSearchUnit(searchText);
                  }
                }}
                value={searchText}
              />
              <Button style={styles.searchButton} variant="outline-secondary" id="button-addon2" onClick={() => onSearchUnit(searchText)}>
                <img src={SearchIcon} style={styles.searchIcon} alt="search-icon" />
              </Button>
            </InputGroup>
          </div>
          <div style={styles.leftSectionUnitName}>
            <Text variant="header">{`UNIT ${searchText && selectedZone ? selectedZone?.zone?.name || '' : ''}`}</Text>
          </div>
          <div style={styles.leftSectionEnergyConsumption}>
            {tenantEnergyConsumption?.isLoading || tenantWater?.isLoading ? (
              <Loader height="195px" margin={0} />
            ) : (
              <SustainabilityTotalConsumptionCard
                vertical={true}
                cardVariant={selectedInsight === Insight.ENERGY ? 'energy' : 'water'}
                {...TotalConsumptionCardPropsGenerator.init(
                  selectedInsight === Insight.ENERGY ? 'energy' : 'water',
                  selectedInsight === Insight.ENERGY ? tenantEnergyConsumption?.response : tenantWater?.response
                ).getProps()}
                // bottomLeftColumnValue={valueFormatter(
                //   selectedInsight,
                //   selectedInsight === Insight.ENERGY
                //     ? tenantEnergyConsumption?.response?.energy < 1000
                //       ? tenantEnergyConsumption?.response?.consumptionBenchmark * 1000
                //       : tenantEnergyConsumption?.response?.consumptionBenchmark
                //     : tenantWater?.response?.water < 10
                //     ? tenantWater?.response?.consumptionBenchmark * 1000
                //     : tenantWater?.response?.consumptionBenchmark,
                //   UnitFormat.String
                // )}
                // bottomRightColumnValue={valueFormatter(
                //   selectedInsight,
                //   selectedInsight === Insight.ENERGY
                //     ? tenantEnergyConsumption?.response?.intensityBenchmark
                //     : tenantWater?.response?.kwh < 10
                //     ? tenantWater?.response?.intensityBenchmark * 1000
                //     : tenantWater?.response?.intensityBenchmark,
                //   UnitFormat.String
                // )}
                // leftColumnValue={valueFormatter(
                //   selectedInsight,
                //   selectedInsight === Insight.ENERGY
                //     ? tenantEnergyConsumption?.response?.energy
                //     : tenantWater?.response?.water < 10
                //     ? tenantWater?.response?.water * 1000
                //     : tenantWater?.response?.water,
                //   UnitFormat.String
                // )}
                // leftColumnUnit={unitFormatter(
                //   selectedInsight,
                //   selectedInsight === Insight.ENERGY ? tenantEnergyConsumption?.response?.energy : tenantWater?.response?.water
                // )}
                // rightColumnValue={valueFormatter(
                //   selectedInsight === Insight.ENERGY ? Intensity.ENERGY_INTENSITY : Intensity.WATER_INTENSITY,
                //   selectedInsight === Insight.ENERGY ? tenantEnergyConsumption?.response?.kwh : tenantWater?.response?.kwh,
                //   UnitFormat.String
                // )}
                // rightColumnUnit={unitFormatter(
                //   selectedInsight === Insight.ENERGY ? Intensity.ENERGY_INTENSITY : Intensity.WATER_INTENSITY,
                //   selectedInsight === Insight.ENERGY ? tenantEnergyConsumption?.response?.kwh : tenantWater?.response?.kwh
                // )}
                impactCard={{
                  impactInsight: selectedInsight,
                  impactValue: Math.abs(
                    selectedInsight === Insight.ENERGY
                      ? tenantEnergySavings?.response?.savingsPercentage || 0
                      : tenantWaterSavings?.response?.savingsPercentage || 0
                  ),
                  impactState:
                    (selectedInsight === Insight.ENERGY
                      ? tenantEnergySavings?.response?.savingsPercentage || 0
                      : tenantWaterSavings?.response?.savingsPercentage || 0) >= 0
                      ? ImpactState.drop
                      : ImpactState.raise,
                  carsSaved:
                    selectedInsight === Insight.ENERGY
                      ? parseInt(tenantEnergySavings?.response?.carsSaved?.toString() || '0')
                      : parseInt(tenantWaterSavings?.response?.carsSaved?.toString() || '0')
                }}
                onClickCard={() => {}}
                condensed
              >
                {selectedInsight === Insight.ENERGY && (
                  <EnergyConsumptionPercentage
                    style={{marginBottom: 20}}
                    coolingPercentage={tenantEnergyConsumptionPercentage.response?.coolingPercentage ?? 0}
                    electricityPercentage={tenantEnergyConsumptionPercentage.response?.electricityPercentage ?? 0}
                    condensed
                    vertical
                  />
                )}
              </SustainabilityTotalConsumptionCard>
            )}
          </div>
          <div style={styles.leftSectionCarbonFootprint}>
            {tenantEnergyCarbonEmission?.isLoading || tenantWaterCarbonEmission?.isLoading ? (
              <Loader height="195px" margin={0} />
            ) : (
              <SustainabilityTotalConsumptionCard
                cardVariant="carbon"
                carbonCard={{
                  energyValue:
                    selectedInsight === Insight.ENERGY
                      ? tenantEnergyCarbonEmission?.response?.value ?? 0
                      : tenantWaterCarbonEmission?.response?.value ?? 0,
                  waterValue: 0,
                  wasteValue: 0,
                  showDrillDown: false
                }}
                onClickCard={() => {}}
                condensed
                vertical
                style={{minHeight: 164, maxHeight: 164, marginTop: 140}}
              />
            )}
          </div>
        </div>
        <div style={styles.rightSection}>
          <div style={styles.rightSectionHeader}>
            <div style={{...styles.consumptionType, ...{marginRight: 100}}} onClick={() => onClickConsumptionType(Insight.ENERGY)}>
              <Text variant="iconLabel">{'ENERGY CONSUMPTION'}</Text>
              {selectedInsight === Insight.ENERGY && <div style={styles.consumptionTypeUnderline}></div>}
            </div>
            <div style={styles.consumptionType} onClick={() => onClickConsumptionType(Insight.WATER)}>
              <Text variant="iconLabel">{'WATER CONSUMPTION'}</Text>
              {selectedInsight === Insight.WATER && <div style={styles.consumptionTypeUnderline}></div>}
            </div>
          </div>
          <div style={styles.heatmapGridWrapper}>
            {blocks.isLoading ? <Loader height="195px" margin={0} /> : <div className="rectangular-container">{getColumns()}</div>}
          </div>
        </div>
      </div>
      <div style={styles.topUnitsHeader}>
        <Text variant="textLink">{'TOP UNITS BASED ON ENERGY EFFICIENCY'}</Text>
      </div>
      <div style={styles.topUnitsWrapper}>
        {highestZonesConsumption.isLoading ? (
          <Loader height="195px" margin={0} />
        ) : (
          <UnitsScrollingMenu
            list={highestZonesConsumption?.response?.data || []}
            onItemClick={(unitName: string) => {
              onSearchTextChange({target: {value: unitName}});
              onSearchUnit(unitName);
            }}
          />
        )}
      </div>
    </div>
  );
};
