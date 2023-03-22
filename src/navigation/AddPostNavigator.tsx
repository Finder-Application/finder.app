import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppScreens} from 'screens';
import {View} from 'ui';

const Stack = createStackNavigator();

export type AddPostStackParamList = {
  AddPost: undefined;
};

export const AddPostNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
        gestureEnabled: false,
        animationTypeForReplace: 'pop',
      }}>
      <Stack.Screen name={AppScreens.AddPost} component={View} />
    </Stack.Navigator>
  );
};
