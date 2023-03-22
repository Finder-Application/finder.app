import React from 'react';
import {StyleSheet} from 'react-native';
import {BlurView as RNBlurView} from '@react-native-community/blur';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  ActiveHeartIcon,
  ActiveHomeIcon,
  ActiveProfileIcon,
  ActiveSearchIcon,
  HeartIcon,
  HomeIcon,
  ProfileIcon,
  RoundedPlusIcon,
  SearchIcon,
  View,
} from 'ui';

import {AddPostNavigator} from './AddPostNavigator';
import {NavigatorKey} from './constants';
import {HomeNavigator} from './HomeNavigator';
import {ProfileNavigator} from './ProfileNavigator';
import {SearchNavigator} from './SearchNavigator';
import {YourPostNavigator} from './YourPostNavigator';
const Tab = createBottomTabNavigator();

const TAB_HEIGHT = 60;
const getRouteIcon = (routeName: string, isActive: boolean): JSX.Element => {
  let Icon = HomeIcon;
  switch (routeName) {
    case NavigatorKey.Home:
      Icon = isActive ? ActiveHomeIcon : HomeIcon;
      break;
    case NavigatorKey.Search:
      Icon = isActive ? ActiveSearchIcon : SearchIcon;
      break;
    case NavigatorKey.AddPost:
      Icon = RoundedPlusIcon;
      break;
    case NavigatorKey.YourPost:
      Icon = isActive ? ActiveHeartIcon : HeartIcon;
      break;
    case NavigatorKey.Profile:
      Icon = isActive ? ActiveProfileIcon : ProfileIcon;
      break;
  }

  return (
    <View justifyContent={'center'} alignItems={'center'}>
      <Icon />
    </View>
  );
};

const BlurView = () => {
  return (
    <RNBlurView
      blurType="light"
      blurAmount={32}
      reducedTransparencyFallbackColor="white"
      style={styles.tabBarBackground}
    />
  );
};
export const TabNavigator = () => {
  const renderTabBarBackground = () => {
    return <BlurView />;
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => getRouteIcon(route.name, focused),
        headerShown: false,
        tabBarShowLabel: false,
        tabBarBackground: renderTabBarBackground,
        tabBarStyle: {
          minHeight: TAB_HEIGHT,

          position: 'absolute',
        },
      })}>
      <Tab.Screen name={NavigatorKey.Home} component={HomeNavigator} />
      <Tab.Screen name={NavigatorKey.Search} component={SearchNavigator} />
      <Tab.Screen name={NavigatorKey.AddPost} component={AddPostNavigator} />
      <Tab.Screen name={NavigatorKey.YourPost} component={YourPostNavigator} />
      <Tab.Screen name={NavigatorKey.Profile} component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarBackground: {
    height: '100%',
  },
});
