import React, {useContext, useState} from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
import {Text} from '../../Common/Text';
import {VisibilityContext} from 'react-horizontal-scrolling-menu';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.flexVertically,
    position: 'relative',
    zIndex: 999,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 100,
    height: '100%',
    cursor: 'pointer'
  },
  imageWrapper: {
    ...spacing.flex,
    marginBottom: 4
  },
  image: {
    transition: 'transform .5s ease',
    width: '100%',
    height: 25
  },
  title: {
    ...spacing.center,
    minWidth: '100%',
    textAlign: 'center',
    alignItems: 'flex-end',
    color: colors.white
  },
  zoom: {
    transform: 'scale(1.07)'
  }
}));

export interface MenuItemProps {
  id: string;
  imageUrl: string;
  title: string;
  onClick?: () => void;
}

export const MenuItem = ({id, imageUrl, title, onClick}: MenuItemProps) => {
  const [zoom, setZoom] = useState({});
  const visibility = useContext(VisibilityContext);
  const visible = visibility.isItemVisible(id);
  return (
    <div style={styles.container} onClick={onClick} onMouseEnter={() => setZoom(styles.zoom)} onMouseLeave={() => setZoom({})}>
      <div style={styles.imageWrapper}>
        <img src={imageUrl} style={{...styles.image, ...zoom}} />
      </div>
      <div style={styles.title}>
        <Text variant="miniFootLabel">{title}</Text>
      </div>
    </div>
  );
};
