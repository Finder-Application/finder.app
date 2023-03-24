import {Image as RNImage} from 'react-native';
import {createBox} from '@shopify/restyle';

import {Theme} from './theme';

export const Image = createBox<Theme, React.ComponentProps<typeof RNImage>>(
  RNImage,
);
