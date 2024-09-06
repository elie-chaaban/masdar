import React, {ReactNode, CSSProperties} from 'react';
import {Styles} from '../../types';
import {textVariants, TextVariant} from '../../typography';

const styles: Styles = {
  normal: {
    textAlign: 'left'
  },
  header: {
    textAlign: 'center'
  },
  iconLabel: {
    textAlign: 'center'
  }
};

export interface TextProps {
  style?: CSSProperties;
  variant?: TextVariant;
  children: ReactNode;
}

export const Text = ({style, variant = 'normal', children}: TextProps) => {
  const variantStyle = textVariants[variant].style;
  return <span style={{...variantStyle, ...(styles[variant] ? styles[variant] : {}), ...(style ? style : {})}}>{children}</span>;
};
