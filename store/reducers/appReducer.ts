import {SharedValue} from 'react-native-reanimated';
import {SET_MUSICPLAYER_HEIGHT_ANIMATION_VALUE} from '../constants';
import type {PayloadAction} from '@reduxjs/toolkit';

type intialStateProp = {
  musicPlayerHeightSharedValue: SharedValue<number> | number;
};

let intialState: intialStateProp = {
  musicPlayerHeightSharedValue: 0,
};

const appReducer = (
  state = intialState,
  action: PayloadAction<SharedValue<number> | number>,
) => {
  switch (action.type) {
    case SET_MUSICPLAYER_HEIGHT_ANIMATION_VALUE:
      console.log(
        'musicPlayerHeightSharedValue : ',
        state.musicPlayerHeightSharedValue,
      );
      return {
        ...state,
        musicPlayerHeightSharedValue: action.payload,
      };
    default:
      return state;
  }
};
export default appReducer;
