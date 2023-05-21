import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSeenNoti} from 'api/notifications';
import {User} from 'api/posts/types';
import {RootStackNavigationProps} from 'navigation/types';
import {AppScreens} from 'screens/constants';
import {Image, Text, Touchable, View} from 'ui';

interface Props {
  user?: Partial<User>;
  content?: string;
  title?: string;
  seen?: boolean;
  id: number;
  type: string;
  postId?: number;
}
export const NotiComponent = ({
  content,
  title,
  user,
  seen,
  id,
  type,
  postId,
}: Props) => {
  const navigation = useNavigation<RootStackNavigationProps>();

  const seenNoti = useSeenNoti();
  return (
    <Touchable
      onPress={() => {
        if (!seen) {
          seenNoti.mutate({id, type});
        }

        postId &&
          navigation.navigate(AppScreens.PostDetail, {
            postData: {
              id: +postId,
            },
          });
      }}>
      <View
        flexDirection="row"
        alignItems="flex-start"
        marginBottom="s"
        backgroundColor={'white'}
        padding={'s'}
        width={'100%'}
        borderRadius={10}
        position={'relative'}>
        {!seen && (
          <View position={'absolute'} top={-40} right={5}>
            <Text color="blue" fontSize={50}>
              .
            </Text>
          </View>
        )}

        <Image
          height={35}
          width={35}
          borderRadius={50}
          source={{
            uri:
              user?.avatar ||
              'https://static-bebeautiful-in.unileverservices.com/Flawless-skin-basics.jpg',
          }}
        />

        <View paddingLeft={'s'}>
          {title && (
            <Text color="grey1" fontSize={12}>
              {title}
            </Text>
          )}

          <Text
            color="grey7"
            fontSize={11}
            paddingTop={title ? undefined : 's'}>
            {content}
          </Text>
        </View>
      </View>
    </Touchable>
  );
};
