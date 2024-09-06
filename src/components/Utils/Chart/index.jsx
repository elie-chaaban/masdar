import React from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import VariablePie from 'highcharts/modules/variable-pie';
import HighchartsReact from 'highcharts-react-official';
import useOptions from './options';

HighchartsMore(Highcharts);
VariablePie(Highcharts);

const Chart = (props) => {
  const options = useOptions(props);
  return (
    <div style={{width: props.width || 'auto'}} className="chart">
      <HighchartsReact highcharts={Highcharts} options={options} callback={props.onCreate} />
    </div>
  );
};

export default React.memo(Chart);
