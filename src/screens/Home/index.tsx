import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'ui';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  map: {
    flex: 1,
    backgroundColor: 'yellow',
    width: '100%',
  },
});

export const Home = () => {
  return (
    <View style={styles.page}>
      <Text>Home</Text>
    </View>
  );
};
