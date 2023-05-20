import React, {useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import {createBox} from '@shopify/restyle';
import LottieViewRN from 'lottie-react-native';

import {Theme} from './theme';

const BaseLottieView = createBox<
  Theme,
  React.ComponentProps<typeof LottieViewRN>
>(LottieViewRN);

export const LottieView = ({
  source,
  ...props
}: React.ComponentProps<typeof BaseLottieView>) => {
  const lottieRef = useRef<LottieViewRN>(null);

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && lottieRef.current) {
        lottieRef.current.play();
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <BaseLottieView
      ref={lottieRef}
      width={10}
      height={10}
      autoPlay
      speed={0.5}
      source={source}
      {...props}
    />
  );
};
