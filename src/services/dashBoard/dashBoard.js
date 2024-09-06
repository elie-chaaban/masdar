import {fixed} from '../utils';
import {groupBy, uniq, map, orderBy} from 'lodash';

export const dashboardParser = {
  hourlyBuildingsCo: (data) => {
    let chart = [];
    const sortedData = orderBy(data, ['year', 'month', 'day', 'hour'], ['asc', 'asc', 'asc', 'asc']);
    const groupedDataByDate = groupBy(sortedData, (item) => `${item.day}-${item.month} ${item.hour}:00`);
    const categories = Object.keys(groupedDataByDate);
    const buildingNames = uniq(map(data, 'buildingName'));

    buildingNames.forEach((buildingName) => {
      chart.push({
        name: buildingName,
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        tooltip: {
          valueSuffix: 'µg/m3'
        }
      });
    });

    categories.forEach((category) => {
      const buildingValues = groupedDataByDate[category];
      buildingValues.forEach((buildingValue) => {
        let chartIndex = chart.findIndex((x) => x.name === buildingValue.buildingName);
        if (chartIndex !== -1) {
          let chartDataIndex = categories.indexOf(category);
          if (chartDataIndex !== -1) {
            chart[chartIndex].data[chartDataIndex] = fixed(buildingValue.averageValue * 1145);
          }
        }
      });
    });

    return {chart, categories};
  },
  hourlyBuildingsTemperature: (data) => {
    let chart = [];
    const sortedData = orderBy(data, ['year', 'month', 'day', 'hour'], ['asc', 'asc', 'asc', 'asc']);
    const groupedDataByDate = groupBy(sortedData, (item) => `${item.day}-${item.month} ${item.hour}:00`);
    const categories = Object.keys(groupedDataByDate);
    const buildingNames = uniq(map(data, 'buildingName'));

    buildingNames.forEach((buildingName) => {
      chart.push({
        name: buildingName,
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        tooltip: {
          valueSuffix: '°'
        }
      });
    });

    categories.forEach((category) => {
      const buildingValues = groupedDataByDate[category];
      buildingValues.forEach((buildingValue) => {
        let chartIndex = chart.findIndex((x) => x.name === buildingValue.buildingName);
        if (chartIndex !== -1) {
          let chartDataIndex = categories.indexOf(category);
          if (chartDataIndex !== -1) {
            chart[chartIndex].data[chartDataIndex] = fixed(buildingValue.averageValue);
          }
        }
      });
    });

    return {chart, categories};
  },
  hourlyBuildingsHumidity: (data) => {
    let chart = [];
    const sortedData = orderBy(data, ['year', 'month', 'day', 'hour'], ['asc', 'asc', 'asc', 'asc']);
    const groupedDataByDate = groupBy(sortedData, (item) => `${item.day}-${item.month} ${item.hour}:00`);
    const categories = Object.keys(groupedDataByDate);
    const buildingNames = uniq(map(data, 'buildingName'));

    buildingNames.forEach((buildingName) => {
      chart.push({
        name: buildingName,
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        tooltip: {
          valueSuffix: '%'
        }
      });
    });

    categories.forEach((category) => {
      const buildingValues = groupedDataByDate[category];
      buildingValues.forEach((buildingValue) => {
        let chartIndex = chart.findIndex((x) => x.name === buildingValue.buildingName);
        if (chartIndex !== -1) {
          let chartDataIndex = categories.indexOf(category);
          if (chartDataIndex !== -1) {
            chart[chartIndex].data[chartDataIndex] = fixed(buildingValue.averageValue);
          }
        }
      });
    });

    return {chart, categories};
  }
};
