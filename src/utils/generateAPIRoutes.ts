import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const generateAPIUrl = (relativePath: string) => {
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  // Development mode handling
  if (process.env.NODE_ENV === 'development') {
    if (Constants.expoConfig?.hostUri) {
      // Handle both cases where hostUri might be just IP or IP:port
      const [host, port] = Constants.expoConfig.hostUri.split(':');
      // Use the port if it exists, otherwise default to 8081
      const devPort = port || '8081';
      return `http://${host}:${devPort}${path}`;
    }
    // Fallback for when hostUri isn't available
    return `http://localhost:8081${path}`;
  }

  // Production - Web
  if (Platform.OS === 'web') {
    return window.location.origin.concat(path);
  }

  // Production - Mobile
  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    console.warn('EXPO_PUBLIC_API_BASE_URL is not defined, using relative path');
    return path; // Fallback to relative path if not defined
  }

  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL

  return `${baseUrl}${path}`;
};