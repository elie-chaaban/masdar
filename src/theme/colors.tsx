export type Color = string;

export type ValidColorPalettes = 'default' | 'dark' | 'default-solid';

export const NamedColors = {
  gray10: '#E0E0E0',
  gray20: '#F3F3F3',
  gray30: '#C7CDD1',
  gray40: '#F5F5F5',
  gray45: '#EEEEEE',
  gray50: '#E8E8E8',
  gray55: '#434343',
  gray60: '#D9D9D9',
  gray70: '#D1D1D1',
  gray80: '#EAEAEA',
  gray85: '#D3D3D3',
  gray90: '#091310',
  gray95: '#181715',
  gray100: '#9EA1A2',
  darkGray10: '#718DA1',
  darkGray50: '#6B6B6B',
  darkGray80: '#383838',
  darkGray90: '#434343',
  // blue30: '#74BCEE',
  // blue40: '#39A4EF',
  transparent02: 'rgba(43, 43, 43, 0.2)',
  blue40: '#6F97AE',
  blue50: '#5D829B',
  blue60: '#39566B',
  blue70: '#344B58',
  blue80: '#304250',
  blue90: '#7EF7FF',
  teal10: '#367CAD',
  teal15: '#4D7389',
  teal20: '#377A88',
  teal30: '#4EABA9',
  teal40: '#ACD3DB',
  teal60: '#E3EEFA',
  teal70: '#4D7389',
  teal80: '#00A8A9',

  red10: '#FBF2F2',
  red20: '#F28484',
  red50: '#AF171D',
  orange20: 'rgba(175, 123, 23, 0.4)',
  orange50: '#C57A23',
  green10: '#F4FBF2',
  green20: 'rgba(106, 198, 126, 0.4)',
  green40: '#8EFF8B',
  green50: '#37693C',
  purple50: '#3657AD',
  white: 'white',
  black10: '#1C1C1C',
  black20: '#272727',
  black30: '#2C2C2C',
  black: '#000000',
  lightBlack: 'rgb(22,22,22)',
  transparentWhite06: 'rgba(255, 255, 255, 0.6)',
  transparentWhite08: 'rgba(255, 255, 255, 0.8)',
  transparentGray02: 'rgba(217, 217, 217, 0.22)',
  transparentGray05: 'rgba(217, 217, 217, 0.5)',
  transparentBlack05: 'rgba(180, 202, 45, 0.00)',
  alphaBlack30: 'rgba(0, 0, 0, 0.3)',
  alphaBlack50: 'rgba(0, 0, 0, 0.5)',
  alphaBlack60: 'rgba(0, 0, 0, 0.6)',
  alphaBlack70: 'rgba(0, 0, 0, 0.7)',
  blackTransparentRadient: 'linear-gradient(180deg, rgba(0,0,0,0.5) 24.55%, rgba(0,0,0,0) 100%)',
  yellow: '#f2c94c'
};

export type ActiveColorKey = keyof typeof NamedColors;

export function lookupColorByName(colorName: keyof typeof NamedColors | null): Color | null {
  if (null == colorName) {
    return colorName;
  }
  if (!(colorName in NamedColors)) {
    console.error('Unsupported color used', colorName);
  }
  return NamedColors[colorName];
}

export const inactiveColors = {};

export interface ColorPalette {
  paletteId: ValidColorPalettes;

