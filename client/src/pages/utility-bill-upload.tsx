import React, { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Upload, FileImage, CheckCircle, AlertCircle, Camera, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useFacility } from "@/lib/facility-context";

export default function UtilityBillUpload() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { updateProgress } = useFacility();
  
  // Bill upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Meter photo state
  const [meterPhotoUploaded, setMeterPhotoUploaded] = useState(false);
  const meterPhotoInputRef = React.useRef<HTMLInputElement>(null);
  
  // Panel photo state
  const [panelPhotoUploaded, setPanelPhotoUploaded] = useState(false);
  const panelPhotoInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleMeterPhotoClick = () => {
    if (meterPhotoInputRef.current) {
      meterPhotoInputRef.current.click();
    }
  };

  const handlePanelPhotoClick = () => {
    if (panelPhotoInputRef.current) {
      panelPhotoInputRef.current.click();
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
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus('success');
        
        toast({
          title: "Utility bill uploaded",
          description: "Your utility bill has been successfully uploaded.",
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
      
      console.error("Error processing file:", error);
      toast({
        title: "Upload Error",
        description: "Failed to process file. Please check the file format.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>, photoType: 'meter' | 'panel') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate processing
    toast({
      title: "Processing photo...",
      description: `Uploading ${photoType} photo...`,
      duration: 2000,
    });

    // Simulate success after delay
    setTimeout(() => {
      if (photoType === 'meter') {
        setMeterPhotoUploaded(true);
      } else {
        setPanelPhotoUploaded(true);
      }

      toast({
        title: "Photo uploaded",
        description: `Your ${photoType} photo has been successfully uploaded.`,
        duration: 3000,
      });
    }, 1500);
  };

  const handleContinue = () => {
    updateProgress('assessment', true);
    // Navigate to the assessment page
    setLocation("/assessment");
  };

  const handleSkip = () => {
    toast({
      title: "Skipping uploads",
      description: "You can upload these documents later from the Assessment page.",
      duration: 3000,
    });
    // Navigate to the assessment page
    setLocation("/assessment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-background to-secondary/10 flex flex-col items-center justify-center p-4">
      {/* Skip button for demo purposes */}
      <Button 
        className="absolute top-4 right-4 bg-white/80 hover:bg-white/90 text-primary shadow-sm" 
        size="sm"
        onClick={handleSkip}
      >
        Skip to Assessment
      </Button>
      
      <Card className="w-full max-w-3xl shadow-lg mb-6">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-2xl">Upload Utility Bill</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Upload your most recent utility bill to help us analyze your energy usage patterns
          </p>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />
            
            {uploadStatus === 'idle' && !fileName && (
              <div>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop your utility bill here, or click to browse</p>
                <p className="text-gray-500 text-sm">Supports PDF, JPG, JPEG, PNG formats</p>
              </div>
            )}
            
            {(fileName || isUploading || uploadStatus !== 'idle') && (
              <div>
                {uploadStatus === 'success' ? (
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                ) : uploadStatus === 'error' ? (
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                ) : (
                  <FileImage className="h-12 w-12 text-blue-500 mx-auto mb-4" />
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
                    Utility bill successfully uploaded and processed!
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
          
          <div className="mt-6">
            <Button 
              disabled={isUploading}
              onClick={handleUploadClick}
              className="inline-flex items-center"
            >
              <Upload className="mr-2 h-5 w-5" />
              {isUploading ? 'Uploading...' : 'Select Utility Bill'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full max-w-3xl shadow-lg mb-6">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-2xl">Upload Facility Photos</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Take pictures of your electrical panels and meters to help us understand your infrastructure
          </p>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Meter Photo Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                ref={meterPhotoInputRef}
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handlePhotoChange(e, 'meter')}
              />
              
              {!meterPhotoUploaded ? (
                <div>
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Electrical Meter Photo</p>
                  <Button 
                    variant="outline" 
                    onClick={handleMeterPhotoClick}
                    className="mt-4"
                  >
                    Upload Meter Photo
                  </Button>
                </div>
              ) : (
                <div>
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">
                    Meter Photo Uploaded
                  </p>
                  <p className="text-green-600 text-sm mt-2">
                    Photo successfully uploaded!
                  </p>
                </div>
              )}
            </div>
            
            {/* Panel Photo Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                ref={panelPhotoInputRef}
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handlePhotoChange(e, 'panel')}
              />
              
              {!panelPhotoUploaded ? (
                <div>
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Electrical Panel Photo</p>
                  <Button 
                    variant="outline" 
                    onClick={handlePanelPhotoClick}
                    className="mt-4"
                  >
                    Upload Panel Photo
                  </Button>
                </div>
              ) : (
                <div>
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">
                    Panel Photo Uploaded
                  </p>
                  <p className="text-green-600 text-sm mt-2">
                    Photo successfully uploaded!
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 p-4">
          <div className="w-full flex justify-end">
            <Button
              onClick={handleContinue}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
            >
              Continue to Assessment
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-4 text-sm text-muted-foreground text-center">
        <p>© {new Date().getFullYear()} EverGrid - AB 2511 Compliance Platform</p>
      </div>
    </div>
  );
}