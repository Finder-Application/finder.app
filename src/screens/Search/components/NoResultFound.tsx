import React from 'react';
import {Image, Text, View} from 'ui';

const NoResultFoundImage = require('./404_error.png');

export const NoResultFound = () => {
  return (
    <View alignItems="center" justifyContent="center">
      <Image source={NoResultFoundImage} />
      <Text fontSize={17} color="grey12" fontWeight="700">
        No results found
      </Text>
      <Text fontSize={17} color="grey23">
        We couldn’t find what you’re looking for
      </Text>
    </View>
  );
};
