import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {hp, wp} from '../helper/constants';

const icons = [
  require('../../assets/icons/tab1.png'),
  require('../../assets/icons/tab2.png'),
  require('../../assets/icons/tab4.png'),
  require('../../assets/icons/tab5.png'),
  require('../../assets/icons/helpIcon.png'),
  require('../../assets/icons/tab6.png'),
];

const TabBar = ({state, descriptors, navigation, onPressPlus}) => {
  const focusedRoute = state.routes[state.index];
  const screenWidth = Dimensions.get('window').width;

  const leftTabs = state.routes.slice(0, 3);
  const rightTabs = state.routes.slice(3, 6);

  const renderTab = (route, index, isLeft) => {
    const isFocused = route.key === focusedRoute.key;
    return (
      <TouchableOpacity
        key={route.key}
        onPress={() => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }}
        style={styles.tabItem}>
        <Image
          source={icons[isLeft ? index : index + 3]}
          style={[styles.tabIcon, {tintColor: isFocused ? '#754595' : 'black'}]}
          resizeMode={'contain'}
        />
        {isFocused && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.customShadow} />
      <View style={styles.tabBarContainer}>
        <View style={styles.leftTabs}>
          {leftTabs.map((route, index) => renderTab(route, index, true))}
        </View>
        <View style={styles.rightTabs}>
          {rightTabs.map((route, index) => renderTab(route, index, false))}
        </View>
      </View>
      {/* Plus icon in the center */}
      <View
        style={[styles.centerTabContainer, {left: screenWidth / 2 - hp(5.5)}]}>
        <Pressable onPress={onPressPlus}>
          <View style={styles.plusIconContainer}>
            <Image
              source={require('../../assets/icons/plusIcon.png')}
              style={styles.plusIcon}
              resizeMode="contain"
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: hp(9),
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  customShadow: {
    position: 'absolute',
    top: -hp(0.5),
    left: 0,
  },
  tabBarContainer: {
    flexDirection: 'row',
    height: hp(9),
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  leftTabs: {
    flexDirection: 'row',
  },
  rightTabs: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: wp(10),
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  tabIcon: {
    height: hp(3),
    width: hp(3),
  },
  activeIndicator: {
    position: 'absolute',
  },
  centerTabContainer: {
    position: 'absolute',
    top: -hp(5),
    zIndex: 10,
  },
  plusButtonShadow: {
    position: 'absolute',
    top: hp(0.5),
  },
  plusIconContainer: {
    width: 80,
  },
  plusIcon: {
    width: 60,
    height: 60,
  },
});

export {TabBar};
