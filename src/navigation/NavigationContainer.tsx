import * as React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer as RNNavigationContainer} from '@react-navigation/native';
import {useTheme} from '@shopify/restyle';
import {LoadingModal, Theme} from 'ui';

export const NavigationContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {navigation} = useTheme<Theme>();

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={navigation.dark ? 'light-content' : 'dark-content'}
        backgroundColor={navigation.colors.background}
      />
      <RNNavigationContainer theme={navigation}>
        {children}
      </RNNavigationContainer>
      <LoadingModal />
    </SafeAreaProvider>
  );
};
