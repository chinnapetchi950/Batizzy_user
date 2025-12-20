import {
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  Switch,
  Text,
  TouchableOpacity,
  View,
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS == 'android' ? 0 : StatusBarHeight,
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: wp(4),
            alignItems: 'center',
            marginTop: '4%',
          }}>
          <View style={{flexDirection: 'row'}}>
            {userData?.profile_image ? (
              <Image
                source={{uri: uploads_url + userData?.profile_image}}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 30,
                }}
              />
            ) : (
              <Image
                source={{uri: images.profileDummy}}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 30,
                }}
              />
            )}
            <View>
              <Text
                numberOfLines={1}
                style={{
                  width: wp(55),
                  fontFamily: 'Inter-SemiBold',
                  color: Colors.primary,
                  fontSize: fontSize(17),
                  marginHorizontal: wp(4),
                }}>
                {userData?.name}
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter-Medium',
                  color: '#444444',
                  fontSize: fontSize(10),
                  marginHorizontal: wp(4),
                }}>
                {userData?.email}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigate(routes.EditProfileScreen);
            }}>
            <ImageBackground
              source={icons.Bg}
              style={{height: 40, width: 40, justifyContent: 'center'}}>
              <Image
                source={icons.editIcon}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: Colors.grayFont,
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
              />
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginHorizontal: '4%',
            borderWidth: 0.5,
            borderColor: Colors.borderColor,
            marginTop: '4%',
          }}
        />

        <TouchableOpacity
          onPress={() => {
            navigate(routes.RequestsScreen);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: '4%',
            alignItems: 'center',
            marginTop: '6%',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              resizeMode="contain"
              source={icons.request}
              style={{
                height: hp(2.74),
                width: hp(2.74),
              }}
            />
            <View>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  color: '#000000',
                  fontSize: fontSize(11),
                  marginHorizontal: wp(4),
                }}>
                {t('home.requests')}
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Image
              resizeMode="contain"
              source={icons.smallRight}
              style={{
                height: hp(1.5),
                width: hp(1.5),
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigate(routes.ChatScreen);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: wp(4),
            alignItems: 'center',
            marginTop: hp(3.42),
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              resizeMode="contain"
              source={icons.star}
              style={{
                height: hp(2.74),
                width: hp(2.74),
              }}
            />
            <View>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  color: '#000000',
                  fontSize: fontSize(11),
                  marginHorizontal: wp(4),
                }}>
                {t('chat')}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigate(routes.ChatScreen);
            }}>
            <Image
              resizeMode="contain"
              source={icons.smallRight}
              style={{
                height: hp(1.5),
                width: hp(1.5),
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigate(routes.AboutScreen, {screenName: 'about_us'});
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: wp(4),
            alignItems: 'center',
            marginTop: hp(3.42),
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              resizeMode="contain"
              source={icons.infoI}
              style={{
                height: hp(2.74),
                width: hp(2.74),
              }}
            />
            <View>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  color: '#000000',
                  fontSize: fontSize(11),
                  marginHorizontal: wp(4),
                }}>
                {t('settings.aboutUs')}
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Image
              onPress={() => {
                navigate(routes.AboutScreen);
              }}
              resizeMode="contain"
              source={icons.smallRight}
              style={{
                height: hp(1.5),
                width: hp(1.5),
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigate(routes.HelpScreen);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: wp(4),
            alignItems: 'center',
            marginTop: hp(3.42),
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              resizeMode="contain"
              source={icons.help}
              style={{
                height: hp(2.74),
                width: hp(2.74),
              }}
            />
            <View>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  color: '#000000',
                  fontSize: fontSize(11),
                  marginHorizontal: wp(4),
                }}>
                {t('settings.helpCenter')}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigate(routes.HelpScreen);
            }}>
            <Image
              resizeMode="contain"
              source={icons.smallRight}
              style={{
                height: hp(1.5),
                width: hp(1.5),
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigate(routes.SettingScreen);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: wp(4),
            alignItems: 'center',
            marginTop: hp(3.42),
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              resizeMode="contain"
              source={icons.setting}
              style={{
                height: hp(2.74),
                width: hp(2.74),
              }}
            />
            <View>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  color: '#000000',
                  fontSize: fontSize(11),
                  marginHorizontal: wp(4),
                }}>
                {t('settings.settings')}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigate(routes.SettingScreen);
            }}>
            <Image
              resizeMode="contain"
              source={icons.smallRight}
              style={{
                height: hp(1.5),
                width: hp(1.5),
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: wp(4),
            alignItems: 'center',
            marginTop: hp(3.42),
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              resizeMode="contain"
              source={icons.notificationIcon}
              style={{
                height: hp(2.74),
                width: hp(2.74),
                tintColor: Colors.primary,
              }}
            />
            <View>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  color: '#000000',
                  fontSize: fontSize(11),
                  marginHorizontal: wp(4),
                }}>
                {t('settings.notification')}
              </Text>
            </View>
          </View>

          <Switch
            trackColor={{false: '#767577', true: Colors.gray}}
            thumbColor={isEnabled ? Colors.primary : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            onPress={() => {
              setIsLogoutModalVisible(true);
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Inter-SemiBold',
                color: Colors.primary,
                fontSize: fontSize(13),
                borderWidth: 1,
                paddingVertical: hp(1.5),
                borderRadius: 30,
                textAlign: 'center',
                borderColor: Colors.primary,
                margin: '4%',
                marginTop: '20%',
              }}>
              {t('settings.logoutConfirmation.logout')}
            </Text>
          </TouchableOpacity>
          {/* <Text
            style={{
              fontFamily: 'Inter-Regular',
              color: '#000000',
              fontSize: fontSize(13),
              textAlign: 'center',
              marginBottom: hp(2.5),
            }}>
            Version
          </Text> */}
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
