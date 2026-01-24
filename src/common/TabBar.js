import React, {useCallback, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {routes} from '../navigation/Routes';
import uploads_url from '../helper/ImageUrl';

const {width} = Dimensions.get('window');

const TAB_ICONS = {
  [routes.tab1]: require('../../assets/icons/tab1.png'),
  [routes.SocialTab]: require('../../assets/icons/tab2.png'),
  [routes.MarketPlace]: require('../../assets/icons/tab4.png'),
  [routes.ChatScreen]: require('../../assets/icons/star.png'),
  [routes.Profile]: require('../../assets/icons/tab6.png'), // fallback
};

const TabBar = ({state, navigation, onPressPlus}) => {
  const currentRoute = state.routes[state.index].name;
  const [userData, setUserData] = useState(null);

  /** 🔹 Get user data on focus */
  useFocusEffect(
    useCallback(() => {
      const getUserData = async () => {
        const data = await AsyncStorage.getItem('userData');
        if (data) {
          setUserData(JSON.parse(data));
        }
      };
      getUserData();
    }, []),
  );

  const renderTab = (routeName) => {
    const isFocused = currentRoute === routeName;

    /** 🔹 Profile image logic */
    const isProfileTab = routeName === routes.Profile;
    const profileImage = userData?.profile_image;
console.log('Profile image:', userData?.profile_image);

    return (
      <TouchableOpacity
        key={routeName}
        onPress={() => navigation.navigate(routeName)}
        activeOpacity={0.85}
        style={[styles.tabItem, isFocused && styles.activeTab]}>
        <Image
          source={
            isProfileTab && profileImage
              ? {uri: uploads_url + profileImage}
              : TAB_ICONS[routeName]
          }
          style={[
            styles.icon,
            isProfileTab && profileImage && styles.profileIcon,
            !isProfileTab && {
              tintColor: isFocused ? '#754595' : '#fff',
            },
          ]}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.tabBar}>
        {renderTab(routes.tab1)}
        {renderTab(routes.SocialTab)}

        {/* PLUS BUTTON */}
        <TouchableOpacity
          onPress={onPressPlus}
          activeOpacity={0.9}
          style={styles.tabItem}>
          <Image
            source={require('../../assets/icons/plusIcon.png')}
            style={[styles.icon, {tintColor: '#fff'}]}
          />
        </TouchableOpacity>

        {renderTab(routes.MarketPlace)}
        {renderTab(routes.ChatScreen)}
        {renderTab(routes.Profile)}
      </View>
    </View>
  );
};

export {TabBar};




const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 12,
    width: '100%',
    alignItems: 'center',
  },

  // tabBar: {
  //   flexDirection: 'row',
  //   backgroundColor: '#754595',
  //   width: '94%',
  //   height: 60,
  //   borderRadius: 30,
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   paddingHorizontal: 10,
  //   elevation: 10,
  // },

  // tabItem: {
  //   width: 52,
  //   height: 52,
  //   borderRadius: 52/2,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },

  activeTab: {
    backgroundColor: '#fff',
  },

  // icon: {
  //   width: 25,
  //   height: 25,
  // },

  // /** 🔹 Profile image style */
  // profileIcon: {
  //   width: 28,
  //   height: 28,
  //   borderRadius: 16,
  // },
  tabBar: {
  flexDirection: 'row',
  backgroundColor: '#754595',
  width: '94%',
  height: 60,
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'space-around',
  paddingHorizontal: 6,
  elevation: 10,
},

tabItem: {
  width: 48,
  height: 48,
  borderRadius: 24,
  alignItems: 'center',
  justifyContent: 'center',
},

icon: {
  width: 24,
  height: 24,
},

profileIcon: {
  width: 28,
  height: 28,
  borderRadius: 14,
  overflow: 'hidden',
},

});





// export {TabBar};
