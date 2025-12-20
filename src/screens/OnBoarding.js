import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {icons} from '../helper/imageConstants';
import {deviceHeight, deviceWidth} from '../helper/constants';

const OnBoarding = ({navigation}) => {
  const {t} = useTranslation();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef(null);

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / deviceWidth);
    setCurrentSlideIndex(currentIndex);
  };

  const onboardData = t('onboarding', {returnObjects: true});

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          if (currentSlideIndex !== 2) {
            navigation.replace('Login');
          }
        }}
        style={styles.skipButton}>
        <Text style={styles.skipText}>
          {currentSlideIndex !== 2 && t('onboarding.skip')}
        </Text>
      </TouchableOpacity>

      <FlatList
        ref={ref}
        data={onboardData.titles}
        horizontal
        pagingEnabled
        onMomentumScrollEnd={updateCurrentSlideIndex}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <View style={[styles.slide]}>
            <View style={styles.imageContainer}>
              <Image
                source={icons.Intro1}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>{item}</Text>
            <Text style={styles.description}>
              {onboardData.descriptions[index]}
            </Text>
          </View>
        )}
      />

      <View style={styles.dotBottomView}>
        <View style={styles.dotContainer}>
          {onboardData.titles.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlideIndex === index ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>
        <View style={styles.bottomView}>
          {currentSlideIndex !== 2 ? (
            <TouchableOpacity
              onPress={() => {
                const nextIndex = currentSlideIndex + 1;
                if (nextIndex < onboardData.titles.length) {
                  ref.current.scrollToIndex({animated: true, index: nextIndex});
                  setCurrentSlideIndex(nextIndex);
                }
              }}
              style={styles.getStartedContainer}>
              <Image
                source={icons.IntroRightArrow}
                style={styles.bottomImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigation.replace('Login');
              }}
              style={styles.getStartedContainer}>
              <Image
                source={icons.introBottom}
                style={styles.getStartedImage}
                resizeMode="contain"
              />
              <Text style={styles.getStartedText}>
                {t('onboarding.getStarted')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  skipButton: {
    marginTop: 20,
    marginRight: 20,
    alignSelf: 'flex-end',
  },
  skipText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Inter Medium',
    color: '#000',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    width: deviceWidth,
  },
  imageContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomView: {
    flex: 1,
    height: 100,
  },
  dotBottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    height: deviceHeight * 0.4,
    zIndex: 1,
  },
  title: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Inter-Bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 50,
  },
  description: {
    fontSize: responsiveFontSize(1.66),
    fontFamily: 'Inter',
    color: '#1D1D1D',
    textAlign: 'center',
    lineHeight: 25,
    paddingHorizontal: 40,
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  activeDot: {
    backgroundColor: '#754595',
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'blue',
    marginHorizontal: 5,
  },
  bottomImage: {
    flex: 1,
    height: 33.33,
    width: 33.33,
    marginRight: 20,
  },
  getStartedContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  getStartedImage: {
    height: 100,
    width: 180,
  },
  getStartedText: {
    position: 'absolute',
    fontFamily: 'Inter SemiBold',
    color: 'white',
    right: 40,
    top: 35,
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
  },
});

export default OnBoarding;
