import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthStackNavigationProps} from 'navigation/AuthNavigator';
import {AppScreens} from 'screens/constants';
import {
  BigTickIcon,
  LinearGradientView,
  Screen,
  Text,
  theme,
  Touchable,
  View,
} from 'ui';

export const PasswordChanged = () => {
  const navigation = useNavigation<AuthStackNavigationProps>();

  return (
    <Screen backgroundColor="white" style={styles.screenContainer}>
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={styles.contentContainer}>
        <View justifyContent="center" alignItems="center" width="100%" flex={1}>
          <BigTickIcon />
          <Text fontSize={32} fontWeight="700">
            Password Changed!
          </Text>
          <Text
            fontSize={16}
            fontWeight="500"
            color="grey19"
            marginTop="m"
            marginHorizontal="xl"
            textAlign="center"
            marginBottom="xl">
            Your password has been changed successfully.
          </Text>

          <Touchable
            onPress={() =>
              navigation.navigate('AuthNavigator', {
                screen: AppScreens.Auth,
                params: {authType: 'login'},
              })
            }
            marginTop="xl"
            width="100%">
            <LinearGradientView
              alignItems="center"
              paddingVertical="m"
              borderRadius={8}>
              <Text fontWeight="700">Back to Login</Text>
            </LinearGradientView>
          </Touchable>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    paddingBottom: theme.spacing.l,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
