# SmokeSense - Cigarette Tracking & Budget App

SmokeSense is a mobile application built with React Native and Expo that helps users track their cigarette consumption and set daily budgets to reduce smoking habits.

## Features

### Core Logging

- **Quick Log**: One-tap cigarette logging with automatic timestamping
- **Detailed Log**: Optional detailed logging with:
  - Mood tracking
  - Activity context
  - Location capture (with user permission)
  - Free-form notes (up to 1000 characters)
  - Trigger tags (stress, habit, social pressure, etc.)

### Budget Management

- **Daily Budget Settings**: Set a daily cigarette limit
- **Visual Progress Meter**: 
  - Linear bar display showing progress toward daily limit
  - Color-coded indicators (green, yellow, orange, red)
  - Percentage and remaining count display
- **Secure Storage**: Budget settings stored securely on device using Expo SecureStore

### Offline Support

- **Local Database**: All cigarette logs stored in SQLite database
- **Sync Queue**: Unsynced logs queued for later synchronization
- **Optimistic Updates**: Immediate UI updates with background sync
- **Auto-sync**: Periodic synchronization when online (configurable)

### Data Models

#### CigaretteLog
```typescript
{
  id: string;
  timestamp: number;
  mood?: string;
  activity?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  notes?: string;
  triggerTags?: string[];
  synced: boolean;
  createdAt: number;
  updatedAt: number;
}
```

#### Budget
```typescript
{
  dailyLimit: number;
  createdAt: number;
  updatedAt: number;
}
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/tarunerror/SmokeSense.git
cd SmokeSense
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
```bash
npm run ios     # For iOS
npm run android # For Android
```

## Project Structure

```
SmokeSense/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout with database initialization
│   ├── index.tsx                # Home screen with quick log & budget
│   ├── log-detail.tsx           # Detailed logging screen
│   └── budget-settings.tsx      # Budget configuration screen
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── BudgetMeter.tsx     # Visual budget progress meter
│   │   └── QuickLogButton.tsx  # One-tap log button
│   ├── services/                # Business logic services
│   │   ├── database.ts         # SQLite persistence layer
│   │   ├── cigaretteLog.ts     # Log CRUD operations
│   │   ├── budget.ts           # Budget management
│   │   ├── sync.ts             # Offline sync queue
│   │   └── location.ts         # Location services
│   ├── types/
│   │   └── models.ts           # TypeScript type definitions
│   └── services/__tests__/     # Unit tests
│       ├── cigaretteLog.test.ts
│       ├── budget.test.ts
│       └── sync.test.ts
├── package.json
├── tsconfig.json
├── app.json                     # Expo configuration
└── jest.config.js               # Jest testing configuration
```

## Usage Guide

### Setting Up Your Budget

1. Open SmokeSense
2. Tap "Set Budget" or navigate to Settings
3. Enter your desired daily cigarette limit
4. Use quick-set buttons (5, 10, 15, 20) or enter a custom value
5. Tap "Set Budget" to save

Your budget is stored securely on your device and will reset at midnight each day.

### Logging a Cigarette

#### Quick Log (One-Tap)
1. Tap the large red circular button on the home screen
2. The cigarette is logged immediately with the current timestamp

#### Detailed Log
1. Tap "+ Add Details" below the quick log button
2. Optionally select:
   - Your current mood
   - What you were doing
   - Trigger tags that led to smoking
   - Add your location (requires permission)
   - Write additional notes
3. Tap "Save Log"

### Viewing Your Progress

The home screen displays:
- **Budget Meter**: Visual representation of today's progress
- **Today's Logs**: List of all cigarettes logged today with details
- **Statistics**: Current count, remaining allowance, and percentage

### Data Security

- All logs are stored locally in an encrypted SQLite database
- Budget settings are stored in Expo SecureStore (encrypted)
- Location data is only captured with explicit user permission
- No data is shared without your consent

### Offline Operation

SmokeSense works completely offline:
- All logs are saved locally first
- When you configure sync (optional), logs are queued for upload
- Sync happens automatically in the background when online
- You can view your sync status in the app

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

## Accessibility

SmokeSense is built with accessibility in mind:
- All interactive elements have proper accessibility labels
- Screen reader support for key actions
- Voice announcements for log success/failure
- Semantic roles for buttons, checkboxes, and progress indicators
- High contrast color schemes
- Touch target sizes meet accessibility guidelines

## API Integration (Optional)

To enable cloud sync, configure the sync service:

```typescript
import { syncService } from './src/services/sync';

syncService.configure({
  apiEndpoint: 'https://your-api.com',
  apiKey: 'your-api-key'
});
```

### Expected API Endpoints

#### POST /logs
Create or update a cigarette log.

**Request Body:**
```json
{
  "id": "string",
  "timestamp": 1234567890,
  "mood": "stressed",
  "activity": "work",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "address": "San Francisco, CA"
  },
  "notes": "After stressful meeting",
  "triggerTags": ["stress", "work"],
  "synced": false,
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

**Response:**
```json
{
  "success": true,
  "id": "string"
}
```

## Data Validation

The app includes comprehensive validation:
- Log IDs must be unique and non-empty
- Timestamps cannot be in the future
- Location coordinates must be valid (latitude: -90 to 90, longitude: -180 to 180)
- Notes limited to 1000 characters
- Budget must be positive integer

## Performance Considerations

- Database queries are optimized with indexes on timestamp and synced fields
- Lazy loading for log lists
- Optimistic UI updates for immediate feedback
- Background sync to avoid blocking UI

## Privacy & Permissions

### Required Permissions

- **Location (Optional)**: For tracking where cigarettes are smoked
  - iOS: NSLocationWhenInUseUsageDescription
  - Android: ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION

### Data Storage

All data is stored locally on the device:
- SQLite database: `smokesense.db`
- Secure Store: Budget settings
- AsyncStorage: Sync metadata

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## License

ISC

## Support

For issues or questions, please open an issue on GitHub.

## Roadmap

Future features planned:
- Weekly and monthly statistics
- Charts and visualizations
- Export data to CSV
- Streak tracking
- Push notifications for budget warnings
- Social features (optional)
- Integration with health apps

## Changelog

### Version 1.0.0
- Initial release
- Quick and detailed cigarette logging
- Daily budget management
- Offline support with sync queue
- Location tracking
- Mood, activity, and trigger tracking
- Accessibility support
