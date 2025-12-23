import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {hp, wp} from '../helper/constants';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import Colors from '../helper/Colors';
import FontFamily from '../helper/FontFamily';

const PasswordInput = ({
  onChangeText,
  secureTextEntry,
  onPressViewPassword,
  source,
  placeholder,
  value,
  title,
}) => {
  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.container}>
        <TextInput
          value={value}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={'#2B2A2A'}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
        />
        <TouchableOpacity
          onPress={onPressViewPassword}
          style={styles.iconContainer}>
          <Image tintColor="#5F6368e" source={source} style={styles.eyeIcon} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:hp(1),
    marginBottom: hp(2),
  },
  title: {
    color: Colors.inputLabel,
    fontFamily: FontFamily.InterBold,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 10,
    paddingLeft: 10  
  },
  iconContainer: {
    padding: 5,
    position: 'absolute',
    right: 10,
  },
  eyeIcon: {
    height:22,
    width:22
  },
});

export default PasswordInput;
