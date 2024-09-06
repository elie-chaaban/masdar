import React, {useState, CSSProperties, useCallback, useEffect} from 'react';
import {ScrollMenu, VisibilityContext} from 'react-horizontal-scrolling-menu';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {LeftArrow, RightArrow} from './arrows';
import usePreventBodyScroll from './usePreventBodyScroll';
import './hideScrollbar.css';
import {MenuItem} from './MenuItem';
import Pagination from '@mui/material/Pagination';
import './styles.scss';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {},
  paginationRow: {
    ...spacing.flex,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  }
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
  zoneId: string;
  title: string;
  savingsPercentage: number;
}

export interface ScrollingMenuProps {
  style?: CSSProperties;
  onItemClick?: (id: string) => void;
  list: ListItem[];
}

export const UnitsScrollingMenu = ({style, list, onItemClick}: ScrollingMenuProps) => {
  const {disableScroll, enableScroll} = usePreventBodyScroll();
  const [scrollMenuApi, setScrollMenuApi] = useState<any>();
  const [page, setPage] = useState(1);
  const handleChange = (event: any, value: number) => {
    setPage(value);
  };

  const onInit = useCallback((api: any) => {
    setScrollMenuApi(api);
  }, []);

  useEffect(() => {
    if (page && scrollMenuApi) {
      if (page === 1) {
        scrollMenuApi.scrollToItem(scrollMenuApi.getItemByIndex(1));
      } else {
        scrollMenuApi.scrollToItem(scrollMenuApi.getItemByIndex((page - 1) * 10 + 1));
      }
    }
  }, [page, scrollMenuApi]);

  return (
    <div style={{...styles.container, ...style}}>
      <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} onWheel={onWheel} onInit={onInit}>
          {list.map(({zoneId, title, savingsPercentage}) => (
            <MenuItem
              zoneId={zoneId}
              key={zoneId}
              title={title}
              savingsPercentage={savingsPercentage}
              onClick={() => onItemClick && onItemClick(title)}
            />
          ))}
        </ScrollMenu>
      </div>
      <div style={styles.paginationRow}>
        <Pagination page={page} count={Math.ceil(list?.length / 10) || 1} onChange={handleChange} />
      </div>
    </div>
  );
};
