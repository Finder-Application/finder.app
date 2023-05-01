import React from 'react';
import {StyleSheet} from 'react-native';
import {TAB_HEIGHT} from 'navigation/TabNavigator';

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
    style={styles.container}
    {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: TAB_HEIGHT + 20,
  },
});
