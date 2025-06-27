import * as React from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useAppTheme } from '../utils/useAppTheme';
import * as authStyles from '../styles/auth';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

interface UsernameModalProps {
  visible: boolean;
  onSubmit: (username: string) => void;
  onClose: () => void;
  error?: string;
  isSubmitting?: boolean;
}

export function UsernameModal({
  visible,
  onSubmit,
  onClose,
  error,
  isSubmitting = false,
}: UsernameModalProps) {
  const [username, setUsername] = React.useState('');
  const { themed } = useAppTheme();

  const handleSubmit = () => {
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView style={styles.modalOverlay}>
        <View style={themed(authStyles.$container)}>
          <Text style={themed(authStyles.$title)}>Choose a username</Text>
          <TextInput
            autoCapitalize="none"
            value={username}
            placeholder="Enter username"
            style={themed(authStyles.$input)}
            onChangeText={setUsername}
          />
          {error ? (
            <Text style={themed(authStyles.$errorText)}>{error}</Text>
          ) : null}
          <TouchableOpacity
            style={[themed(authStyles.$button), isSubmitting && themed(authStyles.$buttonDisabled)]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={themed(authStyles.$buttonText)}>
              {isSubmitting ? 'Setting username...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  },
});
