import LinearGradient from 'react-native-linear-gradient';
import {createBox} from '@shopify/restyle';

import {Theme, theme} from './theme';

const RNLinearGradientView = createBox<
  Theme,
  React.ComponentProps<typeof LinearGradient> & {children?: React.ReactNode}
>(LinearGradient);

import React from 'react';

type LinearGradientViewProps = {
  children?: React.ReactNode;
  colors?: (string | number)[];
};
export const LinearGradientView = (
  props: Omit<React.ComponentProps<typeof RNLinearGradientView>, 'colors'> &
    LinearGradientViewProps,
) => {
  const {
    children,
    colors = [theme.colors.blue, theme.colors.green],
    ...rest
  } = props;
  return (
    <RNLinearGradientView colors={colors} useAngle={true} angle={270} {...rest}>
      {children}
    </RNLinearGradientView>
  );
};
