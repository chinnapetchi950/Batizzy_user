import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import ModalDropdown from 'react-native-modal-dropdown';
import {icons} from '../../helper/imageConstants';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import SignUpButton from '../../common/SignUpButton';
import {deviceHeight, hp, StatusBarHeight} from '../../helper/constants';
import {useNavigation} from '@react-navigation/native';
import {routes} from '../../navigation/Routes';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../helper/ApiConstant';
import Colors from '../../helper/Colors';
import FontFamily from '../../helper/FontFamily';
import Icons from '../../common/Icons';
import LanguageData from '../../i18n/LanguageData';
import {useLanguage} from '../../context/LanguageContext';
import Loader from '../../common/Loader';
import {CommonActions} from '@react-navigation/native';

const Login = () => {
  const {t} = useTranslation();
  const dropdownRef = useRef();

  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmail, setIsEmail] = useState('');
  const [isPassword, setIsPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [storedLanguage, setStoredLanguage] = useState({});
  const {selectedLanguage, changeLanguage} = useLanguage();

  const UserLogin = async () => {
  try {
    const deviceToken = await AsyncStorage.getItem('deviceToken');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('email', isEmail);
    formData.append('password', isPassword);
    formData.append('fcm_token', deviceToken);

    console.log('📤 Login Request Payload:', {
      email: isEmail,
      password: isPassword,
      fcm_token: deviceToken,
    });

    const response = await fetch(baseURL + 'login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    console.log('📡 HTTP Status:', response.status);

    const res = await response.json();

    console.log('✅ API Response:', res);

    setIsLoading(false);

    if (res.status === true) {
      AsyncStorage.setItem('accessToken', res.token);
      AsyncStorage.setItem('userId', String(res.user.id));
      AsyncStorage.setItem('userData', JSON.stringify(res.user));

      showMessage({
        message: t('login.successMessage'),
        floating: true,
        position: 'top',
        icon: 'success',
        type: 'success',
      });

      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: routes.TabNavigator }],
        })
      );
    } else {
      console.log('❌ API Error Response:', res);
      handleApiError(res);
    }
  } catch (error) {
    setIsLoading(false);

    console.log('🚨 Login API Crash:', error);
    console.log('🚨 Error Message:', error?.message);
    console.log('🚨 Error Stack:', error?.stack);

    showMessage({
      message: 'Network error. Please try again.',
      type: 'danger',
    });
  }
};


  const handleApiError = response => {
    const {message, error_details} = response;

    showMessage({
      message: message || t('common.errorOccurred'),
      type: 'danger',
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

  const onPressLogin = () => {
    if (!isEmail.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
      showMessage({
        message: t('login.invalidEmail'),
        type: 'danger',
      });
    } else if (isPassword === '') {
      showMessage({
        message: t('login.emptyPassword'),
        type: 'danger',
      });
    } else {
      UserLogin();
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onSelectLanguage = async (index, value, image, code) => {
    setStoredLanguage({image: image, text: value});
    changeLanguage(code);
    dropdownRef.current.hide();
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      enabled
      keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}>
      <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <View
        style={{
          paddingHorizontal: 10,
          paddingTop: 10,
          flexGrow: 1,
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View></View>
        <ModalDropdown
          ref={dropdownRef}
          dropdownStyle={[styles.dropdownViewLayout]}
          showsVerticalScrollIndicator={false}
          options={LanguageData}
          onSelect={(index, value, image, code) =>
            onSelectLanguage(index, value, image, code)
          }
          renderRow={(option, index, isSelected) => (
            <TouchableOpacity
              style={[
                styles.renderMainView,
                {
                  backgroundColor: isSelected ? '#DDDDDD' : 'transparent',
                },
              ]}
              onPress={() =>
                onSelectLanguage(index, option.text, option.image, option.code)
              }>
              <Image
                resizeMode="contain"
                source={option.image}
                style={[styles.dropdownLang]}
              />
              <Text style={[styles.langText]}>{option.text}</Text>
            </TouchableOpacity>
          )}
          renderButtonText={({text}) => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.langText]}>{text}</Text>
            </View>
          )}
          defaultValue={storedLanguage?.text || t('language.default')}>
          <View style={[styles.viewLangContainer]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                resizeMode="contain"
                source={storedLanguage?.image || icons.english}
                style={[styles.dropdownLang]}
              />
              <Text style={[styles.langText, {paddingLeft: 6}]}>
                {storedLanguage?.text || t('language.default')}
              </Text>
            </View>
            <Icons
              iconSetName={'FontAwesome6'}
              iconName={'caret-down'}
              iconColor={Colors.primary}
              iconSize={20}
            />
          </View>
        </ModalDropdown>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}
  keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image source={icons.Intro1} style={styles.logo} />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{t('login.title')}</Text>
          <Text style={styles.label}>{t('login.emailLabel')}</Text>
          <View>
            <TextInput
              value={isEmail}
              style={styles.input}
              placeholder={t('login.emailPlaceholder')}
              onChangeText={text => {
                setIsEmail(text);
              }}
              placeholderTextColor={Colors.lightPlaceholder}
            />
          </View>
          <Text style={styles.label}>{t('login.passwordLabel')}</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              value={isPassword}
              style={styles.passwordinput}
              placeholder={t('login.passwordPlaceholder')}
              secureTextEntry={!isPasswordVisible}
              onChangeText={text => {
                setIsPassword(text);
              }}
              placeholderTextColor={Colors.lightPlaceholder}
            />
            <Pressable
              style={styles.visibleContainer}
              onPress={togglePasswordVisibility}>
              <Image
                resizeMode="contain"
                source={isPasswordVisible ? icons.view : icons.hide}
                style={styles.icon}
              />
            </Pressable>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.ForgotPassword);
            }}>
            <Text style={styles.forgotPassword}>
              {t('login.forgotPassword')}
            </Text>
          </TouchableOpacity>
          <View>
            <SignUpButton
              title={t('login.signInButton')}
              onPress={onPressLogin}
            />
          </View>
          <TouchableOpacity
            style={styles.signUpContainer}
            onPress={() => {
              navigation.navigate(routes.SignUp);
            }}>
            <Text style={styles.signUpText}>
              {t('login.newUser')}{' '}
              <Text style={styles.signUpLink}>{t('login.signUpLink')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {isLoading && <Loader />}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: StatusBarHeight,
  },
  logoContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  logo: {
    height: deviceHeight * 0.3,
    resizeMode: 'contain',
    marginTop: 30,
  },
  formContainer: {
    //flex: 1,
    padding: 20,
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    //elevation: 3,
    marginBottom: 30,
  },
  title: {
    color: Colors.black,
    fontSize: responsiveScreenFontSize(3),
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: FontFamily.InterBold,
    //marginTop: 10,
  },
  label: {
    fontSize: responsiveScreenFontSize(2),
    marginVertical: 10,
    color: Colors.inputLabel,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#00000036',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: Colors.fontDarkGray,
    fontFamily: FontFamily.InterMedium,
    fontSize: responsiveScreenFontSize(1.8),
  },
  passwordinput: {
    width: '100%',
    height: 48,
    borderColor: '#00000036',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: Colors.fontDarkGray,
    fontFamily: FontFamily.InterMedium,
    fontSize: responsiveScreenFontSize(1.8),
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visibleContainer: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  icon: {
    height: 20,
    width: 20,
  },
  forgotPassword: {
    textAlign: 'right',
    marginBottom: 20,
    color: '#1D1D1D',
    fontSize: responsiveScreenFontSize(2),
  },
  signUpContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: responsiveScreenFontSize(2),
    color: '#1D1D1D',
  },
  signUpLink: {
    color: '#000000',
    fontWeight: 'bold',
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
  dropdownViewLayout: {
    borderRadius: 10,
    color: Colors.fontGray,
    borderColor: Colors.borderLight,
    borderWidth: 0.5,
    height: 'auto',
  },
  dropdownLang: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  viewLangContainer: {
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: Colors.primary,
    borderWidth: 0.5,
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
  renderMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  langText: {
    color: Colors.fontDarkGray,
    fontFamily: FontFamily.InterMedium,
    fontSize: 12,
    paddingHorizontal: 10,
  },
});

export default Login;
