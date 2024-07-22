import React, {createContext, useState, useContext, ReactNode} from 'react';
import MusicPlayerOverlay from '../components/MusicPlayerOverlay';
import {SharedValue} from 'react-native-reanimated';

interface OverlayContextProps {
  showOverlay: () => void;
  hideOverlay: () => void;
}

const MusicPlayerContext = createContext<OverlayContextProps | undefined>(
  undefined,
);

export const useOverlay = () => {
  const context = useContext(MusicPlayerOverlay);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
};

type props = {
  children: ReactNode;
  translationY: SharedValue<number>;
};

export const MusicPlayerProvider: React.FC<props> = ({
  children,
  translationY,
}) => {
  const [visible, setVisible] = useState(true);

  const showOverlay = () => setVisible(true);
  const hideOverlay = () => setVisible(false);

  return (
    <MusicPlayerContext.Provider value={{showOverlay, hideOverlay}}>
      {children}
      <MusicPlayerOverlay visible={visible} translationY={translationY} />
    </MusicPlayerContext.Provider>
  );
};
