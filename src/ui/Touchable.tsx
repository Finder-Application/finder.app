import {TouchableOpacity as NSTouchable} from 'react-native';
import {createBox} from '@shopify/restyle';

import {Theme} from './theme';

export const Touchable = createBox<
  Theme,
  React.ComponentProps<typeof NSTouchable> & {children?: React.ReactNode}
>(NSTouchable);
