import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const generateAPIUrl = (relativePath: string) => {
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:8081${path}`;
  }

  // For web in production
  if (Platform.OS === 'web') {
    return window.location.origin.concat(path);
  }

  // For React Native in production
  // You'll need to set this environment variable in your app's build config
  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL environment variable is not defined');
  }

  return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
};