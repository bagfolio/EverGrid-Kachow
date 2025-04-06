import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { 
  Map, 
  Layers, 
  AlertTriangle, 
  Zap, 
  Flame, 
  Globe, 
  Users, 
  Clock, 
  CalendarDays, 
  MapPin, 
  Ruler, 
  ChevronDown, 
  X, 
  Check, 
  Download,
  UserCheck,
  Phone
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Facility } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

// In a real app, this would be properly typed and include more data
type FacilityRiskData = {
  facilityId: string;
  inPspsZone: boolean;
  inFireZone: boolean;
  inEarthquakeZone: boolean;
  riskScore: number;
  proximityToDispatch: string;
};

// In a real app this would be fetched from an API
const riskData: Record<string, FacilityRiskData> = {
  'SNF12345': {
    facilityId: 'SNF12345',
    inPspsZone: true,
    inFireZone: true,
    inEarthquakeZone: false,
    riskScore: 89,
    proximityToDispatch: '45 miles'
  },
  'SNF23456': {
    facilityId: 'SNF23456',
    inPspsZone: true,
    inFireZone: false,
    inEarthquakeZone: true,
    riskScore: 75,
    proximityToDispatch: '22 miles'
  },
  'SNF34567': {
    facilityId: 'SNF34567',
    inPspsZone: false,
    inFireZone: false,
    inEarthquakeZone: true,
    riskScore: 62,
    proximityToDispatch: '18 miles'
  },
  'SNF45678': {
    facilityId: 'SNF45678',
    inPspsZone: false,
    inFireZone: false,
    inEarthquakeZone: false,
    riskScore: 35,
    proximityToDispatch: '8 miles'
  },
  'SNF56789': {
    facilityId: 'SNF56789',
    inPspsZone: true,
    inFireZone: false,
    inEarthquakeZone: false,
    riskScore: 68,
    proximityToDispatch: '30 miles'
  },
};

// Staff members for assignment
const staffMembers = [
  { id: 1, name: 'James Wilson', role: 'Field Technician', region: 'Northern CA', available: true },
  { id: 2, name: 'Sarah Matthews', role: 'Senior Engineer', region: 'Central CA', available: true },
  { id: 3, name: 'Maria Rodriguez', role: 'Field Technician', region: 'Southern CA', available: false },
  { id: 4, name: 'Thomas Chen', role: 'Installation Specialist', region: 'Bay Area', available: true },
  { id: 5, name: 'Robert Johnson', role: 'Compliance Officer', region: 'Central Valley', available: true },
];

