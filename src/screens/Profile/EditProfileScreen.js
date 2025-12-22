import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  StatusBarHeight,
  deviceHeight,
  fontSize,
  hp,
  wp,
} from '../../helper/constants';
import {icons, images} from '../../helper/imageConstants';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {showMessage} from 'react-native-flash-message';
import RBSheet from 'react-native-raw-bottom-sheet';
import {launchCamera} from 'react-native-image-picker';
import SignUpButton from '../../common/SignUpButton';
import Colors from '../../helper/Colors';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import FontFamily from '../../helper/FontFamily';
import {routes} from '../../navigation/Routes';
import BottomSheetCondition from '../../common/BottomSheetCondition';
import baseURL from '../../helper/ApiConstant';
import uploads_url from '../../helper/ImageUrl';
import Loader from '../../common/Loader';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const imageRef = useRef();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [userData, setUserData] = useState();
  const [name, setName] = useState('');
  const [phoneNumb, setPhoneNumb] = useState('');
  const [contriesData, setCountriesData] = useState([]);
  const [openPhoneNumberModal, setOpenPhoneNumberModal] = useState(false);
  const [mobileNumberCode, setMobileNumberCode] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    setIsLoading(true);
    var Token = await AsyncStorage.getItem('accessToken');
    await fetch(baseURL + 'profile', {
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
          setUserData(res.data);
          setName(res.data?.name);
        }
      })
      .catch(error => {
        setIsLoading(false);

        console.error(error);
      });
  };

  useEffect(() => {
    getCountriesData();
  }, []);

  const gotoOpenPhoneNumberModal = () => {
    setOpenPhoneNumberModal(true);
  };

  const gotoclosePhoneNumberModal = () => {
    setOpenPhoneNumberModal(false);
  };

  const updateMobileNumberCode = text => {
    setMobileNumberCode(text);
  };

  const getCountriesData = async () => {
    await fetch(baseURL + 'countries', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === true) {
          setCountriesData(res.data);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const updateProfile = async () => {
    setIsLoading(true);
    var formData = new FormData();
    formData.append('_method', 'put');
    formData.append('name', name ? name : userData?.name);
    formData.append('gender', userData.gender);
    if (profilePhoto) {
      formData.append('profile_image', {
        uri: profilePhoto.uri,
        type: profilePhoto.type,
        name: profilePhoto.fileName,
      });
    }
    var Token = await AsyncStorage.getItem('accessToken');

    await fetch(baseURL + 'update_profile', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + Token,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(res => res.json())
      .then(res => {
        setIsLoading(false);
        if (res.status == true) {
          showMessage({
            message: res.message,
            floating: true,
            position: 'top',
            icon: 'success',
            type: 'success',
          });
          getProfileData(Token);
        } else {
          handleApiError(res);
        }
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const getProfileData = async Token => {
    setIsLoading(true);
    await fetch(baseURL + 'profile', {
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
          AsyncStorage.setItem('userData', JSON.stringify(res.data));
          navigation.navigate(routes.Profile);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const selectImgFromCamera = () => {
    const options = {
      title: 'Take Picture',
      mediaType: 'photo', // Specify media type
      maxWidth: 800, // Max width of the image
      maxHeight: 600, // Max height of the image
      quality: 1, // Image quality
    };
    launchCamera(options, response => {
      imageRef.current.close();
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        setProfilePhoto(response.assets[0]);
      }
    });
  };

  const selectImgFromGallery = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, response => {
      imageRef.current.close();
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        setProfilePhoto(response.assets[0]);
      }
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS == 'android' ? 0 : StatusBarHeight,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: '4%',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <ImageBackground
            source={icons.Bg}
            style={{height: 40, width: 40, justifyContent: 'center'}}>
            <Image
              source={icons.backIcon}
              style={{
                height: 16,
                width: 16,
                alignItems: 'center',
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
          </ImageBackground>
        </TouchableOpacity>
        <View>
          <Text
            style={{
              fontFamily: FontFamily.InterMedium,
              fontSize: responsiveFontSize(2),
              color: Colors.black,
              marginTop: 10,
            }}>
            {t('editProfile.editProfileTitle')}
          </Text>
        </View>
        <View>
          <ImageBackground
            source={icons.CartIconBg}
            style={{
              height: hp(4.57),
              width: hp(4.57),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </View>
      </View>

      <View
        style={{
          elevation: 6,
          shadowColor: 'black',
          shadowOffset: {width: -1, height: 4},
          shadowOpacity: 0.1,
          shadowRadius: 0,
          backgroundColor: 'lightgray',
          width: '100%',
          height: 2,
          marginTop: '4%',
        }}
      />

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View>
          <View
            style={{
              backgroundColor: Colors.white,
              alignSelf: 'center',
              marginTop: '4%',
            }}>
            {!profilePhoto ? (
              <Image
                source={{
                  uri: userData?.profile_image
                    ? uploads_url + userData?.profile_image
                    : images.profileDummy,
                }}
                style={{
                  height: 150,
                  width: 150,
                  borderRadius: 80,
                }}
              />
            ) : (
              <Image
                source={{
                  uri: profilePhoto?.uri,
                }}
                style={{
                  height: 150,
                  width: 150,
                  borderRadius: 80,
                }}
              />
            )}

            <TouchableOpacity
              onPress={() => {
                imageRef.current.open();
              }}>
              <Image
                source={icons.cameraIcon}
                style={{
                  height: 50,
                  width: 50,
                  marginTop: -40,
                  marginLeft: 90,
                }}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.inputLabel]}>{t('editProfile.firstName')}</Text>
          <TextInput
            value={name}
            placeholder={t('editProfile.enterName')}
            placeholderTextColor={'#AAAAAA'}
            style={[styles.input]}
            onChangeText={text => {
              setName(text);
            }}
          />

          <Text style={[styles.inputLabel]}>{t('editProfile.phoneNo')}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginLeft: '4%',
            }}>
            <View
              style={{
                backgroundColor: '#EEEEEE',
                borderRadius: 30,
                width: '20%',
              }}>
              {/* <TouchableOpacity onPress={() => gotoOpenPhoneNumberModal()}> */}
              <View
                style={{
                  borderRadius: 30,
                  fontSize: responsiveFontSize(1.6),
                  fontFamily: FontFamily.InterRegular,
                  paddingHorizontal: '16%',
                  paddingVertical: '10%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  elevation: 6,
                  shadowColor: 'black',
                  shadowOffset: {width: -1, height: 4},
                  shadowOpacity: 0.1,
                  shadowRadius: 0,
                  backgroundColor: Colors.white,
                }}>
                <Text
                  style={{
                    color: Colors.black,
                    fontFamily: FontFamily.InterRegular,
                    fontSize: fontSize(13),
                  }}>
                  {'+'}
                  {mobileNumberCode ? mobileNumberCode : userData?.phonecode}
                </Text>
                {/* <Image
                  resizeMode="contain"
                  source={icons.downArrow}
                  style={{
                    height: 5,
                    width: 10,
                    tintColor: '#AAAAAA',
                  }}
                /> */}
              </View>
              {/* </TouchableOpacity> */}
            </View>
            <TextInput
              editable={false}
              value={phoneNumb ? phoneNumb : userData?.phone}
              maxLength={14}
              keyboardType="numeric"
              placeholder={t('editProfile.enterNumber')}
              placeholderTextColor={'#AAAAAA'}
              style={[styles.input, {width: '70%'}]}
              onChangeText={text => {
                setPhoneNumb(text);
              }}
            />
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: '4%',
            marginVertical: '10%',
          }}>
          <SignUpButton
            title={t('editProfile.updateNow')}
            onPress={() => {
              updateProfile();
            }}
          />
        </View>
      </ScrollView>

      <RBSheet
        ref={imageRef}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {},
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: deviceHeight / 4.5,
          },
        }}>
        <View style={{padding: '4%'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={[styles.midLabel]}>
              {t('editProfile.selectOption')}
            </Text>
            <TouchableOpacity onPress={() => imageRef.current.close()}>
              <Image source={icons.CloseIcon} style={{height: 16, width: 16}} />
            </TouchableOpacity>
          </View>
          <View style={{paddingVertical: '4%'}}>
            <TouchableOpacity onPress={() => selectImgFromCamera()}>
              <View style={[styles.smallBtn]}>
                <Text style={[styles.smallLabel]}>
                  {t('editProfile.selectFromCamera')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectImgFromGallery()}>
              <View style={[styles.smallBtn, {marginTop: '6%'}]}>
                <Text style={[styles.smallLabel]}>
                  {t('editProfile.selectFromGallery')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>

      {openPhoneNumberModal && (
        <BottomSheetCondition
          maxHeight={deviceHeight / 2}
          isOpen={openPhoneNumberModal}
          onClose={() => gotoclosePhoneNumberModal()}
          renderContent={() => {
            return (
              <View style={{padding: 10}}>
                <TextInput
                  placeholder={t('editProfile.search')}
                  placeholderTextColor={'#AAAAAA'}
                  value={search}
                  onChangeText={txt => {
                    setSearch(txt);
                  }}
                  style={{
                    height: 50,
                    backgroundColor: Colors.white,
                    fontFamily: FontFamily.Inter,
                  }}
                />

                <FlatList
                  nestedScrollEnabled={true}
                  data={contriesData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <Pressable
                      style={{
                        width: '85%',
                        alignSelf: 'center',
                        height: 50,
                        justifyContent: 'space-between',
                        borderBottomWidth: 0.5,
                        borderColor: '#8e8e8e',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        updateMobileNumberCode(item.phone_code);
                        gotoclosePhoneNumberModal();
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Image
                          resizeMode="contain"
                          source={{uri: item.flag}}
                          style={{height: 30, width: 30, marginRight: 10}}
                        />
                        <Text
                          style={{
                            color: '#000000',
                            fontFamily: 'Inter-Bold',
                            fontSize: 12,
                          }}>
                          {item.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#444444',
                            fontFamily: 'Inter-Regular',
                            fontSize: 14,
                          }}>
                          +
                        </Text>
                        <Text
                          style={{
                            color: '#444444',
                            fontFamily: 'Inter-Regular',
                            fontSize: 14,
                          }}>
                          {item.phone_code}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                />
              </View>
            );
          }}
        />
      )}
      <View>{isLoading && <Loader />}</View>
    </SafeAreaView>
  );
};
export default EditProfileScreen;

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: responsiveFontSize(1.6),
    marginHorizontal: '4%',
    fontFamily: FontFamily.InterMedium,
    color: Colors.black,
    marginTop: '4%',
  },
  smallBtn: {
    padding: '2%',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignItems: 'center',
  },
  smallLabel: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: FontFamily.InterMedium,
    color: Colors.white,
  },

  midLabel: {
    fontSize: responsiveFontSize(2),
    fontFamily: FontFamily.InterMedium,
    color: Colors.black,
  },
  input: {
    borderRadius: 30,
    fontSize: responsiveFontSize(1.6),
    fontFamily: FontFamily.InterRegular,
    elevation: 6,
    shadowColor: 'black',
    shadowOffset: {width: -1, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 0,
    backgroundColor: Colors.white,
    marginHorizontal: '4%',
    paddingLeft: 10,
    marginTop: '1%',
    color: Colors.black,
  },
  iconContainer: {
    padding: 5,
    position: 'absolute',
    right: 35,
    top: 10,
  },
  iconContainer1: {
    padding: 5,
    position: 'absolute',
    right: 35,
    top: 23,
  },
  container: {
    backgroundColor: Colors.primary,
    padding: 16,
  },
  dropdown: {
    height: hp(6),
    marginLeft: wp(5),
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 30,
    paddingHorizontal: wp(4),
    backgroundColor: Colors.primary,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'red',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: wp(8),
    fontSize: 14,
    color: 'white',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'white',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white',
  },
  iconStyle: {
    width: 25,
    height: 25,
    tintColor: 'white',
  },
  containerStyle: {
    borderRadius: 30,
  },
  skillList: {
    justifyContent: 'space-between',
    marginBottom: 16,
    marginHorizontal: '4%',
  },
  skillWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  skillContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 20,
    backgroundColor: '#fff',
    borderColor: '#E2E2E2',
  },
  selectedSkillContainer: {
    backgroundColor: '#754595',
  },
  skillText: {
    color: '#444444',
  },
  selectedText: {
    color: '#fff',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: -10,
  },
  optionText: {
    fontFamily: FontFamily.InterRegular,
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(1.6),
    paddingVertical: '3%',
  },
});
