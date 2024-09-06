import moment from 'moment-mini';
import {fixed, getDate} from '../../utils';

const config = [
  {
    url: 'costComparaison',
    startDate: `${parseInt(new Date().getFullYear()) - 2}-01`,
    label: 'CC',
    endDate: `${new Date().getFullYear()}-12`,
    callback: (data) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let years = [];
      data.forEach((d) => {
        let year = moment(d.startTime).format('YYYY');
        if (years.indexOf(year) < 0) years.push(year);
      });
      const costMonth = [
        {
          name: years[years.length - 3],
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: '#60acab'
        },
        {
          name: years[years.length - 2],
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: '#835186'
        },
        {
          name: years[years.length - 1],
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: '#acf2ae'
        }
      ];
      data.forEach((d) => {
        const cMonth = moment(d.startTime).add(3, 'days').format('MMM');
        const cYear = moment(d.startTime).add(3, 'days').format('YYYY');
        costMonth.find((c) => c.name === cYear).data[months.indexOf(cMonth)] = fixed(d.value);
      });
      return costMonth;
    }
  },
  {
    url: 'consumptionPattern',
    label: 'CP',
    startDate: moment().subtract(1, 'days').subtract(1, 'month').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    callback: (data) => {
      let result = [];
      const dates = Object.keys(data.consumptionData);
      result = dates.map((d) => ({date: d, data: data.consumptionData[d]}));
      return result.slice(-28);
    }
  },
  {
    url: 'faultsAndAlarmsInArea',
    label: 'FA',
    callback: (data, filter) => {
      let response = {
        count: undefined,
        trendLine: undefined,
        index: 0
      };
      const count = {
        name: 'Fault alarm',
        data: [
          {
            name: 'Low',
            y: data.low[data.low.length - 1],
            color: '#00bfe6'
          },
          {
            name: 'Medium',
            y: data.medium[data.medium.length - 1],
            color: '#435f8f'
          },
          {
            name: 'High',
            y: data.high[data.high.length - 1],
            color: '#835186'
          }
        ]
      };
      let TrendLineData = [
        {
          name: 'Low',
          data: data.low,
          color: '#00bfe6'
        },
        {
          name: 'Medium',
          data: data.medium,
          color: '#435f8f'
        },
        {
          name: 'High',
          data: data.high,
          color: '#835186'
        },
        {
          name: 'Total',
          data: data.total,
          color: '#f7a35d'
        }
      ];
      response.category = data.dates.map((d) => getDate(d, 'year'));
      response.count = count;
      response.trendLine = TrendLineData;
      response.index =
        filter === 'year'
          ? +(response.trendLine.find((i) => i.name === 'Total').data.reduce((c, p) => c + p, 0) / 12).toFixed(1)
          : response.trendLine.find((i) => i.name === 'Total').data[response.trendLine.find((i) => i.name === 'Total').data.length - 1];
      return response;
    }
  },
  {
    url: 'faultCountAndTrendline',
    label: 'FC',
    callback: (data) => {
      const colors = ['#00bfe6', '#435f8f', '#835186', '#e4e074', '#d9acd8'];
      return data['top 5'].map((d, index) => ({
        name: d.name,
        color: colors[index],
        y: d.value.value
      }));
    }
  }
];

export default config;
