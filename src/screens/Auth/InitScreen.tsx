import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAppStore} from 'core/App';
import {useAuth} from 'core/Auth';
import {AuthStackNavigationProps} from 'navigation/AuthNavigator';
import {AppScreens} from 'screens/constants';
import {
  FinderIcon,
  LinearGradientView,
  Screen,
  Text,
  Touchable,
  View,
} from 'ui';

export const InitAuth = () => {
  const navigation = useNavigation<AuthStackNavigationProps>();

  const [isLoggedIn, singOut] = useAuth(state => [
    state.isLoggedIn,
    state.signOut,
  ]);
  const setShowLoadingModal = useAppStore(state => state.setShowLoadingModal);

  return (
    <Screen
      justifyContent="space-between"
      backgroundColor="white"
      paddingHorizontal="l">
      <View />
      <View alignItems="center">
        <FinderIcon width={80} height={80} />
        <Text fontWeight="bold" variant="header">
          Finder
        </Text>
      </View>
      <View width="100%">
        {isLoggedIn ? (
          <>
            <Touchable
              onPress={async () => {
                setShowLoadingModal(true);
                await singOut().finally(() => setShowLoadingModal(false));
              }}>
              <LinearGradientView
                alignItems="center"
                paddingVertical="m"
                borderRadius={8}>
                <Text fontWeight="700">Sign out</Text>
              </LinearGradientView>
            </Touchable>
          </>
        ) : (
          <>
            <Touchable
              onPress={() =>
                navigation.navigate('AuthNavigator', {
                  screen: AppScreens.Auth,
                  params: {authType: 'login'},
                })
              }>
              <LinearGradientView
                alignItems="center"
                paddingVertical="m"
                borderRadius={8}>
                <Text fontWeight="700">Login</Text>
              </LinearGradientView>
            </Touchable>
            <Touchable
              marginVertical="m"
              onPress={() =>
                navigation.navigate('AuthNavigator', {
                  screen: AppScreens.Auth,
                  params: {authType: 'register'},
                })
              }>
              <View
                alignItems="center"
                paddingVertical="m"
                borderRadius={8}
                borderWidth={1}
                borderColor="black2">
                <Text fontWeight="700">Register</Text>
              </View>
            </Touchable>
          </>
        )}
        <Text
          fontWeight="700"
          textAlign="center"
          marginTop="xl"
          color="green5"
          textDecorationLine="underline">
          Welcome to Finder!
        </Text>
      </View>
    </Screen>
  );
};
