import React from 'react';
import {Text} from 'ui';
import {ChevronLeftIcon} from 'ui/icons/ChevronLeft';
import {Touchable} from 'ui/Touchable';

type HeaderBackButtonProps = {
  onPress?: () => void;
  title?: string;
};

export const HeaderBackButton = ({onPress, title}: HeaderBackButtonProps) => {
  return (
    <Touchable
      marginLeft="xl"
      onPress={onPress}
      flexDirection="row"
      alignItems="center">
      <ChevronLeftIcon />
      {title && (
        <Text variant="title" marginLeft="s">
          {title}
        </Text>
      )}
    </Touchable>
  );
};