  dashboardHeader: Color;
  sidebar: Color;
  globalBackground: Color;
  lightBackground: Color;
  periodOptionBackground: Color;
  periodOptionActiveBackground: Color;
  textButton: Color;
  textButtonToggled: Color;
  textButtonGrayed: Color;
  sideCardsBackground: Color;
  percentageBarBackground: Color;
  heatmapLow: Color;
  heatmapLowLight: Color;
  heatmapMedium: Color;
  heatmapMediumLight: Color;
  heatmapHigh: Color;
  heatmapHighLight: Color;
  switchBackground: Color;
  switchInactive: Color;
  transparentLight: Color;
  impactCardContainerHigh: Color;
  impactCardContainerLow: Color;
  buildingCard: Color;
  buildingChartBar: Color;
  alarmBillBackground: Color;
  treeAlarmBackground: Color;
  alarmMarkerBackground: Color;
  cleanElectricityCard: Color;
  cleanElectricityBottomCard: Color;
  airQualityParameterCard: Color;
  airQualityParameterCardHeader: Color;
  sidePanelItemActiveBackground: Color;
  infoValueCellBackground: Color;
  infoLabelCellBackground: Color;
  moduleActive: Color;
  securityChartsLegendBackground: Color;
  securityIncidentsTotalBackground: Color;
  incidentTypeNameBackground: Color;
  incidentTypeCountBackground: Color;
  frequencyOfOccurenceTotal: Color;
  frequencyOfOccurenceType: Color;
  tabBackground: Color;
  activeTabBackground: Color;
  gridHeaderRowBackground: Color;
  actionSliderBackground: Color;
  periodSelectionBackground: Color;
  consumptionCardBackground: Color;
  consumptionCardInnerCardBackground: Color;
  consumptionCardIconBackground: Color;
  consumptionCardPositivePercentage: Color;
  consumptionCardNegativePercentage: Color;
  chartsCardBackground: Color;
  chartsCardHeaderBackground: Color;
  buildingCardGreenEfficiency: Color;
  buildingCardYellowEfficiency: Color;
  buildingCardRedEfficiency: Color;
  wasteProductionProgressBar: Color;
  periodSelectionContainerBackground: Color;
  heatmapBackground: Color;
  buildingComparisonBackground: Color;
  buildingComparisonLightRow: Color;
  buildingComparisonDarkRow: Color;
  collectedDataBackground: Color;
  collectedDataBorder: Color;
  buildingDetailsBackground: Color;
  buildingDetailsBackButtonText: Color;
  buildingDetailsSideBackground: Color;
  buildingDetailsLightSideBackground: Color;
  buildingDetailsBorderColor: Color;
  unitCardTopBackground: Color;
  unitCardBottomLeftBackground: Color;
  unitCardBottomRightBackground: Color;

  white: Color;
  black: Color;

  light: () => ColorPalette | null;

  solid: () => ColorPalette | null;

  dark: () => ColorPalette | null;
}

