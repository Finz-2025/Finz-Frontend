import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NicknameScreen from '@/features/onboarding/screens/NicknameScreen';
import AgeScreen from '@/features/onboarding/screens/AgeScreen';
import WelcomeSplash from '@/features/onboarding/screens/WelcomeSplash';
import JobScreen from '@/features/onboarding/screens/JobScreen';
import BudgetScreen from '@/features/onboarding/screens/BudgetScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Nickname" component={NicknameScreen} />
      <Stack.Screen name="Age" component={AgeScreen} />
      <Stack.Screen name="Job" component={JobScreen} />
      <Stack.Screen name="Budget" component={BudgetScreen} />
      <Stack.Screen name="WelcomeSplash" component={WelcomeSplash} />
    </Stack.Navigator>
  );
}
