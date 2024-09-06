import {getDate, fixed, addMissingDates} from '../utils';

export const waterDashboardParser = {
  waterConsumption: (data, filter) => {
    let waterConsumption = {
      kwh: 0,
      water: 0,
      consumptionBenchmark: 0,
      intensityBenchmark: 0,
      chart: [
        {
          name: 'CONSUMPTION',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: '#00BFE6',
          type: 'column',
          tooltip: {
            valueSuffix: 'CBM'
          },
          pointPadding: 0,
          pointPlacement: 0
        },
        {
          name: 'INTENSITY',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: '#9D5AA0',
          type: 'spline',
          yAxis: 1,
          tooltip: {
            valueSuffix: ' CBM/SQM'
          },
          pointPadding: 0,
          pointPlacement: 0
        }
      ]
    };

    waterConsumption.chart[0].data = data.kwh.data;
    if (filter === 'year' || filter === 'month') {
      while (waterConsumption.chart[0].data.length < 12) waterConsumption.chart[0].data = [0, ...waterConsumption.chart[0].data];
    } else if (filter === 'week' || filter === 'day') {
      while (waterConsumption.chart[0].data.length < 14) waterConsumption.chart[0].data = [0, ...waterConsumption.chart[0].data];
    }

    waterConsumption.chart[1].data = data.water;
    if (filter === 'year' || filter === 'month') {
      while (waterConsumption.chart[1].data.length < 12) waterConsumption.chart[1].data = [0, ...waterConsumption.chart[1].data];
    } else if (filter === 'week' || filter === 'day') {
      while (waterConsumption.chart[1].data.length < 14) waterConsumption.chart[1].data = [0, ...waterConsumption.chart[1].data];
    }

    waterConsumption.kwh =
      filter === 'year'
        ? waterConsumption.chart[1].data.reduce((c, p) => c + p, 0)
        : waterConsumption.chart[1].data[waterConsumption.chart[1].data.length - 1];
    waterConsumption.water =
      filter === 'year'
        ? waterConsumption.chart[0].data.reduce((c, p) => c + p, 0)
        : waterConsumption.chart[0].data[waterConsumption.chart[0].data.length - 1];

    waterConsumption.consumptionBenchmark = data.consumptionBenchmark;
    waterConsumption.intensityBenchmark = data.intensityBenchmark;
    return waterConsumption;
  },
  carbonEmissionAndTrendLine: (data, filter) => {
    if (data.data.result.values[0] == null) data.data.result.values.shift();
    let categories = data.data.result.values.map((d) => getDate(d.startTime, filter));
    categories = addMissingDates(filter, categories);
    let chartData = data.data.result.values.map((d) => fixed(d.value));
    while (chartData.length < categories.length) {
      chartData = [0, ...chartData];
    }
    let value =
      filter === 'year'
        ? fixed(data.data.result.values.reduce((c, p) => c + p.value, 0))
        : fixed(data.data.result.values?.length ? data.data.result.values[data.data.result.values.length - 1].value : 0);

    return {
      value,
      chart: [
        {
          name: 'Carbon Emission',
          data: chartData,
          color: '#00BFE6',
          type: 'line'
        }
      ],
      category: categories
    };
  }
};
