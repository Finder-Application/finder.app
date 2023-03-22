import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import {HeaderBackButton, theme, View} from 'ui';

import {RootStackParamList} from './types';

export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
  const enabledRef = React.useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      if (enabledRef.current) {
        refetch();
      } else {
        enabledRef.current = true;
      }
    }, [refetch]),
  );
}

export function buildNavigationOptions(
  navigation: StackNavigationProp<RootStackParamList>,
  previousScreenTitle?: string,
): StackNavigationOptions {
  const onGoBack = () => {
    navigation.goBack();
  };

  return {
    headerStyle: {
      backgroundColor: theme.colors.white,
    },
    headerTitleStyle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.black,
    },
    headerTitleAlign: 'center',
    headerShadowVisible: false,
    headerLeft: () => {
      return (
        <HeaderBackButton onPress={onGoBack} title={previousScreenTitle} />
      );
    },
    headerRight: () => <View />,
  };
}
