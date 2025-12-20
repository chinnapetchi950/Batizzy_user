import React, {useCallback, useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {images} from '../helper/imageConstants';
import {routes} from '../navigation/Routes';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import jwt_decode from 'jwt-decode';
import Colors from '../helper/Colors';

const FIRST_LAUNCH_KEY = '@MyApp:firstLaunch';
const ACCESS_TOKEN_KEY = 'accessToken';

const Splash = () => {
  const navigation = useNavigation();

  const checkFirstTimeUser = useCallback(async () => {
    try {
      const hasLaunchedBefore = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
      return hasLaunchedBefore === null;
    } catch (error) {
      console.error('Error checking first time user:', error);
      return true; // Assume it's the first time if there's an error
    }
  }, []);

  const setAppLaunched = useCallback(async () => {
    try {
      await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'true');
    } catch (error) {
      console.error('Error setting app launched:', error);
    }
  }, []);

  const loginCheck = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        var decoded = jwt_decode(token);

        if (decoded.exp * 1000 < new Date().getTime()) {
          navigation.navigate(routes.Login);
        } else {
          // Token is valid, check the role
          navigation.navigate(routes.TabNavigator);
        }
      } else {
        navigation.navigate(routes.Login);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      navigation.navigate(routes.Login);
    }
  }, [navigation]);

  const handleNavigation = useCallback(async () => {
    const isFirstTimeUser = await checkFirstTimeUser();

    if (isFirstTimeUser) {
      await setAppLaunched();
      navigation.navigate(routes.OnBoarding);
    } else {
      loginCheck();
    }
  }, [navigation, checkFirstTimeUser, setAppLaunched, loginCheck]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleNavigation();
    }, 2000);

    return () => clearTimeout(timer);
  }, [handleNavigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle={'light-content'} />
      <FastImage
        source={images.splashscreen}
        style={styles.gif}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#754595',
  },
  gif: {
    width: 200,
    height: 200,
  },
});
