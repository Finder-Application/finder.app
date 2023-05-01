import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppScreens} from 'screens';
import {InitAuth} from 'screens/Auth/InitScreen';

const Stack = createStackNavigator();

export type ProfileStackParamList = {
  Profile: undefined;
};

export const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
        gestureEnabled: false,
        animationTypeForReplace: 'pop',
      }}>
      <Stack.Screen name={AppScreens.Profile} component={InitAuth} />
    </Stack.Navigator>
  );
};
