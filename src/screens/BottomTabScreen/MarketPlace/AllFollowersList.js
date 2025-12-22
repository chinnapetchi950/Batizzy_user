import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../helper/imageConstants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {deviceHeight, hp} from '../../../helper/constants';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../../helper/ApiConstant';
import uploads_url from '../../../helper/ImageUrl';
import Colors from '../../../helper/Colors';
import Loader from '../../../common/Loader';

const AllFollowersList = ({searchTerm}) => {
  const {t} = useTranslation();
  const [isAllFollowerList, setIsAllFollowerList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onScreenFocus = async () => {
        await getAllFollower();
      };
      onScreenFocus();
    }, [getAllFollower]),
  );

  const getAllFollower = useCallback(async () => {
    setIsLoading(true);
    const Token = await AsyncStorage.getItem('accessToken');
    const response = await fetch(`${baseURL}followers`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Token}`,
        Accept: 'application/json',
      },
    });
    const res = await response.json();
    setIsLoading(false);
    if (res.status === true) {
      setIsAllFollowerList(res?.data);
    }
  }, []);

  const renderItem = ({item}) => {
    return (
      <View style={styles.listItem}>
        {item?.follower?.profile_image != null ? (
          <Image
            source={{uri: uploads_url + item?.follower?.profile_image}}
            style={styles.avatar}
          />
        ) : (
          <Image source={icons.dummyUser} style={styles.avatar} />
        )}
        <Text style={styles.name}>{item?.follower?.name}</Text>
      </View>
    );
  };

  const filteredFollowers = isAllFollowerList.filter(follower => {
    return follower?.follower?.name
      ?.toLowerCase()
      .includes((searchTerm || '').toLowerCase());
  });

  const emptyMesRender = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={[styles.emptyMsg]}>{t('common.recordNotFound')}</Text>
      </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    getAllFollower();
    setRefreshing(false);
  };

  return (
    <>
      <FlatList
        scrollEnabled
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
  emptyMsg: {
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(2),
    paddingVertical: 10,
    textAlign: 'center',
    marginTop: deviceHeight / 4,
  },
});

export default AllFollowersList;
