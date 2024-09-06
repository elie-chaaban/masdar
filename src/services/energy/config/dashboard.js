import {getDate, fixed, addMissingDates, formatDecimals} from '../../utils';
import moment from 'moment-mini';
const config = [
  {
    url: 'energy-consumption',
    label: 'EC',
    callback: (data, filter) => {
      let energyConsumption = {
        kwh: 0,
        energy: 0,
        chart: [
          {
            name: 'Energy Consumption',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            color: '#00BFE6',
            type: 'line'
          },
          {
            name: ' KWH/SQM',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            color: '#9D5AA0',
            type: 'line'
          }
        ]
      };

      energyConsumption.chart[0].data = data.kwh.data.map((d) => fixed(d));
      if (filter === 'year' || filter === 'month') {
        while (energyConsumption.chart[0].data.length < 12) energyConsumption.chart[0].data = [0, ...energyConsumption.chart[0].data];
      } else if (filter === 'week' || filter === 'day') {
        while (energyConsumption.chart[0].data.length < 14) energyConsumption.chart[0].data = [0, ...energyConsumption.chart[0].data];
      }

      energyConsumption.chart[1].data = data.energy.map((d) => +parseFloat(d).toFixed(2));
      if (filter === 'year' || filter === 'month') {
        while (energyConsumption.chart[1].data.length < 12) energyConsumption.chart[1].data = [0, ...energyConsumption.chart[1].data];
      } else if (filter === 'week' || filter === 'day') {
        while (energyConsumption.chart[1].data.length < 14) energyConsumption.chart[1].data = [0, ...energyConsumption.chart[1].data];
      }

      energyConsumption.kwh =
        filter === 'year'
          ? parseInt(energyConsumption.chart[1].data.reduce((c, p) => c + p, 0))
          : parseInt(energyConsumption.chart[1].data[energyConsumption.chart[1].data.length - 1]);
      energyConsumption.energy =
        filter === 'year'
          ? parseFloat(energyConsumption.chart[0].data.reduce((c, p) => c + p, 0)).toFixed(2)
          : parseFloat(energyConsumption.chart[0].data[energyConsumption.chart[0].data.length - 1]).toFixed(2);
      return energyConsumption;
    }
  },
  {
    url: 'hvac-energy-efficiency-ratio',
    label: 'HR',
    callback: (data) => {
      if (data.data.result.values.length) {
        return fixed(data.data.result.values[data.data.result.values.length - 1].value);
      } else {
        return 0;
      }
    }
  },
  {
    url: 'electricity-consumption',
    label: 'ElectricitySC',
    callback: (data, filter) => {
      let energyConsumption = {
        kwh: 0,
        energy: 0,
        chart: [
          {
            name: 'Electricity Consumption',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            color: '#00BFE6',
            type: 'line'
          },
          {
            name: ' KWH/SQM',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            color: '#9D5AA0',
            type: 'line'
          }
        ]
      };

      energyConsumption.chart[0].data = data.kwh.data.map((d) => fixed(d));
      if (filter === 'year' || filter === 'month') {
        while (energyConsumption.chart[0].data.length < 12) energyConsumption.chart[0].data = [0, ...energyConsumption.chart[0].data];
      } else if (filter === 'week' || filter === 'day') {
        while (energyConsumption.chart[0].data.length < 14) energyConsumption.chart[0].data = [0, ...energyConsumption.chart[0].data];
      }

      energyConsumption.chart[1].data = data.energy.map((d) => +parseFloat(d).toFixed(2));
      if (filter === 'year' || filter === 'month') {
        while (energyConsumption.chart[1].data.length < 12) energyConsumption.chart[1].data = [0, ...energyConsumption.chart[1].data];
      } else if (filter === 'week' || filter === 'day') {
        while (energyConsumption.chart[1].data.length < 14) energyConsumption.chart[1].data = [0, ...energyConsumption.chart[1].data];
      }

      energyConsumption.kwh =
        filter === 'year'
          ? parseInt(energyConsumption.chart[1].data.reduce((c, p) => c + p, 0))
          : parseInt(energyConsumption.chart[1].data[energyConsumption.chart[1].data.length - 1]);
      energyConsumption.energy =
        filter === 'year'
          ? parseFloat(energyConsumption.chart[0].data.reduce((c, p) => c + p, 0)).toFixed(2)
          : parseFloat(energyConsumption.chart[0].data[energyConsumption.chart[0].data.length - 1]).toFixed(2);
      return energyConsumption;
    }
  },
  {
    url: 'cooling-consumption',
    label: 'CoolingSC',
    callback: (data, filter) => {
      let energyConsumption = {
        kwh: 0,
        energy: 0,
        chart: [
          {
            name: 'Cooling Consumption',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            color: '#00BFE6',
            type: 'line'
          },
          {
            name: ' KWH/SQM',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            color: '#9D5AA0',
            type: 'line'
          }
        ]
      };

      energyConsumption.chart[0].data = data.kwh.data.map((d) => fixed(d));
      if (filter === 'year' || filter === 'month') {
        while (energyConsumption.chart[0].data.length < 12) energyConsumption.chart[0].data = [0, ...energyConsumption.chart[0].data];
      } else if (filter === 'week' || filter === 'day') {
        while (energyConsumption.chart[0].data.length < 14) energyConsumption.chart[0].data = [0, ...energyConsumption.chart[0].data];
      }

      energyConsumption.chart[1].data = data.energy.map((d) => +parseFloat(d).toFixed(2));
      if (filter === 'year' || filter === 'month') {
        while (energyConsumption.chart[1].data.length < 12) energyConsumption.chart[1].data = [0, ...energyConsumption.chart[1].data];
      } else if (filter === 'week' || filter === 'day') {
        while (energyConsumption.chart[1].data.length < 14) energyConsumption.chart[1].data = [0, ...energyConsumption.chart[1].data];
      }

      energyConsumption.kwh =
        filter === 'year'
          ? parseInt(energyConsumption.chart[1].data.reduce((c, p) => c + p, 0))
          : parseInt(energyConsumption.chart[1].data[energyConsumption.chart[1].data.length - 1]);
      energyConsumption.energy =
        filter === 'year'
          ? parseFloat(energyConsumption.chart[0].data.reduce((c, p) => c + p, 0)).toFixed(2)
          : parseFloat(energyConsumption.chart[0].data[energyConsumption.chart[0].data.length - 1]).toFixed(2);
      return energyConsumption;
    }
  },
  {
    url: 'hvac-consumption-breakdown',
    label: 'HC',
    callback: (data, filter) => {
      let category = [...new Set(data.hvac.map((d) => getDate(d.startTime, 'year')))];
      category = addMissingDates('year', category);
      const keys = Object.keys(data);
      let hc = [
        {
          name: 'hvac ahu',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          stack: '1',
          yAxis: 0,
          type: 'column',
          color: '#60acab'
        },
        {
          name: 'hvac chillers',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          stack: '1',
          yAxis: 0,
          type: 'column',
          color: '#acf29e'
        },
        {
          name: 'hvac pumps',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          stack: '1',
          yAxis: 0,
          type: 'column',
          color: '#f78484'
        },
        {
          name: 'hvac',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          type: 'line',
          yAxis: 0,
          color: '#acf29e'
        },
        {
          name: 'district weather',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          type: 'line',
          yAxis: 1,
          color: '#9d5aa0',
          tooltip: {
            valueSuffix: ' °F'
          }
        }
      ];
      keys.forEach((k) => {
        if (data[k].length > 0 && k !== 'hvac') {
          const newData = hc.find((h) => h.name.replace(' ', '') === k.toLowerCase());
          data[k].forEach((d) => {
            if (k !== 'districtWeather') {
              let index = category.indexOf(getDate(d.startTime, 'year'));
              newData.data[index] = fixed(d.value);
            } else {
              let date = moment()
                .subtract(1, 'days')
                .set('month', d.month - 1);
              date.set('year', d.year);
              date = date.format('YYYY-MMM');
              let index = category.indexOf(date);
              newData.data[index] = d.temp;
            }
          });
        }
      });
      hc[3].data = hc[3].data.map((d, key) => fixed(hc[0].data[key] + hc[1].data[key] + hc[2].data[key]));
      const hvacConsumption =
        filter === 'year'
          ? parseFloat(hc[3].data.reduce((c, p) => c + p, 0)).toFixed(2)
          : parseFloat(hc[3].data[hc[3].data.length - 1]).toFixed(2);
      return {chart: hc, category, hvacConsumption};
    }
  },
  {
    url: 'lighting-systems-consumption',
    label: 'LightingSC',
    callback: (data, filter) => {
      if (data.data.result.values[0] == null) data.data.result.values.shift();
      let categories = data.data.result.values.map((d) => getDate(d.startTime, filter));
      categories = addMissingDates(filter, categories);
      let chartData = data.data.result.values.map((d) => fixed(d.value / 1000));
      while (chartData.length < categories.length) {
        chartData = [0, ...chartData];
      }
      let value =
        filter === 'year'
          ? fixed(data.data.result.values.reduce((c, p) => c + p.value / 1000, 0))
          : fixed(data.data.result.values[data.data.result.values.length - 1].value / 1000);
      value = formatDecimals(value, 2);

      return {
        value,
        chart: {
          name: 'Lighting Consumption',
          data: chartData,
          color: '#00BFE6',
          type: 'line'
        },
        category: categories
      };
    }
  },
  {
    url: 'lift-systems-consumption',
    label: 'LiftSC',
    callback: (data, filter) => {
      if (data.data.result.values[0] == null) data.data.result.values.shift();
      let categories = data.data.result.values.map((d) => getDate(d.startTime, filter));
      categories = addMissingDates(filter, categories);
      let chartData = data.data.result.values.map((d) => fixed(d.value / 1000));
      while (chartData.length < categories.length) {
        chartData = [0, ...chartData];
      }
      let value =
        filter === 'year'
          ? fixed(data.data.result.values.reduce((c, p) => c + p.value / 1000, 0))
          : fixed(data.data.result.values[data.data.result.values.length - 1].value / 1000);
      value = formatDecimals(value, 2);

      return {
        value,
        chart: {
          name: 'Lift Consumption',
          data: chartData,
          color: '#00BFE6',
          type: 'line'
        },
        category: categories
      };
    }
  },
  {
    url: 'emergency-systems-consumption',
    label: 'EmergencySC',
    callback: (data, filter) => {
      if (data.data.result.values[0] == null) data.data.result.values.shift();
      let categories = data.data.result.values.map((d) => getDate(d.startTime, filter));
      categories = addMissingDates(filter, categories);
      let chartData = data.data.result.values.map((d) => fixed(d.value / 1000));
      while (chartData.length < categories.length) {
        chartData = [0, ...chartData];
      }
      let value =
        filter === 'year'
          ? fixed(data.data.result.values.reduce((c, p) => c + p.value / 1000, 0))
          : fixed(data.data.result.values[data.data.result.values.length - 1].value / 1000);
      value = formatDecimals(value, 2);

      return {
        value,
        chart: {
          name: 'Emergency Consumption',
          data: chartData,
          color: '#00BFE6',
          type: 'line'
        },
        category: categories
      };
    }
  },
  {
    url: 'other-systems-consumption',
    label: 'OtherSC',
    callback: (data, filter) => {
      if (data.data.result.values[0] == null) data.data.result.values.shift();
      let categories = data.data.result.values.map((d) => getDate(d.startTime, filter));
      categories = addMissingDates(filter, categories);
      let chartData = data.data.result.values.map((d) => fixed(d.value / 1000));
      while (chartData.length < categories.length) {
        chartData = [0, ...chartData];
      }
      let value =
        filter === 'year'
          ? fixed(data.data.result.values.reduce((c, p) => c + p.value / 1000, 0))
          : fixed(data.data.result.values[data.data.result.values.length - 1].value / 1000);
      value = formatDecimals(value, 2);

      return {
        value,
        chart: {
          name: 'Others Consumption',
          data: chartData,
          color: '#00BFE6',
          type: 'line'
        },
        category: categories
      };
    }
  },
  {
    url: 'carbon-emission-and-trendline',
    label: 'CE',
    callback: (data, filter) => {
      if (data.data.result.values[0] == null) data.data.result.values.shift();
      let categories = data.data.result.values.map((d) => getDate(d.startTime, filter));
      categories = addMissingDates(filter, categories);
      let chartData = data.data.result.values.map((d) => fixed(d.value / 1000));
      while (chartData.length < categories.length) {
        chartData = [0, ...chartData];
      }
      let value =
        filter === 'year'
          ? fixed(data.data.result.values.reduce((c, p) => c + p.value / 1000, 0))
          : fixed(data.data.result.values[data.data.result.values.length - 1].value / 1000);
      value = formatDecimals(value, 2);

      return {
        value,
        chart: {
          name: 'Carbon Emission',
          data: chartData,
          color: '#00BFE6',
          type: 'line'
        },
        category: categories
      };
    }
  }
  // {
  //   url: 'system-wise-energy-breakdown',
  //   label: 'SB',
  //   callback: (data, filter) => {
  //     let systemWise = {
  //       chart: [
  //         {
  //           name: 'other',
  //           data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //           color: '#60acab'
  //         },
  //         {
  //           name: 'Lighting',
  //           data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //           color: '#f7a35d'
  //         },
  //         {
  //           name: 'HVAC',
  //           data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //           color: '#835186'
  //         },
  //         {
  //           name: 'district cooling',
  //           data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //           color: '#435f8f'
  //         }
  //       ],
  //       category: []
  //     };
  //     const keys = Object.keys(data);
  //     keys.forEach((k) => {
  //       const dates = data[k].data.result.values.map((d) => getDate(d.startTime, filter));
  //       systemWise.category = [...systemWise.category, ...dates];
  //     });
  //     systemWise.category = [...new Set(systemWise.category)];
  //     systemWise.category = addMissingDates(filter, systemWise.category);
  //     keys.forEach((k) => {
  //       let newData = systemWise.chart.find((v) => v.name.toLowerCase() === k.toLowerCase()).data;
  //       data[k].data.result.values.forEach((d) => {
  //         const index = systemWise.category.indexOf(getDate(d.startTime, filter));
  //         newData[index] = Math.round(d.value);
  //       });
  //       systemWise.chart.find((v) => v.name.toLowerCase() === k.toLowerCase()).data = newData;
  //     });
  //     return systemWise;
  //   }
  // }
  // {
  //   url: 'energy-utilization-intensity',
  //   label: 'EU',
  //   callback: (data) => {
  //     const res = [
  //       {
  //         color: '#00BFE6',
  //         data: [data.industryStandard],
  //         name: 'industry standard',
  //         pointPlacement: 0
  //       },
  //       {
  //         color: '#9D5AA0',
  //         data: [0],
  //         name: 'energy utilization intensity',
  //         pointPadding: 0.2,
  //         pointPlacement: 0
  //       }
  //     ];
  //     if (data.energyUtilizationIntensity.data.result.value) {
  //       let utilizationVal =
  //         !data.energyUtilizationIntensity.data.result.value.value && data.energyUtilizationIntensity.data.result.value.value === null
  //           ? 0
  //           : data.energyUtilizationIntensity.data.result.value.value;
  //       res[1].data[0] = fixed(utilizationVal);
  //     } else {
  //       // NB: we did not add Buildings into the Result object....
  //       res[1].data[0] = 0;
  //       //res[1].data[0] = fixed(data.energyUtilizationIntensity.data.result.buildings[0].value.value);
  //     }
  //     return res;
  //   }
  // },
  // {
  //   url: 'top-buildings',
  //   label: 'TB',
  //   callback: (data) => data
  // },
  // {
  //   url: 'bottom-buildings',
  //   label: 'BB',
  //   callback: (data) => data
  // }
];

export default config;
