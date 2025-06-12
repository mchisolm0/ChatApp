import Constants from 'expo-constants';

export const generateAPIUrl = (relativePath: string) => {
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  if (process.env.NODE_ENV === 'development') {
    // For development builds, use localhost if experienceUrl is undefined
    // TODO Remove Constants.experienceUrl because I'm using CNG not Expo Go
    if (!Constants.experienceUrl) {
      return `http://localhost:8081${path}`;
    }
    const base = Constants.experienceUrl.replace('exp://', 'http://').replace(/\/$/, '');
    return `${base}${path}`;
  }

  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    throw new Error(
      'EXPO_PUBLIC_API_BASE_URL environment variable is not defined',
    );
  }

  return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
};