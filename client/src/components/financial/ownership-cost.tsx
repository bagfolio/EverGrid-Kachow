import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import Chart from 'chart.js/auto';

interface YearlyBreakdown {
  diesel: {
    capital: number;
    maintenance: number;
    fuel: number;
  };
  battery: {
    capital: number;
    maintenance: number;
    energyCost: number;
  };
}

export function OwnershipCost() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  // Sample 5-year cost breakdown data
  const yearlyData: YearlyBreakdown[] = [
    {
      diesel: { capital: 75000, maintenance: 5000, fuel: 12000 },
      battery: { capital: 120000, maintenance: 2000, energyCost: 0 }
    },
    {
      diesel: { capital: 0, maintenance: 5000, fuel: 12600 },
      battery: { capital: 0, maintenance: 2000, energyCost: 0 }
    },
    {
      diesel: { capital: 0, maintenance: 5000, fuel: 13230 },
      battery: { capital: 0, maintenance: 2000, energyCost: 0 }
    },
    {
      diesel: { capital: 0, maintenance: 5000, fuel: 13892 },
      battery: { capital: 0, maintenance: 2000, energyCost: 0 }
    },
    {
      diesel: { capital: 0, maintenance: 5000, fuel: 14586 },
      battery: { capital: 0, maintenance: 2000, energyCost: 0 }
    }
  ];

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Prepare data for stacked bar chart
        const years = Array.from({ length: 5 }, (_, i) => `Year ${i + 1}`);
        
        // Calculate cumulative totals for both options
        const dieselCumulative = years.map((_, i) => {
          return yearlyData.slice(0, i + 1).reduce((sum, year) => {
            return sum + year.diesel.capital + year.diesel.maintenance + year.diesel.fuel;
          }, 0);
        });
        
        const batteryCumulative = years.map((_, i) => {
          return yearlyData.slice(0, i + 1).reduce((sum, year) => {
            return sum + year.battery.capital + year.battery.maintenance + year.battery.energyCost;
          }, 0);
        });

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: years,
            datasets: [
              {
                label: 'Diesel Generator (Cumulative)',
                data: dieselCumulative,
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.1
              },
              {
                label: 'Battery System (Cumulative)',
                data: batteryCumulative,
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Cumulative Cost ($)'
                },
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
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

  // Calculate total costs for both options over 5 years
  const totalDieselCost = yearlyData.reduce((sum, year) => {
    return sum + year.diesel.capital + year.diesel.maintenance + year.diesel.fuel;
  }, 0);
  
  const totalBatteryCost = yearlyData.reduce((sum, year) => {
    return sum + year.battery.capital + year.battery.maintenance + year.battery.energyCost;
  }, 0);
  
  const savings = totalDieselCost - totalBatteryCost;

  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-800">5-Year Ownership Cost</h2>
        <p className="text-gray-500">
          Detailed breakdown of cumulative costs over time
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <canvas ref={chartRef} />
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-medium text-red-800">Diesel Generator (Traditional)</h3>
            <ul className="mt-2 space-y-1">
              <li className="flex justify-between text-sm">
                <span className="text-red-700">Capital Expense:</span>
                <span className="font-medium">${yearlyData[0].diesel.capital.toLocaleString()}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-red-700">Maintenance (5 years):</span>
                <span className="font-medium">
                  ${yearlyData.reduce((sum, year) => sum + year.diesel.maintenance, 0).toLocaleString()}
                </span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-red-700">Fuel (5 years):</span>
                <span className="font-medium">
                  ${yearlyData.reduce((sum, year) => sum + year.diesel.fuel, 0).toLocaleString()}
                </span>
              </li>
              <li className="flex justify-between text-sm font-bold pt-1 border-t border-red-200 mt-1">
                <span className="text-red-800">Total:</span>
                <span>${totalDieselCost.toLocaleString()}</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-800">Mobile Battery System</h3>
            <ul className="mt-2 space-y-1">
              <li className="flex justify-between text-sm">
                <span className="text-green-700">Capital Expense:</span>
                <span className="font-medium">${yearlyData[0].battery.capital.toLocaleString()}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-green-700">Maintenance (5 years):</span>
                <span className="font-medium">
                  ${yearlyData.reduce((sum, year) => sum + year.battery.maintenance, 0).toLocaleString()}
                </span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-green-700">Energy Cost (5 years):</span>
                <span className="font-medium">
                  ${yearlyData.reduce((sum, year) => sum + year.battery.energyCost, 0).toLocaleString()}
                </span>
              </li>
              <li className="flex justify-between text-sm font-bold pt-1 border-t border-green-200 mt-1">
                <span className="text-green-800">Total:</span>
                <span>${totalBatteryCost.toLocaleString()}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-blue-800">Total 5-Year Savings with Battery System:</h3>
            <span className="text-2xl font-bold text-blue-700">
              ${Math.max(0, savings).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4">
        <p className="text-sm text-gray-500">
          This analysis includes initial capital expenses, maintenance, and operating costs over a 5-year period.
          Actual savings may vary based on fuel prices, usage patterns, and incentives.
        </p>
      </CardFooter>
    </Card>
  );
}
