import { Platform } from 'react-native';
import structuredClone from '@ungap/structured-clone';

export async function setupPolyfills(): Promise<void> {
  if (Platform.OS !== 'web') {
    const { polyfillGlobal } = await import(
      'react-native/Libraries/Utilities/PolyfillFunctions'
    );

    const { TextEncoderStream, TextDecoderStream } = await import(
      '@stardazed/streams-text-encoding'
    );

    if (!('structuredClone' in global)) {
      polyfillGlobal('structuredClone', () => structuredClone);
    }

    polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
    polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
  }
}

// Initialize polyfills
if (Platform.OS !== 'web') {
  setupPolyfills();
}

export const polyfills = {
  setup: setupPolyfills
};
