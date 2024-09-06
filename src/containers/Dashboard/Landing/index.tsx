import React from 'react';
import {Styles} from '../../../types';
import {createStyles} from '../../../theme';
// @ts-ignore
import landingBackground from '../../../assets/images/landing-background.png';
import {Text} from '../../../components/Common/Text';
import {TextButton} from '../../../components/Common/TextButton';
import {useDispatch, useSelector} from 'react-redux';
//@ts-ignore
import {setOpenLanding} from '../../../reduxStore/actions';
// @ts-ignore
import logo from '../../../assets/images/logo/white-big-logo.png';
import 'animate.css';

const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    backgroundImage: `url(${landingBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    color: colors.white,
    padding: '2rem',
    zIndex: 10000
  },
  textContainer: {
    maxWidth: 720,
    minWidth: 720,
    width: 720,
    textAlign: 'justify',
    lineHeight: '22px'
  },
  button: {
    width: 290,
    minHeight: 57,
    maxHeight: 57,
    marginTop: '20px'
  },
  logo: {
    position: 'absolute',
    right: 40,
    top: 44
  },
  header: {
    ...spacing.flexHorizontally,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

const Landing = () => {
  const {isOpenLanding} = useSelector((s: any) => s.dashboard);
  const dispatch = useDispatch();

  const hideLanding = () => dispatch(setOpenLanding(false));

  return (
    <div style={styles.container} className={isOpenLanding ? 'animate__animated animate__fadeIn' : 'animate__animated animate__fadeOut'}>
      <div style={styles.header}>
        <Text variant="landingPageHeader">COMMAND AND CONTROL CENTER</Text>
      </div>
      <img src={logo} style={styles.logo} alt="logo" />
      <div style={styles.textContainer}>
        <Text variant="landingPageInfoText">
          Masdar City is a pioneering sustainable city located in Abu Dhabi, United Arab Emirates. The City is designed to be a global hub
          for the development and commercialization of clean energy and sustainable technologies. As such, sustainability is at the core of
          Masdar City's operations, and the City has implemented a number of initiatives and technologies to reduce its environmental
          footprint and promote sustainability.
          <br />
          <br />
          One key aspect of Masdar City's sustainability efforts is the use of its command and control center's sustainability dashboard.
          This dashboard is a powerful tool that helps the City track and measure its progress towards achieving its sustainability goals,
          including reducing energy and water consumption, minimizing waste, and improving air quality. The dashboard includes a range of
          metrics and targets, as well as real-time data and analytics, to help the City monitor its performance and identify areas for
          improvement.
          <br /> <br />
          Through the use of the command and control center's sustainability dashboard, Masdar City is able to continuously monitor and
          optimize its sustainability efforts, ensuring that it is on track to meet its long-term goals and continue to be a leader in
          sustainable urban development.
        </Text>
        <TextButton text="ENTER" onClick={hideLanding} style={styles.button} />
      </div>
    </div>
  );
};

export default Landing;
