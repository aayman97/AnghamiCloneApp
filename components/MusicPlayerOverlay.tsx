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
  TouchableOpacity,
} from 'react-native';
import {FlatList, Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  clamp,
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
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
import TrackPlayer, { Capability, RepeatMode, State, useProgress } from 'react-native-track-player';
import { formatTime } from '../helpers/formatTime';
import PlayButton from './PlayButton';


interface OverlayProps {
  visible: boolean;
  translationY: SharedValue<number>;
}

enum PlayerState {
  Playing = "Playing",
  Stopped = "Stopped",
 
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

   const [playerState,setPlayerState] = useState<PlayerState | undefined>()
  //  const [loading,setLoading] = useState<boolean>(false)

  const prevTranslationY = useSharedValue(0);
  const inputValue = [0, height - 4 * tabBarHeight];
  const inputValueForShrinkedMusicPlayer = [
    height - 4 * tabBarHeight,
    (height - 4 * tabBarHeight) / 1.5,
  ];

  const indicatorBallSharedValue=useSharedValue(0)
  const prevIndicatorBallSharedValue=useSharedValue(0)
  const scaleIndicatorBallSharedValue =useSharedValue(1)



  

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



    const LoadingBarPan = Gesture.Pan()
    .onStart(() =>{
      runOnJS(setPlayerState)(PlayerState.Stopped)
      prevIndicatorBallSharedValue.value = indicatorBallSharedValue.value
      scaleIndicatorBallSharedValue.value= withSpring(1.5,{
        duration : 100
      })
    })
    .onUpdate(event => {
      indicatorBallSharedValue.value = clamp(prevIndicatorBallSharedValue.value+event.translationX,0,width)

      TrackPlayer.pause()
    }).onEnd(() =>{
      prevIndicatorBallSharedValue.value = indicatorBallSharedValue.value
      TrackPlayer.seekTo(((indicatorBallSharedValue.value + 7.5)/width)* progress.duration).then(() => {


        scaleIndicatorBallSharedValue.value= withSpring(1,{
          duration : 100
        },(finished) =>{
          if(finished){
            runOnJS(setPlayerState)(PlayerState.Playing)

            runOnJS(TrackPlayer.play)()
          }
        })
       
      })

     
      
    }) .runOnJS(true)

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



  
  const progress = useProgress();

  TrackPlayer.updateOptions({
    capabilities: [
    Capability.Play,
    Capability.Pause,
    ]})

  useEffect(() => {
    getColors(musicList[currentMusicIndex].image, {
      fallback: '#228B22',
      cache: true,
      key: musicList[currentMusicIndex].image,
      quality: 'highest',
    }).then(res => {
      setColors(res as Exclude<ImageColorsResult, WebImageColors>);
      TrackPlayer.add([{
        url : musicList[currentMusicIndex].song,
        artwork : musicList[currentMusicIndex].image,
        title : "Sound of Silence",
        artist : 'Disturbed'
      }]).then(res =>{
        TrackPlayer.play();
        setPlayerState(PlayerState.Playing)
        TrackPlayer.setRepeatMode(RepeatMode.Off)
      })
    });

  }, [currentMusicIndex]);






  const animatedStyleForProgressBarShrinked = useAnimatedStyle(() =>{
      return{
        width : interpolate(progress.position,[0,progress.duration],[0,width]),
        opacity : interpolate(translationY.value,inputValue,[0,1])
      }
  },[progress.position])


  const animatedStyleForLoadingBar = useAnimatedStyle(() =>{

    return{
      width : interpolate(progress.position,[0,progress.duration],[0,width]),
    }
},[progress.position])

const animatedStyleForBallIndicator = useAnimatedStyle(() =>{
  return{
    transform : [{
      translateX : indicatorBallSharedValue.value
    },{
      scale : scaleIndicatorBallSharedValue.value
    }]
  }
},[])


useEffect(() =>{
  
  indicatorBallSharedValue.value = withTiming((width * (progress.position/progress.duration))-7.5,{
    duration : 100
  })
},[progress.position])



useEffect(() =>{
  if(playerState === PlayerState.Playing){
    TrackPlayer.play()
  }else{
    TrackPlayer.pause()
  }
},[playerState])


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
          ]}>
            <TouchableOpacity style={{width : "100%",height : "100%"}}
            onPress={() =>{
              translationY.value = withTiming(0,{
                duration : 300
              })
            }}
            >

            </TouchableOpacity>
          </AnimatedLinearGradient>

        <SongsAndLyricsComponent
          albumCoverContianerLayout={albumCoverContianerLayout}
          setAlbumCoverContainerLayout={setAlbumCoverContainerLayout}
          currentMusicIndex={currentMusicIndex}
          setCurrentMusicIndex={setCurrentMusicIndex}
          inputValue={inputValue}
          translationY={translationY}
          progressPosition={progress.position}
        />


  
    {/* white bar for progress */}
          <View style={styles.progressBarShrinked}>
            <Animated.View style={[{height : "100%",backgroundColor : 'white'},animatedStyleForProgressBarShrinked]}/>
          </View>

          
        {/* Music player slider and play and pause button */}
        <Animated.View style={[styles.sliderAndPlayContainer,animatedStyleForMusicPlayerSlider]}>


            {/* Loading Bar and slider*/}
         
            <View style={styles.loadingContainer}>
              <Animated.View  style={[{height : "100%",backgroundColor : 'white'},animatedStyleForLoadingBar]} />
             
                <GestureDetector gesture={LoadingBarPan}>
                <Animated.View style={[styles.ballIndicator,animatedStyleForBallIndicator]}>
                  <View style={styles.viewForPressingOnBall}/>
                  </Animated.View>
                </GestureDetector>
              </View>

              {/* time indicator */}

              <View style={styles.timeIndicatorContainer}>
                {/* start time */}
                <Text style={styles.timeTextStyle}>
                {formatTime(progress.position)}
                </Text>

                <Text style={styles.timeTextStyle}>
                -{formatTime(progress.duration - progress.position)}
                </Text>
              </View>

               {/*Play button*/}
               <View style={styles.playButtonContainer}>
                  <PlayButton playerState={playerState} setPlayerState={setPlayerState}/>
                </View>
           
          
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
    height : height * 0.25,
    backgroundColor : 'rgba(0,0,0,0.3)',
    bottom : 0,
    // paddingHorizontal : 10,
    alignItems : 'center'
  },
  progressBarShrinked : {width :width,height : 2,backgroundColor : 'rgba(255,255,255,0.2)',position : 'absolute',zIndex : 100,top : 0},
  loadingContainer : {
    width :width,height : 5,backgroundColor : 'rgba(255,255,255,0.2)'
  },
  ballIndicator : {
    height : 15,
    width : 15,
    backgroundColor : 'white',
    position : 'absolute',
    // right : -15,
    bottom : -5,
    borderRadius : 15,
    alignItems : 'center',
    justifyContent : 'center'
  },
  viewForPressingOnBall : {
    width : 30,
    height : 30,
    // backgroundColor : 'red'
  },
  timeIndicatorContainer : {width : "100%",height : 40,marginTop : 5,zIndex: -1,alignItems : 'center', flexDirection : 'row',paddingHorizontal : 10,  justifyContent : 'space-between'},
  timeTextStyle : {
    color : 'white',
    fontSize : 15,
    fontWeight : 'bold',
  
  },
  playButtonContainer:{
  // backgroundColor : 'red',
    // height : 200,
    width : width,
    flex : 1,
    flexDirection : 'row',
    // alignItems : 'center',
    justifyContent : 'center'
  }
});

export default MusicPlayerOverlay;
