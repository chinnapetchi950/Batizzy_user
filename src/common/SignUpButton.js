import {hp} from '../helper/constants';
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';

const SignUpButton = ({title, onPress, mainContainerStyle, disabled}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.mainContainer, mainContainerStyle]}
      onPress={onPress}>
      <Text style={styles.textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SignUpButton;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: responsiveScreenFontSize(2.4),
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
});
