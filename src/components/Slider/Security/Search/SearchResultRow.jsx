import React, {useCallback} from 'react';
import moment from 'moment';

export const SearchResultRow = (props) => {
  const {geo_loc_lat, geo_loc_lon, createdAt, description, camera, behaviorType, onClick} = props;
  const handleClick = useCallback(() => {
    onClick(props);
  }, [onClick, props]);
  const formatLocation = useCallback(() => {
    if (geo_loc_lat && geo_loc_lon) {
      return `${geo_loc_lat}, ${geo_loc_lon}`;
    } else {
      return 'No Location Data';
    }
  }, [geo_loc_lat, geo_loc_lon]);
  return (
    <tr style={{'background-color': '#6382b777'}} className="search-result-row" onClick={handleClick}>
      <td style={{'white-space': 'nowrap'}} className="field-col-value">
        {moment(createdAt, 'x').format('YYYY-MM-DD hh:mm:ss')}
      </td>
      <td className="field-col-value">{behaviorType}</td>
      <td className="field-col-value">{formatLocation()}</td>
      <td className="field-col-value">{camera}</td>
      <td className="field-col-value">{description || ''}</td>
    </tr>
  );
};
