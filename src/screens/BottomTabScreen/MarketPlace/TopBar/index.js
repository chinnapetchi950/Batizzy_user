import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../../helper/imageConstants';
import {hp, wp} from '../../../../helper/constants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const TopBar = ({onPresSell, onPresCategory}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.sellTabContainer} onPress={onPresSell}>
        <Image source={icons.sellIcon} style={styles.selltabIcon} />
        <Text style={styles.selltabtext}>{t('marketplace.sell')}</Text>
      </Pressable>
      <View style={styles.seperator} />
      <Pressable style={styles.categoryTabContainer} onPress={onPresCategory}>
        <Image source={icons.CategoryIcon} style={styles.categorytabIcon} />
        <Text style={styles.categorytabtext}>{t('marketplace.category')}</Text>
      </Pressable>
    </View>
  );
};
export default TopBar;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: hp(3),
    flexDirection: 'row',
  },
  sellTabContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#75459559',
    paddingVertical: hp(0.8),
    justifyContent: 'center',
    borderRadius: 20,
  },
  selltabIcon: {
    height: hp(2.4),
    width: hp(2.4),
    resizeMode: 'contain',
  },
  selltabtext: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-SemiBold',
    marginLeft: wp(1.6),
    color: '#754595',
  },
  categoryTabContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FECC1659',
    paddingVertical: hp(0.8),
    justifyContent: 'center',
    borderRadius: 20,
  },
  categorytabIcon: {
    height: hp(2.4),
    width: hp(2.4),
    resizeMode: 'contain',
  },
  categorytabtext: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-SemiBold',
    marginLeft: wp(1.6),
    color: '#FECC16',
  },
  seperator: {
    marginHorizontal: 17,
  },
});
