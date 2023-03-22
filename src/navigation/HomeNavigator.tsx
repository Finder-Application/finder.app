import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppScreens, Home} from 'screens';
import {BellIcon, FinderIcon, MagnifierIcon, Touchable} from 'ui';

import {buildNavigationOptions} from './utils';

const Stack = createStackNavigator();

export type HomeStackParamList = {
  Home: undefined;
};

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
          // eslint-disable-next-line react/no-unstable-nested-components
          headerTitle: () => <FinderIcon />,
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => {
            return (
              <Touchable marginLeft="s">
                <MagnifierIcon />
              </Touchable>
            );
          },
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => {
            return (
              <Touchable marginRight="s">
                <BellIcon />
              </Touchable>
            );
          },
        })}
      />
    </Stack.Navigator>
  );
};
