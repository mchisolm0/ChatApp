import { ThemedStyle } from "@/theme";
import React from "react";
import { memo } from "react";
import { View, Text, StyleSheet, Animated, Easing, ViewStyle } from "react-native";
import Markdown from 'react-native-marked';
import { useAppTheme } from "@/utils/useAppTheme";

type MessageProps = {
  role: 'user' | 'assistant';
  content: string;
  isComplete?: boolean;
};

const Message = memo(({ role, content, isComplete = true }: MessageProps) => {
  const { themed } = useAppTheme();
  const pulseAnim = React.useRef(new Animated.Value(0)).current;

  // Animation for the typing indicator
  React.useEffect(() => {
    if (!isComplete) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
    return undefined; // Explicitly return undefined when isComplete is true
  }, [isComplete, pulseAnim]);

  // Interpolate the animation value for the typing indicator
  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <View style={themed([
      $messageContainer,
      role === 'assistant' ? $assistantContainer : $userContainer
    ])}>
      <View style={themed([
        $messageContent,
        role === 'assistant' ? $assistantContent : $userContent
      ])}>
        {(() => {
          try {
            return <Markdown value={content} />;
          } catch (error) {
            console.error('Markdown rendering failed:', error);
            return <Text>{content}</Text>;
          }
        })()}
        {!isComplete && (
          <Animated.View style={[themed($typingIndicator), { opacity }]} />
        )}
      </View>
    </View>
  );
});

const $messageContainer: ThemedStyle<ViewStyle> = (theme) => ({
  width: '100%',
  flexDirection: 'row',
  marginTop: theme.spacing.xs,
});

const $assistantContainer: ThemedStyle<ViewStyle> = (theme) => ({
  justifyContent: 'flex-start',
});

const $userContainer: ThemedStyle<ViewStyle> = (theme) => ({
  justifyContent: 'flex-end',
});

const $messageContent: ThemedStyle<ViewStyle> = (theme) => ({
  borderRadius: theme.spacing.xs,
  padding: theme.spacing.xs,
  maxWidth: '80%',
});

const $assistantContent: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.neutral500,
  borderRadius: theme.spacing.xs,
  alignSelf: 'flex-start',
});

const $userContent: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.primary500,
  alignSelf: 'flex-end',
  marginHorizontal: theme.spacing.sm,
});

const $typingIndicator: ThemedStyle<ViewStyle> = (theme) => ({
  width: 8,
  height: 16,
  backgroundColor: theme.colors.palette.neutral900,
  marginTop: 4,
});

export { Message };