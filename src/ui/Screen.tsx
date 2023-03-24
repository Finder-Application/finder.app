import React from 'react';

import {View} from './View';

type Props = {
  children: React.ReactNode;
};

export const Screen = ({
  children,
  ...props
}: Props & React.ComponentProps<typeof View>) => (
  <View
    justifyContent="center"
    flexDirection="column"
    alignItems="center"
    paddingHorizontal="m"
    flex={1}
    bg="background"
    {...props}>
    {children}
  </View>
);
