import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {FlatList} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {
  useCreateComment,
  useCreateSubComment,
  useGetComments,
} from 'api/comments';
import {useAuth} from 'core';
import {AuthStackNavigationProps} from 'navigation/AuthNavigator';
import {
  AppScreens,
  FEMALE_AVATAR_PLACE_HOLDER,
  MALE_AVATAR_PLACE_HOLDER,
} from 'screens';
import {LinearGradientView} from 'ui';
import {CloseIcon} from 'ui/icons';
import {Image} from 'ui/Image';
import {SearchInput} from 'ui/SearchInput';
import {Text} from 'ui/Text';
import {Touchable} from 'ui/Touchable';
import {View} from 'ui/View';

import {Comment} from './Comment';

interface Props {
  postId: string;
}
export const UserComment = ({postId}: Props) => {
  const {control, getValues, resetField} = useForm();
  const navigation = useNavigation<AuthStackNavigationProps>();

  const [replyFor, setReplyFor] = useState('');
  const [isLoggedIn, currentUser] = useAuth(state => [
    state.isLoggedIn,
    state.user,
  ]);
  const {data, fetchNextPage, hasNextPage, isLoading, refetch} = useGetComments(
    {
      take: 20,
      order: {
        field: 'createdAt',
        direction: 'DESC',
      },
      optionKey: {
        id: postId?.toString(),
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-shadow
    () => null,
  );

  const {mutate: createComment} = useCreateComment();

  const {mutate: createSubComment} = useCreateSubComment();

  const onLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const onCreateComment = () => {
    const contentComment = getValues('comment');
    if (contentComment) {
      resetField('comment');

      if (replyFor) {
        createSubComment({
          postId: +postId,
          content: contentComment,
          repFor: +replyFor,
        });
      } else {
        createComment({
          postId: +postId,
          content: contentComment,
        });
      }

      setReplyFor('');
    }
  };

  return (
    <View>
      <FlatList
        refreshing={isLoading}
        onRefresh={() => {
          refetch();
        }}
        data={data?.pages.map(page => page.data).flat() ?? []}
        renderItem={({item}) => (
          <Comment setReplyFor={setReplyFor} item={item} />
        )}
        showsVerticalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
      />

      <View flexDirection="row" alignItems="center" marginBottom="s">
        <Image
          height={35}
          width={35}
          borderRadius={50}
          source={{
            uri: currentUser?.avatar
              ? currentUser.avatar
              : currentUser?.gender === false
              ? MALE_AVATAR_PLACE_HOLDER
              : FEMALE_AVATAR_PLACE_HOLDER,
          }}
        />

        {isLoggedIn ? (
          <View marginLeft="s" flex={1}>
            <View flexDirection="row" alignItems="center" marginBottom={'xs'}>
              {replyFor ? (
                <View flexDirection="row" alignItems="center">
                  <Text color="grey7" fontSize={11}>
                    Reply
                  </Text>
                  <Touchable
                    marginLeft="s"
                    onPress={() => {
                      setReplyFor('');
                    }}>
                    <CloseIcon />
                  </Touchable>
                </View>
              ) : (
                <Text color="grey7" fontSize={11}>
                  Add a comment... 🤔
                </Text>
              )}
            </View>
            <View flex={1}>
              <SearchInput
                flex={1}
                backgroundColor="grey6Opacity5"
                borderWidth={0}
                inputProps={{
                  name: 'comment',
                  control,
                  placeholder: 'Write a comment...',
                  style: {
                    fontSize: 12,
                  },
                  onEndEditing: onCreateComment,
                }}
              />
            </View>
          </View>
        ) : (
          <Touchable
            onPress={() => {
              navigation.navigate('AuthNavigator', {
                screen: AppScreens.Auth,
                params: {authType: 'login'},
              });
            }}>
            <LinearGradientView
              alignItems="center"
              marginLeft="s"
              paddingVertical="s"
              paddingHorizontal="s"
              borderRadius={8}>
              <Text fontWeight="700">Login to comment</Text>
            </LinearGradientView>
          </Touchable>
        )}
      </View>
    </View>
  );
};
