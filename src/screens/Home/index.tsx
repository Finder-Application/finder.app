import React, {useCallback} from 'react';
import {
  FlatList,
  // PermissionsAndroid,
  StyleSheet,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useFetchingPosts} from 'api/posts';
import useFirebase from 'core/notifications/useFirebase';
// import {useAuth} from 'core';
// import useFirebase from 'core/notifications/useFirebase';
import {NavigatorKey} from 'navigation/constants';
import {TAB_HEIGHT} from 'navigation/TabNavigator';
import {NUMBER_OF_POSTS_PER_LOADING} from 'screens/constants';
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
import {LoadingIndicator} from 'ui/animations';

import {Post as PostComponent} from './components';

export const Home = () => {
  const navigation = useNavigation<any>();

  useFirebase();

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
      <View style={styles.footer}>{true ? <LoadingIndicator /> : null}</View>
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
          keyExtractor={item => item?.id.toString()}
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
              overflow="hidden"
              onPress={() => navigation.navigate(NavigatorKey.AddPost)}>
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
