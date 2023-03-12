import {SafeAreaView as NSafeAreaView} from 'react-native-safe-area-context';
import {createBox} from '@shopify/restyle';

import {Theme} from './theme';

export const SafeAreaView = createBox<
  Theme,
  React.ComponentProps<typeof NSafeAreaView> & {children?: React.ReactNode}
>(NSafeAreaView);
