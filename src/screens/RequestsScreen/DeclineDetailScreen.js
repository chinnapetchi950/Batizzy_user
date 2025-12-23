import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../helper/imageConstants';
import {hp, wp} from '../../helper/constants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {routes} from '../../navigation/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../helper/ApiConstant';
import axios from 'axios';
import Loader from '../../common/Loader';
import FontFamily from '../../helper/FontFamily';
import {showMessage} from 'react-native-flash-message';

const DeclineDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const ItemId = route.params?.ItemId;
  const screenName = route.params?.screenName;
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMyRequestListData, setMyRequestListData] = useState('');

  const {t} = useTranslation();

  useFocusEffect(
    useCallback(() => {
      const onScreenFocus = async () => {
        await GetRequestDetails();
      };
      onScreenFocus();
    }, [GetRequestDetails]),
  );

  const GetRequestDetails = useCallback(async () => {
    var Token = await AsyncStorage.getItem('accessToken');
    await fetch(baseURL + 'renovation_post_requests/' + ItemId, {
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
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  }, [ItemId]);

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

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Pressable
            onPress={() => {
              if (screenName == 'newrequestDetails') {
                navigation.navigate(routes.RequestsScreen);
              }
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
              {t('declinedetails.details')}
            </Text>
          </View>
        </View>
        <View style={styles.IconsContainer}>
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
      <ScrollView style={styles.mainContainer}>
        <Text style={styles.titleText}>
          {isMyRequestListData?.renovation_post?.title}
        </Text>
        <View style={styles.bottomBorder} />
        <Text style={styles.valueText}>
          {isMyRequestListData?.renovation_post?.renovation_type?.name}
        </Text>
        <Text style={styles.dateText}>
          {isMyRequestListData?.renovation_post?.posted_at}
        </Text>
        <View style={styles.bottomBorder} />
        <View style={styles.aboveExperienceText} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.labelText}>
            {t('declinedetails.requestId')}{' '}
            <Text style={styles.valueText}>
              #{isMyRequestListData?.renovation_post?.id}
            </Text>
          </Text>
          <Pressable>
            <Text style={styles.viewProfileText}>
              {t('declinedetails.viewProfile')}
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={styles.labelText}>
            {t('declinedetails.contractor')}{' '}
            <Text style={styles.valueText}>
              {isMyRequestListData?.professional?.name}
            </Text>
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
            }}>
            <Image source={icons.certified} style={{height: 24, width: 24}} />
            <Image source={icons.badgeIcon} style={{height: 24, width: 24}} />
          </View>
        </View>
        <Text style={styles.labelText}>
          {t('declinedetails.estimatedBudget')}{' '}
          <Text style={styles.valueText}>
            ${isMyRequestListData?.renovation_post?.budget}
          </Text>
        </Text>
        <Text style={styles.labelText}>
          {t('declinedetails.timeline')}{' '}
          <Text style={styles.valueText}>
            {isMyRequestListData?.renovation_post?.preferred_timelinef}
          </Text>
        </Text>
        <Text style={styles.labelText}>
          {t('declinedetails.servicesRequired')}
        </Text>
        <View style={styles.servicesContainer}>
          {isMyRequestListData?.renovation_types?.map((service, i) => (
            <View key={i} style={styles.serviceButton}>
              <Text style={styles.serviceText}>{service?.name}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.labelText}>{t('declinedetails.detailsLabel')}</Text>
        <Text style={styles.descriptionText}>
          {isMyRequestListData?.renovation_post?.description}
        </Text>
      </ScrollView>

      {isLoading && <Loader />}
    </View>
  );
};

export default DeclineDetailScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mainContainer: {
    paddingHorizontal: 15,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
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
    color: '#754595',
    fontFamily: 'Inter-SemiBold',
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
  notificationIcon: {
    height: hp(3),
    width: hp(3),
    // marginHorizontal: 7,
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
    height:18,
    width:18,
    textAlign:'center',
    position: 'absolute',
    top: -7,
    left: 10,
  },
  titleText: {
    fontSize: responsiveFontSize(1.88),
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 10,
  },
  bottomBorder: {
    height: 1,
    backgroundColor: '#A6A6A6',
    width: '100%',
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    color: '#6B6B6B',
    fontSize: responsiveFontSize(1.41),
    marginBottom: 15,
  },
  labelText: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    color: '#4A4A4A',
    marginBottom: 5,
  },
  viewProfileText: {
    fontSize: responsiveFontSize(1.41),
    fontFamily: 'Inter-Medium',
    color: '#754595',
    marginBottom: 5,
  },
  DeclineText: {
    fontSize: responsiveFontSize(2.35),
    fontFamily: 'Inter-Bold',
    color: '#754595',
    textAlign: 'center',
    marginLeft: 16,
  },
  valueText: {
    color: '#263238',
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    marginTop: hp(1.6),
    marginBottom: 4,
  },
  descriptionText: {
    color: '#787878',
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  serviceButton: {
    backgroundColor: '#C7C7C7',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 10,
    marginBottom: 15,
  },
  serviceText: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    color: '#000000',
  },
  aboveExperienceText: {
    marginBottom: 15,
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
  messageContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    justifyContent: 'center',
    borderRadius: 20,
    borderColor: '#754595',
    paddingVertical: hp(1.4),
  },
});
