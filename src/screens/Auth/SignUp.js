import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {fontSize, hp, StatusBarHeight, wp} from '../../helper/constants';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import RadioButton from '../../common/radioBtn';
import PasswordInput from '../../common/PasswordInput';
import {icons} from '../../helper/imageConstants';
import {routes} from '../../navigation/Routes';
import SignUpButton from '../../common/SignUpButton';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import baseURL from '../../helper/ApiConstant';
import Modal from 'react-native-modal';
import {navigate} from '../../navigation/rootNavigator';
import Input from '../../common/Input';
import FontFamily from '../../helper/FontFamily';
import Colors from '../../helper/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const searchRef = useRef();
  const [isFullName, setIsFullName] = useState('');
  const [isEmail, setIsEmail] = useState('');
  const [isNumber, setIsNumber] = useState('');
  const [selectedOption, setSelectedOption] = useState('male');
  const [isPassword, setIsPassword] = useState('');
  const [isConfirmPassword, setIsConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [clicked, setClicked] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('221');

  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    GetCountryCodeData();
  }, []);

  const GetCountryCodeData = async () => {
    await fetch(baseURL + 'countries', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === true) {
          setAllCountries(res.data);
          setFilteredCountries(res.data);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const CreateUser = async () => {
    const deviceToken = await AsyncStorage.getItem('deviceToken');

    setIsLoading(true);
    var formData = new FormData();
    formData.append('name', isFullName);
    formData.append('email', isEmail);
    formData.append('phone', isNumber);
    formData.append('phonecode', selectedCountry);
    formData.append('password', isPassword);
    formData.append('password_confirmation', isConfirmPassword);
    formData.append('gender', selectedOption);
    formData.append('fcm_token', deviceToken);

    await fetch(baseURL + 'register', {
      method: 'POST',
      headers: {
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
          navigate(routes.Login);
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
      message: message || t('common.errorOccurred'),
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

  const onSearch = search => {
    if (search !== '') {
      let tempData = allCountries.filter(item => {
        return item.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
      });
      setFilteredCountries(tempData);
    } else {
      setFilteredCountries(allCountries);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleOptionSelect = option => {
    setSelectedOption(option);
  };

  const onPressSignUp = () => {
    if (isFullName === '') {
      showMessage({
        message: t('signup.error_full_name'),
        type: 'warning',
      });
    } else if (!isNumber.match(/^[0-9]{10}$/)) {
      showMessage({
        message: t('signup.error_phone_number'),
        type: 'warning',
      });
    } else if (!isEmail.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
      showMessage({
        message: t('signup.error_email'),
        type: 'warning',
      });
    } else if (isPassword === '') {
      showMessage({
        message: t('signup.error_password'),
        type: 'warning',
      });
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        isPassword,
      )
    ) {
      showMessage({
        message: t('signup.error_password_strength'),
        type: 'warning',
      });
    } else if (isConfirmPassword === '') {
      showMessage({
        message: t('signup.error_confirm_password'),
        type: 'warning',
      });
    } else if (isPassword !== isConfirmPassword) {
      showMessage({
        message: t('signup.error_password_mismatch'),
        type: 'warning',
      });
    } else {
      CreateUser();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      enabled
      keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}>
      <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('signup.signup_title')}</Text>
        <Text style={styles.subTitle}>{t('signup.signup_subtitle')}</Text>
        <Text style={[styles.inputLabel]}>{t('signup.label_full_name')}</Text>
        <Input
          value={isFullName}
          title={t('signup.label_full_name')}
          placeholder={t('signup.placeholder_full_name')}
          onChangeText={text => {
            setIsFullName(text);
          }}
        />

        <View style={{marginTop: 10}}>
          <Text style={styles.inputLabel}>
            {t('signup.label_phone_number')}
          </Text>
          <View style={styles.phoneInputContainer}>
            <TouchableOpacity
              style={styles.countryCodeButton}
              onPress={() => {
                setClicked(!clicked);
              }}>
              <Text style={styles.countryCodeText}>
                {selectedCountry === '' ? '+91' : '+' + selectedCountry}
              </Text>
              <Image source={icons.downArrow} style={styles.downArrowIcon} />
            </TouchableOpacity>
            <TextInput
              keyboardType="numeric"
              placeholder={t('signup.placeholder_phone_number')}
              placeholderTextColor={'#AAAAAA'}
              style={styles.phoneNumberInput}
              onChangeText={text => {
                setIsNumber(text);
              }}
              maxLength={14}
            />
          </View>
          {clicked && (
            <View style={styles.countryListContainer}>
              <TextInput
                placeholder={t('signup.placeholder_search')}
                placeholderTextColor={'#AAAAAA'}
                value={search}
                ref={searchRef}
                onChangeText={txt => {
                  onSearch(txt);
                  setSearch(txt);
                }}
                style={styles.searchInput}
              />
              <FlatList
                nestedScrollEnabled={true}
                data={filteredCountries}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.countryItem}
                    onPress={() => {
                      setSelectedCountry(item.phone_code);
                      setClicked(false);
                      setSearch('');
                      setFilteredCountries(allCountries);
                    }}>
                    <View style={styles.countryItemLeft}>
                      <Image
                        resizeMode="contain"
                        source={{uri: item.flag}}
                        style={styles.countryFlag}
                      />
                      <Text style={styles.countryName}>{item.name}</Text>
                    </View>
                    <View style={styles.countryItemRight}>
                      <Text style={styles.countryCodePrefix}>+</Text>
                      <Text style={styles.countryCode}>{item.phone_code}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
        <View style={{marginTop: 10}}>
          <Text style={[styles.inputLabel]}>{t('signup.label_email')}</Text>
          <Input
            value={isEmail}
            title={t('signup.label_email')}
            placeholder={t('signup.placeholder_email')}
            onChangeText={text => {
              setIsEmail(text);
            }}
          />
        </View>

        <PasswordInput
          value={isPassword}
          title={t('signup.label_password')}
          placeholder={t('signup.placeholder_password')}
          onChangeText={text => {
            setIsPassword(text);
          }}
          secureTextEntry={!isPasswordVisible}
          onPressViewPassword={togglePasswordVisibility}
          source={isPasswordVisible ? icons.view : icons.hide}
        />
        <PasswordInput
          value={isConfirmPassword}
          title={t('signup.label_confirm_password')}
          placeholder={t('signup.placeholder_confirm_password')}
          onChangeText={text => {
            setIsConfirmPassword(text);
          }}
          secureTextEntry={!isConfirmPasswordVisible}
          onPressViewPassword={toggleConfirmPasswordVisibility}
          source={isConfirmPasswordVisible ? icons.view : icons.hide}
        />
        <Text style={styles.gengerText}>{t('signup.label_gender')}</Text>
        <View style={styles.radioContainer}>
          <RadioButton
            label={t('signup.label_gender_male')}
            selected={selectedOption === 'male'}
            onSelect={() => handleOptionSelect('male')}
          />
          <RadioButton
            label={t('signup.label_gender_female')}
            selected={selectedOption === 'female'}
            onSelect={() => handleOptionSelect('female')}
          />
          <RadioButton
            label={t('signup.label_gender_others')}
            selected={selectedOption === 'others'}
            onSelect={() => handleOptionSelect('others')}
          />
        </View>
        <View style={styles.btnContainer}>
          <SignUpButton
            title={t('signup.button_signup')}
            mainContainerStyle={styles.signInButton}
            onPress={onPressSignUp}
          />
        </View>
        <Pressable
          style={styles.signUpContainer}
          onPress={() => {
            navigation.navigate(routes.Login);
          }}>
          <Text style={styles.signUpText}>
            {t('signup.label_already_have_account')}{' '}
            <Text style={styles.signUpLink}>{t('signup.button_signin')}</Text>
          </Text>
        </Pressable>
      </ScrollView>
      <Modal isVisible={isLoading} style={styles.modalContainer}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={'small'} color={Colors.primary} />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: StatusBarHeight,
  },
  scroll: {
    padding: 15,
  },
  title: {
    color: 'black',
    fontSize: responsiveScreenFontSize(3),
    marginBottom: 12,
    fontFamily: 'Inter-Bold',
  },
  subTitle: {
    color: 'black',
    fontSize: responsiveScreenFontSize(1.7),
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: hp(2),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gengerText: {
    color: '#1D1D1D',
    fontSize: responsiveScreenFontSize(1.7),
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  signUpContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  signUpText: {
    fontSize: responsiveScreenFontSize(2),
    color: '#1D1D1D',
  },
  signUpLink: {
    color: '#000000',
    fontWeight: 'bold',
  },
  btnContainer: {
    marginTop: 30,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  countryCodeButton: {
    width: wp(20),
    borderWidth: 1,
    borderColor: '#00000036',
    borderRadius: 10,
    paddingHorizontal: wp(4),
    justifyContent: 'center',
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeText: {
    fontWeight: '600',
    color: '#AAAAAA',
    marginRight: 5,
  },
  downArrowIcon: {
    height: 5,
    width: 10,
    tintColor: 'black',
  },
  phoneNumberInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#00000036',
    borderRadius: 10,
    color: '#6C6C6C',
    fontSize: responsiveScreenFontSize(1.7),
    fontFamily: 'Inter-Regular',
    paddingVertical: hp(1.1),
    paddingHorizontal: wp(4),
  },
  countryListContainer: {
    elevation: 5,
    marginTop: 10,
    height: hp(26.5),
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  searchInput: {
    width: '90%',
    height: 50,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#8e8e8e',
    borderRadius: 7,
    marginTop: 20,
    paddingLeft: 20,
    color: '#AAAAAA',
  },
  countryItem: {
    width: '85%',
    alignSelf: 'center',
    height: 50,
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderColor: '#8e8e8e',
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  countryName: {
    color: '#000000',
    fontFamily: 'Inter-Bold',
    fontSize: fontSize(11),
    marginLeft: wp(2),
  },
  countryItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodePrefix: {
    color: '#444444',
    fontFamily: 'Inter-Regular',
    fontSize: fontSize(14),
  },
  countryCode: {
    color: '#444444',
    fontFamily: 'Inter-Regular',
    fontSize: fontSize(11),
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
  inputLabel: {
    color: Colors.inputLabel,
    fontSize: responsiveScreenFontSize(1.6),
    fontFamily: FontFamily.InterBold,
  },
});
