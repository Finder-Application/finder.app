import React from 'react';
import {FieldValues} from 'react-hook-form';
import {StyleSheet, TextInputProps} from 'react-native';
import {Input, InputControllerType, View} from 'ui';

interface SearchInputProps<T extends FieldValues> {
  inputProps: TextInputProps & InputControllerType<T>;
  disabled?: boolean;
  label?: string;
  prefix?: React.ReactNode;
}

export function SearchInput<T extends FieldValues>(
  props: React.ComponentProps<typeof View> & SearchInputProps<T>,
) {
  const {disabled, label, prefix, inputProps} = props;

  return (
    <View
      borderWidth={1}
      borderRadius={10}
      justifyContent="flex-start"
      flexDirection="row"
      alignItems="center"
      padding="xs"
      {...props}>
      <Input
        disabled={disabled}
        label={label}
        prefix={prefix}
        {...inputProps}
        style={[styles.input, inputProps.style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    // Android adds some default padding on top and bottom
    // so we reset them by adding paddingVertical: 0
    paddingVertical: 0,
  },
});
