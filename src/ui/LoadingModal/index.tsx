import React from 'react';
import {useAppStore} from 'core';
import {View} from 'ui';
import {LoadingIndicator} from 'ui/animations';

export const LoadingModal = () => {
  const showLoadingModal = useAppStore(state => state.showLoadingModal);
  return (
    <>
      {showLoadingModal && (
        <View
          position="absolute"
          backgroundColor="blackOpacity46"
          top={0}
          left={0}
          right={0}
          bottom={0}
          alignItems="center"
          justifyContent="center">
          <LoadingIndicator width={100} height={100} />
        </View>
      )}
    </>
  );
};
