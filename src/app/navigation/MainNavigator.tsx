import CoachScreen from '@/features/coach/screens/CoachScreen';
import GoalsScreen from '@/features/goals/screens/GoalsScreen';
import HomeScreen from '@/features/home/screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type MainStackParamList = {
  Home: undefined;
  Coach:
    | { autoPost?: { text: string; date: string; time: string; raw?: any } }
    | undefined;
  Goals: undefined;
};

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Coach" component={CoachScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
    </Stack.Navigator>
  );
}
