import React from 'react';
import FlashMessage from 'react-native-flash-message';
import APIProvider from 'api/APIProvider';
import {hydrateAuth, setI18nConfig} from 'core';
import {RootNavigator} from 'navigation';
import {ThemeProvider} from 'ui';

import 'react-native-gesture-handler';

setI18nConfig();
hydrateAuth();

const App = () => {
  return (
    <APIProvider>
      <ThemeProvider>
        <RootNavigator />
        <FlashMessage position="top" />
      </ThemeProvider>
    </APIProvider>
  );
};

export default App;
