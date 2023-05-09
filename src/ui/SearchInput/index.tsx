import React, {forwardRef} from 'react';
import {Control, FieldValues, useController} from 'react-hook-form';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import {BaseTheme, Input, InputControllerType, Text, View} from 'ui';

interface SearchInputProps<T extends FieldValues> {
  inputProps: TextInputProps & InputControllerType<T>;
  disabled?: boolean;
  label?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const SearchInput = forwardRef(
  <T extends FieldValues>(
    props: React.ComponentProps<typeof View> & SearchInputProps<T>,
    ref: React.Ref<TextInput> | undefined,
  ) => {
    const {disabled, label, prefix, suffix, inputProps} = props;

    const {name, control, rules, ...rest} = inputProps;

    const {fieldState} = useController({control, name, rules});

    const [isFocussed, setIsFocussed] = React.useState(false);
    const onBlur = () => setIsFocussed(false);
    const onFocus = () => setIsFocussed(true);

    let borderColor: keyof (typeof BaseTheme)['colors'];
    if (fieldState.invalid) {
      borderColor = 'red';
    } else if (isFocussed) {
      borderColor = 'black';
    } else {
      borderColor =
        (props.borderColor as keyof (typeof BaseTheme)['colors']) ?? 'white2';
    }

    let labelColor: keyof (typeof BaseTheme)['colors'] = 'black';
    if (fieldState.invalid) {
      labelColor = 'red';
    } else if (isFocussed) {
      labelColor = 'secondary';
    }

    return (
      <View
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center">
        <View
          borderWidth={1}
          borderRadius={10}
          justifyContent="flex-start"
          flexDirection="row"
          alignItems="center"
          padding="xs"
          margin={props.margin}
          marginHorizontal={props.marginHorizontal}
          marginVertical={props.marginVertical}
          {...props}
          borderColor={borderColor}>
          <Input
            ref={ref}
            name={name}
            control={control as Control<FieldValues, any>}
            rules={rules}
            disabled={disabled}
            label={label}
            prefix={prefix}
            suffix={suffix}
            {...rest}
            style={[styles.input, inputProps.style]}
            onBlur={onBlur}
            onFocus={onFocus}
            labelColor={labelColor}
            borderColor={borderColor}
          />
        </View>
        {fieldState.error && (
          <View
            flexDirection="row"
            margin={props.margin}
            marginHorizontal={props.marginHorizontal}
            marginVertical={props.marginVertical}>
            <Text fontSize={12} color="red">
              {fieldState.error.message}
            </Text>
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  input: {
    width: '100%',
    // Android adds some default padding on top and bottom
    // so we reset them by adding paddingVertical: 0
    paddingVertical: 0,
  },
});
