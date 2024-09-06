type ChartNames =
  | 'energy'
  | 'water'
  | 'waste'
  | 'electricity'
  | 'hvac'
  | 'lighting'
  | 'lift'
  | 'emergency'
  | 'others'
  | 'cooling'
  | 'carbon'
  | 'pvProduction'
  | 'pvProductionTrendLine';

export const SustainabilityTrendLineAndBreakdownVariants: {[K in ChartNames]: ChartNames} = {
  energy: 'energy',
  water: 'water',
  waste: 'waste',
  electricity: 'electricity',
  hvac: 'hvac',
  lighting: 'lighting',
  lift: 'lift',
  emergency: 'emergency',
  others: 'others',
  cooling: 'cooling',
  carbon: 'carbon',
  pvProduction: 'pvProduction',
  pvProductionTrendLine: 'pvProductionTrendLine'
};

interface EnergyChartType {
  stackedColumn: string;
  spline: string;
  column: string;
  areaSpline: string;
}
interface WaterChartType {
  columnWithTrendline: string;
  spline: string;
  column: string;
  areaSpline: string;
}
interface CarbonChartType {
  stackedWithTrendline: string;
  column: string;
  areaSpline: string;
}
interface WasteChartType {
  stackedWithTrendline: string;
  column: string;
  area: string;
}
interface CarbonEmissionByCategoryChartType {
  semiCircle: string;
  parliamentBar: string;
  donut: string;
}

interface SustainabilityTypes {
  energy: EnergyChartType;
  water: WaterChartType;
  carbon: CarbonChartType;
  waste: WasteChartType;
  carbonEmissionByCategory: CarbonEmissionByCategoryChartType;
}

export const SustainabilityTrendLineAndBreakdownTypes: SustainabilityTypes = {
  energy: {
    stackedColumn: 'stackedColumn',
    spline: 'spline',
    column: 'column',
    areaSpline: 'areaSpline'
  },
  water: {
    columnWithTrendline: 'columnWithTrendline',
    spline: 'spline',
    column: 'column',
    areaSpline: 'areaSpline'
  },
  carbon: {
    stackedWithTrendline: 'stackedWithTrendline',
    column: 'column',
    areaSpline: 'areaSpline'
  },
  waste: {
    stackedWithTrendline: 'stackedWithTrendline',
    column: 'column',
    area: 'area'
  },
  carbonEmissionByCategory: {
    donut: 'donut',
    parliamentBar: 'parliamentBar',
    semiCircle: 'semiCircle'
  }
};

export const getChartTypeIfExists = (type: keyof SustainabilityTypes, value: string): string | null => {
  const selectedType = SustainabilityTrendLineAndBreakdownTypes[type];
  if (!selectedType) {
    return '';
  }
  const matchingValue = Object.values(selectedType).find((typeValue) => typeValue?.toLowerCase() === value?.toLowerCase());
  return matchingValue || null;
};
