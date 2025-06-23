import { ViewStyle, TextStyle } from 'react-native';
import { ThemedStyle } from '@/theme';
import { $baseText, $baseModal, $pageContainer } from './common';

// Index Screen Styles
export const $indexContainer: ThemedStyle<ViewStyle> = (theme) => ({
  ...$pageContainer(theme),
});

export const $authButtonsContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  gap: theme.spacing.xs,
  padding: theme.spacing.xs,
});

export const $authButton: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.neutral200,
  borderRadius: theme.spacing.xs,
  padding: theme.spacing.sm,
  marginVertical: theme.spacing.xs,
  alignItems: 'center',
});

export const $authButtonText: ThemedStyle<TextStyle> = (theme) => ({
  ...$baseText(theme),
  fontWeight: '600',
});

// Chat Screen Styles
export const $chatScreenContainer: ThemedStyle<ViewStyle> = (theme) => ({
  ...$pageContainer(theme),
  padding: 0, // Override padding from pageContainer
});

export const $chatAuthButton: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.neutral200,
  borderRadius: theme.spacing.xs,
  padding: theme.spacing.sm,
  marginVertical: theme.spacing.xs,
  marginHorizontal: theme.spacing.lg,
  alignItems: 'center',
});

export const $chatAuthButtonText: ThemedStyle<TextStyle> = (theme) => ({
  ...$baseText(theme),
  fontWeight: '600',
});

export const $chatContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
});

export const $chatTopContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  paddingHorizontal: theme.spacing.sm,
});

export const $modelSelector: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.neutral200,
  borderRadius: theme.spacing.xs,
  marginVertical: theme.spacing.sm,
  padding: theme.spacing.xs,
});

export const $modelPicker: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.transparent,
});

export const $messagesScroll: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  marginTop: theme.spacing.sm,
});

export const $messageContainer: ThemedStyle<ViewStyle> = (theme) => ({
  marginVertical: theme.spacing.xs,
  padding: theme.spacing.sm,
  backgroundColor: theme.colors.palette.neutral100,
  borderRadius: theme.spacing.xs,
});

export const $roleText: ThemedStyle<TextStyle> = (theme) => ({
  ...$baseText(theme),
  fontWeight: '700',
  marginBottom: theme.spacing.xxs,
});

export const $messageText: ThemedStyle<TextStyle> = (theme) => ({
  ...$baseText(theme),
});

export const $bottomContainer: ThemedStyle<ViewStyle> = (theme) => ({
  paddingHorizontal: theme.spacing.md,
  paddingBottom: theme.spacing.xs,
  borderTopWidth: 1,
  borderTopColor: theme.colors.palette.neutral300,
  backgroundColor: theme.colors.background,
});

export const $pickerText: ThemedStyle<TextStyle> = (theme) => ({
  ...$baseText(theme),
});

export const $pickerModal: ThemedStyle<ViewStyle> = (theme) => ({
  ...$baseModal(theme),
});

export const $pickerOption: ThemedStyle<ViewStyle> = (theme) => ({
  padding: theme.spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.palette.neutral200,
});

export const $pickerOptionText: ThemedStyle<TextStyle> = (theme) => ({
  ...$baseText(theme),
});

export const $inputContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
});

export const $sendButton: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.primary500,
  borderRadius: theme.spacing.sm,
  padding: theme.spacing.sm,
  justifyContent: 'center',
  alignItems: 'center',
  aspectRatio: 1,
});

export const $sendButtonText: ThemedStyle<TextStyle> = (theme) => ({
  ...$baseText(theme),
  color: theme.colors.palette.neutral100,
  fontSize: 18,
});

export const $newChatButton: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.primary500,
  borderRadius: theme.spacing.sm,
  padding: theme.spacing.sm,
  marginLeft: 'auto',
});

export const $newChatButtonText: ThemedStyle<TextStyle> = (theme) => ({
  ...$baseText(theme),
  color: theme.colors.palette.neutral100,
});

export const $chatInput: ThemedStyle<TextStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.neutral100,
  padding: theme.spacing.lg,
  paddingVertical: theme.spacing.md,
  borderRadius: theme.spacing.sm,
  color: theme.colors.text,
  fontSize: 16,
  minHeight: 50,
  shadowColor: theme.colors.palette.neutral900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 2,
});
