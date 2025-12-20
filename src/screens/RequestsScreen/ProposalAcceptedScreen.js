import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../helper/imageConstants';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import SignUpButton from '../../common/SignUpButton';
import {routes} from '../../navigation/Routes';
import {useNavigation, useRoute} from '@react-navigation/native';

const ProposalAcceptedScreen = props => {
  const acceptData = props.route.params?.acceptReqData;
  const navigation = useNavigation();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={icons.successProposalIcon} style={styles.icon} />
      </View>
      <Text style={styles.message}>{t('proposalAcceptedScreen.message')}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsText}>
          {acceptData?.renovation_post?.title}
        </Text>
        <Text style={styles.detailsText}>
          {t('proposalAcceptedScreen.contractor')}
          {acceptData?.professional?.name}
        </Text>
        <Text style={styles.detailsText}>
          {t('proposalAcceptedScreen.estimatedBudget')}
          {acceptData?.renovation_post?.budget}
        </Text>
        <Text style={styles.detailsText}>
          {t('proposalAcceptedScreen.timeline')}
          {acceptData?.renovation_post?.preferred_timelinef}
        </Text>
      </View>
      <View style={{width: '80%'}}>
        <SignUpButton
          title={t('proposalAcceptedScreen.backButton')}
          onPress={() => {
            navigation.navigate(routes.RequestsScreen);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    width: 80,
    height: 80,
  },
  message: {
    fontFamily: 'Inter-SemiBold',
    fontSize: responsiveFontSize(1.88),
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  detailsText: {
    fontFamily: 'Inter-Medium',
    fontSize: responsiveFontSize(1.64),
    color: '#1D1D1D',
    marginVertical: 2,
  },
  button: {
    backgroundColor: '#6C43A8',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    fontSize: responsiveFontSize(1.88),
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 5,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default ProposalAcceptedScreen;
