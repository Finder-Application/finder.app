import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {Post} from 'api/posts/types';
import {AppScreens, Home} from 'screens';
import {PostDetail} from 'screens/PostDetail';
import {BellIcon, FinderIcon, MagnifierIcon, Touchable} from 'ui';

import {buildNavigationOptions} from './utils';

const Stack = createStackNavigator();

export type HomeStackParamList = {
  Home: undefined;
  PostDetail: {
    postData: Post;
  };
};

export type HomeStackNavigationProps = StackNavigationProp<HomeStackParamList>;

export const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
        gestureEnabled: false,
        animationTypeForReplace: 'pop',
      }}>
      <Stack.Screen
        name={AppScreens.Home}
        component={Home}
        options={({navigation}) => ({
          ...buildNavigationOptions(navigation, ''),
          headerShown: true,

          headerTitle: () => <FinderIcon />,

          headerLeft: () => {
            return (
              <Touchable marginLeft="s">
                <MagnifierIcon />
              </Touchable>
            );
          },

          headerRight: () => {
            return (
              <Touchable marginRight="s">
                <BellIcon />
              </Touchable>
            );
          },
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
