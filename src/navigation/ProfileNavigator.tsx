import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppScreens} from 'screens';
import {View} from 'ui';

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
      <Stack.Screen name={AppScreens.Profile} component={View} />
    </Stack.Navigator>
  );
};
