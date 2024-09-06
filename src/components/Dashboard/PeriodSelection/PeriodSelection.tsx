import React, {useCallback} from 'react';
import {Styles} from '../../../types';
//@ts-ignore
import Loader from '../../../components/Utils/Loader';
// @ts-ignore
import greenCheck from '../../../assets/images/icons/green_check.png';

import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
import {useSelector} from 'react-redux';
// @ts-ignore
import {selectThemeProperties} from '../../../reduxStore/selectors';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flex,
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  loaderWrapper: {
    ...spacing.center,
    height: 40,
    width: '100%',
    background: colors.periodSelectionContainerBackground
  },
  optionsContainer: {
    ...spacing.center,
    flexDirection: 'row'
  },
  periodOption: {
    ...spacing.center,
    flexDirection: 'row',
    width: 175,
    maxWidth: 195,
    height: 22,
    borderRadius: 20,
    paddingLeft: 34,
    paddingRight: 34,
    backgroundColor: colors.periodOptionBackground,
    color: colors.white,
    marginLeft: 18,
    cursor: 'pointer'
  },
  activePeriodOptionBackground: {
    backgroundColor: colors.periodOptionActiveBackground,
    color: colors.white
  },
  backButton: {
    flex: 0,
    minWidth: 58,
    marginLeft: 34,
    color: colors.white,
    cursor: 'pointer'
  },
  comparisonButton: {
    flex: 0,
    minWidth: 160,
    marginRight: 28,
    color: colors.white,
    cursor: 'pointer'
  },
  checkIcon: {
    width: 13,
    height: 12,
    marginRight: 4
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  optionsContainer: {
    ...webStyles.optionsContainer,
    gap: 7
  },
  backButton: {
    ...webStyles.backButton,
    marginLeft: 5
  }
}));

export const periodIds = {
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'year'
};

export type PeriodItemId = keyof typeof periodIds;

interface PeriodItem {
  id: PeriodItemId;
  label: string;
}

export type PeriodList = {[key in PeriodItemId]: PeriodItem};

const list: PeriodList = {
  day: {
    id: 'day',
    label: 'DAY'
  },
  week: {
    id: 'week',
    label: 'WEEK'
  },
  month: {
    id: 'month',
    label: 'MONTH'
  },
  year: {
    id: 'year',
    label: 'YEAR'
  }
};

export interface PeriodSelectionProps {
  selectedPeriodId: PeriodItemId;
  loading: boolean;
  onSelectPeriod: (id: PeriodItemId) => void;
  onClickBack?: () => void;
  onClickAddComparison: () => void;
}

export const PeriodSelection = ({selectedPeriodId, loading, onSelectPeriod, onClickBack, onClickAddComparison}: PeriodSelectionProps) => {
  const {mobileMode} = useSelector((s: any) => s.styling);
  const {insight} = useSelector((s: any) => s.dashboard);
  const stylingProperties = useSelector(selectThemeProperties) as any;
  const styles = mobileMode ? mobileStyles : webStyles;
  const setOnClick = useCallback(
    (id: PeriodItemId): (() => void) => {
      return () => onSelectPeriod(id);
    },
    [onSelectPeriod]
  );
  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.loaderWrapper}>
          <Loader height="60px" margin={0} />
        </div>
      ) : (
        <>
          {onClickBack && (
            <div style={styles.backButton} onClick={onClickBack}>
              <Text variant="textLink">{'< BACK'}</Text>
            </div>
          )}
          <div style={styles.optionsContainer}>
            {Object.keys(list).map((periodId) => {
              const period = list[periodId as PeriodItemId];
              return (
                <div
                  key={`period-option-${periodId}`}
                  style={{
                    ...styles.periodOption,
                    ...stylingProperties?.periodSelectionStyle,
                    ...(periodId === selectedPeriodId
                      ? {...styles.activePeriodOptionBackground, ...stylingProperties?.toggledPeriodSelectionStyle}
                      : {}),
                    ...(mobileMode ? {maxWidth: 42, marginLeft: 5} : {})
                  }}
                  onClick={setOnClick(periodId as PeriodItemId)}
                >
                  {periodId === selectedPeriodId && <img src={greenCheck} style={styles.checkIcon} alt="check icon" />}
                  <Text variant="normal">{period.label}</Text>
                </div>
              );
            })}
          </div>
          {!insight && !mobileMode && (
            <div style={styles.comparisonButton} onClick={onClickAddComparison}>
              <Text variant="textLink">{'+ ADD COMPARISON'}</Text>
            </div>
          )}
        </>
      )}
    </div>
  );
};
