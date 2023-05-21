import React, {useCallback} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {TAB_HEIGHT} from 'navigation/TabNavigator';
import {NUMBER_OF_POSTS_PER_LOADING} from 'screens/constants';
import {Screen, Text, View} from 'ui';
import {LoadingIndicator} from 'ui/animations';

import {NotiComponent} from './NotiComponent';

interface Props {
  useFetchingNoti: any;
  type: string;
}
export const ShowListNoti = ({useFetchingNoti, type}: Props) => {
  const {
    isLoading,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    refetch,
    isRefetching,
  } = useFetchingNoti({
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
      <View style={styles.footer}>{true ? <LoadingIndicator /> : null}</View>
    );
  };

  const onLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const posts = data?.pages.map((page: any) => page.data).flat() ?? [];

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
          keyExtractor={item => item?.id.toString()}
          refreshing={isRefetching}
          onRefresh={() => {
            refetch();
          }}
          data={posts}
          renderItem={({item}) => (
            <NotiComponent
              content={item?.content}
              title={item?.title}
              user={item?.user}
              seen={item?.seen}
              key={item?.id}
              id={item?.id}
              type={type}
              postId={item?.postId}
            />
          )}
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
    paddingBottom: TAB_HEIGHT + 20,
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
