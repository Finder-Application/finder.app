import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const FaceBookIcon = ({color = '#4092FF', ...props}: SvgProps) => {
  return (
    <Svg width={12} height={24} viewBox="0 0 12 24" fill="none" {...props}>
      <Path
        d="M7.796 24V13.07h3.554l.528-4.28H7.796V6.066c0-1.235.331-2.08 2.04-2.08H12V.17A27.682 27.682 0 008.83 0c-3.142 0-5.3 1.99-5.3 5.642v3.14H0v4.28h3.539V24h4.257z"
        fill={color}
      />
    </Svg>
  );
};
