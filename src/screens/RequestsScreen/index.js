import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../helper/imageConstants';
import Modal from 'react-native-modal';
import {hp, wp} from '../../helper/constants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import CustomSearchBar from '../../common/CustomSearchBar';
import MyRequestList from './MyRequestList';
import NewRequestList from './NewRequestList';
import RequestStatusScreen from './RequestStatusScreen';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {routes} from '../../navigation/Routes';
import baseURL from '../../helper/ApiConstant';
import Colors from '../../helper/Colors';
import axios from 'axios';
import Loader from '../../common/Loader';
import FontFamily from '../../helper/FontFamily';
import {showMessage} from 'react-native-flash-message';

const RequestsScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [isNewRequest, setIsNewRequest] = useState(false);
  const [isMyRequest, setIsMyRequest] = useState(true);
  const [isRequestStatus, setIsRequestStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSearch = term => {
    setSearchTerm(term);
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
  const onClickNewRequest = () => {
    setIsNewRequest(true);
    setIsMyRequest(false);
    setIsRequestStatus(false);
  };

  const onClickMyRequest = () => {
    setIsNewRequest(false);
    setIsMyRequest(true);
    setIsRequestStatus(false);
  };

  const onClickRequestStatus = () => {
    setIsNewRequest(false);
    setIsMyRequest(false);
    setIsRequestStatus(true);
  };

  const [requestListLength, setRequestListLength] = useState(0);
  const [newrequestListLength, setNewRequestListLength] = useState(0);

  const handleDataLengthChange = length => {
    setRequestListLength(length);
  };

  const handleNewDataLengthChange = length => {
    setNewRequestListLength(length);
  };

  return (
    <SafeAreaProvider style={styles.wrapper}>
      <SafeAreaView>
        <View style={styles.container}>
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
              <Text style={styles.editProfileText}>
                {t('request.requests')}
              </Text>
            </View>
          </View>
          <View style={styles.IconsContainer}>
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
        </View>
        <View style={styles.searchBarContainer}>
          <CustomSearchBar
            onSearch={handleSearch}
            placeholder={t('request.placeholder')}
          />
        </View>
        <View style={styles.tabMainContainer}>
          <Pressable
            onPress={() => {
              onClickMyRequest();
            }}>
            <Text style={isMyRequest ? styles.activetab : styles.inActivetab}>
              {t('request.myRequests') + ' '}
              {requestListLength > 0 ? `(${requestListLength})` : ''}
              {'  '}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              onClickNewRequest();
            }}>
            <Text style={isNewRequest ? styles.activetab : styles.inActivetab}>
              {t('request.newRequests')}
              {newrequestListLength > 0 ? `(${newrequestListLength})` : ''}
            </Text>
          </Pressable>
          <Pressable onPress={() => onClickRequestStatus()}>
            <Text
              style={isRequestStatus ? styles.activetab : styles.inActivetab}>
              {t('request.requestsStatus')}
            </Text>
          </Pressable>
        </View>
        {isMyRequest && (
          <MyRequestList
            searchTerm={searchTerm}
            onDataLengthChange={handleDataLengthChange}
          />
        )}
        {isNewRequest && (
          <NewRequestList
            searchTerm={searchTerm}
            newDataLengthChange={handleNewDataLengthChange}
          />
        )}
        {isRequestStatus && <RequestStatusScreen searchTerm={searchTerm} />}
        {isLoading && <Loader />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default RequestsScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '4%',
    paddingBottom: '4%',
    paddingTop: Platform.OS === 'android' ? '1%' : 0,
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
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonBackground: {
    height: hp(4.8),
    width: hp(4.8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  backButtonIcon: {
    height: hp(1.37),
    width: wp(4),
    alignSelf: 'center',
    marginBottom: hp(0.5),
  },
  editProfileText: {
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    fontSize: responsiveFontSize(1.88),
    marginLeft: 16,
  },
  publishText: {
    fontFamily: 'Inter-SemiBold',
    color: '#754595',
    fontSize: responsiveFontSize(1.88),
    marginLeft: 16,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userContainer: {
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2.4),
  },
  profileImage: {
    width: hp(5),
    height: hp(5),
    borderRadius: 25,
    marginRight: 12,
  },
  listIcon: {
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: 'contain',
  },
  headerText: {
    flex: 1,
  },
  IconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    height: hp(2.2),
    width: hp(2.2),
  },
  RectangleIcon: {
    height: hp(17.5),
    width: '100%',
    marginTop: hp(2),
  },
  notificationIcon: {
    height: hp(3),
    width: hp(3),
  },
  notificationCount: {
    backgroundColor: '#FF7F36',
    paddingVertical: 0.5,
    paddingHorizontal: 2,
    borderRadius: 9,
    color: 'white',
    fontSize: responsiveFontSize(1.2),
    textAlignVertical: 'center',
    fontFamily: FontFamily.InterBlack,
    height: 18,
    width:18,
    textAlign:'center',
    position: 'absolute',
    top: -7,
    left: 10,
  },
  searchBarContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
  },
  activetab: {
    fontFamily: 'Inter-Medium',
    color: '#754595',
    fontSize: responsiveFontSize(1.64),
    borderBottomWidth: 1,
    borderBottomColor: '#754595',
  },
  inActivetab: {
    fontFamily: 'Inter-Medium',
    color: '#787878',
    fontSize: responsiveFontSize(1.64),
  },
  tabMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '4%',
    paddingBottom: '4%',
  },
  middleTabContainer: {
    marginHorizontal: 16,
  },
});
