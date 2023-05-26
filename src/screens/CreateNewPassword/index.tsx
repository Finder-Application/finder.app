import React from 'react';
import {Control, FieldValues, useForm} from 'react-hook-form';
import {ScrollView, StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import {useChangePwPublic} from 'api/auth';
import {AxiosError} from 'axios';
import {useAppStore} from 'core/App';
import {AuthStackNavigationProps} from 'navigation/AuthNavigator';
import {AppScreens, COMMON_ERROR_MESSAGE} from 'screens/constants';
import {
  LinearGradientView,
  Screen,
  SearchInput,
  Text,
  theme,
  Touchable,
  View,
} from 'ui';
import {ChevronLeftIcon} from 'ui/icons/ChevronLeft';
import * as yup from 'yup';

interface FormData {
  password: string;
  confirmPassword: string;
  otpCode: number;
}

const schema = yup.object().shape({
  password: yup.string().required().min(6),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords must match'),
  otpCode: yup.number().required().min(6),
});

const INPUT_HEIGHT = 56;

export const CreateNewPassword = ({
  route,
}: {
  route?: {params: {email: string}};
}) => {
  const navigation = useNavigation<AuthStackNavigationProps>();

  console.log('route: ', JSON.stringify(route));
  const {email} = route?.params ?? {};
  const {handleSubmit, control, getValues} = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const setShowLoadingModal = useAppStore(state => state.setShowLoadingModal);

  const {mutateAsync: changePassword} = useChangePwPublic({});

  const onSubmit = async (_: FormData) => {
    setShowLoadingModal(true);
    await changePassword({
      email: email ?? '',
      password: getValues('password'),
      otp: Number(getValues('otpCode')),
    })
      .then(() => {
        navigation.navigate(AppScreens.PasswordChanged);
        showMessage({message: 'Change password successfully', type: 'success'});
      })
      .catch((err: AxiosError) => {
        console.log('useChangePwPublic error:  ', err);

        const data = err?.response?.data;
        if (err?.response?.data) {
          const {message} = data as any;
          if (typeof message === 'string') {
            showMessage({message: message, type: 'danger'});
          } else {
            showMessage({message: COMMON_ERROR_MESSAGE, type: 'danger'});
          }
        }
      })
      .finally(() => setShowLoadingModal(false));
  };

  return (
    <Screen backgroundColor="white" style={styles.screenContainer}>
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={styles.contentContainer}>
        <View marginTop="xl">
          <Text fontSize={32} fontWeight="700">
            Create new password
          </Text>
          <Text
            fontSize={16}
            fontWeight="500"
            color="grey19"
            marginTop="m"
            marginBottom="xl">
            Your new password must be unique from those previously used.
          </Text>
          <SearchInput
            key={'password'}
            backgroundColor="grey18"
            borderWidth={1}
            borderColor="grey17"
            paddingHorizontal="l"
            inputProps={{
              name: 'password',
              control: control as unknown as Control<FieldValues, any>,
              placeholder: 'Password',
              placeholderTextColor: theme.colors.grey19,
              style: {
                fontSize: 15,
                height: INPUT_HEIGHT,
              },
              secureTextEntry: true,
            }}
          />
          <View marginVertical="s" />
          <SearchInput
            key={'confirmPassword'}
            backgroundColor="grey18"
            borderWidth={1}
            borderColor="grey17"
            paddingHorizontal="l"
            inputProps={{
              name: 'confirmPassword',
              control: control as unknown as Control<FieldValues, any>,
              placeholder: 'Confirm password',
              placeholderTextColor: theme.colors.grey19,
              style: {
                fontSize: 15,
                height: INPUT_HEIGHT,
              },
              secureTextEntry: true,
            }}
          />
          <View marginVertical="s" />
          <SearchInput
            key={'otp'}
            backgroundColor="grey18"
            borderWidth={1}
            borderColor="grey17"
            inputProps={{
              name: 'otpCode',
              control: control as unknown as Control<FieldValues, any>,
              placeholder: 'Enter your OTP code',
              placeholderTextColor: theme.colors.grey19,
              style: {
                fontSize: 15,
                height: INPUT_HEIGHT,
                paddingLeft: theme.spacing.m,
              },
              keyboardType: 'numeric',
            }}
          />
          <Touchable onPress={handleSubmit(onSubmit)} marginTop="xl">
            <LinearGradientView
              alignItems="center"
              paddingVertical="m"
              borderRadius={8}>
              <Text fontWeight="700">Reset Password</Text>
            </LinearGradientView>
          </Touchable>
        </View>
        <Touchable
          backgroundColor="white"
          borderColor="grey17"
          borderRadius={12}
          borderWidth={1}
          paddingVertical="m"
          paddingHorizontal="l"
          position="absolute"
          top={10}
          left={0}
          onPress={() => navigation.goBack()}>
          <ChevronLeftIcon />
        </Touchable>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    paddingBottom: theme.spacing.l,
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: theme.spacing.xl,
  },
});
