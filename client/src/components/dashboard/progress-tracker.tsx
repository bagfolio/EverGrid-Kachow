import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useFacility } from '@/lib/facility-context';
import { Check } from 'lucide-react';

export function ProgressTracker() {
  const { progress } = useFacility();
  
  // Calculate overall progress percentage
  const progressItems = Object.values(progress);
  const completedItems = progressItems.filter(Boolean).length;
  const progressPercentage = Math.round((completedItems / progressItems.length) * 100);
  
  // Define progress steps
  const steps = [
    { id: 'profile', label: 'Profile', complete: progress.profile },
    { id: 'assessment', label: 'Assessment', complete: progress.assessment },
    { id: 'financial', label: 'Financial', complete: progress.financial },
    { id: 'deployment', label: 'Deployment', complete: progress.deployment }
  ];

  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <CardContent className="px-4 py-5 sm:p-6">
        <h2 className="text-lg leading-6 font-medium text-gray-800">Your Compliance Journey</h2>
        <div className="mt-4">
          <div className="flex items-center justify-between relative">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary-500 h-2.5 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Progress dots */}
            <div className="absolute inset-0 flex items-center">
              <div className="flex justify-between w-full px-0">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div 
                      className={cn(
                        "h-6 w-6 rounded-full border-2 border-white flex items-center justify-center",
                        step.complete || (index === 0 && progressPercentage > 0) 
                          ? "bg-primary-500" 
                          : "bg-gray-300"
                      )}
                    >
                      {step.complete ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <div className="h-2 w-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span 
                      className={cn(
                        "mt-2 text-xs font-medium",
                        step.complete ? "text-gray-700" : "text-gray-500"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-sm">
          <p className="text-gray-500">
            {progressPercentage === 0 && "Start by completing your facility profile."}
            {progressPercentage > 0 && progressPercentage < 50 && "Complete your facility assessment to continue making progress. The next step will be financial analysis."}
            {progressPercentage >= 50 && progressPercentage < 75 && "Continue with your financial analysis to determine potential savings."}
            {progressPercentage >= 75 && progressPercentage < 100 && "Plan your deployment to meet the compliance deadline."}
            {progressPercentage === 100 && "Congratulations! You are ready for AB 2511 compliance."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
