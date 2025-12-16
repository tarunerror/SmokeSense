// Security utilities for SmokeSense
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'smokesense_pin_hash';

// Simple hash function for PIN (in production, use bcrypt or similar)
export const hashPin = (pin: string): string => {
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
        const char = pin.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
};

export const savePin = async (pin: string): Promise<void> => {
    const hash = hashPin(pin);
    await SecureStore.setItemAsync(PIN_KEY, hash);
};

export const verifyPin = async (pin: string): Promise<boolean> => {
    const storedHash = await SecureStore.getItemAsync(PIN_KEY);
    if (!storedHash) return false;
    const inputHash = hashPin(pin);
    return storedHash === inputHash;
};

export const removePin = async (): Promise<void> => {
    await SecureStore.deleteItemAsync(PIN_KEY);
};

export const hasPin = async (): Promise<boolean> => {
    const storedHash = await SecureStore.getItemAsync(PIN_KEY);
    return !!storedHash;
};
