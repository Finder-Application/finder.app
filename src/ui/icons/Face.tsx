import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path, SvgProps} from 'react-native-svg';

export const FaceIcon = ({...props}: SvgProps) => {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <G clipPath="url(#clip0_1488_18980)" fill="#000">
        <Path d="M12.246 14.255c-.621.479-1.417.745-2.246.745-.83 0-1.625-.266-2.246-.745a.412.412 0 00-.583.075.413.413 0 00.075.583c.762.592 1.741.92 2.754.92 1.012 0 1.992-.328 2.754-.92a.414.414 0 00-.047-.69.413.413 0 00-.461.032zM7.083 11.25a.833.833 0 100-1.667.833.833 0 000 1.667z" />
        <Path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm6.633 12.35c-.908 3.117-3.558 5.38-6.7 5.38-3.146 0-5.8-2.272-6.704-5.397-.992-.083-1.77-.983-1.77-2.091 0-1.059.712-1.93 1.637-2.08v-.004c1.742-1.22 3.17-2.908 3.412-4.208l.005.004v-.012c1.129 2.187 5.25 4.325 9.854 4.216.083-.012.162-.029.245-.029 1.063 0 1.926.946 1.926 2.113.004 1.158-.85 2.1-1.905 2.108z" />
        <Path d="M12.917 11.25a.833.833 0 100-1.667.833.833 0 000 1.667z" />
      </G>
      <Defs>
        <ClipPath id="clip0_1488_18980">
          <Path fill="#fff" d="M0 0H20V20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
