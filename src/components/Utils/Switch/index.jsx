import React from 'react';
import Toggle from 'react-toggle';
import './styles.css';

const Switch = ({checked, onChange}) => {
  return <Toggle defaultChecked={false} checked={checked} icons={false} onChange={(e) => onChange(e.target.checked)} />;
};

export default Switch;
