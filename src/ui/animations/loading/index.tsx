import React from 'react';
import {LottieView} from 'ui/LottieView';

export const LoadingIndicator = (
  props: Partial<React.ComponentProps<typeof LottieView>>,
) => {
  return (
    <LottieView
      source={require('./loading.json')}
      width={100}
      height={100}
      {...props}
    />
  );
};
