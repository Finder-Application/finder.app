import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useRelevantPosts} from 'api/posts';
import {Post} from 'api/posts/types';
import orderBy from 'lodash/orderBy';
import {Post as PostComponent} from 'screens/Home/components/Post';
import {Image, NoRelevantPostFoundIcon, Screen, Text, View} from 'ui';
import {LoadingIndicator} from 'ui/animations';

export const RelevantPosts = ({
  route,
}: {
  route?: {params: {postData: Post}};
}) => {
  const {postData} = route?.params ?? {};

  const {data, isLoading, isError, isRefetching, refetch} = useRelevantPosts({
    id: Number(postData?.id) || -1,
  });

  const renderFooter = () => {
    return (
      // Footer View with Loader
      <View style={styles.footer}>{true ? <LoadingIndicator /> : null}</View>
    );
  };

  const sortedPosts = orderBy(data, ['similar', 'similarText'], 'desc');

  return (
    <Screen
      justifyContent="flex-start"
      paddingVertical="m"
      style={styles.screenContainer}>
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
                  uri: postData?.photos[0],
                }}
              />

              {sortedPosts.length > 0 && (
                <Text fontSize={16}>
                  There are&nbsp;
                  <Text fontWeight="700">{sortedPosts.length} posts</Text>&nbsp;
                  matching to&nbsp;
                  <Text fontWeight="700">{postData?.fullName}</Text>
                </Text>
              )}
            </View>
          }
          data={sortedPosts}
          renderItem={({item}) => <PostComponent post={item} />}
          ListEmptyComponent={
            isLoading ? (
              renderFooter()
            ) : (
              <View alignItems="center" flex={1} marginTop="xl">
                <NoRelevantPostFoundIcon />
                <Text
                  color="grey12"
                  fontWeight="700"
                  fontSize={17}
                  marginTop="m">
                  No results found
                </Text>
                <Text textAlign="center">
                  There’s no posts that match &nbsp;
                  <Text fontWeight="700">{postData?.fullName}</Text>’s
                  information at the moment
                </Text>
              </View>
            )
          }
          showsVerticalScrollIndicator={false}
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
  screenContainer: {
    paddingBottom: 0,
  },
});
