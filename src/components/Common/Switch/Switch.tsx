import React, {ChangeEvent, CSSProperties} from 'react';
import Form from 'react-bootstrap/Form';
import './styles.css';

export interface SwitchProps {
  id: string;
  style?: CSSProperties;
  label: string;
  checked?: boolean;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Switch = ({id, style, label, checked, disabled, onChange}: SwitchProps) => {
  return <Form.Switch style={style || {}} id={id} disabled={disabled} label={label} checked={checked} onChange={onChange} />;
};
