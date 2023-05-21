import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useCountTotalComment} from 'api/comments';
import {Post as PostType} from 'api/posts/types';
import {useAuth} from 'core/Auth';
import moment from 'moment';
import {RootStackNavigationProps} from 'navigation/types';
import {
  AppScreens,
  FEMALE_AVATAR_PLACE_HOLDER,
  MALE_AVATAR_PLACE_HOLDER,
} from 'screens/constants';
import {
  ActiveHeartIcon,
  CommentIcon,
  HeartIcon,
  Image,
  InformationDetail,
  LinearGradientView,
  LinkShareIcon,
  Text,
  Touchable,
  UserComment,
  View,
} from 'ui';
import {formatUserName} from 'utils';
import {shallow} from 'zustand/shallow';

import {PostMenuView} from './PostMenuView';
type PostProps = {
  post: PostType;
  onDelete?: () => void;
};

export const Post = (props: PostProps) => {
  const {post, onDelete} = props;

  const navigation = useNavigation<RootStackNavigationProps>();

  const [isLoggedIn, currentUser] = useAuth(
    state => [state.isLoggedIn, state.user],
    shallow,
  );
  const [isLiked, setIsLiked] = useState(false);

  const totalComment = useCountTotalComment(Number(post?.id));

  const ownerName = formatUserName({
    user: {
      firstName: post?.owner?.firstName,
      middleName: post?.owner?.middleName,
      lastName: post?.owner?.lastName,
    },
  });

  const photo = post?.photos?.[0];

  const SimilarPercentage = (percentageProps: {similar: number}) => {
    const {similar} = percentageProps;

    const percent = similar * 100;
    if (percent < 50) {
      return (
        <Text marginHorizontal="s" fontWeight="700" color="red">
          {percent.toFixed(2)}%
        </Text>
      );
    }
    if (percent < 90) {
      return (
        <Text marginHorizontal="s" fontWeight="700" color="blue">
          {percent.toFixed(2)}%
        </Text>
      );
    }

    return (
      <Text marginHorizontal="s" fontWeight="700" color="green6">
        {percent.toFixed(2)}%
      </Text>
    );
  };
  return (
    <View
      backgroundColor="white"
      padding="m"
      borderRadius={10}
      width="100%"
      marginBottom="m">
      <View
        flexDirection="row"
        justifyContent="space-between"
        marginBottom="m"
        alignItems="center">
        <View flexDirection="row" alignItems="center" flex={1}>
          <Image
            height={35}
            width={35}
            borderRadius={50}
            source={{
              uri: post?.owner?.avatar
                ? post?.owner?.avatar
                : post?.owner?.gender === false
                ? MALE_AVATAR_PLACE_HOLDER
                : FEMALE_AVATAR_PLACE_HOLDER,
            }}
          />
          <Text fontWeight="700" marginLeft="s">
            {ownerName}
          </Text>
        </View>
        {post?.similar && <SimilarPercentage similar={post?.similar} />}
        <View flexDirection="row" alignItems="center">
          <Touchable
            marginRight="s"
            onPress={() =>
              navigation.navigate(AppScreens.PostDetail, {
                postData: post,
              })
            }>
            <LinearGradientView
              paddingVertical="xs"
              paddingHorizontal="m"
              borderRadius={8}>
              <Text color="grey5" fontWeight="500" fontSize={12}>
                View Detail
              </Text>
            </LinearGradientView>
          </Touchable>
          {isLoggedIn && currentUser?.userId === post?.owner?.userId && (
            <PostMenuView data={post} onDelete={onDelete} />
          )}
        </View>
      </View>
      <Text fontWeight="700" fontSize={15}>
        {post?.title}
      </Text>
      <Text fontSize={13}>{post?.description}</Text>
      <View
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
        marginVertical="s">
        <View flex={1}>
          <InformationDetail label="Họ Tên" value={post?.fullName} />
          <InformationDetail
            label="Tên ở nhà"
            value={post?.nickname}
            marginTop="s"
          />
        </View>
        <View>
          <InformationDetail
            label="Giới tính"
            value={post?.gender ? 'Female' : 'Male'}
          />
          <InformationDetail
            label="Ngày sinh"
            value={moment(post?.dateOfBirth).format('DD/MM/YYYY')}
            marginTop="s"
          />
        </View>
      </View>
      <InformationDetail
        label="Quê Quán"
        value={post?.hometown?.region}
        marginBottom="s"
      />

      <Image
        height={250}
        width="100%"
        borderTopLeftRadius={10}
        borderTopRightRadius={10}
        source={{
          uri: photo,
        }}
      />
      <View
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginVertical="m">
        <View flexDirection="row" alignItems="center">
          <View flexDirection="row" alignItems="center" marginRight="m">
            <Touchable onPress={() => setIsLiked(!isLiked)}>
              {isLiked ? (
                <ActiveHeartIcon width={20} height={20} />
              ) : (
                <HeartIcon />
              )}
            </Touchable>
            <Text marginLeft="xs">2.4K</Text>
          </View>
          <View flexDirection="row" alignItems="center">
            <Touchable>
              <CommentIcon />
            </Touchable>
            <Text marginLeft="xs">{totalComment.data}</Text>
          </View>
        </View>
        <Touchable>
          <LinkShareIcon />
        </Touchable>
      </View>

      <UserComment postId={post?.id.toString()} />
    </View>
  );
};
