import {
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  Switch,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StatusBarHeight, fontSize, hp, wp} from '../../helper/constants';
import {icons, images} from '../../helper/imageConstants';
import {commonActions, navigate} from '../../navigation/rootNavigator';
import {routes} from '../../navigation/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import Colors from '../../helper/Colors';
import uploads_url from '../../helper/ImageUrl';

const Profile = () => {
  const {t} = useTranslation();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [userData, setUserData] = useState('');

  useFocusEffect(
    useCallback(() => {
      const onScreenFocus = async () => {
        await getUserData();
      };
      onScreenFocus();
    }, [getUserData]),
  );

  const getUserData = async () => {
    const data = await AsyncStorage.getItem('userData');
    setUserData(JSON.parse(data));
  };
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const gotoConfirmLogout = async () => {
    setIsLogoutModalVisible(false);
    const deviceToken = await AsyncStorage.getItem('deviceToken');
    AsyncStorage.clear();
    await AsyncStorage.setItem('deviceToken', deviceToken);
    commonActions(routes.Login);
  };
  const ProfileCard = ({icon, title, onPress}) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={icon} style={styles.cardIcon} />
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS == 'android' ? 0 : StatusBarHeight,
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}>
      <View>
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <Image
              source={
                userData?.profile_image
                  ? {uri: uploads_url + userData.profile_image}
                  : images.profileDummy
              }
              style={styles.profileImage}
            />

            <View style={styles.profileInfo}>
              <Text style={styles.nameText}>{userData?.name}</Text>
              <Text style={styles.emailText}>{userData?.email}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigate(routes.EditProfileScreen)}>
            <Image source={icons.editIcon} style={styles.editIcon} />
          </TouchableOpacity>
        </View>

        {/* <View
          style={{
            marginHorizontal: '4%',
            borderWidth: 0.5,
            borderColor: Colors.borderColor,
            marginTop: '4%',
          }}
        /> */}

        <View style={styles.grid}>
          <ProfileCard
            icon={icons.request}
            title={t('home.requests')}
            onPress={() => navigate(routes.RequestsScreen)}
          />

          <ProfileCard
            icon={icons.star}
            title={t('chat')}
            onPress={() => navigate(routes.ChatScreen)}
          />

          <ProfileCard
            icon={icons.infoI}
            title={t('settings.aboutUs')}
            onPress={() => navigate(routes.AboutScreen)}
          />

          <ProfileCard
            icon={icons.help}
            title={t('settings.helpCenter')}
            onPress={() => navigate(routes.HelpScreen)}
          />

          <ProfileCard
            icon={icons.tab4}
            title={t('marketPlace')}
            onPress={() => navigate(routes.MarketPlace)}
          />

<ProfileCard
            icon={icons.community}
            title={t('Community')}
            onPress={() => navigate(routes.MarketPlace)}
          />
          <ProfileCard
            icon={icons.tab5}
            title={t('Blog')}
            onPress={() => navigate(routes.MarketPlace)}
          />
          <ProfileCard
            icon={icons.setting}
            title={t('settings.settings')}
            onPress={() => navigate(routes.SettingScreen)}
          />
        </View>
        <View style={styles.bottomSection}>
          <View style={styles.rowItem}>
            <Image source={icons.profile_notify} style={styles.rowIcon} />
            <Text style={styles.rowText}>{t('settings.notification')}</Text>

            <Switch
              value={isEnabled}
              onValueChange={toggleSwitch}
              thumbColor={Colors.primary}
            />
          </View>
          <TouchableOpacity
            onPress={() => setIsLogoutModalVisible(true)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: wp(1),
              alignItems: 'center',
              marginTop: hp(3.42),
            }}>
            
            <View style={{flexDirection: 'row'}}>
              
              <Image
                resizeMode="contain"
                source={icons.Logout}
                style={{height: hp(2.74), width: hp(2.74)}}
              />
              <View>
                
                <Text
                  style={[styles.rowText,{marginLeft:10}]}>
                 
                  {t('settings.logoutConfirmation.logout')}
                </Text>
              </View>
            </View>
            <TouchableOpacity
               onPress={() => setIsLogoutModalVisible(true)}>
             
              <Image
                resizeMode="contain"
                source={icons.smallRight}
                style={{height: hp(1.5), width: hp(1.5)}}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.logoutRow}
            onPress={() => setIsLogoutModalVisible(true)}>
            <Image source={icons.logout} style={styles.rowIcon} />
            <Text style={styles.rowText}>
              {t('settings.logoutConfirmation.logout')}
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>

      <Modal
        isVisible={isLogoutModalVisible}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: '95%',
            backgroundColor: 'white',
            borderRadius: 8,
            paddingVertical: hp(2),
            paddingHorizontal: hp(2),
          }}>
          <Text
            style={{
              fontSize: fontSize(15),
              fontFamily: 'Inter-SemiBold',
              color: '#000000',
              textAlign: 'center',
              marginBottom: hp(2),
            }}>
            {t('settings.logoutConfirmation.message')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: hp(2),
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsLogoutModalVisible(false);
              }}
              style={{
                flex: 1,
                borderWidth: 1,
                paddingVertical: hp(1),
                // width: hp(17.76),
                borderRadius: wp(2),
                borderColor: Colors.primary,
              }}>
              <Text
                style={{
                  fontSize: fontSize(14),
                  fontFamily: 'Inter-Bold',
                  color: Colors.primary,
                  textAlign: 'center',
                }}>
                {t('settings.logoutConfirmation.no')}
              </Text>
            </TouchableOpacity>
            <View style={{width: wp(4)}}></View>
            <TouchableOpacity
              onPress={() => {
                gotoConfirmLogout();
              }}
              style={{
                flex: 1,
                paddingVertical: hp(1),
                borderRadius: wp(2),
                borderColor: '#2D9897',
                backgroundColor: Colors.primary,
              }}>
              <Text
                style={{
                  fontSize: fontSize(14),
                  fontFamily: 'Inter-Bold',
                  color: '#FFFFFF',
                  textAlign: 'center',
                }}>
                {t('settings.logoutConfirmation.yes')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
export default Profile;
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    marginTop: hp(2),
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileImage: {
    height: 56,
    width: 56,
    borderRadius: 28,
  },

  profileInfo: {
    marginLeft: wp(4),
  },

  nameText: {
    fontSize: fontSize(18),
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },

  emailText: {
    fontSize: fontSize(12),
    color: '#000',
    marginTop:5,
  },

  editBtn: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  editIcon: {
    height: 18,
    width: 18,
    tintColor: Colors.primary,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    marginTop: hp(4),
  },

  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: wp(2.6),
    marginBottom: hp(2),
    elevation: 5,
  },

  cardIcon: {
  height: 25,          // increase height
  width: 25,           // make it square
  resizeMode: 'contain', // 🔥 VERY IMPORTANT
  tintColor: Colors.primary,
  marginBottom: hp(1),
},

  cardText: {
    fontSize: fontSize(13),
    fontFamily: 'Inter-Medium',
    color: '#000',
  },

  bottomSection: {
    marginTop: hp(3),
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: wp(5),
  },

  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    justifyContent: 'space-between',
  },

  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
  },

  rowIcon: { 
    height: 22,
    width: 22,
    tintColor: Colors.primary,
    marginRight: wp(3),
  },

  rowText: {
    fontSize: fontSize(14),
    fontFamily: 'Inter-Medium',
    color: '#000',
    flex: 1,
  },
});
