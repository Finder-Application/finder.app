import React, {forwardRef} from 'react';
import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useController,
} from 'react-hook-form';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

import {Text} from './Text';
import {BaseTheme, useTheme} from './theme';
import {View} from './View';

// types
type TRule = Omit<
  RegisterOptions,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs'
>;

export type RuleType<T> = {[name in keyof T]: TRule};
export type InputControllerType<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  control: Control<T, any>;
  rules?: TRule;
};
interface Props<T extends FieldValues>
  extends TextInputProps,
    InputControllerType<T> {
  disabled?: boolean;
  label?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  labelColor?: keyof (typeof BaseTheme)['colors'];
  borderColor?: keyof (typeof BaseTheme)['colors'];
}

export const Input = forwardRef(
  <T extends FieldValues>(
    props: Props<T>,
    ref: React.Ref<TextInput> | undefined,
  ) => {
    const {
      label,
      name,
      control,
      rules,
      prefix: PrefixIcon,
      suffix: SuffixIcon,
      labelColor,
      borderColor,
      ...inputProps
    } = props;
    const {colors} = useTheme();
    const {field} = useController({control, name, rules});

    return (
      <View key={`input-${name}`} flex={1}>
        {label && (
          <Text variant="label" color={labelColor}>
            {label}
          </Text>
        )}
        <View flexDirection="row" alignItems="center" justifyContent="center">
          {PrefixIcon && <View marginRight="s">{PrefixIcon}</View>}
          <TextInput
            ref={ref}
            placeholderTextColor={colors.grey2}
            style={[
              styles.input,
              {
                borderColor: BaseTheme.colors[borderColor ?? 'secondary'],
              },
            ]}
            autoCapitalize="none"
            onChangeText={field.onChange}
            value={field.value as string}
            {...inputProps}
          />
          {SuffixIcon && <View>{SuffixIcon}</View>}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  input: {
    flex: 1,
    borderBottomWidth: 1,
    marginBottom: 4,
    padding: 2,
    fontSize: 16,
  },
});
