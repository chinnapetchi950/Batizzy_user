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
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../helper/imageConstants';
import {deviceHeight, deviceWidth, hp, wp} from '../../helper/constants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import SignUpButton from '../../common/SignUpButton';
import {routes} from '../../navigation/Routes';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../helper/ApiConstant';
import Colors from '../../helper/Colors';
import FontFamily from '../../helper/FontFamily';
import axios from 'axios';
import Loader from '../../common/Loader';

const NewRequestDetails = () => {
  const route = useRoute();
  const ItemId = route.params?.ItemId;

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileModal, setIsProfileModal] = useState(false);
  const [isMyRequestListData, setMyRequestListData] = useState('');
  const [userData, setUserData] = useState([]);

  const {t} = useTranslation(); // Initialize translation

  useFocusEffect(
    useCallback(() => {
      const onScreenFocus = async () => {
        await GetRequestDetails();
      };
      onScreenFocus();
    }, [GetRequestDetails]),
  );

  useFocusEffect(
    useCallback(() => {
      const onScreenFocus = async () => {
        await getUserData();
      };
      onScreenFocus();
    }, [getUserData]),
  );

  const GetRequestDetails = useCallback(async () => {
    setIsLoading(true);
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

  const acceptRequest = async () => {
    const Token = await AsyncStorage.getItem('accessToken');
    setIsLoading(true);
    var formData = new FormData();
    formData.append('status', 'accepted');
    formData.append('_method', 'put');

    await fetch(baseURL + 'renovation_post_requests/' + ItemId, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Token}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(res => res.json())
      .then(res => {
        setIsLoading(false);
        if (res.status === true) {
          showMessage({
            message: res.message,
            floating: true,
            position: 'top',
            icon: 'success',
            type: 'success',
          });
          navigation.navigate(routes.ProposalAcceptedScreen, {
            acceptReqData: isMyRequestListData,
          });
        } else {
          handleApiError(res);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const rejectRequest = async () => {
    const Token = await AsyncStorage.getItem('accessToken');
    setIsLoading(true);
    var formData = new FormData();
    formData.append('status', 'rejected');
    formData.append('_method', 'put');
    setIsLoading(true);

    await fetch(baseURL + 'renovation_post_requests/' + ItemId, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Token}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(res => res.json())
      .then(res => {
        setIsLoading(false);
        if (res.status === true) {
          showMessage({
            message: res.data,
            floating: true,
            position: 'top',
            icon: 'success',
            type: 'success',
          });
          navigation.navigate(routes.RequestsScreen);
        } else {
          handleApiError(res);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleApiError = response => {
    const {message, error_details} = response;
    showMessage({
      message: message || t('common.errorOccurred'),
      type: 'warning',
    });

    if (error_details) {
      Object.keys(error_details).forEach(field => {
        // Capitalize the first letter of the field for better readability
        const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
        showMessage({
          message: `${formattedField}: ${error_details[field][0]}`,
          type: 'warning',
        });
      });
    }
  };

  const openModal = () => {
    setIsProfileModal(true);
  };

  const gotoCloseProfileModal = () => {
    setIsProfileModal(false);
  };

  return (
    <View style={styles.wrapper}>
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
              {t('newRequestDetails.details')}
            </Text>
          </View>
        </View>
        <View>
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
            {t('newRequestDetails.requestId')}
            <Text style={styles.valueText}>
              #{isMyRequestListData?.renovation_post?.id}
            </Text>
          </Text>
          <Pressable onPress={() => openModal()}>
            <Text style={styles.viewProfileText}>
              {t('newRequestDetails.viewProfile')}
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={styles.labelText}>
            {t('newRequestDetails.contractor')}
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
          {t('newRequestDetails.estimatedBudget')}
          <Text style={styles.valueText}>
            ${isMyRequestListData?.renovation_post?.budget}
          </Text>
        </Text>
        <Text style={styles.labelText}>
          {t('newRequestDetails.timeline')}
          <Text style={styles.valueText}>
            {isMyRequestListData?.renovation_post?.preferred_timelinef}
          </Text>
        </Text>
        <Text style={styles.labelText}>
          {t('newRequestDetails.servicesRequired')}
        </Text>
        <View style={styles.servicesContainer}>
          {isMyRequestListData?.renovation_types?.map((service, i) => (
            <View key={i} style={styles.serviceButton}>
              <Text style={styles.serviceText}>{service?.name}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.labelText}>
          {t('newRequestDetails.detailsLabel')}
        </Text>
        <Text style={styles.descriptionText}>
          {isMyRequestListData?.renovation_post?.description}
        </Text>
        <View style={[styles.statusContainer]}>
          <Text
            style={[
              styles.statusValue,
              {
                color:
                  isMyRequestListData?.status == 'completed' ||
                  isMyRequestListData?.status == 'accepted'
                    ? Colors.green
                    : isMyRequestListData?.status == 'rejected'
                    ? Colors.red
                    : isMyRequestListData?.status == 'pending'
                    ? Colors.yellow
                    : Colors.yellow,
              },
            ]}>
            {'Request ' + isMyRequestListData?.status_human_readable}
          </Text>
        </View>
      </ScrollView>
      <View style={{marginHorizontal: 15, marginBottom: 20}}>
        <SignUpButton
          title={t('newRequestDetails.accept')}
          onPress={() => {
            acceptRequest();
          }}
        />
        <Pressable
          onPress={() => {
            rejectRequest();
          }}>
          <Text style={styles.DeclineText}>
            {t('newRequestDetails.decline')}
          </Text>
        </Pressable>
      </View>
      {isLoading && <Loader />}
      {isProfileModal && (
        <Modal isVisible={isProfileModal} style={styles.modalContainer}>
          <View style={[styles.profileModalContainer]}>
            <View style={[styles.closeText]}>
              <Text style={[styles.titleText]}>
                {t('newRequestDetails.workerProfileDetails')}
              </Text>
              <TouchableOpacity onPress={() => gotoCloseProfileModal()}>
                <View style={[styles.closeBtnContainer]}>
                  <Image source={icons.close} style={[styles.closeSize]} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.containerKeyValue]}>
              <View style={[styles.keyContainer]}>
                <Text style={[styles.textKey]}>
                  {t('newRequestDetails.name')}
                </Text>
                <Text style={[styles.textKey]}>
                  {t('newRequestDetails.email')}
                </Text>
                <Text style={[styles.textKey]}>
                  {t('newRequestDetails.phone')}
                </Text>
                <Text style={[styles.textKey]}>
                  {t('newRequestDetails.location')}
                </Text>
              </View>
              <View>
                <Text style={[styles.textValue]}>
                  {isMyRequestListData?.professional?.name}
                </Text>
                <Text style={[styles.textValue]}>
                  {isMyRequestListData?.professional?.email}
                </Text>
                <Text style={[styles.textValue]}>
                  {isMyRequestListData?.professional?.phone}
                </Text>
                <Text style={[styles.textValue]}>
                  {isMyRequestListData?.professional?.location}
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default NewRequestDetails;

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
    fontSize: responsiveFontSize(1.88),
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 5,
    marginTop: 16,
    textAlign: 'center',
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

  loaderContainer: {
    height: hp(8),
    width: hp(8),
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileModalContainer: {
    height: deviceHeight / 3.5,
    width: deviceWidth - 60,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: '4%',
  },
  closeSize: {
    height: 20,
    width: 20,
    tintColor: Colors.black,
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10%',
  },
  closeBtnContainer: {
    padding: '4%',
    alignSelf: 'flex-end',
  },
  closeText: {flexDirection: 'row', justifyContent: 'space-between'},
  textValue: {
    color: '#263238',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Inter-Medium',
    lineHeight: 26,
    width: deviceWidth / 2,
  },
  textKey: {
    color: '#263238',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Inter',
    lineHeight: 26,
  },
  containerKeyValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keyContainer: {
    paddingRight: '10%',
  },
  statusText: {
    color: '#263238',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Inter-Medium',
    lineHeight: 30,
  },
  statusValue: {
    fontSize: responsiveFontSize(2),
    fontFamily: FontFamily.InterMedium,
  },
});
