import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Facility } from "@/types/facility";
import { 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  Search,
  MapPin,
  Loader2,
  Check,
  AlertCircle,
  Edit
} from "lucide-react";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Facility form schema
const facilityFormSchema = z.object({
  facility_id: z.string().optional(),
  facility_name: z.string().min(2, "Facility name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(5, "ZIP code is required"),
  county: z.string().min(2, "County is required"),
  state: z.string().default("CA"),
  num_beds: z.coerce.number().min(0, "Number of beds must be a positive number").default(0),
  contact_email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  contact_phone: z.string().optional().or(z.literal("")),
});

type FacilityFormValues = z.infer<typeof facilityFormSchema>;

export default function FacilityInfoPage() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [facilityList, setFacilityList] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [openPopover, setOpenPopover] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  
  // Form setup
  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: {
      facility_id: "",
      facility_name: "",
      address: "",
      city: "",
      state: "CA",
      zip: "",
      county: "",
      num_beds: 0,
      contact_email: "",
      contact_phone: "",
    },
  });

  // Get previously collected info
  useEffect(() => {
    // This would normally fetch from the API, but we're using static data for demo
    // Simulating fetching facilities from the CSV
    fetch("/assets/snf_cleaned.csv")
      .then(response => response.text())
      .then(text => {
        // Simplified parsing for demo purposes
        // In a real app, you would use a proper CSV parser
        console.log("Would fetch facilities from CSV in a real app");
        // Mock data for demo
        const mockFacilities: Facility[] = [
          {
            facility_id: "SNF001",
            facility_name: "Golden Hills Care Center",
            address: "1234 Main St",
            city: "San Francisco",
            zip: "94105",
            county: "San Francisco",
            latitude: 37.7749,
            longitude: -122.4194,
            num_beds: 150,
            status: "Active",
            certification_type: "Medicare and Medicaid",
          },
          {
            facility_id: "SNF002",
            facility_name: "Sunset Senior Living",
            address: "5678 Ocean Ave",
            city: "Los Angeles",
            zip: "90001",
            county: "Los Angeles",
            latitude: 34.0522,
            longitude: -118.2437,
            num_beds: 200,
            status: "Active",
            certification_type: "Medicare and Medicaid",
          },
          {
            facility_id: "SNF003",
            facility_name: "Valley View Nursing Home",
            address: "910 Valley Rd",
            city: "Sacramento",
            zip: "95814",
            county: "Sacramento",
            latitude: 38.5816,
            longitude: -121.4944,
            num_beds: 125,
            status: "Active", 
            certification_type: "Medicare and Medicaid",
          },
        ];
        setFacilityList(mockFacilities);
      })
      .catch(error => {
        console.error("Error loading facilities:", error);
        setFacilityList([]);
      });
  }, []);

  // Filter facilities based on search
  const filteredFacilities = useMemo(() => {
    if (!searchValue.trim()) return [];
    
    return facilityList.filter(facility => 
      facility.facility_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      facility.address.toLowerCase().includes(searchValue.toLowerCase()) ||
      facility.city.toLowerCase().includes(searchValue.toLowerCase()) ||
      facility.facility_id.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, facilityList]);

  // Handle facility selection
  const handleSelectFacility = (facility: Facility) => {
    setSelectedFacility(facility);
    setOpenPopover(false);
    
    // Populate form with facility data
    form.reset({
      facility_id: facility.facility_id,
      facility_name: facility.facility_name,
      address: facility.address,
      city: facility.city,
      state: "CA",
      zip: facility.zip,
      county: facility.county,
      num_beds: facility.num_beds,
      contact_email: facility.contact_email || "",
      contact_phone: facility.contact_phone || "",
    });
  };

  // Handle form submission
  const onSubmit = (data: FacilityFormValues) => {
    setIsSubmitting(true);
    
    // Store facility data
    localStorage.setItem("registration_facility", JSON.stringify(data));
    
    // Navigate to next step after delay
    setTimeout(() => {
      setLocation("/registration/utility");
    }, 800);
  };
  
  // Handle manual entry toggle
  const handleManualEntry = () => {
    setManualEntry(true);
    setSelectedFacility(null);
    setOpenPopover(false);
    
    // Clear form for manual entry
    form.reset({
      facility_id: "",
      facility_name: "",
      address: "",
      city: "",
      state: "CA",
      zip: "",
      county: "",
      num_beds: 0,
      contact_email: "",
      contact_phone: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-background to-secondary/10 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-2xl">Facility Information</CardTitle>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="pt-6">
          {!manualEntry && !selectedFacility && (
            <div className="mb-6 space-y-4">
              <div className="text-center">
                <h3 className="font-medium text-lg">Find your facility</h3>
                <p className="text-sm text-muted-foreground">
                  Search for your facility to automatically populate information
                </p>
              </div>
              
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by facility name, address, or ID..."
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        if (e.target.value.length > 2) {
                          setOpenPopover(true);
                          setIsSearching(true);
                          // Simulate search delay
                          setTimeout(() => setIsSearching(false), 500);
                        } else {
                          setOpenPopover(false);
                        }
                      }}
                      className="pl-10"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full max-w-[calc(100vw-2rem)]" align="start">
                  <Command>
                    <CommandInput placeholder="Search facilities..." value={searchValue} onValueChange={setSearchValue} />
                    <CommandList>
                      {isSearching ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : (
                        <>
                          <CommandEmpty>
                            <div className="p-4 text-center">
                              <p className="text-sm text-muted-foreground">No facilities found</p>
                              <Button
                                variant="link"
                                onClick={handleManualEntry}
                                className="mt-2"
                              >
                                Enter facility information manually
                              </Button>
                            </div>
                          </CommandEmpty>
                          <CommandGroup>
                            {filteredFacilities.map((facility) => (
                              <CommandItem
                                key={facility.facility_id}
                                onSelect={() => handleSelectFacility(facility)}
                                className="p-2"
                              >
                                <div className="flex flex-col">
                                  <div className="font-medium">{facility.facility_name}</div>
                                  <div className="text-xs text-muted-foreground flex items-center">
                                    <MapPin className="h-3 w-3 mr-1 inline" />
                                    {facility.address}, {facility.city}, CA {facility.zip}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Facility ID: {facility.facility_id} • Beds: {facility.num_beds}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              <div className="flex justify-center">
                <Button
                  variant="link"
                  onClick={handleManualEntry}
                  className="text-sm"
                >
                  I don't see my facility. Enter information manually →
                </Button>
              </div>
            </div>
          )}
          
          {/* Show this when a facility is selected or manual entry is active */}
          {(selectedFacility || manualEntry) && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {selectedFacility && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800">Facility Found</h4>
                        <p className="text-sm text-green-700">
                          We've pre-filled the form with information for {selectedFacility.facility_name}.
                          Please review and make any necessary corrections.
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-green-700"
                        onClick={handleManualEntry}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Facility ID (hidden but included for form submission) */}
                <FormField
                  control={form.control}
                  name="facility_id"
                  render={({ field }) => (
                    <input type="hidden" {...field} />
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="facility_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facility Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter facility name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="num_beds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Beds</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="ZIP code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>County <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter county" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contact_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facility Contact Email</FormLabel>
                        <FormControl>
                          <Input placeholder="facility@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facility Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="h-4">
                  {/* Spacing element */}
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/registration/facility-type")}
                    type="button"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
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
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-8 text-sm text-muted-foreground text-center">
        <p>© {new Date().getFullYear()} EverGrid - AB 2511 Compliance Platform</p>
      </div>
    </div>
  );
}