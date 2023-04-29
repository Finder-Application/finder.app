import React, {useCallback} from 'react';
import {ActivityIndicator, FlatList, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useFetchingPosts} from 'api/posts';
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

import {Post as PostComponent} from './components';

const NUMBER_OF_POSTS_PER_LOADING = 5;
export const Home = () => {
  const {
    isLoading,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    refetch,
    isRefetching,
  } = useFetchingPosts({
    take: NUMBER_OF_POSTS_PER_LOADING,
    order: {field: 'createdAt', direction: 'DESC'},
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  const renderFooter = () => {
    return (
      // Footer View with Loader
      <View style={styles.footer}>{true ? <ActivityIndicator /> : null}</View>
    );
  };

  const onLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const posts = data?.pages.map(page => page.data).flat() ?? [];

  return (
    <Screen justifyContent="flex-start" paddingVertical="m">
      {isError ? (
        <Text>An Error Happened</Text>
      ) : isLoading ? (
        renderFooter()
      ) : (
        <FlatList
          contentContainerStyle={styles.contentContainer}
          style={styles.listStyle}
          keyExtractor={item => item.id.toString()}
          refreshing={isRefetching}
          onRefresh={() => {
            refetch();
          }}
          ListHeaderComponent={
            <Touchable
              flexDirection="row"
              alignItems="center"
              backgroundColor="white"
              borderRadius={16}
              marginBottom="m"
              flex={1}
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
          data={posts}
          renderItem={({item}) => <PostComponent post={item} />}
          ListFooterComponent={isFetchingNextPage ? renderFooter : null}
          showsVerticalScrollIndicator={false}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 50,
  },
  listStyle: {
    width: '100%',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
