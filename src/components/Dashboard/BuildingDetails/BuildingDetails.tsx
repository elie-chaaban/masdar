import React, {CSSProperties} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
import {ImpactCard, SustainabilityTotalConsumptionCard} from '../SustainabilityTotalConsumptionCard/SustainabilityTotalConsumptionCard';
import {Insight} from '../../../utils/dashboard';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';
import {SavingsTrendCard} from '../SavingsTrendCard';
import {SustainabilityTrendLineAndBreakdownContainer} from '../../../containers/Dashboard/Sustainability/SustainabilityTrendLineAndBreakdownContainer';
import {OperationsWasteProductionByCategoryCard} from '../OperationsWasteProductionByCategoryCard';
import {CarbonEmissionByCategoryCard} from '../CarbonEmissionByCategoryCard';
import {EnergyConsumptionPercentage} from '../EnergyConsumptionPercentage';
import {TenantAnalysis} from '../TenantAnalysis';
import {TotalConsumptionCardPropsGenerator} from '../../../utils/TotalConsumptionCardPropsGenerator';
import {useSelector} from 'react-redux';
import {getChartTypeIfExists, SustainabilityTrendLineAndBreakdownTypes} from '../../../utils/chartConfigurations';
import {CarbonEmissionSemiCircleByCategoryCard} from '../CarbonEmissionByCategoryCard/CarbonEmissionSemiCircleByCategoryCard';
import {CarbonEmissionParliamentByCategoryCard} from '../CarbonEmissionByCategoryCard/CarbonEmissionParliamentByCategoryCard';

const webStyles: Styles = createStyles(({colors, spacing, commonStyles}) => ({
  container: {
    ...spacing.flexHorizontally,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 1005,
    backgroundColor: colors.buildingDetailsBackground
  },
  leftSection: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    alignItems: 'center',
    minWidth: 334,
    maxWidth: 334,
    height: '100%'
  },
  rightSection: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    alignItems: 'center',
    minWidth: 1534,
    maxWidth: 1534,
    height: 900
  },
  buildingImageWrapper: {
    ...spacing.flex,
    minWidth: 334,
    maxWidth: 334,
    minHeight: 336,
    maxHeight: 336
  },
  buildingImage: {
    position: 'relative',
    width: 334,
    height: 336,
    left: -56
  },
  backButton: {
    position: 'relative',
    top: 10,
    left: 10,
    minWidth: 56,
    height: 21,
    zIndex: 99,
    cursor: 'pointer'
  },
  backButtonText: {
    color: colors.buildingDetailsBackButtonText
  },
  darkBackgroundValueWrapper: {
    ...spacing.center,
    minHeight: 48,
    maxHeight: 48,
    width: '100%',
    backgroundColor: colors.buildingDetailsSideBackground
  },
  lightBackgroundValueWrapper: {
    ...spacing.center,
    minHeight: 48,
    maxHeight: 48,
    width: '100%',
    backgroundColor: colors.buildingDetailsLightSideBackground
  },
  leftSectionValue: {
    width: '100%',
    textAlign: 'center',
    color: colors.white
  },
  buildingSideButtonsWrapper: {
    ...spacing.centerVertically,
    minHeight: 270,
    maxHeight: 270
  },
  buildingSideButton: {
    ...spacing.center,
    minWidth: 312,
    minHeight: 57,
    maxHeight: 57,
    marginBottom: 20,
    borderRadius: 14,
    color: colors.white,
    cursor: 'pointer',
    backgroundColor: colors.buildingDetailsBackButtonText
  },
  row: {
    ...spacing.flexHorizontally,
    width: '100%',
    minHeight: 243,
    maxHeight: 243,
    marginBottom: 1
  },
  highestConsumptionBenchmarkCard: {
    minHeight: 380,
    maxHeight: 380
  },
  loadingWrapper: {
    minHeight: 243,
    maxHeight: 243,
    minWidth: 474,
    maxWidth: 474
  }
}));

const tabletStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...webStyles.container,
    ...spacing.flexVertically,
    minHeight: 1024,
    maxHeight: 1024,
    overflow: 'scroll'
  },
  leftSection: {
    ...webStyles.leftSection,
    ...spacing.flexHorizontally,
    minWidth: 1318,
    maxWidth: 1318,
    height: 330
  },
  rightSection: {
    ...webStyles.rightSection,
    ...spacing.flexVertically,
    minWidth: 1318,
    maxWidth: 1318
  },
  buildingImageWrapper: {
    ...webStyles.buildingImageWrapper,
    display: 'block',
    marginRight: 20
  },
  buildingImage: {
    ...webStyles.buildingImage,
    position: 'relative'
  },
  buildingSideButtonsWrapper: {
    ...webStyles.buildingSideButtonsWrapper,
    minHeight: '100%',
    maxHeight: '100%',
    padding: 20
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...webStyles.container,
    height: '100vh',
    flexDirection: 'column'
  },
  leftSection: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  rightSection: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 900,
    width: '100%'
  },
  column: {
    ...spacing.flexVertically,
    width: '100%'
  },
  loadingWrapper: {
    minHeight: 243,
    maxHeight: 243
  }
}));

export interface BuildingDetailsProps {
  style?: CSSProperties;
  buildingImageSource?: string;
  buildingName?: string;
  buildingArea?: string;
  buildingEnergyProfile?: string;
  buildingTotalFloors?: number;
  hasEnergyAccess: any;
  energyConsumption: any;
  hasWaterAccess: any;
  water: any;
  hasWasteAccess: any;
  wasteProduction: any;
  accessModules: any;
  buildingEnergySavings: any;
  buildingWaterSavings: any;
  wasteProductionByCategory: any;
  hasCarbonAccess: any;
  energyCarbonEmission: any;
  waterCarbonEmission: any;
  wasteCarbonEmission: any;
  energyConsumptionPercentage: any;
  tabletMode: boolean;
  hasEnergyAnalysisAccess: boolean;
  hasAssetsAnalysisAccess: boolean;
  showTenantsAnalyticsButton: boolean;
  selectedTenantInsight: Insight;
  showTenantsAnalytics: boolean;
  searchText: string;
  selectedZone: any;
  tenantEnergyConsumption: any;
  tenantEnergyConsumptionPercentage: any;
  tenantEnergyCarbonEmission: any;
  tenantEnergySavings: any;
  tenantWater: any;
  tenantWaterCarbonEmission: any;
  tenantWaterSavings: any;
  blocks: any;
  highestZonesConsumption: any;
  maximumNumberOfUnits: number;
  getImpactCard: (insightType: Insight) => ImpactCard | undefined;
  onBackButtonClick: () => void;
  onSustainabilityAnalysisClick: () => void;
  onBuildingManagementClick: () => void;
  onTenantsAnalyticsClick: () => void;
  onClickConsumptionType: (insight: Insight) => void;
  onSearchTextChange: (e: any) => void;
  onSearchUnit: (unitName: string) => void;
}

