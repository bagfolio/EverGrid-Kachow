import React, { useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PencilIcon, CheckIcon, Clock } from 'lucide-react';
import { Link } from 'wouter';
import Chart from 'chart.js/auto';

export function AssessmentOverview() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
              label: 'Monthly kWh Usage',
              data: [42000, 39000, 41000, 43500, 48000, 53000, 58000, 57000, 52000, 46000, 41000, 43000],
              backgroundColor: 'rgba(8, 145, 178, 0.6)',
              borderColor: 'rgba(8, 145, 178, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'kWh'
                }
              }
            }
          }
        });
      }
    }

    // Clean up chart instance on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h2 className="text-lg leading-6 font-medium text-gray-800">Assessment Overview</h2>
        <p className="mt-1 text-sm text-gray-500">Progress on your AB 2511 compliance assessment</p>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:p-6">
        <h3 className="text-md leading-6 font-medium text-gray-700 mb-3">Critical Load Profile</h3>
        <div className="overflow-hidden bg-gray-50 border border-gray-200 rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:items-center">
                <div className="mt-2 sm:mt-0 sm:mr-6">
                  <div className="text-sm text-gray-500">Peak Demand</div>
                  <div className="text-xl font-semibold text-gray-800">67 kW</div>
                </div>
                <div className="mt-2 sm:mt-0 sm:mr-6">
                  <div className="text-sm text-gray-500">Required Backup</div>
                  <div className="text-xl font-semibold text-gray-800">12 hours</div>
                </div>
                <div className="mt-2 sm:mt-0">
                  <div className="text-sm text-gray-500">Battery Size</div>
                  <div className="text-xl font-semibold text-gray-800">804 kWh</div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-700"
                  asChild
                >
                  <Link href="/assessment">
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Estimates
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Monthly load chart */}
        <div className="mt-5">
          <h3 className="text-md leading-6 font-medium text-gray-700 mb-3">Monthly Electricity Usage</h3>
          <div className="h-64 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <canvas ref={chartRef} className="w-full h-full" />
          </div>
        </div>
        
        {/* Compliance checklist summary */}
        <div className="mt-5">
          <h3 className="text-md leading-6 font-medium text-gray-700 mb-3">Compliance Requirements</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              <li className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-5 w-5 text-green-500">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">Facility profile completed</p>
                    </div>
                  </div>
                </div>
              </li>
              <li className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-5 w-5 text-amber-500">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">Load profile assessment in progress</p>
                    </div>
                  </div>
                </div>
              </li>
              <li className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-300">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Site photographs uploaded</p>
                    </div>
                  </div>
                </div>
              </li>
              <li className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-300">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Utility bills submitted</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50">
              <Link href="/compliance" className="text-sm font-medium text-primary-600 hover:text-primary-800">
                View complete compliance checklist &rarr;
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
