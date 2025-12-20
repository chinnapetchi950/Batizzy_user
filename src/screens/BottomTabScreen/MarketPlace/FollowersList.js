import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../helper/imageConstants';
import {hp, wp} from '../../../helper/constants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import CustomSearchBar from '../../../common/CustomSearchBar';
import AllFollowersList from './AllFollowersList';
import FollowRequestList from './FollowRequestList';

const FollowersList = () => {
  const {t} = useTranslation();

  const navigation = useNavigation();

  const [isAllFollowers, setAllFollowers] = useState(true);
  const [isFollowRequest, setFollowRequest] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = term => {
    setSearchTerm(term);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.threeDotContainer}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.pressable}>
            <ImageBackground
              resizeMode="cover"
              source={icons.Bg}
              style={styles.imageBackground}>
              <Image
                resizeMode="contain"
                source={icons.backIcon}
                style={styles.backIcon}
              />
            </ImageBackground>
          </Pressable>
          <Text style={styles.headerText}>{t('followerList.title')}</Text>
        </View>
      </View>
      <View style={styles.searchBarContainer}>
        <CustomSearchBar
          onBackPress={{}}
          onSearch={handleSearch}
          placeholder={t('followerList.searchListings')}
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.tabHeader}>
        <Pressable
          onPress={() => {
            setAllFollowers(true);
            setFollowRequest(false);
          }}>
          <Text style={isAllFollowers ? styles.activeTab : styles.inactiveTab}>
            {t('followerList.allFollowers')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setAllFollowers(false);
            setFollowRequest(true);
          }}>
          <Text style={isFollowRequest ? styles.activeTab : styles.inactiveTab}>
            {t('followerList.followRequests')}
          </Text>
        </Pressable>
      </View>
      {isAllFollowers && <AllFollowersList searchTerm={searchTerm} />}
      {isFollowRequest && <FollowRequestList searchTerm={searchTerm} />}
    </View>
  );
};
export default FollowersList;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  tabHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  threeDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    height: hp(4.8),
    width: hp(4.8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  backIcon: {
    height: hp(1.37),
    width: wp(4),
    alignSelf: 'center',
  },
  editIcon: {
    height: hp(2.4),
    width: hp(2.4),
  },
  searchIcon: {
    height: hp(2),
    width: hp(2),
  },
  headerText: {
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    fontSize: responsiveFontSize(1.88),
    marginLeft: 16,
  },
  divider: {
    width: '100%',
    backgroundColor: 'lightgray',
    height: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBarContainer: {
    marginTop: 5,
    marginBottom: 15,
    marginHorizontal: 15,
  },
  activeTab: {
    fontFamily: 'Inter-Bold',
    fontSize: responsiveFontSize(1.88),
    color: '#754595',
    marginRight: 16,
  },
  inactiveTab: {
    color: '#6B6B6B',
    fontFamily: 'Inter-Medium',
    fontSize: responsiveFontSize(1.88),
    marginRight: 16,
  },
});
