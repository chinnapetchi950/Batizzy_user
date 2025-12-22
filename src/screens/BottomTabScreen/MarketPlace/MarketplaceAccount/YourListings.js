import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../../helper/imageConstants';
import {deviceHeight, deviceWidth, hp, wp} from '../../../../helper/constants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import CustomSearchBar from '../../../../common/CustomSearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../../../helper/ApiConstant';
import Modal from 'react-native-modal';
import uploads_url from '../../../../helper/ImageUrl';
import {routes} from '../../../../navigation/Routes';
import {navigate} from '../../../../navigation/rootNavigator';
import Colors from '../../../../helper/Colors';
import Loader from '../../../../common/Loader';
import Icons from '../../../../common/Icons';

const YourListings = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [isMarketPlaceList, setIsMarketPlaceList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Add search state
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onScreenFocus = async () => {
        await getMyMarketplaceData();
      };
      onScreenFocus();
    }, []),
  );

  const getMyMarketplaceData = async (search = '') => {
    try {
      const Token = await AsyncStorage.getItem('accessToken');
      const m_for = 'current_user';
      const url = `${baseURL}marketplaces?m_for=${m_for}${
        search ? `&search=${search}` : ''
      }`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + Token,
          Accept: 'application/json',
        },
      });

      const res = await response.json();

      if (res.status === true) {
        setIsMarketPlaceList(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = query => {
    setSearchQuery(query);
    getMyMarketplaceData(query);
  };

  const ProductItem = ({item}) => {
    return (
      <Pressable
        style={styles.itemContainer}
        onPress={() => {
          navigate(routes.ProductDetails, {
            ItemID: item.id,
          });
        }}>
        <Image
          source={{uri: uploads_url + item?.first_attachment?.file_path}}
          style={styles.image}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={[styles.title]} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
      </Pressable>
    );
  };

  const emptyMesRender = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={[styles.emptyMsg]}>{t('common.recordNotFound')}</Text>
      </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    getMyMarketplaceData();
    setRefreshing(false);
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
          <Text style={styles.headerText}>{t('yourListing.title')}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <Pressable
        style={styles.createContainer}
        onPress={() => {
          navigation.navigate(routes.NewListing);
        }}>
        <Icons
          iconColor={Colors.white}
          iconName={'lead-pencil'}
          iconSetName={'MaterialCommunityIcons'}
          iconSize={18}
        />
        <Text style={styles.CreateListText}>
          {t('yourListing.createListing')}
        </Text>
      </Pressable>
      <View style={styles.searchBarContainer}>
        {/* <CustomSearchBar
          onSearch={handleSearch}
          placeholder={t('yourListing.searchListings')}
        /> */}
      </View>
      <View style={{paddingHorizontal: 20, flex: 1}}>
        <FlatList
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          data={isMarketPlaceList}
          scrollEnabled
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <ProductItem item={item} />}
          ListEmptyComponent={() => emptyMesRender()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      {isLoading && <Loader />}
    </View>
  );
};
export default YourListings;

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
  listContainerTitle: {
    fontSize: responsiveFontSize(1.88),
    fontFamily: 'Inter-Bold',
    color: '#754595',
    padding: 15,
  },
  listContainer: {
    paddingBottom: 120,
  },
  itemContainer: {
    width: deviceWidth / 2.4,
    marginBottom: 20,
  },
  image: {
    width: deviceWidth / 2.4,
    height: deviceHeight / 5,
    borderRadius: 10,
  },
  price: {
    color: 'black',
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
  },
  Producttitle: {
    fontSize: responsiveFontSize(1.54),
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
    color: '#000000',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  flatlistContainer: {
    marginHorizontal: 15,
  },
  noDataText: {
    fontSize: responsiveFontSize(2.35),
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginTop: hp(5),
    color: '#000000',
  },
  title: {
    color: 'black',
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    marginLeft: 5,
  },
  searchBarContainer: {
    padding: 15,
    marginBottom: 10,
  },
  listingEditText: {
    fontFamily: 'Inter-Medium',
    color: '#754595',
    fontSize: responsiveFontSize(1.64),
  },
  CreateListText: {
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.64),
    marginLeft: 8,
  },
  createContainer: {
    flexDirection: 'row',
    backgroundColor: '#754595',
    borderRadius: 30,
    paddingVertical: hp(1.6),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    marginTop: 15,
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
  emptyMsg: {
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(2),
    paddingVertical: 10,
    textAlign: 'center',
    marginTop: deviceHeight / 4,
  },
});
