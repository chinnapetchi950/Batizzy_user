import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {hp, wp} from '../../helper/constants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import AcceptedRequestList from './AcceptedRequestList';
import DeclineScreen from './DeclineScreen';
import CompletedScreen from './CompletedScreen';
import Colors from '../../helper/Colors';
import FontFamily from '../../helper/FontFamily';

const RequestStatusScreen = ({searchTerm}) => {
  const {t} = useTranslation();
  const [isDecline, setIsDecline] = useState(false);
  const [isAcceptedRequest, setIsAcceptedRequest] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const [declineLength, setDeclineLength] = useState();
  const [acceptLength, setAcceptLength] = useState();
  const [completedLength, setCompletedLength] = useState();

  const onClickDecline = () => {
    setIsAcceptedRequest(false);
    setIsCompleted(false);
    setIsDecline(true);
  };

  const onClickAcceptedRequest = () => {
    setIsAcceptedRequest(true);
    setIsCompleted(false);
    setIsDecline(false);
  };

  const onClickCompleted = () => {
    setIsAcceptedRequest(false);
    setIsCompleted(true);
    setIsDecline(false);
  };

  const handleAcceptengthChange = length => {
    setAcceptLength(length);
  };

  const handleCompletedLengthChange = length => {
    setCompletedLength(length);
  };

  const handleDeclineLengthChange = length => {
    setDeclineLength(length);
  };

  return (
    <>
      <View style={styles.tabMainContainer}>
        <Pressable
          style={[
            styles.topBarView,
            {backgroundColor: isAcceptedRequest ? Colors.primary : Colors.gray},
          ]}
          onPress={() => {
            onClickAcceptedRequest();
          }}>
          <Text
            style={isAcceptedRequest ? styles.activetab : styles.inActivetab}>
            {t('requestStatus.accepted')}
            {acceptLength > 0 ? `(${acceptLength})` : ''}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.topBarView,
            {backgroundColor: isCompleted ? Colors.primary : Colors.gray},
          ]}
          onPress={() => {
            onClickCompleted();
          }}>
          <Text style={isCompleted ? styles.activetab : styles.inActivetab}>
            {t('requestStatus.completed')}
            {completedLength > 0 ? `(${completedLength})` : ''}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.topBarView,
            {backgroundColor: isDecline ? Colors.primary : Colors.gray},
          ]}
          onPress={() => {
            onClickDecline();
          }}>
          <Text style={isDecline ? styles.activetab : styles.inActivetab}>
            {t('requestStatus.decline')}
            {declineLength > 0 ? `(${declineLength})` : ''}
          </Text>
        </Pressable>
      </View>

      {isAcceptedRequest && (
        <AcceptedRequestList
          searchTerm={searchTerm}
          acceptLengthChange={handleAcceptengthChange}
        />
      )}
      {isCompleted && (
        <CompletedScreen
          searchTerm={searchTerm}
          completedLengthChange={handleCompletedLengthChange}
        />
      )}
      {isDecline && (
        <DeclineScreen
          searchTerm={searchTerm}
          declineLengthChange={handleDeclineLengthChange}
        />
      )}
    </>
  );
};

export default RequestStatusScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonBackground: {
    height: hp(4.8),
    width: hp(4.8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  backButtonIcon: {
    height: hp(1.37),
    width: wp(4),
    alignSelf: 'center',
    marginBottom: hp(0.5),
  },
  editProfileText: {
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    fontSize: responsiveFontSize(1.88),
    marginLeft: 16,
  },
  publishText: {
    fontFamily: 'Inter-SemiBold',
    color: '#754595',
    fontSize: responsiveFontSize(1.88),
    marginLeft: 16,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userContainer: {
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2.4),
  },
  profileImage: {
    width: hp(5),
    height: hp(5),
    borderRadius: 25,
    marginRight: 12,
  },
  listIcon: {
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: 'contain',
  },
  headerText: {
    flex: 1,
  },
  IconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    height: hp(2.2),
    width: hp(2.2),
  },
  RectangleIcon: {
    height: hp(17.5),
    width: '100%',
    marginTop: hp(2),
  },
  notificationIcon: {
    height: hp(3),
    width: hp(3),
    // marginHorizontal: 7,
  },
  notificationCount: {
    backgroundColor: '#FF7F36',
    paddingVertical: 0.5,
    paddingHorizontal: 2,
    borderRadius: 9,
    color: 'white',
    fontSize: responsiveFontSize(1.2),
    textAlignVertical: 'center',
    fontFamily: FontFamily.InterBlack,
    height: 18,
    width:18,
    textAlign:'center',
    position: 'absolute',
    top: -7,
    left: 10,
  },
  searchBarContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
  },
  activetab: {
    fontFamily: FontFamily.InterMedium,
    color: Colors.white,
    fontSize: responsiveFontSize(1.6),
    // borderBottomWidth: 1,
    // borderBottomColor: '#754595',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inActivetab: {
    fontFamily: FontFamily.InterMedium,
    color: Colors.black,
    fontSize: responsiveFontSize(1.6),
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.fontDarkGray,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tabMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '4%',
    paddingTop: '2%',
    paddingBottom: '2%',
  },
  topBarView: {
    borderRadius: 10,
  },
});
