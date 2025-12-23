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
  IssearchIcon,
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
        {IssearchIcon&&
        <Image source={icons.searchIcon} style={styles.searchIcon} />
}
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
  borderWidth: 1,
  borderColor: '#9D9D9D',
  borderRadius: 35,
  marginLeft: 10,
  backgroundColor: '#fff',  // make corners visible
  overflow: 'hidden',        // clip children inside rounded corners
  paddingHorizontal: 10,     // optional: adds spacing inside
},
  searchIcon: {
    marginRight: 5,
    height: hp(2),
    width: hp(2),
    marginLeft:2
    
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
  borderRadius: hp(5.3) / 2, // perfectly circular
  resizeMode: 'cover',       // ensures image fills the circle
  overflow: 'hidden',        // clips any extra parts
}
});

export default CustomSearchBar;
