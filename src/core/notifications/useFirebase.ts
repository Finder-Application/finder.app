import {useCallback, useEffect, useState} from 'react';
import {Linking, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {useCreateInstallation} from 'api/notifications';
import {getFcm, getToken as getTokenAuth, setFcm} from 'core/Auth/utils';

// import {handleNavigateNotification} from '../Tools';
import {useAppState} from './useAppState';

let RETRY_COUNT = 0;

const useFirebase = () => {
  const handleNavigateNotification = () => {
    // handle việc navigation khi user bấm vào notification
  };
  const token = `Bearer ${getTokenAuth()?.access}`;
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
    let cacheFcmToken = getFcm();
    if (token) {
      try {
        const fcmToken = await messaging().getToken();

        if (fcmToken !== cacheFcmToken) {
          setFcm(fcmToken);

          setIsEnabled(true);

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
  }, [token]);

  const deleteToken = async () => {
    setIsEnabled(false);
    await messaging().deleteToken();
    await messaging().unregisterDeviceForRemoteMessages();
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
      handleNavigateNotification({
        remoteMessage,
        isInApp: true,
      });
      // alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(remoteMessage => {
      handleNavigateNotification({
        remoteMessage,
        isInApp: false,
      });
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          handleNavigateNotification({
            remoteMessage,
            isInApp: false,
          });
        }
      });
  }, []);

  useEffect(() => {
    if (token) {
      registerDevice();
      checkUserPermission();
    }
  }, [checkUserPermission, token]);

  const toggleNotificationSetting = () => {
    Linking.openSettings();
  };

  useAppState({
    appActiveHandler: () => {
      if (token) {
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
