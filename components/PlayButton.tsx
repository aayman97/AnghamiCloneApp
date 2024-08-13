import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';


const {width,height} = Dimensions.get("screen")

const widthAndHeightOfTheButton = {
    width : width*0.25,
    height : width*0.25,
}


enum PlayerState {
    Playing = "Playing",
    Stopped = "Stopped"
  }


  const duration : number = 200

  const inputRange: number[] = [1,0.05]
const PlayButton = () =>{


const [playerState,setPlayerState] = useState<PlayerState>(PlayerState.Playing)


    
    const playButtonSharedValue = useSharedValue(1)
    const pauseButtonSharedValue = useSharedValue(0)


    const animatedStyleForPlayButton = useAnimatedStyle(() =>{
        return{
            transform : [{
                scaleX : playButtonSharedValue.value
            }],
            opacity : interpolate(playButtonSharedValue.value,inputRange,[1,0])
        }
    },[])


    const animatedStyleForPauseButton = useAnimatedStyle(() =>{
        return{
            transform : [{
                scaleX : pauseButtonSharedValue.value
            }],
            opacity : interpolate(pauseButtonSharedValue.value,inputRange,[1,0])
        }
    },[])

    

    const changePlayerState = () =>{
        if(playerState === PlayerState.Playing){
            playButtonSharedValue.value = withTiming(0.05,{
                duration
            },(finished) =>{
                if(finished){
                    runOnJS(setPlayerState)(PlayerState.Stopped)
                    pauseButtonSharedValue.value = withTiming(1,{
                        duration
                    } )
                }
            })
        }else{
            pauseButtonSharedValue.value = withTiming(0.05,{
                duration
            },(finished) =>{
                if(finished){
                    runOnJS(setPlayerState)(PlayerState.Playing)
                    playButtonSharedValue.value = withTiming(1,{
                        duration
                    } )
                }
            })
        }
    }

    return(
        <TouchableOpacity style={styles.buttonContainer} onPress={changePlayerState}>
        {playerState === PlayerState.Playing && <Animated.Image source={require('../assets/images/play-icon.png')} style={[styles.playIconStyle,{left : 4},animatedStyleForPlayButton]}/>}
        {playerState === PlayerState.Stopped && <Animated.Image source={require('../assets/images/pause-icon.png')} style={[styles.playIconStyle,animatedStyleForPauseButton]}/>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonContainer : {
        ...widthAndHeightOfTheButton,
        backgroundColor : 'white',
        alignItems : 'center',
        justifyContent : 'center',
        borderRadius : width*0.4,
    },
    playIconStyle : {
        height : width*0.13,        
        resizeMode : 'contain'
    }

})
export default PlayButton