import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  AccessibilityInfo,
} from 'react-native';
import { useRouter } from 'expo-router';
import { cigaretteLogService } from '../src/services/cigaretteLog';
import { locationService } from '../src/services/location';
import {
  DEFAULT_MOODS,
  DEFAULT_ACTIVITIES,
  DEFAULT_TRIGGER_TAGS,
} from '../src/types/models';

export default function LogDetailScreen() {
  const router = useRouter();
  const [mood, setMood] = useState<string | undefined>();
  const [activity, setActivity] = useState<string | undefined>();
  const [notes, setNotes] = useState('');
  const [triggerTags, setTriggerTags] = useState<string[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleLocationRequest = async () => {
    setIsLoadingLocation(true);
    try {
      const hasPermission = await locationService.requestPermission();
      if (!hasPermission) {
        Alert.alert(
          'Location Permission',
          'Location permission is required to track where you smoke. You can enable it in Settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      const currentLocation = await locationService.getCurrentLocation();
      setLocation(currentLocation);
      AccessibilityInfo.announceForAccessibility('Location captured');
    } catch (error) {
      console.error('Failed to get location:', error);
      Alert.alert('Error', 'Failed to get your location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const toggleTriggerTag = (tagId: string) => {
    setTriggerTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await cigaretteLogService.createLog({
        mood,
        activity,
        location,
        notes: notes.trim() || undefined,
        triggerTags: triggerTags.length > 0 ? triggerTags : undefined,
      });

      AccessibilityInfo.announceForAccessibility('Cigarette logged successfully');
      router.back();
    } catch (error) {
      console.error('Failed to save log:', error);
      Alert.alert('Error', 'Failed to save log. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are you feeling?</Text>
        <View style={styles.optionsGrid}>
          {DEFAULT_MOODS.map(moodOption => (
            <TouchableOpacity
              key={moodOption.id}
              style={[
                styles.option,
                mood === moodOption.id && styles.optionSelected,
              ]}
              onPress={() => setMood(moodOption.id)}
              accessibilityLabel={`Mood: ${moodOption.name}`}
              accessibilityRole="button"
              accessibilityState={{ selected: mood === moodOption.id }}
            >
              <Text style={styles.optionEmoji}>{moodOption.emoji}</Text>
              <Text
                style={[
                  styles.optionText,
                  mood === moodOption.id && styles.optionTextSelected,
                ]}
              >
                {moodOption.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What were you doing?</Text>
        <View style={styles.optionsGrid}>
          {DEFAULT_ACTIVITIES.map(activityOption => (
            <TouchableOpacity
              key={activityOption.id}
              style={[
                styles.option,
                activity === activityOption.id && styles.optionSelected,
              ]}
              onPress={() => setActivity(activityOption.id)}
              accessibilityLabel={`Activity: ${activityOption.name}`}
              accessibilityRole="button"
              accessibilityState={{ selected: activity === activityOption.id }}
            >
              <Text style={styles.optionEmoji}>{activityOption.icon}</Text>
              <Text
                style={[
                  styles.optionText,
                  activity === activityOption.id && styles.optionTextSelected,
                ]}
              >
                {activityOption.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What triggered it?</Text>
        <View style={styles.tagsContainer}>
          {DEFAULT_TRIGGER_TAGS.map(tag => (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tag,
                triggerTags.includes(tag.id) && styles.tagSelected,
                { borderColor: tag.color },
              ]}
              onPress={() => toggleTriggerTag(tag.id)}
              accessibilityLabel={`Trigger: ${tag.name}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: triggerTags.includes(tag.id) }}
            >
              <Text
                style={[
                  styles.tagText,
                  triggerTags.includes(tag.id) && { color: tag.color },
                ]}
              >
                {tag.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        {location ? (
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>
              {location.address || `${location.latitude}, ${location.longitude}`}
            </Text>
            <TouchableOpacity onPress={() => setLocation(null)}>
              <Text style={styles.removeLocationText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleLocationRequest}
            disabled={isLoadingLocation}
            accessibilityLabel="Add location"
            accessibilityHint="Tap to capture your current location"
          >
            <Text style={styles.locationButtonText}>
              {isLoadingLocation ? 'Getting location...' : '📍 Add Location'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes (optional)</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any additional notes..."
          maxLength={1000}
          accessibilityLabel="Notes"
          accessibilityHint="Enter any additional notes about this cigarette"
        />
        <Text style={styles.characterCount}>{notes.length} / 1000</Text>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
        accessibilityLabel="Save log"
        accessibilityRole="button"
      >
        <Text style={styles.saveButtonText}>
          {isSaving ? 'Saving...' : 'Save Log'}
        </Text>
      </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  option: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  optionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  tagSelected: {
    backgroundColor: '#F0F0F0',
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  removeLocationText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  locationButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  saveButtonDisabled: {
    backgroundColor: '#CCC',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
