// Settings Screen - Redesigned UI
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
    Image,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/useAppStore';
import { defaultUserSettings } from '../../src/types';
import { savePin, removePin } from '../../src/utils/security';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

const CURRENCIES = [
    { symbol: '$', code: 'USD' },
    { symbol: '€', code: 'EUR' },
    { symbol: '£', code: 'GBP' },
    { symbol: '₹', code: 'INR' },
    { symbol: '¥', code: 'JPY' },
    { symbol: '₱', code: 'PHP' },
];

export default function SettingsScreen() {
    const { settings, updateSettings } = useAppStore();
    const [showPinSetup, setShowPinSetup] = useState(false);
    const [newPin, setNewPin] = useState('');
    const [editingPrice, setEditingPrice] = useState(false);
    const [editingCigsPerPack, setEditingCigsPerPack] = useState(false);
    const [priceInput, setPriceInput] = useState(String(settings.financial.pricePerPack));
    const [cigsInput, setCigsInput] = useState(String(settings.financial.cigarettesPerPack));

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

    const handleSkipToggle = () => {
        updateSettings({
            delay: { ...settings.delay, allowSkip: !settings.delay.allowSkip },
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
            await removePin();
            updateSettings({
                privacy: { ...settings.privacy, pinEnabled: false },
            });
        } else {
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

    // Save handlers
    const handleSavePrice = () => {
        const price = parseFloat(priceInput);
        if (!isNaN(price) && price > 0) {
            updateSettings({
                financial: { ...settings.financial, pricePerPack: price },
            });
        }
        setEditingPrice(false);
    };

    const handleSaveCigs = () => {
        const cigs = parseInt(cigsInput, 10);
        if (!isNaN(cigs) && cigs > 0) {
            updateSettings({
                financial: { ...settings.financial, cigarettesPerPack: cigs },
            });
        }
        setEditingCigsPerPack(false);
    };

    // Reset handler
    const handleResetToDefaults = () => {
        Alert.alert(
            'Reset Settings',
            'This will reset all settings to default values. Your logs will not be deleted.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        await removePin();
                        await updateSettings(defaultUserSettings);
                        setPriceInput(String(defaultUserSettings.financial.pricePerPack));
                        setCigsInput(String(defaultUserSettings.financial.cigarettesPerPack));
                        Alert.alert('Done', 'Settings have been reset');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Settings</Text>
                    <Text style={styles.subtitle}>Customize your experience</Text>
                </View>

                {/* Delay System Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.cardIcon, { backgroundColor: colors.primary[50] }]}>
                            <Ionicons name="time" size={20} color={colors.primary[500]} />
                        </View>
                        <Text style={styles.cardTitle}>Delay System</Text>
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Enable Delay Timer</Text>
                            <Text style={styles.settingDesc}>Pause before logging</Text>
                        </View>
                        <Switch
                            value={settings.delay.enabled}
                            onValueChange={handleDelayToggle}
                            trackColor={{ false: colors.neutral[200], true: colors.primary[400] }}
                            thumbColor={settings.delay.enabled ? colors.primary[600] : colors.neutral[100]}
                        />
                    </View>

                    {settings.delay.enabled && (
                        <>
                            <View style={styles.settingRow}>
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingLabel}>Breathing Exercise</Text>
                                    <Text style={styles.settingDesc}>Guided breathing during delay</Text>
                                </View>
                                <Switch
                                    value={settings.delay.showBreathingExercise}
                                    onValueChange={handleBreathingToggle}
                                    trackColor={{ false: colors.neutral[200], true: colors.primary[400] }}
                                    thumbColor={settings.delay.showBreathingExercise ? colors.primary[600] : colors.neutral[100]}
                                />
                            </View>
                            <View style={styles.settingRow}>
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingLabel}>Allow Skip</Text>
                                    <Text style={styles.settingDesc}>Let users skip the delay</Text>
                                </View>
                                <Switch
                                    value={settings.delay.allowSkip}
                                    onValueChange={handleSkipToggle}
                                    trackColor={{ false: colors.neutral[200], true: colors.primary[400] }}
                                    thumbColor={settings.delay.allowSkip ? colors.primary[600] : colors.neutral[100]}
                                />
                            </View>
                        </>
                    )}
                </View>

                {/* Smart Reduction Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.cardIcon, { backgroundColor: colors.secondary[50] }]}>
                            <Ionicons name="trending-down" size={20} color={colors.secondary[500]} />
                        </View>
                        <Text style={styles.cardTitle}>Smart Reduction</Text>
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Reduction Mode</Text>
                            <Text style={styles.settingDesc}>Get tips to gradually reduce</Text>
                        </View>
                        <Switch
                            value={settings.reduction.enabled}
                            onValueChange={handleReductionModeToggle}
                            trackColor={{ false: colors.neutral[200], true: colors.secondary[400] }}
                            thumbColor={settings.reduction.enabled ? colors.secondary[600] : colors.neutral[100]}
                        />
                    </View>
                </View>

                {/* Financial Settings Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.cardIcon, { backgroundColor: '#FEF3C7' }]}>
                            <Ionicons name="cash" size={20} color="#D97706" />
                        </View>
                        <Text style={styles.cardTitle}>Financial</Text>
                    </View>

                    {/* Price per Pack */}
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={() => setEditingPrice(true)}
                    >
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Price per Pack</Text>
                            <Text style={styles.settingDesc}>Cost of a pack</Text>
                        </View>
                        {editingPrice ? (
                            <View style={styles.inlineEdit}>
                                <TextInput
                                    style={styles.editInput}
                                    value={priceInput}
                                    onChangeText={setPriceInput}
                                    keyboardType="decimal-pad"
                                    autoFocus
                                />
                                <TouchableOpacity onPress={handleSavePrice} style={styles.saveIcon}>
                                    <Ionicons name="checkmark" size={20} color={colors.primary[500]} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text style={styles.settingValue}>
                                {settings.financial.currency}{settings.financial.pricePerPack}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Cigarettes per Pack */}
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={() => setEditingCigsPerPack(true)}
                    >
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Cigarettes per Pack</Text>
                            <Text style={styles.settingDesc}>Number in one pack</Text>
                        </View>
                        {editingCigsPerPack ? (
                            <View style={styles.inlineEdit}>
                                <TextInput
                                    style={styles.editInput}
                                    value={cigsInput}
                                    onChangeText={setCigsInput}
                                    keyboardType="number-pad"
                                    autoFocus
                                />
                                <TouchableOpacity onPress={handleSaveCigs} style={styles.saveIcon}>
                                    <Ionicons name="checkmark" size={20} color={colors.primary[500]} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text style={styles.settingValue}>
                                {settings.financial.cigarettesPerPack}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Currency */}
                    <View style={styles.currencySection}>
                        <Text style={styles.currencyLabel}>Select Currency</Text>
                        <View style={styles.currencyGrid}>
                            {CURRENCIES.map((curr) => (
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
                </View>

                {/* Privacy & Security Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.cardIcon, { backgroundColor: '#FEE2E2' }]}>
                            <Ionicons name="shield" size={20} color="#DC2626" />
                        </View>
                        <Text style={styles.cardTitle}>Privacy & Security</Text>
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>PIN Protection</Text>
                            <Text style={styles.settingDesc}>Require PIN to open app</Text>
                        </View>
                        <Switch
                            value={settings.privacy.pinEnabled}
                            onValueChange={handlePinToggle}
                            trackColor={{ false: colors.neutral[200], true: '#DC2626' }}
                            thumbColor={settings.privacy.pinEnabled ? '#DC2626' : colors.neutral[100]}
                        />
                    </View>

                    {showPinSetup && (
                        <View style={styles.pinSetup}>
                            <Text style={styles.pinLabel}>Enter 4-digit PIN:</Text>
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
                                    onPress={() => { setShowPinSetup(false); setNewPin(''); }}
                                    style={styles.pinCancelBtn}
                                >
                                    <Text style={styles.pinCancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSetPin}
                                    style={styles.pinConfirmBtn}
                                >
                                    <Text style={styles.pinConfirmText}>Set PIN</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Disguise Mode</Text>
                            <Text style={styles.settingDesc}>Hide app identity</Text>
                        </View>
                        <Switch
                            value={settings.privacy.disguiseMode}
                            onValueChange={handleDisguiseModeToggle}
                            trackColor={{ false: colors.neutral[200], true: '#DC2626' }}
                            thumbColor={settings.privacy.disguiseMode ? '#DC2626' : colors.neutral[100]}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Neutral Notifications</Text>
                            <Text style={styles.settingDesc}>Hide content in notifications</Text>
                        </View>
                        <Switch
                            value={settings.privacy.neutralNotifications}
                            onValueChange={handleNeutralNotificationsToggle}
                            trackColor={{ false: colors.neutral[200], true: '#DC2626' }}
                            thumbColor={settings.privacy.neutralNotifications ? '#DC2626' : colors.neutral[100]}
                        />
                    </View>
                </View>

                {/* App Info */}
                <View style={styles.appInfo}>
                    <Image
                        source={require('../../assets/icon.png')}
                        style={styles.appIcon}
                    />
                    <Text style={styles.appName}>SmokeSense</Text>
                    <Text style={styles.appVersion}>Version 1.0.0</Text>
                    <Text style={styles.appTagline}>Awareness • Control • Reduction</Text>

                    {/* Developer Credits */}
                    <View style={styles.creditsSection}>
                        <Text style={styles.creditsLabel}>Developed by</Text>
                        <Text style={styles.creditsDeveloper}>Tarun Gautam</Text>
                        <TouchableOpacity
                            onPress={() => Linking.openURL('https://github.com/tarunerror/')}
                            style={styles.githubLink}
                        >
                            <Ionicons name="logo-github" size={16} color={colors.neutral[600]} />
                            <Text style={styles.githubText}>@tarunerror</Text>
                        </TouchableOpacity>
                        <Text style={styles.creditsYear}>© {new Date().getFullYear()}</Text>
                    </View>
                </View>

                {/* Reset Button */}
                <TouchableOpacity
                    onPress={handleResetToDefaults}
                    style={styles.resetButton}
                >
                    <Ionicons name="refresh" size={18} color={colors.error} />
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
    subtitle: {
        fontSize: typography.sizes.md,
        color: colors.neutral[500],
        marginTop: spacing.xs,
    },
    card: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[100],
    },
    cardIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    cardTitle: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[800],
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[50],
    },
    settingInfo: {
        flex: 1,
    },
    settingLabel: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        color: colors.neutral[700],
    },
    settingDesc: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[400],
        marginTop: 2,
    },
    settingValue: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.primary[600],
    },
    inlineEdit: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    editInput: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[800],
        borderBottomWidth: 2,
        borderBottomColor: colors.primary[500],
        paddingVertical: 2,
        minWidth: 60,
        textAlign: 'right',
    },
    saveIcon: {
        padding: spacing.xs,
    },
    currencySection: {
        marginTop: spacing.md,
    },
    currencyLabel: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        color: colors.neutral[700],
        marginBottom: spacing.sm,
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
    pinSetup: {
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginVertical: spacing.sm,
    },
    pinLabel: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[600],
        marginBottom: spacing.sm,
    },
    pinInput: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        textAlign: 'center',
        letterSpacing: 8,
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
    },
    pinButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    pinCancelBtn: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    pinCancelText: {
        color: colors.neutral[500],
    },
    pinConfirmBtn: {
        backgroundColor: colors.primary[500],
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
    },
    pinConfirmText: {
        color: colors.neutral[0],
        fontWeight: typography.weights.semibold,
    },
    appInfo: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    appLogo: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    appName: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
    },
    appVersion: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[400],
        marginTop: 2,
    },
    appTagline: {
        fontSize: typography.sizes.xs,
        color: colors.primary[500],
        marginTop: spacing.xs,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        borderWidth: 1,
        borderColor: colors.error,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.xxl,
    },
    resetButtonText: {
        fontSize: typography.sizes.sm,
        color: colors.error,
        fontWeight: typography.weights.medium,
    },
    appIcon: {
        width: 80,
        height: 80,
        borderRadius: 20,
        marginBottom: spacing.md,
    },
    creditsSection: {
        marginTop: spacing.lg,
        alignItems: 'center',
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutral[100],
    },
    creditsLabel: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[400],
    },
    creditsDeveloper: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[800],
        marginTop: spacing.xs,
    },
    creditsYear: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[400],
        marginTop: spacing.sm,
    },
    githubLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: spacing.xs,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        backgroundColor: colors.neutral[100],
        borderRadius: borderRadius.full,
    },
    githubText: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[600],
    },
});
