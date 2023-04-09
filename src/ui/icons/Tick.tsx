import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const TickIcon = ({color = '#2DDF40', ...props}: SvgProps) => {
  return (
    <Svg width={12} height={10} viewBox="0 0 12 10" fill="none" {...props}>
      <Path
        d="M1 5.267L4.333 9 11 1"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
