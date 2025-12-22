import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import baseURL from '../../helper/ApiConstant';
import {deviceHeight, hp} from '../../helper/constants';
import {navigate} from '../../navigation/rootNavigator';
import {routes} from '../../navigation/Routes';
import {icons} from '../../helper/imageConstants';
import Colors from '../../helper/Colors';
import axios from 'axios';
import FontFamily from '../../helper/FontFamily';
import Loader from '../../common/Loader';
import {showMessage} from 'react-native-flash-message';

const MyRequestList = ({searchTerm, onDataLengthChange}) => {
  const {t} = useTranslation();

  const [isMyRequestListData, setMyRequestListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState([]);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    var Token = await AsyncStorage.getItem('accessToken');
    setToken(Token);
  };

  useFocusEffect(
    useCallback(() => {
      const onScreenFocus = async () => {
        await getRenovationPosts();
      };
      onScreenFocus();
    }, [getRenovationPosts]),
  );

  const getRenovationPosts = useCallback(async () => {
    setIsLoading(true);
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
          onDataLengthChange(res.data.length);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  }, [onDataLengthChange]);

  const gotoDeleteWarn = ID => {
    Alert.alert(
      t('request.deleteRequest'),
      t('request.deleteRequestConfirmation'),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => gotoDeleteAPI(ID)},
      ],
    );
  };

  const gotoDeleteAPI = ID => {
    setIsLoading(true);
    const data = {
      _method: 'delete',
    };
    axios({
      method: 'post',
      url: baseURL + `renovation_posts/${ID}`,
      headers: {
        Authorization: 'Bearer' + token,
        Accept: 'application/json',
      },
      data: data,
    })
      .then(function (response) {
        setIsLoading(false);
        getRenovationPosts();
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

  const Item = ({
    index,
    id,
    title,
    type,
    budget,
    timeline,
    services,
    onPress,
    timeAgo,
    status,
    statusManage,
    location,
  }) => (
    <Pressable
      key={'pressable' + index}
      style={[styles.mainPaddingH, styles.mainPaddingTop]}
      onPress={onPress}>
      <View style={[styles.flexDirectionSB]}>
        <Text style={styles.dateText}>{timeAgo}</Text>
        <View style={[styles.flexDirectionRow]}>
          {/* {statusManage != 'completed' && (
            <TouchableOpacity onPress={() => gotoEditAPI()}>
              <View style={[styles.editIconContainer]}>
                <Image source={icons.edit} style={[styles.editIconSize]} />
              </View>
            </TouchableOpacity>
          )} */}
          <TouchableOpacity onPress={() => gotoDeleteWarn(id)}>
            <View style={[styles.deleteIconContainer, {marginLeft: 10}]}>
              <Image source={icons.delete} style={[styles.deleteIconSize]} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.labelText}>
        Type: <Text style={styles.valueText}>{type}</Text>
      </Text>
      <Text style={styles.labelText}>
        Estimated Budget: <Text style={styles.valueText}>{budget}</Text>
      </Text>
      <Text style={styles.labelText}>
        Timeline: <Text style={styles.valueText}>{timeline}</Text>
      </Text>
      <Text style={styles.labelText}>
        location: <Text style={styles.valueText}>{location}</Text>
      </Text>
      <Text style={[styles.labelText, {paddingBottom: 6}]}>
        Services Required:
      </Text>
      <View style={styles.servicesContainer}>
        {services.map((service, i) => (
          <View key={i} style={styles.serviceButton}>
            <Text style={styles.serviceText}>{service?.name}</Text>
          </View>
        ))}
      </View>
      <View style={[styles.statusContainer]}>
        <Text
          style={[
            styles.statusValue,
            {
              color:
                statusManage == 'completed' || statusManage == 'accepted'
                  ? Colors.green
                  : statusManage == 'rejected'
                  ? Colors.red
                  : statusManage == 'pending'
                  ? Colors.yellow
                  : Colors.yellow,
            },
          ]}>
          {status}
        </Text>
      </View>
      <View style={styles.bottomBorder} />
    </Pressable>
  );

  const renderItem = ({item, index}) => (
    <Item
      index={index}
      id={item.id}
      title={item?.title}
      type={item?.renovation_type?.name}
      budget={item.budget}
      timeline={item.preferred_timelinef}
      services={item.skills}
      timeAgo={item?.posted_at}
      onPress={() => {
        navigate(routes.MyRequestDetails, {
          Item: item,
        });
      }}
      statusManage={item.post_status}
      status={item.post_status_label}
      location={item.location}
    />
  );

  const onRefresh = async () => {
    setRefreshing(true);
    getRenovationPosts();
    setRefreshing(false);
  };

  // Filter data based on search term
  const filteredMyRequest = isMyRequestListData.filter(request =>
    request.title?.toLowerCase().includes((searchTerm || '').toLowerCase()),
  );

  const emptyMesRender = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={[styles.emptyMsg]}>{t('common.recordNotFound')}</Text>
      </View>
    );
  };

  return (
    <>
      <FlatList
        contentContainerStyle={{paddingBottom: '60%'}}
        data={filteredMyRequest}
        scrollEnabled
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() => emptyMesRender()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {isLoading && <Loader />}
    </>
  );
};

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
  dateText: {
    fontFamily: 'Inter-Medium',
    color: '#6B6B6B',
    fontSize: responsiveFontSize(1.41),
    lineHeight: 26,
  },
  titleText: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    color: '#2D2C2C',
    lineHeight: 26,
  },
  labelText: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    color: '#4A4A4A',
    lineHeight: 26,
  },
  valueText: {
    color: '#000000',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceButton: {
    backgroundColor: '#A6A6A6',
    borderRadius: 8,
    paddingVertical: '1%',
    paddingHorizontal: '2%',
    marginBottom: '4%',
    marginLeft: '1%',
  },
  serviceText: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    color: '#000000',
  },
  bottomBorder: {
    height: 1,
    backgroundColor: '#A6A6A6',
    width: '100%',
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
  editIconContainer: {
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 30,
  },
  editIconSize: {
    width: 14,
    height: 14,
    tintColor: Colors.black,
  },
  deleteIconSize: {
    width: 14,
    height: 14,
    tintColor: Colors.red,
  },
  deleteIconContainer: {
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 30,
    borderColor: Colors.red,
  },
  flexDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexDirectionSB: {
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
  statusValue: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: FontFamily.InterMedium,
  },
  statusContainer: {
    alignSelf: 'flex-end',
    paddingBottom: '4%',
  },
});

export default MyRequestList;
