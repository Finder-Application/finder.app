import * as React from 'react';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  SvgProps,
} from 'react-native-svg';

export const FinderIcon = ({...props}: SvgProps) => {
  return (
    <Svg width={22} height={26} viewBox="0 0 22 26" fill="none" {...props}>
      <Path
        d="M17.115 25.233v-4.051c-7.82-.841-12.128-5.05-12.98-12.74H.018c-.429 8.114 6.973 16.96 17.097 16.791z"
        fill="url(#paint0_linear_1032_13027)"
      />
      <Path
        d="M17.17 8.375h4.28V.015h-4.28v8.36z"
        fill="url(#paint1_linear_1032_13027)"
      />
      <Path
        d="M8.55 0v8.361h4.303V0H8.55z"
        fill="url(#paint2_linear_1032_13027)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1032_13027"
          x1={8.55754}
          y1={8.44141}
          x2={8.55754}
          y2={25.2354}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#7CDFFF" />
          <Stop offset={0.46875} stopColor="#83E8E2" />
          <Stop offset={1} stopColor="#92FE9E" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_1032_13027"
          x1={19.3099}
          y1={0.015625}
          x2={19.3099}
          y2={8.37516}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#7CDFFF" />
          <Stop offset={0.46875} stopColor="#83E8E2" />
          <Stop offset={1} stopColor="#92FE9E" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_1032_13027"
          x1={10.7019}
          y1={0}
          x2={10.7019}
          y2={8.36122}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#7CDFFF" />
          <Stop offset={0.46875} stopColor="#83E8E2" />
          <Stop offset={1} stopColor="#92FE9E" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};
