// Root Layout - SmokeSense App
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from '../src/store/useAppStore';
import { colors } from '../src/theme';

export default function RootLayout() {
    const { initialized, initialize, isLocked } = useAppStore();

    useEffect(() => {
        initialize();
    }, []);

    if (!initialized) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <StatusBar style="auto" />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: colors.background.primary },
                    }}
                >
                    {isLocked ? (
                        <Stack.Screen name="lock" options={{ headerShown: false }} />
                    ) : (
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    )}
                </Stack>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.primary,
    },
});
