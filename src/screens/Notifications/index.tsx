import React, {memo, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RootStackNavigationProps} from 'navigation/types';
import {buildNavigationOptions} from 'navigation/utils';
import {Image, Screen, Text, View} from 'ui';

export const Notifications = memo(() => {
  const navigation = useNavigation<RootStackNavigationProps>();

  useEffect(() => {
    navigation.setOptions({
      ...buildNavigationOptions(navigation, ''),
      title: 'Notifications',
      headerShown: true,
    });
  }, []);

  return (
    <Screen
      justifyContent="flex-start"
      alignItems="flex-start"
      paddingHorizontal={undefined}>
      <View flexDirection="row" marginVertical="s" marginHorizontal="m">
        <View
          flexDirection="row"
          alignItems="flex-start"
          marginBottom="s"
          backgroundColor={'white'}
          padding={'s'}
          width={'100%'}
          borderRadius={10}>
          <Image
            height={35}
            width={35}
            borderRadius={50}
            source={{
              uri: 'https://static-bebeautiful-in.unileverservices.com/Flawless-skin-basics.jpg',
            }}
          />

          <View paddingLeft={'s'}>
            <Text color="grey1" fontSize={12}>
              Add a comment... 🤔
            </Text>

            <Text color="grey7" fontSize={11}>
              Add a comment... 🤔 Lorem ipsum dolor sit, amet consectetur
              adipisicing elit. Doloremque quasi doloribus aspernatur ratione
              deserunt neque, ad dolorem iusto alias, tempore fugit quas labore
              adipisci eaque, debitis totam veniam delectus. Fugiat?
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
});
