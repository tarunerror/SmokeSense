import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  AccessibilityInfo,
} from 'react-native';
import { useRouter } from 'expo-router';
import { budgetService } from '../src/services/budget';

export default function BudgetSettingsScreen() {
  const router = useRouter();
  const [dailyLimit, setDailyLimit] = useState('');
  const [currentBudget, setCurrentBudget] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCurrentBudget();
  }, []);

  const loadCurrentBudget = async () => {
    try {
      const budget = await budgetService.getBudget();
      if (budget) {
        setCurrentBudget(budget.dailyLimit);
        setDailyLimit(budget.dailyLimit.toString());
      }
    } catch (error) {
      console.error('Failed to load budget:', error);
    }
  };

  const handleSave = async () => {
    const limit = parseInt(dailyLimit, 10);

    if (isNaN(limit) || limit <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid number greater than 0.');
      return;
    }

    if (limit > 100) {
      Alert.alert(
        'High Limit',
        'Are you sure you want to set a daily limit of more than 100 cigarettes?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes', onPress: () => saveBudget(limit) },
        ]
      );
      return;
    }

    saveBudget(limit);
  };

  const saveBudget = async (limit: number) => {
    setIsSaving(true);
    try {
      if (currentBudget !== null) {
        await budgetService.updateBudget(limit);
      } else {
        await budgetService.setBudget(limit);
      }

      AccessibilityInfo.announceForAccessibility(
        `Daily budget set to ${limit} cigarettes`
      );

      Alert.alert(
        'Success',
        `Your daily budget has been set to ${limit} cigarette${limit === 1 ? '' : 's'}.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to save budget:', error);
      Alert.alert('Error', 'Failed to save budget. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to remove your daily budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await budgetService.deleteBudget();
              AccessibilityInfo.announceForAccessibility('Budget deleted');
              router.back();
            } catch (error) {
              console.error('Failed to delete budget:', error);
              Alert.alert('Error', 'Failed to delete budget. Please try again.');
            }
          },
        },
      ]
    );
  };

  const quickSetButtons = [5, 10, 15, 20];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.title}>Daily Cigarette Budget</Text>
        <Text style={styles.description}>
          Set a daily limit to help you track and reduce your smoking habits. You'll
          see your progress throughout the day.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Daily Limit</Text>
        <TextInput
          style={styles.input}
          value={dailyLimit}
          onChangeText={setDailyLimit}
          placeholder="Enter number of cigarettes"
          keyboardType="number-pad"
          maxLength={3}
          accessibilityLabel="Daily cigarette limit"
          accessibilityHint="Enter the maximum number of cigarettes you want to smoke per day"
        />

        <Text style={styles.quickSetLabel}>Quick set:</Text>
        <View style={styles.quickSetContainer}>
          {quickSetButtons.map(value => (
            <TouchableOpacity
              key={value}
              style={[
                styles.quickSetButton,
                dailyLimit === value.toString() && styles.quickSetButtonSelected,
              ]}
              onPress={() => setDailyLimit(value.toString())}
              accessibilityLabel={`Set limit to ${value} cigarettes`}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.quickSetButtonText,
                  dailyLimit === value.toString() &&
                    styles.quickSetButtonTextSelected,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.infoTitle}>How it works</Text>
        <Text style={styles.infoText}>
          • Your budget resets every day at midnight
        </Text>
        <Text style={styles.infoText}>
          • Track your progress with the visual meter
        </Text>
        <Text style={styles.infoText}>
          • Get notified when you reach your limit
        </Text>
        <Text style={styles.infoText}>
          • All data is stored securely on your device
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
        accessibilityLabel="Save budget"
        accessibilityRole="button"
      >
        <Text style={styles.saveButtonText}>
          {isSaving ? 'Saving...' : currentBudget !== null ? 'Update Budget' : 'Set Budget'}
        </Text>
      </TouchableOpacity>

      {currentBudget !== null && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          accessibilityLabel="Delete budget"
          accessibilityRole="button"
        >
          <Text style={styles.deleteButtonText}>Remove Budget</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  quickSetLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  quickSetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickSetButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
  quickSetButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  quickSetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  quickSetButtonTextSelected: {
    color: '#007AFF',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
    marginBottom: 4,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#CCC',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF3B30',
    marginBottom: 32,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});
