import { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import RootNavigator from '@/app/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  useEffect(() => {
    const init = async () => {};
    init().finally(() => RNBootSplash.hide({ fade: true }));
  }, []);

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
