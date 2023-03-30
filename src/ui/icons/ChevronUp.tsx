import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const ChevronUpIcon = ({color = '#555', ...props}: SvgProps) => {
  return (
    <Svg width={12} height={7} viewBox="0 0 12 7" fill="none" {...props}>
      <Path
        d="M11.686 6.69a1.051 1.051 0 000-1.5L6.757.31a1.077 1.077 0 00-1.514 0L.314 5.19a1.051 1.051 0 000 1.5 1.077 1.077 0 001.514 0l4.177-4.125 4.167 4.124a1.087 1.087 0 001.514 0z"
        fill={color}
      />
    </Svg>
  );
};
