import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import {signInGoogle, useAuth} from 'core/Auth';
import {AuthStackNavigationProps} from 'navigation/AuthNavigator';
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
import {shallow} from 'zustand/shallow';

type FormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
});

const INPUT_HEIGHT = 56;

export const Auth = () => {
  const navigation = useNavigation<AuthStackNavigationProps>();
  const [signIn] = useAuth(state => [state.signIn], shallow);
  const {handleSubmit, control} = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [hidePass, setHidePass] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const onSubmit = (data: FormData) => {
    console.log(data);
    signIn({access: 'access-token', refresh: 'refresh-token'});
  };

  const authType = isLoggingIn ? 'Login' : 'Register';

  const onSignInGoogle = async () => {
    try {
      const {idToken, user} = await signInGoogle();
      console.log('user: ', user);
      console.log('idToken: ', idToken);

      if (idToken !== null) {
        signIn({access: idToken, refresh: idToken});
      }
    } catch (error) {
      console.log('Login Error: ', JSON.stringify(error));
    }
  };

  const renderLogInForm = () => {
    return (
      <>
        <SearchInput
          backgroundColor="grey18"
          borderWidth={1}
          borderColor="grey17"
          marginBottom="m"
          inputProps={{
            name: 'email',
            control,
            placeholder: 'Enter your email',
            placeholderTextColor: theme.colors.grey19,
            style: {
              fontSize: 15,
              height: INPUT_HEIGHT,
              paddingLeft: theme.spacing.m,
            },
          }}
        />
        <SearchInput
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
            control,
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
          backgroundColor="grey18"
          borderWidth={1}
          borderColor="grey17"
          inputProps={{
            name: 'username',
            control,
            placeholder: 'Username',
            placeholderTextColor: theme.colors.grey19,
            style: {
              fontSize: 15,
              height: INPUT_HEIGHT,
              paddingLeft: theme.spacing.m,
            },
          }}
        />
        <SearchInput
          backgroundColor="grey18"
          borderWidth={1}
          borderColor="grey17"
          marginVertical="m"
          inputProps={{
            name: 'email',
            control,
            placeholder: 'Email',
            placeholderTextColor: theme.colors.grey19,
            style: {
              fontSize: 15,
              height: INPUT_HEIGHT,
              paddingLeft: theme.spacing.m,
            },
          }}
        />
        <SearchInput
          backgroundColor="grey18"
          borderWidth={1}
          borderColor="grey17"
          paddingHorizontal="l"
          inputProps={{
            name: 'password',
            control,
            placeholder: 'Password',
            placeholderTextColor: theme.colors.grey19,
            style: {
              fontSize: 15,
              height: INPUT_HEIGHT,
            },
            secureTextEntry: hidePass,
          }}
        />
        <SearchInput
          backgroundColor="grey18"
          borderWidth={1}
          borderColor="grey17"
          paddingHorizontal="l"
          marginVertical="m"
          inputProps={{
            name: 'confirmPassword',
            control,
            placeholder: 'Confirm password',
            placeholderTextColor: theme.colors.grey19,
            style: {
              fontSize: 15,
              height: INPUT_HEIGHT,
            },
            secureTextEntry: hidePass,
          }}
        />
      </>
    );
  };
  return (
    <Screen backgroundColor="white" style={styles.screenContainer}>
      <View flex={1} justifyContent="space-between">
        <View />
        <View>
          <Text fontSize={32} fontWeight="700" marginBottom="xl">
            {isLoggingIn
              ? 'Welcome back! We hope you will find your missing one, Asap!'
              : 'Hello! Register to get started'}
          </Text>
          {isLoggingIn ? renderLogInForm() : renderRegisterForm()}
          <Touchable>
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
              {authType} Now
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
        left={10}
        onPress={() => navigation.goBack()}>
        <ChevronLeftIcon />
      </Touchable>
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
});
