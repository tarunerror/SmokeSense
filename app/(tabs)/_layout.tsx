// Tab Navigation Layout
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary[500],
                tabBarInactiveTintColor: colors.neutral[400],
                tabBarStyle: {
                    backgroundColor: colors.background.primary,
                    borderTopColor: colors.neutral[100],
                    paddingTop: 8,
                    paddingBottom: 8,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="insights"
                options={{
                    title: 'Insights',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="analytics" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="budget"
                options={{
                    title: 'Budget',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
