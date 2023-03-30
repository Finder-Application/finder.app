import React from 'react';
import {ActiveProfileIcon, Text, View} from 'ui';

export const UserComment = () => {
  return (
    <View flexDirection="row" flex={1}>
      <ActiveProfileIcon />
      <View marginLeft="s" flex={1}>
        <View flexDirection="row" alignItems="center">
          <Text fontSize={13} color="black1" fontWeight="700" marginRight="s">
            Trung Jamin
          </Text>
          <Text color="grey7" fontSize={11}>
            1 minute ago
          </Text>
        </View>
        <View flex={1}>
          <Text
            fontSize={13}
            color="black1"
            numberOfLines={2}
            ellipsizeMode="tail">
            Se ha actualizado el manifiesto de e ha manifiesto de e ha
          </Text>
        </View>
      </View>
    </View>
  );
};
