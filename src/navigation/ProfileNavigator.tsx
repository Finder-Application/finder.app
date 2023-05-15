import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuth} from 'core';
import {AppScreens, Settings} from 'screens';
import {InitAuth} from 'screens/Auth/InitScreen';

const Stack = createStackNavigator();

export type ProfileStackParamList = {
  Profile: undefined;
};

export const ProfileNavigator = () => {
  const isLoggedIn = useAuth(state => state.isLoggedIn);
  return (
    <Stack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
        gestureEnabled: false,
        animationTypeForReplace: 'pop',
      }}>
      <Stack.Screen
        name={AppScreens.Profile}
        component={isLoggedIn ? Settings : InitAuth}
      />
    </Stack.Navigator>
  );
};
