import React from 'react';
import {wp} from '../helper/constants';
import {icons} from '../helper/imageConstants';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';

const {TouchableOpacity, Text, Image, StyleSheet} = require('react-native');

const RadioButton = ({label, selected, onSelect, source}) => {
  return (
    <TouchableOpacity style={styles.radioButtonContainer} onPress={onSelect}>
      <Image
        resizeMode="contain"
        tintColor={selected ? '#754595' : '#9D9D9D'}
        source={selected ? icons.radioFill : icons.radioBlank}
        style={{height: wp(7), width: wp(7)}}
      />
      <Text style={styles.labelText}>{label}</Text>
    </TouchableOpacity>
  );
};
export default RadioButton;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontSize: responsiveScreenFontSize(1.7),
    color: '#6C6C6C',
    marginLeft: wp(2),
  },
});
