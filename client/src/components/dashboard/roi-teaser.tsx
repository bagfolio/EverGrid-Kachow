import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { Link } from 'wouter';
import Chart from 'chart.js/auto';

export function ROITeaser() {
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
            labels: ['Diesel Generator', 'Mobile Battery'],
            datasets: [{
              label: '5-Year Cost ($)',
              data: [120000, 85000],
              backgroundColor: [
                'rgba(239, 68, 68, 0.6)',
                'rgba(16, 185, 129, 0.6)'
              ],
              borderColor: [
                'rgba(239, 68, 68, 1)',
                'rgba(16, 185, 129, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `$${context.raw.toLocaleString()}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
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

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
            <DollarSign className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Financial Analysis
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">Potential 5-Year Savings</div>
              </dd>
            </dl>
          </div>
        </div>
        <div className="mt-4">
          <div style={{ height: '128px' }}>
            <canvas ref={chartRef} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-5 py-3">
        <Link href="/financial" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
          View full financial analysis &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}
