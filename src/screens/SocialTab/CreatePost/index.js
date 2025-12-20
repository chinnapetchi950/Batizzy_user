import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal as RNModal,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../helper/imageConstants';
import {hp, wp} from '../../../helper/constants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {launchCamera} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../../helper/ApiConstant';
import uploads_url from '../../../helper/ImageUrl';
import {routes} from '../../../navigation/Routes';
import Colors from '../../../helper/Colors';
import Icons from '../../../common/Icons';
import Loader from '../../../common/Loader';

const CreatePost = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const [isPhotos, setIsPhotos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isuserData, setUserData] = useState('');
  const [isSaySomethingText, setSaySomethingText] = useState('');
  const [isSaySomethingTextWithImage, setSaySomethingTextwithImage] =
    useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
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
        if (res.status === true) {
          setUserData(res.data);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const CreateSocialPost = async () => {
    var Token = await AsyncStorage.getItem('accessToken');
    setIsLoading(true);
    var formData = new FormData();
    formData.append(
      'content',
      isSaySomethingText ? isSaySomethingText : isSaySomethingTextWithImage,
    );
    isPhotos.forEach((image, index) => {
      formData.append('attachments[]', {
        uri: image.uri,
        type: image.type,
        name: image.name,
      });
    });

    await fetch(baseURL + 'posts', {
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
        if (res.status === true) {
          setIsLoading(false);
          showMessage({
            message: res.message,
            floating: true,
            position: 'top',
            icon: 'success',
            type: 'success',
          });
          navigation.navigate(routes.SocialTab);
        } else {
          handleApiError(res);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleApiError = response => {
    const {message, error_details} = response;
    showMessage({
      message: message || 'An error occurred',
      type: 'warning',
    });

    if (error_details) {
      Object.keys(error_details).forEach(field => {
        const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
        showMessage({
          message: `${formattedField}: ${error_details[field][0]}`,
          type: 'warning',
        });
      });
    }
  };

  const onPressPost = () => {
    if (isSaySomethingText === '' && isPhotos.length === 0) {
      showMessage({
        message: t('createPost.pleaseEnterSomething'),
        type: 'warning',
      });
    } else {
      CreateSocialPost();
    }
  };

  const TakePicture = async () => {
    if (isPhotos.length >= 10) {
      showMessage({
        message: t('createPost.noDataFound'),
        type: 'warning',
      });
      return;
    }
    const options = {
      title: 'Take Picture',
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 600,
      quality: 1,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        if (Array.isArray(response.assets) && response.assets.length > 0) {
          const newDocument = {
            uri: response.assets[0]?.uri,
            type: response.assets[0]?.type,
            name: response.assets[0]?.fileName,
          };

          setIsPhotos(prevDocuments => [...prevDocuments, newDocument]);
        }
      }
    });
  };

  const PickPhotos = async () => {
    if (isPhotos.length >= 10) {
      showMessage({
        message: t('createPost.max_photos_exceeded'),
        type: 'warning',
      });
      return;
    }
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.video],
        allowMultiSelection: true,
      });

      const newDocuments = results.map(result => ({
        uri: result.uri,
        type: result.type,
        name: result.name,
      }));
      if (isPhotos.length + newDocuments.length > 10) {
        showMessage({
          message: t('createPost.max_photos_exceeded'),
          type: 'warning',
        });
        return;
      }
      setIsPhotos(prevDocuments => [...prevDocuments, ...newDocuments]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      }
    }
  };

  const removePhoto = indexToRemove => {
    setIsPhotos(prevPhotos =>
      prevPhotos.filter((_, index) => index !== indexToRemove),
    );
  };

  const renderPhotos = () => {
    const photoCount = isPhotos.length;

    if (photoCount === 1) {
      return (
        <View>
          <TouchableOpacity onPress={() => removePhoto(0)}>
            <View style={{alignSelf: 'flex-end', marginRight: 20}}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'close-outline'}
                iconColor={Colors.primary}
                iconSize={26}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.singlePhotoContainer}
            onPress={() => setModalVisible(true)}>
            <Image source={{uri: isPhotos[0].uri}} style={styles.singleImage} />
          </TouchableOpacity>
        </View>
      );
    }

    const displayCount = Math.min(photoCount, 5);

    return (
      <View style={styles.photoGrid}>
        {isPhotos.slice(0, displayCount).map((photo, index) => (
          <View>
            <TouchableOpacity onPress={() => removePhoto(index)}>
              <View style={{alignSelf: 'flex-end', marginRight: '40%'}}>
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'close-outline'}
                  iconColor={Colors.primary}
                  iconSize={26}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              key={index}
              style={styles.photoContainer}
              onPress={() => setModalVisible(true)}>
              <Image source={{uri: photo.uri}} style={styles.gridImage} />
              {index === 4 && photoCount > 5 && (
                <View style={styles.photoCountOverlay}>
                  <Text style={styles.photoCountText}>+{photoCount - 4}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderPhotoModal = () => (
    <RNModal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setModalVisible(false)}>
        <Text style={styles.closeButtonText}>{t('createPost.title')}</Text>
      </TouchableOpacity>
      <ScrollView style={styles.modalContainer}>
        {isPhotos.map((photo, index) => (
          <View key={index} style={styles.modalPhotoContainer}>
            <Image source={{uri: photo.uri}} style={styles.modalImage} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removePhoto(index)}>
              <Image source={icons.closeBtn} style={styles.closeBtn} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </RNModal>
  );

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.subHeader}>
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
            <View>
              <Text style={styles.headerText}>{t('createPost.title')}</Text>
            </View>
          </View>
          <Pressable
            onPress={() => {
              onPressPost();
            }}>
            <Image
              resizeMode="contain"
              source={icons.sendMessageIcon}
              style={styles.sendMessageIcon}
            />
          </Pressable>
        </View>
        <View style={styles.profileContainer}>
          {isuserData.profile_image ? (
            <Image
              source={{uri: uploads_url + isuserData.profile_image}}
              style={styles.profileImage}
            />
          ) : (
            <Image source={icons.dummyUser} style={styles.profileImage} />
          )}

          <Text style={styles.profileName}>{isuserData?.name}</Text>
        </View>

        {isPhotos.length > 0 ? (
          <>
            <TextInput
              placeholder={t('createPost.saySomething')}
              placeholderTextColor="#393939"
              style={styles.photoInput}
              multiline
              textAlignVertical="top"
              onChangeText={text => {
                setSaySomethingTextwithImage(text);
              }}
            />
            {isPhotos.length > 0 && renderPhotos()}
          </>
        ) : (
          <TextInput
            placeholder={t('createPost.saySomething')}
            placeholderTextColor="#393939"
            style={styles.input}
            multiline
            textAlignVertical="top"
            onChangeText={text => {
              setSaySomethingText(text);
            }}
          />
        )}
        <View style={styles.galleryMainContainer}>
          <Pressable
            style={styles.GalleryContainer}
            onPress={() => {
              PickPhotos();
            }}>
            <Image source={icons.GalleryIcon} style={styles.GalleryIcon} />
            <Text style={styles.GalleryText}>{t('createPost.gallery')}</Text>
          </Pressable>
          <Pressable
            style={styles.GalleryContainer}
            onPress={() => {
              TakePicture();
            }}>
            <Image source={icons.Photoicon} style={styles.GalleryIcon} />
            <Text style={styles.GalleryText}>{t('createPost.photoVideo')}</Text>
          </Pressable>
        </View>
      </ScrollView>
      {renderPhotoModal()}
      {isLoading && <Loader />}
    </>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  sendMessageIcon: {
    height: hp(4.6),
    width: hp(4.6),
  },
  headerText: {
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    fontSize: responsiveFontSize(1.88),
    marginLeft: 16,
  },
  divider: {
    width: '100%',
    backgroundColor: 'lightgray',
    height: 4,
  },
  profileContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  GalleryContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  profileImage: {
    width: hp(4.85),
    height: hp(4.85),
    borderRadius: 30,
    marginRight: 16,
  },
  selectedImage: {
    width: '92%',
    height: hp(25),
    resizeMode: 'cover',
    marginHorizontal: 15,
  },
  profileName: {
    fontSize: responsiveFontSize(2.35),
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  GalleryText: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    color: '#1D1D1D',
    marginLeft: 16,
  },
  input: {
    flex: 1,
    color: '#6C6C6C',
    paddingHorizontal: wp(4),
    textAlignVertical: 'top',
    height: hp(55),
    backgroundColor: '#DADADA',
    marginTop: 10,
  },
  photoInput: {
    flex: 1,
    color: '#6C6C6C',
    paddingHorizontal: wp(4),
    textAlignVertical: 'top',
    marginTop: 10,
    marginBottom: 10,
  },
  GalleryIcon: {
    height: hp(2.7),
    width: hp(2.7),
  },
  galleryMainContainer: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
  },

  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  photoContainer: {
    width: '45%',
    aspectRatio: 1,
    marginBottom: '2%',
    marginRight: '2%',
  },
  singlePhotoContainer: {
    width: '92%',
    marginHorizontal: 15,
  },
  singleImage: {
    width: '100%',
    height: hp(40),
    resizeMode: 'cover',
    borderRadius: 15,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
  },
  photoCountOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  photoCountText: {
    color: 'white',
    fontSize: responsiveFontSize(2.35),
    fontFamily: 'Inter-SemiBold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Inter-SemiBold',
    color: 'blue',
    marginRight: 10,
  },
  modalPhotoContainer: {
    marginBottom: 20,
  },
  modalImage: {
    width: '100%',
    height: hp(40),
    resizeMode: 'cover',
    borderRadius: 5,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    // backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 5,
    borderRadius: 5,
  },
  closeBtn: {
    height: hp(3.2),
    width: hp(3.2),
  },
  removeButtonText: {
    color: 'white',
    fontSize: responsiveFontSize(1.5),
  },
  loderModalContainer: {
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
});
