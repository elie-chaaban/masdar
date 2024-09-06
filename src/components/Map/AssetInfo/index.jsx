import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import {Animate} from '../../Utils';
// import {activateDeactivateDevice, getDeviceStatus} from '../../../services/dashBoard';
import {activateDeactivateDevice} from '../../../services/dashBoard';
import {successNotification} from '../../../components/Utils/Notifications';

const AssetInfo = ({enter, asset = null, deselectMapAsset}) => {
  const [active, setActive] = useState(asset && asset.active === 1);
  // const [ipAddress, setIpAddress] = useState('');
  // useEffect(() => {
  //   const call = async () => {
  //     const {status, fixedIPAddress} = await getDeviceStatus(asset.ICCID);
  //     setActive(status === 'ACTIVATED');
  //     setIpAddress(fixedIPAddress);
  //   };
  //   if (asset) call();
  // }, [asset]);
  const onClick = useCallback(async () => {
    const activate = !active;
    try {
      await activateDeactivateDevice(asset.asset_id, asset.ICCID, activate);
      setActive(activate);
      successNotification(`Device ${activate ? 'Activated' : 'Deactivated'} Successfully.`);
      deselectMapAsset();
    } catch (error) {
      successNotification(`Network Error When ${activate ? 'Activating' : 'Deactivating'} Device`, 'warning');
    }
  }, [active, asset, deselectMapAsset]);
  return (
    <Animate animation="slideRight" enter={enter} options={{duration: 500}} unMountOnExit className=" asset-info shadow rounded">
      {asset ? (
        <div className="asset-info-container">
          <p>Status: {active ? 'Enabled' : 'Disabled'}</p>
          <p>Fixed IP: {asset.name}</p>
          {/* <p>Fixed IP: {ipAddress}</p> */}
          {asset.ICCID && <p>ICCID: {asset.ICCID}</p>}
          {asset.ICCID && (
            <button className="btn asset-info-enable-btn" onClick={onClick}>
              {active ? 'Deactivate' : 'Activate'}
            </button>
          )}
        </div>
      ) : null}
    </Animate>
  );
};
AssetInfo.propTypes = {
  enter: PropTypes.bool.isRequired,
  asset: PropTypes.object,
  deselectMapAsset: PropTypes.func.isRequired
};
export default React.memo(AssetInfo);
