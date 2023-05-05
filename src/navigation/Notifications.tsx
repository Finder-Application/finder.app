import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {AppScreens} from 'screens';
import {Notifications} from 'screens/Notifications';

const Stack = createStackNavigator();

export type AddPostStackParamList = {
  AddPost: undefined;
};

export type AddPostStackNavigationProps =
  StackNavigationProp<AddPostStackParamList>;

export const NotificationsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
        gestureEnabled: false,
        animationTypeForReplace: 'pop',
      }}>
      <Stack.Screen name={AppScreens.Notification} component={Notifications} />
    </Stack.Navigator>
  );
};
