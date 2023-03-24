import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const ThreeDotsIcon = ({color = '#161429', ...props}: SvgProps) => {
  return (
    <Svg width={20} height={6} viewBox="0 0 20 6" fill="none" {...props}>
      <Path
        d="M2.5.5A2.507 2.507 0 000 3c0 1.375 1.125 2.5 2.5 2.5S5 4.375 5 3 3.875.5 2.5.5zm15 0A2.507 2.507 0 0015 3c0 1.375 1.125 2.5 2.5 2.5S20 4.375 20 3 18.875.5 17.5.5zM10 .5A2.507 2.507 0 007.5 3c0 1.375 1.125 2.5 2.5 2.5s2.5-1.125 2.5-2.5S11.375.5 10 .5z"
        fill={color}
      />
    </Svg>
  );
};
