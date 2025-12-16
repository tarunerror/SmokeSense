import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  AccessibilityInfo,
} from 'react-native';
import { useRouter } from 'expo-router';
import { cigaretteLogService } from '../src/services/cigaretteLog';
import { budgetService } from '../src/services/budget';
import { BudgetStatus, CigaretteLog } from '../src/types/models';
import BudgetMeter from '../src/components/BudgetMeter';
import QuickLogButton from '../src/components/QuickLogButton';

export default function HomeScreen() {
  const router = useRouter();
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus | null>(null);
  const [recentLogs, setRecentLogs] = useState<CigaretteLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [status, logs] = await Promise.all([
        budgetService.getBudgetStatus(),
        cigaretteLogService.getTodayLogs(),
      ]);

      setBudgetStatus(status);
      setRecentLogs(logs);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleQuickLog = async () => {
    if (isLogging) return;

    setIsLogging(true);
    try {
      await cigaretteLogService.createLog();
      await loadData();

      AccessibilityInfo.announceForAccessibility('Cigarette logged successfully');
    } catch (error) {
      console.error('Failed to log cigarette:', error);
      AccessibilityInfo.announceForAccessibility('Failed to log cigarette');
    } finally {
      setIsLogging(false);
    }
  };

  const handleDetailedLog = () => {
    router.push('/log-detail');
  };

  const handleBudgetSettings = () => {
    router.push('/budget-settings');
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {budgetStatus && (
        <View style={styles.budgetSection}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetTitle}>Daily Budget</Text>
            <TouchableOpacity 
              onPress={handleBudgetSettings}
              accessibilityLabel="Budget settings"
              accessibilityHint="Tap to change your daily cigarette limit"
            >
              <Text style={styles.settingsButton}>Settings</Text>
            </TouchableOpacity>
          </View>
          <BudgetMeter status={budgetStatus} />
        </View>
      )}

      {!budgetStatus && (
        <View style={styles.noBudgetSection}>
          <Text style={styles.noBudgetText}>No budget set</Text>
          <TouchableOpacity 
            style={styles.setBudgetButton}
            onPress={handleBudgetSettings}
            accessibilityLabel="Set budget"
            accessibilityHint="Tap to set your daily cigarette limit"
          >
            <Text style={styles.setBudgetButtonText}>Set Budget</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.logSection}>
        <QuickLogButton 
          onQuickLog={handleQuickLog}
          onDetailedLog={handleDetailedLog}
          isLogging={isLogging}
        />
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.recentTitle}>Today's Logs</Text>
        {recentLogs.length === 0 ? (
          <Text style={styles.noLogsText}>No cigarettes logged today</Text>
        ) : (
          recentLogs.map((log) => (
            <View 
              key={log.id} 
              style={styles.logItem}
              accessibilityLabel={`Cigarette logged at ${formatTime(log.timestamp)}`}
            >
              <Text style={styles.logTime}>{formatTime(log.timestamp)}</Text>
              {log.mood && (
                <Text style={styles.logDetail}>Mood: {log.mood}</Text>
              )}
              {log.activity && (
                <Text style={styles.logDetail}>Activity: {log.activity}</Text>
              )}
              {log.notes && (
                <Text style={styles.logNotes} numberOfLines={1}>
                  {log.notes}
                </Text>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  budgetSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  settingsButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  noBudgetSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noBudgetText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  setBudgetButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  setBudgetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logSection: {
    marginBottom: 24,
  },
  recentSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  noLogsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 16,
  },
  logItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  logDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  logNotes: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});
