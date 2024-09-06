import React, {useState, useRef, useEffect, useCallback} from 'react';
import style from './Dropdown.module.css';
import PropTypes from 'prop-types';
import classes from 'react-style-classes';
import Item from './Item';
import Submenu from './Submenu';
import Divider from './Divider';

const Dropdown = React.forwardRef(
  ({title, children, isDisabled, position, wrapperClassName, buttonClassName, menuClassName, getToggleDropdown, ...props}, ref) => {
    const [isOpen, setOpen] = useState(false);
    const dropdownRef = useRef();

    const showHide = useCallback((show) => {
      setOpen(show);
    }, []);

    const handleClick = useCallback((e) => {
      if (!dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }, []);

    useEffect(() => {
      getToggleDropdown(showHide);
    }, [getToggleDropdown, showHide]);

    useEffect(() => {
      document.addEventListener('mousedown', handleClick);

      return () => {
        document.removeEventListener('mousedown', handleClick);
      };
    }, [handleClick]);

    const handleButtonOnClick = () => {
      if (isDisabled) {
        return;
      }

      setOpen(!isOpen);
    };

    return (
      <div className={classes(style.dropdown, wrapperClassName)} ref={dropdownRef}>
        <button
          ref={ref}
          type="button"
          className={classes(style.button, isOpen && style.active, isDisabled && style.disabled, buttonClassName)}
          disabled={isDisabled}
          tabIndex={0}
          onClick={handleButtonOnClick}
          {...props}
        >
          {title}
        </button>
        {isOpen && (
          <div className={classes(style.menu, position === 'right' && style.menuRight, menuClassName)}>
            <ul>{children}</ul>
          </div>
        )}
      </div>
    );
  }
);

Dropdown.propTypes = {
  title: PropTypes.any,
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right']),
  wrapperClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
  menuClassName: PropTypes.string
};

Dropdown.defaultProps = {
  children: null,
  isDisabled: false,
  title: null,
  position: 'left',
  wrapperClassName: null,
  buttonClassName: null,
  menuClassName: null
};

Dropdown.Item = Item;
Dropdown.Submenu = Submenu;
Dropdown.Divider = Divider;

export default Dropdown;
