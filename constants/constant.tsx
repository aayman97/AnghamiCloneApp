import { Platform } from "react-native";

export const tabBarHeight: number = Platform.OS === "android" ? 60 : 80;



const secondDelayCoff = 0
export const musicList = [
  {
    image:
      'https://cdn.shoplightspeed.com/shops/635515/files/55496880/1024x1024x2/disturbed-immortalized-2lpexplicit.jpg',
    song : require('../assets/sounds/disturbed_The_Sound_Of_Silence.mp3'),
    lyrics : [
      { "timestamp": 0+secondDelayCoff, "lyrics": "[Music Intro]" },
      { "timestamp": 9+secondDelayCoff, "lyrics": "Hello darkness, my old friend" },
      { "timestamp": 15+secondDelayCoff, "lyrics": "I've come to talk with you again" },
      { "timestamp": 20+secondDelayCoff, "lyrics": "Because a vision softly creeping" },
      { "timestamp": 27+secondDelayCoff, "lyrics": "Left its seeds while I was sleeping" },
      { "timestamp": 32+secondDelayCoff, "lyrics": "And the vision that was planted in my brain" },
      { "timestamp": 41+secondDelayCoff, "lyrics": "Still remains" },
      { "timestamp": 45+secondDelayCoff, "lyrics": "Within the sound of silence" },
      { "timestamp": 53+secondDelayCoff, "lyrics": "In restless dreams I walked alone" },
      { "timestamp": 59+secondDelayCoff, "lyrics": "Narrow streets of cobblestone" },
      { "timestamp": 65+secondDelayCoff, "lyrics": "'Neath the halo of a streetlamp" },
      { "timestamp": 70+secondDelayCoff, "lyrics": "I turned my collar to the cold and damp" },
      { "timestamp": 77+secondDelayCoff, "lyrics": "When my eyes were stabbed by the flash of a neon light" },
      { "timestamp": 85+secondDelayCoff, "lyrics": "That split the night" },
      { "timestamp": 90+secondDelayCoff, "lyrics": "And touched the sound of silence" },
      { "timestamp": 96+secondDelayCoff, "lyrics": "And in the naked light I saw" },
      { "timestamp": 102+secondDelayCoff, "lyrics": "Ten thousand people, maybe more" },
      { "timestamp": 107+secondDelayCoff, "lyrics": "People talking without speaking" },
      { "timestamp": 113+secondDelayCoff, "lyrics": "People hearing without listening" },
      { "timestamp": 117+secondDelayCoff, "lyrics": "People writing songs that voices never share" },
      { "timestamp": 127+secondDelayCoff, "lyrics": "And no one dare" },
      { "timestamp": 131+secondDelayCoff, "lyrics": "Disturb the sound of silence" },
      { "timestamp": 138+secondDelayCoff, "lyrics": "\"Fools,\" said I, \"You do not know" },
      { "timestamp": 144+secondDelayCoff, "lyrics": "Silence like a cancer grows" },
      { "timestamp": 150+secondDelayCoff, "lyrics": "Hear my words that I might teach you" },
      { "timestamp": 155+secondDelayCoff, "lyrics": "Take my arms that I might reach you\"" },
      { "timestamp": 161+secondDelayCoff, "lyrics": "But my words like silent raindrops fell" },
      { "timestamp": 171+secondDelayCoff, "lyrics": "And echoed in the wells of silence" },
      { "timestamp": 179+secondDelayCoff, "lyrics": "And the people bowed and prayed" },
      { "timestamp": 184+secondDelayCoff, "lyrics": "To the neon god they made" },
      { "timestamp": 190+secondDelayCoff, "lyrics": "And the sign flashed out its warning" },
      { "timestamp": 196+secondDelayCoff, "lyrics": "In the words that it was forming" },
      { "timestamp": 201+secondDelayCoff, "lyrics": "And the sign said, \"The words of the prophets are written on the subway walls" },
      { "timestamp": 211+secondDelayCoff, "lyrics": "And tenement halls" },
      { "timestamp": 214+secondDelayCoff, "lyrics": "And whispered in the sound of silence\"" },
      { "timestamp": 228+secondDelayCoff, "lyrics": "..." }
  ]
  
  },
];

export const musicPlayerShrinkedColor = ['#17181a', '#2b2c2e'];
