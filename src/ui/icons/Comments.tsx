import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const CommentIcon = ({color = '#6E7F8D', ...props}: SvgProps) => {
  return (
    <Svg width={20} height={18} viewBox="0 0 20 18" fill="none" {...props}>
      <Path
        d="M6 9h.01H6zm4 0h.01H10zm4 0h.01H14zm5 0c0 4.418-4.03 8-9 8a9.861 9.861 0 01-4.255-.95L1 17l1.395-3.72C1.512 12.042 1 10.574 1 9c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
