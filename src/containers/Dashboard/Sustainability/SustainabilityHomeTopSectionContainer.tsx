import React from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {SustainabilityTotalConsumptionCardsContainer} from './SustainabilityTotalConsumptionCardsContainer';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexHorizontally,
    flex: 0,
    marginBottom: 8
  }
}));

export const SustainabilityHomeTopSectionContainer = () => {
  return (
    <div style={styles.container} className="animate__animated animate__fadeIn">
      <SustainabilityTotalConsumptionCardsContainer />
    </div>
  );
};
