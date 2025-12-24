import { 
  differenceInDays, 
  addYears, 
  isPast, 
  isFuture, 
  parseISO, 
  format, 
  setYear, 
  startOfDay,
  differenceInYears
} from 'date-fns';
import { DateCalculations } from '../types';

export const calculateDateDetails = (isoDate: string, isRecurring: boolean): DateCalculations => {
  const targetDate = parseISO(isoDate);
  const now = startOfDay(new Date());
  
  // Basic Future/Past check
  const isFutureEvent = isFuture(targetDate);
  
  let daysSince = 0;
  let daysUntilNext = 0;
  let yearsCount = 0;
  let nextDate = targetDate;

  if (isFutureEvent) {
    // Logic for a future one-time event (e.g., Concert)
    daysUntilNext = differenceInDays(targetDate, now);
    nextDate = targetDate;
  } else {
    // Logic for a past event (e.g., First Date)
    daysSince = differenceInDays(now, targetDate);
    yearsCount = differenceInYears(now, targetDate);

    if (isRecurring) {
      // Calculate next anniversary
      const currentYear = now.getFullYear();
      let nextAnniv = setYear(targetDate, currentYear);
      
      // If this year's anniversary has passed, go to next year
      if (isPast(nextAnniv) && differenceInDays(nextAnniv, now) < 0) {
        nextAnniv = addYears(nextAnniv, 1);
      }
      
      daysUntilNext = differenceInDays(nextAnniv, now);
      nextDate = nextAnniv;
    } else {
      // One time past event (e.g. "Graduated") - No "next" date
      daysUntilNext = 0;
    }
  }

  return {
    daysSince,
    daysUntilNext,
    yearsCount,
    nextDate,
    isFuture: isFutureEvent
  };
};

export const formatDateDisplay = (date: Date | string) => {
  return format(new Date(date), 'yyyy年MM月dd日');
};

// Image resize utility to prevent localStorage bloat
export const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        
        if (scaleSize >= 1) {
           // No resize needed
           resolve(event.target?.result as string);
           return;
        }

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL(file.type));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};