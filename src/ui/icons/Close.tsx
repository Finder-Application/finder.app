import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const CloseIcon = ({color = '#000', ...props}: SvgProps) => {
  return (
    <Svg width={11} height={11} viewBox="0 0 11 11" fill="none" {...props}>
      <Path
        d="M5.5 4.278L9.778 0 11 1.222 6.722 5.5 11 9.778 9.778 11 5.5 6.722 1.222 11 0 9.778 4.278 5.5 0 1.222 1.222 0 5.5 4.278z"
        fill={color}
      />
    </Svg>
  );
};
