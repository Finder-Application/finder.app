import React from 'react';
import {ActivityIndicator} from 'react-native';
import {useAppStore} from 'core';
import {View} from 'ui';

export const LoadingModal = () => {
  const showLoadingModal = useAppStore(state => state.showLoadingModal);
  return (
    <>
      {showLoadingModal && (
        <View
          position="absolute"
          backgroundColor="blackOpacity50"
          top={0}
          left={0}
          right={0}
          bottom={0}
          alignItems="center"
          justifyContent="center">
          <ActivityIndicator />
        </View>
      )}
    </>
  );
};
