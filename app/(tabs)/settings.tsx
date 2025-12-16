// Settings Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Switch,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/useAppStore';
import { defaultUserSettings } from '../../src/types';
import { savePin, removePin } from '../../src/utils/security';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function SettingsScreen() {
    const { settings, updateSettings } = useAppStore();
    const [showPinSetup, setShowPinSetup] = useState(false);
    const [newPin, setNewPin] = useState('');
    const [editingPrice, setEditingPrice] = useState(false);
    const [priceInput, setPriceInput] = useState(String(settings.financial.pricePerPack));

    // Toggle handlers
    const handleDelayToggle = () => {
        updateSettings({
            delay: { ...settings.delay, enabled: !settings.delay.enabled },
        });
    };

    const handleBreathingToggle = () => {
        updateSettings({
            delay: { ...settings.delay, showBreathingExercise: !settings.delay.showBreathingExercise },
        });
    };

    const handleDisguiseModeToggle = () => {
        updateSettings({
            privacy: { ...settings.privacy, disguiseMode: !settings.privacy.disguiseMode },
        });
    };

    const handleNeutralNotificationsToggle = () => {
        updateSettings({
            privacy: { ...settings.privacy, neutralNotifications: !settings.privacy.neutralNotifications },
        });
    };

    const handleReductionModeToggle = () => {
        updateSettings({
            reduction: { ...settings.reduction, enabled: !settings.reduction.enabled },
        });
    };

    // PIN handlers
    const handlePinToggle = async () => {
        if (settings.privacy.pinEnabled) {
            // Disable PIN
            await removePin();
            updateSettings({
                privacy: { ...settings.privacy, pinEnabled: false },
            });
        } else {
            // Show PIN setup
            setShowPinSetup(true);
        }
    };

    const handleSetPin = async () => {
        if (newPin.length === 4) {
            await savePin(newPin);
            updateSettings({
                privacy: { ...settings.privacy, pinEnabled: true },
            });
            setShowPinSetup(false);
            setNewPin('');
            Alert.alert('Success', 'PIN has been set successfully');
        } else {
            Alert.alert('Error', 'PIN must be 4 digits');
        }
    };

    // Price save handler
    const handleSavePrice = () => {
        const price = parseFloat(priceInput);
        if (!isNaN(price) && price > 0) {
            updateSettings({
                financial: { ...settings.financial, pricePerPack: price },
            });
        }
        setEditingPrice(false);
    };

    // Reset to defaults handler
    const handleResetToDefaults = () => {
        Alert.alert(
            'Reset Settings',
            'This will reset all settings to default values. Your smoking logs will not be deleted. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        await removePin();
                        await updateSettings(defaultUserSettings);
                        setPriceInput(String(defaultUserSettings.financial.pricePerPack));
                        Alert.alert('Done', 'Settings have been reset to defaults');
                    },
                },
            ]
        );
    };

    const renderSection = (
        title: string,
        children: React.ReactNode
    ) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionContent}>{children}</View>
        </View>
    );

    const renderToggleRow = (
        icon: string,
        label: string,
        description: string,
        value: boolean,
        onToggle: () => void
    ) => (
        <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
                <Ionicons name={icon as any} size={22} color={colors.primary[500]} />
            </View>
            <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>{label}</Text>
                <Text style={styles.settingDescription}>{description}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: colors.neutral[200], true: colors.primary[400] }}
                thumbColor={value ? colors.primary[600] : colors.neutral[400]}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Settings</Text>
                </View>

                {/* Delay System */}
                {renderSection('Delay System', (
                    <>
                        {renderToggleRow(
                            'time-outline',
                            'Enable Delay Timer',
                            'Pause before logging to reflect on your urge',
                            settings.delay.enabled,
                            handleDelayToggle
                        )}
                        {settings.delay.enabled && renderToggleRow(
                            'fitness-outline',
                            'Breathing Exercise',
                            'Show guided breathing during delay',
                            settings.delay.showBreathingExercise,
                            handleBreathingToggle
                        )}
                    </>
                ))}

                {/* Smart Reduction */}
                {renderSection('Smart Reduction', (
                    <>
                        {renderToggleRow(
                            'trending-down-outline',
                            'Reduction Mode',
                            'Get personalized tips to gradually reduce',
                            settings.reduction.enabled,
                            handleReductionModeToggle
                        )}
                    </>
                ))}

                {/* Financial Settings */}
                {renderSection('Financial', (
                    <>
                        <TouchableOpacity
                            style={styles.settingRow}
                            onPress={() => setEditingPrice(true)}
                        >
                            <View style={styles.settingIcon}>
                                <Ionicons name="cash-outline" size={22} color={colors.primary[500]} />
                            </View>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingLabel}>Price per Pack</Text>
                                <Text style={styles.settingDescription}>
                                    Used for spending calculations
                                </Text>
                            </View>
                            {editingPrice ? (
                                <View style={styles.inlineEdit}>
                                    <TextInput
                                        style={styles.priceInput}
                                        value={priceInput}
                                        onChangeText={setPriceInput}
                                        keyboardType="decimal-pad"
                                        autoFocus
                                    />
                                    <TouchableOpacity onPress={handleSavePrice}>
                                        <Ionicons name="checkmark" size={24} color={colors.primary[500]} />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Text style={styles.settingValue}>
                                    {settings.financial.currency}{settings.financial.pricePerPack}
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Currency Selector */}
                        <View style={styles.currencySection}>
                            <View style={styles.currencySectionHeader}>
                                <View style={styles.settingIcon}>
                                    <Ionicons name="globe-outline" size={22} color={colors.primary[500]} />
                                </View>
                                <View style={styles.settingContent}>
                                    <Text style={styles.settingLabel}>Currency</Text>
                                    <Text style={styles.settingDescription}>
                                        Select your local currency
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.currencyGrid}>
                                {[
                                    { symbol: '$', code: 'USD', name: 'US Dollar' },
                                    { symbol: '€', code: 'EUR', name: 'Euro' },
                                    { symbol: '£', code: 'GBP', name: 'Pound' },
                                    { symbol: '₹', code: 'INR', name: 'Rupee' },
                                    { symbol: '¥', code: 'JPY', name: 'Yen' },
                                    { symbol: '₱', code: 'PHP', name: 'Peso' },
                                ].map((curr) => (
                                    <TouchableOpacity
                                        key={curr.symbol}
                                        onPress={() => updateSettings({
                                            financial: { ...settings.financial, currency: curr.symbol }
                                        })}
                                        style={[
                                            styles.currencyCard,
                                            settings.financial.currency === curr.symbol && styles.currencyCardActive
                                        ]}
                                    >
                                        <Text style={[
                                            styles.currencySymbol,
                                            settings.financial.currency === curr.symbol && styles.currencySymbolActive
                                        ]}>
                                            {curr.symbol}
                                        </Text>
                                        <Text style={[
                                            styles.currencyCode,
                                            settings.financial.currency === curr.symbol && styles.currencyCodeActive
                                        ]}>
                                            {curr.code}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </>
                ))}

                {/* Privacy & Security */}
                {renderSection('Privacy & Security', (
                    <>
                        {renderToggleRow(
                            'lock-closed-outline',
                            'PIN Protection',
                            'Require PIN to open the app',
                            settings.privacy.pinEnabled,
                            handlePinToggle
                        )}
                        {renderToggleRow(
                            'eye-off-outline',
                            'Disguise Mode',
                            'Show neutral app name on home screen',
                            settings.privacy.disguiseMode,
                            handleDisguiseModeToggle
                        )}
                        {renderToggleRow(
                            'notifications-off-outline',
                            'Neutral Notifications',
                            'Hide smoking-related content in notifications',
                            settings.privacy.neutralNotifications,
                            handleNeutralNotificationsToggle
                        )}
                    </>
                ))}

                {/* PIN Setup Modal */}
                {showPinSetup && (
                    <View style={styles.pinSetup}>
                        <Text style={styles.pinSetupTitle}>Set a 4-digit PIN</Text>
                        <TextInput
                            style={styles.pinInput}
                            value={newPin}
                            onChangeText={(text) => setNewPin(text.replace(/[^0-9]/g, '').slice(0, 4))}
                            keyboardType="number-pad"
                            secureTextEntry
                            maxLength={4}
                            placeholder="••••"
                            placeholderTextColor={colors.neutral[400]}
                        />
                        <View style={styles.pinButtons}>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowPinSetup(false);
                                    setNewPin('');
                                }}
                                style={styles.pinCancelButton}
                            >
                                <Text style={styles.pinCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSetPin}
                                style={styles.pinConfirmButton}
                            >
                                <Text style={styles.pinConfirmText}>Set PIN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* App Info */}
                <View style={styles.appInfo}>
                    <Text style={styles.appName}>SmokeSense</Text>
                    <Text style={styles.appVersion}>Version 1.0.0</Text>
                    <Text style={styles.appTagline}>
                        Awareness • Control • Reduction
                    </Text>
                </View>

                {/* Reset Button */}
                <TouchableOpacity
                    onPress={handleResetToDefaults}
                    style={styles.resetButton}
                >
                    <Ionicons name="refresh-outline" size={20} color={colors.error} />
                    <Text style={styles.resetButtonText}>Reset to Defaults</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    header: {
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.sizes.xxl,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[500],
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.sm,
    },
    sectionContent: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[100],
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    settingContent: {
        flex: 1,
    },
    settingLabel: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
        color: colors.neutral[800],
    },
    settingDescription: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[500],
        marginTop: 2,
    },
    settingValue: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.primary[500],
    },
    inlineEdit: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    priceInput: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[800],
        borderBottomWidth: 1,
        borderBottomColor: colors.primary[500],
        paddingVertical: spacing.xs,
        minWidth: 60,
        textAlign: 'right',
    },
    pinSetup: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        marginBottom: spacing.lg,
        alignItems: 'center',
    },
    pinSetupTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[800],
        marginBottom: spacing.lg,
    },
    pinInput: {
        fontSize: 32,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
        textAlign: 'center',
        letterSpacing: 12,
        borderBottomWidth: 2,
        borderBottomColor: colors.primary[500],
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.lg,
    },
    pinButtons: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    pinCancelButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
    },
    pinCancelText: {
        fontSize: typography.sizes.md,
        color: colors.neutral[500],
    },
    pinConfirmButton: {
        backgroundColor: colors.primary[500],
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.md,
    },
    pinConfirmText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[0],
    },
    appInfo: {
        alignItems: 'center',
        paddingVertical: spacing.xxl,
    },
    appName: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        color: colors.primary[500],
    },
    appVersion: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[400],
        marginTop: spacing.xs,
    },
    appTagline: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[500],
        marginTop: spacing.sm,
    },
    currencySection: {
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[100],
    },
    currencySectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    currencyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    currencyCard: {
        width: '30%',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.neutral[50],
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    currencyCardActive: {
        backgroundColor: colors.primary[50],
        borderColor: colors.primary[500],
    },
    currencySymbol: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.neutral[600],
    },
    currencySymbolActive: {
        color: colors.primary[600],
    },
    currencyCode: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
        color: colors.neutral[400],
        marginTop: 2,
    },
    currencyCodeActive: {
        color: colors.primary[500],
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        marginBottom: spacing.xxl,
        marginTop: spacing.md,
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.error,
    },
    resetButtonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
        color: colors.error,
    },
});
