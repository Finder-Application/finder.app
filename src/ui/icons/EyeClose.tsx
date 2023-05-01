import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const EyeCloseIcon = ({color = '#6A707C', ...props}: SvgProps) => {
  return (
    <Svg width={20} height={12} viewBox="0 0 20 12" fill="none" {...props}>
      <Path
        d="M17.5 9l-2.475-3.396M10 10.5V7M2.5 9l2.469-3.388M1 1c3.6 8 14.4 8 18 0"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
