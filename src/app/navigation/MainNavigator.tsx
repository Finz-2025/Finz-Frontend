import CoachScreen from '@/features/coach/screens/CoachScreen';
import HomeScreen from '@/features/home/screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type MainStackParamList = {
  Home: undefined;
  Coach: undefined;
};

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Coach" component={CoachScreen} />
    </Stack.Navigator>
  );
}
