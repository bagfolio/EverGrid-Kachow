import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  ChevronRight, 
  Hospital, 
  Server, 
  Factory, 
  Ship, 
  Building2, 
  AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FacilityType = {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
};

const facilityTypes: FacilityType[] = [
  {
    id: "skilled-nursing",
    name: "Skilled Nursing Facility",
    icon: Hospital,
    description: "Long-term care facility requiring AB 2511 compliance",
  },
  {
    id: "hospital",
    name: "Hospital",
    icon: Hospital,
    description: "Medical facility with 24/7 emergency care requirements",
  },
  {
    id: "data-center",
    name: "Data Center",
    icon: Server,
    description: "Facility housing critical computing infrastructure",
  },
  {
    id: "port-operation",
    name: "Port Operation",
    icon: Ship,
    description: "Maritime facility with continuous operational needs",
  },
  {
    id: "industrial",
    name: "Industrial Manufacturing",
    icon: Factory,
    description: "Manufacturing facility with production-critical systems",
  },
  {
    id: "other",
    name: "Other",
    icon: Building2,
    description: "Custom facility type not listed above",
  },
];

export default function FacilityTypePage() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [otherType, setOtherType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState<any>(null);

  // Retrieve contact information from previous step
  useEffect(() => {
    const savedContact = localStorage.getItem("registration_contact");
    if (savedContact) {
      setContactInfo(JSON.parse(savedContact));
    }
  }, []);

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleSubmit = () => {
    if (!selectedType) return;
    
    setIsSubmitting(true);
    
    // Save selected facility type
    const facilityData = {
      facilityType: selectedType,
      facilityTypeCustom: selectedType === "other" ? otherType : "",
    };
    
    localStorage.setItem("registration_facility_type", JSON.stringify(facilityData));
    
    // Move to next step
    setTimeout(() => {
      setLocation("/registration/facility-info");
    }, 800);
  };

  const isAB2511Selected = selectedType === "skilled-nursing";
  const isOtherSelected = selectedType === "other";
  const canContinue = selectedType && (!isOtherSelected || (isOtherSelected && otherType.trim().length > 0));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-background to-secondary/10 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-2xl">Facility Type</CardTitle>
          </div>
          
          {contactInfo && (
            <div className="text-sm text-muted-foreground">
              {contactInfo.organizationName} • {contactInfo.contactName}
            </div>
          )}
        </CardHeader>
        
        <Separator />
        
        <CardContent className="pt-6">
          <div className="mb-4">
            <p className="text-muted-foreground">Select the type of facility you need a backup power solution for:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilityTypes.map((type) => (
              <div
                key={type.id}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-all hover:border-primary hover:shadow-md",
                  selectedType === type.id
                    ? "border-primary/70 bg-primary/5 shadow-md"
                    : "border-border"
                )}
                onClick={() => handleSelectType(type.id)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center",
                    selectedType === type.id
                      ? "bg-primary/20 text-primary"
                      : "bg-muted/50 text-muted-foreground"
                  )}>
                    <type.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {isOtherSelected && (
            <div className="mt-6">
              <Label htmlFor="other-type">Please specify your facility type:</Label>
              <Input
                id="other-type"
                value={otherType}
                onChange={(e) => setOtherType(e.target.value)}
                placeholder="Enter your facility type"
                className="mt-2"
              />
            </div>
          )}
          
          {isAB2511Selected && (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">AB 2511 Compliance Required</h4>
                  <p className="text-sm text-amber-700">
                    As a Skilled Nursing Facility in California, you are required to comply with AB 2511 legislation
                    by January 1, 2026. This requires backup power systems capable of powering critical functions
                    for at least 96 hours during emergencies.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setLocation("/registration/contact")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!canContinue || isSubmitting}
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-sm text-muted-foreground text-center">
        <p>© {new Date().getFullYear()} EverGrid - AB 2511 Compliance Platform</p>
      </div>
    </div>
  );
}