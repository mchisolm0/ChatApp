import React from 'react';
import { Redirect } from 'expo-router';

export default function RootLayout() {
  return (
    <Redirect href="/drawer" />
  );
}