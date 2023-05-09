import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const ChevronDownIcon = ({color = '#8C8585', ...props}: SvgProps) => {
  return (
    <Svg width={9} height={6} viewBox="0 0 9 6" fill="none" {...props}>
      <Path
        d="M1.058 0L4.5 3.152 7.942 0 9 .97 4.5 5.1 0 .97 1.058 0z"
        fill={color}
      />
    </Svg>
  );
};
