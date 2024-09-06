import React from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {SustainabilityTrendLineAndBreakdownContainer} from './SustainabilityTrendLineAndBreakdownContainer';
import {useSelector} from 'react-redux';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    justifyContent: 'center',
    maxWidth: 455
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  container: {
    ...spacing.flexVertically,
    justifyContent: 'center',
    width: '100%',
    marginTop: 10
  }
}));

export const SustainabilityWasteSideSectionContainer = () => {
  const {mobileMode} = useSelector((s: any) => s.styling);
  const styles = mobileMode ? mobileStyles : webStyles;
  return (
    <div style={styles.container} className="animate__animated animate__fadeIn">
      <SustainabilityTrendLineAndBreakdownContainer />
    </div>
  );
};
