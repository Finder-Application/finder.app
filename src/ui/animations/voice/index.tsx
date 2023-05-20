import React from 'react';
import {LottieView} from 'ui/LottieView';

export const VoiceRecognitionAnimation = (
  props: Partial<React.ComponentProps<typeof LottieView>>,
) => {
  return <LottieView source={require('./voice.json')} {...props} />;
};
