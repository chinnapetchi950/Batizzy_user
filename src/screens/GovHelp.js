import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../helper/Colors';
import {icons} from '../helper/imageConstants';
import {deviceHeight, hp, wp} from '../helper/constants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import baseURL from '../helper/ApiConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Loader from '../common/Loader';
import {useLanguage} from '../context/LanguageContext';
import {showMessage} from 'react-native-flash-message';

const GovHelp = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState();
  const [helpData, setHelpData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const {selectedLanguage, changeLanguage} = useLanguage();

  useEffect(() => {
    gotosaveToken();
  }, []);

  const gotosaveToken = async () => {
    var Token = await AsyncStorage.getItem('accessToken');
    setToken(Token);
    getHelpData(Token);
  };

  const getHelpData = async Token => {
    setIsLoading(true);
    axios({
      method: 'get',
      url: baseURL + `government_renovation_help`,
      headers: {
        Authorization: 'Bearer' + Token,
        Accept: 'application/json',
      },
    })
      .then(function (response) {
        setIsLoading(false);
        setHelpData(response.data.data);
      })
      .catch(error => {
        setIsLoading(false);
        showMessage({
          message: JSON.stringify(error.response.data.message),
          floating: true,
          position: 'top',
          icon: 'danger',
          type: 'danger',
        });
      });
  };

  const gotoOpenURL = async url => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(t('common.error'), `${t('common.errorOccurred')}. ${url}`);
    }
  };

  const renderHelpData = (item, index) => {
    return (
      <View key={index}>
        <View style={[styles.flexRowSB]}>
          <View style={[styles.faqContainer]}>
            <View style={[styles.bullets]} />
            <View>
              <Text style={[styles.questionText]}>
                {selectedLanguage == 'fr'
                  ? item.title_fr
                  : selectedLanguage == 'de'
                  ? item.title_de
                  : item.title}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => gotoOpenURL(item.link)}
            style={[styles.linkContainner]}>
            <Image source={icons.link} style={[styles.linkIconSize]} />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={[styles.answerText]}>
            {selectedLanguage == 'fr'
              ? item.description_fr
              : selectedLanguage == 'de'
              ? item.description_de
              : item.description}
          </Text>
        </View>
      </View>
    );
  };

  const emptyMesRender = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={[styles.emptyMsg]}>{t('common.recordNotFound')}</Text>
      </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    getHelpData();
    setRefreshing(false);
  };

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
              <Text style={styles.headerText}>{t('govhelp.header')}</Text>
            </View>
          </View>
          <View>
            <Text style={[styles.suggestionText, styles.mainPaddingTop]}>
              {t('govhelp.description')}
            </Text>
          </View>
          <FlatList
            data={helpData}
            scrollEnabled
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item: faqData, index}) =>
              renderHelpData(faqData, index)
            }
            ListEmptyComponent={() => emptyMesRender()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
        {isLoading && <Loader />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default GovHelp;

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
  suggestionText: {
    fontFamily: 'Inter',
    fontSize: responsiveFontSize(1.8),
    color: Colors.primary,
    lineHeight: 22,
  },
  faqContainer: {
    flexDirection: 'row',
  },
  questionText: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.black,
    fontSize: responsiveFontSize(1.8),
    paddingLeft: 10,
    marginVertical: 10,
  },
  answerText: {
    fontFamily: 'Inter',
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(1.6),
    // width: deviceWidth / 1.3,
    lineHeight: 22,
    paddingLeft: 10,
  },
  bullets: {
    padding: 4,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
  },
  linkIconSize: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  linkContainner: {
    padding: '2%',
    backgroundColor: '#75459559',
    borderRadius: 20,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowSB: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyMsg: {
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(2),
    paddingVertical: 10,
    textAlign: 'center',
    marginTop: deviceHeight / 4,
  },
});
