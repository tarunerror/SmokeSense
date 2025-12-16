import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const KEY_PREFIX = 'app';

export const secureKeys = {
  dbKey: `${KEY_PREFIX}:db:key`,
} as const;

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function getOrCreateDbKey() {
  const existing = await SecureStore.getItemAsync(secureKeys.dbKey);
  if (existing) return existing;

  const bytes = await Crypto.getRandomBytesAsync(32);
  const key = bytesToHex(bytes);

  await SecureStore.setItemAsync(secureKeys.dbKey, key, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });

  return key;
}
