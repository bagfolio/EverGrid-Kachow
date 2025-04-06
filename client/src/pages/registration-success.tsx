import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { 
  CalendarClock, 
  Check, 
  ChevronRight, 
  MailOpen, 
  Plus, 
  PlugZap, 
  User 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useFacility } from "@/lib/facility-context";
import type { Facility } from "@/types/facility";

// Mockup data for demo purposes
const mockFacility: Facility = {
  facility_id: "CT001",
  status: "Active",
  certification_type: "Medicaid and Medicare",
  county: "Bernalillo",
  facility_name: "Casa Tranquila",
  address: "1245 Ponderosa Lane",
  city: "Albuquerque",
  zip: "87102",
  latitude: 35.0844,
  longitude: -106.6504,
  contact_email: "gus.hector@casatranquila.org",
  contact_phone: "(505) 555-1234",
  num_beds: 112,
  type_of_care: "Skilled Nursing Facility",
  critical_access: "Yes",
  in_psps_zone: true,
  in_fire_zone: false,
  in_earthquake_zone: false,
  outage_likelihood_score: 7.5
};

export default function RegistrationSuccess() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { selectFacility } = useFacility();
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);
  
  // Simulate progress increment
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Auto-hide confetti
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleDashboardClick = () => {
    // Set mock facility data
    selectFacility(mockFacility);
    
    // Navigate to dashboard
    setLocation("/dashboard");
  };
  
  const handleAddFacility = () => {
    setLocation("/registration/welcome");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-background to-secondary/10 flex flex-col items-center justify-center p-4">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4">
            <motion.div 
              className="w-4 h-4 bg-blue-500 rounded-full"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 100, opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="absolute top-1/4 left-1/3">
            <motion.div 
              className="w-3 h-3 bg-green-500 rounded-full"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 120, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            />
          </div>
          <div className="absolute top-1/4 right-1/3">
            <motion.div 
              className="w-5 h-5 bg-yellow-500 rounded-full"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 130, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
            />
          </div>
          <div className="absolute top-1/3 right-1/4">
            <motion.div 
              className="w-4 h-4 bg-purple-500 rounded-full"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 110, opacity: 0 }}
              transition={{ duration: 1.3, ease: "easeOut", delay: 0.3 }}
            />
          </div>
        </div>
      )}
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-lg border-t-4 border-t-primary mb-6">
          <CardHeader className="pb-2">
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 10 }}
              className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4"
            >
              <Check className="h-8 w-8 text-primary" />
            </motion.div>
            <CardTitle className="text-center text-2xl font-bold">Registration Completed Successfully!</CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              Thank you for submitting your facility information
            </p>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="p-6 pt-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <User className="mr-2 h-5 w-5 text-primary" />
                  Facility Information
                </h3>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>
                      <div className="text-muted-foreground">Facility Name</div>
                      <div className="font-medium">{mockFacility.facility_name}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Contact Person</div>
                      <div className="font-medium">Gus Hector</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Email</div>
                      <div className="font-medium">{mockFacility.contact_email}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-muted-foreground">Facility Type</div>
                      <div className="font-medium">{mockFacility.type_of_care}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Address</div>
                      <div className="font-medium">{mockFacility.address}, {mockFacility.city}, {mockFacility.zip}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Phone Number</div>
                      <div className="font-medium">{mockFacility.contact_phone}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <PlugZap className="mr-2 h-5 w-5 text-primary" />
                  Energy Information
                </h3>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <div className="text-muted-foreground">Monthly Usage</div>
                    <div className="text-xl font-semibold mt-1">15,840 kWh</div>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <div className="text-muted-foreground">Peak Demand</div>
                    <div className="text-xl font-semibold mt-1">42 kW</div>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <div className="text-muted-foreground">Rate Plan</div>
                    <div className="text-xl font-semibold mt-1">TOU-GS-2-E</div>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-3">Next Steps</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <CalendarClock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">Assessment in progress</p>
                      <p className="text-sm text-muted-foreground">Our team is analyzing your information (1-2 business days)</p>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant="outline" className="bg-blue-50">In Progress</Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MailOpen className="h-5 w-5 text-primary/80" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">Assessment Results</p>
                      <p className="text-sm text-muted-foreground">You'll receive your personalized assessment via email</p>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant="outline">Upcoming</Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">Expert Consultation</p>
                      <p className="text-sm text-muted-foreground">A Mobile Lightning expert will contact you to discuss your solution</p>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant="outline">Upcoming</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 p-6 bg-muted/20">
            <Button
              className="w-full sm:w-auto flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
              onClick={handleDashboardClick}
            >
              Go to Dashboard
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              className="w-full sm:w-auto flex-1"
              onClick={handleAddFacility}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Facility
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      
      <div className="mt-4 text-sm text-muted-foreground text-center">
        <p>© {new Date().getFullYear()} EverGrid - AB 2511 Compliance Platform</p>
      </div>
    </div>
  );
}