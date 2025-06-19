import { TextStyle, ViewStyle } from 'react-native'
import { ThemedStyle } from '../theme'

export const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.lg,
  justifyContent: 'center',
})

export const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 24,
  fontWeight: 'bold',
  color: colors.text,
  marginBottom: 24,
  textAlign: 'center',
})

export const $input: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral200,
  borderRadius: spacing.xs,
  padding: spacing.md,
  marginVertical: spacing.xs,
  color: colors.text,
  fontSize: 16,
  fontWeight: '600',
})

export const $button: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary500,
  borderRadius: spacing.xs,
  padding: spacing.sm,
  marginVertical: spacing.md,
  alignItems: 'center',
})

export const $buttonText: ThemedStyle<TextStyle> = () => ({
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
})

export const $footer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  gap: spacing.xs,
  marginTop: spacing.sm,
})

export const $footerText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 14,
})

export const $link: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
  fontSize: 14,
  fontWeight: '600',
})

export const $authSelector: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral200,
  borderRadius: spacing.xs,
  padding: spacing.sm,
  marginVertical: spacing.xs,
  alignItems: 'center',
});

export const $authText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 16,
  fontWeight: '600',
});

