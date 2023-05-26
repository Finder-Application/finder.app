import {useCallback, useEffect, useState} from 'react';
import {Linking, Platform} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import {useCreateInstallation, useSeenNoti} from 'api/notifications';
import {useAuth} from 'core/Auth';
import {setFcm} from 'core/Auth/utils';
import {RootStackNavigationProps} from 'navigation/types';
import {AppScreens} from 'screens';

import {useAppState} from './useAppState';

let RETRY_COUNT = 0;

const useFirebase = () => {
  const authToken = useAuth(state => state.token);

  const seenNoti = useSeenNoti();

  const accessToken =
    authToken && authToken?.access ? `Bearer ${authToken.access}` : '';

  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const createInstallation = useCreateInstallation();

  const registerDevice = async () => {
    if (Platform.OS === 'ios') {
      try {
        if (!messaging().isDeviceRegisteredForRemoteMessages) {
          await messaging().registerDeviceForRemoteMessages();
        }
      } catch (error) {}
    }
  };

  const getToken = useCallback(async () => {
    if (accessToken) {
      try {
        const fcmToken = await messaging().getToken();

        if (fcmToken) {
          setFcm(fcmToken);

          setIsEnabled(true);

          console.log('fcmToken', fcmToken);

          await createInstallation.mutateAsync({token: fcmToken});
        }
      } catch (error) {
        RETRY_COUNT = RETRY_COUNT + 1;
        if (RETRY_COUNT < 3) {
          setTimeout(() => {
            getToken();
          }, 2000);
        }
        return;
      }
    }
  }, [accessToken]);

  const deleteToken = async () => {
    console.log('deleteToken');
    setIsEnabled(false);
    await messaging().deleteToken();
    await messaging().unregisterDeviceForRemoteMessages();
    setFcm('');
  };

  const requestUserPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        getToken();
      } else {
        deleteToken();
      }
    } else {
      deleteToken();
    }
  }, [getToken]);

  const checkUserPermission = useCallback(async () => {
    const authStatus = await messaging().hasPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      requestUserPermission();
    } else {
      getToken();
    }
  }, [getToken, requestUserPermission]);

  // in app
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      showMessage({
        message: remoteMessage.notification?.title || 'Notification',
        description: remoteMessage.notification?.body || '',
        type: 'info',
        duration: 3000,
      });
    });

    return unsubscribe;
  }, []);

  const navigation = useNavigation<RootStackNavigationProps>();

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage.data?.postId) {
        seenNoti.mutate({
          id: +remoteMessage.data.postId,
          type: remoteMessage.data.type,
        });
        navigation.navigate(AppScreens.PostDetail, {
          postData: {
            id: +remoteMessage.data.postId,
          },
        });
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          if (remoteMessage.data?.postId) {
            seenNoti.mutate({
              id: +remoteMessage.data.postId,
              type: remoteMessage.data.type,
            });
            navigation.navigate(AppScreens.PostDetail, {
              postData: {
                id: +remoteMessage.data.postId,
              },
            });
          }
        }
      });
  }, []);

  useEffect(() => {
    if (accessToken) {
      registerDevice();
      checkUserPermission();
    }
  }, [checkUserPermission, accessToken]);

  const toggleNotificationSetting = () => {
    Linking.openSettings();
  };

  useAppState({
    appActiveHandler: () => {
      if (accessToken) {
        registerDevice();
        checkUserPermission();
      }
    },
  });

  return {
    deleteToken,
    getToken,
    toggleNotificationSetting,
    isEnabled,
  };
};

export default useFirebase;
