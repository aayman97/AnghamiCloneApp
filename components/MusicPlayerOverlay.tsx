import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  LayoutRectangle,
  Text,
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
import SongsAndLyricsComponent from './SongsAndLyricsComponent';
import TrackPlayer, { State } from 'react-native-track-player';
import Sound from 'react-native-sound';
import { getPlaybackState } from 'react-native-track-player/lib/src/trackPlayer';

interface OverlayProps {
  visible: boolean;
  translationY: SharedValue<number>;
}

const {width, height} = Dimensions.get('screen');

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

Sound.setCategory('Playback');

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
  const [currentSong,setCurrentSong] = useState<Sound | null>(null)
   const [loading,setLoading] = useState<boolean>(false)

  const prevTranslationY = useSharedValue(0);
  const inputValue = [0, height - 4 * tabBarHeight];
  const inputValueForShrinkedMusicPlayer = [
    height - 4 * tabBarHeight,
    (height - 4 * tabBarHeight) / 1.5,
  ];



  

  const extrapolationObject =  {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  }

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
    height: interpolate(translationY.value, inputValue, [height, 69], extrapolationObject),
    borderTopRightRadius: interpolate(translationY.value, inputValue, [20, 0]),
    borderTopLeftRadius: interpolate(translationY.value, inputValue, [20, 0]),
    transform: [
      {
        translateY: interpolate(
          translationY.value,
          inputValue,
          [tabBarHeight, 0],
         extrapolationObject
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
       extrapolationObject
      ),
    };
  });

  const animatedStyleForMusicPlayerSlider = useAnimatedStyle(() =>{
    return {
      transform : [{
        translateY : interpolate(translationY.value,inputValue,[0,height*0.5],extrapolationObject)
      }]
    }
  })

  

  useEffect(() => {
    getColors(musicList[currentMusicIndex].image, {
      fallback: '#228B22',
      cache: true,
      key: musicList[currentMusicIndex].image,
      quality: 'highest',
    }).then(res => {
      setColors(res as Exclude<ImageColorsResult, WebImageColors>);
    });

    const temp = new Sound(musicList[currentMusicIndex].song,error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }

      setCurrentSong(temp)
      // if loaded successfully
      console.log(
        'duration in seconds: ' +
        temp.getDuration() +
          ' number of channels: ' +
          temp.getNumberOfChannels(),
      );
    });
 
  

  }, [currentMusicIndex]);


useEffect(()=>{    
    currentSong?.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    })
  
},[currentSong])






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
                  : lightenHexColor("#0000FF",0.7)
                : colors
                ? lightenHexColor((colors as IOSImageColors).primary, 0.7)
                : lightenHexColor("#0000FF",0.7),
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

        <SongsAndLyricsComponent
          albumCoverContianerLayout={albumCoverContianerLayout}
          setAlbumCoverContainerLayout={setAlbumCoverContainerLayout}
          currentMusicIndex={currentMusicIndex}
          setCurrentMusicIndex={setCurrentMusicIndex}
          inputValue={inputValue}
          translationY={translationY}
        />

        {/* Music player slider and play and pause button */}
        <Animated.View style={[styles.sliderAndPlayContainer,animatedStyleForMusicPlayerSlider]}>
            {currentSong === null && !currentSong?.isPlaying() && <ActivityIndicator size={'large'} color={'black'}/>}
        </Animated.View>
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
  sliderAndPlayContainer :{
    width : "100%",
    height : height * 0.3,
    backgroundColor : 'red',
    bottom : 0
  }
});

export default MusicPlayerOverlay;
