import React from 'react';
import {Dimensions, LayoutRectangle, StyleSheet, Text, TouchableOpacity, View,  FlatList
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {musicList} from '../constants/constant';
import LyricsCard from './LyricsCard';


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
  progressPosition : number
};

const SongsAndLyricsComponent: React.FC<props> = ({
  albumCoverContianerLayout,
  translationY,
  setAlbumCoverContainerLayout,
  inputValue,
  currentMusicIndex,
  setCurrentMusicIndex,
  progressPosition
}) => {
  
  const animatedStyleForAlbumCover = useAnimatedStyle(() => {
    return {
      height: interpolate(translationY.value, inputValue, [78, 68], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }),
      width: interpolate(translationY.value, inputValue, [80, 68], {
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
            [albumCoverContianerLayout.y + 70, 2],
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
            // console.log(e.nativeEvent.layout);
            setAlbumCoverContainerLayout(e.nativeEvent.layout);
          }}>
          <View style={styles.albumCoverContainer}></View>
        </View>


           

            <View style={{
            flex : 1
              // backgroundColor : 'blue'
            }}>
                 <FlatList
                    data={musicList[currentMusicIndex].lyrics}
                    keyExtractor={(item,index) => item.timestamp.toString()}
                    // estimatedItemSize={200}
                    
                    renderItem={({item,index}) =>{

                 
                      return(
                       
                        <LyricsCard item={item} position={progressPosition} index={index} lyrics={musicList[currentMusicIndex].lyrics}/>
                      )
                    }}
                    />
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
  verseContainer : {
    marginTop : 20
  },
  verseStyle : {
    // color :  "white",
    fontWeight : 'bold',
    fontSize : 30
  }
});

export default React.memo(SongsAndLyricsComponent);
