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
import {icons, images} from '../helper/imageConstants';
import {deviceHeight, hp, wp} from '../helper/constants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import baseURL from '../helper/ApiConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Loader from '../common/Loader';
import uploads_url from '../helper/ImageUrl';
import FontFamily from '../helper/FontFamily';
import Icons from '../common/Icons';
import {showMessage} from 'react-native-flash-message';

const ContractMonthScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState();
  const [helpData, setHelpData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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
      url: baseURL + `contractor-of-the-month`,
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

  const renderHelpData = (item, index) => {
    return (
      <View style={[styles.shadowBox]} key={index}>
        <View style={[styles.flexRowSB]}>
          <View style={[styles.flexRow]}>
            <Image
              source={{
                uri: item?.profile_image
                  ? uploads_url + item?.profile_image
                  : images.profileDummy,
              }}
              style={[styles.smallProfile]}
            />
            <Text style={[styles.username, {marginLeft: 10}]}>
              {item?.name}
            </Text>
            <View style={[styles.flexRow]}>
              <Image source={icons.certified} style={{height: 20, width: 20}} />
              <Image source={icons.badgeIcon} style={{height: 20, width: 20}} />
            </View>
          </View>
          <View style={[styles.flexRow]}>
            <Icons
              iconSetName={'FontAwesome'}
              iconName={'star'}
              iconColor={Colors.yellow}
              iconSize={18}
            />
            <Text style={[styles.username, {marginLeft: 3}]}>
              {item?.ratings_count}
            </Text>
          </View>
        </View>
        <View>
          <View style={[styles.flexRow, {marginTop: 10}]}>
            <Icons
              iconSetName={'FontAwesome6'}
              iconName={'user-group'}
              iconColor={Colors.primary}
              iconSize={16}
            />
            <Text style={styles.infoText}>
              {item?.social_followers_count}{' '}
              {t('marketplace.followers') + ' | '}
              {item?.social_following_count}
              {t('marketplace.following')}
            </Text>
          </View>
          <View style={[styles.flexRow, {marginTop: 2}]}>
            <Icons
              iconSetName={'FontAwesome6'}
              iconName={'user-gear'}
              iconColor={Colors.primary}
              iconSize={16}
            />
            <Text style={styles.infoText}>{item?.skill_names}</Text>
          </View>

          <View style={[styles.flexRow, {marginTop: 2}]}>
            <Icons
              iconSetName={'Ionicons'}
              iconName={'bag'}
              iconColor={Colors.primary}
              iconSize={18}
            />
            <Text style={styles.infoText}>{item?.experiencef}</Text>
          </View>
          <View style={[styles.flexRow, {marginTop: 2}]}>
            <Icons
              iconSetName={'MaterialCommunityIcons'}
              iconName={'map-marker'}
              iconColor={Colors.primary}
              iconSize={18}
            />
            <Text style={styles.infoText}>{item?.location}</Text>
          </View>
        </View>
        {/* <View style={styles.followBtnMainContainer}>
          <TouchableOpacity
            style={styles.followBtnContainer}
            onPress={() => {}}>
            <Icons
              iconSetName={'FontAwesome6'}
              iconName={'user-plus'}
              iconColor={Colors.white}
              iconSize={16}
            />
            <Text style={[styles.followBtntext, {marginLeft: 10}]}>
              {'Follow'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.messageBtnContainer}
            onPress={() => gotoSendMessage()}>
            <Icons
              iconSetName={'Ionicons'}
              iconName={'chatbubbles-sharp'}
              iconColor={Colors.black}
              iconSize={18}
            />
            <Text style={[styles.messageBtntext, {marginLeft: 10}]}>
              {'Message'}
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  };

  const emptyMesRender = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={[styles.emptyMsg]}>{t('recordNotFound')}</Text>
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
              <Text style={styles.headerText}>
                {t('training.contractorOfMonth')}
              </Text>
            </View>
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

export default ContractMonthScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  mainPadding: {
    padding: '2%',
  },
  mainPaddingH: {
    paddingHorizontal: '2%',
  },
  mainPaddingV: {
    paddingVertical: '2%',
  },
  mainPaddingTop: {
    paddingTop: '2%',
  },
  mainpaddingBottom: {
    paddingBottom: '2%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  smallProfile: {
    height: 30,
    width: 30,
    borderRadius: 20,
  },
  username: {
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(1.8),
    fontFamily: FontFamily.InterSemiBold,
  },
  infoText: {
    fontFamily: FontFamily.InterBlack,
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(1.6),
    marginLeft: 20,
    marginVertical: 2,
  },
  infoTextBold: {
    fontFamily: FontFamily.InterSemiBold,
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(1.6),
    marginLeft: 20,
    marginVertical: 2,
  },
  followBtnMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  followBtnContainer: {
    backgroundColor: '#754595',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    flex: 0.48,
  },
  messageBtnContainer: {
    backgroundColor: '#CECECE',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    flex: 0.48,
  },
  followBtntext: {
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.41),
  },
  messageBtntext: {
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1D',
    fontSize: responsiveFontSize(1.41),
  },
  shadowBox: {
    elevation: 3,
    padding: 20,
    margin: 10,
    borderWidth: 0.1,
  },
});
