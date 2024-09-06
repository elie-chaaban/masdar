import {isNumber} from 'lodash';
import {Insight, Intensity, TrendLineOrBreakdown} from './constants';
export enum UnitFormat {
  Number,
  String
}

export const formatDecimals = (num: number, decimals: number, withThousandsSeparator = true): string => {
  if (!withThousandsSeparator) {
    if (num >= 10) return num.toFixed(0);
    return num.toFixed(decimals);
  }
  if (num >= 10) return Number(+num.toFixed(0)).toLocaleString();
  return Number(+num.toFixed(decimals)).toLocaleString();
};

export function valueFormatter(
  type: Insight | Intensity | TrendLineOrBreakdown,
  value: number | string,
  format: UnitFormat = UnitFormat.Number
): number | string {
  if (value === undefined || value === null) {
    if (typeof value === 'number') {
      return 0;
    } else {
      return '0';
    }
  }

  switch (type) {
    case Insight.ENERGY: {
      let result: number = 0;
      if (isNumber(value)) {
        result = (value as number) > 1000 ? value / 1000 : value;
      } else {
        result = parseFloat(value as string) > 1000 ? parseFloat(value as string) / 1000 : parseFloat(value as string);
      }
      if (format === UnitFormat.Number) {
        return result;
      } else if (format === UnitFormat.String) {
        return formatDecimals(result, 2);
      } else {
        return 0;
      }
    }
    case Intensity.ENERGY_INTENSITY: {
      let result: number = 0;
      if (isNumber(value)) {
        result = value;
      } else {
        result = parseFloat(value as string);
      }
      if (format === UnitFormat.Number) {
        return result;
      } else if (format === UnitFormat.String) {
        return formatDecimals(result, 2);
      } else {
        return 0;
      }
    }
    case Insight.WATER: {
      let result: number = 0;
      if (isNumber(value)) {
        result = value;
      } else {
        result = parseFloat(value as string);
      }
      if (format === UnitFormat.Number) {
        return result;
      } else if (format === UnitFormat.String) {
        return formatDecimals(result, 2);
      } else {
        return 0;
      }
    }
    case Intensity.WATER_INTENSITY: {
      let result: number = 0;
      if (isNumber(value)) {
        result = (value as number) < 10 ? value * 1000 : value;
      } else {
        result = parseFloat(value as string) < 10 ? parseFloat(value as string) * 1000 : parseFloat(value as string);
      }
      if (format === UnitFormat.Number) {
        return result;
      } else if (format === UnitFormat.String) {
        return formatDecimals(result, 1);
      } else {
        return 0;
      }
    }
    case Insight.WASTE: {
      let result: number = 0;
      if (isNumber(value)) {
        result = (value as number) > 1000 ? value / 1000 : value;
      } else {
        result = parseFloat(value as string) > 1000 ? parseFloat(value as string) / 1000 : parseFloat(value as string);
      }
      if (format === UnitFormat.Number) {
        return result;
      } else if (format === UnitFormat.String) {
        return formatDecimals(result, 2);
      } else {
        return 0;
      }
    }
    case TrendLineOrBreakdown.ELECTRICITY: {
      let result: number = 0;
      if (isNumber(value)) {
        result = (value as number) > 1000 ? value / 1000 : value;
      } else {
        result = parseFloat(value as string) > 1000 ? parseFloat(value as string) / 1000 : parseFloat(value as string);
      }
      if (format === UnitFormat.Number) {
        return result;
      } else if (format === UnitFormat.String) {
        return formatDecimals(result, 2);
      } else {
        return 0;
      }
    }
    case TrendLineOrBreakdown.HVAC:
      return 0;
    case TrendLineOrBreakdown.LIGHTING: {
      let result: number = 0;
      if (isNumber(value)) {
        result = (value as number) > 1000 ? value / 1000 : value;
      } else {
        result = parseFloat(value as string) > 1000 ? parseFloat(value as string) / 1000 : parseFloat(value as string);
      }
      if (format === UnitFormat.Number) {
        return result;
      } else if (format === UnitFormat.String) {
        return formatDecimals(result, 2);
      } else {
        return 0;
      }
    }
    case TrendLineOrBreakdown.LIFT: {
      let result: number = 0;
      if (isNumber(value)) {
        result = (value as number) > 1000 ? value / 1000 : value;
      } else {
        result = parseFloat(value as string) > 1000 ? parseFloat(value as string) / 1000 : parseFloat(value as string);
      }
      if (format === UnitFormat.Number) {
        return result;
      } else if (format === UnitFormat.String) {
        return formatDecimals(result, 2);
      } else {
        return 0;
      }
    }
    case TrendLineOrBreakdown.EMERGENCY: {
      let result: number = 0;
      if (isNumber(value)) {
        result = (value as number) > 1000 ? value / 1000 : value;
      } else {
        result = parseFloat(value as string) > 1000 ? parseFloat(value as string) / 1000 : parseFloat(value as string);
      }
      if (format === UnitFormat.Number) {
        return result;
      } else if (format === UnitFormat.String) {
        return formatDecimals(result, 2);
      } else {
        return 0;
      }
    }
    case TrendLineOrBreakdown.OTHERS: {
      let result: number = 0;
      if (isNumber(value)) {
        result = (value as number) > 1000 ? value / 1000 : value;
      } else {
        result = parseFloat(value as string) > 1000 ? parseFloat(value as string) / 1000 : parseFloat(value as string);
      }
      if (format === UnitFormat.Number) {
        return result;
      } else if (format === UnitFormat.String) {
        return formatDecimals(result, 2);
      } else {
        return 0;
      }
    }
    case TrendLineOrBreakdown.COOLING: {
      let result: number = 0;
      if (isNumber(value)) {
        result = (value as number) > 1000 ? value / 1000 : value;
      } else {
        result = parseFloat(value as string) > 1000 ? parseFloat(value as string) / 1000 : parseFloat(value as string);
      }
      if (format === UnitFormat.Number) {
        return result;
      } else if (format === UnitFormat.String) {
        return formatDecimals(result, 2);
      } else {
        return 0;
      }
    }
    case TrendLineOrBreakdown.CARBON: {
      let result: number = 0;
      if (isNumber(value)) {
        result = (value as number) > 1000 ? value / 1000 : value;
      } else {
        result = parseFloat(value as string) > 1000 ? parseFloat(value as string) / 1000 : parseFloat(value as string);
      }
      if (format === UnitFormat.Number) {
        return result;
      } else if (format === UnitFormat.String) {
        return formatDecimals(result, 2);
      } else {
        return 0;
      }
    }
    default:
      return 0;
  }
}

