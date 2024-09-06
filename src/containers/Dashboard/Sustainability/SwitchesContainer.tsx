import React, {useEffect, useState, useCallback, ChangeEvent, CSSProperties} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {useSelector, useDispatch} from 'react-redux';
// @ts-ignore
import {setSelectedTrendLineOrBreakdown} from '../../../reduxStore/actions';
import {Switch} from '../../../components/Common/Switch/Switch';
import {TextButton} from '../../../components/Common/TextButton';
import {Text} from '../../../components/Common/Text';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    alignItems: 'center',
    minWidth: '15%',
    height: 280,
    marginRight: 30
  },
  subSystemsWrapper: {
    ...spacing.flexVertically,
    flex: 0,
    maxWidth: 260,
    marginTop: 4,
    marginBottom: 4
  },
  button: {
    width: 290,
    minHeight: 57,
    maxHeight: 57,
    marginBottom: 20
  },
  headerText: {
    textAlign: 'center',
    marginTop: 22,
    marginBottom: 32
  }
}));

export const systemsSwitches = {
  electricity: 'electricity',
  hvac: 'hvac',
  lighting: 'lighting',
  lift: 'lift',
  emergency: 'emergency',
  others: 'others',
  cooling: 'cooling'
};

type SystemsSwitchesId = keyof typeof systemsSwitches;

type SystemsSwitches = {
  [key in SystemsSwitchesId]: boolean;
};

const defaultSystemsSwitches: SystemsSwitches = {
  electricity: false,
  hvac: false,
  lighting: false,
  lift: false,
  emergency: false,
  others: false,
  cooling: false
};

export interface SwitchesContainerProps {
  style?: CSSProperties;
}

export const SwitchesContainer = ({style}: SwitchesContainerProps) => {
  const dispatch = useDispatch();
  const selectedTrendLineOrBreakdown = useSelector((s: any) => s.dashboard.selectedTrendLineOrBreakdown);
  const selectedSwitch = selectedTrendLineOrBreakdown?.length > 0 ? {[selectedTrendLineOrBreakdown]: true} : {};
  const [switches, setSwitches] = useState<SystemsSwitches>({
    ...defaultSystemsSwitches,
    ...selectedSwitch
  });

  useEffect(() => {
    const selectedSwitch = selectedTrendLineOrBreakdown?.length > 0 ? {[selectedTrendLineOrBreakdown]: true} : {};
    setSwitches({
      ...defaultSystemsSwitches,
      ...selectedSwitch
    });
  }, [selectedTrendLineOrBreakdown]);

  const setSelectedSwitch = useCallback(
    (id: string) => {
      let selected = id;
      if (id === selectedTrendLineOrBreakdown) {
        const prevState = switches[id as SystemsSwitchesId];
        if (prevState) {
          selected = '';
        }
      }
      dispatch(setSelectedTrendLineOrBreakdown(selected));
    },
    [switches, selectedTrendLineOrBreakdown, dispatch]
  );

  const onSwitch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const id = e.target.id;
      setSelectedSwitch(id);
    },
    [setSelectedSwitch]
  );

  const onElectricityClick = useCallback(() => {
    setSelectedSwitch(systemsSwitches.electricity);
  }, [setSelectedSwitch]);

  const onCoolingClick = useCallback(() => {
    setSelectedSwitch(systemsSwitches.cooling);
  }, [setSelectedSwitch]);

  return (
    <div style={{...styles.container, ...style}}>
      <Text style={styles.headerText} variant="boldNumericValue">
        {'ENERGY BREAKDOWN'}
      </Text>
      <TextButton
        text="ELECTRICITY"
        style={styles.button}
        toggled={switches[systemsSwitches.electricity as SystemsSwitchesId]}
        onClick={onElectricityClick}
      />
      <div style={styles.subSystemsWrapper}>
        {/* <Switch
          id={systemsSwitches.hvac}
          checked={switches[systemsSwitches.hvac as SystemsSwitchesId]}
          label="HVAC SYSTEMS"
          onChange={onSwitch}
        />
        <Switch
          id={systemsSwitches.lighting}
          checked={switches[systemsSwitches.lighting as SystemsSwitchesId]}
          label="LIGHTING SYSTEMS"
          onChange={onSwitch}
        />
        <Switch
          id={systemsSwitches.lift}
          checked={switches[systemsSwitches.lift as SystemsSwitchesId]}
          label="LIFT SYSTEMS"
          onChange={onSwitch}
        />
        <Switch
          id={systemsSwitches.emergency}
          checked={switches[systemsSwitches.emergency as SystemsSwitchesId]}
          label="EMERGENCY SYSTEMS"
          onChange={onSwitch}
        />
        <Switch
          id={systemsSwitches.others}
          checked={switches[systemsSwitches.others as SystemsSwitchesId]}
          label="OTHERS"
          onChange={onSwitch}
        /> */}
      </div>
      <TextButton
        text="COOLING"
        style={styles.button}
        toggled={switches[systemsSwitches.cooling as SystemsSwitchesId]}
        onClick={onCoolingClick}
      />
    </div>
  );
};
