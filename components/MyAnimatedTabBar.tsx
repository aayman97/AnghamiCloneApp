import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {tabBarHeight} from '../constants/constant';

const {width, height} = Dimensions.get('screen');
type props = {
  tabBarProps: BottomTabBarProps;
  translationY: SharedValue<number>;
};
const MyAnimatedTabBar: React.FC<props> = ({tabBarProps, translationY}) => {
  const AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            translationY.value,
            [0, height - 4 * tabBarHeight],
            [tabBarHeight, 0],
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[styles.tabBarContainer, AnimatedStyle]}></Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    width: '100%',
    height: tabBarHeight,
    backgroundColor: 'blue',
    position: 'absolute',
    bottom: 0,
  },
});

export default MyAnimatedTabBar;
