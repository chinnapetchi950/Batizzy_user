import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  RefreshControl,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import baseURL from '../../helper/ApiConstant';
import {deviceHeight, hp} from '../../helper/constants';
import {navigate} from '../../navigation/rootNavigator';
import {routes} from '../../navigation/Routes';
import {icons} from '../../helper/imageConstants';
import Colors from '../../helper/Colors';
import Loader from '../../common/Loader';

const NewRequestList = ({searchTerm, newDataLengthChange}) => {
  const {t} = useTranslation();

  const [isMyRequestListData, setMyRequestListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const Item = ({
    budget,
    timeline,
    services,
    onPress,
    timeAgo,
    RequestID,
    Contractor,
    index,
  }) => (
    <Pressable key={index} style={styles.item} onPress={onPress}>
      <Text style={styles.dateText}>Received {timeAgo}</Text>
      <Text style={styles.labelText}>
        Request ID : <Text style={styles.valueText}>#{RequestID}</Text>
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.labelText}>
          Contractor : <Text style={styles.valueText}>{Contractor}</Text>
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={icons.certified} style={{height: 24, width: 24}} />
          <Image source={icons.badgeIcon} style={{height: 24, width: 24}} />
        </View>
      </View>
      <Text style={styles.labelText}>
        Estimated Budget: <Text style={styles.valueText}>{budget}</Text>
      </Text>
      <Text style={styles.labelText}>
        Timeline: <Text style={styles.valueText}>{timeline}</Text>
      </Text>
      <Text style={styles.labelText}>Services Required:</Text>
      <View style={styles.servicesContainer}>
        {services?.map((service, i) => (
          <View key={i} style={styles.serviceButton}>
            <Text style={styles.serviceText}>{service?.name}</Text>
          </View>
        ))}
      </View>
      <View style={styles.bottomBorder} />
    </Pressable>
  );

  useFocusEffect(
    useCallback(() => {
      const onScreenFocus = async () => {
        await getRenovationPost();
      };
      onScreenFocus();
    }, [getRenovationPost]),
  );

  const getRenovationPost = useCallback(async () => {
    var Token = await AsyncStorage.getItem('accessToken');
    await fetch(baseURL + 'renovation_post_requests?status=pending', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + Token,
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        setIsLoading(false);
        if (res.status === true) {
          setMyRequestListData(res.data);
          newDataLengthChange(res.data.length);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [newDataLengthChange]);

  const renderItem = ({item, index}) => {
    return (
      <Item
        index={index}
        Contractor={item?.professional?.name}
        RequestID={item?.renovation_post?.id}
        budget={item?.renovation_post?.budget}
        timeline={item?.renovation_post?.preferred_timelinef}
        services={item.renovation_types}
        timeAgo={item?.renovation_post?.posted_at}
        onPress={() => {
          navigate(routes.NewRequestDetails, {
            ItemId: item.id,
          });
        }}
      />
    );
  };

  const filterRequests = (requests, term) => {
    if (!term) return requests;
    return requests.filter(request => {
      const searchableFields = [
        request.renovation_post?.id,
        request.renovation_post?.budget,
        request.renovation_post?.preferred_timelinef,
        // ...request.skills.map(skill => skill.name),
        // request.renovation_post?.posted_at,
        // Add any other fields you want to search through
      ];
      return searchableFields.some(field =>
        field?.toString().toLowerCase().includes(term.toLowerCase()),
      );
    });
  };

  const filteredMyRequest = filterRequests(isMyRequestListData, searchTerm);
  const emptyMesRender = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={[styles.emptyMsg]}>{t('recordNotFound')}</Text>
      </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };
  return (
    <>
      <FlatList
        contentContainerStyle={{paddingBottom: '60%'}}
        data={filteredMyRequest}
        scrollEnabled
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() => emptyMesRender()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {isLoading && <Loader />}
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 15,
    marginVertical: 8,
    marginTop: 10,
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    color: '#6B6B6B',
    fontSize: responsiveFontSize(1.41),
    marginBottom: 5,
  },
  titleText: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    color: '#2D2C2C',
    marginBottom: 10,
  },
  labelText: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    color: '#4A4A4A',
    marginBottom: 5,
  },
  valueText: {
    color: '#000000',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  serviceButton: {
    backgroundColor: '#C7C7C7',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 10,
    marginBottom: 15,
  },
  serviceText: {
    fontSize: responsiveFontSize(1.64),
    fontFamily: 'Inter-Medium',
    color: '#000000',
  },
  bottomBorder: {
    height: 1,
    backgroundColor: '#A6A6A6',
    width: '100%',
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
  emptyMsg: {
    color: Colors.fontDarkGray,
    fontSize: responsiveFontSize(2),
    paddingVertical: hp(1),
    textAlign: 'center',
    marginTop: deviceHeight / 4,
  },
});

export default NewRequestList;
