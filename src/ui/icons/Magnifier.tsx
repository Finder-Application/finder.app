import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const MagnifierIcon = ({color = '#000', ...props}: SvgProps) => {
  return (
    <Svg width={21} height={20} viewBox="0 0 21 20" fill="none" {...props}>
      <Path
        d="M9.616.348c4.795 0 8.686 3.891 8.686 8.686 0 4.794-3.891 8.686-8.686 8.686C4.822 17.72.93 13.828.93 9.034.93 4.239 4.822.348 9.616.348zm0 15.441a6.755 6.755 0 006.756-6.755 6.754 6.754 0 00-6.756-6.756A6.753 6.753 0 002.86 9.034a6.754 6.754 0 006.756 6.755zm8.19.069l2.73 2.73-1.366 1.365-2.73-2.73 1.365-1.365z"
        fill={color}
      />
    </Svg>
  );
};
