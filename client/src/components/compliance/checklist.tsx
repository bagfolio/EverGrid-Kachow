import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckIcon, XIcon, AlertCircle, Upload } from 'lucide-react';
import { useFacility } from '@/lib/facility-context';
import { useToast } from '@/hooks/use-toast';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: 'complete' | 'partial' | 'missing';
  requiresUpload: boolean;
}

export function Checklist() {
  // Get facility data to check if documents were uploaded
  const { selectedFacility, progress } = useFacility();
  
  // Determine initial checklist state based on facility data
  const initialChecklist: ChecklistItem[] = [
    {
      id: 'facility-profile',
      title: 'Facility Profile',
      description: 'Complete facility information including address, contact details, and bed count.',
      status: 'complete', // We assume this is always complete since they're viewing this page
      requiresUpload: false,
    },
    {
      id: 'load-assessment',
      title: 'Load Assessment',
      description: 'Identify critical loads that must be maintained during an outage.',
      status: progress?.assessment ? 'complete' : 'partial',
      requiresUpload: false,
    },
    {
      id: 'utility-bills',
      title: 'Utility Bills',
      description: 'Upload 12 months of utility bills to analyze energy usage patterns.',
      // If user skipped uploads or uploaded bills, mark as complete
      status: localStorage.getItem('utilityBillUploaded') === 'true' ? 'complete' : 'missing',
      requiresUpload: true,
    },
    {
      id: 'site-photos',
      title: 'Site Photographs',
      description: 'Upload photos of electrical equipment and potential battery installation areas.',
      // If user skipped uploads or uploaded photos, mark as complete
      status: (
        localStorage.getItem('meterPhotoUploaded') === 'true' || 
        localStorage.getItem('panelPhotoUploaded') === 'true' || 
        localStorage.getItem('areaPhotoUploaded') === 'true'
      ) ? 'complete' : 'missing',
      requiresUpload: true,
    },
    {
      id: 'backup-specs',
      title: 'Backup System Specifications',
      description: 'Document requirements for backup power system.',
      status: 'missing',
      requiresUpload: false,
    },
    {
      id: 'compliance-doc',
      title: 'AB 2511 Compliance Documentation',
      description: 'Generate required documentation for regulatory compliance.',
      status: 'missing',
      requiresUpload: false,
    },
  ];
  
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  
  const { updateProgress } = useFacility();
  const { toast } = useToast();

  const handleItemClick = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        // Toggle between missing and complete for simplicity
        const newStatus = item.status === 'missing' ? 'complete' : 
                         item.status === 'partial' ? 'complete' : 'missing';
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const handleSaveCompliance = () => {
    const completeItems = checklist.filter(item => item.status === 'complete').length;
    const isFullyComplete = completeItems === checklist.length;
    
    updateProgress('compliance', isFullyComplete);
    
    toast({
      title: isFullyComplete ? "Compliance Complete!" : "Progress Saved",
      description: isFullyComplete 
        ? "You've completed all compliance requirements." 
        : `${completeItems} of ${checklist.length} items completed.`,
      duration: 3000,
    });
  };

  const renderStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'complete':
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'missing':
        return <XIcon className="h-5 w-5 text-gray-300" />;
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-800">AB 2511 Compliance Checklist</h2>
        <p className="text-gray-500">
          Track your progress towards meeting California's backup power requirements for SNFs.
        </p>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-200">
          {checklist.map((item) => (
            <div key={item.id} className="py-4">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id={item.id}
                    checked={item.status === 'complete'}
                    onCheckedChange={() => handleItemClick(item.id)}
                  />
                </div>
                <div className="ml-3 flex-grow">
                  <Label
                    htmlFor={item.id}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {item.title}
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  {renderStatusIcon(item.status)}
                </div>
              </div>
              {item.requiresUpload && (
                <div className="mt-2 ml-8">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Upload className="h-3 w-3 mr-1" />
                    Upload Files
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4">
        <Button onClick={handleSaveCompliance}>
          Save Compliance Progress
        </Button>
      </CardFooter>
    </Card>
  );
}
