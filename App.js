import React, {useCallback, useEffect} from 'react';
import {
  StatusBar,
  View,
  LogBox,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MainNavigator from './src/navigation/MainNavigator';
import FlashMessage from 'react-native-flash-message';
import Geolocation from 'react-native-geolocation-service';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate} from './src/navigation/rootNavigator';
import {routes} from './src/navigation/Routes';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); // Ignore all log notifications

const App = () => {
  useEffect(() => {
    const requestLocationWithDelay = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Add 1-second delay
      requestLocationPermission();
    };
    requestLocationWithDelay();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const fineLocationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'We need access to your location to provide better services.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse');
    }
  };

  useEffect(() => {
    requestUserPermission();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getToken();
    } else {
    }
    const registerForRemoteMessages = async () => {
      try {
        await messaging().registerDeviceForRemoteMessages();
      } catch (error) {
        console.error('Error registering for remote messages:', error);
      }
    };

    // Request notification permission and register for remote messages when the app starts
    const initializeMessaging = async () => {
      // await requestUserPermission();
      await registerForRemoteMessages();
    };

    initializeMessaging();
  }

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'i am print the remote message from users====>',
        remoteMessage,
      );
      if (remoteMessage?.data?.notification_type == 'message') {
        navigate(routes.MessageScreen);
      } else if (remoteMessage?.data?.notification_type == 'renovation_post') {
        //testing remaining
        navigate(routes.SocialTab);
      } else if (
        remoteMessage?.data?.notification_type == 'renovation_post_request'
      ) {
        navigate(routes.RequestsScreen);
      } else if (remoteMessage?.data?.notification_type == 'post') {
        //testing remaining
        navigate(routes.SocialTab);
      } else if (remoteMessage?.data?.notification_type == 'post_like') {
        navigate(routes.SocialTab);
      } else if (remoteMessage?.data?.notification_type == 'comment') {
        navigate(routes.SocialTab);
      } else if (remoteMessage?.data?.notification_type == 'comment_like') {
        //testing remaining
        navigate(routes.SocialTab);
      } else if (remoteMessage?.data?.notification_type == 'banner') {
        //testing remaining
        navigate(routes.HelpScreen);
      } else if (remoteMessage?.data?.notification_type == 'follow') {
        //testing remaining
        navigate(routes.MarketPlace);
      } else if (remoteMessage?.data?.notification_type == 'social_follow') {
        navigate(routes.SocialTab);
      }
    });

    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, []);

  async function getToken() {
    try {
      const token = await messaging().getToken();
      console.log('Device Token:', token);
      await AsyncStorage.setItem('deviceToken', token);
    } catch (error) {}
  }

  return (
    <View style={styles.wrapper}>
      <MainNavigator />
      <FlashMessage position="top" duration={3000} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
