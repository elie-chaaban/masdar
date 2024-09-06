import {CSSProperties} from 'react';

const spacingVariants = {
  center: 'center',
  centerVertically: 'centerVertically',
  flex: 'flex',
  flexVertically: 'flexVertically',
  flexHorizontally: 'flexHorizontally'
};

export type Spacing = {[key in keyof typeof spacingVariants]: CSSProperties};

export const spacing: Spacing = {
  flex: {
    flex: 1,
    display: 'flex'
  },
  flexVertically: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  flexHorizontally: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row'
  },
  center: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerVertically: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
};
