import React, {CSSProperties, useCallback} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {AnalysisButtons} from '../../../components/Dashboard/AnalysisButtons';
import {useDispatch, useSelector} from 'react-redux';
//@ts-ignore
import {toggleActionSlider} from '../../../reduxStore/actions';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    minWidth: '15%',
    height: 220
  }
}));

export interface AnalysisButtonsContainerProps {
  style?: CSSProperties;
}

export const AnalysisButtonsContainer = ({style = {}}: AnalysisButtonsContainerProps) => {
  const dispatch = useDispatch();
  const {building} = useSelector((s: any) => s.map);
  const {iFrames} = useSelector((s: any) => s.dashboard);

  const onClickSustainability = useCallback(() => {
    dispatch(toggleActionSlider('energy', 'ENERGY_DETAILS'));
  }, [dispatch]);

  const onClickAssets = useCallback(() => {
    window.open(
      building
        ? iFrames.districtPortals.find(
            (item: any) => item.module.toUpperCase() === 'ENERGY' && item.section === 'ASSET_DETAILS' && item.buildingId === building
          ).kpiConfiguration.apiUrl
        : iFrames.districtPortals.find(
            (item: any) => item.module.toUpperCase() === 'ENERGY' && item.section === 'ASSET_DETAILS' && item.buildingId == null
          ).kpiConfiguration.apiUrl,
      '_blank'
    );
  }, [building, iFrames]);

  return (
    <AnalysisButtons style={{...styles.container, ...style}} onClickSustainability={onClickSustainability} onClickAssets={onClickAssets} />
  );
};
