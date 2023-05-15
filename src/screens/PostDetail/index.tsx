import React, {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet} from 'react-native';
import {ImageSource} from 'react-native-image-viewing/dist/@types';
import ImageViewing from 'react-native-image-viewing/dist/ImageViewing';
import Carousel from 'react-native-reanimated-carousel';
import {useNavigation} from '@react-navigation/native';
import {useGetPostDetail} from 'api/posts';
import {Post} from 'api/posts/types';
import {useAuth} from 'core/Auth';
import memoize from 'lodash/memoize';
import moment from 'moment';
import {HomeStackNavigationProps} from 'navigation/HomeNavigator';
import {
  FEMALE_AVATAR_PLACE_HOLDER,
  MALE_AVATAR_PLACE_HOLDER,
} from 'screens/constants';
import {PostMenuView} from 'screens/Home/components/PostMenuView';
import {
  ActiveHeartIcon,
  CommentIcon,
  ContactIcon,
  DocumentIcon,
  HeartIcon,
  Image,
  InformationDetail,
  LinkShareIcon,
  Screen,
  Text,
  Touchable,
  UserComment,
  View,
  WIDTH,
} from 'ui';
import CollapsibleSection from 'ui/CollapsibleSection';
import {formatUserName} from 'utils';
import {shallow} from 'zustand/shallow';

import ImageFooter from './components/ImageFooter';

export const PostDetail = ({route}: {route?: {params: {postData: Post}}}) => {
  const {postData} = route?.params ?? {};
  const navigation = useNavigation<HomeStackNavigationProps>();

  const [isLoggedIn, currentUser] = useAuth(
    state => [state.isLoggedIn, state.user],
    shallow,
  );

  const [isLiked, setIsLiked] = useState(false);

  const [currentImageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState(architecture);
  const [isVisible, setIsVisible] = useState(false);

  const ownerName = formatUserName({
    user: {
      firstName: postData?.owner?.firstName,
      middleName: postData?.owner?.middleName,
      lastName: postData?.owner?.lastName,
    },
  });
  const {data: postDetailData, isLoading: postDetailDataLoading} =
    useGetPostDetail(Number(postData?.id));

  const [totalComment, setTotalComment] = useState(0);

  const missingPhotos = useMemo(() => {
    return postData?.photos?.map(photo => ({
      thumbnail: photo,
      original: photo,
    }));
  }, [postData]);

  const onSelect = (photos: ImageType[], index: number) => {
    setImageIndex(index);
    setImages(photos);
    setIsVisible(true);
  };

  const onRequestClose = () => setIsVisible(false);

  const getImageSource = memoize((photos: ImageType[]): ImageSource[] =>
    photos.map(image =>
      typeof image.original === 'number'
        ? image.original
        : {uri: image.original as string},
    ),
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        postData &&
        isLoggedIn &&
        currentUser?.userId === postData?.owner?.userId && (
          <View marginRight="s">
            <PostMenuView data={postData} />
          </View>
        ),
    });
  }, [JSON.stringify(postData)]);

  return (
    <Screen
      justifyContent="flex-start"
      alignItems="stretch"
      backgroundColor="white"
      style={styles.screenContainer}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View flexDirection="row" alignItems="center">
          <Image
            height={35}
            width={35}
            borderRadius={50}
            source={{
              uri: postData?.owner?.avatar
                ? postData?.owner?.avatar
                : postData?.owner?.gender === false
                ? MALE_AVATAR_PLACE_HOLDER
                : FEMALE_AVATAR_PLACE_HOLDER,
            }}
          />
          <View marginLeft="s">
            <Text fontWeight="700" color="black1">
              {ownerName}
            </Text>
            <Text color="blackOpacity46" fontSize={12}>
              {moment(postData?.updatedAt).format('LLL')}
            </Text>
          </View>
        </View>
        <Text fontWeight="700" fontSize={16} marginVertical="s">
          {postData?.title}
        </Text>
        <View
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
          marginVertical="s">
          <View flex={1}>
            <InformationDetail
              label="Họ Tên"
              value={postData?.fullName ?? ''}
            />
            <InformationDetail
              label="Tên ở nhà"
              value={postData?.nickname ?? ''}
            />
            <InformationDetail
              label="Quê Quán"
              value={postData?.hometown.region ?? ''}
            />
          </View>
          <View>
            <InformationDetail
              label="Giới tính"
              value={postData?.gender ? 'Female' : 'Male'}
            />
            <InformationDetail
              label="Ngày sinh"
              value={moment(postData?.dateOfBirth).format('DD/MM/YYYY')}
            />
          </View>
        </View>
        <View flexShrink={1}>
          <Carousel
            loop={false}
            width={WIDTH * 0.9}
            height={WIDTH / 2}
            data={postData?.photos ?? []}
            scrollAnimationDuration={1000}
            mode="parallax"
            renderItem={({index}) => (
              <Touchable
                borderRadius={20}
                overflow="hidden"
                activeOpacity={0.8}
                onPress={() => onSelect(missingPhotos ?? [], index)}>
                <Image
                  source={{uri: missingPhotos?.[index]?.thumbnail}}
                  width="100%"
                  height="100%"
                  resizeMode="cover"
                />
              </Touchable>
            )}
          />
          <ImageViewing
            images={getImageSource(missingPhotos ?? [])}
            imageIndex={currentImageIndex}
            presentationStyle="overFullScreen"
            visible={isVisible}
            onRequestClose={onRequestClose}
            FooterComponent={({imageIndex}) => (
              <ImageFooter
                imageIndex={imageIndex}
                imagesCount={images.length}
              />
            )}
          />
        </View>

        <CollapsibleSection
          isOpened={true}
          marginTop="m"
          flex={1}
          header={
            <View flexDirection="row" alignItems="center">
              <DocumentIcon />
              <Text fontWeight="700" fontSize={16} marginLeft="s">
                Description
              </Text>
            </View>
          }>
          <Text fontSize={15} color="grey9" marginTop="m">
            {postData?.description}
          </Text>
        </CollapsibleSection>
        <CollapsibleSection
          flex={1}
          isOpened={true}
          marginTop="l"
          header={
            <View flexDirection="row" alignItems="center">
              <ContactIcon />
              <Text fontWeight="700" fontSize={16} marginLeft="s">
                Contact Information
              </Text>
            </View>
          }>
          {postDetailDataLoading ? (
            <View marginTop="m">
              <ActivityIndicator />
            </View>
          ) : (
            <View marginTop="m">
              <InformationDetail
                marginBottom="s"
                labelProps={{fontSize: 15}}
                valueProps={{fontSize: 15}}
                label="Living place"
                value={postDetailData?.owner?.address ?? ''}
                showBullet={false}
              />
              {/* <InformationDetail
              marginBottom="s"
              labelProps={{fontSize: 15}}
              valueProps={{fontSize: 15}}
              label="Office address"
              value="254 Nguyen Van Linh"
              showBullet={false}
            /> */}
              <InformationDetail
                marginBottom="s"
                labelProps={{fontSize: 15}}
                valueProps={{fontSize: 15}}
                label="Email"
                value={postDetailData?.owner?.email ?? ''}
                showBullet={false}
              />
              <InformationDetail
                labelProps={{fontSize: 15}}
                valueProps={{fontSize: 15}}
                label="Phone"
                value={postDetailData?.owner?.phone ?? ''}
                showBullet={false}
              />
            </View>
          )}
        </CollapsibleSection>
        <View
          flexDirection="row"
          alignItems="center"
          marginTop="l"
          marginBottom="m"
          justifyContent="space-between">
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
          postId={postData?.id?.toString() || ''}
          setTotalComment={setTotalComment}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  contentContainer: {flexGrow: 1, paddingBottom: 100},
  screenContainer: {paddingBottom: 0},
});

