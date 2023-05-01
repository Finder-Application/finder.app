import React, {useEffect} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuth} from 'core';

import {AuthNavigator} from './AuthNavigator';
import {NavigatorKey} from './constants';
import {NavigationContainer} from './NavigationContainer';
import {TabNavigator} from './TabNavigator';

const Stack = createStackNavigator();

export const Root = () => {
  const {status} = useAuth();
  useEffect(() => {
    if (status !== 'idle') {
      RNBootSplash.hide({fade: true});
    }
  }, [status]);
  return (
    <Stack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
        gestureEnabled: false,
        animationTypeForReplace: 'pop',
      }}>
      <Stack.Screen name={NavigatorKey.App} component={TabNavigator} />
      <Stack.Screen name={NavigatorKey.Auth} component={AuthNavigator} />
    </Stack.Navigator>
  );
};

export const RootNavigator = () => (
  <NavigationContainer>
    <Root />
  </NavigationContainer>
);
