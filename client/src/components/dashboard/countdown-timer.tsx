import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculateCountdown, AB2511Deadline } from '@/lib/countdown';
import { useLocation } from 'wouter';
import { Clock, AlertTriangle, Calendar, ChevronRight } from 'lucide-react';

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

  const [, navigate] = useLocation();
  
  // Determine urgency level
  const getUrgencyLevel = () => {
    if (countdown.days < 30) return 'critical';
    if (countdown.days < 180) return 'high';
    if (countdown.days < 365) return 'medium';
    return 'low';
  };
  
  const urgency = getUrgencyLevel();
  
  // CSS animation class for critical urgency
  const [pulseClass, setPulseClass] = useState('');
  
  useEffect(() => {
    // Apply animation class only if urgency is critical
    setPulseClass(urgency === 'critical' ? 'animate-pulse' : '');
  }, [urgency]);

  return (
    <div className={pulseClass}>
      <Card className="w-full bg-white shadow-md overflow-hidden border-muted">
        <CardHeader className="pb-3 border-b border-muted/30">
          <CardTitle className="text-lg flex items-center">
            <span className="bg-primary/10 p-1.5 rounded-md mr-2">
              <Clock className="h-4 w-4 text-primary" />
            </span>
            AB 2511 Compliance Deadline
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row">
            <div className="flex-grow">
              <div className="flex justify-center sm:justify-start space-x-4 sm:space-x-6">
                {/* Day Counter */}
                <div className="flex flex-col items-center">
                  <div className="bg-muted/40 rounded-lg w-16 h-16 flex items-center justify-center">
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      {countdown.days}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground mt-1">Days</span>
                </div>
                
                {/* Hour Counter */}
                <div className="flex flex-col items-center">
                  <div className="bg-muted/40 rounded-lg w-16 h-16 flex items-center justify-center">
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      {countdown.hours}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground mt-1">Hours</span>
                </div>
                
                {/* Minute Counter */}
                <div className="flex flex-col items-center">
                  <div className="bg-muted/40 rounded-lg w-16 h-16 flex items-center justify-center">
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      {countdown.minutes}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground mt-1">Minutes</span>
                </div>
              </div>
              
              <div className="mt-5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">Target Date: January 1, 2026</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  California Assembly Bill 2511 requires all skilled nursing facilities to implement battery backup power systems to maintain essential services during power outages.
                </p>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-0 sm:ml-6 sm:w-64 flex flex-col justify-center">
              <div className={`
                p-3 rounded-lg mb-3 flex items-start
                ${urgency === 'critical' ? 'bg-red-50 text-red-800' : 
                  urgency === 'high' ? 'bg-amber-50 text-amber-800' :
                  urgency === 'medium' ? 'bg-yellow-50 text-yellow-800' : 
                  'bg-green-50 text-green-800'}
              `}>
                <AlertTriangle className={`
                  h-5 w-5 mr-2 mt-0.5 flex-shrink-0
                  ${urgency === 'critical' ? 'text-red-600' : 
                    urgency === 'high' ? 'text-amber-600' :
                    urgency === 'medium' ? 'text-yellow-600' : 
                    'text-green-600'}
                `} />
                <div>
                  <p className="font-medium text-sm">
                    {urgency === 'critical' ? 'Critical: Immediate action required' : 
                     urgency === 'high' ? 'High Priority: Quick action needed' :
                     urgency === 'medium' ? 'Medium Priority: Planning recommended' : 
                     'Low Priority: Planning time available'}
                  </p>
                  <p className="text-xs mt-1">
                    {urgency === 'critical' ? 'You have less than 30 days to comply!' : 
                     urgency === 'high' ? 'Less than 6 months remaining' :
                     urgency === 'medium' ? 'Less than 1 year remaining' : 
                     'You still have time, but start planning now'}
                  </p>
                </div>
              </div>
              
              <Button 
                className="mt-2 w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                onClick={() => navigate('/resources')}
              >
                Learn About Compliance
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
