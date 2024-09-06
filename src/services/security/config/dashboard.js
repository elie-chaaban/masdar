const config = [
  {
    url: 'real-time-operations',
    label: 'TO',
    callback: (data) => ({
      openIncidentsChart: {
        name: 'Open Incidents',
        data: [
          {
            y: data.openIncidents.low,
            name: 'Low',
            color: '#67CBF0'
          },
          {
            y: data.openIncidents.medium,
            name: 'Medium',
            color: '#476CAD'
          },
          {
            y: data.openIncidents.high,
            name: 'High',
            color: '#9D5AA0'
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
            title: 'test',
            color: '#67CBF0'
          },
          {
            y: data.completedIncidents.medium,
            name: 'Medium',
            color: '#476CAD'
          },
          {
            y: data.completedIncidents.high,
            name: 'High',
            color: '#9D5AA0'
          }
        ],
        total: data.completedIncidents.low + data.completedIncidents.medium + data.completedIncidents.high
      }
    })
  },
  {
    url: 'security-incidents-severity-trend-line',
    label: 'SIT',
    callback: (data, filter) => {
      if (data.chartData.length === 0) {
        data.chartData = [
          {
            severity: 'Low',
            trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            severity: 'Medium',
            trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            severity: 'High',
            trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        ];
      } else {
        const checkLData = data.chartData.filter((item, index) => {
          return item.severity === 'Low';
        });
        if (checkLData.length === 0) {
          data.chartData = [
            ...data.chartData,
            {
              severity: 'Low',
              trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
          ];
        }
        const checkMData = data.chartData.filter((item, index) => {
          return item.severity === 'Medium';
        });
        if (checkMData.length === 0) {
          data.chartData = [
            ...data.chartData,
            {
              severity: 'Medium',
              trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
          ];
        }

        const checkHData = data.chartData.filter((item, index) => {
          return item.severity === 'High';
        });
        if (checkHData.length === 0) {
          data.chartData = [
            ...data.chartData,
            {
              severity: 'High',
              trendLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
          ];
        }
      }
      var pieChart = [
        {
          name: 'Security Incidents Severity',
          total: data.low + data.medium + data.high,
          data: [
            {
              y:
                filter === 'year'
                  ? data.chartData.find((item) => item.severity === 'Low').trendLine.reduce((val, cur) => (val += cur), 0)
                  : data.chartData.find((item) => item.severity === 'Low').trendLine[11],
              name: 'Low',
              color: '#67CBF0'
            },
            {
              y:
                filter === 'year'
                  ? data.chartData.find((item) => item.severity === 'Medium').trendLine.reduce((val, cur) => (val += cur), 0)
                  : data.chartData.find((item) => item.severity === 'Medium').trendLine[11],
              name: 'Medium',
              color: '#476CAD'
            },
            {
              y:
                filter === 'year'
                  ? data.chartData.find((item) => item.severity === 'High').trendLine.reduce((val, cur) => (val += cur), 0)
                  : data.chartData.find((item) => item.severity === 'High').trendLine[11],
              name: 'High',
              color: '#9D5AA0'
            },
            {
              y:
                filter === 'year'
                  ? data.chartData.find((item) => item.severity === 'Low').trendLine.reduce((val, cur) => (val += cur), 0) +
                    data.chartData.find((item) => item.severity === 'Medium').trendLine.reduce((val, cur) => (val += cur), 0) +
                    data.chartData.find((item) => item.severity === 'High').trendLine.reduce((val, cur) => (val += cur), 0)
                  : data.chartData.find((item) => item.severity === 'Low').trendLine[11] +
                    data.chartData.find((item) => item.severity === 'Medium').trendLine[11] +
                    data.chartData.find((item) => item.severity === 'High').trendLine[11],
              name: 'Total',
              color: '#F7A35C'
            }
          ]
        }
      ];
      const trendLine = data.chartData.map((item) => {
        let color;
        switch (item.severity) {
          default:
          case 'Low': {
            color = '#67CBF0';
            break;
          }
          case 'Medium': {
            color = '#476CAD';
            break;
          }
          case 'High': {
            color = '#9D5AA0';
            break;
          }
        }
        return {
          name: item.severity,
          color,
          type: 'line',
          data: item.trendLine,
          marker: {
            radius: 1,
            symbol: 'circle'
          }
        };
      });
      return {
        trendLine,
        pieChart,
        xaxis: data.xAxis
      };
    }
  },
  // {
  //   url: 'responseEfficiency',
  //   label: 'RE',
  //   callback: (data) => data
  // },
  {
    url: 'acknowledgment-time',
    label: 'AT',
    callback: (data) => ({
      acknowledgementTime_chartData: [
        {
          name: 'Low',
          color: '#67CBF0',
          data: data.acknowledgmentTime.chartData.low
        },
        {
          name: 'Medium',
          color: '#476CAD',
          data: data.acknowledgmentTime.chartData.medium
        },
        {
          name: 'High',
          color: '#9D5AA0',
          data: data.acknowledgmentTime.chartData.high
        }
      ],
      responseTime_chartData: [
        {
          name: 'Low',
          color: '#67CBF0',
          data: data.responseTime.chartData.low
        },
        {
          name: 'Medium',
          color: '#476CAD',
          data: data.responseTime.chartData.medium
        },
        {
          name: 'High',
          color: '#9D5AA0',
          data: data.responseTime.chartData.high
        }
      ],
      acknowledgementTime_xaxis: data.acknowledgmentTime.xAxis,
      responseTime_xaxis: data.responseTime.xAxis
    })
  },
  {
    url: 'frequency-of-occurrence-by-type-trend-line',
    label: 'FT',
    callback: (data, filter) => {
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
      const spiderChart = {
        name: 'Total',
        data: [
          {
            name: 'Access Control',
            color: '#FECE3D',
            y:
              filter === 'year'
                ? data.chartData.find((item) => item.category === 'Access Control').trendLine.reduce((val, cur) => (val += cur), 0)
                : data.chartData.find((item) => item.category === 'Access Control').trendLine[11]
          },
          {
            name: 'Safety',
            color: '#F6894A',
            y:
              filter === 'year'
                ? data.chartData.find((item) => item.category === 'Safety').trendLine.reduce((val, cur) => (val += cur), 0)
                : data.chartData.find((item) => item.category === 'Safety').trendLine[11]
          },
          {
            name: 'Criminal Incident',
            color: '#9D5AA0',
            y: data.chartData.some((item) => item.category === 'Criminal Incident')
              ? filter === 'year'
                ? data.chartData.find((item) => item.category === 'Criminal Incident').trendLine.reduce((val, cur) => (val += cur), 0)
                : data.chartData.find((item) => item.category === 'Criminal Incident').trendLine[11]
              : 0
          },
          {
            name: 'Fault Alarms',
            color: '#15BD02',
            y: data.chartData.some((item) => item.category === 'Fault Alarms')
              ? filter === 'year'
                ? data.chartData.find((item) => item.category === 'Fault Alarms').trendLine.reduce((val, cur) => (val += cur), 0)
                : data.chartData.find((item) => item.category === 'Fault Alarms').trendLine[11]
              : 0
          },
          {
            name: 'Others',
            color: '#BD0272',
            y: data.chartData.some((item) => item.category === 'Others')
              ? filter === 'year'
                ? data.chartData.find((item) => item.category === 'Others').trendLine.reduce((val, cur) => (val += cur), 0)
                : data.chartData.find((item) => item.category === 'Others').trendLine[11]
              : 0
          }
        ]
      };
      const trendLine = data.chartData.map((item) => {
        let color;
        switch (item.category) {
          default:
          case 'Access Control': {
            color = '#FECE3D';
            break;
          }
          case 'Safety': {
            color = '#F6894A';
            break;
          }
          case 'Criminal Incident': {
            color = '#9D5AA0';
            break;
          }
          case 'Fault Alarms': {
            color = '#15BD02';
            break;
          }
          case 'Others': {
            color = '#BD0272';
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

      return {
        trendLine,
        spiderChart,
        xaxis: data.xAxis
      };
    }
  }
];

export default config;
