import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import Colors from '../../helper/Colors';
import FontFamily from '../../helper/FontFamily';
import {icons} from '../../helper/imageConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../helper/ApiConstant';
import {deviceHeight, hp, wp} from '../../helper/constants';
import axios from 'axios';
import uploads_url from '../../helper/ImageUrl';
import {routes} from '../../navigation/Routes';
import {navigate} from '../../navigation/rootNavigator';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Loader from '../../common/Loader';
import {showMessage} from 'react-native-flash-message';

const ChatScreen = props => {
  const [selectedTab, setSelectedTab] = useState('Inbox');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [chatList, setChatList] = useState([]);
  const conversionID = props?.route?.params?.conversionID || null;
  const navigation = useNavigation();
  const [userData, setUserData] = useState('');

  const [refreshing, setRefreshing] = useState(false);
  const {t} = useTranslation();

  useEffect(() => {
    fetchAPIData();
  }, []);

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
        Authorization: 'Bearer ' + Token,
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

  const onRefresh = async () => {
    setRefreshing(true);
    fetchAPIData();
    setRefreshing(false);
  };

  async function fetchAPIData() {
    setIsLoading(true);
    var Token = await AsyncStorage.getItem('accessToken');
    axios({
      method: 'get',
      url: baseURL + 'conversations',
      headers: {
        Authorization: 'Bearer ' + Token,
        Accept: 'application/json',
      },
    })
      .then(function (response) {
        setIsLoading(false);
        setUnreadCount(response.data.data.unread_count);
        setChatList(response.data.data);
        const ListData = response.data.data.conversations;
        if (conversionID != null) {
          const result = ListData.find(({id}) => id === conversionID);
          gotoMessageScreen(result.id);
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
  }

  const gotoMessageScreen = ID => {
    navigate(routes.MessageScreen, {ID: ID});
  };

  const emptyMesRender = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={[styles.emptyMsg]}>{t('chatScreen.noChatsFound')}</Text>
      </View>
    );
  };

  const renderListData = (item, index) => {
    return (
      <View style={[styles.listContainer]}>
        <TouchableOpacity
          onPress={() => gotoMessageScreen(item.id)}
          style={[styles.profileContainer]}>
          <View style={[styles.imgContainer]}>
            <Image
              source={{
                uri: item?.user?.profile_image
                  ? uploads_url + item?.user?.profile_image
                  : 'https://img.icons8.com/ios-filled/100/user-male-circle.png',
              }}
              style={[styles.imageSize]}
            />
            <View style={[styles.msgContainer]}>
              <Text style={[styles.username]}>{item?.user?.name}</Text>
              <Text style={[styles.message]}>{item?.lastmessage?.message}</Text>
            </View>
          </View>

          <View>
            <Text style={[styles.megTime]}>
              {item?.lastmessage?.created_at_ago}
            </Text>
            {item?.unread_count != 0 && (
              <View style={[styles.notiCount]}>
                <Text style={[styles.textCount]}>{item?.unread_count}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderUnreadData = (item, index) => {
    return (
      <View style={[styles.listContainer]}>
        <TouchableOpacity
          onPress={() => gotoMessageScreen(item.id)}
          style={[styles.profileContainer]}>
          <View style={[styles.imgContainer]}>
            <Image
              source={{
                uri: item?.user?.profile_image
                  ? uploads_url + item?.user?.profile_image
                  : 'https://img.icons8.com/ios-filled/100/user-male-circle.png',
              }}
              style={[styles.imageSize]}
            />
            <View style={[styles.msgContainer]}>
              <Text style={[styles.username]}>{item?.user?.name}</Text>
              <Text style={[styles.message]}>{item?.lastmessage?.message}</Text>
            </View>
          </View>

          <View>
            <Text style={[styles.megTime]}>
              {item?.lastmessage?.created_at_ago}
            </Text>
            {item?.unread_count != 0 && (
              <View style={[styles.notiCount]}>
                <Text style={[styles.textCount]}>{item?.unread_count}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Inbox':
        return (
          <FlatList
            contentContainerStyle={{paddingBottom: '50%'}}
            data={chatList.conversations}
            scrollEnabled
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item: chatList, index}) =>
              renderListData(chatList, index)
            }
            ListEmptyComponent={() => emptyMesRender()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        );
      case 'Unread':
        return (
          <FlatList
            contentContainerStyle={{paddingBottom: '50%'}}
            data={chatList.unread_conversations}
            scrollEnabled
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item: chatList, index}) =>
              renderUnreadData(chatList, index)
            }
            ListEmptyComponent={() => emptyMesRender()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        );
      default:
        null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar animated={true} backgroundColor={Colors.white} />
        <View style={[styles.mainPadding]}>
          <View style={[styles.headerContainer]}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
              style={styles.pressable}>
              <ImageBackground
                resizeMode="cover"
                source={icons.Bg}
                style={styles.imageBackground}>
                <Image
                  resizeMode="contain"
                  source={icons.backIcon}
                  style={styles.backIcon}
                />
              </ImageBackground>
            </Pressable>
            <Text style={[styles.headerText]}>
              {t('chatScreen.chatHeader')}
            </Text>
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(routes.NotificationListScreen)
                }>
                <Image
                  source={icons.notificationIcon}
                  style={[styles.iconSize]}
                />
              </TouchableOpacity>

              {userData?.unread_notifications_count != 0 && (
                <Text style={styles.notificationCount}>
                  {userData?.unread_notifications_count}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'Inbox' && styles.activeTab]}
              onPress={() => setSelectedTab('Inbox')}>
              <Text style={styles.tabText}>{t('chatScreen.inbox')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'Unread' && styles.activeTab]}
              onPress={() => setSelectedTab('Unread')}>
              <Text style={styles.tabText}>
                {t('chatScreen.unreadCount') + ' (' + unreadCount + ')'}
              </Text>
            </TouchableOpacity>
          </View>
          {renderTabContent()}
        </View>
        {isLoading && <Loader />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  mainPadding: {
    padding: '4%',
  },
  headerText: {
    fontFamily: FontFamily.InterBlack,
    fontSize: responsiveFontSize(3),
    color: Colors.black,
  },
  iconSize: {
    height: 26,
    width: 26,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: responsiveFontSize(2),
    color: Colors.black,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSize: {
    height: 26,
    width: 26,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterSize: {
    height: 16,
    width: 16,
  },
  iconContainer: {
    padding: '4%',
    borderWidth: 0.3,
    borderRadius: 50,
  },
  proposalReqContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.primary,
    borderBottomWidth: 1,
    alignSelf: 'flex-start',
  },
  proposalText: {
    color: Colors.primary,
  },
  textColor: {
    color: Colors.fontGray,
    fontSize: responsiveFontSize(1.6),
    lineHeight: 25,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    paddingVertical: hp(1),
  },
  serchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2),
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: hp(2),
  },
  statusText: {
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(1.8),
  },
  statusValue: {
    color: Colors.yellow,
    fontSize: responsiveFontSize(1.8),
  },
  imageSize: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notiCount: {
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
  },
  textCount: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    color: Colors.white,
    fontSize: responsiveFontSize(1.4),
  },
  megTime: {
    color: Colors.black,
    fontSize: responsiveFontSize(1.4),
    paddingBottom: hp(1),
  },
  username: {
    color: Colors.black,
    fontSize: responsiveFontSize(2),
  },
  message: {
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(1.2),
    paddingTop: hp(1),
  },
  msgContainer: {
    paddingLeft: wp(2),
  },
  emptyMsg: {
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(2),
    paddingVertical: hp(1),
    textAlign: 'center',
    marginTop: deviceHeight / 4,
  },
  listContainer: {
    paddingTop: hp(2),
  },
  imageBackground: {
    height: hp(4.8),
    width: hp(4.8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  backIcon: {
    height: hp(1.37),
    width: wp(4),
    alignSelf: 'center',
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
  IconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
