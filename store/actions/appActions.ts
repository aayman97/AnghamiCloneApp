import {SharedValue} from 'react-native-reanimated';
import {SET_MUSICPLAYER_HEIGHT_ANIMATION_VALUE} from '../constants';

export function setMusicPlayerHeightAnimation(
  num: SharedValue<number> | number,
) {
  console.log('num : ', num);
  return {
    type: SET_MUSICPLAYER_HEIGHT_ANIMATION_VALUE,
    payload: num,
  };
}
