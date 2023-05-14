import React from 'react';
import {Platform} from 'react-native';
import {MenuView} from '@react-native-menu/menu';
import {useNavigation} from '@react-navigation/native';
import {Post} from 'api/posts/types';
import {RootStackNavigationProps} from 'navigation/types';
import {AppScreens} from 'screens/constants';
import {ThreeDotsIcon, Touchable} from 'ui';

type PostMenuViewProps = {
  data: Post;
};
export const PostMenuView = (props: PostMenuViewProps) => {
  const {data} = props;
  const navigation = useNavigation<RootStackNavigationProps>();

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
