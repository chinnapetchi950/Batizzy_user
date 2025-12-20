import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Colors from '../helper/Colors';
import FontFamily from '../helper/FontFamily';
const Input = ({
  isShowPassword,
  isVisible,
  placeholderText,
  secureTextEntry,
  forwardRef,
  onSubmitEditing,
  blurOnSubmit,
  onChangeText,
  value,
  validateMesssage,
  isValidationShow,
  keyboardType,
  maxLength,
  autoCapitalize,
  inputStyle,
  returnKeyType,
  multiline,
  numberOfLines,
  textAlignVertical,
  editable,
  placeholderStyle,
  label,
  height,
  ...props
}) => {
  return (
    <View {...props}>
      <View style={[ComponentStyle.InputContainer]}>
        <TextInput
          style={[
            ComponentStyle.inputText,
            inputStyle,
            {
              borderColor: isValidationShow ? Colors.red : Colors.gray,
            },
          ]}
          value={value}
          returnKeyType={returnKeyType}
          ref={forwardRef}
          onSubmitEditing={onSubmitEditing}
          editable={editable}
          placeholder={placeholderText}
          placeholderTextColor={Colors.lightPlaceholder}
          placeholderStyle={placeholderStyle}
          blurOnSubmit={blurOnSubmit}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={textAlignVertical}
          secureTextEntry={secureTextEntry}
          height={height}
          {...props}
        />
      </View>
      <View>
        {isValidationShow ? (
          <Text style={[ComponentStyle.errorText]}>{validateMesssage}</Text>
        ) : null}
      </View>
    </View>
  );
};
export default Input;

const ComponentStyle = StyleSheet.create({
  InputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    color: '#FF0000',
    padding: 5,
  },
});
