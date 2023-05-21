import React, {memo, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useGetListNotiComment, useGetListNotiPosts} from 'api/notifications';
import {RootStackNavigationProps} from 'navigation/types';
import {buildNavigationOptions} from 'navigation/utils';
import {LinearGradientView, Text, Touchable, View} from 'ui';

import {ShowListNoti} from './ShowListNoti';

export const Notifications = memo(() => {
  const [tab, setTab] = React.useState<'comment' | 'post'>('comment');

  const navigation = useNavigation<RootStackNavigationProps>();

  useEffect(() => {
    navigation.setOptions({
      ...buildNavigationOptions(navigation, ''),
      title: 'Notifications',
      headerShown: true,
    });
  }, []);

  return (
    <View flex={1}>
      <View flexDirection="row" borderRadius={16} justifyContent={'center'}>
        <View flexDirection="row" borderRadius={16} backgroundColor="white">
          <Touchable
            alignItems="center"
            backgroundColor="white"
            borderRadius={16}
            overflow="hidden"
            onPress={() => setTab('comment')}>
            {tab === 'comment' ? (
              <LinearGradientView paddingVertical="m" paddingHorizontal="m">
                <Text color="grey2">Comment</Text>
              </LinearGradientView>
            ) : (
              <Text paddingVertical="m" paddingHorizontal="m" color="grey2">
                Comment
              </Text>
            )}
          </Touchable>
          <Touchable
            alignItems="center"
            backgroundColor="white"
            borderRadius={16}
            overflow="hidden"
            onPress={() => setTab('post')}>
            {tab === 'post' ? (
              <LinearGradientView paddingVertical="m" paddingHorizontal="m">
                <Text color="grey2">Relevant Post</Text>
              </LinearGradientView>
            ) : (
              <Text paddingVertical="m" paddingHorizontal="m" color="grey2">
                Relevant Post
              </Text>
            )}
          </Touchable>
        </View>
      </View>

      {tab === 'comment' ? (
        <ShowListNoti useFetchingNoti={useGetListNotiComment} type="comment" />
      ) : (
        <ShowListNoti useFetchingNoti={useGetListNotiPosts} type="post" />
      )}
    </View>
  );
});
