import {getDate, fixed, addMissingDates, formatDecimals} from '../utils';

export const wasteDashboardParser = {
  wasteProduction: (data, filter) => {
    let wasteProduction = {
      waste: 0,
      chart: [
        {
          name: ' WASTE PRODUCTION',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: '#3398C3',
          tooltip: {
            valueSuffix: 'KG'
          }
        }
      ]
    };

    wasteProduction.chart[0].data = data.waste.map((d) => +d.toFixed(2));
    if (filter === 'year' || filter === 'month') {
      while (wasteProduction.chart[0].data.length < 12) wasteProduction.chart[0].data = [0, ...wasteProduction.chart[0].data];
    } else if (filter === 'week' || filter === 'day') {
      while (wasteProduction.chart[0].data.length < 14) wasteProduction.chart[0].data = [0, ...wasteProduction.chart[0].data];
    }

    wasteProduction.waste =
      filter === 'year'
        ? wasteProduction.chart[0].data.reduce((c, p) => c + p, 0)
        : wasteProduction.chart[0].data[wasteProduction.chart[0].data.length - 1];

    const divertedFromLandFillWaste =
      filter === 'year'
        ? data.divertedFromLandFillWaste.reduce((c, p) => c + p, 0)
        : data.divertedFromLandFillWaste[data.divertedFromLandFillWaste.length - 1];

    var divertedPercentage = wasteProduction.waste === 0 ? 0 : formatDecimals((divertedFromLandFillWaste / wasteProduction.waste) * 100, 0);
    wasteProduction.divertedPercentage = divertedPercentage;
    return wasteProduction;
  },
  wasteProductionBreakdown: (data, filter) => {
    let wasteBreakdown = {
      chart: [],
      category: []
    };
    wasteBreakdown.chart.push({
      name: 'RECYCLABLE',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      stack: '1',
      yAxis: 0,
      type: 'column',
      color: '#4C8051',
      pointPadding: 0,
      pointPlacement: 0
    });
    wasteBreakdown.chart.push({
      name: 'NON RECYCLABLE',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      stack: '1',
      yAxis: 0,
      type: 'column',
      color: '#A7A87D',
      pointPadding: 0,
      pointPlacement: 0
    });
    wasteBreakdown.chart.push({
      name: 'HAZARDOUS',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      stack: '1',
      yAxis: 0,
      type: 'column',
      color: '#7D3B53',
      pointPadding: 0,
      pointPlacement: 0
    });
    wasteBreakdown.chart.push({
      name: 'ORGANIC',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      stack: '1',
      yAxis: 0,
      type: 'column',
      color: '#685A34',
      pointPadding: 0,
      pointPlacement: 0
    });
    wasteBreakdown.chart.push({
      name: 'CONSTRUCTION',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      stack: '1',
      yAxis: 0,
      type: 'column',
      color: '#50487C',
      pointPadding: 0,
      pointPlacement: 0
    });
    wasteBreakdown.chart.push({
      name: 'SEWAGE WATER',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      stack: '1',
      yAxis: 0,
      type: 'column',
      color: '#BEEEFF',
      pointPadding: 0,
      pointPlacement: 0
    });

    wasteBreakdown.chart.push({
      name: 'TOTAL',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      type: 'line',
      yAxis: 0,
      color: '#F2994A',
      pointPadding: 0,
      pointPlacement: 0
    });

    wasteBreakdown.category = addMissingDates(filter, wasteBreakdown.category);
    wasteBreakdown.category = [...new Set(wasteBreakdown.category)];

    wasteBreakdown.chart[0].data = data.recyclable.map((x) => formatDecimals(x, 0, false));
    wasteBreakdown.chart[1].data = data.nonRecyclable.map((x) => formatDecimals(x, 0, false));
    wasteBreakdown.chart[2].data = data.hazardous.map((x) => formatDecimals(x, 0, false));
    wasteBreakdown.chart[3].data = data.organic.map((x) => formatDecimals(x, 0, false));
    wasteBreakdown.chart[4].data = data.construction.map((x) => formatDecimals(x, 0, false));
    wasteBreakdown.chart[5].data = data.sewageWater.map((x) => formatDecimals(x, 0, false));

    const newData = wasteBreakdown.chart.find((h) => h.name.toLowerCase() === 'total');
    newData.data = newData.data.map((d, key) =>
      fixed(
        wasteBreakdown.chart[0]?.data[key] +
          wasteBreakdown.chart[1]?.data[key] +
          wasteBreakdown.chart[2]?.data[key] +
          wasteBreakdown.chart[3]?.data[key] +
          wasteBreakdown.chart[4]?.data[key] +
          wasteBreakdown.chart[5]?.data[key]
      )
    );

    return wasteBreakdown;
  },
  operationsWasteProductionByCategory: ({data}) => {
    let wasteProduction = {
      chart: [
        {
          name: '',
          data: [],
          color: '#3398C3',
          tooltip: {
            valueSuffix: '%'
          }
        }
      ]
    };
    wasteProduction.chart[0].data.push({
      y: data.find((d) => d?.name?.toLowerCase() === 'organic')?.productionPercentage ?? 0,
      production: data.find((d) => d?.name?.toLowerCase() === 'organic')?.production ?? 0
    });
    wasteProduction.chart[0].data.push({
      y: data.find((d) => d?.name?.toLowerCase() === 'non recyclable')?.productionPercentage ?? 0,
      production: data.find((d) => d?.name?.toLowerCase() === 'non recyclable')?.production ?? 0
    });
    wasteProduction.chart[0].data.push({
      y: data.find((d) => d?.name?.toLowerCase() === 'recyclable')?.productionPercentage ?? 0,
      production: data.find((d) => d?.name?.toLowerCase() === 'recyclable')?.production ?? 0
    });
    wasteProduction.chart[0].data.push({
      y: data.find((d) => d?.name?.toLowerCase() === 'hazardous')?.productionPercentage ?? 0,
      production: data.find((d) => d?.name?.toLowerCase() === 'hazardous')?.production ?? 0
    });
    return wasteProduction;

    // THIS WAS FOR THE PIE CHART
    // const productions = data.data.map((cp) => ({
    //   name: cp.name,
    //   y: cp.productionPercentage,
    //   z: cp.production ?? 0
    // }));
    // return productions;
  },
  constructionWasteProductionByCategory: ({data}) => {
    let wasteProduction = {
      chart: [
        {
          name: '',
          data: [],
          color: '#3398C3',
          tooltip: {
            valueSuffix: '%'
          }
        }
      ]
    };
    wasteProduction.chart[0].data.push({
      y: data.find((d) => d?.name?.toLowerCase() === 'non recyclable')?.productionPercentage ?? 0,
      production: data.find((d) => d?.name?.toLowerCase() === 'non recyclable')?.production ?? 0
    });
    wasteProduction.chart[0].data.push({
      y: data.find((d) => d?.name?.toLowerCase() === 'recyclable')?.productionPercentage ?? 0,
      production: data.find((d) => d?.name?.toLowerCase() === 'recyclable')?.production ?? 0
    });
    wasteProduction.chart[0].data.push({
      y: data.find((d) => d?.name?.toLowerCase() === 'hazardous')?.productionPercentage ?? 0,
      production: data.find((d) => d?.name?.toLowerCase() === 'hazardous')?.production ?? 0
    });
    return wasteProduction;

    // THIS WAS FOR THE PIE CHART
    // const productions = data.data.map((cp) => ({
    //   name: cp.name,
    //   y: cp.productionPercentage,
    //   z: cp.production ?? 0
    // }));
    // return productions;
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