export const BuildingDetails = ({
  style,
  buildingImageSource,
  buildingName,
  buildingEnergyProfile,
  buildingArea,
  buildingTotalFloors,
  hasEnergyAccess,
  energyConsumption,
  hasWaterAccess,
  water,
  hasWasteAccess,
  wasteProduction,
  accessModules,
  buildingEnergySavings,
  buildingWaterSavings,
  wasteProductionByCategory,
  hasCarbonAccess,
  energyCarbonEmission,
  waterCarbonEmission,
  wasteCarbonEmission,
  energyConsumptionPercentage,
  tabletMode,
  hasEnergyAnalysisAccess,
  hasAssetsAnalysisAccess,
  showTenantsAnalyticsButton,
  selectedTenantInsight,
  showTenantsAnalytics,
  searchText,
  selectedZone,
  tenantEnergyConsumption,
  tenantEnergyConsumptionPercentage,
  tenantEnergyCarbonEmission,
  tenantEnergySavings,
  tenantWater,
  tenantWaterCarbonEmission,
  tenantWaterSavings,
  blocks,
  highestZonesConsumption,
  maximumNumberOfUnits,
  getImpactCard,
  onBackButtonClick,
  onSustainabilityAnalysisClick,
  onBuildingManagementClick,
  onTenantsAnalyticsClick,
  onClickConsumptionType,
  onSearchTextChange,
  onSearchUnit
}: BuildingDetailsProps) => {
  const {mobileMode} = useSelector((s: any) => s.styling);
  const {chartConfigurations} = useSelector((s: any) => s.user);
  const styles = mobileMode ? mobileStyles : tabletMode ? tabletStyles : webStyles;
  const isCarbonLoading = energyCarbonEmission.isLoading || waterCarbonEmission.isLoading || wasteCarbonEmission.isLoading;
  const chartTypeConf = chartConfigurations?.find((x: any) => x.chart?.name?.toLowerCase() === `carbonemissionbycategory`);
  let chartType =
    getChartTypeIfExists('carbonEmissionByCategory', chartTypeConf?.chartType?.name) ||
    SustainabilityTrendLineAndBreakdownTypes.carbonEmissionByCategory.donut;
  return (
    <div style={{...styles.container, ...(style ? style : {})}}>
      <div style={styles.leftSection}>
        <div style={styles.buildingImageWrapper}>
          <div style={styles.backButton} onClick={onBackButtonClick}>
            <Text variant="textLink" style={styles.backButtonText}>
              {'< BACK'}
            </Text>
          </div>
          {buildingImageSource && <img style={styles.buildingImage} src={buildingImageSource} alt="" />}
        </div>
        <div style={styles.darkBackgroundValueWrapper}>
          <Text variant="iconLabel" style={styles.leftSectionValue}>
            {buildingName || ''}
          </Text>
        </div>
        <div style={styles.lightBackgroundValueWrapper}>
          <Text variant="iconLabel" style={styles.leftSectionValue}>
            {`AREA (SQM): ${buildingArea || ''}`}
          </Text>
        </div>
        <div style={styles.darkBackgroundValueWrapper}>
          <Text variant="iconLabel" style={styles.leftSectionValue}>
            {buildingEnergyProfile ?? ''}
          </Text>
        </div>
        <div style={styles.lightBackgroundValueWrapper}>
          <Text variant="iconLabel" style={styles.leftSectionValue}>
            {`TOTAL FLOORS: ${buildingTotalFloors || '0'}`}
          </Text>
        </div>
        <div style={styles.buildingSideButtonsWrapper}>
          {hasEnergyAnalysisAccess && (
            <div style={styles.buildingSideButton} onClick={onSustainabilityAnalysisClick}>
              <Text variant="iconLabel">{`SUSTAINABILITY ANALYSIS`}</Text>
            </div>
          )}
          {hasAssetsAnalysisAccess && (
            <div style={styles.buildingSideButton} onClick={onBuildingManagementClick}>
              <Text variant="iconLabel">{`BUILDING MANAGEMENT`}</Text>
            </div>
          )}
          {!mobileMode && showTenantsAnalyticsButton && (
            <div style={styles.buildingSideButton} onClick={onTenantsAnalyticsClick}>
              <Text variant="iconLabel">{showTenantsAnalytics ? 'BUILDING ANALYTICS' : `TENANT ANALYTICS`}</Text>
            </div>
          )}
        </div>
      </div>
      {showTenantsAnalytics && (
        <TenantAnalysis
          blocks={blocks}
          selectedInsight={selectedTenantInsight}
          onClickConsumptionType={onClickConsumptionType}
          searchText={searchText}
          selectedZone={selectedZone}
          onSearchTextChange={onSearchTextChange}
          onSearchUnit={onSearchUnit}
          tenantEnergyConsumption={tenantEnergyConsumption}
          tenantEnergyConsumptionPercentage={tenantEnergyConsumptionPercentage}
          tenantEnergyCarbonEmission={tenantEnergyCarbonEmission}
          tenantEnergySavings={tenantEnergySavings}
          tenantWater={tenantWater}
          tenantWaterCarbonEmission={tenantWaterCarbonEmission}
          tenantWaterSavings={tenantWaterSavings}
          highestZonesConsumption={highestZonesConsumption}
          maximumNumberOfUnits={maximumNumberOfUnits}
        />
      )}
      {!showTenantsAnalytics && (
        <div style={styles.rightSection}>
          <div style={mobileMode ? styles.column : styles.row}>
            {hasEnergyAccess ? (
              energyConsumption.isLoading || energyConsumptionPercentage.isLoading ? (
                <div style={styles.loadingWrapper}>
                  <Loader height="195px" margin={0} />
                </div>
              ) : (
                <SustainabilityTotalConsumptionCard
                  cardVariant="energy"
                  {...TotalConsumptionCardPropsGenerator.init('energy', energyConsumption?.response).getProps()}
                  impactCard={getImpactCard(Insight.ENERGY)}
                  onClickCard={() => {}}
                  condensed
                >
                  {!tabletMode && (
                    <EnergyConsumptionPercentage
                      coolingPercentage={energyConsumptionPercentage.response?.coolingPercentage ?? 0}
                      electricityPercentage={energyConsumptionPercentage.response?.electricityPercentage ?? 0}
                      condensed
                    />
                  )}
                </SustainabilityTotalConsumptionCard>
              )
            ) : (
              <></>
            )}
            {hasEnergyAccess ? (
              buildingEnergySavings.isLoading ? (
                <div style={{...styles.loadingWrapper, ...(!mobileMode && {minWidth: 557, maxWidth: 557})}}>
                  <Loader height="195px" margin={0} />
                </div>
              ) : (
                <SavingsTrendCard
                  condensed
                  tabletMode={tabletMode}
                  mobileMode={mobileMode}
                  insight={Insight.ENERGY}
                  data={buildingEnergySavings?.response?.savings}
                  style={accessModules?.length <= 1 ? styles.highestConsumptionBenchmarkCard : {}}
                />
              )
            ) : (
              <></>
            )}
            {hasEnergyAccess ? <SustainabilityTrendLineAndBreakdownContainer condensed selectedInsight="energy" /> : <></>}
          </div>
          <div style={mobileMode ? styles.column : styles.row}>
            {hasWaterAccess ? (
              water.isLoading ? (
                <div style={styles.loadingWrapper}>
                  <Loader height="195px" margin={0} />
                </div>
              ) : (
                <SustainabilityTotalConsumptionCard
                  cardVariant="water"
                  {...TotalConsumptionCardPropsGenerator.init('water', water?.response).getProps()}
                  impactCard={getImpactCard(Insight.WATER)}
                  onClickCard={() => {}}
                  condensed
                />
              )
            ) : (
              <></>
            )}

            {hasWaterAccess ? (
              buildingWaterSavings.isLoading ? (
                <div style={{...styles.loadingWrapper, ...(!mobileMode && {minWidth: 557, maxWidth: 557})}}>
                  <Loader height="195px" margin={0} />
                </div>
              ) : (
                <SavingsTrendCard
                  condensed
                  tabletMode={tabletMode}
                  mobileMode={mobileMode}
                  insight={Insight.WATER}
                  data={buildingWaterSavings?.response?.savings}
                  style={accessModules?.length <= 1 ? styles.highestConsumptionBenchmarkCard : {}}
                />
              )
            ) : (
              <></>
            )}
            {hasWaterAccess ? <SustainabilityTrendLineAndBreakdownContainer condensed selectedInsight="water" /> : <></>}
          </div>
          <div style={mobileMode ? styles.column : styles.row}>
            {hasWasteAccess ? (
              wasteProduction.isLoading ? (
                <div style={styles.loadingWrapper}>
                  <Loader height="195px" margin={0} />
                </div>
              ) : (
                <SustainabilityTotalConsumptionCard
                  cardVariant="waste"
                  {...TotalConsumptionCardPropsGenerator.init('waste', wasteProduction?.response).getProps()}
                  rightColumnValue={`${wasteProduction?.response?.divertedPercentage ?? 0}`}
                  rightColumnUnit={'DIVERTED FROM LANDFILL'}
                  onClickCard={() => {}}
                  condensed
                />
              )
            ) : (
              <></>
            )}
            {hasWasteAccess ? (
              wasteProductionByCategory.isLoading ? (
                <div style={{...styles.loadingWrapper, ...(!mobileMode && {minWidth: 557, maxWidth: 557})}}>
                  <Loader height="195px" margin={0} />
                </div>
              ) : (
                <OperationsWasteProductionByCategoryCard
                  list={wasteProductionByCategory?.response || []}
                  condensed
                  tabletMode={tabletMode}
                  mobileMode={mobileMode}
                />
              )
            ) : (
              <></>
            )}
            {hasWasteAccess ? <SustainabilityTrendLineAndBreakdownContainer condensed selectedInsight="waste" /> : <></>}
          </div>
          <div style={mobileMode ? styles.column : styles.row}>
            {hasCarbonAccess ? (
              energyCarbonEmission.isLoading || waterCarbonEmission.isLoading || wasteCarbonEmission.isLoading ? (
                <div style={styles.loadingWrapper}>
                  <Loader height="195px" margin={0} />
                </div>
              ) : (
                <SustainabilityTotalConsumptionCard
                  cardVariant="carbon"
                  carbonCard={{
                    energyValue: energyCarbonEmission?.response?.value ?? 0,
                    waterValue: waterCarbonEmission?.response?.value ?? 0,
                    wasteValue: wasteCarbonEmission?.response?.value ?? 0,
                    showDrillDown: true
                  }}
                  onClickCard={() => {}}
                  condensed
                />
              )
            ) : (
              <></>
            )}
            {hasCarbonAccess ? (
              isCarbonLoading ? (
                <div style={{...styles.loadingWrapper, ...(!mobileMode && {minWidth: 557, maxWidth: 557})}}>
                  <Loader height="195px" margin={0} />
                </div>
              ) : chartType === SustainabilityTrendLineAndBreakdownTypes.carbonEmissionByCategory.donut ? (
                <CarbonEmissionByCategoryCard
                  energyCarbonTotalValue={energyCarbonEmission?.response?.value || 0}
                  waterCarbonTotalValue={waterCarbonEmission?.response?.value || 0}
                  wasteCarbonTotalValue={wasteCarbonEmission?.response?.value || 0}
                  condensed
                />
              ) : chartType === SustainabilityTrendLineAndBreakdownTypes.carbonEmissionByCategory.semiCircle ? (
                <CarbonEmissionSemiCircleByCategoryCard
                  energyCarbonTotalValue={energyCarbonEmission?.response?.value || 0}
                  waterCarbonTotalValue={waterCarbonEmission?.response?.value || 0}
                  wasteCarbonTotalValue={wasteCarbonEmission?.response?.value || 0}
                  condensed
                />
              ) : chartType === SustainabilityTrendLineAndBreakdownTypes.carbonEmissionByCategory.parliamentBar ? (
                <CarbonEmissionParliamentByCategoryCard
                  energyCarbonTotalValue={energyCarbonEmission?.response?.value || 0}
                  waterCarbonTotalValue={waterCarbonEmission?.response?.value || 0}
                  wasteCarbonTotalValue={wasteCarbonEmission?.response?.value || 0}
                  condensed
                />
              ) : (
                <div></div>
              )
            ) : (
              <></>
            )}
            {hasCarbonAccess ? <SustainabilityTrendLineAndBreakdownContainer condensed selectedInsight="carbon" /> : <></>}
          </div>
        </div>
      )}
    </div>
  );
};
