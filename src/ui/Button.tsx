// @ts-nocheck
import React from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {
  backgroundColor,
  BackgroundColorProps,
  border,
  BorderProps,
  composeRestyleFunctions,
  createRestyleComponent,
  createVariant,
  spacing,
  SpacingProps,
  useRestyle,
  VariantProps,
} from '@shopify/restyle';

import {Text} from './Text';
import {Theme} from './theme';
import {View} from './View';

const buttonVariant = createVariant({themeKey: 'buttonVariants'});
const ButtonContainer = createRestyleComponent<
  VariantProps<Theme, 'buttonVariants'> & React.ComponentProps<typeof View>,
  Theme
>([buttonVariant], View);

const restyleFunctions = composeRestyleFunctions([
  buttonVariant as any,
  spacing,
  border,
  backgroundColor,
]);

type Props = SpacingProps<Theme> &
  VariantProps<Theme, 'buttonVariants'> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  LayoutProps<Theme> & {
    onPress: () => void;
    label?: string | React.ReactNode;
    outline?: boolean;
    loading?: boolean;
  };

export const Button = ({
  onPress,
  label,
  loading = false,
  variant = 'primary',
  ...rest
}: Props) => {
  const props = useRestyle(restyleFunctions, {...rest, variant});
  const textVariant = 'button_' + variant;

  return (
    <TouchableOpacity onPress={onPress}>
      <ButtonContainer
        borderRadius={44}
        flexDirection="row"
        paddingVertical="m"
        paddingHorizontal="xl"
        marginVertical="s"
        justifyContent="center"
        {...props}>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : typeof label === 'string' ? (
          <Text variant={textVariant as Partial<keyof Theme['textVariants']>}>
            {label}
          </Text>
        ) : (
          <View>{label}</View>
        )}
      </ButtonContainer>
    </TouchableOpacity>
  );
};
