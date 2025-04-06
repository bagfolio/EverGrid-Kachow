export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const calculateCountdown = (targetDate: Date): CountdownValues => {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  // Convert time difference to days, hours, minutes, seconds
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
};

export const formatCountdown = (countdown: CountdownValues): string => {
  const { days, hours, minutes, seconds } = countdown;
  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
};

// AB 2511 compliance deadline - January 1, 2026
export const AB2511Deadline = new Date('2026-01-01T00:00:00');
