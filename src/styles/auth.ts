import {
  $pageContainer,
  $formTitle,
  $formInput,
  $formButton,
  $formButtonText,
  $formFooter,
  $formFooterText,
  $formLink,
  $errorText,
} from './common'

import { ThemedStyle } from '@/theme'
import { ViewStyle } from 'react-native'

import {
  $authButton as $authSelector,
  $authButtonText as $authText,
} from './chat'

// Re-export common styles with auth-specific names for backwards compatibility
export const $container = $pageContainer
export const $title = $formTitle
export const $input = $formInput
export const $button = $formButton
export const $buttonText = $formButtonText
export const $footer = $formFooter
export const $footerText = $formFooterText
export const $link = $formLink

// Button disabled state
export const $buttonDisabled: ThemedStyle<ViewStyle> = (theme) => ({
  opacity: 0.6,
})

// Re-export error text style
export { $errorText }

// Re-export auth button styles for backwards compatibility
export { $authSelector, $authText }
