import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {
  FinderIcon,
  LinearGradientView,
  PlaneIcon,
  Screen,
  Text,
  Touchable,
  UnderLinePencilIcon,
  View,
} from 'ui';

import {Post} from './components';

export const Home = () => {
  return (
    <Screen justifyContent="flex-start" paddingVertical="m">
      <FlatList
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <Touchable
            flexDirection="row"
            alignItems="center"
            backgroundColor="white"
            borderRadius={16}
            marginBottom="m"
            overflow="hidden">
            <View
              flexDirection="row"
              alignItems="center"
              flex={1}
              paddingLeft="m">
              <FinderIcon width={12} height={17} />
              <Text marginLeft="l" color="grey2">
                Write something ... <UnderLinePencilIcon />
              </Text>
            </View>
            <LinearGradientView paddingVertical="m" paddingHorizontal="m">
              <PlaneIcon />
            </LinearGradientView>
          </Touchable>
        }
        data={Array(10).fill(null)}
        renderItem={() => <Post />}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 50,
  },
});
