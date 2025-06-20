import {
  $pageContainer,
  $formTitle,
  $formInput,
  $formButton,
  $formButtonText,
  $formFooter,
  $formFooterText,
  $formLink,
} from './common'

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

// Re-export auth button styles for backwards compatibility
export { $authSelector, $authText }
