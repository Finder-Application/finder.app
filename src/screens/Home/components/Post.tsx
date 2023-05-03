import React, {useState} from 'react';
import {MenuView} from '@react-native-menu/menu';
import {useNavigation} from '@react-navigation/native';
import {Post as PostType} from 'api/posts/types';
import moment from 'moment';
import {HomeStackNavigationProps} from 'navigation/HomeNavigator';
import {AppScreens} from 'screens/constants';
import {
  ActiveHeartIcon,
  CommentIcon,
  HeartIcon,
  Image,
  InformationDetail,
  LinearGradientView,
  LinkShareIcon,
  Text,
  ThreeDotsIcon,
  Touchable,
  UserComment,
  View,
} from 'ui';
import {formatUserName} from 'utils';

type PostProps = {
  post: PostType;
};

export const Post = (props: PostProps) => {
  const {post} = props;

  const navigation = useNavigation<HomeStackNavigationProps>();

  const [isLiked, setIsLiked] = useState(false);

  const [totalComment, setTotalComment] = useState(0);

  const ownerName = formatUserName({
    user: {
      firstName: post?.owner?.firstName,
      middleName: post?.owner?.middleName,
      lastName: post?.owner?.lastName,
    },
  });

  const photo = post?.photos?.[0];

  return (
    <View
      backgroundColor="white"
      padding="m"
      borderRadius={10}
      width="100%"
      marginBottom="m">
      <View flexDirection="row" justifyContent="space-between" marginBottom="m">
        <View flexDirection="row" alignItems="center">
          <Image
            height={35}
            width={35}
            borderRadius={50}
            source={{
              uri: 'https://static-bebeautiful-in.unileverservices.com/Flawless-skin-basics.jpg',
            }}
          />
          <Text fontWeight="700" marginLeft="s">
            {ownerName}
          </Text>
        </View>
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
          <Touchable>
            <ThreeDotsIcon />
          </Touchable>
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
          <InformationDetail label="Tên ở nhà" value={post?.nickname} />
          <InformationDetail label="Quê Quán" value={post?.hometown.region} />
        </View>
        <View>
          <InformationDetail
            label="Giới tính"
            value={post?.gender ? 'Female' : 'Male'}
          />
          <InformationDetail
            label="Ngày sinh"
            value={moment(post?.dateOfBirth).format('DD/MM/YYYY')}
          />
        </View>
      </View>
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
            <Text marginLeft="xs">{totalComment}</Text>
          </View>
        </View>
        <Touchable>
          <LinkShareIcon />
        </Touchable>
      </View>

      <UserComment
        postId={post?.id.toString()}
        setTotalComment={setTotalComment}
      />
    </View>
  );
};
