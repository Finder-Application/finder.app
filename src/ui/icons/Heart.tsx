import * as React from 'react';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  SvgProps,
} from 'react-native-svg';

type HeartIconProps = {
  strokeColor?: string;
};
export function HeartIcon({
  color = '#fff',
  strokeColor = '#000',
  ...props
}: SvgProps & HeartIconProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 20" fill="none" {...props}>
      <Path
        d="M12.151 19.206l-.003.002a.312.312 0 01-.296 0l-.003-.002c-.207-.11-2.917-1.586-5.568-3.908-2.677-2.344-5.156-5.43-5.156-8.75A5.804 5.804 0 016.922.75c1.951 0 3.635.837 4.678 2.227l.4.532.4-.532C13.443 1.587 15.127.75 17.078.75a5.804 5.804 0 015.797 5.797c0 3.321-2.48 6.407-5.156 8.751-2.65 2.322-5.36 3.799-5.568 3.908z"
        fill={color}
        stroke={strokeColor}
      />
    </Svg>
  );
}

export function ActiveHeartIcon(props: SvgProps) {
  return (
    <Svg width={23} height={20} viewBox="0 0 23 20" fill="none" {...props}>
      <Path
        d="M22.75 6.297c0 7.11-10.541 12.864-10.99 13.101a.812.812 0 01-.77 0C10.541 19.161 0 13.406 0 6.297A6.304 6.304 0 016.297 0c2.097 0 3.933.902 5.078 2.426C12.52.902 14.355 0 16.453 0a6.304 6.304 0 016.297 6.297z"
        fill="url(#paint0_linear_1177_13455)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1177_13455"
          x1={22.75}
          y1={9.7477}
          x2={-4.97677e-8}
          y2={9.7477}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#7CDFFF" />
          <Stop offset={1} stopColor="#92FE9E" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
