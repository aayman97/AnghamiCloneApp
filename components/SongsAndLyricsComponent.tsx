import React from 'react';
import {Dimensions, LayoutRectangle, StyleSheet, View} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {musicList} from '../constants/constant';

const {width, height} = Dimensions.get('screen');

type props = {
  albumCoverContianerLayout: LayoutRectangle;
  setAlbumCoverContainerLayout: React.Dispatch<
    React.SetStateAction<LayoutRectangle>
  >;
  translationY: SharedValue<number>;
  inputValue: number[];
  currentMusicIndex: number;
  setCurrentMusicIndex: React.Dispatch<React.SetStateAction<number>>;
};

const SongsAndLyricsComponent: React.FC<props> = ({
  albumCoverContianerLayout,
  translationY,
  setAlbumCoverContainerLayout,
  inputValue,
  currentMusicIndex,
  setCurrentMusicIndex,
}) => {
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

  return (
    <>
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
    </>
  );
};

const styles = StyleSheet.create({
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

export default SongsAndLyricsComponent;
