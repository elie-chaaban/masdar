import {useMemo} from 'react';

const useOptions = ({series, height, categories, xAxisValueSuffix, xAxisTitle, seriesName, ...props}) => {
  const config = useMemo(() => {
    const commons = {
      animation: true,
      backgroundColor: null,
      plotBackgroundColor: null,
      plotBorderWidth: null
    };
    let options;
    switch (props.type) {
      case 'Area': {
        options = {
          chart: {
            type: 'areaspline',
            height: height || 120
          },
          title: {
            text: null
          },
          xAxis: {
            categories: categories.map((c) => c.split('-')[0].slice(0, 3)),
            lineColor: 'gray',
            labels: {
              enabled: true,
              rotation: 0,
              step: 3,
              style: {
                color: 'white',
                fontSize: '0.6rem'
              }
            },
            opposite: true,
            title: {
              text: null
            }
          },
          yAxis: {
            title: {
              text: null
            },
            labels: {
              enabled: false
            },
            tickInterval: 2,
            gridLineDashStyle: 'longdash',
            gridLineColor: 'gray'
          },
          tooltip: {
            pointFormatter: function () {
              return `<b style="color: ${this.color}">-</b> ` + this.series.name + ': <b>' + this.y.toString().replace(/ /g, '') + '</b>';
            },
            shared: true,
            style: {
              fontSize: '0.7vw'
            }
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            areaspline: {
              stacking: 'normal',
              lineColor: '#666666',
              lineWidth: 1,
              marker: {
                enabled: false,
                states: {
                  hover: {
                    enabled: false
                  }
                }
              }
            }
          },
          series
        };
        break;
      }
      case 'Pie': {
        const {title} = props;
        options = {
          title: {
            text: title || null,
            verticalAlign: 'bottom',
            y: 25,
            style: {
              color: 'white',
              fontFamily: 'Din',
              fontWeight: 'bold',
              fontSize: '0.7vw',
              padding: '20px'
            }
          },
          chart: {
            height: height || 100,
            plotShadow: false,
            margin: 0,
            type: 'pie'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true
              },
              showInLegend: true,
              borderWidth: 0
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            pointFormatter: function () {
              return `<b style="color: ${this.color}">-</b> ` + this.series.name + ': <b>' + this.y.toString().replace(/ /g, '') + '</b>';
            },
            style: {
              fontSize: '0.7vw'
            }
          },
          series: [{...series}]
        };
        break;
      }
      case 'Point': {
        options = {
          chart: {
            height: height || 120,
            type: 'spline'
          },
          title: {
            text: null
          },
          plotOptions: {
            spline: {
              states: {
                hover: {
                  lineWidthPlus: 0
                }
              },
              lineWidth: 0,
              marker: {
                symbol: 'circle'
              }
            },
            series: {
              borderWidth: 0
            }
          },
          tooltip: {
            pointFormatter: function () {
              return `<b style="color: ${this.color}">-</b> ` + this.series.name + ': <b>' + this.y.toString().replace(/ /g, '') + '</b>';
            },
            shared: true,
            style: {
              fontSize: '0.7vw'
            }
          },
          legend: {
            enabled: false
          },
          yAxis: {
            labels: {
              enabled: false
            },
            tickInterval: 12,
            gridLineColor: 'gray',
            gridLineWidth: 1,
            title: {
              text: null
            }
          },
          xAxis: {
            categories: categories.map((c) => c.split('-')[0].slice(0, 3)),
            labels: {
              enabled: true,
              rotation: 0,
              step: 3,
              style: {
                color: 'white',
                fontSize: '0.6rem'
              }
            },
            opposite: true,
            gridLineColor: 'gray',
            gridLineWidth: 0.5,
            title: {
              text: null
            }
          },
          series
        };
        break;
      }
      case 'StackedBar': {
        const showLabel = props.showLabel !== undefined ? props.showLabel : true;
        const labelColor = props.labelColor || 'white';
        const showXaxis = props.showXaxis !== undefined ? props.showXaxis : true;
        const xRotation = props.xRotation || -45;
        options = {
          chart: {
            type: 'column',
            height: height || 200
          },
          title: {
            text: null
          },
          xAxis: {
            categories,
            labels: {
              enabled: showXaxis,
              formatter() {
                return `<span style="color: ${labelColor}">${this.value}</span>`;
              },
              style: {fontSize: 8},
              rotation: xRotation
            }
          },
          yAxis: {
            title: {
              enabled: false
            },
            tickInterval: props.tickInterval === 0 ? undefined : props.tickInterval ? props.tickInterval : 100,
            minorTickInterval: 1,
            gridLineDashStyle: 'longdash',
            gridLineColor: '#757575',

            labels: {
              enabled: showLabel,
              style: {
                color: 'white'
              },
              x: -3
            }
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              borderWidth: 0,
              dataLabels: {
                enabled: false
              }
            }
          },
          tooltip: {
            pointFormatter: function () {
              return `<b style="color: ${this.color}">-</b> ` + this.series.name + ': <b>' + this.y.toString().replace(/ /g, '') + '</b>';
            },
            valueDecimals: 2,
            style: {
              fontSize: '0.7vw'
            }
          },
          legend: {
            enabled: false
          },
          series
        };
        break;
      }
      case 'Comparison': {
        options = {
          chart: {
            type: 'column',
            height: height || 300
          },
          title: {
            text: null
          },
          xAxis: {
            categories: props.sliceCat === undefined || props.sliceCat ? categories.map((c) => c.split('-')[0].slice(0, 3)) : categories,
            crosshair: {
              color: props.crosshair ? 'red' : '#cccccc',
              width: 1,
              zIndex: props.crosshair ? 999 : 2
            },
            labels: {
              enabled: props.showCat !== undefined ? props.showCat : true,
              rotation: 0,
              step: 3,
              style: {
                color: 'white',
                fontSize: '0.6rem'
              }
            }
          },
          yAxis: {
            min: 0,
            title: {
              enabled: false
            },
            gridLineDashStyle: 'longdash',
            gridLineColor: 'gray',
            labels: {
              style: {
                fontSize: 8,
                color: 'white'
              },
              x: -3
            }
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            pointFormatter: function () {
              return `<b style="color: ${this.color}">-</b> ` + this.series.name + ': <b>' + this.y.toString().replace(/ /g, '') + '</b>';
            },
            shared: true,
            style: {
              fontSize: '0.7vw'
            }
          },
          series
        };
        break;
      }
      case 'Overlapping': {
        options = {
          title: {
            text: null
          },
          chart: {
            height: 110,
            type: 'column'
          },
          yAxis: {
            gridLineDashStyle: 'longdash',
            gridLineColor: '#757575',
            title: {
              text: null
            },
            labels: {
              style: {
                color: 'white'
              }
            }
          },
          xAxis: {
            categories: ['', ''],
            labels: {
              enabled: false
            },
            tickWidth: 0,
            title: {
              text: null
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            pointFormatter: function () {
              return `<b style="color: ${this.color}">-</b> ` + this.series.name + ': <b>' + this.y.toString().replace(/ /g, '') + '</b>';
            },
            style: {
              fontSize: '0.7vw'
            }
          },
          plotOptions: {
            column: {
              grouping: false,
              shadow: false,
              borderWidth: 0
            }
          },
          series
        };
        break;
      }
      case 'Pattern': {
        options = {
          title: {
            text: null
          },
          chart: {
            height: height || 50,
            margin: 0
          },
          yAxis: {
            labels: {
              enabled: false
            },
            title: {
              text: null
            },
            gridLineWidth: 0,
            minorGridLineWidth: 0
          },
          xAxis: {
            categories,
            labels: {
              enabled: false
            },
            title: {
              text: null
            },
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent'
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            series: {
              marker: {
                enabled: false,
                states: {
                  hover: {
                    enabled: false
                  },
                  selected: {
                    enabled: false
                  }
                }
              }
            }
          },
          tooltip: {
            pointFormatter: function () {
              return `<b style="color: ${this.color}">-</b> ` + this.series.name + ': <b>' + this.y.toString().replace(/ /g, '') + '</b>';
            },
            enabled: true,
            padding: 2,
            crosshairs: {
              enabled: true,
              color: 'red',
              width: 1
            },
            style: {
              fontSize: '0.7vw',
              width: 300
            }
          },
          series
        };
        break;
      }
      case 'Polar': {
        options = {
          title: {
            text: null
          },
          chart: {
            polar: true,
            type: 'area',
            height: height || 120,
            margin: props.margin || 0
          },
          legend: {
            enabled: false
          },
          pane: {
            size: props.paneSize || '80%'
          },
          xAxis: {
            tickmarkPlacement: 'on',
            lineWidth: 0,
            categories,
            labels: {
              enabled: categories ? true : false,
              style: {
                color: 'white',
                fontSize: 8
              }
            },
            title: {
              text: null
            }
          },
          yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
            startOnTick: false,
            tickAmount: 5,
            labels: {
              enabled: false
            },
            title: {
              text: null
            },
            gridLineColor: '#757575'
          },
          colors: ['#136BA0'],
          tooltip: {
            pointFormatter: function () {
              return `<b style="color: ${this.color}">-</b> ` + this.series.name + ': <b>' + this.y.toString().replace(/ /g, '') + '</b>';
            },
            shared: true,
            style: {
              fontSize: '0.7vw'
            }
          },

          series: Array.isArray(series)
            ? series.map((d) => ({...d, pointPlacement: 'on'}))
            : [
                {
                  name: series.name,
                  data: series.data,
                  pointPlacement: 'on'
                }
              ]
        };
        break;
      }
      case 'Bar': {
        const maximum = series.sort((a, b) => b.data[0] - a.data[0]);
        const maximum1 = props.average
          ? Object.keys(props.average)
              .map((item) => props.average[item])
              .sort((a, b) => b - a)
          : null;
        const max = maximum1 ? (maximum1[0] > maximum[0].data[0] ? maximum1[0] : maximum[0].data[0]) : maximum[0].data[0];
        const yAxis = props.average
          ? {
              max,
              title: {
                enabled: false
              },
              step: 3,
              labels: {
                style: {
                  fontSize: 8,
                  color: 'white'
                },
                x: -3
              },
              gridLineDashStyle: 'longdash',
              gridLineColor: 'gray',
              plotLines: Object.keys(props.average).map((key) => ({
                color: series.find((item) => item.name.toLowerCase() === key.toLowerCase()).color,
                value: '' + props.average[key], // Insert your average here
                width: '1',
                zIndex: 1000
              }))
            }
          : {
              title: {
                enabled: false
              },
              step: 3,
              labels: {
                style: {
                  fontSize: 8,
                  color: 'white'
                },
                x: -3
              },
              gridLineDashStyle: 'longdash',
              gridLineColor: 'gray'
            };
        options = {
          chart: {
            type: 'column',
            margin: props.margin || [5, 20, 5, 20],
            height: height || 150
          },
          title: {
            text: null
          },
          xAxis: {
            type: 'category',
            labels: {
              enabled: false
            }
          },
          yAxis,
          legend: {
            enabled: false
          },
          plotOptions: {
            column: {
              borderWidth: 0
            }
          },
          tooltip: {
            pointFormatter: function () {
              return `<b style="color: ${this.color}">-</b> ` + this.series.name + ': <b>' + this.y.toString().replace(/ /g, '') + '</b>';
            },
            style: {
              fontSize: '0.7vw'
            }
          },
          series
        };
        break;
      }
      case 'Line2': {
        options = {
          title: {
            text: null
          },
          chart: {
            height: height || 150,
            backgroundColor: null
          },
          yAxis: {
            labels: {
              formatter() {
                return `<span>${`${this.value.toLocaleString()} ${xAxisValueSuffix}`}</span>`;
              },
              style: {
                color: 'black'
              }
            },
            title: {
              text: `${xAxisTitle}`,
              style: {
                color: 'black'
              }
            }
          },
          xAxis: {
            categories,
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            labels: {
              style: {
                color: 'black',
                style: {
                  fontSize: 8
                }
              },
              align: 'right',
              rotation: 270
            },
            title: {
              text: null
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            pointFormatter: function () {
              return (
                `<b style="color: ${this.color}">-</b> ` +
                (seriesName || this.series.name) +
                ': <b>' +
                this.y.toLocaleString() +
                ' ' +
                xAxisValueSuffix +
                '</b>'
              );
            },
            shared: true,
            style: {
              fontSize: '0.7vw'
            }
          },
          plotOptions: {
            line: {
              lineWidth: 3,
              marker: {
                enabled: props.marker !== undefined ? props.marker : true,
                symbol: 'circle'
              }
            },
            column: {
              borderWidth: 0
            }
          },
          series
        };
        break;
      }
      case 'Gauge': {
        options = {
          chart: {
            type: 'solidgauge',
            margin: 0,
            height: 100,
            padding: 0
          },
          title: null,
          pane: {
            center: ['50%', '88%'],
            size: '150%',
            startAngle: -90,
            endAngle: 90,
            background: {
              backgroundColor: '#4D5F7E',
              innerRadius: '50%',
              outerRadius: '100%',
              shape: 'arc',
              borderColor: 'black',
              borderWidth: 0
            }
          },
          tooltip: {
            pointFormatter: function () {
              return `<b style="color: ${this.color}">-</b> ` + this.series.name + ': <b>' + this.y.toString().replace(/ /g, '') + '</b>';
            },
            enabled: false
          },
          yAxis: {
            stops: [
              [0.1, '#67CBF0'],
              [0.5, '#67CBF0'],
              [0.9, '#67CBF0']
            ],
            min: 0,
            max: props.max,
            title: {
              enabled: false
            },
            lineWidth: 0,
            tickWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            labels: {
              y: 16,
              style: {
                color: 'white'
              }
            }
          },

          plotOptions: {
            solidgauge: {
              innerRadius: '50%'
            }
          },
          series
        };
        break;
      }
      case 'variablepie': {
        options = {
          chart: {
            type: 'variablepie',
            height: height || 220,
            plotShadow: false
          },
          title: {
            text: ''
          },
          colors: ['#246490', '#4D7389', '#84374A', '#392D57'],

          accessibility: {
            point: {
              valueSuffix: '%'
            }
          },
          plotOptions: {
            pie: {
              shadow: false,
              borderWidth: 0,
              showInLegend: false,
              size: '80%',
              innerSize: '60%',
              data: series
            }
          },
          tooltip: {
            headerFormat: '',
            pointFormat: '<span style="color:{point.color}">\u25CF</span>{point.name}: {point.z} KGs'
          },
          series: [
            {
              type: 'pie',
              name: 'Category %',
              dataLabels: {
                color: 'white',
                style: {
                  fontSize: 10,
                  textOutline: 0
                },
                distance: -12,
                formatter: function () {
                  if (this.percentage !== 0) return Math.round(this.percentage) + '%';
                }
              }
            },
            {
              type: 'pie',
              name: 'Category %',

              dataLabels: {
                connectorColor: 'grey',
                color: 'white',
                style: {
                  fontSize: 14,
                  fontWeight: 700,
                  textOutline: 0
                },
                softConnector: false,
                connectorWidth: 1,
                verticalAlign: 'top',
                distance: 20,
                formatter: function () {
                  if (this.percentage !== 0) return this.point.name;
                }
              }
            }
          ]
        };
        break;
      }
      case 'Item': {
        options = {
          chart: {
            type: 'item'
          },
          title: null,
          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 600
                },
                chartOptions: {
                  series: [
                    {
                      dataLabels: {
                        distance: -30
                      }
                    }
                  ]
                }
              }
            ]
          },
          series
        };
        break;
      }
      default:
        options = {
          title: {
            text: null
          },
          chart: {
            height: height || 130,
            animation: true,
            backgroundColor: null
          },
          yAxis: {
            labels: {
              enabled: true,
              style: {
                color: 'white'
              }
            },
            title: {
              text: null
            },
            gridLineDashStyle: 'longdash',
            gridLineColor: '#757575',
            tickInterval: 2
          },
          xAxis: {
            categories: categories.map((c) => c.split('-')[0].slice(0, 3)),
            lineColor: 'gray',
            labels: {
              enabled: true,
              rotation: 0,
              step: 3,
              style: {
                color: 'white',
                fontSize: '0.6rem'
              }
            },
            title: {
              text: null
            }
          },
          tooltip: {
            pointFormatter: function () {
              return `<b style="color: ${this.color}">-</b> ` + this.series.name + ': <b>' + this.y.toString().replace(/ /g, '') + '</b>';
            },
            shared: true,
            style: {
              fontSize: '0.7vw'
            }
          },
          plotOptions: {
            line: {
              marker: {
                enabled: props.marker !== undefined ? props.marker : true
              }
            }
          },
          legend: {
            enabled: false
          },
          series
        };
    }
    return {...options, chart: {...options.chart, ...commons}};
  }, [props, height, categories, series, xAxisTitle, xAxisValueSuffix, seriesName]);
  return config;
};

export default useOptions;
