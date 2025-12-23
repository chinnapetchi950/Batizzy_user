import React, {useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {icons} from '../helper/imageConstants';

const BottomSheetCondition = ({isOpen, onClose, renderContent, maxHeight}) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  /** Slide from bottom */
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [maxHeight, 0],
  });

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
      )}

      {/* BOTTOM SHEET */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            height: maxHeight,      // 🔥 FORCE HEIGHT
            transform: [{translateY}],
          },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Image source={icons.closeBtn} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>

        {/* CONTENT (SCROLLABLE) */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {renderContent && renderContent()}
        </ScrollView>
      </Animated.View>
    </>
  );
};

export default BottomSheetCondition;
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  header: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },

  closeButton: {
    padding: 5,
  },

  closeIcon: {
    height: 28,
    width: 28,
    resizeMode: 'contain',
  },

  contentContainer: {
    paddingBottom: 30, // 🔥 prevents button cutoff
    flexGrow: 1,
  },
});
