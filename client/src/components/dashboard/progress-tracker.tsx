import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useFacility } from '@/lib/facility-context';
import { useLocation } from 'wouter';
import { 
  Check, 
  ClipboardList, 
  BarChart3, 
  CalendarDays, 
  UserCircle2, 
  ChevronRight, 
  HelpCircle,
  ClipboardCheck
} from 'lucide-react';

export function ProgressTracker() {
  const { progress } = useFacility();
  const [, navigate] = useLocation();
  
  // Calculate overall progress percentage
  const progressItems = Object.values(progress);
  const completedItems = progressItems.filter(Boolean).length;
  const progressPercentage = Math.round((completedItems / progressItems.length) * 100);
  
  // Define progress steps with icons
  const steps = [
    { 
      id: 'profile', 
      label: 'Profile', 
      complete: progress.profile,
      description: 'Facility information, contact details, location, etc.',
      icon: UserCircle2,
      path: '/role-select'
    },
    { 
      id: 'assessment', 
      label: 'Assessment', 
      complete: progress.assessment,
      description: 'Energy usage, outage history, backup requirements',
      icon: ClipboardList,
      path: '/assessment'
    },
    { 
      id: 'financial', 
      label: 'Financial', 
      complete: progress.financial,
      description: 'Cost analysis, ROI calculator, financing options',
      icon: BarChart3,
      path: '/financial'
    },
    { 
      id: 'deployment', 
      label: 'Deployment', 
      complete: progress.deployment,
      description: 'Implementation timeline, equipment selection, installation plan',
      icon: CalendarDays,
      path: '/deployment'
    },
    { 
      id: 'compliance', 
      label: 'Compliance', 
      complete: progress.compliance,
      description: 'AB 2511 regulatory documentation and compliance requirements',
      icon: ClipboardCheck,
      path: '/compliance'
    }
  ];

  const getNextStep = () => {
    const nextStepIndex = steps.findIndex(step => !step.complete);
    return nextStepIndex !== -1 ? steps[nextStepIndex] : null;
  };

  const nextStep = getNextStep();

  return (
    <Card className="bg-white shadow-md overflow-hidden border-muted">
      <CardHeader className="pb-3 border-b border-muted/30">
        <CardTitle className="text-lg flex items-center">
          <span className="bg-primary/10 p-1.5 rounded-md mr-2">
            <Check className="h-4 w-4 text-primary" />
          </span>
          Your Compliance Journey
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>AB 2511 requires all skilled nursing facilities to have battery backup systems by January 1, 2026. Track your progress here.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <div className="text-primary font-medium">{progressPercentage}% Complete</div>
            <div className="text-muted-foreground">
              {completedItems}/{progressItems.length} Steps
            </div>
          </div>
          <div className="w-full bg-muted/50 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-primary/80 to-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Step List */}
        <div className="space-y-3 mb-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = !step.complete && (!steps[index-1] || steps[index-1].complete);
            return (
              <div 
                key={step.id} 
                className={cn(
                  "flex items-center p-2 rounded-lg transition-colors",
                  step.complete ? "bg-primary/5" : isActive ? "bg-muted/50" : "hover:bg-muted/30"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center mr-3",
                  step.complete ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {step.complete ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{step.label}</div>
                    <Badge 
                      variant={step.complete ? "default" : "outline"} 
                      className={cn(
                        step.complete ? "bg-green-100 text-green-800 hover:bg-green-200" : 
                                      isActive ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""
                      )}
                    >
                      {step.complete ? "Completed" : isActive ? "Active" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Next Action Button */}
        {nextStep && (
          <Button 
            className="w-full mt-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
            onClick={() => navigate(nextStep.path)}
          >
            Continue with {nextStep.label}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        
        {!nextStep && (
          <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-center">
            <p className="text-green-800 font-medium">
              Congratulations! You've completed all the required steps.
            </p>
            <p className="text-green-700 text-sm mt-1">
              Your facility is well-prepared for AB 2511 compliance!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
