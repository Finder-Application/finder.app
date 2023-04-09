import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {ScrollView, StyleSheet} from 'react-native';
import {ImageSource} from 'react-native-image-viewing/dist/@types';
import ImageViewing from 'react-native-image-viewing/dist/ImageViewing';
import Carousel from 'react-native-reanimated-carousel';
import {useNavigation} from '@react-navigation/native';
import memoize from 'lodash/memoize';
import {HomeStackNavigationProps} from 'navigation/HomeNavigator';
import {
  ActiveHeartIcon,
  ActiveProfileIcon,
  CommentIcon,
  ContactIcon,
  DocumentIcon,
  HeartIcon,
  Image,
  InformationDetail,
  LinkShareIcon,
  Screen,
  SearchInput,
  Text,
  ThreeDotsIcon,
  Touchable,
  UserComment,
  View,
  WIDTH,
} from 'ui';
import CollapsibleSection from 'ui/CollapsibleSection';

import ImageFooter from './components/ImageFooter';

export const PostDetail = () => {
  const navigation = useNavigation<HomeStackNavigationProps>();
  const [isLiked, setIsLiked] = useState(false);
  const {control} = useForm();

  const [currentImageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState(architecture);
  const [isVisible, setIsVisible] = useState(false);

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
      headerRight: () => (
        <Touchable marginRight="l">
          <ThreeDotsIcon />
        </Touchable>
      ),
    });
  }, []);

  return (
    <Screen
      justifyContent="flex-start"
      alignItems="stretch"
      backgroundColor="white">
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View flexDirection="row" alignItems="center">
          <ActiveProfileIcon width={25} height={25} />
          <View marginLeft="s">
            <Text fontWeight="700" color="black1">
              Mai Nguyen
            </Text>
            <Text color="blackOpacity46" fontSize={12}>
              15 hours ago
            </Text>
          </View>
        </View>
        <Text fontWeight="700" fontSize={16} marginVertical="s">
          Lorem Ipsum is simply dummy text of the printing
        </Text>
        <View
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          marginVertical="s">
          <View>
            <InformationDetail label="Nickname" value="Soc" />
            <InformationDetail label="Name" value="Mai Linh" />
            <InformationDetail label="Hometown" value="Quang Binh" />
          </View>
          <View>
            <InformationDetail label="Gender" value="Female" />
            <InformationDetail label="Dob" value="20/05/2005" />
          </View>
        </View>
        <View flexShrink={1}>
          <Carousel
            loop={false}
            width={WIDTH * 0.9}
            height={WIDTH / 2}
            data={architecture}
            scrollAnimationDuration={1000}
            mode="parallax"
            renderItem={({index}) => (
              <Touchable
                borderRadius={20}
                overflow="hidden"
                activeOpacity={0.8}
                onPress={() => onSelect(architecture, index)}>
                <Image
                  source={{uri: architecture[index].thumbnail}}
                  width="100%"
                  height="100%"
                />
              </Touchable>
            )}
          />
          <ImageViewing
            images={getImageSource(images)}
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
              <Text marginLeft="xs">78</Text>
            </View>
          </View>
          <Touchable>
            <LinkShareIcon />
          </Touchable>
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
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum
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
          <View marginTop="m">
            <InformationDetail
              marginBottom="s"
              labelProps={{fontSize: 16}}
              valueProps={{fontSize: 16}}
              label="Living place"
              value="Da Nang"
              showBullet={false}
            />
            <InformationDetail
              marginBottom="s"
              labelProps={{fontSize: 16}}
              valueProps={{fontSize: 16}}
              label="Office address"
              value="254 Nguyen Van Linh"
              showBullet={false}
            />
            <InformationDetail
              marginBottom="s"
              labelProps={{fontSize: 16}}
              valueProps={{fontSize: 16}}
              label="Email"
              value="finder@gmail.com"
              showBullet={false}
            />
            <InformationDetail
              labelProps={{fontSize: 16}}
              valueProps={{fontSize: 16}}
              label="Phone"
              value="0342801091"
              showBullet={false}
            />
          </View>
        </CollapsibleSection>
        <View
          flexDirection="row"
          alignItems="center"
          marginBottom="m"
          marginTop="l">
          <ActiveProfileIcon />
          <SearchInput
            flex={1}
            marginLeft="s"
            backgroundColor="grey6Opacity5"
            borderWidth={0}
            inputProps={{
              name: 'search',
              control,
              placeholder: 'Write a comment...',
              style: {
                fontSize: 12,
              },
            }}
          />
        </View>
        <UserComment />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  contentContainer: {flexGrow: 1, paddingBottom: 100},
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
