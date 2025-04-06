import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Building2, MapPin, PhoneCall, Mail, Bed } from 'lucide-react';
import { useFacility } from '@/lib/facility-context';
import { Badge } from '@/components/ui/badge';

export function FacilitySnapshot() {
  const { selectedFacility } = useFacility();
  const [utilityBillUploaded, setUtilityBillUploaded] = useState(false);
  const [photosUploaded, setPhotosUploaded] = useState(false);
  
  useEffect(() => {
    // Load upload status from localStorage
    const billUploaded = localStorage.getItem('utilityBillUploaded') === 'true';
    const meterPhotoUploaded = localStorage.getItem('meterPhotoUploaded') === 'true';
    const panelPhotoUploaded = localStorage.getItem('panelPhotoUploaded') === 'true';
    const areaPhotoUploaded = localStorage.getItem('areaPhotoUploaded') === 'true';
    
    setUtilityBillUploaded(billUploaded);
    setPhotosUploaded(meterPhotoUploaded || panelPhotoUploaded || areaPhotoUploaded);
  }, []);

  if (!selectedFacility) {
    return (
      <Card className="bg-white overflow-hidden shadow rounded-lg border-muted">
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary/10 rounded-md p-3">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <div className="text-lg font-medium text-gray-900">No Facility Selected</div>
              <p className="text-sm text-muted-foreground">Please register a facility to view its details.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Define status badge color
  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">{status}</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="bg-white overflow-hidden shadow-md rounded-lg border-muted">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary/10 rounded-md p-3">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-foreground">{selectedFacility.facility_name}</h3>
              <p className="text-sm text-muted-foreground">{selectedFacility.type_of_care || "Skilled Nursing Facility"}</p>
            </div>
          </div>
          <div>
            {getStatusBadge(selectedFacility.status)}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">
              {selectedFacility.address}, {selectedFacility.city}, {selectedFacility.zip}
            </span>
          </div>
          
          {selectedFacility.contact_phone && (
            <div className="flex items-center text-sm">
              <PhoneCall className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">{selectedFacility.contact_phone}</span>
            </div>
          )}
          
          {selectedFacility.contact_email && (
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">{selectedFacility.contact_email}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm pt-1">
            <Bed className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">
              <span className="font-medium">{selectedFacility.num_beds}</span> beds
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 px-5 py-3 text-sm">
        <div className="w-full space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">County:</span>
            <span className="font-medium">{selectedFacility.county}</span>
          </div>
          {selectedFacility.certification_type && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Certification:</span>
              <span className="font-medium">{selectedFacility.certification_type}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Utility Bill:</span>
            <span className={utilityBillUploaded ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
              {utilityBillUploaded ? 'Uploaded' : 'Pending'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Site Photos:</span>
            <span className={photosUploaded ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
              {photosUploaded ? 'Uploaded' : 'Pending'}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
