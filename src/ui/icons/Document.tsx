import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const DocumentIcon = ({color = '#000', ...props}: SvgProps) => {
  return (
    <Svg width={17} height={21} viewBox="0 0 17 21" fill="none" {...props}>
      <Path
        d="M10.417 0H2.083A2.08 2.08 0 00.01 2.083L0 18.75a2.08 2.08 0 002.073 2.083h12.51a2.09 2.09 0 002.084-2.083V6.25L10.417 0zM12.5 16.667H4.167v-2.084H12.5v2.084zm0-4.167H4.167v-2.083H12.5V12.5zM9.375 7.292v-5.73l5.73 5.73h-5.73z"
        fill={color}
      />
    </Svg>
  );
};
