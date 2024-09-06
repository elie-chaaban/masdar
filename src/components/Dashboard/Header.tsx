import React, {useCallback} from 'react';
import {Styles} from '../../types';
// @ts-ignore
import logo from '../../assets/images/logo/logo.svg';
// @ts-ignore
import headerBackground from '../../assets/images/header-background.png';
import {Text} from '../Common/Text';
import {createStyles} from '../../theme';
// @ts-ignore
import {useDispatch, useSelector} from 'react-redux';
// @ts-ignore
import {toggleTheme, setPlaySequenceAnimation} from '../../reduxStore/actions';
//@ts-ignore
import Loader from '../Utils/Loader';

const webStyles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    flex: 1,
    height: 80,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundImage: `url(${headerBackground})`
  },
  titleWrapper: {
    ...spacing.flexHorizontally,
    alignItems: 'center'
  },
  title: {
    color: colors.white,
    width: '100%'
  },
  logo: {
    width: 58,
    height: 58,
    marginLeft: 30
  }
}));

const mobileStyles: Styles = createStyles(({colors, spacing}) => ({
  ...webStyles,
  logo: {
    width: 52,
    height: 52,
    marginLeft: 19
  },
  title: {
    ...webStyles.title,
    fontSize: 12,
    marginRight: 82,
    width: '100%'
  }
}));

export interface HeaderProps {
  headerImage?: string;
  headerBackgroundImage?: string;
  title: string;
  isAggregating: boolean;
}

export const Header = ({headerImage, title, headerBackgroundImage, isAggregating}: HeaderProps) => {
  const {mobileMode} = useSelector((s: any) => s.styling);
  const {playSequenceAnimation} = useSelector((s: any) => s.map);
  const styles = mobileMode ? mobileStyles : webStyles;
  const dispatch = useDispatch();
  let image = headerImage ? `${process.env['REACT_APP_FILES_URL']}${headerImage}` : logo;
  let backgroundImage = headerBackgroundImage ? `${process.env['REACT_APP_FILES_URL']}${headerBackgroundImage}` : headerBackground;

  const toggle = () => {
    dispatch(toggleTheme());
  };

  const onClick = useCallback(() => {
    dispatch(setPlaySequenceAnimation(!playSequenceAnimation));
    console.log('playing...', !playSequenceAnimation);
  }, [dispatch, playSequenceAnimation]);

  return (
    <div style={{...styles.container, backgroundImage: `url(${backgroundImage})`}}>
      <div style={styles.titleWrapper}>
        {image && <img src={image} style={styles.logo} alt="logo" onClick={onClick} />}
        <Text style={{...styles.title, ...(window.innerWidth <= 375 ? {marginRight: 74} : {})}} variant="header">
          {title}
        </Text>
        {isAggregating && <Loader color="#fff" margin={0} />}
      </div>
    </div>
  );
};
