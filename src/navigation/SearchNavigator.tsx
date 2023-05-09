import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useGetTotalNoti} from 'api/notifications';
import {AppScreens, PostDetail, SearchScreen} from 'screens';
import {BellIcon, FinderIcon, MagnifierIcon, Text, Touchable, View} from 'ui';

import {NavigatorKey} from './constants';
import {buildNavigationOptions} from './utils';

const Stack = createStackNavigator();

export type SearchStackParamList = {
  Search: undefined;
};

export const SearchNavigator = () => {
  const {data} = useGetTotalNoti();

  return (
    <Stack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
        gestureEnabled: false,
        animationTypeForReplace: 'pop',
      }}>
      <Stack.Screen
        name={AppScreens.Search}
        component={SearchScreen}
        options={({navigation}) => ({
          ...buildNavigationOptions(navigation, ''),
          headerShown: true,

          headerTitle: () => <FinderIcon />,

          headerLeft: () => {
            return (
              <Touchable
                marginLeft="s"
                onPress={() => navigation.navigate(NavigatorKey.Search)}>
                <MagnifierIcon />
              </Touchable>
            );
          },

          headerRight: () => {
            return (
              <Touchable
                marginRight="s"
                position="relative"
                onPress={() => navigation.navigate(AppScreens.Notification)}>
                <BellIcon />
                <View position="absolute" top={-10} right={-3}>
                  <Text color="red1" fontSize={11} fontWeight="700">
                    {data}
                  </Text>
                </View>
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
