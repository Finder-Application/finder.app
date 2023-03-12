import {Pressable as NSPressable} from 'react-native';
import {createBox} from '@shopify/restyle';

import {Theme} from './theme';

export const Pressable = createBox<
  Theme,
  React.ComponentProps<typeof NSPressable> & {children?: React.ReactNode}
>(NSPressable);
