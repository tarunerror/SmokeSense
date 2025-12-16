import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BudgetStatus } from '../types/models';

interface BudgetMeterProps {
  status: BudgetStatus;
  variant?: 'circular' | 'linear';
}

export default function BudgetMeter({ status, variant = 'linear' }: BudgetMeterProps) {
  const { todayCount, percentage, remaining, budget } = status;
  const isOverBudget = todayCount >= budget.dailyLimit;

  const getColor = () => {
    if (percentage >= 100) return '#FF3B30';
    if (percentage >= 80) return '#FF9500';
    if (percentage >= 60) return '#FFCC00';
    return '#34C759';
  };

  if (variant === 'circular') {
    return (
      <View 
        style={styles.circularContainer}
        accessibilityLabel={`${todayCount} of ${budget.dailyLimit} cigarettes logged today. ${remaining} remaining.`}
        accessibilityRole="progressbar"
      >
        <View style={styles.circularMeter}>
          <View
            style={[
              styles.circularFill,
              {
                transform: [{ rotate: `${(percentage / 100) * 360}deg` }],
                borderColor: getColor(),
              },
            ]}
          />
          <View style={styles.circularInner}>
            <Text style={styles.circularCount}>{todayCount}</Text>
            <Text style={styles.circularLabel}>/ {budget.dailyLimit}</Text>
          </View>
        </View>
        <Text style={styles.statusText}>
          {isOverBudget
            ? 'Budget exceeded'
            : `${remaining} remaining`}
        </Text>
      </View>
    );
  }

  return (
    <View 
      style={styles.linearContainer}
      accessibilityLabel={`${todayCount} of ${budget.dailyLimit} cigarettes logged today. ${remaining} remaining.`}
      accessibilityRole="progressbar"
    >
      <View style={styles.linearHeader}>
        <Text style={styles.countText}>
          {todayCount} / {budget.dailyLimit}
        </Text>
        <Text style={[styles.remainingText, isOverBudget && styles.overBudgetText]}>
          {isOverBudget ? 'Over budget!' : `${remaining} left`}
        </Text>
      </View>
      <View style={styles.linearBar}>
        <View
          style={[
            styles.linearFill,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: getColor(),
            },
          ]}
        />
      </View>
      <View style={styles.percentageContainer}>
        <Text style={[styles.percentageText, { color: getColor() }]}>
          {Math.round(percentage)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circularContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  circularMeter: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  circularFill: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: '#34C759',
  },
  circularInner: {
    alignItems: 'center',
  },
  circularCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  circularLabel: {
    fontSize: 18,
    color: '#666',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  linearContainer: {
    width: '100%',
  },
  linearHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  countText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  remainingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  overBudgetText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  linearBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E5EA',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  linearFill: {
    height: '100%',
    borderRadius: 6,
  },
  percentageContainer: {
    alignItems: 'flex-end',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
