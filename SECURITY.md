# Security & Privacy Documentation

## Data Storage

### Local Storage

All user data in SmokeSense is stored locally on the device using the following secure mechanisms:

#### 1. SQLite Database (Cigarette Logs)

- **Location**: Device's internal storage
- **Database Name**: `smokesense.db`
- **Access**: Private to the application
- **Encryption**: Leverages device-level encryption (iOS File Data Protection, Android File-Based Encryption)

**Data Stored:**
- Cigarette log entries with timestamps
- Mood and activity data
- Location coordinates (only if user grants permission)
- Notes and trigger tags
- Sync status

**Security Features:**
- Indexed queries for performance without exposing data
- No external access to database files
- Automatic cleanup on app uninstall

#### 2. Expo SecureStore (Budget Settings)

- **Storage Backend**: 
  - iOS: Keychain Services
  - Android: EncryptedSharedPreferences (backed by AES256-GCM)
- **Access**: Requires device authentication (biometric/PIN)
- **Encryption**: Hardware-backed encryption when available

**Data Stored:**
- Daily cigarette budget limit
- Budget creation/update timestamps

**Security Features:**
- Data is encrypted at rest
- Cannot be accessed without device unlock
- Backed up securely via iCloud Keychain (iOS) or Android Backup

#### 3. AsyncStorage (Sync Metadata)

- **Location**: Device's internal storage
- **Access**: Private to the application

**Data Stored:**
- Last sync timestamp
- Sync queue metadata (no actual log data)

## Permissions

### Location Permission

**When Requested:**
- Only when user taps "Add Location" in the detailed log screen
- Never requested automatically

**What We Access:**
- Current GPS coordinates (latitude, longitude)
- Reverse geocoded address (optional)

**What We Don't Access:**
- Continuous location tracking
- Location history
- Background location

**User Control:**
- Permission can be denied without affecting other features
- Permission can be revoked at any time in device settings
- Location data is never shared without explicit sync configuration

## Data Transmission (Optional Sync)

### Default Behavior

By default, SmokeSense operates **completely offline**:
- No network requests are made
- No data leaves the device
- No analytics or tracking

### Optional Cloud Sync

If you configure the sync service with API credentials:

```typescript
syncService.configure({
  apiEndpoint: 'https://your-api.com',
  apiKey: 'your-api-key'
});
```

**What Gets Synced:**
- Cigarette logs marked as "unsynced"
- All log data including mood, activity, location, notes

**Security Measures:**
- HTTPS/TLS encryption in transit
- API key authentication
- Logs are never deleted locally after sync (backup maintained)
- Sync failures are logged but don't lose data

**User Control:**
- Sync is opt-in only
- Can be disabled at any time
- Local data remains even if sync is disabled

## Third-Party Services

SmokeSense uses the following Expo modules:

1. **expo-sqlite**: Local database
   - No network access
   - No data collection

2. **expo-secure-store**: Encrypted key-value storage
   - No network access
   - No data collection

3. **expo-location**: GPS coordinates
   - Only accesses location when explicitly requested
   - No background tracking
   - No location sharing

4. **@react-native-async-storage/async-storage**: Local key-value storage
   - No network access
   - No data collection

## Data Retention

### Local Device

- Data is retained indefinitely until:
  - User manually deletes logs
  - App is uninstalled
  - User clears app data in device settings

### Cloud Sync (if configured)

- Retention policy depends on your configured API endpoint
- SmokeSense does not provide cloud storage by default
- You control your own data retention policies

## Privacy Best Practices

1. **Never share your device with others unlocked**
   - App data is accessible when device is unlocked
   - Use device lock screen for protection

2. **Review location permissions**
   - Only grant if you want location tracking
   - Location provides insights but is not required

3. **Secure backups**
   - Device backups may include app data
   - Ensure your cloud backup (iCloud/Google) is secured

4. **Optional sync**
   - Only configure sync if you trust the endpoint
   - Use HTTPS endpoints only
   - Keep API keys secure

## Data Export

Currently, SmokeSense does not include a built-in data export feature. The SQLite database can be accessed through device developer tools if needed.

**Future Feature:** CSV export for personal records

## Compliance

### GDPR (General Data Protection Regulation)

SmokeSense is designed with privacy by default:
- **Data Minimization**: Only collects data you explicitly provide
- **Right to Access**: All data stored locally and accessible
- **Right to Erasure**: Uninstall app or delete individual logs
- **Right to Portability**: Database is standard SQLite format
- **Consent**: Location permission requires explicit consent

### CCPA (California Consumer Privacy Act)

- No personal information is sold or shared
- No third-party tracking or advertising
- Users have full control over their data

### HIPAA

SmokeSense is **not HIPAA compliant**:
- Not designed for healthcare providers
- Not a medical device
- For personal use only

## Security Audits

This is an open-source project. Security contributions and audits are welcome:

1. Review code on GitHub
2. Report security issues privately
3. Submit pull requests for improvements

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** open a public GitHub issue
2. Email: [security contact]
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours.

## Updates

Security updates are released as needed:
- Critical updates: Immediate
- High priority: Within 7 days
- Medium priority: Next release
- Low priority: Scheduled releases

Enable automatic app updates to receive security patches.

## Disclaimers

1. SmokeSense is provided "as is" without warranty
2. Users are responsible for their own data security
3. Device-level security is the primary protection
4. Cloud sync is at your own risk
5. Not a substitute for professional medical advice

## Best Practices for Developers

If you're forking or contributing to this project:

1. Never log sensitive data to console in production
2. Always use parameterized SQL queries (already implemented)
3. Validate all user inputs (already implemented)
4. Keep dependencies updated for security patches
5. Use secure random IDs for logs (already implemented)
6. Never hardcode API keys or secrets

## Security Checklist

- [x] Local SQLite database for offline storage
- [x] Encrypted SecureStore for sensitive settings
- [x] Permission-based location access
- [x] No automatic network requests
- [x] No third-party analytics
- [x] No advertising SDKs
- [x] Input validation
- [x] SQL injection prevention
- [x] HTTPS requirement for optional sync
- [x] Open source for transparency

---

**Last Updated:** December 2024
**Version:** 1.0.0
