import {getDate, fixed, addMissingDates, formatDecimals} from '../utils';
import moment from 'moment-mini';

export const securityDashboardParser = {
  realTimeOperations: (data) => {
    let realTimeOperations = {
      openIncidentsChart: {
        name: 'Open Incidents',
        data: [
          {
            y: data.openIncidents.low,
            name: 'Low',
            color: '#63B0C0'
          },
          {
            y: data.openIncidents.medium,
            name: 'Medium',
            color: '#84374A'
          },
          {
            y: data.openIncidents.high,
            name: 'High',
            color: '#39566B'
          }
        ],
        total: data.openIncidents.low + data.openIncidents.medium + data.openIncidents.high
      },
      completedIncidentsChart: {
        name: 'Completed Incidents',
        data: [
          {
            y: data.completedIncidents.low,
            name: 'Low',
            color: '#63B0C0'
          },
          {
            y: data.completedIncidents.medium,
            name: 'Medium',
            color: '#84374A'
          },
          {
            y: data.completedIncidents.high,
            name: 'High',
            color: '#39566B'
          }
        ],
        total: data.completedIncidents.low + data.completedIncidents.medium + data.completedIncidents.high
      }
    };
    return realTimeOperations;
  },
  frequencyOfOccurence: (data) => {
    if (data.chartData.length === 0) {
      data.chartData = [
        {
          category: 'Access Control',
          trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          category: 'Safety',
          trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          category: 'Criminal Incident',
          trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          category: 'Fault Alarms',
          trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          category: 'Others',
          trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      ];
    } else {
      const checkData_Access = data.chartData.filter((item, index) => {
        return item.category === 'Access Control';
      });
      if (checkData_Access.length === 0) {
        data.chartData = [
          ...data.chartData,
          {
            category: 'Access Control',
            trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        ];
      }

      const checkDataSafety = data.chartData.filter((item, index) => {
        return item.category === 'Safety';
      });
      if (checkDataSafety.length === 0) {
        data.chartData = [
          ...data.chartData,
          {
            category: 'Safety',
            trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        ];
      }

      const checkDataCriminal = data.chartData.filter((item, index) => {
        return item.category === 'Criminal Incident';
      });
      if (checkDataCriminal.length === 0) {
        data.chartData = [
          ...data.chartData,
          {
            category: 'Criminal Incident',
            trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        ];
      }

      const checkDataFault = data.chartData.filter((item, index) => {
        return item.category === 'Fault Alarms';
      });
      if (checkDataFault.length === 0) {
        data.chartData = [
          ...data.chartData,
          {
            category: 'Fault Alarms',
            trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        ];
      }

      const checkDataOthers = data.chartData.filter((item, index) => {
        return item.category === 'Others';
      });
      if (checkDataOthers.length === 0) {
        data.chartData = [
          ...data.chartData,
          {
            category: 'Others',
            trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        ];
      }
    }
    const trendLine = data.chartData.map((item) => {
      let color;
      switch (item.category) {
        default:
        case 'Access Control': {
          color = '#63B0C0';
          break;
        }
        case 'Safety': {
          color = '#746986';
          break;
        }
        case 'Criminal Incident': {
          color = '#84374A';
          break;
        }
        case 'Fault Alarms': {
          color = '#39566B';
          break;
        }
        case 'Others': {
          color = '#F6CA67';
          break;
        }
      }
      return {
        name: item.category,
        color,
        type: 'line',
        data: item.trendLine,
        marker: {
          radius: 1,
          symbol: 'circle'
        }
      };
    });
    return {trendLine, xaxis: data.xAxis};
  },
  acknowledgmentTime: (data) => {
    return {
      acknowledgementTime_chartData: [
        {
          name: 'Low',
          color: '#63B0C0',
          data: data.acknowledgmentTime.chartData.low,
          type: 'column',
          stack: '1',
          yAxis: 0
        },
        {
          name: 'Medium',
          color: '#84374A',
          data: data.acknowledgmentTime.chartData.medium,
          type: 'column',
          stack: '1',
          yAxis: 0
        },
        {
          name: 'High',
          color: '#39566B',
          data: data.acknowledgmentTime.chartData.high,
          type: 'column',
          stack: '1',
          yAxis: 0
        }
      ],
      responseTime_chartData: [
        {
          name: 'Low',
          color: '#63B0C0',
          data: data.responseTime.chartData.low,
          type: 'column',
          stack: '1',
          yAxis: 0
        },
        {
          name: 'Medium',
          color: '#84374A',
          data: data.responseTime.chartData.medium,
          type: 'column',
          stack: '1',
          yAxis: 0
        },
        {
          name: 'High',
          color: '#39566B',
          data: data.responseTime.chartData.high,
          type: 'column',
          stack: '1',
          yAxis: 0
        }
      ],
      acknowledgementTime_xaxis: data.acknowledgmentTime.xAxis,
      responseTime_xaxis: data.responseTime.xAxis
    };
  }
};
