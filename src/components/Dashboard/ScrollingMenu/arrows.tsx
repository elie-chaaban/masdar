import React, {useContext, useEffect, useState} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {VisibilityContext} from 'react-horizontal-scrolling-menu';
// @ts-ignore
import leftChevron from '../../../assets/images/icons/left-chevron.png';
// @ts-ignore
import rightChevron from '../../../assets/images/icons/right-chevron.png';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.center,
    cursor: 'pointer'
  },
  arrow: {
    width: 34,
    height: 34
  }
}));

const Arrow = ({children, disabled, onClick}: {children: React.ReactNode; disabled: boolean; onClick: VoidFunction}) => {
  return (
    <div onClick={onClick} style={{...styles.container, opacity: disabled ? '0' : '1'}}>
      {children}
    </div>
  );
};

export const LeftArrow = () => {
  const {isFirstItemVisible, scrollPrev, visibleElements, initComplete} = useContext(VisibilityContext);

  const [disabled, setDisabled] = useState(!initComplete || (initComplete && isFirstItemVisible));
  useEffect(() => {
    if (visibleElements.length) {
      setDisabled(isFirstItemVisible);
    }
  }, [isFirstItemVisible, visibleElements]);

  return (
    <Arrow disabled={disabled} onClick={() => scrollPrev()}>
      <img src={leftChevron} style={styles.arrow} />
    </Arrow>
  );
};

export const RightArrow = () => {
  const {isLastItemVisible, scrollNext, visibleElements} = useContext(VisibilityContext);

  const [disabled, setDisabled] = useState(!visibleElements.length && isLastItemVisible);
  useEffect(() => {
    if (visibleElements.length) {
      setDisabled(isLastItemVisible);
    }
  }, [isLastItemVisible, visibleElements]);

  return (
    <Arrow disabled={disabled} onClick={() => scrollNext()}>
      <img src={rightChevron} style={styles.arrow} />
    </Arrow>
  );
};
