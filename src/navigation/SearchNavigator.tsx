import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppScreens} from 'screens';
import {View} from 'ui';

const Stack = createStackNavigator();

export type SearchStackParamList = {
  Search: undefined;
};

export const SearchNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
        gestureEnabled: false,
        animationTypeForReplace: 'pop',
      }}>
      <Stack.Screen name={AppScreens.Search} component={View} />
    </Stack.Navigator>
  );
};
