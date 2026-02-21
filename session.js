import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'little_lemon_session';

// Save logged-in user id to AsyncStorage (session)
export const saveSession = async (userId) => {
  await AsyncStorage.setItem(SESSION_KEY, String(userId));
};

// Get current session userId (or null)
export const getSession = async () => {
  const val = await AsyncStorage.getItem(SESSION_KEY);
  return val ? parseInt(val, 10) : null;
};

// Clear session on logout
export const clearSession = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
};
