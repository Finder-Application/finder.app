import {useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';

export function useAppState({
  appActiveHandler,
}: {
  appActiveHandler: () => void;
}) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    function onChange(newState: AppStateStatus) {
      if (
        appState.current.match(/inactive|background/) &&
        newState === 'active'
      ) {
        appActiveHandler?.();
      }

      appState.current = newState;
    }

    const subscription = AppState.addEventListener('change', onChange);

    return () => {
      if (typeof subscription?.remove === 'function') {
        subscription.remove();
      } else {
        // React Native < 0.65
        AppState?.removeEventListener('change', onChange);
      }
    };
  }, [appActiveHandler]);
}
