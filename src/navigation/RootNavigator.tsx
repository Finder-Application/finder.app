import React, {useEffect} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuth} from 'core';
import useFirebase from 'core/notifications/useFirebase';
import {AddPost, AppScreens, PostDetail, RelevantPosts} from 'screens';

import {AuthNavigator} from './AuthNavigator';
import {NavigatorKey} from './constants';
import {NavigationContainer} from './NavigationContainer';
import {TabNavigator} from './TabNavigator';
import {buildNavigationOptions} from './utils';

const Stack = createStackNavigator();

export const Root = () => {
  const {status} = useAuth();

  useFirebase();

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
      <Stack.Screen name={AppScreens.AddPost} component={AddPost} />
      <Stack.Screen
        name={AppScreens.RelevantPosts}
        component={RelevantPosts}
        options={({navigation}) => ({
          ...buildNavigationOptions(navigation, ''),
          headerShown: true,
          title: 'Relevant Posts',
        })}
      />
      <Stack.Screen
        name={AppScreens.PostDetail}
        component={PostDetail}
        options={({navigation}) => ({
          ...buildNavigationOptions(navigation, ''),
          headerShown: true,
          title: '',
        })}
      />
    </Stack.Navigator>
  );
};

export const RootNavigator = () => (
  <NavigationContainer>
    <Root />
  </NavigationContainer>
);
