import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const EyeOpenIcon = ({color = '#6A707C', ...props}: SvgProps) => {
  return (
    <Svg width={18} height={12} viewBox="0 0 18 12" fill="none" {...props}>
      <Path
        d="M1.328 7.824C2.104 4.096 5.349 1.447 9 1.447c3.65 0 6.895 2.649 7.672 6.377a.57.57 0 001.116-.232C16.904 3.352 13.204.309 9 .309 4.796.309 1.097 3.35.212 7.592a.57.57 0 001.116.232zm7.66-4.1a3.984 3.984 0 110 7.968 3.984 3.984 0 010-7.968z"
        fill={color}
      />
    </Svg>
  );
};
