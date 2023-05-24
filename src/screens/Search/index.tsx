import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {FlatList, StyleSheet, TextInput} from 'react-native';
import {useFetchingPosts} from 'api';
import {PostEntity} from 'api/posts/types';
import {Filter, Operator} from 'api/types.common';
import {useAuth} from 'core/Auth';
import {isNull, omitBy} from 'lodash';
import debounce from 'lodash/debounce';
import {NUMBER_OF_POSTS_PER_LOADING} from 'screens/constants';
import {Post as PostComponent} from 'screens/Home/components';
import {
  FilterIcon,
  MagnifierIcon,
  Screen,
  SearchInput,
  SearchResultsIcon,
  Text,
  theme,
  Touchable,
  View,
  WaveHandIcon,
} from 'ui';
import {LoadingIndicator} from 'ui/animations';
import {formatUserName} from 'utils';
import {shallow} from 'zustand/shallow';

import {FilterModal} from './components/FilterModal';
import {NoResultFound} from './components/NoResultFound';

export const SearchScreen = () => {
  const {control} = useForm();

  const [searchStates, setSearchStates] = useState<{
    searchKeywords?: string;
    gender?: number;
    city?: string;
    birthYear?: moment.Moment | null;
  }>();

  const searchInputRef = useRef<TextInput>(null);

  const [isLoggedIn, currentUser] = useAuth(
    state => [state.isLoggedIn, state.user],
    shallow,
  );

  const currentUserName = formatUserName({
    user: {
      firstName: currentUser?.firstName,
      middleName: currentUser?.middleName,
      lastName: currentUser?.lastName,
    },
  }).trim();

  const isSearching =
    !!searchStates?.birthYear ||
    !!searchStates?.city ||
    searchStates?.gender !== undefined ||
    !!searchStates?.searchKeywords;

  const postsToFilter: Filter<PostEntity>[] = useMemo(() => {
    const gender =
      searchStates?.gender !== undefined
        ? [
            {
              operator: Operator.Equal,
              field: 'gender' as keyof PostEntity,
              value: `${+searchStates.gender}`,
            },
          ]
        : [];
    const city = searchStates?.city
      ? [
          {
            operator: Operator.Equal,
            field: 'hometownRegion' as keyof PostEntity,
            value: `${searchStates.city}`,
          },
        ]
      : [];
    const birthYear =
      searchStates && searchStates.birthYear
        ? [
            {
              operator: Operator.Like,
              field: 'date_of_birth' as keyof PostEntity,
              value: `%${searchStates?.birthYear?.year()}%`,
            },
          ]
        : [];

    return [...gender, ...city, ...birthYear];
  }, [searchStates]);

  const search = useMemo(() => {
    const searchingFields = [
      'title',
      'fullName',
      'hometownRegion',
      'hometownState',
      'hometownHamlet',
      'missingRegion',
      'missingState',
      'missingHamlet',
      'missingCommune',
    ] as const;

    return {
      search: searchStates?.searchKeywords,
      fields: searchingFields,
    };
  }, [searchStates]);

  const query = omitBy(
    {
      take: NUMBER_OF_POSTS_PER_LOADING,
      filter: postsToFilter,
      order: {field: 'createdAt', direction: 'DESC'},
      q: searchStates?.searchKeywords ? JSON.stringify(search) : null,
    },
    isNull,
  );

  const onChangeText = useCallback(
    debounce((value: string) => {
      setSearchStates(prev => ({
        ...prev,
        searchKeywords: value,
      }));
    }, 1000),
    [],
  );
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
    ...query,
  });

  const [isModalVisible, setIsModalVisible] = React.useState(false);
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
    <Screen justifyContent="flex-start" alignItems="center" paddingVertical="m">
      {isError ? (
        <Text>An Error Happened</Text>
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
            <>
              <View>
                {isLoggedIn && (
                  <View flexDirection="row" alignItems="center">
                    <Text fontWeight="500" fontSize={24}>
                      Hello {currentUserName}
                    </Text>
                    <WaveHandIcon />
                  </View>
                )}
                <Text fontSize={17}>Let’s find your missing one</Text>
              </View>
              <SearchInput
                ref={searchInputRef}
                backgroundColor="white"
                borderWidth={1}
                borderColor="grey17"
                paddingHorizontal="m"
                marginVertical="l"
                inputProps={{
                  name: 'search',
                  control,
                  placeholder: 'Enter your keyword',
                  placeholderTextColor: theme.colors.grey19,
                  onChangeText: onChangeText,
                  style: {
                    fontSize: 15,
                    height: 56,
                    paddingLeft: theme.spacing.m,
                    flex: 1,
                  },
                }}
                prefix={<MagnifierIcon />}
                suffix={
                  <Touchable onPress={() => setIsModalVisible(true)}>
                    <FilterIcon />
                  </Touchable>
                }
              />

              {isSearching && posts.length > 0 && (
                <View
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  marginBottom="l">
                  <SearchResultsIcon />
                  <Text fontSize={17} color="grey23">
                    There are {data?.pages[0].meta.itemCount} posts relating to
                    your search
                  </Text>
                </View>
              )}
            </>
          }
          ListEmptyComponent={isLoading ? renderFooter() : <NoResultFound />}
          data={posts}
          renderItem={({item}) => <PostComponent post={item} />}
          ListFooterComponent={isFetchingNextPage ? renderFooter : null}
          showsVerticalScrollIndicator={false}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
        />
      )}

      <FilterModal
        visible={isModalVisible}
        filterValue={searchStates}
        onClose={() => setIsModalVisible(false)}
        onSubmit={payload => {
          console.log('payload: ', payload);
          setSearchStates(prev => ({
            ...prev,
            ...payload,
          }));
        }}
        onReset={() => {
          setSearchStates({
            gender: undefined,
            birthYear: undefined,
            city: undefined,
            searchKeywords: '',
          });
          searchInputRef?.current?.clear();
        }}
      />
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
