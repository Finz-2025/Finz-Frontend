import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { hasProfile } from '@/services/profile';
import { useEffect, useState } from 'react';
import OnboardingNavigator from '@/app/navigation/OnboardingNavigator';
import MainNavigator from '@/app/navigation/MainNavigator';

const Stack = createNativeStackNavigator();

function Gate({ navigation }: any) {
  const [_ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      const exist = await hasProfile();
      navigation.reset({
        index: 0,
        routes: [{ name: exist ? 'Main' : 'Onboarding' }],
      });
      setReady(true);
    })();
  }, [navigation]);
  return null;
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Gate" component={Gate} />
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
