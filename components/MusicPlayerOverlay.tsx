import React, {useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator, Dimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  clamp,
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {tabBarHeight} from '../constants/constant';
import {setMusicPlayerHeightAnimation} from '../store/actions/appActions';
import {useDispatch} from 'react-redux';

interface OverlayProps {
  visible: boolean;
  translationY: SharedValue<number>;
}

const {width, height} = Dimensions.get('screen');

const MusicPlayerOverlay: React.FC<OverlayProps> = ({
  visible,
  translationY,
}) => {
  // const translationY = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const inputValue = [0, height - 4 * tabBarHeight];

  function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
  }

  const pan = Gesture.Pan()
    .onStart(e => {
      console.log(translationY.value);
      prevTranslationY.value = translationY.value;
    })
    .onUpdate(event => {
      const maxTranslateY = height - 4 * tabBarHeight;

      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY,
      );
    })
    .onEnd(event => {
      if (translationY.value > (height - 4 * tabBarHeight) / 1.9) {
        translationY.value = withTiming(
          height - 4 * tabBarHeight,
          {
            duration: 100,
          },
          finished => {
            if (finished) {
              prevTranslationY.value = translationY.value;
            }
          },
        );
      } else {
        translationY.value = withTiming(
          0,
          {
            duration: 100,
          },
          finished => {
            if (finished) {
              prevTranslationY.value = translationY.value;
            }
          },
        );
      }

      prevTranslationY.value = translationY.value;
    })
    .runOnJS(true);

  const animatedStyles = useAnimatedStyle(() => ({
    height: interpolate(translationY.value, inputValue, [height, 70], {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP,
    }),
    borderTopRightRadius: interpolate(translationY.value, inputValue, [20, 0]),
    borderTopLeftRadius: interpolate(translationY.value, inputValue, [20, 0]),
    transform: [
      {
        translateY: interpolate(
          translationY.value,
          inputValue,
          [tabBarHeight, 0],
          {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
          },
        ),
      },
    ],
  }));

  if (!visible) return null;

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.overlay,
          {
            width: '100%',
          },
          animatedStyles,
        ]}></Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    // right: 0,
    bottom: tabBarHeight,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MusicPlayerOverlay;
