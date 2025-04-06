import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { calculateCountdown, AB2511Deadline } from '@/lib/countdown';

export function CountdownTimer() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Update countdown on initial render
    setCountdown(calculateCountdown(AB2511Deadline));

    // Update countdown every second
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(AB2511Deadline));
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full bg-white rounded-lg shadow overflow-hidden">
      <CardContent className="px-4 py-5 sm:p-6 text-center">
        <h2 className="text-lg leading-6 font-medium text-gray-800">
          Countdown to AB 2511 Compliance Deadline
        </h2>
        <div className="mt-3 flex justify-center space-x-2 sm:space-x-6">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-primary-600">{countdown.days}</span>
            <span className="text-sm text-gray-500">Days</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-primary-600">{countdown.hours}</span>
            <span className="text-sm text-gray-500">Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-primary-600">{countdown.minutes}</span>
            <span className="text-sm text-gray-500">Minutes</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-500">
          California AB 2511 requires all Skilled Nursing Facilities to have backup power systems by January 1, 2026
        </p>
      </CardContent>
    </Card>
  );
}
