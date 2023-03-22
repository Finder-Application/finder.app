import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const ChevronLeftIcon = ({color = '#161429', ...props}: SvgProps) => {
  return (
    <Svg width={9} height={15} viewBox="0 0 9 15" fill="none" {...props}>
      <Path
        d="M8.446.393a1.337 1.337 0 00-1.892 0L.393 6.553a1.337 1.337 0 000 1.893l6.16 6.161c.524.524 1.37.524 1.893 0a1.337 1.337 0 000-1.892L3.238 7.493l5.208-5.208a1.349 1.349 0 000-1.892z"
        fill={color}
      />
    </Svg>
  );
};
