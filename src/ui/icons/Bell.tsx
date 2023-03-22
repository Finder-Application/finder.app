import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const BellIcon = ({color = '#000', ...props}: SvgProps) => {
  return (
    <Svg width={21} height={21} viewBox="0 0 21 21" fill="none" {...props}>
      <Path
        d="M18.21 14.824h1.93v1.93H.837v-1.93h1.93V8.07a7.72 7.72 0 1115.442 0v6.755zm-1.931 0V8.07a5.79 5.79 0 00-11.581 0v6.755h11.581zm-8.686 3.86h5.79v1.931h-5.79v-1.93z"
        fill={color}
      />
    </Svg>
  );
};
