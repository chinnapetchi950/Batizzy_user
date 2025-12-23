import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../helper/imageConstants';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import SignUpButton from '../../common/SignUpButton';
import {deviceHeight, StatusBarHeight} from '../../helper/constants';
import {useNavigation} from '@react-navigation/native';
import {routes} from '../../navigation/Routes';

const ForgotPassword = () => {
  const {t} = useTranslation();

  const navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      enabled
      keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}>
      <ScrollView>
        <View style={styles.logoContainer}>
          <Image source={icons.Intro1} style={styles.logo} />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{t('forgot_password.title')}</Text>
          <Text style={styles.descriptionText}>
            {t('forgot_password.description_text')}
          </Text>
          <Text style={styles.label}>{t('forgot_password.label_email')}</Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder={t('forgot_password.placeholder_email')}
            />
          </View>

          <View>
            <SignUpButton
              title={t('forgot_password.button_reset_password')}
              mainContainerStyle={styles.signInButton}
              onPress={() => {}}
            />
          </View>

          <TouchableOpacity
            style={styles.signUpContainer}
            onPress={() => {
              navigation.navigate(routes.Login);
            }}>
            <Text style={styles.signUpText}>
              {t('forgot_password.label_sign_in')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    padding: 20,
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    // elevation: 3,
  },
  title: {
    color: 'black',
    fontSize: responsiveScreenFontSize(3),
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter-Bold',
    marginTop: 30,
  },
  descriptionText: {
    color: '#444444',
    fontSize: responsiveScreenFontSize(1.6),
    textAlign: 'center',
    marginBottom: 35,
    fontFamily: 'Inter-Medium',
    marginTop: 15,
    lineHeight: 17,
  },
  label: {
    fontSize: responsiveScreenFontSize(2),
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#1D1D1D',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#00000036',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordinput: {
    width: '100%',
    height: 48,
    borderColor: '#00000036',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
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
  signInButton: {
    marginTop: 40,
  },
  signUpContainer: {
    marginTop: 20,
    marginBottom: '100%',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: responsiveScreenFontSize(2.4),
    color: '#1D1D1D',
    fontFamily: 'Inter-Bold',
  },
  signUpLink: {
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
