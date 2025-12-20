import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../helper/Colors';
import {icons} from '../helper/imageConstants';
import {deviceHeight, deviceWidth, hp, wp} from '../helper/constants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import baseURL from '../helper/ApiConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../common/Loader';
import {showMessage} from 'react-native-flash-message';

const SuggestionScreen = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState();
  const [faqData, setFaqData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {t} = useTranslation();

  useEffect(() => {
    gotosaveToken();
  }, []);

  const gotosaveToken = async () => {
    var Token = await AsyncStorage.getItem('accessToken');
    setToken(Token);
    getFAQData(Token);
  };

  const getFAQData = async Token => {
    setIsLoading(true);
    axios({
      method: 'get',
      url: baseURL + `faq`,
      headers: {
        Authorization: 'Bearer ' + Token,
        Accept: 'application/json',
      },
    })
      .then(function (response) {
        setIsLoading(false);
        setFaqData(response.data.data);
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

  const renderFaqData = (item, index) => {
    return (
      <View key={index}>
        <View style={[styles.faqContainer]}>
          <Text style={[styles.mainPaddingTop, styles.questionText]}>
            {index + 1 + '. '}
          </Text>
          <View style={[styles.mainPaddingTop]}>
            <Text style={[styles.questionText]}>{item.question}</Text>
            <Text style={[styles.answerText]}>{item.answer}</Text>
          </View>
        </View>
      </View>
    );
  };

  const emptyMesRender = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={[styles.emptyMsg]}>
          {t('suggestionscreen.noRecordFound')}
        </Text>
      </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    getFAQData();
    setRefreshing(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar animated={true} backgroundColor={Colors.white} />
        <View style={[styles.mainPadding]}>
          <View style={styles.flexRow}>
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
                {t('suggestionscreen.header')}
              </Text>
            </View>
          </View>

          <View style={[styles.flexRowSB, styles.mainPaddingTop]}>
            <View>
              <Text style={[styles.suggestionText]}>
                {t('suggestionscreen.smartSuggestions')}
              </Text>
              <Text style={[styles.suggDesc, styles.mainPaddingTop]}>
                {t('suggestionscreen.faqDesc')}
              </Text>
            </View>
            <Image style={[styles.suggImg]} source={icons.suggestion} />
          </View>
          <Text style={[styles.title, styles.mainPaddingTop]}>
            {t('suggestionscreen.faqTitle')}
          </Text>
          <FlatList
            data={faqData}
            scrollEnabled
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item: faqData, index}) =>
              renderFaqData(faqData, index)
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

export default SuggestionScreen;

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
    paddingVertical: hp(1),
    textAlign: 'center',
    marginTop: deviceHeight / 4,
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
    fontFamily: 'Inter-SemiBold',
    fontSize: responsiveFontSize(2),
    width: deviceWidth / 1.8,
    color: Colors.primary,
  },
  suggDesc: {
    fontFamily: 'Inter',
    color: Colors.black,
    fontSize: responsiveFontSize(1.6),
    width: deviceWidth / 1.8,
    color: Colors.fontDarkGray,
  },
  suggImg: {
    height: 100,
    width: 100,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.black,
    fontSize: responsiveFontSize(1.8),
    color: Colors.black,
  },
  faqContainer: {
    flexDirection: 'row',
  },
  questionText: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.black,
    fontSize: responsiveFontSize(1.8),
  },
  answerText: {
    fontFamily: 'Inter',
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(1.6),
    width: deviceWidth / 1.1,
    lineHeight: 22,
  },
});
