import React from "react";
import { memo } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import Markdown from 'react-native-marked';

type MessageProps = {
  role: 'user' | 'assistant';
  content: string;
  isComplete?: boolean;
};

const Message = memo(({ role, content, isComplete = true }: MessageProps) => {
  const pulseAnim = new Animated.Value(0);

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
  }, [isComplete]);

  // Interpolate the animation value for the typing indicator
  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <View style={[
      styles.messageContainer,
      role === 'assistant' ? styles.assistantContainer : styles.userContainer
    ]}>
      <View style={[
        styles.messageContent,
        role === 'assistant' ? styles.assistantContent : styles.userContent
      ]}>
        <Markdown value={content} />
        {!isComplete && (
          <Animated.View style={[styles.typingIndicator, { opacity }]} />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 16,
    width: '100%',
    flexDirection: 'row',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  messageContent: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  assistantContent: {
    width: '100%',
    backgroundColor: '#f1f1f1',
  },
  userContent: {
    maxWidth: '90%',
    backgroundColor: '#007AFF', // iOS blue
  },
  typingIndicator: {
    width: 8,
    height: 16,
    backgroundColor: '#000',
    marginTop: 4,
  },
});

export { Message };