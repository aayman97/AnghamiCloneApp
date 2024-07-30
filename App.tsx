/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Home from './screens/Home';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MusicPlayerOverlay from './components/MusicPlayerOverlay';
import {MusicPlayerProvider} from './context/MusicPlayerProvider';
import {tabBarHeight} from './constants/constant';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import {SharedValue, useSharedValue} from 'react-native-reanimated';
import MyAnimatedTabBar from './components/MyAnimatedTabBar';
import TrackPlayer from 'react-native-track-player';

const Tab = createBottomTabNavigator();

type myTabsProp = {
  translationY: SharedValue<number>;
};


TrackPlayer.setupPlayer()


const MyTabs: React.FC<myTabsProp> = ({translationY}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: tabBarHeight,
        },
      }}
      tabBar={props => {
        return (
          <MyAnimatedTabBar tabBarProps={props} translationY={translationY} />
        );
      }}>
      <Tab.Screen name="Home" component={Home} />
    </Tab.Navigator>
  );
};

function App(): React.JSX.Element {
  const translationY = useSharedValue(0);

  return (
    <Provider store={configureStore()}>
      <GestureHandlerRootView style={{flex: 1}}>
        <MusicPlayerProvider translationY={translationY}>
          <NavigationContainer>
            <MyTabs translationY={translationY} />
          </NavigationContainer>
        </MusicPlayerProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    width: '100%',
    height: tabBarHeight,
    backgroundColor: 'blue',
  },
});

export default App;
