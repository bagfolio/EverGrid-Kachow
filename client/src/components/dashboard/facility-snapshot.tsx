import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { useFacility } from '@/lib/facility-context';

export function FacilitySnapshot() {
  const { selectedFacility } = useFacility();

  if (!selectedFacility) {
    return (
      <Card className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
              <Building2 className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <div className="text-lg font-medium text-gray-900">No Facility Selected</div>
              <p className="text-sm text-gray-500">Please upload a facility CSV or select a facility.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
            <Building2 className="h-6 w-6 text-primary-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Facility Information
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{selectedFacility.facility_name}</div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <div className="font-medium text-gray-700">
            Status: <span className="text-green-600">{selectedFacility.status}</span>
          </div>
          <div className="mt-1 text-gray-600">
            {selectedFacility.address}, {selectedFacility.city}, {selectedFacility.zip}
          </div>
          <div className="mt-1 text-gray-600">
            Number of beds: {selectedFacility.num_beds}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
