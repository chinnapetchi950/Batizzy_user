import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import {hp} from '../helper/constants';

const {width} = Dimensions.get('window');

const TAB_ICONS = {
  tab1: require('../../assets/icons/tab1.png'),
  SocialTab: require('../../assets/icons/tab2.png'),
  MarketPlace: require('../../assets/icons/tab4.png'),
  BlogScreen: require('../../assets/icons/tab5.png'),
  HelpScreen: require('../../assets/icons/helpIcon.png'),
  Profile: require('../../assets/icons/tab6.png'),
};

const TabBar = ({state, navigation, onPressPlus}) => {
  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const icon = TAB_ICONS[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.8}>
              <Image
                source={icon}
                style={[
                  styles.icon,
                  {tintColor: isFocused ? '#754595' : '#000'},
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Floating Plus Button */}
      <View style={styles.plusContainer}>
        <Pressable onPress={onPressPlus}>
          <View style={styles.plusButton}>
            <Image
              source={require('../../assets/icons/plusIcon.png')}
              style={styles.plusIcon}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export {TabBar};



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: hp(10), // space for floating button
  },

  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around', // 🔥 KEY FIX
    height: hp(8),
  },

  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: hp(3),
    height: hp(3),
  },

  plusContainer: {
    position: 'absolute',
    top: -hp(4),
    left: width / 2 - hp(3.5),
  },

  plusButton: {
    width: hp(7),
    height: hp(7),
    borderRadius: hp(3.5),
    backgroundColor: '#754595',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6, // Android shadow
  },

  plusIcon: {
    width: hp(6),
    height: hp(6),
    //tintColor: '#fff',
  },
});




// export {TabBar};
