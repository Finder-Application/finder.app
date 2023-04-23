import React from 'react';
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
export type InputControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: TRule;
};

interface Props<T extends FieldValues>
  extends TextInputProps,
    InputControllerType<T> {
  disabled?: boolean;
  label?: string;
  prefix?: React.ReactNode;
  labelColor?: keyof (typeof BaseTheme)['colors'];
  borderColor?: keyof (typeof BaseTheme)['colors'];
}

export function Input<T extends FieldValues>(props: Props<T>) {
  const {
    label,
    name,
    control,
    rules,
    prefix: PrefixIcon,
    labelColor,
    borderColor,
    ...inputProps
  } = props;
  const {colors} = useTheme();
  const {field} = useController({control, name, rules});

  return (
    <View key={`input-${name}`}>
      {label && (
        <Text variant="label" color={labelColor}>
          {label}
        </Text>
      )}
      <View flexDirection="row" alignItems="center" justifyContent="center">
        {PrefixIcon && <View marginRight="s">{PrefixIcon}</View>}
        <TextInput
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#F3F3F3',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 4,
    padding: 2,
    fontSize: 16,
  },
});
