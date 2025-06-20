import { ViewStyle, TextStyle } from 'react-native';
import { ThemedStyle } from '@/theme';

// Layout styles
export const $pageContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
  padding: theme.spacing.md,
  justifyContent: 'center',
});

// Form styles
export const $formInput: ThemedStyle<TextStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.neutral100,
  borderRadius: theme.spacing.sm,
  padding: theme.spacing.lg,
  paddingVertical: theme.spacing.md,
  marginVertical: theme.spacing.sm,
  color: theme.colors.text,
  fontSize: 16,
  minHeight: 50,
  shadowColor: theme.colors.palette.neutral900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 2,
});

export const $formButton: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.primary500,
  borderRadius: theme.spacing.sm,
  padding: theme.spacing.lg,
  paddingVertical: theme.spacing.md,
  marginVertical: theme.spacing.md,
  alignItems: 'center',
  shadowColor: theme.colors.palette.neutral900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3,
});

export const $formButtonText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.palette.neutral100,
  fontSize: 16,
  fontWeight: '600',
});

export const $formTitle: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 28,
  fontWeight: 'bold',
  color: theme.colors.text,
  marginBottom: theme.spacing.xl,
  marginTop: theme.spacing.lg,
  textAlign: 'center',
});

export const $formFooter: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  gap: theme.spacing.xs,
  marginTop: theme.spacing.xl,
  paddingBottom: theme.spacing.lg,
});

export const $formFooterText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 14,
});

export const $formLink: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.palette.primary500,
  fontSize: 14,
  fontWeight: '600',
});

export const $baseContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
});

export const $modalOverlay: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  //backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
});

export const $baseModal: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.xs,
  padding: spacing.sm,
  width: '80%',
  maxHeight: '60%',
});

export const $baseText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 16,
});

export const $errorContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.error,
  padding: spacing.xs,
  borderRadius: spacing.xs,
  marginBottom: spacing.xs,
});

export const $errorText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background,
  textAlign: 'center',
});
