import * as React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {AppScreens, Auth} from 'screens';

export type AuthStackParamList = {
  AuthNavigator: undefined;
  Auth: undefined;
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
    </Stack.Navigator>
  );
};
