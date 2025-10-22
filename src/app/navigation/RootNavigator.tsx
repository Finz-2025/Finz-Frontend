import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import OnboardingNavigator from '@/app/navigation/OnboardingNavigator';
import MainNavigator from '@/app/navigation/MainNavigator';
import { hasProfile } from '@/services/profile';

type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState<
    'Onboarding' | 'Main' | null
  >(null);

  useEffect(() => {
    (async () => {
      const exist = await hasProfile();
      setInitialRoute(exist ? 'Main' : 'Onboarding');
    })();
  }, []);

  // 초기 라우트 결정 전에는 아무것도 렌더하지 않거나, Splash 유지
  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
