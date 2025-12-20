import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {deviceHeight, deviceWidth, hp, wp} from '../../helper/constants';
import {icons, images} from '../../helper/imageConstants';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {routes} from '../../navigation/Routes';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../../helper/Colors';
import {navigate} from '../../navigation/rootNavigator';
import axios from 'axios';
import baseURL from '../../helper/ApiConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import uploads_url from '../../helper/ImageUrl';
import FontFamily from '../../helper/FontFamily';
import Loader from '../../common/Loader';
import {useLanguage} from '../../context/LanguageContext';
import {showMessage} from 'react-native-flash-message';

const BlogScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState();
  const [blogData, setBlogData] = useState([]);
  const [blogRecentData, setBlogRecentData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState('');
  const [categoryData, setCategoryData] = useState('');
  const {selectedLanguage, changeLanguage} = useLanguage();

  useEffect(() => {
    getCategoryData();
    getRecentData();
  }, []);

  const getCategoryData = async () => {
    setIsLoading(true);
    var Token = await AsyncStorage.getItem('accessToken');
    await fetch(baseURL + 'categories', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + Token,
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        setIsLoading(false);
        if (res.status === true) {
          setCategoryData(res.data);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  };

  useFocusEffect(
    useCallback(() => {
      const onScreenFocus = async () => {
        await getUserData();
      };
      onScreenFocus();
    }, [getUserData]),
  );

  const getUserData = async () => {
    var Token = await AsyncStorage.getItem('accessToken');
    setIsLoading(true);
    axios({
      method: 'get',
      url: baseURL + `profile`,
      headers: {
        Authorization: 'Bearer' + Token,
        Accept: 'application/json',
      },
    })
      .then(function (response) {
        setIsLoading(false);
        setUserData(response.data.data);
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

  useEffect(() => {
    gotosaveToken();
  }, []);

  const gotosaveToken = async () => {
    var Token = await AsyncStorage.getItem('accessToken');
    setToken(Token);
    getTrainingData(Token);
  };

  const getTrainingData = async Token => {
    setIsLoading(true);
    axios({
      method: 'get',
      url: baseURL + `blogs`,
      headers: {
        Authorization: 'Bearer' + Token,
        Accept: 'application/json',
      },
    })
      .then(function (response) {
        setIsLoading(false);
        setBlogData(response.data.data);
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

  const getRecentData = async () => {
    var Token = await AsyncStorage.getItem('accessToken');
    setIsLoading(true);
    axios({
      method: 'get',
      url: baseURL + `blogs?sort=recent`,
      headers: {
        Authorization: 'Bearer' + Token,
        Accept: 'application/json',
      },
    })
      .then(function (response) {
        setIsLoading(false);
        setBlogRecentData(response.data.data);
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

  const renderCategory = item => {
    return (
      <View style={{padding: '2%'}}>
        <View>
          <ImageBackground source={icons.Bg} style={[styles.iconBGSize]}>
            <Image
              source={{uri: uploads_url + item?.image}}
              style={[styles.iconSize]}
            />
          </ImageBackground>
        </View>
        <Text style={[styles.iconText]}>
          {selectedLanguage == 'fr' || item?.name_fr?.length > 18
            ? `${item?.name_fr?.slice(0, 18)}...`
            : selectedLanguage == 'de' || item?.name_de?.length > 18
            ? `${item?.name_de?.slice(0, 18)}...`
            : `${item?.name?.slice(0, 30)}...`}
        </Text>
      </View>
    );
  };

  const renderPost = item => {
    return (
      <View style={{paddingRight: '2%', borderRadius: 10}}>
        <ImageBackground
          source={{
            uri: item?.image ? uploads_url + item?.image : images.profileDummy,
          }}
          style={{
            width: deviceWidth / 2.4,
            height: deviceHeight / 3.5,
          }}
          borderRadius={10}>
          <View
            style={{
              padding: 10,
              width: deviceWidth / 2.4,
              height: deviceHeight / 3.5,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'flex-end',
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: '#fff', // White text color
                fontSize: 14, // Adjust font size as needed
                textAlign: 'center', // Center align the text
                marginBottom: 4, // Space between lines
              }}>
              {moment(item?.created_at).fromNow() + ' '}
            </Text>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 'bold', // Bold title text
                textAlign: 'center',
              }}>
              {selectedLanguage == 'fr' && item?.title_fr?.length > 30
                ? `${item.title_fr.slice(0, 30)}...`
                : selectedLanguage == 'de' && item?.title_de?.length > 30
                ? `${item.title_de.slice(0, 30)}...`
                : `${item.title.slice(0, 30)}...`}
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const renderTrading = (item, index) => {
    return (
      <View key={index}>
        <TouchableOpacity onPress={() => gotoDetailScreen(item)}>
          <View style={[styles.imageBGContainer]}>
            <View style={[styles.tradingImgcontaier]}>
              <Image
                source={{
                  uri: item?.image
                    ? uploads_url + item?.image
                    : images.profileDummy,
                }}
                borderRadius={10}
                style={[styles.tradingImg]}
              />
              <View style={[styles.textContainer]}>
                <Text style={[styles.dateText]}>
                  {moment(item?.created_at).format('ddd, DD MMM YYYY')}
                </Text>
                <Text style={[styles.titileText]}>
                  {selectedLanguage == 'fr' && item?.title_fr?.length > 30
                    ? `${item.title_fr.slice(0, 30)}...`
                    : selectedLanguage == 'de' && item?.title_de?.length > 30
                    ? `${item.title_de.slice(0, 30)}...`
                    : `${item.title.slice(0, 30)}...`}
                </Text>
                <Text style={[styles.descrText]}>
                  {selectedLanguage == 'fr' && item?.content_fr?.length > 90
                    ? `${item.content_fr.slice(0, 90)}...`
                    : selectedLanguage == 'de' && item?.content_de?.length > 90
                    ? `${item.content_de.slice(0, 90)}...`
                    : `${item.content.slice(0, 90)}...`}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
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

  const gotoDetailScreen = item => {
    navigate(routes.BlogDetailScreen, {item: item});
  };

  return (
    <SafeAreaView>
      <StatusBar animated={true} backgroundColor={Colors.white} />
      <View style={styles.wrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{'Blogs'}</Text>
        </View>
        <View style={styles.IconsContainer}>
          <Pressable onPress={() => navigation.navigate(routes.ChatScreen)}>
            <Image source={icons.chatIcon} style={styles.chatIcon} />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate(routes.NotificationListScreen)}>
            <Image
              source={icons.notificationIcon}
              style={styles.notificationIcon}
            />
          </Pressable>
          {userData?.unread_notifications_count != 0 && (
            <Text style={styles.notificationCount}>
              {userData?.unread_notifications_count}
            </Text>
          )}
        </View>
      </View>
      <ScrollView>
        <View style={[styles.mainContaier]}>
          {/* <Input
            value={message}
            placeholderText={'Search here'}
            blurOnSubmit={true}
            autoCapitalize="none"
            // isValidationShow={isMobileError}
            // validateMesssage={mobileErrorValidMsg}
            onChangeText={text => onChangeMessage(text)}
            returnKeyType="done"
          /> */}

          <FlatList
            data={categoryData}
            scrollEnabled
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item: data, index}) => renderCategory(data, index)}
            ListEmptyComponent={() => emptyMesRender()}
            showsVerticalScrollIndicator={false}
          />
          <Text style={[styles.postTitle]}>{'Most Recent'}</Text>
          <FlatList
            // contentContainerStyle={{width: '100%', flex: 1}}
            data={blogRecentData}
            scrollEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item: data, index}) => renderPost(data, index)}
            ListEmptyComponent={() => emptyMesRender()}
            showsVerticalScrollIndicator={false}
          />
          <Text style={[styles.postTitle]}>{'Trending '}</Text>

          <FlatList
            contentContainerStyle={{paddingBottom: '20%'}}
            data={blogData}
            scrollEnabled
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item: data, index}) => renderTrading(data, index)}
            ListEmptyComponent={() => emptyMesRender()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
      {isLoading && <Loader />}
    </SafeAreaView>
  );
};
export default BlogScreen;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingTop: '4%',
    paddingHorizontal: '4%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  title: {
    color: 'black',
    fontSize: responsiveFontSize(2.4),
    fontFamily: 'Inter-SemiBold',
  },
  viewAccountText: {
    fontFamily: 'Inter-Medium',
    fontSize: responsiveFontSize(1.41),
    color: '#754595',
    marginLeft: wp(2),
  },
  IconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    height: hp(2.2),
    width: hp(2.2),
  },
  notificationIcon: {
    height: hp(3),
    width: hp(3),
    marginHorizontal: 7,
  },
  notificationCount: {
    backgroundColor: 'red',
    paddingVertical: 0.5,
    paddingHorizontal: 2,
    borderRadius: 10,
    color: 'white',
    fontSize: responsiveFontSize(1.2),
    textAlignVertical: 'center',
    fontFamily: FontFamily.InterBlack,
    height: 20,
    position: 'absolute',
    top: -7,
    left: 32,
  },
  chatIcon: {
    height: hp(3),
    width: hp(3),
  },
  mainContaier: {
    backgroundColor: Colors.white,
    padding: '4%',
  },
  emptyMsg: {
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(2),
    paddingVertical: hp(1),
    textAlign: 'center',
    marginTop: deviceHeight / 4,
  },
  iconBGSize: {
    width: 60,
    height: 60,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: '1%',
  },
  iconSize: {
    width: 45,
    height: 45,
    borderRadius: 30,
  },
  iconText: {
    fontSize: responsiveFontSize(1.2),
    color: Colors.fontLightGray,
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: FontFamily.InterSemiBold,
    width: 60,
  },
  imageBG: {
    height: deviceHeight / 4,
    width: deviceWidth / 3,
  },
  imageTitle: {
    color: Colors.white,
    fontSize: responsiveFontSize(2),
  },
  imageDesc: {
    color: Colors.white,
    fontSize: responsiveFontSize(2),
  },
  imageBGContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 10,
  },
  postTitle: {
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(2),
    paddingVertical: 10,
    fontWeight: '700',
  },
  tradingImg: {
    height: 120,
    width: 120,
  },
  tradingImgcontaier: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    padding: '4%',
  },
  titileText: {
    width: deviceWidth / 1.7,
    color: Colors.black,
    fontSize: responsiveFontSize(1.6),
    fontFamily: FontFamily.InterBold,
  },
  dateText: {
    color: Colors.primary,
    fontSize: responsiveFontSize(1.6),
    fontFamily: FontFamily.InterSemiBold,
  },
  descrText: {
    width: deviceWidth / 1.7,
    color: Colors.black,
    fontSize: responsiveFontSize(1.6),
    fontFamily: FontFamily.InterBlack,
  },
});
