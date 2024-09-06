import {CSSProperties} from 'react';

type FontType = 'MontserratRegular' | 'MontserratBold' | 'MontserratSemiBold';

interface Font extends CSSProperties {}

const fonts: {[key in FontType]: Font} = {
  MontserratRegular: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: 400
  },
  MontserratSemiBold: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: 600
  },
  MontserratBold: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: 700
  }
};

type TextVariantType =
  | 'miniLabel'
  | 'miniSemiBoldFootLabel'
  | 'normal'
  | 'optionLabel'
  | 'actionLabel'
  | 'actionLabelNormal'
  | 'actionLabelBold'
  | 'actionLabelBoldMobileUI'
  | 'textLink'
  | 'header'
  | 'iconLabel'
  | 'largeNumericValue'
  | 'footNote'
  | 'footNoteBold'
  | 'cardHeader'
  | 'miniHeader'
  | 'boldNumericValue'
  | 'extraBoldNumericValue'
  | 'largeSemiBoldNumericValue'
  | 'miniFootLabel'
  | 'textButton'
  | 'boldCardHeader'
  | 'extraLargeNumericValue'
  | 'landingPageHeader'
  | 'landingPageInfoText'
  | 'moduleSwitcherTitle'
  | 'securityCardCaption'
  | 'miniLabelSemiBold'
  | 'actionSliderTitle';

export interface TextVariantItem {
  name: TextVariantType;
  style: CSSProperties;
}

export const textVariants: {[key in TextVariantType]: TextVariantItem} = {
  miniFootLabel: {
    name: 'miniFootLabel',
    style: {
      ...fonts.MontserratRegular,
      fontSize: 8
    }
  },
  miniSemiBoldFootLabel: {
    name: 'miniSemiBoldFootLabel',
    style: {
      ...fonts.MontserratSemiBold,
      fontSize: 8
    }
  },
  miniLabel: {
    name: 'miniLabel',
    style: {
      ...fonts.MontserratRegular,
      fontSize: 9
    }
  },
  miniLabelSemiBold: {
    name: 'miniLabelSemiBold',
    style: {
      ...fonts.MontserratSemiBold,
      fontSize: 9
    }
  },
  footNote: {
    name: 'footNote',
    style: {
      ...fonts.MontserratRegular,
      fontSize: 10
    }
  },
  footNoteBold: {
    name: 'footNoteBold',
    style: {
      ...fonts.MontserratBold,
      fontSize: 10
    }
  },
  miniHeader: {
    name: 'miniHeader',
    style: {
      ...fonts.MontserratSemiBold,
      fontSize: 10
    }
  },
  actionLabelNormal: {
    name: 'actionLabelNormal',
    style: {
      ...fonts.MontserratRegular,
      fontSize: 12
    }
  },
  actionLabel: {
    name: 'actionLabel',
    style: {
      ...fonts.MontserratSemiBold,
      fontSize: 12
    }
  },
  actionLabelBold: {
    name: 'actionLabelBold',
    style: {
      ...fonts.MontserratBold,
      fontSize: 12
    }
  },
  actionLabelBoldMobileUI: {
    name: 'actionLabelBold',
    style: {
      ...fonts.MontserratBold,
      fontSize: 11
    }
  },
  normal: {
    name: 'normal',
    style: {
      ...fonts.MontserratRegular,
      fontSize: 14
    }
  },
  optionLabel: {
    name: 'optionLabel',
    style: {
      ...fonts.MontserratSemiBold,
      fontSize: 14
    }
  },
  textLink: {
    name: 'textLink',
    style: {
      ...fonts.MontserratBold,
      fontSize: 14
    }
  },
  textButton: {
    name: 'textButton',
    style: {
      ...fonts.MontserratRegular,
      fontSize: 16
    }
  },
  iconLabel: {
    name: 'iconLabel',
    style: {
      ...fonts.MontserratBold,
      fontSize: 16
    }
  },
  boldCardHeader: {
    name: 'boldCardHeader',
    style: {
      ...fonts.MontserratBold,
      fontSize: 18
    }
  },
  cardHeader: {
    name: 'cardHeader',
    style: {
      ...fonts.MontserratSemiBold,
      fontSize: 16
    }
  },
  boldNumericValue: {
    name: 'boldNumericValue',
    style: {
      ...fonts.MontserratBold,
      fontSize: 20
    }
  },
  extraBoldNumericValue: {
    name: 'extraBoldNumericValue',
    style: {
      ...fonts.MontserratBold,
      fontSize: 22
    }
  },
  largeSemiBoldNumericValue: {
    name: 'largeSemiBoldNumericValue',
    style: {
      ...fonts.MontserratSemiBold,
      fontSize: 24
    }
  },
  header: {
    name: 'header',
    style: {
      ...fonts.MontserratBold,
      fontSize: 24
    }
  },
  largeNumericValue: {
    name: 'largeNumericValue',
    style: {
      ...fonts.MontserratBold,
      fontSize: 32
    }
  },
  extraLargeNumericValue: {
    name: 'extraLargeNumericValue',
    style: {
      ...fonts.MontserratBold,
      fontSize: 40
    }
  },
  landingPageHeader: {
    name: 'landingPageHeader',
    style: {
      ...fonts.MontserratBold,
      fontSize: 39
    }
  },
  landingPageInfoText: {
    name: 'landingPageInfoText',
    style: {
      ...fonts.MontserratRegular,
      letterSpacing: '0.23px',
      fontWeight: 500,
      fontSize: 20
    }
  },
  moduleSwitcherTitle: {
    name: 'moduleSwitcherTitle',
    style: {
      ...fonts.MontserratRegular,
      letterSpacing: '0.23px',
      fontWeight: 700,
      fontSize: 16
    }
  },
  securityCardCaption: {
    name: 'securityCardCaption',
    style: {
      ...fonts.MontserratSemiBold,
      letterSpacing: '0.23px',
      fontWeight: 500,
      fontSize: 16
    }
  },
  actionSliderTitle: {
    name: 'actionSliderTitle',
    style: {
      ...fonts.MontserratBold,
      letterSpacing: '0.23px',
      fontWeight: 500,
      fontSize: 16
    }
  }
};

export type TextVariant = keyof typeof textVariants;
