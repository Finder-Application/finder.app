import * as React from 'react';
import {SvgProps} from 'react-native-svg';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, Style} from 'screens';
import {Home as HomeIcon, Settings} from 'ui';
const Tab = createBottomTabNavigator();

const getRouteIcon = (
  routeName: string,
): (({color, ...props}: SvgProps) => JSX.Element) => {
  let Icon = HomeIcon;
  switch (routeName) {
    case 'Home':
      Icon = HomeIcon;
      break;
    case 'Style':
      Icon = Settings;
      break;
  }

  return Icon;
};

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => {
          const Icon = getRouteIcon(route.name);
          return <Icon color={color} />;
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#b3b3b3',
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Style" component={Style} />
    </Tab.Navigator>
  );
};
