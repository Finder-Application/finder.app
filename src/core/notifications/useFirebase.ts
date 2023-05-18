import {useCallback, useEffect, useState} from 'react';
import {Linking, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {useCreateInstallation} from 'api/notifications';
import {useAuth} from 'core/Auth';
import {getFcm, setFcm} from 'core/Auth/utils';

// import {handleNavigateNotification} from '../Tools';
import {useAppState} from './useAppState';

let RETRY_COUNT = 0;

const useFirebase = () => {
  // const handleNavigateNotification = () => {
  // handle việc navigation khi user bấm vào notification
  // };

  const authToken = useAuth(state => state.token);

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
    let cacheFcmToken = getFcm();
    if (accessToken) {
      try {
        const fcmToken = await messaging().getToken();

        if (fcmToken !== cacheFcmToken) {
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
      console.log('hihihi ->cinny', remoteMessage);

      // handleNavigateNotification({
      //   remoteMessage,
      //   isInApp: true,
      // });
      // alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('hihihi ->3', remoteMessage);
      // handleNavigateNotification({
      //   remoteMessage,
      //   isInApp: false,
      // });
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('hihihi -> 1', remoteMessage);

        if (remoteMessage) {
          console.log('hihihi -> 2', remoteMessage);

          // handleNavigateNotification({
          //   remoteMessage,
          //   isInApp: false,
          // });
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
