import React, { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  FileImage, 
  CheckCircle, 
  AlertCircle, 
  Camera, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  MapPin, 
  Building, 
  PlugZap, 
  Save,
  HelpCircle,
  Lightbulb,
  Zap,
  Construction
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useFacility } from "@/lib/facility-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UtilityBillUpload() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { updateProgress } = useFacility();
  
  // Progress tracking
  const [overallProgress, setOverallProgress] = useState(25); // Start at 25% progress
  
  // Dialog / Modal state
  const [sampleBillOpen, setSampleBillOpen] = useState(false);
  const [samplePhotoOpen, setSamplePhotoOpen] = useState(false);
  const [billDataOpen, setBillDataOpen] = useState(false);
  const [whyWeNeedOpen, setWhyWeNeedOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('meter');
  
  // Bill upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Extracted bill data (simulated)
  const [extractedData, setExtractedData] = useState<{
    monthlyUsage: number;
    peakDemand: number;
    rate: string;
    billingPeriod: string;
  } | null>(null);
  
  // Meter photo state
  const [meterPhotoUploaded, setMeterPhotoUploaded] = useState(false);
  const meterPhotoInputRef = React.useRef<HTMLInputElement>(null);
  
  // Panel photo state
  const [panelPhotoUploaded, setPanelPhotoUploaded] = useState(false);
  const panelPhotoInputRef = React.useRef<HTMLInputElement>(null);
  
  // Installation area photo state
  const [areaPhotoUploaded, setAreaPhotoUploaded] = useState(false);
  const areaPhotoInputRef = React.useRef<HTMLInputElement>(null);

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
  
  const handleAreaPhotoClick = () => {
    if (areaPhotoInputRef.current) {
      areaPhotoInputRef.current.click();
    }
  };
  
  // Update progress as uploads are completed
  const updateUploadProgress = () => {
    // Calculate progress based on how many items are uploaded
    let progress = 25; // Start with 25% for reaching this page
    
    if (uploadStatus === 'success') progress += 25;
    if (meterPhotoUploaded) progress += 15;
    if (panelPhotoUploaded) progress += 15; 
    if (areaPhotoUploaded) progress += 20;
    
    setOverallProgress(progress);
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

      // Simulate extracting bill data
      const simulatedData = {
        monthlyUsage: Math.floor(Math.random() * 15000) + 5000, // 5,000 - 20,000 kWh
        peakDemand: Math.floor(Math.random() * 50) + 10, // 10-60 kW
        rate: "TOU-GS-2-E", // Time-of-Use General Service rate
        billingPeriod: `${new Date().getMonth() === 0 ? 12 : new Date().getMonth()}/1/${new Date().getFullYear()} - ${new Date().getMonth() + 1}/1/${new Date().getFullYear()}`
      };
      
      setExtractedData(simulatedData);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus('success');
        
        // Update overall progress
        updateUploadProgress();
        
        toast({
          title: "Utility bill uploaded",
          description: `Identified monthly usage of ${simulatedData.monthlyUsage.toLocaleString()} kWh and peak demand of ${simulatedData.peakDemand} kW.`,
          duration: 3000,
        });
        
        // Open bill data preview
        setBillDataOpen(true);
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

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>, photoType: 'meter' | 'panel' | 'area') => {
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
      } else if (photoType === 'panel') {
        setPanelPhotoUploaded(true);
      } else if (photoType === 'area') {
        setAreaPhotoUploaded(true);
      }

      // Update overall progress
      updateUploadProgress();

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

  // Use effect to monitor upload status changes and update overall progress
  React.useEffect(() => {
    updateUploadProgress();
  }, [uploadStatus, meterPhotoUploaded, panelPhotoUploaded, areaPhotoUploaded]);

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
      
      {/* Progress indicator */}
      <div className="w-full max-w-3xl mb-4">
        <div className="flex justify-between mb-2 text-sm">
          <div className="flex items-center text-primary">
            <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">2</span>
            Documentation Upload
          </div>
          <div className="text-muted-foreground">Step 2 of 4</div>
        </div>
        <Progress value={overallProgress} className="h-2" />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>Registration</span>
          <span>Documentation</span>
          <span>Assessment</span>
          <span>Compliance Plan</span>
        </div>
      </div>
      
      {/* Modals and dialogs for educational content */}
      <Dialog open={sampleBillOpen} onOpenChange={setSampleBillOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Sample Utility Bill</DialogTitle>
            <DialogDescription>
              Here's what to look for on your utility bill
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="relative border border-primary/20 rounded-md overflow-hidden">
              <img 
                src="https://www.sce.com/sites/default/files/inline-images/sample_bill_lg.png" 
                alt="Sample utility bill" 
                className="w-full object-contain"
              />
              <div className="absolute top-20 right-20 w-32 h-10 border-2 border-red-500 rounded animate-pulse">
                <div className="absolute -top-6 -left-6 bg-red-500 text-white px-2 py-1 text-xs rounded-md">
                  Rate Plan
                </div>
              </div>
              <div className="absolute top-60 right-40 w-40 h-16 border-2 border-blue-500 rounded animate-pulse">
                <div className="absolute -top-6 -left-6 bg-blue-500 text-white px-2 py-1 text-xs rounded-md">
                  Monthly Usage
                </div>
              </div>
              <div className="absolute top-40 left-40 w-32 h-12 border-2 border-green-500 rounded animate-pulse">
                <div className="absolute -top-6 -right-10 bg-green-500 text-white px-2 py-1 text-xs rounded-md">
                  Peak Demand
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-red-600 mb-1">Rate Plan</div>
                <p>Look for "Rate Plan" or "Rate Schedule" - this helps us determine your tariff structure.</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-blue-600 mb-1">Monthly Usage</div>
                <p>Find your total kWh usage, usually shown as "Total Energy" or "Total Usage".</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-green-600 mb-1">Peak Demand</div>
                <p>Look for "Max Demand" or "Peak kW" value to understand your power requirements.</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setSampleBillOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={samplePhotoOpen} onOpenChange={setSamplePhotoOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Facility Photo Guide</DialogTitle>
            <DialogDescription>
              How to take clear, useful photos of your electrical equipment
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="meter">Electrical Meter</TabsTrigger>
              <TabsTrigger value="panel">Electrical Panel</TabsTrigger>
              <TabsTrigger value="area">Installation Area</TabsTrigger>
            </TabsList>
            <TabsContent value="meter" className="p-4 border rounded-md mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <img 
                    src="https://www.researchgate.net/profile/Alberto-Reatti/publication/328343230/figure/fig4/AS:682107639316480@1539658287137/A-typical-smart-meter.jpg" 
                    alt="Example meter photo" 
                    className="w-full h-64 object-cover rounded-md"
                  />
                </div>
                <div className="space-y-4">
                  <div className="bg-green-50 p-3 rounded-md border border-green-200">
                    <h4 className="font-medium flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Do</h4>
                    <ul className="ml-6 mt-2 list-disc text-sm space-y-1">
                      <li>Ensure all labels are clearly visible</li>
                      <li>Take photos in good lighting</li>
                      <li>Include the whole meter in the frame</li>
                      <li>Make sure meter number is readable</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-3 rounded-md border border-red-200">
                    <h4 className="font-medium flex items-center"><AlertCircle className="h-4 w-4 mr-2 text-red-500" /> Don't</h4>
                    <ul className="ml-6 mt-2 list-disc text-sm space-y-1">
                      <li>Take photos with glare or shadows</li>
                      <li>Use flash that obscures meter readings</li>
                      <li>Take photos from far away</li>
                      <li>Submit blurry or out of focus images</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="panel" className="p-4 border rounded-md mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <img 
                    src="https://www.thenest.com/storage/images/5/2/1/52109_14482_3x2.jpg" 
                    alt="Example panel photo" 
                    className="w-full h-64 object-cover rounded-md"
                  />
                </div>
                <div className="space-y-4">
                  <div className="bg-green-50 p-3 rounded-md border border-green-200">
                    <h4 className="font-medium flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Do</h4>
                    <ul className="ml-6 mt-2 list-disc text-sm space-y-1">
                      <li>Include the entire panel in the image</li>
                      <li>Take photos with the panel door open if safe</li>
                      <li>Capture the amperage rating label</li>
                      <li>Show the main breaker and bus bars</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-3 rounded-md border border-red-200">
                    <h4 className="font-medium flex items-center"><AlertCircle className="h-4 w-4 mr-2 text-red-500" /> Don't</h4>
                    <ul className="ml-6 mt-2 list-disc text-sm space-y-1">
                      <li>Open panels if you're not qualified</li>
                      <li>Stick objects inside the panel</li>
                      <li>Touch any components while photographing</li>
                      <li>Take photos in the dark without proper lighting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="area" className="p-4 border rounded-md mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <img 
                    src="https://www.metalroofingutah.com/wp-content/uploads/2019/04/FullSizeRender-4-e1555018954564.jpg" 
                    alt="Example installation area" 
                    className="w-full h-64 object-cover rounded-md"
                  />
                </div>
                <div className="space-y-4">
                  <div className="bg-green-50 p-3 rounded-md border border-green-200">
                    <h4 className="font-medium flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Do</h4>
                    <ul className="ml-6 mt-2 list-disc text-sm space-y-1">
                      <li>Take wide-angle photos showing the entire space</li>
                      <li>Include points of reference for scale</li>
                      <li>Show access paths and nearby infrastructure</li>
                      <li>Capture multiple angles if possible</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-3 rounded-md border border-red-200">
                    <h4 className="font-medium flex items-center"><AlertCircle className="h-4 w-4 mr-2 text-red-500" /> Don't</h4>
                    <ul className="ml-6 mt-2 list-disc text-sm space-y-1">
                      <li>Submit photos that don't show enough context</li>
                      <li>Take photos with poor lighting or heavy shadows</li>
                      <li>Include sensitive equipment or people in photos</li>
                      <li>Submit low-resolution images</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end">
            <Button onClick={() => setSamplePhotoOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={billDataOpen} onOpenChange={setBillDataOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bill Analysis Results</DialogTitle>
            <DialogDescription>
              Here's what we extracted from your bill
            </DialogDescription>
          </DialogHeader>
          {extractedData && (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 bg-green-50 p-3 rounded-md border border-green-100">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-700 font-medium">Successfully processed your bill</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground">Monthly Energy Usage</div>
                  <div className="text-2xl font-semibold text-primary">{extractedData.monthlyUsage.toLocaleString()} kWh</div>
                </div>
                <div className="bg-white p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground">Peak Demand</div>
                  <div className="text-2xl font-semibold text-primary">{extractedData.peakDemand} kW</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground">Rate Schedule</div>
                  <div className="text-lg font-medium">{extractedData.rate}</div>
                </div>
                <div className="bg-white p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground">Billing Period</div>
                  <div className="text-lg font-medium">{extractedData.billingPeriod}</div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <h4 className="font-medium text-blue-700 mb-1">What this means for your facility</h4>
                <p className="text-sm">
                  Based on your usage pattern, we can design a battery backup system that will support 
                  critical functions for the required 96 hours during emergencies.
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={() => setBillDataOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={whyWeNeedOpen} onOpenChange={setWhyWeNeedOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Why We Need This Information</DialogTitle>
            <DialogDescription>
              Understanding how this data helps with AB 2511 compliance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 p-2 rounded-full">
                <FileImage className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Utility Bill</h4>
                <p className="text-sm text-muted-foreground">
                  Your utility bill provides critical information about your facility's energy consumption patterns,
                  which helps us accurately size your backup battery system to meet the 96-hour requirement
                  specified in AB 2511 regulations.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 p-2 rounded-full">
                <PlugZap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Electrical Meter Photos</h4>
                <p className="text-sm text-muted-foreground">
                  Photos of your meter help us verify your service type and capacity. This information
                  ensures that the proposed backup solution can be properly integrated with your 
                  existing electrical service.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 p-2 rounded-full">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Electrical Panel Photos</h4>
                <p className="text-sm text-muted-foreground">
                  Panel photos allow us to assess your existing electrical infrastructure and identify
                  the critical circuits that must remain powered during emergencies, as required by AB 2511.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 p-2 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Installation Area Photos</h4>
                <p className="text-sm text-muted-foreground">
                  These photos help us identify suitable locations for battery equipment, ensuring
                  the installation will meet safety requirements while minimizing disruption to your facility operations.
                </p>
              </div>
            </div>
            
            <div className="bg-amber-50 p-3 rounded-md border border-amber-100 mt-6">
              <h4 className="font-medium text-amber-800 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" /> Data Security
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                All uploaded information is encrypted and stored securely. Your data is only used for compliance assessment
                and is never shared with third parties without your explicit consent.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setWhyWeNeedOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Card className="w-full max-w-3xl shadow-lg mb-6">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-2xl">Upload Utility Bill</CardTitle>
            <div className="ml-auto flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => setSampleBillOpen(true)}
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">View sample bill</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View sample bill</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => setWhyWeNeedOpen(true)}
                    >
                      <Info className="h-4 w-4" />
                      <span className="sr-only">Why we need this</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Why we need this information</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
            <div className="ml-auto flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => setSamplePhotoOpen(true)}
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">View photo guides</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Photo taking guidelines</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <p className="text-muted-foreground">
            Take pictures of your electrical panels and meters to help us understand your infrastructure
          </p>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Meter Photo Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                ref={meterPhotoInputRef}
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handlePhotoChange(e, 'meter')}
              />
              
              {!meterPhotoUploaded ? (
                <div>
                  <PlugZap className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2 font-medium">Electrical Meter</p>
                  <p className="text-xs text-muted-foreground mb-3">Shows your electrical service details</p>
                  <Button 
                    variant="outline" 
                    onClick={handleMeterPhotoClick}
                    size="sm"
                    className="w-full"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>
              ) : (
                <div>
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium mb-2">
                    Meter Photo Uploaded
                  </p>
                  <p className="text-green-600 text-sm">
                    Photo successfully uploaded!
                  </p>
                </div>
              )}
            </div>
            
            {/* Panel Photo Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                ref={panelPhotoInputRef}
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handlePhotoChange(e, 'panel')}
              />
              
              {!panelPhotoUploaded ? (
                <div>
                  <Zap className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2 font-medium">Electrical Panel</p>
                  <p className="text-xs text-muted-foreground mb-3">Important for battery integration</p>
                  <Button 
                    variant="outline" 
                    onClick={handlePanelPhotoClick}
                    size="sm"
                    className="w-full"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>
              ) : (
                <div>
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium mb-2">
                    Panel Photo Uploaded
                  </p>
                  <p className="text-green-600 text-sm">
                    Photo successfully uploaded!
                  </p>
                </div>
              )}
            </div>
            
            {/* Installation Area Photo Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                ref={areaPhotoInputRef}
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handlePhotoChange(e, 'area')}
              />
              
              {!areaPhotoUploaded ? (
                <div>
                  <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2 font-medium">Installation Area</p>
                  <p className="text-xs text-muted-foreground mb-3">Where batteries will be installed</p>
                  <Button 
                    variant="outline" 
                    onClick={handleAreaPhotoClick}
                    size="sm"
                    className="w-full"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>
              ) : (
                <div>
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium mb-2">
                    Area Photo Uploaded
                  </p>
                  <p className="text-green-600 text-sm">
                    Photo successfully uploaded!
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Pro Tip:</strong> Clear, well-lit photos help our engineers accurately 
                design your backup power solution. For best results, take photos during daylight 
                hours and ensure all labels and identifying information are clearly visible.
              </div>
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