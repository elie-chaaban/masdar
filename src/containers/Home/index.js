import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Map from '../../components/Map';
import SideBar from '../SideBar';
import InsightSlider from '../../components/InsightSlider';
import IntersectionDataSlider from '../../components/IntersectionDataSlider';
import Slider from '../Slider';
import ActionDetails from '../ActionDetails';
import DynamicContent from '../DynamicContent';
import Modal from '../../components/Utils/Modal';
import MultiWindowModal from '../../components/Utils/MultiWindowModal';
import WindowNumberModal from '../../components/Utils/WindowNumberModal';
import MWBroadcastChannel from '../../services/MWBroadcastChannel';
import {LoaderFull} from '../../components/Utils';
import {setActiveWindows, setMultiWindowConfig, removeActiveWindow, toggleInsight, toggleSlider} from '../../reduxStore/actions';

const broadcastChannel = MWBroadcastChannel.getService();
broadcastChannel.startListening();

export default function Home() {
  const dispatch = useDispatch();
  const districts = useSelector((s) => s.map.districts);
  const districtsData = useSelector((s) => s.map.districtsData);
  const access = useSelector((s) => s.user.access);
  const doneLoading = districts && access && districtsData.length;

  useEffect(() => {
    dispatch(setMultiWindowConfig());
    dispatch(setActiveWindows());
    dispatch(toggleInsight('energy'));
    dispatch(toggleSlider());
    window.addEventListener('unload', (event) => {
      dispatch(removeActiveWindow());
    });
  }, [dispatch]);
  return doneLoading ? (
    <div className="App">
      <SideBar data-testid="sidebar" />
      <Map data-testid="map" />
      <Slider data-testid="slider" />
      <ActionDetails data-testid="actions" />
      <InsightSlider data-testid="insightSlider" />
      <IntersectionDataSlider data-testid="intersectionDataSlider" />
      <Modal data-testid="modal" />
      <MultiWindowModal data-testid="multiWindowModal" />
      <WindowNumberModal data-testid="windowNumberModal" />
      <DynamicContent data-testid="dynamicContent" />
    </div>
  ) : (
    <LoaderFull />
  );
}
