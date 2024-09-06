import React, {useCallback} from 'react';
// @ts-ignore
import SustainabilityModulePNG from '../../../assets/images/icons/sustainability-module.png';
// @ts-ignore
import SecurityModulePNG from '../../../assets/images/icons/security-module.png';
// @ts-ignore
import MobilityModulePNG from '../../../assets/images/icons/mobility-module.png';
import {createStyles} from '../../../theme';
import {Styles} from '../../../types';
import {Text} from '../../Common/Text';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexHorizontally,
    minHeight: 40,
    maxHeight: 40,
    justifyContent: 'center'
  },
  module: {
    ...spacing.flexHorizontally,
    ...spacing.center,
    maxWidth: 250,
    cursor: 'pointer'
  },
  moduleTitle: {
    marginLeft: 5,
    color: colors.white
  },
  activeModule: {
    borderColor: colors.moduleActive,
    borderWidth: 2,
    borderRadius: 2,
    borderStyle: 'solid'
  },
  activeModuleText: {
    color: colors.moduleActive
  }
}));

export const moduleIds = {
  sustainability: 'sustainability',
  security: 'security',
  mobility: 'mobility'
};
export type ModuleListItemId = keyof typeof moduleIds;

interface ModuleItem {
  id: ModuleListItemId;
  iconName?: string;
}

export type ModulesList = {[key in ModuleListItemId]: ModuleItem};

const list: ModulesList = {
  sustainability: {
    id: 'sustainability',
    iconName: SustainabilityModulePNG
  },
  security: {
    id: 'security',
    iconName: SecurityModulePNG
  },
  mobility: {
    id: 'mobility',
    iconName: MobilityModulePNG
  }
};

export interface ModulesSwitcherProps {
  modules?: ModuleListItemId[];
  activeId: ModuleListItemId;
  onClick: (id: ModuleListItemId) => void;
}

const ModulesSwitcher = ({modules, activeId, onClick}: ModulesSwitcherProps) => {
  const setOnClick = useCallback(
    (id: ModuleListItemId): (() => void) => {
      return () => onClick(id);
    },
    [onClick]
  );
  return (
    <div style={styles.container}>
      {modules?.map((id) => (
        <div style={styles.module} key={`module-item-${id}`} onClick={setOnClick(id)}>
          <img src={list[id].iconName} alt={list[id].id.toUpperCase()} />
          <div style={styles.moduleTitle}>
            <Text variant="moduleSwitcherTitle" style={activeId === id ? {...styles.activeModuleText} : {}}>{`SMART ${list[
              id
            ].id.toUpperCase()}`}</Text>
            {activeId === id && <div style={styles.activeModule} />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModulesSwitcher;
