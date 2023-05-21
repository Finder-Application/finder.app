import React from 'react';
import {Alert, Platform} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {MenuView} from '@react-native-menu/menu';
import {useNavigation} from '@react-navigation/native';
import {AuthErrorResponse} from 'api/auth/types';
import {useDeletePost} from 'api/posts';
import {Post} from 'api/posts/types';
import {AxiosError} from 'axios';
import {useAppStore} from 'core';
import {RootStackNavigationProps} from 'navigation/types';
import {AppScreens, COMMON_ERROR_MESSAGE} from 'screens/constants';
import {ThreeDotsIcon, Touchable} from 'ui';

type PostMenuViewProps = {
  data: Post;
  onDelete?: () => void;
};
export const PostMenuView = (props: PostMenuViewProps) => {
  const {data, onDelete} = props;
  const navigation = useNavigation<RootStackNavigationProps>();

  const deletePostMutation = useDeletePost();
  const setShowLoadingModal = useAppStore(state => state.setShowLoadingModal);

  return (
    <MenuView
      title="Menu Title"
      onPressAction={({nativeEvent}) => {
        if (nativeEvent.event === 'edit') {
          navigation.navigate(AppScreens.AddPost, {post: data});
        }
        if (nativeEvent.event === 'view-relevant') {
          navigation.navigate(AppScreens.RelevantPosts, {postData: data});
        }

        if (nativeEvent.event === 'destructive') {
          Alert.alert(
            'Are you sure?',
            'You will not able to recover this post!',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: async () => {
                  try {
                    setShowLoadingModal(true);
                    await deletePostMutation
                      .mutateAsync({id: data.id})
                      .then(() => {
                        showMessage({
                          message: 'Delete post successfully',
                          type: 'success',
                        });
                        onDelete && onDelete();
                      })
                      .catch((e: AxiosError<AuthErrorResponse>) => {
                        console.log('Failed to delete: ', e);
                        showMessage({
                          message:
                            e.response?.data?.message ?? COMMON_ERROR_MESSAGE,
                          type: 'danger',
                        });
                      });
                  } catch (e) {
                    console.log('e: ', e);
                  }
                  setShowLoadingModal(false);
                },
              },
            ],
            {
              cancelable: false,
            },
          );
          // deletePostMutation.mutate({id: data.id});
        }
      }}
      actions={[
        {
          id: 'edit',
          title: 'Edit Post',
          titleColor: '#46F289',
          image: Platform.select({
            ios: 'square.and.arrow.up',
            android: 'ic_menu_edit',
          }),
          imageColor: '#46F289',
          state: 'on',
        },
        {
          id: 'destructive',
          title: 'Delete Post',
          attributes: {
            destructive: true,
          },
          image: Platform.select({
            ios: 'trash',
            android: 'ic_menu_delete',
          }),
        },
        {
          id: 'view-relevant',
          title: 'Relevant Posts',
          image: Platform.select({
            ios: 'view',
            android: 'ic_menu_gallery',
          }),
        },
      ]}
      shouldOpenOnLongPress={false}>
      <Touchable>
        <ThreeDotsIcon />
      </Touchable>
    </MenuView>
  );
};
