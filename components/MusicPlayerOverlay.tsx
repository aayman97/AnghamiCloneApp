import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  LayoutRectangle,
} from 'react-native';
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
import {
  musicList,
  musicPlayerShrinkedColor,
  tabBarHeight,
} from '../constants/constant';
import {getColors} from 'react-native-image-colors';
import LinearGradient from 'react-native-linear-gradient';
import {lightenHexColor} from '../helpers/ligherHexColor';
import {
  AndroidImageColors,
  ImageColorsResult,
  IOSImageColors,
  WebImageColors,
} from 'react-native-image-colors/build/types';

interface OverlayProps {
  visible: boolean;
  translationY: SharedValue<number>;
}

const {width, height} = Dimensions.get('screen');

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const MusicPlayerOverlay: React.FC<OverlayProps> = ({
  visible,
  translationY,
}) => {
  const [currentMusicIndex, setCurrentMusicIndex] = useState<number>(0);
  const [colors, setColors] = useState<Exclude<
    ImageColorsResult,
    WebImageColors
  > | null>(null);
  const [albumCoverContianerLayout, setAlbumCoverContainerLayout] =
    useState<LayoutRectangle>({
      height: 0,
      width: 0,
      x: 0,
      y: 0,
    });

  const prevTranslationY = useSharedValue(0);
  const inputValue = [0, height - 4 * tabBarHeight];
  const inputValueForShrinkedMusicPlayer = [
    height - 4 * tabBarHeight,
    (height - 4 * tabBarHeight) / 1.5,
  ];

  function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
  }

  const pan = Gesture.Pan()
    .onStart(e => {
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
    height: interpolate(translationY.value, inputValue, [height, 69], {
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

  const animatedStylesForShrinkedMusicPlayer = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translationY.value,
        inputValueForShrinkedMusicPlayer,
        [1, 0],
        {
          extrapolateLeft: Extrapolation.CLAMP,
          extrapolateRight: Extrapolation.CLAMP,
        },
      ),
    };
  });

  const animatedStyleForAlbumCover = useAnimatedStyle(() => {
    return {
      height: interpolate(translationY.value, inputValue, [80, 70], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }),
      width: interpolate(translationY.value, inputValue, [80, 70], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }),
      transform: [
        {
          translateX: interpolate(
            translationY.value,
            inputValue,
            [albumCoverContianerLayout.x, 0],
            {
              extrapolateLeft: Extrapolation.CLAMP,
              extrapolateRight: Extrapolation.CLAMP,
            },
          ),
        },
        {
          translateY: interpolate(
            translationY.value,
            inputValue,
            [albumCoverContianerLayout.y + 70, 0],
            {
              extrapolateLeft: Extrapolation.CLAMP,
              extrapolateRight: Extrapolation.CLAMP,
            },
          ),
        },
      ],
    };
  }, [albumCoverContianerLayout]);

  useEffect(() => {
    getColors(musicList[currentMusicIndex].image, {
      fallback: '#228B22',
      cache: true,
      key: musicList[currentMusicIndex].image,
      quality: 'highest',
    }).then(res => {
      setColors(res as Exclude<ImageColorsResult, WebImageColors>);
    });
  }, [currentMusicIndex]);

  if (!visible) return null;

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.overlay,
          {
            width: '100%',
            backgroundColor:
              Platform.OS === 'android'
                ? colors
                  ? lightenHexColor(
                      (colors as AndroidImageColors).dominant,
                      0.7,
                    )
                  : 'transparent'
                : colors
                ? lightenHexColor((colors as IOSImageColors).primary, 0.7)
                : 'transparent',
          },
          animatedStyles,
        ]}>
        {/* Music player shrinked */}
        <AnimatedLinearGradient
          colors={musicPlayerShrinkedColor}
          style={[
            styles.musicPlayerShrinkedContainer,
            animatedStylesForShrinkedMusicPlayer,
          ]}></AnimatedLinearGradient>
        {albumCoverContianerLayout.x !== 0 && (
          <Animated.Image
            source={{uri: musicList[currentMusicIndex].image}}
            style={[styles.musicPlayerCoverImage, animatedStyleForAlbumCover]}
          />
        )}

        <View style={{flex: 1, padding: 15}}>
          {/* like and AI mix Container */}
          <View style={styles.likeAndAImixContainer}></View>

          {/* Album cover and title container */}
          <View
            style={styles.albumCoverAndTitleContainer}
            onLayout={e => {
              console.log(e.nativeEvent.layout);
              setAlbumCoverContainerLayout(e.nativeEvent.layout);
            }}>
            <View style={styles.albumCoverContainer}></View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    // right: 0,
    bottom: tabBarHeight,
    overflow: 'hidden',
  },
  musicPlayerShrinkedContainer: {
    width: '100%',
    height: 70,
  },
  musicPlayerCoverImage: {
    resizeMode: 'contain',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 99,
  },
  likeAndAImixContainer: {
    width: '100%',
    height: 50,
    backgroundColor: 'yellow',
  },
  albumCoverAndTitleContainer: {
    width: '100%',
    height: 80,
    marginTop: 5,
    flexDirection: 'row',
  },
  albumCoverContainer: {
    height: 80,
    width: 80,
  },
});

export default MusicPlayerOverlay;
