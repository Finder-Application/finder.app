import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const MicroPhoneIcon = ({...props}: SvgProps) => {
  return (
    <Svg width={20} height={28} viewBox="0 0 20 28" fill="none" {...props}>
      <Path d="M16 6v8a6 6 0 11-12 0V6a6 6 0 1112 0z" fill="#42A5F5" />
      <Path
        d="M20 14a1 1 0 00-2 0 8 8 0 01-16 0 1 1 0 10-2 0 10 10 0 009 9.95V26H5a1 1 0 000 2h10a1 1 0 000-2h-4v-2.05A10 10 0 0020 14z"
        fill="#455A64"
      />
      <Path d="M16 6v8a6 6 0 01-6 6V0a6 6 0 016 6z" fill="#1E88E5" />
    </Svg>
  );
};