type ImageType = {
  thumbnail: string;
  original: string;
};
export const architecture: ImageType[] = [
  {
    thumbnail:
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=992&q=80',
    original:
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2965&q=80',
  },
  {
    thumbnail:
      'https://images.unsplash.com/photo-1486718448742-163732cd1544?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
    original:
      'https://images.unsplash.com/photo-1486718448742-163732cd1544?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2734&q=80',
  },
  {
    thumbnail:
      'https://images.unsplash.com/photo-1481026469463-66327c86e544?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1424&q=80',
    original:
      'https://images.unsplash.com/photo-1481026469463-66327c86e544?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1424&q=80',
  },
  {
    thumbnail:
      'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
    original:
      'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2671&q=80',
  },
  {
    thumbnail:
      'https://images.unsplash.com/photo-1494959323928-ac0394595a78?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    original:
      'https://images.unsplash.com/photo-1494959323928-ac0394595a78?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3022&q=80',
  },
  {
    thumbnail:
      'https://images.unsplash.com/photo-1523165945512-d8b058e40514?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    original:
      'https://images.unsplash.com/photo-1523165945512-d8b058e40514?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2800&q=80',
  },
  {
    thumbnail:
      'https://images.unsplash.com/photo-1543825603-6d033f9ad143?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1955&q=80',
    original:
      'https://images.unsplash.com/photo-1543825603-6d033f9ad143?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2855&q=80',
  },
];
