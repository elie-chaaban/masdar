import React, {CSSProperties} from 'react';
import {ScrollMenu, VisibilityContext} from 'react-horizontal-scrolling-menu';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {LeftArrow, RightArrow} from './arrows';
import usePreventBodyScroll from './usePreventBodyScroll';
import './hideScrollbar.css';
import {MenuItem} from './MenuItem';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {}
}));

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
}

export interface ListItem {
  id: string;
  title: string;
  imageUrl: string;
}

export interface ScrollingMenuProps {
  style?: CSSProperties;
  onItemClick?: (id: string) => void;
  list: ListItem[];
}

export const ScrollingMenu = ({style, list, onItemClick}: ScrollingMenuProps) => {
  const {disableScroll, enableScroll} = usePreventBodyScroll();

  return (
    <div style={{...styles.container, ...style}}>
      <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} onWheel={onWheel}>
          {list.map(({id, title, imageUrl}) => (
            <MenuItem id={id} key={id} title={title} imageUrl={imageUrl} onClick={() => onItemClick && onItemClick(id)} />
          ))}
        </ScrollMenu>
      </div>
    </div>
  );
};
