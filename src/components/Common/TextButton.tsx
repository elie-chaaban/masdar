import React, {CSSProperties} from 'react';
import {Styles} from '../../types';
import {createStyles} from '../../theme';
import {TextVariant} from '../../typography';
import {Text} from './Text';
import {useSelector} from 'react-redux';
//@ts-ignore
import {selectThemeProperties} from '../../reduxStore/selectors';
const styles: Styles = createStyles(({colors, spacing}) => ({
  container: {
    ...spacing.center,
    width: '100%',
    borderRadius: 14,
    paddingLeft: 23,
    paddingRight: 23,
    paddingTop: 13,
    paddingBottom: 13,
    color: colors.white,
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: colors.textButton
  },
  toggledBackground: {
    backgroundColor: colors.textButtonToggled
  }
}));

export interface TextButtonProps {
  style?: CSSProperties;
  textVariantId?: TextVariant;
  toggled?: boolean;
  text: string;
  onClick: () => void;
}

export const TextButton = ({style, textVariantId, toggled, text, onClick}: TextButtonProps) => {
  const stylingProperties = useSelector(selectThemeProperties) as any;
  const {mobileMode} = useSelector((s: any) => s.styling);
  const toggleBackgroundStyle = toggled ? {...styles.toggledBackground, ...stylingProperties?.toggledButtonsStyle} : {};
  return (
    <div style={{...styles.container, ...style, ...stylingProperties?.buttonsStyle, ...toggleBackgroundStyle}} onClick={onClick}>
      <Text variant={mobileMode ? 'actionLabelNormal' : textVariantId || 'textButton'}>{text}</Text>
    </div>
  );
};
