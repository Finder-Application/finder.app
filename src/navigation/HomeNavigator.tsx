import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {useGetTotalNoti} from 'api/notifications';
import {Post} from 'api/posts/types';
import {AppScreens, Home} from 'screens';
import {Notifications} from 'screens/Notifications';
import {PostDetail} from 'screens/PostDetail';
import {BellIcon, FinderIcon, MagnifierIcon, Text, Touchable, View} from 'ui';

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
              <Touchable
                marginRight="s"
                position={'relative'}
                onPress={() => navigation.navigate(AppScreens.Notification)}>
                <BellIcon />
                <View position={'absolute'} top={-10} right={-3}>
                  <Text color={'red1'} fontSize={11} fontWeight={'700'}>
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
      <Stack.Screen name={AppScreens.Notification} component={Notifications} />
    </Stack.Navigator>
  );
};
