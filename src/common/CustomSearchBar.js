import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  ImageBackground,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {icons} from '../helper/imageConstants';
import {hp, wp} from '../helper/constants';
import {useNavigation} from '@react-navigation/native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import Colors from '../helper/Colors';
import FontFamily from '../helper/FontFamily';

const CustomSearchBar = ({
  onBackPress,
  onSearch,
  isBackBtn,
  isFilterBtn,
  onPressFilter,
  placeholder,
  isProfileImage,
  profileImageSource,
  onPressProfile,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {isBackBtn && (
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButton}>
          <ImageBackground
            resizeMode="cover"
            source={icons.Bg}
            style={styles.backButtonBackground}>
            <Image
              resizeMode="contain"
              source={icons.backIcon}
              style={styles.backButtonIcon}
            />
          </ImageBackground>
        </Pressable>
      )}
      {isProfileImage && (
        <Pressable onPress={onPressProfile}>
          <Image
            resizeMode="contain"
            source={profileImageSource}
            style={styles.profileImage}
          />
        </Pressable>
      )}
      <View style={styles.searchContainer}>
        <Image source={icons.searchIcon} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="gray"
          onChangeText={onSearch}
        />
      </View>
      {isFilterBtn && (
        <Pressable onPress={onPressFilter} style={styles.filterButton}>
          <ImageBackground
            tintColor={'#CECECE'}
            resizeMode="cover"
            source={icons.Bg}
            style={styles.filterButtonBackground}>
            <Image
              resizeMode="contain"
              source={icons.filterIcon}
              style={styles.backButtonIcon}
            />
          </ImageBackground>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
  },
  searchIcon: {
    marginRight: 5,
    height: hp(2),
    width: hp(2),
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  backButton: {
    flexDirection: 'row',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
   
  },
  backButtonBackground: {
    height: hp(4.8),
    width: hp(4.8),
  },
  filterButtonBackground: {
    height: hp(5.6),
    width: hp(5.6),
  },
  backButtonIcon: {
    height: hp(1.37),
    width: wp(4),
    marginBottom: hp(0.5),
  },
  profileImage: {
    height: hp(5.3),
    width: hp(5.3),
  },
});

export default CustomSearchBar;
