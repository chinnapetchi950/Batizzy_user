import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {icons, images} from '../helper/imageConstants';
import {deviceHeight, hp} from '../helper/constants';
import Colors from '../helper/Colors';
import Loader from '../common/Loader';
import {routes} from '../navigation/Routes';
import axios from 'axios';
import baseURL from '../helper/ApiConstant';
import uploads_url from '../helper/ImageUrl';
import {showMessage} from 'react-native-flash-message';

const SocialFollowersList = ({searchTerm}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAllFollowerList, setIsAllFollowerList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onScreenFocus = async () => {
        await GetAllFollower();
      };
      onScreenFocus();
    }, [GetAllFollower]),
  );
  const emptyMesRender = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={[styles.emptyMsg]}>
          {t('notificationListScreen.emptyMessage')}
        </Text>
      </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    GetAllFollower();
    setRefreshing(false);
  };

  const GetAllFollower = useCallback(async () => {
    try {
      setIsLoading(true);
      const Token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${baseURL}social_followers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Token}`,
          Accept: 'application/json',
        },
      });
      const res = await response.json();

      if (res.status === true) {
        setIsAllFollowerList(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderItem = ({item}) => {
    return (
      <View style={styles.listItem}>
        <Image
          source={{
            uri: item?.follower?.profile_image
              ? uploads_url + item?.follower?.profile_image
              : images.profileDummy,
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{item?.follower?.name}</Text>
        <TouchableOpacity
          onPress={() =>
            gotoSendMessage(item?.follower?.id, item?.follower_type)
          }
          style={styles.messageButton}>
          <Text style={styles.messageText}>Message</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Filter data based on search term
  const filteredFollowers = isAllFollowerList.filter(follower =>
    follower.follower.name
      ?.toLowerCase()
      .includes((searchTerm || '').toLowerCase()),
  );

  const gotoSendMessage = async (otherUserId, type) => {
    createConversionID(otherUserId, type);
  };

  const createConversionID = async (otherUserId, type) => {
    const Token = await AsyncStorage.getItem('accessToken');
    const data = {
      to_id: otherUserId,
      to_type: type,
    };
    axios({
      method: 'post',
      url: baseURL + `conversations`,
      headers: {
        Authorization: 'Bearer' + Token,
        Accept: 'application/json',
      },
      data: data,
    })
      .then(function (response) {
        setIsLoading(false);
        if (response.data.status) {
          navigation.navigate(routes.MessageScreen, {
            ID: response.data.data.id,
          });
        }
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
    <>
      <FlatList
        data={filteredFollowers}
        keyExtractor={item => item.id}
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
  header: {
    flexDirection: 'row',
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  avatar: {
    width: hp(4.6),
    height: hp(4.6),
    borderRadius: 20,
    marginRight: 16,
  },
  name: {
    flex: 1,
    color: '#000000',
    fontFamily: 'Inter-SemiBold',
    fontSize: responsiveFontSize(2.35),
  },
  messageButton: {
    backgroundColor: '#FECC16',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageText: {
    color: '#1D1D1D',
    fontFamily: 'Inter-SemiBold',
    fontSize: responsiveFontSize(1.41),
  },
  menuButton: {
    marginLeft: 10,
  },
  menuText: {
    fontSize: 24,
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
    paddingVertical: 10,
    textAlign: 'center',
    marginTop: deviceHeight / 4,
  },
});

export default SocialFollowersList;
