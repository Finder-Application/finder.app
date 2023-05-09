import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const SearchResultsIcon = ({color = '#000', ...props}: SvgProps) => {
  return (
    <Svg width={15} height={15} viewBox="0 0 15 15" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.75 0a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5H.75zM0 3.75A.75.75 0 01.75 3H6a.75.75 0 010 1.5H.75A.75.75 0 010 3.75zm9 7.75a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM9 13c.834 0 1.607-.255 2.248-.691l1.472 1.471a.75.75 0 101.06-1.06l-1.471-1.472A4 4 0 109 13zM.75 6a.75.75 0 000 1.5H3A.75.75 0 003 6H.75z"
        fill={color}
      />
    </Svg>
  );
};
