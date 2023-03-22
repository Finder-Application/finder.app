import * as React from 'react';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  SvgProps,
} from 'react-native-svg';

type HomeIconProps = {
  strokeColor?: string;
};

export function HomeIcon({
  color = '#fff',
  strokeColor = '#000',
  ...props
}: SvgProps & HomeIconProps) {
  return (
    <Svg width={23} height={20} viewBox="0 0 23 20" fill="none" {...props}>
      <Path
        d="M3.667 10.5V10H1.344L11.5.86 21.655 10h-2.322v9.375h-5.25v-6.25H8.916v6.25h-5.25V10.5z"
        fill={color}
        stroke={strokeColor}
      />
    </Svg>
  );
}

export function ActiveHomeIcon(props: SvgProps) {
  return (
    <Svg width={23} height={20} viewBox="0 0 23 20" fill="none" {...props}>
      <Path
        d="M11.458 0L0 10.313h3.125v9.375h6.25v-6.25h4.167v6.25h6.25v-9.375h3.125L11.458 0z"
        fill="url(#paint0_linear_1172_13457)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1172_13457"
          x1={22.9167}
          y1={9.84396}
          x2={-5.01323e-8}
          y2={9.84396}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#7CDFFF" />
          <Stop offset={1} stopColor="#92FE9E" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
