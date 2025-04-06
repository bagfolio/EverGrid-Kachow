import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useFacility } from '@/lib/facility-context';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, isBefore, isAfter, addMonths } from 'date-fns';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  responsible: 'facility' | 'mobile-lightning';
  duration: number; // in days
  startDate: Date | null;
  status: 'not-started' | 'in-progress' | 'completed';
  dependencies: string[];
}

export function Timeline() {
  const today = new Date();
  const defaultStart = addDays(today, 14); // Start two weeks from today
  
  const [steps, setSteps] = useState<TimelineStep[]>([
    {
      id: 'site-assessment',
      title: 'Site Assessment',
      description: 'Detailed evaluation of facility power infrastructure',
      responsible: 'mobile-lightning',
      duration: 5,
      startDate: defaultStart,
      status: 'not-started',
      dependencies: []
    },
    {
      id: 'requirements',
      title: 'Requirements Gathering',
      description: 'Document specific power needs and critical systems',
      responsible: 'facility',
      duration: 10,
      startDate: addDays(defaultStart, 5),
      status: 'not-started',
      dependencies: ['site-assessment']
    },
    {
      id: 'design',
      title: 'System Design',
      description: 'Engineering and design of backup power solution',
      responsible: 'mobile-lightning',
      duration: 15,
      startDate: addDays(defaultStart, 15),
      status: 'not-started',
      dependencies: ['requirements']
    },
    {
      id: 'permits',
      title: 'Permitting',
      description: 'Obtain necessary permits and approvals',
      responsible: 'mobile-lightning',
      duration: 20,
      startDate: addDays(defaultStart, 30),
      status: 'not-started',
      dependencies: ['design']
    },
    {
      id: 'site-prep',
      title: 'Site Preparation',
      description: 'Prepare installation location and infrastructure',
      responsible: 'facility',
      duration: 10,
      startDate: addDays(defaultStart, 50),
      status: 'not-started',
      dependencies: ['permits']
    },
    {
      id: 'installation',
      title: 'System Installation',
      description: 'Physical installation of battery system',
      responsible: 'mobile-lightning',
      duration: 5,
      startDate: addDays(defaultStart, 60),
      status: 'not-started',
      dependencies: ['site-prep']
    },
    {
      id: 'testing',
      title: 'Testing & Commissioning',
      description: 'Verify system functionality and performance',
      responsible: 'mobile-lightning',
      duration: 3,
      startDate: addDays(defaultStart, 65),
      status: 'not-started',
      dependencies: ['installation']
    },
    {
      id: 'training',
      title: 'Staff Training',
      description: 'Train facility staff on system operation',
      responsible: 'mobile-lightning',
      duration: 2,
      startDate: addDays(defaultStart, 68),
      status: 'not-started',
      dependencies: ['testing']
    },
    {
      id: 'documentation',
      title: 'Final Documentation',
      description: 'Complete all compliance documentation',
      responsible: 'mobile-lightning',
      duration: 5,
      startDate: addDays(defaultStart, 70),
      status: 'not-started',
      dependencies: ['training']
    }
  ]);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedStep, setSelectedStep] = useState<TimelineStep | null>(null);
  
  const { updateProgress } = useFacility();
  const { toast } = useToast();

  const calculateEndDate = (step: TimelineStep) => {
    if (!step.startDate) return null;
    return addDays(step.startDate, step.duration);
  };

  const handleStepStatusChange = (stepId: string, status: TimelineStep['status']) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const handleDateSelect = (step: TimelineStep, date?: Date) => {
    if (!date) return;
    
    setSteps(prev => prev.map(s => {
      if (s.id === step.id) {
        return { ...s, startDate: date };
      }
      return s;
    }));
    
    setSelectedStep(null);
  };

  const handleSaveTimeline = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const isFullyComplete = completedSteps === steps.length;
    
    updateProgress('deployment', isFullyComplete);
    
    toast({
      title: "Deployment Timeline Saved",
      description: isFullyComplete 
        ? "All deployment steps have been completed!" 
        : `${completedSteps} of ${steps.length} steps completed.`,
      duration: 3000,
    });
  };

  const getStatusColor = (status: TimelineStep['status']) => {
    switch (status) {
      case 'not-started': return 'bg-gray-200 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
    }
  };

  const getResponsibleColor = (responsible: TimelineStep['responsible']) => {
    return responsible === 'facility' 
      ? 'text-purple-600 border-purple-200 bg-purple-50' 
      : 'text-indigo-600 border-indigo-200 bg-indigo-50';
  };

  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-800">Deployment Timeline</h2>
        <p className="text-gray-500">
          Plan and track your microgrid installation process
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              {steps.map((step, index) => (
                <div key={step.id} className="mb-8 ml-4">
                  <div className="absolute w-0.5 h-full bg-gray-200 left-0 top-0 -ml-0.5"></div>
                  
                  <div className="flex items-start">
                    <div className={`absolute left-0 -ml-3.5 mt-1.5 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center ${getStatusColor(step.status)}`}>
                      {index + 1}
                    </div>
                    
                    <div className="ml-6">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-800">{step.title}</h3>
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded ${getStatusColor(step.status)}`}>
                          {step.status.replace('-', ' ')}
                        </span>
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded border ${getResponsibleColor(step.responsible)}`}>
                          {step.responsible === 'facility' ? 'Facility Team' : 'Mobile Lightning'}
                        </span>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                      
                      <div className="mt-2 flex items-center">
                        <span className="text-sm text-gray-500">
                          {step.startDate 
                            ? `${format(step.startDate, 'MMM d, yyyy')} to ${format(calculateEndDate(step)!, 'MMM d, yyyy')} (${step.duration} days)`
                            : 'No dates set'}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedStep(step)}
                        >
                          Change Date
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStepStatusChange(step.id, 'not-started')}
                          className={step.status === 'not-started' ? 'bg-gray-100' : ''}
                        >
                          Not Started
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStepStatusChange(step.id, 'in-progress')}
                          className={step.status === 'in-progress' ? 'bg-blue-100' : ''}
                        >
                          In Progress
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStepStatusChange(step.id, 'completed')}
                          className={step.status === 'completed' ? 'bg-green-100' : ''}
                        >
                          Completed
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {selectedStep && (
            <div className="lg:w-80">
              <div className="sticky top-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">Select Start Date for "{selectedStep.title}"</h3>
                  <Calendar
                    mode="single"
                    selected={selectedStep.startDate || undefined}
                    onSelect={(date) => handleDateSelect(selectedStep, date)}
                    initialFocus
                  />
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => setSelectedStep(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4">
        <Button onClick={handleSaveTimeline}>
          Save Deployment Timeline
        </Button>
      </CardFooter>
    </Card>
  );
}
