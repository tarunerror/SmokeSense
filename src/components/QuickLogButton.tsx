import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface QuickLogButtonProps {
  onQuickLog: () => void;
  onDetailedLog: () => void;
  isLogging?: boolean;
}

export default function QuickLogButton({
  onQuickLog,
  onDetailedLog,
  isLogging = false,
}: QuickLogButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.quickButton, isLogging && styles.quickButtonDisabled]}
        onPress={onQuickLog}
        disabled={isLogging}
        accessibilityLabel="Quick log cigarette"
        accessibilityHint="Tap to quickly log a cigarette with current time"
        accessibilityRole="button"
      >
        {isLogging ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <>
            <Text style={styles.quickButtonEmoji}>🚬</Text>
            <Text style={styles.quickButtonText}>Log Cigarette</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.detailedButton}
        onPress={onDetailedLog}
        disabled={isLogging}
        accessibilityLabel="Add detailed log"
        accessibilityHint="Tap to log a cigarette with mood, location, and other details"
        accessibilityRole="button"
      >
        <Text style={styles.detailedButtonText}>+ Add Details</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  quickButton: {
    backgroundColor: '#FF3B30',
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 16,
  },
  quickButtonDisabled: {
    backgroundColor: '#CCC',
  },
  quickButtonEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  quickButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailedButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  detailedButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
