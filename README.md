# 🍃 SmokeSense

A privacy-focused smoking awareness and reduction app built with React Native and Expo.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

## ✨ Features

### Core Features
- **One-Tap Logging** - Quick cigarette logging with haptic feedback
- **Mood & Activity Tracking** - Log how you feel and what you're doing
- **Budget Meter** - Visual daily limit tracker with progress ring
- **Real-time Timer** - Shows time since last cigarette

### Smart Reduction
- **Delay Timer** - Mindful pause before logging with breathing exercises
- **Personalized Insights** - AI-powered pattern recognition
- **Trend Analysis** - Weekly/monthly analytics and charts
- **Trigger Identification** - Understand your smoking patterns

### Financial Tracking
- **Cost Calculator** - Track daily, weekly, monthly spending
- **Yearly Projections** - See long-term cost impact
- **Savings Potential** - Motivational savings goals
- **Multi-currency Support** - USD, EUR, GBP, INR, JPY, PHP

### Privacy & Security
- **PIN Protection** - Lock app with 4-digit PIN
- **Disguise Mode** - Hide app identity
- **Neutral Notifications** - Non-revealing notification content
- **Local Storage** - All data stays on your device

## 📱 Screenshots

| Home | Budget | Insights | Settings |
|------|--------|----------|----------|
| Log cigarettes | Track spending | View analytics | Customize app |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app (for mobile testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/tarunerror/smokesense.git

# Navigate to project
cd smokesense

# Install dependencies
npm install

# Start development server
npx expo start
```

### Running on Device
1. Install **Expo Go** on your phone
2. Scan the QR code from terminal
3. App loads automatically!

## 🛠️ Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Database**: Expo SQLite
- **Styling**: React Native StyleSheet
- **Icons**: @expo/vector-icons (Ionicons)
- **Charts**: React Native SVG

## 📁 Project Structure

```
smokesense/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── insights.tsx   # Analytics screen
│   │   ├── budget.tsx     # Budget tracking
│   │   └── settings.tsx   # Settings screen
│   ├── _layout.tsx        # Root layout
│   └── lock.tsx           # PIN lock screen
├── src/
│   ├── components/        # Reusable UI components
│   ├── database/          # SQLite database utilities
│   ├── store/             # Zustand state management
│   ├── theme/             # Colors, typography, spacing
│   ├── types/             # TypeScript types
│   └── utils/             # Helper functions
└── assets/                # Images and icons
```

## 🎨 Design System

### Colors
- **Primary**: Teal (#14B8A6)
- **Secondary**: Orange (#F97316)
- **Background**: Light gray (#F8FAFC)

### Typography
- Responsive font scaling for all device sizes
- System fonts for optimal performance

## 📝 Configuration

Update settings in `app.json`:

```json
{
  "expo": {
    "name": "SmokeSense",
    "slug": "smokeSense",
    "version": "1.0.0"
  }
}
```

## 🔨 Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure build
eas build:configure

# Build Android APK
eas build -p android --profile preview

# Build iOS
eas build -p ios --profile preview
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Tarun Gautam**

- GitHub: [@tarunerror](https://github.com/tarunerror/)

---

<p align="center">
  <b>Awareness • Control • Reduction</b>
</p>
