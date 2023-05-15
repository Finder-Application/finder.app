import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const ChevronRightIcon = ({color = '#4B4B4B', ...props}: SvgProps) => {
  return (
    <Svg width={8} height={15} viewBox="0 0 8 15" fill="none" {...props}>
      <Path
        d="M.59 12.586l4.58-5.143L.59 2.301 2 .721l6 6.722-6 6.722-1.41-1.58z"
        fill={color}
      />
    </Svg>
  );
};
