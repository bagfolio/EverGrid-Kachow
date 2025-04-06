import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { File, FileText } from 'lucide-react';
import { useFacility } from '@/lib/facility-context';
import { useToast } from '@/hooks/use-toast';

interface ReportSection {
  id: string;
  title: string;
  description: string;
  selected: boolean;
}

export function ReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState<ReportSection[]>([
    {
      id: 'facility-info',
      title: 'Facility Information',
      description: 'Basic facility details, location, and contact information',
      selected: true
    },
    {
      id: 'compliance-status',
      title: 'Compliance Status',
      description: 'Current progress towards AB 2511 compliance requirements',
      selected: true
    },
    {
      id: 'load-assessment',
      title: 'Load Assessment',
      description: 'Critical load analysis and backup power requirements',
      selected: true
    },
    {
      id: 'financial-analysis',
      title: 'Financial Analysis',
      description: 'Cost comparison and ROI calculations for backup options',
      selected: true
    },
    {
      id: 'implementation-plan',
      title: 'Implementation Plan',
      description: 'Timeline and steps for system installation',
      selected: true
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Analysis of outage risks and mitigations',
      selected: false
    },
    {
      id: 'regulatory-docs',
      title: 'Regulatory Documentation',
      description: 'Required forms and certifications for compliance',
      selected: false
    }
  ]);
  
  const { selectedFacility } = useFacility();
  const { toast } = useToast();

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, selected: !section.selected } : section
    ));
  };

  const handleGenerateReport = () => {
    if (!selectedFacility) {
      toast({
        title: "No facility selected",
        description: "Please select a facility before generating a report.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const selectedSections = sections.filter(s => s.selected);
    if (selectedSections.length === 0) {
      toast({
        title: "No sections selected",
        description: "Please select at least one section to include in the report.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      
      toast({
        title: "Report Generated",
        description: `Report for ${selectedFacility.facility_name} has been created successfully.`,
        duration: 3000,
      });
    }, 2000);
  };

  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-800">Compliance Report Generator</h2>
        <p className="text-gray-500">
          Create customized reports for your facility
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Selected Facility:</h3>
            <p className="mt-1 text-gray-800 font-medium">
              {selectedFacility?.facility_name || 'No facility selected'}
            </p>
            {selectedFacility && (
              <p className="text-sm text-gray-500">
                {selectedFacility.address}, {selectedFacility.city}, CA {selectedFacility.zip}
              </p>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Report Sections to Include:</h3>
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="flex items-start">
                  <div className="flex h-5 items-center">
                    <Checkbox
                      id={section.id}
                      checked={section.selected}
                      onCheckedChange={() => toggleSection(section.id)}
                    />
                  </div>
                  <div className="ml-3">
                    <Label
                      htmlFor={section.id}
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      {section.title}
                    </Label>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Report Format:</h3>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="pdf-format"
                  name="report-format"
                  value="pdf"
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  defaultChecked
                />
                <label htmlFor="pdf-format" className="ml-2 flex items-center text-sm text-gray-700">
                  <File className="h-5 w-5 text-red-500 mr-1" />
                  PDF
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="docx-format"
                  name="report-format"
                  value="docx"
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="docx-format" className="ml-2 flex items-center text-sm text-gray-700">
                  <FileText className="h-5 w-5 text-blue-500 mr-1" />
                  DOCX
                </label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4">
        <Button 
          onClick={handleGenerateReport}
          disabled={isGenerating || !selectedFacility}
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>
      </CardFooter>
    </Card>
  );
}
