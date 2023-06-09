import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const TextIcon = ({color = 'black', ...props}: SvgProps) => {
  return (
    <Svg width={28} height={30} viewBox="0 0 28 30" fill="none" {...props}>
      <Path
        d="M0 26v4h28v-4H0zm9-8.4h10l1.8 4.4H25L15.5 0h-3L3 22h4.2L9 17.6zm5-13.64L17.74 14h-7.48L14 3.96z"
        fill={color}
      />
    </Svg>
  );
};
