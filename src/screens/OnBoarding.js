import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {icons, onboardingImages} from '../helper/imageConstants';
import {deviceHeight, deviceWidth} from '../helper/constants';

const OnBoarding = ({navigation}) => {
  const {t} = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);

  const onboardData = t('onboarding', {returnObjects: true});

  const onNext = () => {
    if (currentIndex < onboardData.titles.length - 1) {
      ref.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={onboardData.titles}
        keyExtractor={(_, i) => i.toString()}
        onMomentumScrollEnd={e =>
          setCurrentIndex(
            Math.round(e.nativeEvent.contentOffset.x / deviceWidth),
          )
        }
        renderItem={({item, index}) => (
          <View style={styles.slide}>
            {/* FULL IMAGE BACKGROUND */}
            <ImageBackground
              source={onboardingImages[index]?.image}
              style={styles.imageBg}
              resizeMode="cover">
              
              {/* SKIP */}
              {index !== onboardData.titles.length - 1 && (
                <TouchableOpacity
                  style={styles.skipBtn}
                  onPress={() => navigation.replace('Login')}>
                  <Text style={styles.skipText}>SKIP</Text>
                </TouchableOpacity>
              )}

              {/* SEARCH BAR */}
              {/* {index === 0 && (
                <View style={styles.searchBar}>
                  <Text style={styles.searchText}>Safe communication</Text>
                  <Image source={icons.send_fill} style={styles.sendIcon} />
                </View>
              )} */}

              {/* SHIELD */}
              {/* {index === 0 && (
                <Image source={icons.shield} style={styles.shieldIcon} />
              )} */}
            </ImageBackground>

            {/* WHITE CONTENT */}
            <View style={styles.whiteCard}>
              <Text style={styles.title}>{item}</Text>
              <Text style={styles.desc}>
                {onboardData.descriptions[index]}
              </Text>
            </View>
          </View>
        )}
      />

      {/* BOTTOM CONTROLS */}
      <View style={styles.bottomBar}>
        <View style={styles.dots}>
          {onboardData.titles.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex && styles.activeDot]}
            />
          ))}
        </View>

        {currentIndex === onboardData.titles.length - 1 ? (
          <TouchableOpacity
            style={styles.getStarted}
            onPress={() => navigation.replace('Login')}>
            <Text style={styles.getStartedText}>
              {t('onboarding.getStarted')}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
            <Image
              source={icons.IntroRightArrow}
              style={styles.nextIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OnBoarding;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  slide: {
    width: deviceWidth,
    flex: 1,
  },

  imageBg: {
    width: '100%',
    height: deviceHeight * 0.96,
    backgroundColor: '#754595',
    paddingTop: 30,
    alignItems: 'center',
  },

  skipBtn: {
    position: 'absolute',
    top:15,
    right: 20,
  },

  skipText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Inter-Medium',
  },

  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    width: '85%',
    marginTop: 20,
  },

  searchText: {
    flex: 1,
    fontSize: responsiveFontSize(1.9),
    color: '#000',
  },

  sendIcon: {
    width: 18,
    height: 18,
  },

  shieldIcon: {
    width: 52,
    height: 52,
    marginTop: 20,
  },

 whiteCard: {
  position: 'absolute',
  bottom:60,                   // 👈 Stick to bottom
  width: '100%',
  backgroundColor: '#fff',
  paddingHorizontal: 30,
  paddingTop:1,
  paddingBottom: 40,
  alignItems: 'center',
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
},

  title: {
    fontSize: responsiveFontSize(2.6),
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    textAlign: 'center',
  },

  desc: {
    fontSize: responsiveFontSize(1.8),
    color: '#444',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  dots: {
    flexDirection: 'row',
    flex: 1,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#754595',
    marginHorizontal: 5,
  },

  activeDot: {
    backgroundColor: '#754595',
  },

  nextBtn: {
    padding: 10,
  },

  nextIcon: {
    width: 34,
    height: 34,
  },

  getStarted: {
    backgroundColor: '#754595',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 40,
  },

  getStartedText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Inter-Medium',
  },
});
