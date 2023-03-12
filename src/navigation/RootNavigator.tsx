import React, {useEffect} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuth} from 'core';

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
      <Stack.Screen name="App" component={TabNavigator} />
    </Stack.Navigator>
  );
};

export const RootNavigator = () => (
  <NavigationContainer>
    <Root />
  </NavigationContainer>
);
