import * as React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  AppScreens,
  Auth,
  CreateNewPassword,
  ForgotPassword,
  PasswordChanged,
} from 'screens';

export type AuthStackParamList = {
  AuthNavigator: {
    screen: AppScreens.Auth;
    params: {
      authType: 'login' | 'register';
    };
  };
  Auth: undefined;
  ForgotPassword: undefined;
  CreateNewPassword: {
    email: string;
  };
  PasswordChanged: undefined;
};

const Stack = createStackNavigator();

export type AuthStackNavigationProps = StackNavigationProp<AuthStackParamList>;

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
        gestureEnabled: false,
        animationTypeForReplace: 'pop',
      }}>
      <Stack.Screen name={AppScreens.Auth} component={Auth} />
      <Stack.Screen
        name={AppScreens.ForgotPassword}
        component={ForgotPassword}
      />
      <Stack.Screen
        name={AppScreens.CreateNewPassword}
        component={CreateNewPassword}
      />
      <Stack.Screen
        name={AppScreens.PasswordChanged}
        component={PasswordChanged}
      />
    </Stack.Navigator>
  );
};
