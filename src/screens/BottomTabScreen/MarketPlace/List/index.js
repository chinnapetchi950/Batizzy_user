import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {icons} from '../../../../helper/imageConstants';
import {deviceHeight, deviceWidth, hp, wp} from '../../../../helper/constants';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {navigate} from '../../../../navigation/rootNavigator';
import {routes} from '../../../../navigation/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../../../helper/ApiConstant';
import uploads_url from '../../../../helper/ImageUrl';
import Modal from 'react-native-modal';
import {useNavigation, useRoute} from '@react-navigation/native';
import CustomSearchBar from '../../../../common/CustomSearchBar';
import BottomSheetCondition from '../../../../common/BottomSheetCondition';
import SignUpButton from '../../../../common/SignUpButton';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Colors from '../../../../helper/Colors';
import FontFamily from '../../../../helper/FontFamily';
import FastImage from 'react-native-fast-image';

const numColumns = 2;
const itemWidth = (deviceWidth - 24) / numColumns; // 24 is the total horizontal padding

const List = ({isSearchVisible, setIsSearchVisible}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(
    'Fetching location...',
  );
  const [selectedCityAddress, setCitySelectedAddress] = useState('');
  const [isMarketPlaceList, setIsMarketPlaceList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Add search query state
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFilterLatitude, setFilterLatitude] = useState('');
  const [isFilterLongitude, setFilterLongitude] = useState('');
  const [isFilterAddress, setFilterAddress] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    minPrice: null,
    maxPrice: null,
    location: null,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getCategoryData();
  }, [getCategoryData]);

  useEffect(() => {
    if (isFilterLatitude && isFilterLongitude) {
      setAppliedFilters(prev => ({
        ...prev,
        location: {latitude: isFilterLatitude, longitude: isFilterLongitude},
      }));
    }
  }, [isFilterLatitude, isFilterLongitude]);

  useEffect(() => {
    Geocoder.init('AIzaSyCceRTsiY-2UPVwytF6wytwaGmonWjvTHo');

    const fetchCurrentLocation = async () => {
      Geolocation.getCurrentPosition(
        async position => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          try {
            const json = await Geocoder.from({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            const cityName = getCityFromAddressComponents(
              json.results[0].address_components,
            );
            setCitySelectedAddress(cityName || 'City not found');
            const address = json.results[0].formatted_address;
            setSelectedAddress(address);
          } catch (error) {
            console.error(error);
            setSelectedAddress('Location not found');
          }
        },
        error => {
          console.error(error);
          setSelectedAddress('Location not found');
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    };

    fetchCurrentLocation();
  }, [selectedAddress]);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem('userData'));
    setLoginUserID(userData?.id);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    getListData();
    setRefreshing(false);
  };

  const getListData = async () => {
    const Token = await AsyncStorage.getItem('accessToken');
    let url = `${baseURL}marketplaces?m_for=${others}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + Token,
        Accept: 'application/json',
      },
    });

    const res = await response.json();
    setFilteredProducts(res.data);
  };

  const getCategoryData = useCallback(async () => {
    try {
      const Token = await AsyncStorage.getItem('accessToken');
      const m_for = 'others';
      let url = `${baseURL}marketplaces?m_for=${m_for}`;
      if (isFilterLatitude && isFilterLongitude) {
        url += `&lat=${isFilterLatitude}&lng=${isFilterLongitude}`;
      }
      if (minPrice !== null) {
        url += `&price_min=${minPrice}`;
      }
      if (maxPrice !== null) {
        url += `&price_max=${maxPrice}`;
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + Token,
          Accept: 'application/json',
        },
      });

      const res = await response.json();
      setIsLoading(false);
      if (res.status === true) {
        let filteredData = res.data;
        setIsMarketPlaceList(filteredData);
        setFilteredProducts(filteredData);
      }
    } catch (error) {
      setIsLoading(false);
    }
  }, [isFilterLatitude, isFilterLongitude, maxPrice, minPrice]);

  const applyFilters = () => {
    getCategoryData();
    setIsCommentSheetOpen(false);
  };

  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setAppliedFilters({
      minPrice: null,
      maxPrice: null,
      location: null,
    });
    setFilterLatitude('');
    setFilterLongitude('');
    setFilterAddress('');
    // Navigate back to reset location
    navigation.setParams({
      ChangedAddress: null,
      Changedlat: null,
      Changedlang: null,
    });
    getCategoryData();
  };

  const getCityFromAddressComponents = addressComponents => {
    for (let component of addressComponents) {
      if (
        component.types.includes('locality') ||
        component.types.includes('administrative_area_level_2')
      ) {
        return component.long_name;
      }
    }
    return null;
  };

  const emptyMesRender = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={[styles.emptyMsg]}>{t('common.recordNotFound')}</Text>
      </View>
    );
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
        <FastImage
          source={{uri: uploads_url + item?.first_attachment?.file_path}}
          style={styles.image}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.price}>{'$' + item.price + ' '}</Text>
          <Text style={[styles.title, {width: '65%'}]} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
      </Pressable>
    );
  };

  const handleSearch = text => {
    setSearchQuery(text);
    if (text) {
      const filtered = isMarketPlaceList.filter(item =>
        item.title.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(isMarketPlaceList);
    }
  };

  const toggleCommentSheet = ID => {
    setIsCommentSheetOpen(!isCommentSheetOpen);
  };

  return (
    <>
      <View>
        <View>
          <View style={styles.locationMainContainer}>
            <Text style={styles.title}>{t('marketplace.todaysPicks')}</Text>
            <Pressable
              onPress={() => {
                setIsCommentSheetOpen(true);
              }}>
              <FastImage source={icons.filterIcon} style={styles.filterIcon} />
            </Pressable>
          </View>
        </View>

        {isSearchVisible && (
          <View style={styles.searchBarContainer}>
            <View style={{flex: 1}}>
              <CustomSearchBar
                onBackPress={{}}
                onSearch={handleSearch}
                placeholder={t('marketplace.searchListings')}
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>
            <Pressable
              onPress={() => {
                setIsSearchVisible(false);
                handleSearch();
              }}>
              <Image source={icons.closeBtn} style={{height: 50, width: 50}} />
            </Pressable>
          </View>
        )}
        <FlatList
          nestedScrollEnabled={true}
          contentContainerStyle={{width: '100%', paddingBottom: '10%'}}
          data={filteredProducts}
          scrollEnabled
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <ProductItem item={item} />}
          ListEmptyComponent={() => emptyMesRender()}
          showsVerticalScrollIndicator={false}
          numColumns={numColumns}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      {isCommentSheetOpen && (
  <BottomSheetCondition
    maxHeight={hp(55)}
    isOpen={isCommentSheetOpen}
    onClose={toggleCommentSheet}
    renderContent={() => {
      return (
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: hp(4),
            }}
          >
            {/* HEADER */}
            <View style={styles.conditionHeader}>
              <Text style={styles.conditionHeaderText}>
                {t('marketplace.filters')}
              </Text>
              <Pressable onPress={resetFilters}>
                <Text style={styles.resetText}>
                  {t('marketplace.reset')}
                </Text>
              </Pressable>
            </View>

            <View style={styles.separator} />

            {/* PRICE */}
            <Text style={styles.priceText}>
              {t('marketplace.price')}
            </Text>

            <View style={styles.priceMainContainer}>
              <TextInput
                placeholder={t('marketplace.minimum')}
                placeholderTextColor="#000000"
                style={styles.priceInputField}
                value={minPrice}
                onChangeText={setMinPrice}
              />

              <View style={{ width: 20 }} />

              <TextInput
                placeholder={t('marketplace.maximum')}
                placeholderTextColor="#000000"
                style={styles.priceInputField}
                value={maxPrice}
                onChangeText={setMaxPrice}
              />
            </View>

            {/* LOCATION */}
            <View style={styles.locationInputContainer}>
              <View style={styles.locationTextcontainer}>
                <Image
                  source={icons.markerIcon}
                  style={styles.filterMarkerIcon}
                />

                <GooglePlacesAutocomplete
                  placeholder={
                    isFilterAddress
                      ? isFilterAddress
                      : t('marketplace.selectLocation')
                  }
                  fetchDetails
                  onPress={(data, details) => {
                    setFilterAddress(data.description);
                    setFilterLatitude(details.geometry.location.lat);
                    setFilterLongitude(details.geometry.location.lng);
                  }}
                  query={{
                    key: 'AIzaSyCceRTsiY-2UPVwytF6wytwaGmonWjvTHo',
                    language: 'en',
                  }}
                  textInputProps={{
                    placeholderTextColor: Colors.lightPlaceholder,
                  }}
                  styles={{
                    textInput: {
                      color: Colors.fontDarkGray,
                      fontFamily: FontFamily.InterMedium,
                      borderWidth: 0.5,
                    },
                    listView: {
                      zIndex: 999,
                    },
                  }}
                />
              </View>
            </View>

            {/* APPLY BUTTON */}
            <View style={{ marginTop: hp(3) }}>
              <SignUpButton
                title={t('marketplace.apply')}
                onPress={applyFilters}
              />
            </View>
          </ScrollView>
        </View>
      );
    }}
  />
)}

      {isLoading && (
        <Modal isVisible={isLoading} style={styles.modalContainer}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={'small'} color={Colors.primary} />
          </View>
        </Modal>
      )}
    </>
  );
};
export default List;

const styles = StyleSheet.create({
  title: {
    color: Colors.black,
    fontSize: responsiveFontSize(1.8),
    fontFamily: FontFamily.InterSemiBold,
  },
  locationText: {
    color: '#754595',
    fontSize: responsiveFontSize(1.41),
    fontFamily: 'Inter-Medium',
    marginLeft: 5,
  },
  markerIcon: {
    height: hp(3),
    width: hp(3),
    resizeMode: 'contain',
  },
  filterIcon: {
    height: 14,
    width: 14,
  },
  locationMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '4%',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  listContainer: {
    paddingBottom: 50,
  },
  itemContainer: {
    width: itemWidth,
    marginBottom: 14,
  },
  image: {
    width: wp(45),
    height: hp(24),
    borderRadius: 22,
    resizeMode: 'cover',
  },
  price: {
    fontSize: responsiveFontSize(1.54),
    fontFamily: 'Inter-Medium',
    color: '#000000',
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
  searchBarContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flatlistContainer: {
    marginTop: 16,
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
  noDataText: {
    fontSize: responsiveFontSize(2.35),
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginTop: hp(5),
    color: '#000000',
  },
  conditionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conditionHeaderText: {
    fontSize: responsiveFontSize(1.88),
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  resetText: {
    fontSize: responsiveFontSize(1.41),
    fontFamily: 'Inter-Regular',
    color: '#754595',
  },
  priceText: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    color: '#1D1D1D',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
    marginVertical: 10,
  },
  priceInputField: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 4,
  },
  priceMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1.3),
  },
  locationInputContainer: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    paddingHorizontal: hp(1.25),
    borderRadius: 4,
    marginTop: 10,
    alignItems: 'center',
    marginBottom: hp(3),
    justifyContent: 'space-between',
  },
  filterMarkerIcon: {
    height: hp(3),
    width: hp(3),
    resizeMode: 'contain',
    tintColor: '#000000',
  },
  filterLocationText: {
    color: '#000000',
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    marginLeft: 5,
  },
  filterLocationChangeText: {
    color: '#754595',
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    marginLeft: 5,
  },
  locationTextcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyMsg: {
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(2),
    paddingVertical: 10,
    textAlign: 'center',
    marginTop: deviceHeight / 4,
  },
});
