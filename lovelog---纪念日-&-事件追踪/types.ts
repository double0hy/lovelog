export type ThemeColor = 'rose' | 'sky' | 'violet' | 'amber' | 'emerald' | 'slate';

export interface MemoryEvent {
  id: string;
  title: string;
  date: string; // ISO Date String
  image?: string; // Base64 Data URL
  description?: string;
  isRecurring: boolean; // True for birthdays/anniversaries, False for one-time events
  theme: ThemeColor;
}

export interface DateCalculations {
  daysSince: number;
  daysUntilNext: number;
  yearsCount: number;
  nextDate: Date;
  isFuture: boolean;
}