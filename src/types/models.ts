export interface CigaretteLog {
  id: string;
  timestamp: number;
  mood?: string;
  activity?: string;
  location?: Location;
  notes?: string;
  triggerTags?: string[];
  synced: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Mood {
  id: string;
  name: string;
  emoji?: string;
}

export interface Activity {
  id: string;
  name: string;
  icon?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface TriggerTag {
  id: string;
  name: string;
  color?: string;
}

export interface Budget {
  dailyLimit: number;
  createdAt: number;
  updatedAt: number;
}

export interface BudgetStatus {
  budget: Budget;
  todayCount: number;
  percentage: number;
  remaining: number;
}

export const DEFAULT_MOODS: Mood[] = [
  { id: 'happy', name: 'Happy', emoji: '😊' },
  { id: 'stressed', name: 'Stressed', emoji: '😰' },
  { id: 'anxious', name: 'Anxious', emoji: '😟' },
  { id: 'sad', name: 'Sad', emoji: '😢' },
  { id: 'bored', name: 'Bored', emoji: '😐' },
  { id: 'relaxed', name: 'Relaxed', emoji: '😌' },
  { id: 'angry', name: 'Angry', emoji: '😠' },
];

export const DEFAULT_ACTIVITIES: Activity[] = [
  { id: 'work', name: 'Working', icon: '💼' },
  { id: 'socializing', name: 'Socializing', icon: '👥' },
  { id: 'driving', name: 'Driving', icon: '🚗' },
  { id: 'drinking', name: 'Drinking', icon: '🍺' },
  { id: 'break', name: 'On Break', icon: '☕' },
  { id: 'walking', name: 'Walking', icon: '🚶' },
  { id: 'home', name: 'At Home', icon: '🏠' },
];

export const DEFAULT_TRIGGER_TAGS: TriggerTag[] = [
  { id: 'stress', name: 'Stress', color: '#FF6B6B' },
  { id: 'habit', name: 'Habit', color: '#4ECDC4' },
  { id: 'social', name: 'Social Pressure', color: '#95E1D3' },
  { id: 'craving', name: 'Craving', color: '#F38181' },
  { id: 'boredom', name: 'Boredom', color: '#AA96DA' },
  { id: 'alcohol', name: 'Alcohol', color: '#FCBAD3' },
];
