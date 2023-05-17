import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {useAuth} from 'core';
import {
  AppScreens,
  ChangePassword,
  EditContact,
  EditProfile,
  Settings,
} from 'screens';
import {InitAuth} from 'screens/Auth/InitScreen';
import {LinearGradientView} from 'ui';

import {buildNavigationOptions} from './utils';

const Stack = createStackNavigator();

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  EditContact: undefined;
  ChangePassword: undefined;
};

export type ProfileNavigationProps = StackNavigationProp<ProfileStackParamList>;

export const ProfileNavigator = () => {
  const isLoggedIn = useAuth(state => state.isLoggedIn);
  return (
    <Stack.Navigator
      screenOptions={{
        cardOverlayEnabled: false,
        headerShown: false,
        gestureEnabled: false,
        animationTypeForReplace: 'pop',
      }}>
      <Stack.Screen
        name={AppScreens.Profile}
        component={isLoggedIn ? Settings : InitAuth}
      />
      <Stack.Screen
        name={AppScreens.EditProfile}
        component={EditProfile}
        options={({navigation}) => ({
          ...buildNavigationOptions(navigation, ''),
          headerShown: true,
          title: 'Edit Profile',
          headerBackground: () => <LinearGradientView flex={1} />,
        })}
      />
      <Stack.Screen
        name={AppScreens.EditContact}
        component={EditContact}
        options={({navigation}) => ({
          ...buildNavigationOptions(navigation, ''),
          headerShown: true,
          title: 'Edit Contact',
          headerBackground: () => <LinearGradientView flex={1} />,
        })}
      />
      <Stack.Screen
        name={AppScreens.ChangePassword}
        component={ChangePassword}
        options={({navigation}) => ({
          ...buildNavigationOptions(navigation, ''),
          headerShown: true,
          title: 'Change password',
          headerBackground: () => <LinearGradientView flex={1} />,
        })}
      />
    </Stack.Navigator>
  );
};
