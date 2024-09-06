import {getDate, fixed, addMissingDates, formatDecimals, fixedDecimals} from '../utils';
import moment from 'moment-mini';

export const energyDashboardParser = {
  energyConsumption: (data, filter) => {
    let energyConsumption = {
      kwh: 0,
      energy: 0,
      consumptionBenchmark: 0,
      intensityBenchmark: 0,
      chart: [
        {
          name: 'CONSUMPTION',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: '#00BFE6',
          type: 'column',
          tooltip: {
            valueSuffix: 'KWH'
          }
        },
        {
          name: 'INTENSITY',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: '#9D5AA0',
          type: 'spline',
          yAxis: 1,
          tooltip: {
            valueSuffix: ' KWH/SQM'
          }
        }
      ]
    };

    energyConsumption.chart[0].data = data.kwh.data;
    if (filter === 'year' || filter === 'month') {
      while (energyConsumption.chart[0].data.length < 12) energyConsumption.chart[0].data = [0, ...energyConsumption.chart[0].data];
    } else if (filter === 'week' || filter === 'day') {
      while (energyConsumption.chart[0].data.length < 14) energyConsumption.chart[0].data = [0, ...energyConsumption.chart[0].data];
    }

    energyConsumption.chart[1].data = data.energy;
    if (filter === 'year' || filter === 'month') {
      while (energyConsumption.chart[1].data.length < 12) energyConsumption.chart[1].data = [0, ...energyConsumption.chart[1].data];
    } else if (filter === 'week' || filter === 'day') {
      while (energyConsumption.chart[1].data.length < 14) energyConsumption.chart[1].data = [0, ...energyConsumption.chart[1].data];
    }

    energyConsumption.kwh =
      filter === 'year'
        ? energyConsumption.chart[1].data.reduce((c, p) => c + p, 0)
        : energyConsumption.chart[1].data[energyConsumption.chart[1].data.length - 1];
    energyConsumption.energy =
      filter === 'year'
        ? energyConsumption.chart[0].data.reduce((c, p) => c + p, 0)
        : energyConsumption.chart[0].data[energyConsumption.chart[0].data.length - 1];

    energyConsumption.consumptionBenchmark = data.consumptionBenchmark;
    energyConsumption.intensityBenchmark = data.intensityBenchmark;
    return energyConsumption;
  },
  hvacEnergyEfficiencyRatio: (data) => {
    if (data.data.result.values.length) {
      return fixed(data.data.result.values[data.data.result.values.length - 1].value);
    } else {
      return 0;
    }
  },
  electricityConsumption: (data, filter) => {
    let energyConsumption = {
      kwh: 0,
      energy: 0,
      chart: [
        {
          name: 'CONSUMPTION',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: '#00BFE6',
          type: 'column',
          tooltip: {
            valueSuffix: 'KWH'
          }
        },
        {
          name: 'INTENSITY',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: '#9D5AA0',
          type: 'spline',
          yAxis: 1,
          tooltip: {
            valueSuffix: ' KWH/SQM'
          }
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
  },
  coolingConsumption: (data, filter) => {
    let energyConsumption = {
      kwh: 0,
      energy: 0,
      chart: [
        {
          name: 'CONSUMPTION',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: '#00BFE6',
          type: 'column',
          tooltip: {
            valueSuffix: 'KWH'
          }
        },
        {
          name: 'INTENSITY',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: '#9D5AA0',
          type: 'spline',
          yAxis: 1,
          tooltip: {
            valueSuffix: ' KWH/SQM'
          }
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
  },
  hvacConsumptionBreakdown: (data, filter) => {
    let category = [...new Set(data.hvac.map((d) => getDate(d.startTime, 'year')))];
    category = addMissingDates('year', category);
    const keys = Object.keys(data);
    let hc = [
      {
        name: 'HVAC AHU',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        stack: '1',
        yAxis: 0,
        type: 'column',
        color: '#37693C'
      },
      {
        name: 'HVAC PUMPS',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        stack: '1',
        yAxis: 0,
        type: 'column',
        color: '#8E36AD'
      },
      {
        name: 'HVAC FANS',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        stack: '1',
        yAxis: 0,
        type: 'column',
        color: '#367CAD'
      },
      {
        name: 'DISTRICT WEATHER',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        type: 'line',
        yAxis: 1,
        color: '#D5D06A',
        tooltip: {
          valueSuffix: ' °F'
        }
      },
      {
        name: 'HVAC',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        type: 'line',
        yAxis: 0,
        color: '#36AD90'
      }
    ];
    keys.forEach((k) => {
      if (data[k].length > 0) {
        const newData = hc.find((h) => h.name.replace(' ', '').toLowerCase() === k.toLowerCase());
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
    return {chart: hc, category};
  },
  lightingSystemsConsumption: (data, filter) => {
    if (data.data.result.values[0] == null) data.data.result.values.shift();
    let categories = data.data.result.values.map((d) => getDate(d.startTime, filter));
    categories = addMissingDates(filter, categories);
    let chartData = data.data.result.values.map((d) => fixed(d.value));
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
      chart: [
        {
          name: 'Lighting Consumption',
          data: chartData,
          color: '#00BFE6',
          type: 'line'
        }
      ],
      category: categories
    };
  },
  liftSystemsConsumption: (data, filter) => {
    if (data.data.result.values[0] == null) data.data.result.values.shift();
    let categories = data.data.result.values.map((d) => getDate(d.startTime, filter));
    categories = addMissingDates(filter, categories);
    let chartData = data.data.result.values.map((d) => fixed(d.value));
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
      chart: [
        {
          name: 'Lift Consumption',
          data: chartData,
          color: '#00BFE6',
          type: 'line'
        }
      ],
      category: categories
    };
  },
  emergencySystemsConsumption: (data, filter) => {
    if (data.data.result.values[0] == null) data.data.result.values.shift();
    let categories = data.data.result.values.map((d) => getDate(d.startTime, filter));
    categories = addMissingDates(filter, categories);
    let chartData = data.data.result.values.map((d) => fixed(d.value));
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
      chart: [
        {
          name: 'Emergency Consumption',
          data: chartData,
          color: '#00BFE6',
          type: 'line'
        }
      ],
      category: categories
    };
  },
  otherSystemsConsumption: (data, filter) => {
    if (data.data.result.values[0] == null) data.data.result.values.shift();
    let categories = data.data.result.values.map((d) => getDate(d.startTime, filter));
    categories = addMissingDates(filter, categories);
    let chartData = data.data.result.values.map((d) => fixed(d.value));
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
      chart: [
        {
          name: 'Others Consumption',
          data: chartData,
          color: '#00BFE6',
          type: 'line'
        }
      ],
      category: categories
    };
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
  },
  energyConsumptionStackedBar: (data, filter) => {
    let energyConsumption = {
      chart: [],
      category: []
    };
    energyConsumption.chart.push({
      name: 'ELECTRICITY',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      yAxis: 0,
      type: 'column',
      color: '#5CBAE2',
      pointPadding: 0,
      pointPlacement: 0
    });

    energyConsumption.chart.push({
      name: 'ELECTRICITY INTENSITY',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      type: 'line',
      yAxis: 1,
      color: '#5CBAE2',
      showInLegend: false,
      pointPadding: 0,
      pointPlacement: 0
    });

    energyConsumption.chart.push({
      name: 'COOLING',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      yAxis: 0,
      type: 'column',
      color: '#9D7AB2',
      pointPadding: 0,
      pointPlacement: 0
    });

    energyConsumption.chart.push({
      name: 'COOLING INTENSITY',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      type: 'line',
      yAxis: 1,
      color: '#9D7AB2',
      showInLegend: false,
      pointPadding: 0,
      pointPlacement: 0
    });

    energyConsumption.chart.push({
      name: 'INTENSITY',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      type: 'line',
      yAxis: 1,
      color: '#F2994A',
      pointPadding: 0,
      pointPlacement: 0
    });

    energyConsumption.category = addMissingDates(filter, energyConsumption.category);
    energyConsumption.category = [...new Set(energyConsumption.category)];

    energyConsumption.chart.find((v) => v.name.toLowerCase() === 'electricity').data =
      data.electricity?.kwh?.data?.map((x) => fixedDecimals(x, 2)) ?? [];
    if (filter === 'year' || filter === 'month') {
      while (energyConsumption.chart.find((v) => v.name.toLowerCase() === 'electricity').data.length < 12)
        energyConsumption.chart.find((v) => v.name.toLowerCase() === 'electricity').data = [
          0,
          ...energyConsumption.chart.find((v) => v.name.toLowerCase() === 'electricity').data
        ];
    } else if (filter === 'week' || filter === 'day') {
      while (energyConsumption.chart.find((v) => v.name.toLowerCase() === 'electricity').data.length < 14)
        energyConsumption.chart.find((v) => v.name.toLowerCase() === 'electricity').data = [
          0,
          ...energyConsumption.chart.find((v) => v.name.toLowerCase() === 'electricity').data
        ];
    }

    energyConsumption.chart.find((v) => v.name.toLowerCase() === 'electricity intensity').data =
      data.electricity?.energy.map((x) => fixedDecimals(x, 2)) ?? [];
    if (filter === 'year' || filter === 'month') {
      while (energyConsumption.chart.find((v) => v.name.toLowerCase() === 'electricity intensity').data.length < 12)
        energyConsumption.chart.find((v) => v.name.toLowerCase() === 'electricity intensity').data = [
          0,
          ...energyConsumption.chart.find((v) => v.name.toLowerCase() === 'electricity intensity').data
        ];
    } else if (filter === 'week' || filter === 'day') {
      while (energyConsumption.chart.find((v) => v.name.toLowerCase() === 'electricity intensity').data.length < 14)
        energyConsumption.chart.find((v) => v.name.toLowerCase() === 'electricity intensity').data = [
          0,
          ...energyConsumption.chart.find((v) => v.name.toLowerCase() === 'electricity intensity').data
        ];
    }

    energyConsumption.chart.find((v) => v.name.toLowerCase() === 'cooling').data =
      data.cooling?.kwh?.data.map((x) => fixedDecimals(x, 2)) ?? [];
    if (filter === 'year' || filter === 'month') {
      while (energyConsumption.chart.find((v) => v.name.toLowerCase() === 'cooling').data.length < 12)
        energyConsumption.chart.find((v) => v.name.toLowerCase() === 'cooling').data = [
          0,
          ...energyConsumption.chart.find((v) => v.name.toLowerCase() === 'cooling').data
        ];
    } else if (filter === 'week' || filter === 'day') {
      while (energyConsumption.chart.find((v) => v.name.toLowerCase() === 'cooling').data.length < 14)
        energyConsumption.chart.find((v) => v.name.toLowerCase() === 'cooling').data = [
          0,
          ...energyConsumption.chart.find((v) => v.name.toLowerCase() === 'cooling').data
        ];
    }

    energyConsumption.chart.find((v) => v.name.toLowerCase() === 'cooling intensity').data =
      data.cooling?.energy?.map((x) => fixedDecimals(x, 2)) ?? [];
    if (filter === 'year' || filter === 'month') {
      while (energyConsumption.chart.find((v) => v.name.toLowerCase() === 'cooling intensity').data.length < 12)
        energyConsumption.chart.find((v) => v.name.toLowerCase() === 'cooling intensity').data = [
          0,
          ...energyConsumption.chart.find((v) => v.name.toLowerCase() === 'cooling intensity').data
        ];
    } else if (filter === 'week' || filter === 'day') {
      while (energyConsumption.chart.find((v) => v.name.toLowerCase() === 'cooling intensity').data.length < 14)
        energyConsumption.chart.find((v) => v.name.toLowerCase() === 'cooling intensity').data = [
          0,
          ...energyConsumption.chart.find((v) => v.name.toLowerCase() === 'cooling intensity').data
        ];
    }

    const intensityData = energyConsumption.chart.find((v) => v.name.toLowerCase() === 'intensity');
    let elecIntn = data.electricity?.energy?.map((x) => fixedDecimals(x, 2)) ?? [];
    let coolngIntn = data.cooling?.energy?.map((x) => fixedDecimals(x, 2)) ?? [];
    const lenDiff = elecIntn.length - coolngIntn.length;

    if (lenDiff > 0) {
      // If elecIntn is longer, prepend zeros to coolngIntn
      coolngIntn = Array(lenDiff).fill(0).concat(coolngIntn);
    } else if (lenDiff < 0) {
      // If coolngIntn is longer, prepend zeros to elecIntn
      elecIntn = Array(-lenDiff).fill(0).concat(elecIntn);
    }

    var sumInten = elecIntn.map((a, i) => {
      const coolingIntensity = coolngIntn[i] || 0;
      return fixedDecimals(a + coolingIntensity, 2);
    });
    if (intensityData) intensityData.data = sumInten;
    if (filter === 'year' || filter === 'month') {
      if (intensityData) {
        while (intensityData.data.length < 12) intensityData.data = [0, ...intensityData.data];
      }
    } else if (filter === 'week' || filter === 'day') {
      if (intensityData) {
        while (intensityData.data.length < 14) intensityData.data = [0, ...intensityData.data];
      }
    }

    return energyConsumption;

    // return {chart: hc, category};
  },
  carbonEmissionStackedBar: (data, filter, hasCarbonAccess, hasEnergyAccess, hasWaterAccess, hasWasteAccess) => {
    let carbonEmission = {
      chart: [],
      category: []
    };
    if (hasEnergyAccess) {
      carbonEmission.chart.push({
        name: 'ENERGY',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        stack: '1',
        yAxis: 0,
        type: 'column',
        color: '#5CBAE2',
        pointPadding: 0,
        pointPlacement: 0
      });
    }
    if (hasWaterAccess) {
      carbonEmission.chart.push({
        name: 'WATER',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        stack: '1',
        yAxis: 0,
        type: 'column',
        color: '#377A88',
        pointPadding: 0,
        pointPlacement: 0
      });
    }
    if (hasWasteAccess) {
      carbonEmission.chart.push({
        name: 'WASTE',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        stack: '1',
        yAxis: 0,
        type: 'column',
        color: '#4EABA9',
        pointPadding: 0,
        pointPlacement: 0
      });
    }
    if (hasWasteAccess || hasEnergyAccess || hasWaterAccess) {
      carbonEmission.chart.push({
        name: 'TOTAL',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        type: 'line',
        yAxis: 0,
        color: '#F2994A',
        pointPadding: 0,
        pointPlacement: 0
      });
    }

    carbonEmission.category = addMissingDates(filter, carbonEmission.category);
    carbonEmission.category = [...new Set(carbonEmission.category)];

    carbonEmission.chart[0].data = data.energy.data?.result?.values.map((x) => formatDecimals(x.value, 0, false));
    carbonEmission.chart[1].data = data.water.data?.result?.values.map((x) => formatDecimals(x.value, 0, false));
    carbonEmission.chart[2].data = data.waste.data?.result?.values.map((x) => formatDecimals(x.value, 0, false));

    if (filter === 'year' || filter === 'month') {
      while (carbonEmission.chart[0].data.length < 12) carbonEmission.chart[0].data = [0, ...carbonEmission.chart[0].data];
      while (carbonEmission.chart[1].data.length < 12) carbonEmission.chart[1].data = [0, ...carbonEmission.chart[1].data];
      while (carbonEmission.chart[2].data.length < 12) carbonEmission.chart[2].data = [0, ...carbonEmission.chart[2].data];
    } else if (filter === 'week' || filter === 'day') {
      while (carbonEmission.chart[0].data.length < 14) carbonEmission.chart[0].data = [0, ...carbonEmission.chart[0].data];
      while (carbonEmission.chart[1].data.length < 14) carbonEmission.chart[1].data = [0, ...carbonEmission.chart[1].data];
      while (carbonEmission.chart[2].data.length < 14) carbonEmission.chart[2].data = [0, ...carbonEmission.chart[2].data];
    }

    const newData = carbonEmission.chart.find((h) => h.name.toLowerCase() === 'total');
    newData.data = newData.data.map((d, key) =>
      fixed(carbonEmission.chart[0]?.data[key] + carbonEmission.chart[1]?.data[key] + carbonEmission.chart[2]?.data[key])
    );

    return carbonEmission;

    // return {chart: hc, category};
  },
  districtPVProductions: (data) => {
    const districtPVProductionsData = {
      chart: [
        {
          name: 'YEARLY PV PRODUCTION',
          data: [],
          color: '#84374A',
          categories: [],
          production: 0
        },
        {
          name: 'MONTHLY PV PRODUCTION',
          data: [],
          color: '#84374A',
          categories: [],
          production: 0
        },
        {
          name: 'WEEKLY PV PRODUCTION',
          data: [],
          color: '#84374A',
          categories: [],
          production: 0
        },
        {
          name: 'DAILY PV PRODUCTION',
          data: [],
          color: '#84374A',
          categories: [],
          production: 0
        }
      ]
    };
    const districtPVProductions = data?.districtPVProductions;
    if (districtPVProductions?.length) {
      let yearProduction = 0;
      districtPVProductions.forEach((districtPVProduction) => {
        yearProduction += districtPVProduction?.production || 0;

        //Year
        districtPVProductionsData.chart[0].data.push(districtPVProduction?.production || 0);

        //Month
        districtPVProductionsData.chart[1].data.push(districtPVProduction?.production || 0);
      });

      const month = moment()
        .set('year', districtPVProductions[districtPVProductions.length - 1]?.year)
        .month(districtPVProductions[districtPVProductions.length - 1]?.month - 1);
      const daysInMonth = month.daysInMonth();
      const dayProduction = districtPVProductions[districtPVProductions.length - 1]?.production / daysInMonth;
      const lastWeekProduction = districtPVProductions[districtPVProductions.length - 1]?.production / (daysInMonth / 7);

      let categories = [];
      categories = districtPVProductions.map((d) => {
        const date = moment()
          .set('year', d?.year)
          .set('month', d?.month - 1);
        return date.format('MMM-YYYY');
      });
      // categories = addMissingDates('year', categories);

      //Year
      districtPVProductionsData.chart[0].categories = categories;
      districtPVProductionsData.chart[0].production = formatDecimals(yearProduction, 0);

      //Month
      districtPVProductionsData.chart[1].categories = categories;
      districtPVProductionsData.chart[1].production = formatDecimals(districtPVProductions[districtPVProductions.length - 1].production, 0);

      //Week
      for (let i = 0; i < 14; i++) {
        const date = moment()
          .set('year', districtPVProductions[districtPVProductions.length - 1]?.year)
          .set('month', districtPVProductions[districtPVProductions.length - 1]?.month - 1)
          .subtract(14 - i, 'weeks');
        districtPVProductionsData.chart[2].categories.push(`week ${date.week()} ${date.format('MMM-YYYY')}`);
        // districtPVProductionsData.chart[2].categories = addMissingDates('week', districtPVProductionsData.chart[2].categories);

        const daysInMonth = month.daysInMonth();
        const weekProduction = districtPVProductions[date.month()]?.production / (daysInMonth / 7);
        districtPVProductionsData.chart[2].data.push(parseFloat(formatDecimals(weekProduction, 2)));
      }
      districtPVProductionsData.chart[2].production = formatDecimals(lastWeekProduction, 0);

      //Day
      for (let i = 0; i < 14; i++) {
        const date = moment()
          .set('year', districtPVProductions[districtPVProductions.length - 1]?.year)
          .set('month', districtPVProductions[districtPVProductions.length - 1]?.month - 1)
          .subtract(14 - i, 'day');
        districtPVProductionsData.chart[3].categories.push(date.format('DD-MM-YYYY'));
        // districtPVProductionsData.chart[3].categories = addMissingDates('day', districtPVProductionsData.chart[3].categories);
        districtPVProductionsData.chart[3].data.push(parseFloat(formatDecimals(dayProduction, 2)));
      }
      districtPVProductionsData.chart[3].production = formatDecimals(dayProduction, 0);
    } else {
      districtPVProductionsData.chart[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      districtPVProductionsData.chart[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      districtPVProductionsData.chart[2].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      districtPVProductionsData.chart[3].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    return districtPVProductionsData;
  },
  energyConsumptionPercentage: (data) => {
    return {
      coolingPercentage: data.coolingPercentage,
      electricityPercentage: data.electricityPercentage
    };
  }
};
