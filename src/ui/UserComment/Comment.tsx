import React from 'react';
import {Comment as IComment} from 'api/comments/types';
import moment from 'moment';
import {FEMALE_AVATAR_PLACE_HOLDER, MALE_AVATAR_PLACE_HOLDER} from 'screens';
import {CommentIcon, Image, Text, Touchable, View} from 'ui';

interface Props {
  setReplyFor: React.Dispatch<React.SetStateAction<string>>;
  item: IComment;
}
export const Comment = ({setReplyFor, item}: Props) => {
  return (
    <View>
      <View flexDirection="row" flex={1} marginBottom="m">
        <Image
          height={20}
          width={20}
          borderColor={'grey1'}
          borderRadius={50}
          source={{
            uri: item?.user?.avatar
              ? item?.user?.avatar
              : item?.user?.gender === false
              ? MALE_AVATAR_PLACE_HOLDER
              : FEMALE_AVATAR_PLACE_HOLDER,
          }}
        />

        <View marginLeft="s" flex={1}>
          <View flexDirection="row" alignItems="center">
            <Text fontSize={13} color="black1" fontWeight="700" marginRight="s">
              {item?.user?.firstName} {item?.user?.lastName}{' '}
              {item?.user?.middleName}
            </Text>
            <Text color="grey7" fontSize={11}>
              {moment(item?.createdAt)?.fromNow?.()}
            </Text>
          </View>
          <View flex={1}>
            <Text
              fontSize={13}
              color="black1"
              numberOfLines={2}
              ellipsizeMode="tail">
              {item?.content}
            </Text>
          </View>

          <Touchable
            onPress={() => {
              setReplyFor(item?.id?.toString() || '');
            }}>
            <View flexDirection="row" alignItems="center">
              <Text
                fontSize={12}
                color="black"
                fontWeight="700"
                numberOfLines={2}
                ellipsizeMode="tail">
                reply
              </Text>

              <Touchable paddingLeft={'xs'}>
                <CommentIcon width={15} height={15} />
              </Touchable>
            </View>
          </Touchable>
        </View>
      </View>

      {item?.child &&
        item?.child?.map(child => (
          <View
            key={child?.id}
            flexDirection="row"
            flex={1}
            paddingLeft={'l'}
            marginBottom="m">
            <Image
              height={20}
              width={20}
              borderColor={'grey1'}
              borderRadius={50}
              source={{
                uri: child?.user?.avatar
                  ? child?.user?.avatar
                  : child?.user?.gender === false
                  ? MALE_AVATAR_PLACE_HOLDER
                  : FEMALE_AVATAR_PLACE_HOLDER,
              }}
            />

            <View marginLeft="s" flex={1}>
              <View flexDirection="row" alignItems="center">
                <Text
                  fontSize={13}
                  color="black1"
                  fontWeight="700"
                  marginRight="s">
                  {child?.user?.firstName} {child?.user?.lastName}{' '}
                  {child?.user?.middleName}
                </Text>
                <Text color="grey7" fontSize={11}>
                  {moment(child?.createdAt)?.fromNow?.()}
                </Text>
              </View>
              <View flex={1}>
                <Text
                  fontSize={13}
                  color="black1"
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {child?.content}
                </Text>
              </View>
            </View>
          </View>
        ))}
    </View>
  );
};
