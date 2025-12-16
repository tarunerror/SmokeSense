// Home Screen - Main Logging Interface (Redesigned)
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/useAppStore';
import { LogButton } from '../../src/components/LogButton';
import { MoodSelector } from '../../src/components/MoodSelector';
import { ActivityTag } from '../../src/components/ActivityTag';
import { BudgetMeter } from '../../src/components/BudgetMeter';
import { DelayTimer } from '../../src/components/DelayTimer';
import { Mood, Activity } from '../../src/types';
import { colors, spacing, borderRadius, typography } from '../../src/theme';

export default function HomeScreen() {
    const {
        todayCount,
        todayBudget,
        settings,
        showDelayTimer,
        logCigarette,
        startDelayTimer,
        cancelDelay,
        completeDelay,
        recentLogs,
        resetTodayCount,
    } = useAppStore();

    const [showDetails, setShowDetails] = useState(false);
    const [selectedMood, setSelectedMood] = useState<Mood | undefined>();
    const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>();
    const [timeSinceLast, setTimeSinceLast] = useState<string | null>(null);

    // Get the last cigarette timestamp
    const getLastCigTimestamp = () => {
        const todayLogs = recentLogs.filter(
            (log) => log.date === new Date().toISOString().split('T')[0]
        );
        return todayLogs.length > 0 ? todayLogs[0].timestamp : null;
    };

    // Format time difference
    const formatTimeDiff = (diffMs: number): string => {
        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) {
            return `${seconds}s`;
        } else if (minutes < 60) {
            const remainingSecs = seconds % 60;
            return `${minutes}m ${remainingSecs}s`;
        } else if (hours < 24) {
            const remainingMins = minutes % 60;
            return `${hours}h ${remainingMins}m`;
        } else {
            const remainingHours = hours % 24;
            return `${days}d ${remainingHours}h`;
        }
    };

    // Real-time timer for last cigarette
    useEffect(() => {
        const updateTimer = () => {
            const lastTimestamp = getLastCigTimestamp();
            if (lastTimestamp) {
                const diff = Date.now() - lastTimestamp;
                setTimeSinceLast(formatTimeDiff(diff));
            } else {
                setTimeSinceLast(null);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [recentLogs]);

    const handleLogPress = () => {
        if (settings.delay.enabled && !showDelayTimer) {
            startDelayTimer();
        } else {
            setShowDetails(true);
        }
    };

    const handleConfirmLog = async () => {
        await logCigarette({
            mood: selectedMood,
            activity: selectedActivity,
            wasDelayed: showDelayTimer,
        });
        setShowDetails(false);
        setSelectedMood(undefined);
        setSelectedActivity(undefined);
    };

    const handleQuickLog = async () => {
        await logCigarette({
            wasDelayed: false,
        });
    };

    const handleDelayComplete = () => {
        completeDelay();
        setShowDetails(true);
    };

    const handleDelaySkip = () => {
        cancelDelay();
        handleConfirmLog();
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const handleResetCount = () => {
        Alert.alert(
            "Reset Today's Count",
            'This will delete all cigarette logs for today. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: resetTodayCount,
                },
            ]
        );
    };

    const todayLogs = recentLogs.filter((log) => log.date === new Date().toISOString().split('T')[0]);
    const budgetLimit = todayBudget?.limit || settings.dailyBudget;

    if (showDelayTimer) {
        return (
            <DelayTimer
                durationSeconds={settings.delay.defaultDelaySeconds}
                onComplete={handleDelayComplete}
                onSkip={handleDelaySkip}
                showBreathing={settings.delay.showBreathingExercise}
                allowSkip={settings.delay.allowSkip}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Fixed Top Section - Always visible */}
            <View style={styles.fixedTop}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.greeting}>{getGreeting()}</Text>
                        <Text style={styles.dateText}>
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </Text>
                    </View>
                    {timeSinceLast && (
                        <View style={styles.timerBadge}>
                            <Ionicons name="time-outline" size={14} color={colors.primary[600]} />
                            <Text style={styles.timerBadgeLabel}>Last smoke:</Text>
                            <Text style={styles.timerBadgeText}>{timeSinceLast}</Text>
                        </View>
                    )}
                </View>

                {/* Budget Meter - Compact */}
                <View style={styles.meterRow}>
                    <BudgetMeter
                        used={todayCount}
                        limit={budgetLimit}
                        size={120}
                        showLabel={false}
                    />
                    <View style={styles.meterInfo}>
                        <Text style={styles.countLarge}>{todayCount}</Text>
                        <Text style={styles.countLabel}>of {budgetLimit} today</Text>
                        {todayCount > 0 && (
                            <TouchableOpacity onPress={handleResetCount} style={styles.resetLink}>
                                <Text style={styles.resetLinkText}>Reset count</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* LOG BUTTON - Prominent */}
                <View style={styles.logButtonContainer}>
                    <LogButton onPress={handleLogPress} size="large" />
                    <TouchableOpacity onPress={handleQuickLog} style={styles.quickLogPill}>
                        <Ionicons name="flash" size={16} color={colors.neutral[0]} />
                        <Text style={styles.quickLogText}>Quick Log</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Scrollable Activity Section */}
            <ScrollView
                style={styles.scrollSection}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Today's Activity */}
                <View style={styles.activityCard}>
                    <View style={styles.activityHeader}>
                        <Text style={styles.sectionTitle}>Today's Activity</Text>
                        <Text style={styles.activityCount}>
                            {todayLogs.length} {todayLogs.length === 1 ? 'entry' : 'entries'}
                        </Text>
                    </View>

                    {todayLogs.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="leaf-outline" size={24} color={colors.neutral[300]} />
                            <Text style={styles.emptyText}>No cigarettes logged today</Text>
                        </View>
                    ) : (
                        <View style={styles.logsList}>
                            {todayLogs.slice(0, 10).map((log, index) => (
                                <View
                                    key={log.id}
                                    style={[
                                        styles.logItem,
                                        index === todayLogs.slice(0, 10).length - 1 && styles.logItemLast
                                    ]}
                                >
                                    <View style={styles.logNumber}>
                                        <Text style={styles.logNumberText}>
                                            {todayLogs.indexOf(log) + 1}
                                        </Text>
                                    </View>
                                    <Text style={styles.logTimeText}>
                                        {formatTime(log.timestamp)}
                                    </Text>
                                    <View style={styles.logTags}>
                                        {log.mood && (
                                            <View style={[styles.tag, { backgroundColor: colors.moods[log.mood] }]}>
                                                <Text style={styles.tagText}>{log.mood}</Text>
                                            </View>
                                        )}
                                        {log.activity && (
                                            <View style={[styles.tag, { backgroundColor: colors.secondary[400] }]}>
                                                <Text style={styles.tagText}>{log.activity}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Quote */}
                <View style={styles.quoteCard}>
                    <Text style={styles.quoteText}>
                        "Awareness is the first step to change."
                    </Text>
                </View>
            </ScrollView>

            {/* Details Modal */}
            <Modal
                visible={showDetails}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowDetails(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            onPress={() => setShowDetails(false)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} color={colors.neutral[600]} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Add Details</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <Text style={styles.modalSectionTitle}>How are you feeling?</Text>
                        <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />

                        <Text style={styles.modalSectionTitle}>What are you doing?</Text>
                        <ActivityTag
                            selectedActivity={selectedActivity}
                            onSelect={setSelectedActivity}
                        />
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            onPress={() => {
                                setShowDetails(false);
                                handleQuickLog();
                            }}
                            style={styles.skipDetailsButton}
                        >
                            <Text style={styles.skipDetailsText}>Skip</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleConfirmLog}
                            style={styles.confirmButton}
                        >
                            <Ionicons name="checkmark" size={22} color={colors.neutral[0]} />
                            <Text style={styles.confirmButtonText}>Log Cigarette</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    fixedTop: {
        backgroundColor: colors.background.primary,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[100],
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    greeting: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
    },
    dateText: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[500],
        marginTop: 2,
    },
    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary[50],
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        gap: spacing.xs,
    },
    timerBadgeText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
        color: colors.primary[600],
    },
    timerBadgeLabel: {
        fontSize: typography.sizes.xs,
        color: colors.primary[500],
    },
    meterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    meterInfo: {
        flex: 1,
        marginLeft: spacing.lg,
    },
    countLarge: {
        fontSize: 48,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
        lineHeight: 52,
    },
    countLabel: {
        fontSize: typography.sizes.md,
        color: colors.neutral[500],
    },
    resetLink: {
        marginTop: spacing.sm,
    },
    resetLinkText: {
        fontSize: typography.sizes.sm,
        color: colors.error,
    },
    logButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
    },
    quickLogPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary[500],
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.full,
        gap: spacing.xs,
    },
    quickLogText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[0],
    },
    scrollSection: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    activityCard: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[800],
    },
    activityCount: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[400],
    },
    emptyState: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.lg,
        gap: spacing.sm,
    },
    emptyText: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[400],
    },
    logsList: {},
    logItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[100],
        gap: spacing.sm,
    },
    logItemLast: {
        borderBottomWidth: 0,
    },
    logNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    logNumberText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.semibold,
        color: colors.primary[600],
    },
    logTimeText: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[600],
        minWidth: 70,
    },
    logTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
        flex: 1,
    },
    tag: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
    },
    tagText: {
        fontSize: 10,
        color: colors.neutral[0],
        fontWeight: typography.weights.medium,
        textTransform: 'capitalize',
    },
    quoteCard: {
        backgroundColor: colors.primary[50],
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
    },
    quoteText: {
        fontSize: typography.sizes.sm,
        color: colors.primary[600],
        fontStyle: 'italic',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[100],
    },
    closeButton: {
        padding: spacing.sm,
    },
    modalTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[800],
    },
    modalContent: {
        flex: 1,
        padding: spacing.lg,
    },
    modalSectionTitle: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
        color: colors.neutral[700],
        marginBottom: spacing.md,
        marginTop: spacing.md,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: spacing.lg,
        gap: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutral[100],
    },
    skipDetailsButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutral[300],
    },
    skipDetailsText: {
        fontSize: typography.sizes.md,
        color: colors.neutral[600],
    },
    confirmButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary[500],
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
    },
    confirmButtonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[0],
    },
});