export const PrimaryPalette: ColorPalette = {
  paletteId: 'default' as ValidColorPalettes,

  dashboardHeader: NamedColors.gray50,
  sidebar: NamedColors.lightBlack,
  globalBackground: NamedColors.gray85,
  lightBackground: NamedColors.gray50,
  periodOptionBackground: NamedColors.transparent02,
  periodOptionActiveBackground: NamedColors.teal10,
  textButton: NamedColors.teal15,
  textButtonToggled: NamedColors.teal30,
  textButtonGrayed: NamedColors.gray100,
  sideCardsBackground: NamedColors.gray40,
  percentageBarBackground: NamedColors.gray80,
  heatmapLow: NamedColors.green50,
  heatmapLowLight: NamedColors.green20,
  heatmapMedium: NamedColors.orange50,
  heatmapMediumLight: NamedColors.orange20,
  heatmapHigh: NamedColors.red50,
  heatmapHighLight: NamedColors.red20,
  switchBackground: NamedColors.gray30,
  switchInactive: NamedColors.darkGray10,
  transparentLight: NamedColors.transparentWhite06,
  impactCardContainerHigh: NamedColors.red10,
  impactCardContainerLow: NamedColors.green10,
  buildingCard: NamedColors.alphaBlack50,
  buildingChartBar: NamedColors.teal10,
  alarmBillBackground: NamedColors.purple50,
  treeAlarmBackground: NamedColors.green50,
  alarmMarkerBackground: NamedColors.transparentWhite08,
  cleanElectricityCard: NamedColors.teal60,
  airQualityParameterCard: NamedColors.teal20,
  airQualityParameterCardHeader: NamedColors.teal30,
  sidePanelItemActiveBackground: NamedColors.transparentGray02,
  infoValueCellBackground: NamedColors.transparentGray05,
  infoLabelCellBackground: NamedColors.transparentGray02,
  moduleActive: NamedColors.blue90,
  securityChartsLegendBackground: NamedColors.green10,
  securityIncidentsTotalBackground: NamedColors.blue60,
  incidentTypeNameBackground: NamedColors.gray30,
  incidentTypeCountBackground: NamedColors.teal40,
  frequencyOfOccurenceTotal: NamedColors.blue70,
  frequencyOfOccurenceType: NamedColors.gray10,
  tabBackground: NamedColors.blue60,
  activeTabBackground: NamedColors.blue50,
  gridHeaderRowBackground: NamedColors.blue80,
  actionSliderBackground: NamedColors.gray90,
  periodSelectionBackground: NamedColors.gray60,
  cleanElectricityBottomCard: NamedColors.teal30,
  consumptionCardBackground: NamedColors.alphaBlack70,
  consumptionCardInnerCardBackground: NamedColors.alphaBlack30,
  consumptionCardIconBackground: NamedColors.alphaBlack60,
  consumptionCardPositivePercentage: NamedColors.green40,
  consumptionCardNegativePercentage: NamedColors.red20,
  chartsCardBackground: NamedColors.alphaBlack70,
  chartsCardHeaderBackground: NamedColors.gray95,
  buildingCardGreenEfficiency: NamedColors.green40,
  buildingCardYellowEfficiency: NamedColors.yellow,
  buildingCardRedEfficiency: NamedColors.red20,
  wasteProductionProgressBar: NamedColors.green40,
  periodSelectionContainerBackground: NamedColors.blackTransparentRadient,
  heatmapBackground: NamedColors.alphaBlack70,
  buildingComparisonBackground: NamedColors.darkGray90,
  buildingComparisonLightRow: NamedColors.alphaBlack60,
  buildingComparisonDarkRow: NamedColors.darkGray80,
  collectedDataBackground: NamedColors.alphaBlack70,
  collectedDataBorder: NamedColors.darkGray50,
  buildingDetailsBackground: NamedColors.black10,
  buildingDetailsBackButtonText: NamedColors.teal80,
  buildingDetailsSideBackground: NamedColors.black20,
  buildingDetailsLightSideBackground: NamedColors.gray55,
  buildingDetailsBorderColor: NamedColors.transparentBlack05,
  unitCardTopBackground: NamedColors.blue40,
  unitCardBottomLeftBackground: NamedColors.teal15,
  unitCardBottomRightBackground: NamedColors.black30,

  white: NamedColors.white,
  black: NamedColors.black,

  light: () => {
    return null;
  },
  solid: () => {
    return null;
  },
  dark: () => {
    return null;
  }
};

const SolidBackgroundPalette = {
  ...PrimaryPalette,
  paletteId: 'default-solid' as ValidColorPalettes,

  dashboardHeader: NamedColors.gray50
};

