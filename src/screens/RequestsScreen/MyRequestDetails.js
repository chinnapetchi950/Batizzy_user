import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../helper/imageConstants';
import {hp, wp} from '../../helper/constants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import Colors from '../../helper/Colors';
import FontFamily from '../../helper/FontFamily';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../helper/ApiConstant';
import {routes} from '../../navigation/Routes';
import Loader from '../../common/Loader';
import {showMessage} from 'react-native-flash-message';

const MyRequestDetails = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const route = useRoute();
  const Item = route.params?.Item;

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
              {t('myRequestDetails.details')}
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
      <View style={styles.mainContainer}>
        <Text style={styles.titleText}>{Item?.title}</Text>
        <View style={styles.bottomBorder} />
        <Text style={styles.valueText}>{Item?.renovation_type?.name}</Text>
        <Text style={styles.dateText}>{Item?.posted_at}</Text>
        <View style={styles.bottomBorder} />
        <View style={styles.aboveExperienceText} />
        <Text style={styles.labelText}>
          {t('myRequestDetails.experienceLevel')}
          <Text style={styles.valueText}>{Item?.experiencef}</Text>
        </Text>
        <Text style={styles.labelText}>
          {t('myRequestDetails.estimatedBudget')}
          <Text style={styles.valueText}>${Item?.budget}</Text>
        </Text>
        <Text style={styles.labelText}>
          {t('myRequestDetails.timeline')}
          <Text style={styles.valueText}>{Item?.preferred_timelinef}</Text>
        </Text>
        <Text style={styles.labelText}>
          {t('myRequestDetails.servicesRequired')}:
        </Text>
        <View style={styles.servicesContainer}>
          {Item?.skills.map((service, i) => (
            <View key={i} style={styles.serviceButton}>
              <Text style={styles.serviceText}>{service?.name}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.labelText}>{t('myRequestDetails.details')} :</Text>
        <Text style={styles.descriptionText}>{Item?.description}</Text>

        <View style={[styles.statusContainer]}>
          <Text
            style={[
              styles.statusValue,
              {
                color:
                  Item?.post_status == 'completed' ||
                  Item?.post_status == 'accepted'
                    ? Colors.green
                    : Item?.post_status == 'rejected'
                    ? Colors.red
                    : Item?.post_status == 'pending'
                    ? Colors.yellow
                    : Colors.yellow,
              },
            ]}>
            {t('myRequestDetails.requestStatus', {
              status: Item?.post_status_label,
            })}
          </Text>
        </View>
      </View>
      {isLoading && <Loader />}
    </View>
  );
};

export default MyRequestDetails;

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
  notificationIcon: {
    height: hp(3),
    width: hp(3),
    // marginHorizontal: 7,
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
    borderRadius: 8,
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
  statusValue: {
    fontSize: responsiveFontSize(2),
    fontFamily: FontFamily.InterMedium,
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10%',
  },
});
