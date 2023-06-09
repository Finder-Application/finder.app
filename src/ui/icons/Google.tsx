import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const GoogleIcon = (props: SvgProps) => {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M5.42 14.465l-.823 3.072-3.007.063A11.765 11.765 0 01.182 12c0-1.96.476-3.808 1.321-5.436l2.678.491 1.173 2.661A7.025 7.025 0 004.974 12c0 .867.158 1.698.446 2.465z"
        fill="#FBBB00"
      />
      <Path
        d="M23.612 9.792c.135.715.206 1.453.206 2.208a11.815 11.815 0 01-4.42 9.216l-3.372-.173-.477-2.979a7.043 7.043 0 003.03-3.597h-6.32V9.792H23.613z"
        fill="#518EF8"
      />
      <Path
        d="M19.398 21.216A11.768 11.768 0 0112 23.818c-4.5 0-8.414-2.515-10.41-6.217l3.83-3.135a7.027 7.027 0 0010.129 3.598l3.85 3.152z"
        fill="#28B446"
      />
      <Path
        d="M19.544 2.902l-3.829 3.135a7.03 7.03 0 00-10.361 3.68l-3.85-3.152A11.816 11.816 0 0112 .182c2.868 0 5.497 1.021 7.544 2.72z"
        fill="#F14336"
      />
    </Svg>
  );
};
