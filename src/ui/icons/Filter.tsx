import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const FilterIcon = ({color = '#333', ...props}: SvgProps) => {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M21 20h-7M10 20H3M21 12h-9M8 12H3M21 4h-5M12 4H3M14 23v-6M8 15V9M16 7V1"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
