import * as React from 'react';
import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useController,
} from 'react-hook-form';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

import {Text} from './Text';
import {useTheme} from './theme';
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
}

export function Input<T extends FieldValues>(props: Props<T>) {
  const {label, name, control, rules, ...inputProps} = props;
  const {colors} = useTheme();
  const {field, fieldState} = useController({control, name, rules});
  const [isFocussed, setIsFocussed] = React.useState(false);
  const onBlur = () => setIsFocussed(false);
  const onFocus = () => setIsFocussed(true);

  const borderColor = fieldState.invalid
    ? colors.red
    : isFocussed
    ? colors.secondary
    : colors.grey2;
  return (
    <View key={`input-${name}`} marginBottom="m">
      {label && (
        <Text
          variant="label"
          color={
            fieldState.invalid ? 'red' : isFocussed ? 'secondary' : 'grey1'
          }>
          {label}
        </Text>
      )}
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
