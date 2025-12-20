import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import ModalDropdown from 'react-native-modal-dropdown';
import {icons, images} from '../../helper/imageConstants';
import {deviceWidth, hp, wp} from '../../helper/constants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {navigate} from '../../navigation/rootNavigator';
import {routes} from '../../navigation/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import baseURL from '../../helper/ApiConstant';
import Colors from '../../helper/Colors';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import uploads_url from '../../helper/ImageUrl';
import FontFamily from '../../helper/FontFamily';
import axios from 'axios';
import Icons from '../../common/Icons';
import moment from 'moment';
import LanguageData from '../../i18n/LanguageData';
// import {useLanguage} from '../../context/LanguageContext';
import Loader from '../../common/Loader';
import {showMessage} from 'react-native-flash-message';

const Home = () => {
  const navigation = useNavigation();
  const dropdownRef = useRef();
  const {t} = useTranslation();
  const [myRequestListData, setMyRequestListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewAll, setIsViewAll] = useState(false);
  const [userData, setUserData] = useState([]);
  const [storedLanguage, setStoredLanguage] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [bannerData, setBannerData] = useState(bannerDummyData);
  const [activeSlide, setActiveSlide] = useState(0);
  // const {selectedLanguage, changeLanguage} = useLanguage();

  const bannerDummyData = [
    {
      id: 1,
    },
    {
      id: 2,
    },
  ];

  useEffect(() => {
    getBennerData();
    getLanguageCode();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onScreenFocus = async () => {
        await getRenovatioPostReq();
      };
      onScreenFocus();
    }, [getRenovatioPostReq]),
  );

  useFocusEffect(
    useCallback(() => {
      const onScreenFocus = async () => {
        await getUserData();
      };
      onScreenFocus();
    }, [getUserData]),
  );

  const getLanguageCode = async () => {
    var LanguageCode = JSON.parse(await AsyncStorage.getItem('Language'));
    // changeLanguage(LanguageCode);
    if (LanguageCode != null) {
      updateLanguageCode(LanguageCode);
    }
  };

  const updateLanguageCode = async code => {
    var Token = await AsyncStorage.getItem('accessToken');
    setIsLoading(true);
    const data = {
      lang: code,
      _method: 'put',
    };

    axios({
      method: 'post',
      url: baseURL + `set_language`,
      headers: {
        Authorization: 'Bearer' + Token,
        Accept: 'application/json',
      },
      data: data,
    })
      .then(function (response) {
        setIsLoading(false);
        getUserData();
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
        const selectedCodeLang = LanguageData.find(
          lang => lang.code === response.data.data.lang,
        );
        // changeLanguage(selectedCodeLang?.code);
        setStoredLanguage(selectedCodeLang);
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

  const getBennerData = async () => {
    setIsLoading(false);
    var Token = await AsyncStorage.getItem('accessToken');
    await fetch(baseURL + 'banners', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + Token,
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        setIsLoading(false);
        if (res.status == true) {
          setBannerData(res.data);
        }
      })
      .catch(error => {});
  };

  const getRenovatioPostReq = useCallback(async () => {
    setIsLoading(false);
    var Token = await AsyncStorage.getItem('accessToken');
    await fetch(baseURL + 'renovation_posts', {
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
          setMyRequestListData(res.data);
          if (res?.data?.length > 4) {
            setIsViewAll(true);
          } else {
            setIsViewAll(false);
          }
        }
      })
      .catch(error => {});
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    getRenovatioPostReq();
    setRefreshing(false);
  };

  const renderRequests = (item, index) => {
    return (
      <View key={index} style={styles.newRequestMainContainer}>
        <View>
          <Text style={styles.newRequestLeftText}>Request ID</Text>
          <Text style={styles.newRequestLeftText}>Project Name</Text>
          <Text style={styles.newRequestLeftText}>Completion Date</Text>
          <Text style={styles.newRequestLeftText}>Status</Text>
        </View>
        <View style={{marginLeft: 20}}>
          <Text style={styles.newRequestRightText}>#{item?.id}</Text>
          <Text style={styles.newRequestRightText}>{item.title}</Text>
          <Text style={styles.newRequestRightText}>
            {moment(item?.created_at).format('ddd, DD MMM YYYY')}
          </Text>
          <Text
            style={[
              styles.statusValue,
              {
                color:
                  item?.post_status == 'completed' ||
                  item?.post_status == 'accepted'
                    ? Colors.green
                    : item?.post_status == 'rejected'
                    ? Colors.red
                    : item?.post_status == 'pending' ||
                      item.post_status == 'no_applicants'
                    ? Colors.yellow
                    : Colors.yellow,
              },
            ]}>
            {item?.post_status_label}
          </Text>
        </View>
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

  const renderCarouselItem = (item, index) => {
    return (
      <View
        style={{
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.primary,
          width: deviceWidth,
          height: 180,
          marginBottom: 10,
        }}
        key={index}>
        <Image
          source={{
            uri: item.image ? uploads_url + item.image : images.coverDummy,
          }}
          style={{
            width: deviceWidth,
            height: 180,
            resizeMode: 'contain',
            paddingBottom: 10,
          }}
        />
      </View>
    );
  };

  const onSelectLanguage = async (index, value, image, code) => {
    setStoredLanguage({image: image, text: value});
    await AsyncStorage.setItem('Language', JSON.stringify(code));
    updateLanguageCode(code);
    // changeLanguage(code);
    dropdownRef.current.hide();
  };

  const gotoUniverrsalSearchScreen = () => {
    navigate(routes.UniversalSearch);
  };

  const gotoContractorMonth = () => {
    navigate(routes.ContractMonth);
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.wrapper}>
        <StatusBar
          animated={true}
          backgroundColor={Colors.white}
          barStyle={'dark-content'}
        />
        <View style={[styles.container, styles.mainPaddingH]}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{t('home.greeting') + ' '}</Text>
            <Text style={[styles.title]}>
              {/* {selectedLanguage != 'en' && userData?.name?.length > 6
                ? `${userData.name.substring(0, 6)}...`
                : userData?.name} */}
            </Text>
          </View>
          <View style={styles.IconsContainer}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <ModalDropdown
                ref={dropdownRef}
                dropdownStyle={[styles.dropdownViewLayout]}
                showsVerticalScrollIndicator={false}
                options={LanguageData}
                onSelect={(index, value, image, code) =>
                  onSelectLanguage(index, value, image, code)
                }
                renderRow={(option, index, isSelected) => (
                  <TouchableOpacity
                    style={[
                      styles.renderMainView,
                      {
                        backgroundColor: isSelected ? '#DDDDDD' : 'transparent',
                      },
                    ]}
                    onPress={() =>
                      onSelectLanguage(
                        index,
                        option.text,
                        option.image,
                        option.code,
                      )
                    }>
                    <Image
                      resizeMode="contain"
                      source={option.image}
                      style={[styles.dropdownLang]}
                    />

                    <Text style={[styles.langText]}>
                      {option.code.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                )}
                renderButtonText={({text}) => (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.langText]}>{text}</Text>
                  </View>
                )}
                // defaultValue={storedLanguage?.text || 'English'}
              >
                <View style={[styles.viewLangContainer]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      resizeMode="contain"
                      source={storedLanguage?.image || icons?.english}
                      style={[styles.dropdownLang]}
                    />
                    <Text style={[styles.langText, {paddingLeft: 3}]}>
                      {/* {storedLanguage?.text || 'English'} */}
                    </Text>
                  </View>
                  <Icons
                    iconSetName={'FontAwesome6'}
                    iconName={'caret-down'}
                    iconColor={Colors.primary}
                    iconSize={20}
                  />
                </View>
              </ModalDropdown>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  marginLeft: 10,
                }}
                onPress={() => gotoUniverrsalSearchScreen()}>
                <Text style={[styles.AppText]}>{t('home.search')}</Text>
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'search-outline'}
                  iconColor={Colors.primary}
                  iconSize={20}
                />
              </TouchableOpacity>
            </View>

            <View style={{paddingRight: 4}}>
              <Pressable
                onPress={() =>
                  navigation.navigate(routes.NotificationListScreen)
                }>
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
            <View>
              <Pressable onPress={() => navigation.navigate(routes.ChatScreen)}>
                <Image source={icons.chatIcon} style={styles.chatIcon} />
              </Pressable>
            </View>
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <Carousel
            data={bannerData}
            onSnapToItem={index => setActiveSlide(index)} // Update active slide index
            renderItem={({item, index}) => renderCarouselItem(item, index)}
            sliderWidth={deviceWidth}
            itemWidth={deviceWidth}
            ListEmptyComponent={() => emptyMesRender()}
          />
          <Pagination
            dotsLength={bannerData?.length}
            activeDotIndex={activeSlide}
            containerStyle={{
              paddingVertical: 10,
            }}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 8,
              backgroundColor: Colors.primary,
            }}
            inactiveDotStyle={{
              backgroundColor: Colors.fontDarkGray,
            }}
            inactiveDotOpacity={0.7}
            inactiveDotScale={1}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.requestMainContainer}>
            <Pressable
              style={styles.requestContainer}
              onPress={() => {
                navigate(routes.RequestsScreen);
              }}>
              <Image source={icons.requestIcon} style={styles.requestIcon} />
              <Text style={styles.requestText}>{t('home.requests')}</Text>
            </Pressable>
            <Pressable
              style={styles.suggestionContainer}
              onPress={() => {
                navigate(routes.SuggestionScreen);
              }}>
              <Image source={icons.suggestionIcon} style={styles.requestIcon} />
              <Text style={styles.requestText}>{t('home.suggestions')}</Text>
            </Pressable>
            <Pressable
              style={styles.helpContainer}
              onPress={() => {
                navigate(routes.HelpScreen);
              }}>
              <Image source={icons.helpIcon} style={styles.requestIcon} />
              <Text style={styles.requestText}>{t('home.help')}</Text>
            </Pressable>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.titlecard}>
                {t('home.contractorOfTheMonth')}
              </Text>
              <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => gotoContractorMonth()}>
              <Text style={styles.buttonText}>{t('home.viewButton')}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigate(routes.GovHelp);
            }}>
            <View style={styles.cardContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.titlecard}>{t('home.governmentHelp')}</Text>
                <Text style={styles.subtitle}>{t('home.betterHome')}</Text>
              </View>
              <View>
                <Image
                  source={icons.RightSideMoveBlueIcon}
                  style={styles.RightSideMoveBlueIcon}
                />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.trainingMainContainer}>
            <TouchableOpacity
              style={styles.trainingContainer}
              onPress={() => {
                navigate(routes.BlogScreen);
              }}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  source={icons.TraininggIcon}
                  style={styles.RightSideMoveBlueIcon}
                />
                <Text style={styles.titlecard}>{t('home.training')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.trainingContainer}
              onPress={() => {
                navigate(routes.MarketPlace);
              }}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  source={icons.bussinessIcon}
                  style={styles.RightSideMoveBlueIcon}
                />
                <Text style={styles.titlecard}>
                  {t('home.businessPartners')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.newrequestContainerText}>
            <Text style={styles.titlecard}>{t('home.newRequests')}</Text>
            <View>
              {isViewAll && (
                <Pressable
                  onPress={() => {
                    navigation.navigate(routes.RequestsScreen);
                  }}>
                  <Text style={styles.viewAllText}>{t('home.viewAll')}</Text>
                </Pressable>
              )}
            </View>
          </View>
          <FlatList
            nestedScrollEnabled={true}
            contentContainerStyle={{width: '100%', paddingBottom: '10%'}}
            data={myRequestListData?.slice(0, 4)}
            scrollEnabled
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item: data, index}) => renderRequests(data, index)}
            ListEmptyComponent={() => emptyMesRender()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </ScrollView>
        {isLoading && <Loader />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default Home;

const styles = StyleSheet.create({
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
  wrapper: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS == 'android' ? 10 : 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  title: {
    color: 'black',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Inter-SemiBold',
  },
  requestText: {
    color: 'black',
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-SemiBold',
    marginTop: 5,
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
    height: 20,
    width: 20,
  },
  notificationIcon: {
    height: 26,
    width: 26,
    marginHorizontal: 7,
  },
  chatIcon: {
    height: 24,
    width: 24,
  },
  requestIcon: {
    height: hp(2.8),
    width: hp(2.8),
  },
  searchBarContainer: {
    marginTop: 15,
    marginBottom: 15,
    marginHorizontal: 15,
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
    left: 18,
  },
  requestContainer: {
    backgroundColor: '#FECC16B5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.31,
    paddingVertical: 12,
  },
  suggestionContainer: {
    backgroundColor: '#75459559',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.31,
  },
  helpContainer: {
    backgroundColor: '#F23B1366',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.31,
  },
  requestMainContainer: {
    marginHorizontal: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
    marginTop: 15,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 16,
    marginHorizontal: 15,
  },
  trainingContainer: {
    flex: 0.47,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 16,
  },
  newRequestMainContainer: {
    flex: 1,
    // alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 16,
    marginHorizontal: 16,
    paddingHorizontal: 15,
  },
  trainingMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  titlecard: {
    fontFamily: 'Inter-SemiBold',
    fontSize: responsiveFontSize(1.88),
    color: '#000000',
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: responsiveFontSize(1.64),
    color: '#754595',
  },
  subtitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: responsiveFontSize(1.34),
    color: '#6B6B6B',
    marginTop: 4,
  },
  RightSideMoveBlueIcon: {
    height: 33.33,
    width: 33.33,
    resizeMode: 'contain',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-SemiBold',
  },
  button: {
    backgroundColor: '#754595',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  newrequestContainerText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: hp(2.6),
  },
  newRequestLeftText: {
    fontFamily: 'Inter-Medium',
    fontSize: responsiveFontSize(1.64),
    color: '#4A4A4A',
    marginBottom: 5,
  },
  newRequestRightText: {
    fontFamily: 'Inter-Bold',
    fontSize: responsiveFontSize(1.64),
    color: '#4A4A4A',
    marginBottom: 5,
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    height: hp(8),
    width: hp(8),
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: responsiveFontSize(2.35),
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginTop: hp(5),
    color: '#000000',
  },
  emptyMsg: {
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(2),
    paddingVertical: hp(1),
    textAlign: 'center',
    marginTop: '10%',
  },
  statusValue: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: FontFamily.InterSemiBold,
  },

  dropdownViewLayout: {
    borderRadius: 10,
    color: Colors.fontGray,
    borderColor: Colors.borderLight,
    borderWidth: 0.5,
    height: 'auto',
  },
  dropdownLang: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  viewLangContainer: {
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: Colors.primary,
    borderWidth: 0.5,
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
  renderMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  langText: {
    color: Colors.fontDarkGray,
    fontFamily: FontFamily.InterMedium,
    fontSize: 12,
    paddingHorizontal: 10,
  },
  AppText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: responsiveFontSize(1.6),
    color: Colors.black,
    marginRight: 3,
  },
});
