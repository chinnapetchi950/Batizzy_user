import {
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../helper/Colors';
import {icons} from '../helper/imageConstants';
import {hp, wp} from '../helper/constants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const BusinessPartnerScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar animated={true} backgroundColor={Colors.white} />
        <View style={[styles.mainPadding]}>
          <View style={styles.leftContainer}>
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
            <View>
              <Text style={styles.headerText}>
                {t('businesspartnerscreen.header')}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default BusinessPartnerScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  mainPadding: {
    padding: '4%',
  },
  mainPaddingH: {
    paddingHorizontal: '4%',
  },
  mainPaddingV: {
    paddingVertical: '4%',
  },
  mainPaddingTop: {
    paddingTop: '4%',
  },
  mainpaddingBottom: {
    paddingBottom: '4%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonIcon: {
    height: hp(1.37),
    width: wp(4),
    alignSelf: 'center',
    marginBottom: hp(0.5),
  },
  backButtonBackground: {
    height: hp(4.8),
    width: hp(4.8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  headerText: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.black,
    fontSize: responsiveFontSize(1.8),
    marginLeft: '10%',
  },
});
