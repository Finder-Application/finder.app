import * as React from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
  SvgProps,
} from 'react-native-svg';

export function RoundedPlusIcon({...props}: SvgProps) {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
      <Circle cx={20} cy={20} r={20} fill="url(#paint0_linear_1112_12748)" />
      <Path
        d="M13.05 20h13.9M20 26.948V13.05"
        stroke="#fff"
        strokeWidth={2.5625}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1112_12748"
          x1={20}
          y1={0}
          x2={20}
          y2={40}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#7CDFFF" />
          <Stop offset={0.46875} stopColor="#83E8E2" />
          <Stop offset={1} stopColor="#92FE9E" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
