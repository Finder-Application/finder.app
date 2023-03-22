import * as React from 'react';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  SvgProps,
} from 'react-native-svg';

type SearchIconProps = {
  strokeColor?: string;
};
export function SearchIcon({
  color = '#fff',
  strokeColor = '#000',
  ...props
}: SvgProps & SearchIconProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M11.59 11.609l-.316.276A6.467 6.467 0 017 13.5 6.509 6.509 0 01.5 7C.5 3.417 3.417.5 7 .5s6.5 2.917 6.5 6.5l-1.91 4.609zm0 0l.294-.335A6.467 6.467 0 0013.5 7l-1.91 4.609zm1.755 3.139l-1.281-2.682 2.682 1.28a10.474 10.474 0 00.548.595c.447.478.908.944 1.38 1.397l.002.002 1.389 1.355h0l.008.007.268.251-1.39 1.39-.25-.268h0l-.008-.008-1.356-1.39a35.592 35.592 0 00-1.398-1.38 12.456 12.456 0 00-.594-.549z"
        fill={color}
        stroke={strokeColor}
      />
    </Svg>
  );
}

export function ActiveSearchIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M7 14c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604-1.392-1.358c-.468-.449-.924-.91-1.367-1.384-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.967 6.967 0 0014 7c0-3.859-3.141-7-7-7S0 3.141 0 7s3.141 7 7 7z"
        fill="url(#paint0_linear_1177_13453)"
      />
      <Path
        d="M7 14c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604-1.392-1.358c-.468-.449-.924-.91-1.367-1.384-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.967 6.967 0 0014 7c0-3.859-3.141-7-7-7S0 3.141 0 7s3.141 7 7 7z"
        fill="url(#paint1_linear_1177_13453)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1177_13453"
          x1={19.06}
          y1={9.531}
          x2={-4.16955e-8}
          y2={9.531}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#7CDFFF" />
          <Stop offset={1} stopColor="#92FE9E" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_1177_13453"
          x1={19.06}
          y1={9.531}
          x2={-4.16955e-8}
          y2={9.531}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#7CDFFF" />
          <Stop offset={1} stopColor="#92FE9E" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
