import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Chart from 'chart.js/auto';

interface MonthlyUsage {
  month: string;
  usage: number;
}

const monthlyData: MonthlyUsage[] = [
  { month: 'Jan', usage: 42000 },
  { month: 'Feb', usage: 39000 },
  { month: 'Mar', usage: 41000 },
  { month: 'Apr', usage: 43500 },
  { month: 'May', usage: 48000 },
  { month: 'Jun', usage: 53000 },
  { month: 'Jul', usage: 58000 },
  { month: 'Aug', usage: 57000 },
  { month: 'Sep', usage: 52000 },
  { month: 'Oct', usage: 46000 },
  { month: 'Nov', usage: 41000 },
  { month: 'Dec', usage: 43000 }
];

export function UsageChart() {
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
            labels: monthlyData.map(d => d.month),
            datasets: [{
              label: 'Monthly kWh Usage',
              data: monthlyData.map(d => d.usage),
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
                },
                ticks: {
                  callback: function(value) {
                    return value.toLocaleString();
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.raw.toLocaleString()} kWh`;
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
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-800">Monthly Electricity Usage</h2>
        <p className="text-gray-500">
          Historical energy consumption patterns over the past 12 months
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <canvas ref={chartRef} />
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>
            This chart represents the estimated electricity usage based on facility size and type.
            For more accurate analysis, please upload your actual utility bills.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
