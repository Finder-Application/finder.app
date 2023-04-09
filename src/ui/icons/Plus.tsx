import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const PlusIcon = ({color = '#D9D9D9', ...props}: SvgProps) => {
  return (
    <Svg width={21} height={22} viewBox="0 0 21 22" fill="none" {...props}>
      <Path
        d="M19.5 8.75h-6.75V2c0-.797-.703-1.5-1.5-1.5h-1.5c-.844 0-1.5.703-1.5 1.5v6.75H1.5c-.844 0-1.5.703-1.5 1.5v1.5c0 .844.656 1.5 1.5 1.5h6.75V20c0 .844.656 1.5 1.5 1.5h1.5c.797 0 1.5-.656 1.5-1.5v-6.75h6.75c.797 0 1.5-.656 1.5-1.5v-1.5c0-.797-.703-1.5-1.5-1.5z"
        fill={color}
      />
    </Svg>
  );
};
