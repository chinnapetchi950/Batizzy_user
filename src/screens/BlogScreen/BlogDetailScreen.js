import React, {useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {deviceHeight, deviceWidth, hp, wp} from '../../helper/constants';
import {icons, images} from '../../helper/imageConstants';
import {useNavigation} from '@react-navigation/native';
import {routes} from '../../navigation/Routes';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../../helper/Colors';
import FontFamily from '../../helper/FontFamily';
import uploads_url from '../../helper/ImageUrl';
import Icons from '../../common/Icons';
import moment from 'moment';
import {useLanguage} from '../../context/LanguageContext';

const BlogDetailScreen = props => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const blogData = props.route.params?.item;
  const {selectedLanguage, changeLanguage} = useLanguage();

  const renderSkills = item => {
    return (
      <View style={{padding: '2%'}}>
        <View>
          <ImageBackground source={icons.Bg} style={[styles.iconBGSize]}>
            <Image source={icons.cake} style={[styles.iconSize]} />
          </ImageBackground>
        </View>
        <Text style={[styles.iconText]}>{t('blogDetail.hello_text')}</Text>
      </View>
    );
  };

  const emptyMesRender = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={[styles.emptyMsg]}>{t('blogDetail.no_chats_found')}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
      <StatusBar animated={true} backgroundColor={Colors.white} />
      <View style={styles.wrapper}>
        <View style={styles.titleContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <ImageBackground
                  source={icons.Bg}
                  style={{height: 40, width: 40, justifyContent: 'center'}}>
                  <Image
                    source={icons.backIcon}
                    style={{
                      height: 10,
                      width: 10,
                      tintColor: Colors.grayFont,
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}
                  />
                </ImageBackground>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={[styles.headerText]}>
                {t('blogDetail.blogDetails')}
              </Text>
            </View>
          </View>
        </View>
      </View>
<ScrollView
  contentContainerStyle={{padding: 20}}
  showsVerticalScrollIndicator={false}
>        
<Image
          source={{
            uri: blogData?.image
              ? uploads_url + blogData?.image
              : images.coverDummy,
          }}
          style={{height: 200, width: deviceWidth - 40, borderRadius: 10}}
        />
        <Text style={[styles.dateContainer]}>
          {'Published ' + moment(blogData?.created_at).format('DD MMMM YYYY')}
        </Text>
        <Text style={[styles.titileText]}>
          {selectedLanguage == 'fr'
            ? blogData?.title_fr
            : selectedLanguage == 'de'
            ? blogData?.title_de
            : blogData?.title}
        </Text>
        <Text style={[styles.descrText]}>
          {selectedLanguage == 'fr'
            ? blogData?.content_fr
            : selectedLanguage == 'de'
            ? blogData?.content_de
            : blogData?.content}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BlogDetailScreen;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingTop: '4%',
    paddingHorizontal: '4%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  iconNotification: {
    height: 20,
    width: 20,
  },
  chatIcon: {
    height: 20,
    width: 20,
  },
  headerText: {
    fontFamily: FontFamily.InterMedium,
    fontSize: responsiveFontSize(1.8),
    color: Colors.black,
    paddingLeft: 10,
  },
  dateContainer: {
    fontFamily: FontFamily.InterBlack,
    fontSize: responsiveFontSize(1.6),
    color: Colors.grayFont,
    marginTop: 10,
  },
  titileText: {
    color: Colors.black,
    fontSize: responsiveFontSize(1.8),
    fontFamily: FontFamily.InterBold,
    marginTop: 10,
  },
  descrText: {
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(1.6),
    fontFamily: FontFamily.InterBlack,
    marginTop: 10,
    lineHeight: 24,
  },
});
