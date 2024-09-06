import {formatDecimals} from './dashboard/units';

export interface TotalConsumptionResponse {
  consumptionBenchmark: number | string | undefined;
  intensityBenchmark: number | string | undefined;
  energy: number | string | undefined;
  water: number | string | undefined;
  waste: number | string | undefined;
  kwh: number | string | undefined;
}

export type CardVariant = 'energy' | 'water' | 'waste';

export interface TotalConsumptionProps {
  leftColumnValue?: string;
  leftColumnUnit?: string;
  bottomLeftColumnValue?: string;
  rightColumnValue?: string;
  rightColumnUnit?: string;
  bottomRightColumnValue?: string;
}

export class TotalConsumptionCardPropsGenerator {
  private static variant: CardVariant = 'energy';
  private static consumption: number = 0;
  private static intensity: number = 0;
  private static production: number = 0;
  private static consumptionBenchmark: number = 0;
  private static intensityBenchmark: number = 0;

  private static convertValue = (value: any): number => {
    if (value === undefined || value === null) {
      return 0;
    }

    if (typeof value === 'number') {
      return value;
    }

    return parseFloat(value);
  };

  public static init(variant: CardVariant, response: TotalConsumptionResponse) {
    this.variant = variant;

    if (response) {
      if (variant === 'waste') {
        this.production = this.convertValue(response.waste);
      } else if (variant === 'energy') {
        this.consumption = this.convertValue(response.energy);
      } else if (variant === 'water') {
        this.consumption = this.convertValue(response.water);
      }

      this.intensity = this.convertValue(response.kwh);
      this.consumptionBenchmark = this.convertValue(response.consumptionBenchmark);
      this.intensityBenchmark = this.convertValue(response.intensityBenchmark);
    }

    return this;
  }

  public static getProps = (): TotalConsumptionProps => {
    let consumptionValue = this.consumption;
    let intensityValue = this.intensity;
    let consumptionBenchmarkValue = this.consumptionBenchmark;
    let intensityBenchmarkValue = this.intensityBenchmark;
    let consumptionUnit;
    let intensityUnit;
    if (this.variant === 'energy') {
      if (consumptionValue > 1000 && consumptionBenchmarkValue > 1000) {
        consumptionValue = consumptionValue / 1000;
        consumptionBenchmarkValue = consumptionBenchmarkValue / 1000;
        consumptionUnit = 'MWh';
      } else {
        consumptionUnit = 'KWh';
      }

      if (intensityValue > 1000 && intensityBenchmarkValue > 1000) {
        intensityValue = intensityValue / 1000;
        intensityBenchmarkValue = intensityBenchmarkValue / 1000;
        intensityUnit = 'MWh/SQM';
      } else {
        intensityUnit = 'KWh/SQM';
      }
      return {
        leftColumnValue: formatDecimals(consumptionValue, 2),
        leftColumnUnit: consumptionUnit,
        bottomLeftColumnValue: formatDecimals(consumptionBenchmarkValue, 2),
        rightColumnValue: formatDecimals(intensityValue, 2),
        rightColumnUnit: intensityUnit,
        bottomRightColumnValue: formatDecimals(intensityBenchmarkValue, 2)
      };
    }

    if (this.variant === 'water') {
      if (consumptionValue > 1000 && consumptionBenchmarkValue > 1000) {
        consumptionValue = consumptionValue / 1000;
        consumptionBenchmarkValue = consumptionBenchmarkValue / 1000;
        consumptionUnit = '1,000 M³';
      } else {
        consumptionUnit = 'M³';
      }

      if (intensityValue < 10 && intensityBenchmarkValue < 10) {
        intensityValue = intensityValue * 1000;
        intensityBenchmarkValue = intensityBenchmarkValue * 1000;
        intensityUnit = 'L/SQM';
      } else {
        intensityUnit = 'M³/SQM';
      }
      return {
        leftColumnValue: formatDecimals(consumptionValue, 2),
        leftColumnUnit: consumptionUnit,
        bottomLeftColumnValue: formatDecimals(consumptionBenchmarkValue, 2),
        rightColumnValue: formatDecimals(intensityValue, 2),
        rightColumnUnit: intensityUnit,
        bottomRightColumnValue: formatDecimals(intensityBenchmarkValue, 2)
      };
    }

    if (this.variant === 'waste') {
      if (this.production > 1000) {
        consumptionValue = this.production / 1000;
        consumptionUnit = 'Tons';
      } else {
        consumptionValue = this.production;
        consumptionUnit = 'KG';
      }
      return {
        leftColumnValue: formatDecimals(consumptionValue, 2),
        leftColumnUnit: consumptionUnit
      };
    }

    return {};
  };
}
