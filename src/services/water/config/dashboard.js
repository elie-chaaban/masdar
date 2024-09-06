import {fixed} from '../../utils';
const config = [
  {
    type: 'water',
    url: 'water-consumption',
    label: 'WC',
    callback: (data, filter) => {
      let waterConsumption = {
        kwh: 0,
        water: 0,
        chart: [
          {
            name: 'CONSUMPTION',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            color: '#00BFE6',
            type: 'column',
            tooltip: {
              valueSuffix: 'CBM'
            }
          },
          {
            name: 'INTENSITY',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            color: '#9D5AA0',
            type: 'spline',
            yAxis: 1,
            tooltip: {
              valueSuffix: ' CBM/SQM'
            }
          }
        ]
      };

      waterConsumption.chart[0].data = data.kwh.data.map((d) => fixed(d));
      if (filter === 'year' || filter === 'month') {
        while (waterConsumption.chart[0].data.length < 12) waterConsumption.chart[0].data = [0, ...waterConsumption.chart[0].data];
      } else if (filter === 'week' || filter === 'day') {
        while (waterConsumption.chart[0].data.length < 14) waterConsumption.chart[0].data = [0, ...waterConsumption.chart[0].data];
      }

      waterConsumption.chart[1].data = data.water.map((d) => +parseFloat(d).toFixed(4));
      if (filter === 'year' || filter === 'month') {
        while (waterConsumption.chart[1].data.length < 12) waterConsumption.chart[1].data = [0, ...waterConsumption.chart[1].data];
      } else if (filter === 'week' || filter === 'day') {
        while (waterConsumption.chart[1].data.length < 14) waterConsumption.chart[1].data = [0, ...waterConsumption.chart[1].data];
      }

      waterConsumption.kwh =
        filter === 'year'
          ? parseFloat(waterConsumption.chart[1].data.reduce((c, p) => c + p, 0))
          : parseFloat(waterConsumption.chart[1].data[waterConsumption.chart[1].data.length - 1]);
      waterConsumption.water =
        filter === 'year'
          ? parseFloat(waterConsumption.chart[0].data.reduce((c, p) => c + p, 0)).toFixed(2)
          : parseFloat(waterConsumption.chart[0].data[waterConsumption.chart[0].data.length - 1]).toFixed(2);
      return waterConsumption;
    }
  }
];

export default config;
