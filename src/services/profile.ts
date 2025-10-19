import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'PROFILE_V1';

export const saveProfile = (data: any) =>
  AsyncStorage.setItem(KEY, JSON.stringify(data));

export const loadProfile = async () => {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
};

export const hasProfile = async () => !!(await loadProfile());
