import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '../constants/colors';

interface CommentInputProps {
  onSubmit: (content: string) => Promise<void>;
  loading?: boolean;
  placeholder?: string;
}

const MAX_CHARS = 500;

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  loading = false,
  placeholder = 'Write a comment...',
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      Alert.alert('Error', 'Comment cannot be empty');
      return;
    }

    if (trimmedContent.length > MAX_CHARS) {
      Alert.alert('Error', `Comment must be ${MAX_CHARS} characters or less`);
      return;
    }

    try {
      await onSubmit(trimmedContent);
      setContent('');
    } catch (error) {
      Alert.alert('Error', 'Failed to post comment');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLight}
        multiline
        maxLength={MAX_CHARS}
        editable={!loading}
      />
      <View style={styles.footer}>
        <Text style={styles.charCount}>
          {content.length}/{MAX_CHARS}
        </Text>
        <TouchableOpacity
          onPress={handleSubmit}
          style={[
            styles.sendButton,
            (!content.trim() || loading) && styles.disabledButton,
          ]}
          disabled={!content.trim() || loading}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: FontSize.md,
    minHeight: 80,
    maxHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: Colors.background,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  charCount: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.round,
  },
  sendText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: Colors.border,
  },
});
