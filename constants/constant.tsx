import { Platform } from "react-native";

export const tabBarHeight: number = Platform.OS === "android" ? 60 : 80;

export const musicList = [
  {
    image:
      'https://cdn.shoplightspeed.com/shops/635515/files/55496880/1024x1024x2/disturbed-immortalized-2lpexplicit.jpg',
    song : require('../assets/sounds/Disturbed_The_Sound_Of_Silence.mp3')
  },
];

export const musicPlayerShrinkedColor = ['#17181a', '#2b2c2e'];
