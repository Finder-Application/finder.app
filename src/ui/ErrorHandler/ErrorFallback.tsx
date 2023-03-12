import * as React from 'react';

import {Button} from '../Button';
import {Screen} from '../Screen';
import {Text} from '../Text';
import {View} from '../View';

export function ErrorFallback({resetErrorBoundary}: any) {
  return (
    <Screen>
      <View>
        <Text> Something went wrong: </Text>
        <Button label="try Again" onPress={resetErrorBoundary} />
      </View>
    </Screen>
  );
}
