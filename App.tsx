import { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';

export default function App() {
  useEffect(() => {
    const init = async () => {};
    init().finally(() => RNBootSplash.hide({ fade: true }));
  }, []);

  return <RootNavigator />;
}
