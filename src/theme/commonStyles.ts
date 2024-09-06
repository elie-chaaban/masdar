import {CSSProperties} from 'react';

const commonStylesVariants = {
  cardDropShadow: 'cardDropShadow',
  cardLinearGradient: 'cardLinearGradient',
  columnBoxShadow: 'columnBoxShadow'
};

export type CommonStyles = {[key in keyof typeof commonStylesVariants]: CSSProperties};

export const commonStyles: CommonStyles = {
  cardDropShadow: {
    filter: 'drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.05))'
  },
  cardLinearGradient: {
    background: 'linear-gradient(180deg, #F3F3F3 0%, rgba(243, 243, 243, 0) 100%)'
  },
  columnBoxShadow: {
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.05)'
  }
};
