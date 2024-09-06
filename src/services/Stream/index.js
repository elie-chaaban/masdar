import instance from '../../api/authenticated';
import apiInstance from '../../api/authenticatedApi';
import {default as store} from '../../reduxStore';
import {updateStreamCameras} from '../../reduxStore/actions';

const authenticateStream = async (districtId) => {
  try {
    const {data: data3dEye} = await apiInstance.post('streaming/authenticate-stream-provider', {
      districtId
    });
    const {data: cameras} = await apiInstance.get(`streaming/stream-provider-cameras?DistrictId=${districtId}`);
    return {cameras: cameras.cameras, credentials_3dEye: data3dEye};
  } catch (e) {
    return {cameras: [], credentials_3dEye: {}};
  }
};

export const enableDisableTelusStream = async (enable = false) => {
  try {
    const districtId = store.getState().map.district;
    await instance.get('stream/enableDisableTelusStream', {params: {enable}});
    const {cameras} = await authenticateStream(districtId);
    store.dispatch(updateStreamCameras(cameras));
    return true;
  } catch (e) {
    throw e;
  }
};

export default authenticateStream;
