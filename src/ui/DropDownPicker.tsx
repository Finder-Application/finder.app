import RNDropDownPicker from 'react-native-dropdown-picker';
import {createBox} from '@shopify/restyle';

import {Theme} from './theme';

export const DropDownPicker = createBox<
  Theme,
  React.ComponentProps<typeof RNDropDownPicker> & {children?: React.ReactNode}
>(RNDropDownPicker);
