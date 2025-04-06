import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { processCSVFile } from '@/lib/csv-parser';
import { useFacility } from '@/lib/facility-context';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export function CSVUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addFacilities, updateProgress } = useFacility();
  const { toast } = useToast();

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 50);
    return interval;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setUploadStatus('idle');
    
    const progressInterval = simulateProgress();

    try {
      const facilities = await processCSVFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        addFacilities(facilities);
        updateProgress('profile', true);
        
        setIsUploading(false);
        setUploadStatus('success');
        
        toast({
          title: "Facilities uploaded",
          description: `Successfully uploaded ${facilities.length} facilities.`,
          duration: 3000,
        });
      }, 500);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsUploading(false);
      setUploadStatus('error');
      
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
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-800">Upload Facility Data</h2>
        <p className="text-gray-500">
          Upload your SNF facility data CSV to get started with your assessment.
        </p>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
          
          {uploadStatus === 'idle' && !fileName && (
            <div>
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag and drop your CSV file here, or click to browse</p>
              <p className="text-gray-500 text-sm">Supports facility data in CSV format</p>
            </div>
          )}
          
          {(fileName || isUploading || uploadStatus !== 'idle') && (
            <div>
              {uploadStatus === 'success' ? (
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              ) : uploadStatus === 'error' ? (
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              ) : (
                <File className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              )}
              
              <p className="text-gray-700 font-medium mb-2">
                {fileName || 'Uploading file...'}
              </p>
              
              {isUploading && (
                <div className="w-full max-w-xs mx-auto mt-4">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-gray-500 mt-2">
                    Processing... {uploadProgress}%
                  </p>
                </div>
              )}
              
              {uploadStatus === 'success' && (
                <p className="text-green-600 text-sm mt-2">
                  File successfully uploaded and processed!
                </p>
              )}
              
              {uploadStatus === 'error' && (
                <p className="text-red-600 text-sm mt-2">
                  Error processing file. Please check the format and try again.
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center bg-gray-50 px-6 py-4">
        <Button 
          disabled={isUploading}
          onClick={handleUploadClick}
          className="inline-flex items-center"
        >
          <Upload className="mr-2 h-5 w-5" />
          {isUploading ? 'Uploading...' : 'Select CSV File'}
        </Button>
      </CardFooter>
    </Card>
  );
}
