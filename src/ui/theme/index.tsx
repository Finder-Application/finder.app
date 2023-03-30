import * as React from 'react';
// import { createTheme, BaseTheme } from '@shopify/restyle';
import {
  BoxProps,
  TextProps,
  ThemeProvider as ReThemeProvider,
  useTheme as useRTheme,
} from '@shopify/restyle';

type BaseThemeType = typeof BaseTheme & {
  textVariants: {[key: string]: TextProps<typeof BaseTheme>};
  navigation: any;
  buttonVariants: {[key: string]: BoxProps<typeof BaseTheme>};
};

const createTheme = <T extends BaseThemeType>(themeObject: T): T => themeObject;

export const BaseTheme = {
  colors: {
    text: '#202124',
    background: '#F4F1F1',
    primary: '#151522',
    secondary: '#9c27b0',
    muted: '#f1f3f4',

    // from figma file

    black: '#151522',
    blackOpacity46: 'rgba(0, 0, 0, 0.46)',
    black1: '#14171A',
    grey1: '#333333',
    grey2: '#666666',
    grey3: '#C3C3C3',
    grey4: '#E4E4E4',
    grey5: '#676767',
    grey6: 'rgba(139, 138, 148, 1)',
    grey6Opacity5: 'rgba(139, 138, 148, 0.05)',
    grey6Opacity60: 'rgba(139, 138, 148, 60)',
    grey7: '#657786',
    grey8: '#D9D9D9',
    grey9: '#444444',
    white: 'white',
    red: '#EB5757',
    blue: '#7CDFFF',
    green: '#92FE9E',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
};

export const theme = createTheme({
  ...BaseTheme,
  // TODO : Not sure if this the best way to handel navigation theme
  navigation: {
    dark: false,
    colors: {
      primary: 'rgb(0, 122, 255)',
      background: '#f8f8fa',
      card: '#f8f8fa',
      text: '#0c1245',
      border: 'rgb(199, 199, 204)',
      notification: 'red',
    },
  },
  buttonVariants: {
    defaults: {},
    primary: {
      backgroundColor: 'primary',
    },
    secondary: {
      backgroundColor: 'secondary',
    },
    outline: {
      backgroundColor: 'white',
      borderColor: 'primary',
      borderWidth: 1,
    },
  },
  textVariants: {
    defaults: {
      fontFamily: 'Roboto',
      fontSize: 14,
      color: 'black',
      fontWeight: '400',
    },
    header: {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontSize: 22,
      lineHeight: 42.5,
      color: 'black',
    },
    title: {
      fontFamily: 'Roboto',
      fontSize: 17,
      fontWeight: '500',
      color: 'black',
    },
    subheader: {
      fontFamily: 'Roboto',
      fontWeight: '600',
      fontSize: 28,
      lineHeight: 36,
      color: 'grey1',
    },
    body: {
      fontFamily: 'Roboto',
      fontSize: 15,
      lineHeight: 24,
      color: 'grey2',
    },
    button_primary: {
      fontFamily: 'Roboto',
      fontSize: 16,
      lineHeight: 22,
      color: 'white',
    },
    button_secondary: {
      fontFamily: 'Roboto',
      fontSize: 16,
      lineHeight: 22,
      color: 'white',
    },
    button_outline: {
      fontFamily: 'Roboto',
      fontSize: 16,
      lineHeight: 22,
      color: 'text',
    },
    label: {
      fontFamily: 'Roboto',
      fontSize: 13,
      lineHeight: 18,
      color: 'grey2',
      paddingVertical: 's',
    },
  },
});

export type Theme = typeof theme;

export const ThemeProvider = ({children}: {children: React.ReactNode}) => (
  <ReThemeProvider theme={theme}>{children}</ReThemeProvider>
);

export const useTheme = () => useRTheme<Theme>();