export function unitFormatter(type: Insight | Intensity | TrendLineOrBreakdown, value?: number | string): string {
  switch (type) {
    case Insight.ENERGY: {
      let result: string = 'KWh';
      if (value === undefined || value === null) {
        return result;
      }
      if (isNumber(value)) {
        result = (value as number) > 1000 ? 'MWh' : 'KWh';
      } else {
        result = parseFloat(value as string) > 1000 ? 'MWh' : 'KWh';
      }
      return result;
    }
    case Intensity.ENERGY_INTENSITY: {
      let result: string = 'KWh/SQM';
      if (value === undefined || value === null) {
        return result;
      }
      if (isNumber(value)) {
        result = (value as number) > 1000 ? 'MWh/SQM' : 'KWh/SQM';
      } else {
        result = parseFloat(value as string) > 1000 ? 'MWh/SQM' : 'KWh/SQM';
      }
      return result;
    }
    case Insight.WATER: {
      let result: string = 'M³';
      if (value === undefined || value === null) {
        return result;
      }
      if (isNumber(value)) {
        result = (value as number) > 10 ? 'M³' : 'L';
      } else {
        result = parseFloat(value as string) > 10 ? 'M³' : 'L';
      }
      return result;
    }
    case Intensity.WATER_INTENSITY: {
      let result: string = 'L/SQM';
      if (value === undefined || value === null) {
        return result;
      }
      if (isNumber(value)) {
        result = (value as number) < 10 ? 'L/SQM' : 'M³/SQM';
      } else {
        result = parseFloat(value as string) < 10 ? 'L/SQM' : 'M³/SQM';
      }
      return result;
    }
    case Insight.WASTE: {
      let result: string = 'KG';
      if (value === undefined || value === null) {
        return result;
      }
      if (isNumber(value)) {
        result = (value as number) > 1000 ? 'Tons' : 'KG';
      } else {
        result = parseFloat(value as string) > 1000 ? 'Tons' : 'KG';
      }
      return result;
    }
    case TrendLineOrBreakdown.ELECTRICITY: {
      let result: string = 'KWh';
      if (value === undefined || value === null) {
        return result;
      }
      if (isNumber(value)) {
        result = (value as number) > 1000 ? 'MWh' : 'KWh';
      } else {
        result = parseFloat(value as string) > 1000 ? 'MWh' : 'KWh';
      }
      return result;
    }
    case TrendLineOrBreakdown.HVAC:
      return '';
    case TrendLineOrBreakdown.LIGHTING: {
      let result: string = 'KWh';
      if (value === undefined || value === null) {
        return result;
      }
      if (isNumber(value)) {
        result = (value as number) > 1000 ? 'MWh' : 'KWh';
      } else {
        result = parseFloat(value as string) > 1000 ? 'MWh' : 'KWh';
      }
      return result;
    }
    case TrendLineOrBreakdown.LIFT: {
      let result: string = 'KWh';
      if (value === undefined || value === null) {
        return result;
      }
      if (isNumber(value)) {
        result = (value as number) > 1000 ? 'MWh' : 'KWh';
      } else {
        result = parseFloat(value as string) > 1000 ? 'MWh' : 'KWh';
      }
      return result;
    }
    case TrendLineOrBreakdown.EMERGENCY: {
      let result: string = 'KWh';
      if (value === undefined || value === null) {
        return result;
      }
      if (isNumber(value)) {
        result = (value as number) > 1000 ? 'MWh' : 'KWh';
      } else {
        result = parseFloat(value as string) > 1000 ? 'MWh' : 'KWh';
      }
      return result;
    }
    case TrendLineOrBreakdown.OTHERS: {
      let result: string = 'KWh';
      if (value === undefined || value === null) {
        return result;
      }
      if (isNumber(value)) {
        result = (value as number) > 1000 ? 'MWh' : 'KWh';
      } else {
        result = parseFloat(value as string) > 1000 ? 'MWh' : 'KWh';
      }
      return result;
    }
    case TrendLineOrBreakdown.COOLING: {
      let result: string = 'KWh';
      if (value === undefined || value === null) {
        return result;
      }
      if (isNumber(value)) {
        result = (value as number) > 1000 ? 'MWh' : 'KWh';
      } else {
        result = parseFloat(value as string) > 1000 ? 'MWh' : 'KWh';
      }
      return result;
    }
    case TrendLineOrBreakdown.CARBON: {
      let result: string = 'KG';
      if (value === undefined || value === null) {
        return result;
      }
      if (isNumber(value)) {
        result = (value as number) > 1000 ? 'Tons' : 'KG';
      } else {
        result = parseFloat(value as string) > 1000 ? 'Tons' : 'KG';
      }
      return result;
    }
    default:
      return '';
  }
}

export function percentageFormatter(value: number | string, format: UnitFormat = UnitFormat.Number): number | string {
  if (value === undefined || value === null) {
    if (typeof value === 'number') {
      return 0;
    } else {
      return '0';
    }
  }

  let result: number = 0;
  if (isNumber(value)) {
    result = value;
  } else {
    result = parseFloat(value as string);
  }
  if (format === UnitFormat.Number) {
    return result;
  } else if (format === UnitFormat.String) {
    return formatDecimals(result, 2);
  } else {
    return 0;
  }
}

let timerId: NodeJS.Timeout;

export const debounceFunction = (func: () => void, delay: number) => {
  // Cancels the setTimeout method execution
  clearTimeout(timerId);

  // Executes the func after delay time.
  timerId = setTimeout(func, delay);
};