const DarkModePalette = {
  ...PrimaryPalette,
  paletteId: 'dark' as ValidColorPalettes,

  dashboardHeader: NamedColors.gray90,
  sidebar: NamedColors.lightBlack,
  globalBackground: NamedColors.gray85,
  lightBackground: NamedColors.gray50,
  periodOptionBackground: NamedColors.transparent02,
  periodOptionActiveBackground: NamedColors.teal10,
  textButton: NamedColors.teal15,
  textButtonToggled: NamedColors.teal30,
  textButtonGrayed: NamedColors.gray100,
  sideCardsBackground: NamedColors.gray40,
  percentageBarBackground: NamedColors.gray80,
  heatmapLow: NamedColors.green50,
  heatmapLowLight: NamedColors.green20,
  heatmapMedium: NamedColors.orange50,
  heatmapMediumLight: NamedColors.orange20,
  heatmapHigh: NamedColors.red50,
  heatmapHighLight: NamedColors.red20,
  switchBackground: NamedColors.gray30,
  switchInactive: NamedColors.darkGray10,
  transparentLight: NamedColors.transparentWhite06,
  impactCardContainerHigh: NamedColors.red10,
  impactCardContainerLow: NamedColors.green10,
  buildingCard: NamedColors.alphaBlack50,
  buildingChartBar: NamedColors.teal10,
  alarmBillBackground: NamedColors.purple50,
  treeAlarmBackground: NamedColors.green50,
  alarmMarkerBackground: NamedColors.transparentWhite08,
  cleanElectricityCard: NamedColors.teal60,
  airQualityParameterCard: NamedColors.teal20,
  airQualityParameterCardHeader: NamedColors.teal30,
  sidePanelItemActiveBackground: NamedColors.transparentGray02,
  infoValueCellBackground: NamedColors.transparentGray05,
  infoLabelCellBackground: NamedColors.transparentGray02,
  moduleActive: NamedColors.blue90,
  securityChartsLegendBackground: NamedColors.green10,
  securityIncidentsTotalBackground: NamedColors.blue60,
  incidentTypeNameBackground: NamedColors.gray30,
  incidentTypeCountBackground: NamedColors.teal40,
  frequencyOfOccurenceTotal: NamedColors.blue70,
  frequencyOfOccurenceType: NamedColors.gray10,
  tabBackground: NamedColors.blue60,
  activeTabBackground: NamedColors.blue50,
  gridHeaderRowBackground: NamedColors.blue80,
  actionSliderBackground: NamedColors.gray90,
  periodSelectionBackground: NamedColors.gray60,
  cleanElectricityBottomCard: NamedColors.teal30,
  consumptionCardBackground: NamedColors.alphaBlack70,
  consumptionCardInnerCardBackground: NamedColors.alphaBlack30,
  consumptionCardIconBackground: NamedColors.alphaBlack60,
  consumptionCardPositivePercentage: NamedColors.green40,
  consumptionCardNegativePercentage: NamedColors.red20,
  chartsCardBackground: NamedColors.alphaBlack70,
  chartsCardHeaderBackground: NamedColors.gray95,
  buildingCardGreenEfficiency: NamedColors.green40,
  buildingCardYellowEfficiency: NamedColors.yellow,
  buildingCardRedEfficiency: NamedColors.red20,
  wasteProductionProgressBar: NamedColors.green40,
  periodSelectionContainerBackground: NamedColors.blackTransparentRadient,
  heatmapBackground: NamedColors.alphaBlack70,
  buildingComparisonBackground: NamedColors.darkGray90,
  buildingComparisonLightRow: NamedColors.alphaBlack60,
  buildingComparisonDarkRow: NamedColors.darkGray80,
  collectedDataBackground: NamedColors.alphaBlack70,
  collectedDataBorder: NamedColors.darkGray50,
  buildingDetailsBackground: NamedColors.black10,
  buildingDetailsBackButtonText: NamedColors.teal80,
  buildingDetailsSideBackground: NamedColors.black20,
  buildingDetailsLightSideBackground: NamedColors.gray55,

  white: NamedColors.black,
  black: NamedColors.white
};

const paletteTable: {[key in ValidColorPalettes]: ColorPalette} = {} as any;
for (const palette of [PrimaryPalette, SolidBackgroundPalette, DarkModePalette]) {
  palette.solid = () => SolidBackgroundPalette;
  palette.light = () => PrimaryPalette;
  palette.dark = () => DarkModePalette;

  paletteTable[palette.paletteId] = palette;
}

export function colorPaletteById(paletteId: ValidColorPalettes | undefined): ColorPalette {
  if (paletteId != null && !['default', 'dark'].includes(paletteId)) {
    throw new Error('Unsupported Color Palette! `' + paletteId + '`');
  }

  if (paletteId === undefined) {
    throw new Error('Unsupported Color Palette Key!');
  }
  return paletteTable[paletteId] || paletteTable.default;
}
