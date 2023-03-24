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
}

export function Input<T extends FieldValues>(props: Props<T>) {
  const {
    label,
    name,
    control,
    rules,
    prefix: PrefixIcon,
    ...inputProps
  } = props;
  const {colors} = useTheme();
  const {field, fieldState} = useController({control, name, rules});
  const [isFocussed, setIsFocussed] = React.useState(false);
  const onBlur = () => setIsFocussed(false);
  const onFocus = () => setIsFocussed(true);

  let borderColor;
  if (fieldState.invalid) {
    borderColor = colors.red;
  } else if (isFocussed) {
    borderColor = colors.secondary;
  } else {
    colors.grey2;
  }

  let labelColor: keyof (typeof BaseTheme)['colors'] = 'black';
  if (fieldState.invalid) {
    labelColor = 'red';
  } else if (isFocussed) {
    labelColor = 'secondary';
  }

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
              borderColor,
            },
          ]}
          autoCapitalize="none"
          onChangeText={field.onChange}
          value={field.value as string}
          onBlur={onBlur}
          onFocus={onFocus}
          {...inputProps}
        />
      </View>
      {fieldState.error && (
        <Text fontSize={12} color="red">
          {fieldState.error.message}
        </Text>
      )}
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
