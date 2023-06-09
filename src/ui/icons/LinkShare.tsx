import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const LinkShareIcon = ({color = '#161429', ...props}: SvgProps) => {
  return (
    <Svg width={17} height={18} viewBox="0 0 17 18" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.554 12.723c-.687 0-1.301.271-1.77.696L5.34 9.669c.046-.208.082-.416.082-.633 0-.217-.036-.425-.082-.632l6.37-3.714a2.7 2.7 0 001.844.732c1.5 0 2.711-1.211 2.711-2.711 0-1.5-1.21-2.711-2.71-2.711s-2.712 1.21-2.712 2.71c0 .218.037.426.082.633l-6.37 3.714a2.7 2.7 0 00-1.844-.732C1.21 6.325 0 7.536 0 9.036c0 1.5 1.21 2.711 2.71 2.711a2.7 2.7 0 001.844-.732l6.434 3.76c-.045.189-.072.388-.072.586A2.642 2.642 0 0013.554 18a2.642 2.642 0 002.639-2.639 2.642 2.642 0 00-2.639-2.638z"
        fill={color}
      />
    </Svg>
  );
};