// Facility detail panel
function FacilityDetailPanel({ facility, onClose }: { facility: Facility, onClose: () => void }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("summary");
  
  const risk = riskData[facility.facility_id] || {
    facilityId: facility.facility_id,
    inPspsZone: false,
    inFireZone: false,
    inEarthquakeZone: false,
    riskScore: 30,
    proximityToDispatch: 'Unknown'
  };
  
  const getRiskLevel = (score: number) => {
    if (score >= 75) return { level: 'High', color: 'text-red-600' };
    if (score >= 50) return { level: 'Medium', color: 'text-orange-600' };
    return { level: 'Low', color: 'text-green-600' };
  };
  
  const riskLevel = getRiskLevel(risk.riskScore);
  
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-3 pt-3 px-4">
        <div>
          <CardTitle className="text-lg flex items-center">
            {facility.facility_name}
            <Badge className="ml-2" variant={risk.riskScore >= 75 ? "destructive" : "outline"}>
              {facility.facility_id}
            </Badge>
          </CardTitle>
          <CardDescription>{facility.address}, {facility.city}, CA {facility.zip}</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <div className="p-4 flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="risk">Risk Profile</TabsTrigger>
            <TabsTrigger value="assign">Assign</TabsTrigger>
            <TabsTrigger value="docs">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="flex-1 mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Facility Type</div>
                <div className="text-sm">{facility.certification_type || 'Skilled Nursing Facility'}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Bed Count</div>
                <div className="text-sm">{facility.num_beds}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">County</div>
                <div className="text-sm">{facility.county}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Risk Score</div>
                <div className={`text-sm font-bold ${riskLevel.color}`}>{risk.riskScore} - {riskLevel.level} Risk</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Status</div>
              <div className="flex space-x-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800">Assessment: In Progress</Badge>
                <Badge variant="outline" className="bg-amber-100 text-amber-800">Installation: Not Started</Badge>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Contact Information</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center text-sm">
                  <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  {facility.contact_phone || 'Not provided'}
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  {facility.contact_email || 'Not provided'}
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-4 flex justify-end space-x-4">
              <Button variant="outline" className="text-blue-600">
                <Phone className="h-4 w-4 mr-2" />
                Contact Facility
              </Button>
              <Button>View Details</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="risk" className="flex-1 mt-4 space-y-4">
            <div className="border rounded-md p-4 bg-muted/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold">Risk Factors</div>
                <Badge className={`${riskLevel.color} bg-opacity-10 border-none`}>
                  {riskLevel.level} Risk Area
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`border rounded-md p-3 ${risk.inPspsZone ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-center space-x-2">
                    <Zap className={`h-5 w-5 ${risk.inPspsZone ? 'text-red-600' : 'text-green-600'}`} />
                    <div className="font-medium">PSPS Zone</div>
                  </div>
                  <div className="mt-1 text-sm">
                    {risk.inPspsZone ? 'In active PSPS area' : 'Not in PSPS area'}
                  </div>
                </div>
                
                <div className={`border rounded-md p-3 ${risk.inFireZone ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-center space-x-2">
                    <Flame className={`h-5 w-5 ${risk.inFireZone ? 'text-red-600' : 'text-green-600'}`} />
                    <div className="font-medium">Fire Risk</div>
                  </div>
                  <div className="mt-1 text-sm">
                    {risk.inFireZone ? 'High fire danger zone' : 'Low fire danger zone'}
                  </div>
                </div>
                
                <div className={`border rounded-md p-3 ${risk.inEarthquakeZone ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-center space-x-2">
                    <Globe className={`h-5 w-5 ${risk.inEarthquakeZone ? 'text-red-600' : 'text-green-600'}`} />
                    <div className="font-medium">Earthquake Zone</div>
                  </div>
                  <div className="mt-1 text-sm">
                    {risk.inEarthquakeZone ? 'Active fault line proximity' : 'Low seismic activity area'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4 space-y-3">
              <div className="text-lg font-bold">Operational Risk Factors</div>
              
              <div className="space-y-4 mt-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Proximity to Dispatch</div>
                  <div className="text-sm">{risk.proximityToDispatch}</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Historical Outages (1yr)</div>
                  <div className="text-sm">4 events, 26 hours total</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Backup Power Status</div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">
                    Outdated Diesel Generator
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-4 flex justify-end">
              <Button>Download Full Risk Report</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="assign" className="flex-1 mt-4 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Staff Member</label>
                <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers.map(staff => (
                      <SelectItem 
                        key={staff.id} 
                        value={staff.id.toString()}
                        disabled={!staff.available}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{staff.name} - {staff.role}</span>
                          {!staff.available && <span className="text-red-500 text-xs">(Unavailable)</span>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule Visit Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Visit Type</label>
                <Select defaultValue="assessment">
                  <SelectTrigger>
                    <SelectValue placeholder="Select visit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assessment">Initial Assessment</SelectItem>
                    <SelectItem value="verification">Verification Visit</SelectItem>
                    <SelectItem value="installation">Installation</SelectItem>
                    <SelectItem value="support">Technical Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Visit Notes</label>
                <textarea 
                  className="w-full min-h-[100px] p-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Enter any special instructions or notes for this visit"
                />
              </div>
            </div>
            
            <div className="mt-auto pt-4 flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button 
                disabled={!selectedStaff || !selectedDate}
                className="gap-2"
              >
                <UserCheck className="h-4 w-4" />
                Schedule Visit
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="docs" className="flex-1 mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-lg font-medium">Facility Documents</div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download All
              </Button>
            </div>
            
            <div className="border rounded-md">
              <div className="p-4 border-b bg-muted/30">
                <div className="font-medium">Utility Bills</div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center p-2 hover:bg-muted/30 rounded-md">
                  <div className="flex items-center">
                    <div className="mr-4 h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div>
                      <div className="font-medium">February 2025 Utility Bill</div>
                      <div className="text-xs text-muted-foreground">Uploaded on Mar 15, 2025</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
                
                <div className="flex justify-between items-center p-2 hover:bg-muted/30 rounded-md">
                  <div className="flex items-center">
                    <div className="mr-4 h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div>
                      <div className="font-medium">January 2025 Utility Bill</div>
                      <div className="text-xs text-muted-foreground">Uploaded on Feb 12, 2025</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md">
              <div className="p-4 border-b bg-muted/30">
                <div className="font-medium">Facility Photos</div>
              </div>
              <div className="p-4 grid grid-cols-3 gap-2">
                <div className="relative group cursor-pointer">
                  <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button variant="ghost" className="text-white" size="sm">View</Button>
                    </div>
                    <div className="w-full h-full bg-blue-200 flex items-center justify-center">
                      <span className="text-xs text-blue-700">Electrical Panel</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative group cursor-pointer">
                  <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button variant="ghost" className="text-white" size="sm">View</Button>
                    </div>
                    <div className="w-full h-full bg-green-200 flex items-center justify-center">
                      <span className="text-xs text-green-700">Generator Room</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative group cursor-pointer">
                  <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button variant="ghost" className="text-white" size="sm">View</Button>
                    </div>
                    <div className="w-full h-full bg-purple-200 flex items-center justify-center">
                      <span className="text-xs text-purple-700">Facility Exterior</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}

export default function FacilitiesMap() {
  const { isAdmin } = useAuth();
  const [activeMapLayer, setActiveMapLayer] = useState<string>("status");
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  
  // Fetch facilities data
  const { 
    data: facilities = [],
    isLoading: facilitiesLoading, 
  } = useQuery<Facility[]>({
    queryKey: ["/api/facilities"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: isAdmin
  });

  const mockFacilities = [
    { 
      facility_id: 'SNF12345', 
      facility_name: 'Pinecrest Health', 
      address: '123 Pine Ave', 
      city: 'San Diego', 
      zip: '92101',
      county: 'San Diego',
      status: 'verification',
      latitude: 32.7157,
      longitude: -117.1611,
      num_beds: 120,
      certification_type: 'Skilled Nursing'
    },
    { 
      facility_id: 'SNF23456', 
      facility_name: 'Lakeside Care Center', 
      address: '456 Lake St', 
      city: 'Fresno', 
      zip: '93706',
      county: 'Fresno',
      status: 'installation',
      latitude: 36.7468,
      longitude: -119.7726,
      num_beds: 85,
      certification_type: 'Skilled Nursing & Rehabilitation'
    },
    { 
      facility_id: 'SNF34567', 
      facility_name: 'Golden Oaks Nursing', 
      address: '789 Oak Blvd', 
      city: 'Sacramento', 
      zip: '95814',
      county: 'Sacramento',
      status: 'support',
      latitude: 38.5816,
      longitude: -121.4944,
      num_beds: 150,
      certification_type: 'Skilled Nursing'
    },
    { 
      facility_id: 'SNF45678', 
      facility_name: 'Serenity Skilled Care', 
      address: '101 Serene Way', 
      city: 'San Jose', 
      zip: '95112',
      county: 'Santa Clara',
      status: 'verification',
      latitude: 37.3382,
      longitude: -121.8863,
      num_beds: 95,
      certification_type: 'Long-term Care'
    },
    { 
      facility_id: 'SNF56789', 
      facility_name: 'Bayview Nursing Home', 
      address: '202 Bay Dr', 
      city: 'Alameda', 
      zip: '94501',
      county: 'Alameda',
      status: 'compliant',
      latitude: 37.7749,
      longitude: -122.4194,
      num_beds: 70,
      certification_type: 'Skilled Nursing'
    },
  ] as Facility[];
  
  const allFacilities = facilities.length > 0 ? facilities : mockFacilities;
  
  // Map controls component
  const MapControls = () => {
    return (
      <Card className="w-64">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Map Layers</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-2 space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-medium">Facility Status</div>
            <Select value={activeMapLayer} onValueChange={setActiveMapLayer}>
              <SelectTrigger>
                <SelectValue placeholder="Select layer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">
                  <div className="flex items-center">
                    <Map className="h-4 w-4 mr-2" />
                    Facility Status (Default)
                  </div>
                </SelectItem>
                <SelectItem value="psps">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    PSPS Outage Areas
                  </div>
                </SelectItem>
                <SelectItem value="fire">
                  <div className="flex items-center">
                    <Flame className="h-4 w-4 mr-2" />
                    Fire Risk Zones
                  </div>
                </SelectItem>
                <SelectItem value="earthquake">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Earthquake Risk Zones
                  </div>
                </SelectItem>
                <SelectItem value="staff">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Staff Coverage Areas
                  </div>
                </SelectItem>
                <SelectItem value="response">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Response Time Rings
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="text-xs font-medium">Tools</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Layers className="h-3.5 w-3.5 mr-1" />
                Clusters
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Ruler className="h-3.5 w-3.5 mr-1" />
                Measure
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-3.5 w-3.5 mr-1" />
                Export
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="text-xs font-medium">Legend</div>
            <div className="space-y-1">
              <div className="flex items-center text-xs">
                <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
                Verification Needed
              </div>
              <div className="flex items-center text-xs">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                Ready for Installation
              </div>
              <div className="flex items-center text-xs">
                <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                Compliant
              </div>
              <div className="flex items-center text-xs">
                <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                High Risk
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const FacilityList = () => {
    return (
      <Card className="w-full h-[400px]">
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Facilities</CardTitle>
          <Input className="w-52 h-8" placeholder="Search facilities..." />
        </CardHeader>
        <ScrollArea className="h-[330px]">
          <div className="px-4 pb-4 space-y-1">
            {allFacilities.map((facility) => (
              <div 
                key={facility.facility_id}
                className={`flex items-center py-2 px-3 rounded-md cursor-pointer hover:bg-muted/50 ${selectedFacility?.facility_id === facility.facility_id ? 'bg-muted' : ''}`}
                onClick={() => setSelectedFacility(facility)}
              >
                <div className="mr-3">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{facility.facility_name}</div>
                  <div className="text-xs text-muted-foreground">{facility.city}, {facility.county} County</div>
                </div>
                <Badge variant="outline" className={
                  (facility as any).status === 'verification' ? 'bg-yellow-100 text-yellow-800' :
                  (facility as any).status === 'installation' ? 'bg-green-100 text-green-800' :
                  (facility as any).status === 'compliant' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }>
                  {capitalizeFirstLetter((facility as any).status || 'Unknown')}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    );
  };
  
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Facilities Map</h1>
          <p className="text-muted-foreground">
            Interactive map view of all SNFs with statuses and risk overlays
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
          {/* Controls and facility list column */}
          <div className="w-full lg:w-72 space-y-6">
            <MapControls />
            <FacilityList />
          </div>
          
          {/* Map view and facility detail */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className={`relative flex-1 ${selectedFacility ? 'lg:h-[60%]' : 'h-full'} bg-muted rounded-md`}>
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Map className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Interactive map would be rendered here with Leaflet or similar</p>
                  <p className="text-sm mt-2">Showing {allFacilities.length} facilities across California</p>
                </div>
              </div>
            </div>
            
            {selectedFacility && (
              <div className="mt-6 lg:h-[40%] overflow-hidden">
                <FacilityDetailPanel facility={selectedFacility} onClose={() => setSelectedFacility(null)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}