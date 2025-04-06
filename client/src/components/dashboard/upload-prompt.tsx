import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';
import { processCSVFile } from '@/lib/csv-parser';
import { useFacility } from '@/lib/facility-context';
import { useToast } from '@/hooks/use-toast';

export function UploadPrompt() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addFacilities } = useFacility();
  const { toast } = useToast();

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const facilities = await processCSVFile(file);
      addFacilities(facilities);
      
      toast({
        title: "Facilities uploaded",
        description: `Successfully uploaded ${facilities.length} facilities.`,
        duration: 3000,
      });
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Error processing CSV file:", error);
      toast({
        title: "Upload Error",
        description: "Failed to process CSV file. Please check the file format.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-800">Need to add another facility?</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Upload your facility CSV file or manually add a new facility to the system.</p>
            </div>
          </div>
          <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button 
              onClick={handleUploadClick}
              className="inline-flex items-center"
            >
              <Upload className="-ml-1 mr-2 h-5 w-5" />
              Upload CSV
            </Button>
            <Button
              variant="outline"
              className="mt-3 sm:mt-0 sm:ml-3 text-gray-700"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Add Manually
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
