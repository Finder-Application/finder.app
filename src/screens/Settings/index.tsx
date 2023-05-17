import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Switch} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {useAppStore, useAuth} from 'core';
import {ProfileNavigationProps} from 'navigation/ProfileNavigator';
import {
  AppScreens,
  FEMALE_AVATAR_PLACE_HOLDER,
  MALE_AVATAR_PLACE_HOLDER,
} from 'screens/constants';
import {
  ChevronRightIcon,
  Image,
  LinearGradientView,
  Screen,
  SettingsIcon,
  Text,
  Touchable,
  View,
} from 'ui';
import {formatUserName} from 'utils';
import {shallow} from 'zustand/shallow';

export const Settings = () => {
  const navigation = useNavigation<ProfileNavigationProps>();

  const [currentUser, singOut] = useAuth(
    state => [state.user, state.signOut],
    shallow,
  );
  const setShowLoadingModal = useAppStore(state => state.setShowLoadingModal);

  const userName = formatUserName({
    user: {
      firstName: currentUser?.firstName,
      middleName: currentUser?.middleName,
      lastName: currentUser?.lastName,
    },
  });

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const SettingItem = (
    props: {title: string} & React.ComponentProps<typeof Touchable>,
  ) => {
    const {title} = props;
    return (
      <Touchable
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        {...props}>
        <Text fontSize={18}>{title}</Text>
        <View marginRight="m">
          <ChevronRightIcon />
        </View>
      </Touchable>
    );
  };
  return (
    <>
      <Screen justifyContent="flex-start" alignItems="flex-start">
        <LinearGradientView
          height="40%"
          position="absolute"
          flex={1}
          top={0}
          left={0}
          right={0}
          borderBottomLeftRadius={12}
          borderBottomRightRadius={12}
        />
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}>
          <View
            flexDirection="row"
            alignItems="center"
            marginBottom="l"
            marginTop="xl">
            <SettingsIcon color="black" />
            <Text fontSize={28} fontWeight="700" marginLeft="s">
              Settings
            </Text>
          </View>
          <View
            backgroundColor="white"
            flex={1}
            borderRadius={16}
            shadowOffset={{width: 0, height: 2}}
            shadowRadius={3.84}
            elevation={5}
            shadowOpacity={0.25}
            shadowColor="black">
            <View
              flexDirection="row"
              alignItems="center"
              marginVertical="m"
              marginHorizontal="m">
              <View
                shadowOffset={{width: 5, height: 15}}
                shadowRadius={10}
                elevation={10}
                borderRadius={50}
                shadowOpacity={0.25}
                shadowColor="black">
                <Image
                  height={50}
                  width={50}
                  borderRadius={50}
                  source={{
                    uri: currentUser?.avatar
                      ? currentUser?.avatar
                      : currentUser?.gender === false
                      ? MALE_AVATAR_PLACE_HOLDER
                      : FEMALE_AVATAR_PLACE_HOLDER,
                  }}
                />
              </View>
              <Text fontSize={18} marginLeft="s">
                {userName}
              </Text>
            </View>
            <View height={0.5} width="100%" backgroundColor="grey24" />
            <View paddingVertical="s" paddingHorizontal="l">
              <Text fontSize={18} color="grey25">
                Account Settings
              </Text>
              <SettingItem
                title="Edit profile"
                marginVertical="m"
                onPress={() => navigation.navigate(AppScreens.EditProfile)}
              />
              <SettingItem
                title="Edit Contact"
                marginVertical="m"
                onPress={() => navigation.navigate(AppScreens.EditContact)}
              />
              <SettingItem
                title="Change password"
                marginVertical="m"
                onPress={() => navigation.navigate(AppScreens.ChangePassword)}
              />
              <View
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                marginVertical="m">
                <Text fontSize={18}>Push notifications</Text>
                <Switch onValueChange={toggleSwitch} value={isEnabled} />
              </View>
            </View>
            <View height={0.5} width="100%" backgroundColor="grey24" />

            <View paddingVertical="s" paddingHorizontal="l">
              <Text fontSize={18} color="grey25">
                More
              </Text>
              <SettingItem title="About us" marginVertical="m" />
              <SettingItem title="Privacy policy" marginVertical="m" />
              <SettingItem title="Terms and conditions" marginVertical="m" />
            </View>
          </View>

          <Touchable
            onPress={async () => {
              setShowLoadingModal(true);
              await singOut().finally(() => setShowLoadingModal(false));
            }}>
            <LinearGradientView
              alignItems="center"
              marginTop="l"
              paddingVertical="m"
              borderRadius={8}>
              <Text fontWeight="700">Sign out</Text>
            </LinearGradientView>
          </Touchable>
        </ScrollView>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  scrollViewStyle: {
    width: '100%',
  },
});
