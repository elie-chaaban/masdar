import React, {useCallback, useRef} from 'react';
import {Icon, Dropdown} from '../../../Utils';

export const MultilevelDropdown = (props) => {
  let toggleRef = useRef({toggleDropdown: null});
  const {menu, active, onClick} = props;
  const handleClick = useCallback(
    (option) => {
      onClick(option);
      toggleRef.current.toggleDropdown(false);
    },
    [onClick, toggleRef]
  );
  const getToggleDropdown = useCallback((func) => {
    toggleRef.current.toggleDropdown = func;
  }, []);
  return (
    <Dropdown
      buttonClassName="filter-dropdown-btn"
      menuClassName="filter-dropdown-menu"
      title={<Icon name={active ? 'FilterIconActive' : 'FilterIcon'} className="filter-icon" />}
      position="right"
      getToggleDropdown={getToggleDropdown}
    >
      {menu.map((item) => (
        <Dropdown.Item key={`menu-item-${item.value}`} onClick={!item.options ? () => onClick(item.title, item.value) : null}>
          {item.title}
          {item.options && (
            <Dropdown.Submenu className="filter-dropdown-menu" position="right">
              {item.options.map((option) => (
                <Dropdown.Item key={`option-${option.value}`} onClick={() => handleClick(option)}>
                  {option.title}
                </Dropdown.Item>
              ))}
            </Dropdown.Submenu>
          )}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};
