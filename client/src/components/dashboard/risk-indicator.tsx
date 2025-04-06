import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AlertTriangle, Zap, Flame } from 'lucide-react';
import { useFacility } from '@/lib/facility-context';
import { Badge } from '@/components/ui/badge';

export function RiskIndicator() {
  const { selectedFacility } = useFacility();
  
  if (!selectedFacility) {
    return (
      <Card className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Risk Assessment
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    No data available
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Determine risk level based on various factors
  let riskLevel = 'LOW';
  let riskBadgeColor = 'bg-green-100 text-green-800';
  
  if (selectedFacility.in_psps_zone || selectedFacility.in_fire_zone) {
    riskLevel = 'MEDIUM';
    riskBadgeColor = 'bg-amber-100 text-amber-800';
  }
  
  if (selectedFacility.in_psps_zone && selectedFacility.in_fire_zone) {
    riskLevel = 'HIGH';
    riskBadgeColor = 'bg-red-100 text-red-800';
  }

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Risk Assessment
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">
                  <Badge className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskBadgeColor}`}>
                    {riskLevel} RISK
                  </Badge>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <div className="text-gray-600">Based on your location and facility profile</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-gray-600">
                PSPS Zone: <span className={selectedFacility.in_psps_zone ? "font-medium text-amber-600" : "font-medium text-gray-700"}>
                  {selectedFacility.in_psps_zone ? "Yes" : "No"}
                </span>
              </span>
            </div>
            <div className="flex items-center">
              <Flame className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-gray-600">
                Fire Zone: <span className={selectedFacility.in_fire_zone ? "font-medium text-amber-600" : "font-medium text-gray-700"}>
                  {selectedFacility.in_fire_zone ? "Yes" : "No"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
