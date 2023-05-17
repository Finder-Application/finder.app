import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useFetchingPosts} from 'api';
import {Operator} from 'api/types.common';
import {useAuth} from 'core';
import {NavigatorKey} from 'navigation/constants';
import {YourPostNavigationProps} from 'navigation/YourPostNavigator';
import {InitAuth} from 'screens/Auth/InitScreen';
import {
  FEMALE_AVATAR_PLACE_HOLDER,
  MALE_AVATAR_PLACE_HOLDER,
  NUMBER_OF_POSTS_PER_LOADING,
} from 'screens/constants';
import {Post as PostComponent} from 'screens/Home/components/Post';
import {
  Image,
  LinearGradientView,
  Screen,
  Text,
  Touchable,
  View,
  YourPostDocsIcon,
} from 'ui';
import {formatUserName} from 'utils';

const CreateImage = require('./create.png');

export const YourPosts = () => {
  const navigation = useNavigation<YourPostNavigationProps>();

  const [currentUser, isLoggedIn] = useAuth(state => [
    state.user,
    state.isLoggedIn,
  ]);

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
    filter: [
      {
        operator: Operator.Equal,
        field: 'userId',
        value: currentUser?.userId?.toString() ?? '',
      },
    ],
  });

  const ownerName = formatUserName({
    user: {
      firstName: currentUser?.firstName,
      middleName: currentUser?.middleName,
      lastName: currentUser?.lastName,
    },
  });

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
    <>
      {!isLoggedIn ? (
        <InitAuth />
      ) : (
        <Screen justifyContent="flex-start" paddingVertical="m">
          {isError ? (
            <Text>An Error Happened</Text>
          ) : (
            <FlatList
              contentContainerStyle={styles.contentContainer}
              style={styles.listStyle}
              keyExtractor={item => item?.id?.toString()}
              refreshing={isRefetching}
              onRefresh={() => {
                refetch();
              }}
              ListHeaderComponent={
                <View alignItems="center" marginBottom="m">
                  <Image
                    height={100}
                    width={100}
                    borderRadius={50}
                    resizeMode="cover"
                    source={{
                      uri: currentUser?.avatar
                        ? currentUser.avatar
                        : currentUser?.gender === false
                        ? MALE_AVATAR_PLACE_HOLDER
                        : FEMALE_AVATAR_PLACE_HOLDER,
                    }}
                  />
                  <View flexDirection="row" alignItems="center">
                    <Text
                      fontWeight="700"
                      marginLeft="s"
                      fontSize={17}
                      marginRight="xs">
                      {ownerName}'s posts
                    </Text>
                    <YourPostDocsIcon />
                  </View>
                </View>
              }
              data={posts}
              renderItem={({item}) => <PostComponent post={item} />}
              ListFooterComponent={isFetchingNextPage ? renderFooter : null}
              ListEmptyComponent={
                isLoading ? (
                  renderFooter()
                ) : (
                  <View alignItems="center" flex={1} marginTop="xl">
                    <Image source={CreateImage} />
                    <Touchable
                      onPress={() => {
                        navigation.navigate(NavigatorKey.AddPost);
                      }}
                      width="100%"
                      marginTop="m">
                      <LinearGradientView
                        alignItems="center"
                        paddingVertical="m"
                        borderRadius={8}>
                        <Text fontWeight="700">
                          Start searching your missing one now!
                        </Text>
                      </LinearGradientView>
                    </Touchable>
                  </View>
                )
              }
              showsVerticalScrollIndicator={false}
              onEndReached={onLoadMore}
              onEndReachedThreshold={0.5}
            />
          )}
        </Screen>
      )}
    </>
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
