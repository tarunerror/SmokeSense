// Lock Screen
import React from 'react';
import { useAppStore } from '../src/store/useAppStore';
import { PinLock } from '../src/components/PinLock';
import { router } from 'expo-router';

export default function LockScreen() {
    const { unlock, settings } = useAppStore();

    const handleUnlock = () => {
        unlock();
        router.replace('/(tabs)');
    };

    const appName = settings.privacy.disguiseMode
        ? settings.privacy.disguiseName
        : 'SmokeSense';

    return <PinLock onUnlock={handleUnlock} appName={appName} />;
}
