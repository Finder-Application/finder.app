import React, {useState} from 'react';
import {Control, FieldValues, useForm} from 'react-hook-form';
import {ScrollView, StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import {useLogin, useLoginGoogle, useRegister} from 'api/auth';
import {AuthErrorResponse} from 'api/auth/types';
import {AxiosError} from 'axios';
import {useAppStore} from 'core/App';
import {signInGoogle} from 'core/Auth';
import {AuthStackNavigationProps} from 'navigation/AuthNavigator';
import {COMMON_ERROR_MESSAGE} from 'screens/constants';
import {
  AppleIcon,
  EyeCloseIcon,
  EyeOpenIcon,
  FaceBookIcon,
  GoogleIcon,
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

interface FormData extends FieldValues {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const loginSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
});

const registerSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const INPUT_HEIGHT = 56;

export const Auth = ({
  route,
}: {
  route?: {
    params: {
      authType: 'login' | 'register';
    };
  };
}) => {
  const navigation = useNavigation<AuthStackNavigationProps>();

  const {
    handleSubmit: handleLoginSubmit,
    control: loginControl,
    getValues: getLoginValues,
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });
  const {
    handleSubmit: handleRegisterSubmit,
    control: registerControl,
    getValues: getRegisterValues,
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
  });

  const loginGoogleMutation = useLoginGoogle();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const setShowLoadingModal = useAppStore(state => state.setShowLoadingModal);

  const [hidePass, setHidePass] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(
    route?.params?.authType === 'login',
  );

  const onSubmit = async (_: FormData) => {
    if (isLoggingIn) {
      await onLogin();
    } else {
      await onRegister();
    }
  };

  const authType = isLoggingIn ? 'Login' : 'Register';

  const onSignInGoogle = async () => {
    try {
      setShowLoadingModal(true);
      const {idToken} = await signInGoogle();

      if (idToken !== null) {
        await loginGoogleMutation
          .mutateAsync({
            idToken: idToken,
          })
          .then(() => {
            navigation.goBack();
          })
          .catch((error: AxiosError<AuthErrorResponse>) => {
            showMessage({
              message: error?.response?.data?.message ?? COMMON_ERROR_MESSAGE,
              type: 'danger',
            });
          })
          .finally(() => setShowLoadingModal(false));
      }
    } catch (error) {
      console.log('Login Google Error: ', JSON.stringify(error));
      setShowLoadingModal(false);
    }
  };

  const onLogin = async () => {
    try {
      setShowLoadingModal(true);
      await loginMutation
        .mutateAsync({
          email: getLoginValues('email'),
          password: getLoginValues('password'),
        })
        .then(() => {
          navigation.goBack();
        })
        .catch((error: AxiosError<AuthErrorResponse>) => {
          showMessage({
            message: error.response?.data?.message ?? COMMON_ERROR_MESSAGE,
            type: 'danger',
          });
        })
        .finally(() => setShowLoadingModal(false));
    } catch (error) {
      console.log('Login Error: ', JSON.stringify(error));
      setShowLoadingModal(false);
    }
  };

  const onRegister = async () => {
    try {
      setShowLoadingModal(true);

      await registerMutation
        .mutateAsync({
          email: getRegisterValues('email'),
          password: getRegisterValues('password'),
          firstName: getRegisterValues('username'),
          lastName: '.',
        })
        .then(() => {
          navigation.goBack();
        })
        .catch((error: AxiosError<AuthErrorResponse>) => {
          showMessage({
            message: error.response?.data?.message ?? COMMON_ERROR_MESSAGE,
            type: 'danger',
          });
        })
        .finally(() => setShowLoadingModal(false));
    } catch (error) {
      console.log('Register Error: ', JSON.stringify(error));
      setShowLoadingModal(false);
    }
  };

  const renderLogInForm = () => {
    return (
      <>
        <SearchInput
          key={`${authType}-email}`}
          backgroundColor="grey18"
          borderWidth={1}
          borderColor="grey17"
          inputProps={{
            name: 'email',
            control: loginControl as unknown as Control<FieldValues, any>,
            placeholder: 'Enter your email',
            placeholderTextColor: theme.colors.grey19,
            style: {
              fontSize: 15,
              height: INPUT_HEIGHT,
              paddingLeft: theme.spacing.m,
            },
          }}
        />
        <View marginVertical="s" />
        <SearchInput
          key={`${authType}-password}`}
          backgroundColor="grey18"
          borderWidth={1}
          borderColor="grey17"
          suffix={
            <Touchable onPress={() => setHidePass(!hidePass)}>
              {hidePass ? <EyeCloseIcon /> : <EyeOpenIcon />}
            </Touchable>
          }
          paddingHorizontal="l"
          inputProps={{
            name: 'password',
            control: loginControl as unknown as Control<FieldValues, any>,
            placeholder: 'Enter your password',
            placeholderTextColor: theme.colors.grey19,
            style: {
              fontSize: 15,
              height: INPUT_HEIGHT,
            },
            secureTextEntry: hidePass,
          }}
        />
        <Touchable marginTop="s" marginBottom="xl">
          <Text fontWeight="600" color="grey20" textAlign="right">
            Forgot Password?
          </Text>
        </Touchable>
      </>
    );
  };

  const renderRegisterForm = () => {
    return (
      <>
        <SearchInput
          key={`${authType}-username}`}
          backgroundColor="grey18"
          borderWidth={1}
          borderColor="grey17"
          inputProps={{
            name: 'username',
            control: registerControl as unknown as Control<FieldValues, any>,
            placeholder: 'Username',
            placeholderTextColor: theme.colors.grey19,
            style: {
              fontSize: 15,
              height: INPUT_HEIGHT,
              paddingLeft: theme.spacing.m,
            },
          }}
        />
        <View marginVertical="s" />
        <SearchInput
          key={`${authType}-email}`}
          backgroundColor="grey18"
          borderWidth={1}
          borderColor="grey17"
          inputProps={{
            name: 'email',
            control: registerControl as unknown as Control<FieldValues, any>,
            placeholder: 'Email',
            placeholderTextColor: theme.colors.grey19,
            style: {
              fontSize: 15,
              height: INPUT_HEIGHT,
              paddingLeft: theme.spacing.m,
            },
          }}
        />
        <View marginVertical="s" />
        <SearchInput
          key={`${authType}-password}`}
          backgroundColor="grey18"
          borderWidth={1}
          borderColor="grey17"
          paddingHorizontal="l"
          inputProps={{
            name: 'password',
            control: registerControl as unknown as Control<FieldValues, any>,
            placeholder: 'Password',
            placeholderTextColor: theme.colors.grey19,
            style: {
              fontSize: 15,
              height: INPUT_HEIGHT,
            },
            secureTextEntry: hidePass,
          }}
        />
        <View marginVertical="s" />
        <SearchInput
          key={`${authType}-confirmPassword}`}
          backgroundColor="grey18"
          borderWidth={1}
          borderColor="grey17"
          paddingHorizontal="l"
          inputProps={{
            name: 'confirmPassword',
            control: registerControl as unknown as Control<FieldValues, any>,
            placeholder: 'Confirm password',
            placeholderTextColor: theme.colors.grey19,
            style: {
              fontSize: 15,
              height: INPUT_HEIGHT,
            },
            secureTextEntry: hidePass,
          }}
        />
        <View marginVertical="s" />
      </>
    );
  };

  return (
    <Screen backgroundColor="white" style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View flex={1} justifyContent="space-between">
          <View />
          <View>
            <Text fontSize={32} fontWeight="700" marginBottom="xl">
              {isLoggingIn
                ? 'Welcome back! We hope you will find your missing one, Asap!'
                : 'Hello! Register to get started'}
            </Text>
            {isLoggingIn ? renderLogInForm() : renderRegisterForm()}
            <Touchable
              onPress={
                isLoggingIn
                  ? handleLoginSubmit(onSubmit)
                  : handleRegisterSubmit(onSubmit)
              }>
              <LinearGradientView
                alignItems="center"
                paddingVertical="m"
                borderRadius={8}>
                <Text fontWeight="700">{authType}</Text>
              </LinearGradientView>
            </Touchable>
            <View flexDirection="row" alignItems="center" marginVertical="l">
              <View flex={1} height={1} borderColor="grey17" borderWidth={1} />
              <Text marginHorizontal="m" color="grey20">
                Or {authType} with
              </Text>
              <View flex={1} height={1} borderColor="grey17" borderWidth={1} />
            </View>
            <View
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <Touchable style={styles.socialButton}>
                <FaceBookIcon />
              </Touchable>
              <Touchable onPress={onSignInGoogle} style={styles.socialButton}>
                <GoogleIcon />
              </Touchable>
              <Touchable style={styles.socialButton}>
                <AppleIcon />
              </Touchable>
            </View>
          </View>
          <View flexDirection="row" alignItems="center" justifyContent="center">
            <Text fontSize={15} color="black2" fontWeight="500">
              {isLoggingIn
                ? 'Don’t have an account?'
                : 'Already have an account?'}
              &nbsp;
            </Text>
            <Touchable onPress={() => setIsLoggingIn(!isLoggingIn)}>
              <Text fontSize={15} color="green5" fontWeight="700">
                {authType === 'Login' ? 'Register' : 'Login'} Now
              </Text>
            </Touchable>
          </View>
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
  socialButton: {
    backgroundColor: 'white',
    borderColor: theme.colors.grey17,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: theme.spacing.m,
    alignItems: 'center',
    width: '32%',
  },
  screenContainer: {
    paddingBottom: theme.spacing.l,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
