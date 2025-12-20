import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next'; // assuming import is handled
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import RBSheet from 'react-native-raw-bottom-sheet';
import {launchCamera} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import Modal from 'react-native-modal';
import InputField from '../../common/InputField';
import {hp, wp} from '../../helper/constants';
import {icons} from '../../helper/imageConstants';
import BottomSheetCondition from '../../common/BottomSheetCondition';
import baseURL from '../../helper/ApiConstant';
import uploads_url from '../../helper/ImageUrl';
import BigInputField from '../../common/BigInputField';
import {routes} from '../../navigation/Routes';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../../helper/Colors';
import Input from '../../common/Input';
import FontFamily from '../../helper/FontFamily';
import Loader from '../../common/Loader';
import {useLanguage} from '../../context/LanguageContext';

const PostRequest = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const bottomSheetRef = useRef();
  const route = useRoute();
  const EditAddress = route.params?.EditAddress;
  const latEdit = route.params?.latEdit;
  const langEdit = route.params?.langEdit;
  const [isPhotos, setIsPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishModalVisible, setIsPublishModalVisible] = useState(false);
  const [isRenovationSheetOpen, setIsRenovationSheetOpen] = useState(false);
  const [isScopeSheetOpen, setIsScopeSheetOpen] = useState(false);
  const [isTimeLineSheetOpen, setIsTimeLineSheetOpen] = useState(false);
  const [isExperienceSheetOpen, setIsExperienceSheetOpen] = useState(false);
  const [isSkillSheetOpen, setIsSkillSheetOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedConditionLabel, setSelectedConditionLabel] = useState(null);
  const [selectedTimelineLabel, setSelectedTimelineLabel] = useState(null);
  const [selectedExperienceLabel, setSelectedExperienceLabel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSelectedCategoryID, setSelectedCategoryID] = useState(null);
  const [isDescription, setIsDescription] = useState('');
  const [isCurrentAddress, setCurrentAddress] = useState(
    'Fetching location...',
  );
  const [isAllSkillsList, setIsAllSkillsList] = useState([]);
  const [isRenovationTypesList, setIsRenovationTypesList] = useState([]);
  const [isCurrentLocation, setCurrentLocation] = useState('');
  const [isuserData, setUserData] = useState('');
  const [isTitle, setTitle] = useState('');
  const [isBudget, setBudget] = useState('');
  const [isNextView, setIsNextView] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [displaySkillName, setDisplaySkillName] = useState(
    t('postrequest.skillsRequiredpl'),
  );
  const {selectedLanguage, changeLanguage} = useLanguage();

  const scopes = [
    {
      label: t('postrequest.scopes.small'),
      subTitle: t('postrequest.scopes.smallSubTitle'),
      value: 'small',
    },
    {
      label: t('postrequest.scopes.medium'),
      subTitle: t('postrequest.scopes.mediumSubTitle'),
      value: 'medium',
    },
    {
      label: t('postrequest.scopes.large'),
      subTitle: t('postrequest.scopes.largeSubTitle'),
      value: 'large',
    },
  ];

  const experienceData = [
    {
      label: t('postrequest.experience.entry'),
      subTitle: t('postrequest.experience.entrySubTitle'),
      value: 'entry',
    },
    {
      label: t('postrequest.experience.intermediate'),
      subTitle: t('postrequest.experience.intermediateSubTitle'),
      value: 'intermediate',
    },
    {
      label: t('postrequest.experience.expert'),
      subTitle: t('postrequest.experience.expertSubTitle'),
      value: 'expert',
    },
  ];

  const timeLineData = [
    {label: t('postrequest.timeLine.moreThan6Months'), value: 'more_than_6'},
    {label: t('postrequest.timeLine.threeToSixMonths'), value: '3_to_6'},
    {label: t('postrequest.timeLine.oneToThreeMonths'), value: '1_to_3'},
  ];

  useEffect(() => {
    getSkillData();
    getRenovationTypes();
    getUserData();
  }, []);

  const getSkillData = async () => {
    setIsLoading(true);
    var Token = await AsyncStorage.getItem('accessToken');
    await fetch(baseURL + 'skills', {
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
          setIsAllSkillsList(res.data);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const getRenovationTypes = async () => {
    setIsLoading(true);
    var Token = await AsyncStorage.getItem('accessToken');
    await fetch(baseURL + 'renovation_types', {
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
          setIsRenovationTypesList(res.data);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  };

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
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const createRenovationPost = async () => {
    var Token = await AsyncStorage.getItem('accessToken');
    var formData = new FormData();
    formData.append('title', isTitle);
    formData.append('renovation_type_id', isSelectedCategoryID);
    formData.append('scope_of_work', selectedCondition);
    formData.append('preferred_timeline', selectedTimeline);
    formData.append('experience', selectedExperience);
    formData.append('budget', isBudget);
    formData.append('description', isDescription);
    formData.append('location', EditAddress ? EditAddress : isCurrentAddress);
    formData.append('lat', latEdit ? latEdit : isCurrentLocation.latitude);
    formData.append('lng', langEdit ? langEdit : isCurrentLocation.longitude);

    isPhotos.forEach((image, index) => {
      formData.append('attachments[]', {
        uri: image.uri,
        type: image.type,
        name: image.name,
      });
    });
    selectedSkills.forEach((skillId, index) => {
      formData.append(`skills[${index}]`, skillId.id);
    });
    setIsLoading(true);
    await fetch(baseURL + 'renovation_posts', {
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
        if (res.status === true) {
          AsyncStorage.setItem('accessToken', res.token);
          showMessage({
            message: res.message,
            floating: true,
            position: 'top',
            icon: 'success',
            type: 'success',
          });
          setIsPublishModalVisible(false);
          navigation.goBack();
        } else {
          handleApiError(res);
        }
      })
      .catch(error => {
        setIsLoading(false);
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
        // Capitalize the first letter of the field for better readability
        const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
        showMessage({
          message: `${formattedField}: ${error_details[field][0]}`,
          type: 'warning',
        });
      });
    }
  };

  const onPressPublish = () => {
    if (isDescription === '') {
      showMessage({
        message: t('postrequest.validation.enterDescription'),
        type: 'danger',
      });
    } else if (isPhotos.length === 0) {
      showMessage({
        message: t('postrequest.validation.uploadImages'),
        type: 'danger',
      });
    } else {
      setIsPublishModalVisible(true);
    }
  };

  useEffect(() => {
    Geocoder.init('AIzaSyCceRTsiY-2UPVwytF6wytwaGmonWjvTHo');

    const fetchCurrentLocation = async () => {
      Geolocation.getCurrentPosition(
        async position => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          try {
            const json = await Geocoder.from({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            const address = json.results[0].formatted_address;
            setCurrentAddress(address);
          } catch (error) {
            console.error(error);
            setCurrentAddress(t('LocationNotfound'));
          }
        },
        error => {
          console.error(error);
          setCurrentAddress(t('LocationNotfound'));
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    };

    fetchCurrentLocation();
  }, [isCurrentAddress]);

  const renderRenovationItem = ({item}) => {
    return (
      <Pressable
        style={styles.categoryContainer}
        onPress={() => {
          setSelectedCategory(item.name); // Set selected category name
          setSelectedCategoryID(item.id); // Set selected category name
          toggleRenovationTypeSheet(); // Close the category sheet
        }}>
        <View style={styles.renovationTypeinnerContainer}>
          <Text style={styles.categoryText}>{item.name}</Text>
        </View>
        <Image
          tintColor={'#6B6B6B'}
          source={
            isSelectedCategoryID === item.id
              ? icons.radioFill
              : icons.radioBlank
          }
          style={styles.radioIcon}
        />
      </Pressable>
    );
  };

  const handleRenovationTypeReset = () => {
    setSelectedCategory(null); // Set selected category name
    setSelectedCategoryID(null); // Set selected category name
    toggleRenovationTypeSheet();
  };

  const handleScopeReset = () => {
    setSelectedCondition(null);
    setSelectedConditionLabel(null);
    toggleScopeSheet();
  };

  const handleExperienceReset = () => {
    setSelectedExperienceLabel(null);
    setSelectedExperience(null);
    toggleExperienceSheet();
  };

  const handleTimelineReset = () => {
    setSelectedTimelineLabel(null);
    setSelectedTimeline(null);
    toggleTimeLineSheet();
  };

  const toggleRenovationTypeSheet = () => {
    setIsRenovationSheetOpen(!isRenovationSheetOpen);
  };

  const toggleScopeSheet = () => {
    setIsScopeSheetOpen(!isScopeSheetOpen);
  };

  const toggleTimeLineSheet = () => {
    setIsTimeLineSheetOpen(!isTimeLineSheetOpen);
  };

  const toggleExperienceSheet = () => {
    setIsExperienceSheetOpen(!isExperienceSheetOpen);
  };

  const toggleSkillSheet = () => {
    setIsSkillSheetOpen(!isSkillSheetOpen);
  };

  const TakePicture = async () => {
    if (isPhotos.length >= 10) {
      showMessage({
        message: t('postrequest.uploadLimitExceeded'),
        type: 'warning',
      });
      return;
    }
    const options = {
      title: 'Take Picture',
      mediaType: 'photo', // Specify media type
      maxWidth: 800, // Max width of the image
      maxHeight: 600, // Max height of the image
      quality: 1, // Image quality
    };

    launchCamera(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        // Check if response.assets exists and is an array
        if (Array.isArray(response.assets) && response.assets.length > 0) {
          const newDocument = {
            uri: response.assets[0]?.uri,
            type: response.assets[0]?.type,
            name: response.assets[0]?.fileName,
          };

          setIsPhotos(prevDocuments => [...prevDocuments, newDocument]);
          bottomSheetRef.current.close();
        }
      }
    });
  };

  const PickPhotos = async () => {
    if (isPhotos.length >= 10) {
      showMessage({
        message: t('postrequest.uploadLimitExceeded'),
        type: 'warning',
      });
      return;
    }
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: true,
      });

      const currentImageCount = isPhotos.length;
      const selectedImageCount = results.length;

      // Check if adding the new images will exceed the limit of 10
      if (currentImageCount + selectedImageCount > 10) {
        showMessage({
          message: t('postrequest.uploadLimitExceeded'),
          type: 'warning',
        });
        return;
      }

      // If within the limit, add the selected images
      const newDocuments = results.map(result => ({
        uri: result.uri,
        type: result.type,
        name: result.name,
      }));

      setIsPhotos(prevDocuments => [...prevDocuments, ...newDocuments]);
      bottomSheetRef.current.close();
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      }
    }
  };

  const renderPhotos = ({item, index}) => (
    <View style={styles.imageContainer}>
      <Image source={{uri: item.uri}} style={styles.image} />
      <TouchableOpacity
        onPress={() => handleRemoveDocument(index)}
        style={styles.removeButton}>
        <Image
          resizeMode="contain"
          source={icons.closeBtn}
          style={styles.removeIcon}
        />
      </TouchableOpacity>
    </View>
  );

  const handleRemoveDocument = index => {
    const updatedDocuments = [...isPhotos];
    updatedDocuments.splice(index, 1);
    setIsPhotos(updatedDocuments);
  };

  const removeSkill = skill => {
    setSelectedSkills(prev => prev.filter(s => s.id !== skill.id));
    setIsAllSkillsList(prev => [...prev, skill]);
  };

  const addSkill = skill => {
    if (
      !selectedSkills.some(s => s.id === skill.id) &&
      selectedSkills.length < 5
    ) {
      setSelectedSkills(prev => [...prev, skill]);
      setIsAllSkillsList(prev => prev.filter(s => s.id !== skill.id));
    }
  };

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={styles.wrapper}>
          <StatusBar
            animated={true}
            backgroundColor={Colors.white}
            barStyle={'dark-content'}
          />
          <View style={styles.container}>
            <View style={styles.leftContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (isNextView) {
                    setIsNextView(false);
                  } else {
                    navigation.goBack();
                  }
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
              </TouchableOpacity>
              <Text style={styles.editProfileText}>
                {t('postrequest.title')}
              </Text>
            </View>
            <View style={styles.rightContainer}>
              <Pressable
                onPress={() => {
                  if (isNextView) {
                    onPressPublish();
                  } else {
                    if (isTitle === '') {
                      showMessage({
                        message: t('postrequest.enterTitle'),
                        type: 'danger',
                      });
                      return false;
                    } else if (!isSelectedCategoryID) {
                      showMessage({
                        message: t('postrequest.selectRenovationType'),
                        type: 'danger',
                      });
                      return false;
                    } else if (isBudget === '') {
                      showMessage({
                        message: t('postrequest.enterBudget'),
                        type: 'danger',
                      });
                      return false;
                    } else if (!selectedCondition) {
                      showMessage({
                        message: t('postrequest.selectScope'),
                        type: 'danger',
                      });
                      return false;
                    } else if (!selectedTimeline) {
                      showMessage({
                        message: t('postrequest.selectTimeline'),
                        type: 'danger',
                      });
                      return false;
                    } else if (!selectedExperience) {
                      showMessage({
                        message: t('postrequest.selectExperience'),
                        type: 'danger',
                      });
                      return false;
                    } else if (selectedSkills.length === 0) {
                      showMessage({
                        message: t('postrequest.selectSkills'),
                        type: 'danger',
                      });
                      return false;
                    }
                    setIsNextView(true);
                  }
                }}>
                <Text style={styles.publishText}>
                  {isNextView
                    ? t('postrequest.publish')
                    : t('postrequest.next')}
                </Text>
              </Pressable>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{paddingHorizontal: '4%'}}>
              {!isNextView && (
                <>
                  <View style={styles.userContainer}>
                    <View style={styles.header}>
                      {isuserData?.profile_image != null ? (
                        <Image
                          source={{uri: uploads_url + isuserData.profile_image}}
                          style={styles.profileImage}
                        />
                      ) : (
                        <Image
                          source={icons.dummyUser}
                          style={styles.profileImage}
                        />
                      )}
                      <View style={styles.headerText}>
                        <Text style={styles.name}>{isuserData?.name}</Text>
                        <View style={styles.listingInfo}>
                          <Text style={styles.listingText}>
                            {t('postrequest.requestProfessionalHelp')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <Text style={[styles.inputLabel]}>
                    {t('postrequest.titleForRenovationPost')}
                  </Text>
                  <Input
                    value={isTitle}
                    placeholder={t('postrequest.renovationPostTitle')}
                    onChangeText={text => {
                      setTitle(text);
                    }}
                    inputStyle={{borderWidth: 1, borderRadius: 10}}
                  />
                  <InputField
                    title={t('postrequest.typeOfRenovation')}
                    placeholder={t('postrequest.renovationTypes')}
                    isDropdown
                    editable={false}
                    onPress={() => {
                      toggleRenovationTypeSheet();
                    }}
                    value={selectedCategory}
                  />
                  <Text style={[styles.title]}>{t('postrequest.budget')}</Text>
                  <Input
                    keyboardType={'numeric'}
                    placeholder={t('postrequest.budget')}
                    onChangeText={text => {
                      setBudget(text);
                    }}
                  />
                  <InputField
                    title={t('postrequest.scopeOfWork')}
                    placeholder={t('postrequest.scopeOfWork')}
                    isDropdown
                    editable={false}
                    onPress={() => {
                      toggleScopeSheet();
                    }}
                    value={selectedConditionLabel}
                  />
                  <InputField
                    title={t('postrequest.preferredTimeline')}
                    placeholder={t('postrequest.preferredTimeline')}
                    isDropdown
                    editable={false}
                    onPress={() => {
                      toggleTimeLineSheet();
                    }}
                    value={selectedTimelineLabel}
                  />
                  <InputField
                    title={t('postrequest.experienceLevel')}
                    placeholder={t('postrequest.experienceLevel')}
                    isDropdown
                    editable={false}
                    onPress={() => {
                      toggleExperienceSheet();
                    }}
                    value={selectedExperienceLabel}
                  />
                  <InputField
                    value={displaySkillName}
                    title={t('postrequest.skillsRequiredForYourWork')}
                    placeholder={t('postrequest.skillsRequiredForYourWork')}
                    isDropdown
                    editable={false}
                    onPress={() => {
                      toggleSkillSheet();
                    }}
                  />
                </>
              )}
              {isNextView && (
                <>
                  <BigInputField
                    titleColor={'#4A4A4A'}
                    title={t('postrequest.describeWhatYouNeed')}
                    placeholder={t('postrequest.description')}
                    onChangeText={text => {
                      setIsDescription(text);
                    }}
                    value={isDescription}
                  />
                  <View style={{marginTop: hp(1.6), marginBottom: hp(1)}}>
                    <Text style={styles.AttachmentText}>
                      {t('postrequest.uploadAttachments')}
                    </Text>
                    <Pressable
                      style={styles.photoBox}
                      onPress={() => {
                        bottomSheetRef.current.open();
                      }}>
                      <View style={styles.iconContainer}>
                        <Image source={icons.AddPhoto} style={styles.addIcon} />
                      </View>
                      <Text style={styles.addPhotoText}>
                        {t('postrequest.uploadAndAttachFiles')}
                      </Text>
                    </Pressable>

                    <View style={styles.footer}>
                      <Text style={styles.footerText}>
                        {t('postrequest.chooseMainPhoto')}
                      </Text>
                      <Text style={styles.photoCount}>
                        {t('postrequest.photos')}: {isPhotos.length}/10
                      </Text>
                    </View>
                  </View>
                  {isPhotos.length > 0 && (
                    <FlatList
                      data={isPhotos}
                      renderItem={renderPhotos}
                      keyExtractor={item => item.name}
                      numColumns={3}
                      style={styles.uploadImageContainer}
                      contentContainerStyle={styles.gallery}
                    />
                  )}
                  <Text style={styles.locationText}>
                    {t('postrequest.location')}
                  </Text>
                  <View style={styles.addressContainer}>
                    <Text style={styles.AddressText}>
                      {EditAddress ? EditAddress : isCurrentAddress}
                    </Text>
                    <Pressable
                      onPress={() => {
                        navigation.navigate(routes.PostRequestEditLocation);
                      }}>
                      <Text style={styles.editText}>
                        {t('postrequest.edit')}
                      </Text>
                    </Pressable>
                  </View>
                  <Text style={styles.AgreementText}>
                    {t('postrequest.agreement')}
                  </Text>
                  <View style={styles.AgreementContainer}>
                    <Image source={icons.checkMark} style={styles.checkMark} />
                    <Text style={styles.AgreementSubText}>
                      {t('postrequest.agreementText')}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>

      {isRenovationSheetOpen && (
        <BottomSheetCondition
          maxHeight={500}
          isOpen={isRenovationSheetOpen}
          onClose={toggleRenovationTypeSheet}
          renderContent={() => {
            return (
              <View>
                <View style={styles.conditionHeader}>
                  <Text style={styles.cotegoryTitleText}>
                    {t('postrequest.typeOfRenovation')}
                  </Text>
                  <Pressable onPress={handleRenovationTypeReset}>
                    <Text style={styles.resetText}>
                      {t('newListing.reset')}
                    </Text>
                  </Pressable>
                </View>
                <View style={styles.separator} />
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={isRenovationTypesList}
                  keyExtractor={item => item.id}
                  renderItem={renderRenovationItem}
                  contentContainerStyle={styles.categorycontentContainerStyle}
                />
              </View>
            );
          }}
        />
      )}
      {isScopeSheetOpen && (
        <BottomSheetCondition
          maxHeight={500}
          isOpen={isScopeSheetOpen}
          onClose={toggleScopeSheet}
          renderContent={() => {
            return (
              <View style={styles.conditionContainer}>
                <View style={styles.conditionHeader}>
                  <Text style={styles.conditionHeaderText}>
                    {t('postrequest.scopeOfWork')}
                  </Text>
                  <Pressable onPress={handleScopeReset}>
                    <Text style={styles.resetText}>
                      {t('newListing.reset')}
                    </Text>
                  </Pressable>
                </View>
                <View style={styles.separator} />
                {scopes.map((condition, index) => {
                  return (
                    <View key={index} style={styles.row}>
                      <View>
                        <Text style={styles.conditionText}>
                          {condition.label}
                        </Text>
                        <Text style={styles.scopeSubText}>
                          {condition.subTitle}
                        </Text>
                      </View>
                      <Pressable
                        style={styles.radioButton}
                        onPress={() => {
                          setSelectedCondition(condition.value);
                          setSelectedConditionLabel(condition.label);
                          toggleScopeSheet();
                        }}>
                        <Image
                          tintColor={'#6B6B6B'}
                          source={
                            selectedCondition === condition.value
                              ? icons.radioFill
                              : icons.radioBlank
                          }
                          style={styles.radioIcon}
                        />
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            );
          }}
        />
      )}
      {isTimeLineSheetOpen && (
        <BottomSheetCondition
          maxHeight={500}
          isOpen={isTimeLineSheetOpen}
          onClose={toggleTimeLineSheet}
          renderContent={() => {
            return (
              <View style={styles.conditionContainer}>
                <View style={styles.conditionHeader}>
                  <Text style={styles.conditionHeaderText}>
                    {t('postrequest.scopeOfWork')}
                  </Text>
                  <Pressable onPress={handleTimelineReset}>
                    <Text style={styles.resetText}>
                      {t('newListing.reset')}
                    </Text>
                  </Pressable>
                </View>
                <View style={styles.separator} />
                {timeLineData.map((item, index) => {
                  return (
                    <View key={index} style={styles.row}>
                      <View>
                        <Text style={styles.conditionText}>{item.label}</Text>
                      </View>
                      <Pressable
                        style={styles.radioButton}
                        onPress={() => {
                          setSelectedTimeline(item.value);
                          setSelectedTimelineLabel(item.label);
                          toggleTimeLineSheet();
                        }}>
                        <Image
                          tintColor={'#6B6B6B'}
                          source={
                            selectedTimeline === item.value
                              ? icons.radioFill
                              : icons.radioBlank
                          }
                          style={styles.radioIcon}
                        />
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            );
          }}
        />
      )}
      {isExperienceSheetOpen && (
        <BottomSheetCondition
          maxHeight={500}
          isOpen={isExperienceSheetOpen}
          onClose={toggleExperienceSheet}
          renderContent={() => {
            return (
              <View style={styles.conditionContainer}>
                <View style={styles.conditionHeader}>
                  <Text style={styles.conditionHeaderText}>
                    {t('myRequestDetails.experienceLevel')}
                  </Text>
                  <Pressable onPress={handleExperienceReset}>
                    <Text style={styles.resetText}>
                      {t('newListing.reset')}
                    </Text>
                  </Pressable>
                </View>
                <View style={styles.separator} />
                {experienceData.map((item, index) => {
                  return (
                    <View key={index} style={styles.row}>
                      <View>
                        <Text style={styles.conditionText}>{item.label}</Text>
                        <Text style={styles.subTitle}>{item.subTitle}</Text>
                      </View>
                      <Pressable
                        style={styles.radioButton}
                        onPress={() => {
                          setSelectedExperience(item.value);
                          setSelectedExperienceLabel(item.label);
                          toggleExperienceSheet();
                        }}>
                        <Image
                          tintColor={'#6B6B6B'}
                          source={
                            selectedTimeline === item.value
                              ? icons.radioFill
                              : icons.radioBlank
                          }
                          style={styles.radioIcon}
                        />
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            );
          }}
        />
      )}
      {isSkillSheetOpen && (
        <BottomSheetCondition
          maxHeight={500}
          isOpen={isSkillSheetOpen}
          onClose={toggleSkillSheet}
          renderContent={() => {
            return (
              <ScrollView scrollEnabled style={{flex: 1}}>
                <View style={styles.conditionContainer}>
                  <View style={styles.conditionHeader}>
                    <Text style={styles.conditionHeaderText}>
                      {t('postrequest.skills')}
                    </Text>
                  </View>
                  <View style={styles.separator} />
                  <View style={styles.skillContainer}>
                    <Text style={styles.skillTitle}>
                      {t('postrequest.skillsRequired')}
                    </Text>
                    <View style={styles.infoBox}>
                      <Text style={styles.infoText}>
                        {t('postrequest.bestResults')}
                      </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <ScrollView
                        nestedScrollEnabled
                        numColumns={2}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.selectedSkillsContainer}>
                        {selectedSkills.map((skill, index) => (
                          <>
                            <View key={index} style={styles.selectedSkill}>
                              <Text style={styles.selectedSkillText}>
                                {selectedLanguage == 'fr'
                                  ? skill?.name_fr
                                  : selectedLanguage == 'de'
                                  ? skill?.name_de
                                  : skill?.name}
                              </Text>
                            </View>
                            <Pressable onPress={() => removeSkill(skill)}>
                              <Image
                                source={icons.skillCloseBtn}
                                style={styles.skillcloseIcon}
                              />
                            </Pressable>
                          </>
                        ))}
                      </ScrollView>
                    </View>
                    <Text style={styles.skillTitle}>
                      {t('postrequest.popularSkills')}
                    </Text>
                    <View style={styles.popularSkillsContainer}>
                      {isAllSkillsList.map((skill, index) => (
                        <TouchableOpacity
                          key={index + 1}
                          style={styles.popularSkill}
                          onPress={() => addSkill(skill)}>
                          <Text style={styles.popularSkillText}>
                            {selectedLanguage == 'fr'
                              ? skill?.name_fr
                              : selectedLanguage == 'de'
                              ? skill?.name_de
                              : skill?.name}
                          </Text>
                          <Image
                            source={icons.addIcon}
                            style={styles.addIconContainer}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <Pressable
                    style={styles.applyContainer}
                    onPress={() => {
                      setIsSkillSheetOpen(false);
                      const namesString = selectedSkills
                        .map(item => item.name)
                        .join(', ');

                      setDisplaySkillName(namesString);
                    }}>
                    <Text style={styles.applyText}>
                      {t('postrequest.apply')}
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
            );
          }}
        />
      )}
      <RBSheet
        ref={bottomSheetRef}
        closeOnPressMask={true}
        customStyles={{
          container: {
            borderTopLeftRadius: wp(8),
            borderTopRightRadius: wp(8),
            height: hp(18),
          },
        }}>
        <TouchableOpacity
          onPress={() => {
            bottomSheetRef.current.close();
          }}
          style={styles.closeButton}>
          <Image source={icons.closeBtn} style={styles.closeIcon} />
        </TouchableOpacity>
        <View style={styles.rbSheetseparator} />
        <TouchableOpacity
          onPress={() => {
            TakePicture();
            bottomSheetRef.current.close();
          }}>
          <Text style={styles.optionText}>{t('postrequest.takePictures')}</Text>
        </TouchableOpacity>
        <View style={styles.rbSheetseparator} />
        <TouchableOpacity
          onPress={() => {
            PickPhotos();
            bottomSheetRef.current.close();
          }}>
          <Text style={styles.optionText}>
            {t('postrequest.selectPictures')}
          </Text>
        </TouchableOpacity>
      </RBSheet>
      <Modal isVisible={isPublishModalVisible} style={styles.modalContainer}>
        <Pressable
          style={styles.publishCloseBtnContainer}
          onPress={() => {
            setIsPublishModalVisible(false);
          }}>
          <Image
            resizeMode="contain"
            source={icons.closeBtn}
            style={styles.closePublishModalIcon}
          />
        </Pressable>
        <View style={styles.publishModalContainer}>
          <Text style={styles.SuccesfullText}>
            {t('postrequest.whatHappensAfterPost')}
          </Text>
          <Text style={styles.SuccesfullSubText}>
            {t('postrequest.receiveProposals')}
          </Text>
          <TouchableOpacity
            style={styles.postRequestbtnContainer}
            onPress={() => {
              createRenovationPost();
            }}>
            <Text style={styles.okButtonText}>
              {t('postrequest.postRequest')}
            </Text>
          </TouchableOpacity>
          <Pressable
            style={styles.editRequestbtnContainer}
            onPress={() => {
              setIsPublishModalVisible(false);
            }}>
            <Text style={styles.editButtonText}>
              {t('postrequest.editRequest')}
            </Text>
          </Pressable>
        </View>
      </Modal>
      {isLoading && <Loader />}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4%',
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
    marginLeft: '10%',
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
    // marginBottom: hp(2.4),
  },
  profileImage: {
    width: hp(5),
    height: hp(5),
    borderRadius: 25,
    marginRight: 12,
  },
  listIcon: {
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: 'contain',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: responsiveFontSize(2.35),
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  listingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listingText: {
    fontSize: responsiveFontSize(1.41),
    fontFamily: 'Inter-Regular',
    color: '#393939',
    marginRight: 4,
  },
  photoBox: {
    height: hp(12.25),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#00000036',
  },
  iconContainer: {
    width: hp(4.8),
    height: hp(4.8),
    borderRadius: 25,
    backgroundColor: '#ffd700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addIcon: {
    height: hp(2.5),
    width: hp(2.5),
  },
  addPhotoText: {
    fontSize: responsiveFontSize(1.41),
    fontFamily: 'Inter-Regular',
    color: '#393939',
    textAlign: 'center',
    marginHorizontal: wp(15),
  },
  AttachmentText: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    color: '#4A4A4A',
    marginBottom: hp(1.2),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: responsiveFontSize(1.41),
    fontFamily: 'Inter-Regular',
    color: '#393939',
  },
  photoCount: {
    fontSize: responsiveFontSize(1.41),
    fontFamily: 'Inter-Regular',
    color: '#393939',
  },
  locationText: {
    fontSize: responsiveFontSize(1.7),
    fontFamily: 'Inter-SemiBold',
    color: '#4A4A4A',
  },
  AgreementText: {
    fontSize: responsiveFontSize(1.7),
    fontFamily: 'Inter-SemiBold',
    color: '#4A4A4A',
    marginTop: hp(2),
  },
  AgreementSubText: {
    fontSize: responsiveFontSize(1.41),
    fontFamily: 'Inter-Medium',
    color: '#6B6B6B',
    marginLeft: 8,
    marginRight: 20,
  },
  AgreementContainer: {
    flexDirection: 'row',
    marginTop: hp(1.2),
  },
  AddressText: {
    fontSize: responsiveFontSize(1.41),
    fontFamily: 'Inter-Medium',
    color: '#6B6B6B',
    width: '80%',
  },
  editText: {
    fontSize: responsiveFontSize(1.41),
    fontFamily: 'Inter-SemiBold',
    color: '#754595',
    marginLeft: 5,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cotegoryTitleText: {
    fontSize: responsiveFontSize(1.88),
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  categoryIcon: {
    height: 24,
    width: 24,
  },
  checkMark: {
    height: 24,
    width: 24,
  },
  categoryBG: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    color: '#1D1D1D',
    marginLeft: wp(4),
  },
  renovationTypeinnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2.4),
    justifyContent: 'space-between',
  },
  categorycontentContainerStyle: {
    paddingBottom: 40,
  },
  conditionContainer: {
    paddingHorizontal: 10,
  },
  conditionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conditionHeaderText: {
    fontSize: responsiveFontSize(1.88),
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  resetText: {
    fontSize: responsiveFontSize(1.41),
    fontFamily: 'Inter-Regular',
    color: '#754595',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp(0.8),
  },
  conditionText: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    color: '#1D1D1D',
  },
  scopeSubText: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    color: '#6B6B6B',
  },
  radioButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioIcon: {
    height: 20,
    width: 20,
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  rbSheetcontainer: {
    borderTopLeftRadius: wp(8),
    borderTopRightRadius: wp(8),
    height: hp(20),
  },
  closeButton: {
    marginHorizontal: wp(5),
    alignItems: 'flex-end',
    marginTop: hp(1),
  },
  closeIcon: {
    height: hp(5),
    width: hp(5),
  },
  skillcloseIcon: {
    height: hp(2.4),
    width: hp(2.4),
    position: 'absolute',
    right: 0,
  },
  addIconContainer: {
    height: 14,
    width: 14,
  },
  rbSheetseparator: {
    borderWidth: 1,
    borderColor: 'lightgray',
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    color: '#000000',
    fontSize: responsiveFontSize(2.35),
    marginHorizontal: wp(5),
  },
  gallery: {
    paddingHorizontal: wp(2),
  },
  imageContainer: {
    position: 'relative',
    margin: wp(1),
  },
  uploadImageContainer: {
    marginBottom: hp(1.5),
  },
  image: {
    height: hp(11),
    width: hp(11),
    borderRadius: wp(2),
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  removeIcon: {
    height: hp(3),
    width: hp(3),
  },
  closePublishModalIcon: {
    height: hp(4),
    width: hp(4),
  },
  publishCloseBtnContainer: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginRight: 20,
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
  publishModalContainer: {
    width: '85%',
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  SuccesfullText: {
    color: '#000000',
    fontFamily: 'Inter-SemiBold',
    fontSize: responsiveFontSize(1.88),
    textAlign: 'center',
    marginTop: 20,
  },
  SuccesfullSubText: {
    color: '#2D2C2C',
    fontFamily: 'Inter-Regular',
    fontSize: responsiveFontSize(1.41),
    textAlign: 'center',
    marginTop: 20,
  },
  okButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: responsiveFontSize(2.35),
  },
  editButtonText: {
    color: '#000000',
    fontFamily: 'Inter-SemiBold',
    fontSize: responsiveFontSize(2.35),
  },
  postRequestbtnContainer: {
    backgroundColor: '#754595',
    width: '80%',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 30,
    marginBottom: 10,
  },
  editRequestbtnContainer: {
    width: '80%',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 30,
    marginBottom: 20,
    borderWidth: 1,
  },
  skillContainer: {
    // padding: 16,
    // backgroundColor: '#F5F5F5',
  },
  skillTitle: {
    marginBottom: 8,
    color: '#4A4A4A',
    fontFamily: 'Inter-Medium',
    fontSize: responsiveFontSize(1.64),
  },
  infoBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#00000036',
  },
  infoText: {
    color: '#666',
  },
  selectedSkillsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  selectedSkill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#754595',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
    marginHorizontal: 10,
  },
  selectedSkillText: {
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.88),
    marginRight: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  popularSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  popularSkill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  popularSkillText: {
    marginRight: 4,
    color: '#444444',
    fontFamily: 'Inter-Medium',
    fontSize: responsiveFontSize(1.88),
  },
  applyText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: responsiveFontSize(1.88),
  },
  applyContainer: {
    backgroundColor: '#754595',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 30,
  },
  inputstyle: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    color: '#6C6C6C',
    fontSize: responsiveScreenFontSize(1.7),
    fontFamily: 'Inter-Regular',
    paddingTop: Platform.OS === 'android' ? '2%' : '3%',
    height: 50,
    paddingVertical: Platform.OS === 'android' ? '2%' : '3%',
    marginTop: '4%',
  },
  title: {
    color: '#1D1D1D',
    fontSize: responsiveScreenFontSize(1.8),
    fontFamily: 'Inter-SemiBold',
    marginTop: '4%',
  },
  inputLabel: {
    color: Colors.inputLabel,
    fontSize: responsiveScreenFontSize(1.6),
    fontFamily: FontFamily.InterBold,
  },
});

export default PostRequest;
