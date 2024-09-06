import React, {CSSProperties} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {TextButton} from '../../Common/TextButton';
import {Text} from '../../Common/Text';
import {useSelector} from 'react-redux';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  button: {
    width: 290,
    minHeight: 57,
    maxHeight: 57,
    marginBottom: 20
  },
  title: {
    ...spacing.flex,
    marginTop: 22,
    marginBottom: 32
  }
}));

export interface AnalysisButtonsProps {
  style?: CSSProperties;
  onClickSustainability: () => void;
  onClickAssets: () => void;
}

export const AnalysisButtons = ({style, onClickSustainability, onClickAssets}: AnalysisButtonsProps) => {
  const {energyAnalysis, assetsAnalysis} = useSelector((s: any) => s.user.access);
  const {district} = useSelector((s: any) => s.map);
  const hasEnergyAnalysisAccess = energyAnalysis?.includes(district);
  const hasAssetsAnalysisAccess = assetsAnalysis?.includes(district);

  if (!hasAssetsAnalysisAccess && !hasAssetsAnalysisAccess) return <div style={{...styles.container, ...style}} />;
  return (
    <div style={{...styles.container, ...style}}>
      <Text style={styles.title} variant="boldNumericValue">
        {'OPERATOR ANALYSIS'}
      </Text>
      {hasEnergyAnalysisAccess && <TextButton text="SUSTAINABILITY ANALYSIS" style={styles.button} onClick={onClickSustainability} />}
      {hasAssetsAnalysisAccess && <TextButton text="ASSETS ANALYSIS" style={styles.button} onClick={onClickAssets} />}
    </div>
  );
};
