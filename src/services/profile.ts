import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = 'PROFILE_V1';

export type Profile = {
  id: string; // 내부 식별자
  name: string; // 표시 이름 (nickname)
  ageGroup?: string;
  job?: string;
  budget?: number | null;
};

export const saveProfile = async (data: Profile) => {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(data));
};

export const loadProfile = async (): Promise<Profile | null> => {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
};

export const hasProfile = async () => !!(await loadProfile());

export const clearProfile = async () => {
  await AsyncStorage.removeItem(PROFILE_KEY);
};
