import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useFacility } from '@/lib/facility-context';
import { useToast } from '@/hooks/use-toast';
import Chart from 'chart.js/auto';

interface FinancialAssumptions {
  dieselCapEx: number;
  dieselOpEx: number;
  dieselFuelCostPerYear: number;
  batteryCapEx: number;
  batteryOpEx: number;
  outageFrequencyPerYear: number;
  fuelCostIncreasePercent: number;
  comparisonYears: number;
}

export function ROICalculator() {
  const [assumptions, setAssumptions] = useState<FinancialAssumptions>({
    dieselCapEx: 75000,
    dieselOpEx: 5000,
    dieselFuelCostPerYear: 12000,
    batteryCapEx: 120000,
    batteryOpEx: 2000,
    outageFrequencyPerYear: 3,
    fuelCostIncreasePercent: 5,
    comparisonYears: 5,
  });
  
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  const { updateProgress } = useFacility();
  const { toast } = useToast();

  // Calculate total costs for both options
  const calculateCosts = () => {
    // Diesel generator total cost over time
    let dieselTotal = assumptions.dieselCapEx;
    let annualDieselFuel = assumptions.dieselFuelCostPerYear;
    
    for (let year = 1; year <= assumptions.comparisonYears; year++) {
      dieselTotal += assumptions.dieselOpEx;
      dieselTotal += annualDieselFuel;
      // Increase fuel cost each year
      annualDieselFuel *= (1 + (assumptions.fuelCostIncreasePercent / 100));
    }
    
    // Battery system total cost over time
    let batteryTotal = assumptions.batteryCapEx;
    
    for (let year = 1; year <= assumptions.comparisonYears; year++) {
      batteryTotal += assumptions.batteryOpEx;
    }
    
    return {
      diesel: Math.round(dieselTotal),
      battery: Math.round(batteryTotal),
      savings: Math.round(dieselTotal - batteryTotal)
    };
  };

  const costs = calculateCosts();

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
              label: `${assumptions.comparisonYears}-Year Cost ($)`,
              data: [costs.diesel, costs.battery],
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
                title: {
                  display: true,
                  text: 'Total Cost ($)'
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
  }, [assumptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);
    
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setAssumptions(prev => ({
        ...prev,
        [name]: parsedValue
      }));
    }
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setAssumptions(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };

  const handleSaveAnalysis = () => {
    updateProgress('financial', true);
    
    toast({
      title: "Financial analysis saved",
      description: `Projected ${assumptions.comparisonYears}-year savings: $${costs.savings.toLocaleString()}`,
      duration: 3000,
    });
  };

  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-800">ROI Calculator</h2>
        <p className="text-gray-500">
          Compare costs between traditional diesel generators and mobile battery systems.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Diesel Generator</h3>
            
            <div>
              <Label htmlFor="dieselCapEx" className="text-gray-700">Capital Expense ($)</Label>
              <Input
                id="dieselCapEx"
                name="dieselCapEx"
                type="number"
                min="0"
                value={assumptions.dieselCapEx}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="dieselOpEx" className="text-gray-700">Annual Maintenance ($)</Label>
              <Input
                id="dieselOpEx"
                name="dieselOpEx"
                type="number"
                min="0"
                value={assumptions.dieselOpEx}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="dieselFuelCostPerYear" className="text-gray-700">Annual Fuel Cost ($)</Label>
              <Input
                id="dieselFuelCostPerYear"
                name="dieselFuelCostPerYear"
                type="number"
                min="0"
                value={assumptions.dieselFuelCostPerYear}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Mobile Battery System</h3>
            
            <div>
              <Label htmlFor="batteryCapEx" className="text-gray-700">Capital Expense ($)</Label>
              <Input
                id="batteryCapEx"
                name="batteryCapEx"
                type="number"
                min="0"
                value={assumptions.batteryCapEx}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="batteryOpEx" className="text-gray-700">Annual Maintenance ($)</Label>
              <Input
                id="batteryOpEx"
                name="batteryOpEx"
                type="number"
                min="0"
                value={assumptions.batteryOpEx}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4">Scenario Adjustments</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="outageFrequency" className="text-gray-700">Annual Outage Frequency</Label>
                <span className="text-gray-800">{assumptions.outageFrequencyPerYear} times/year</span>
              </div>
              <Slider
                id="outageFrequency"
                min={1}
                max={10}
                step={1}
                value={[assumptions.outageFrequencyPerYear]}
                onValueChange={(value) => handleSliderChange('outageFrequencyPerYear', value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="fuelIncrease" className="text-gray-700">Annual Fuel Cost Increase</Label>
                <span className="text-gray-800">{assumptions.fuelCostIncreasePercent}%</span>
              </div>
              <Slider
                id="fuelIncrease"
                min={0}
                max={20}
                step={1}
                value={[assumptions.fuelCostIncreasePercent]}
                onValueChange={(value) => handleSliderChange('fuelCostIncreasePercent', value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="comparisonYears" className="text-gray-700">Analysis Timeframe</Label>
                <span className="text-gray-800">{assumptions.comparisonYears} years</span>
              </div>
              <Slider
                id="comparisonYears"
                min={1}
                max={10}
                step={1}
                value={[assumptions.comparisonYears]}
                onValueChange={(value) => handleSliderChange('comparisonYears', value)}
                className="mt-2"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4">Cost Comparison</h3>
          
          <div className="h-80">
            <canvas ref={chartRef} />
          </div>
          
          <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800">Projected {assumptions.comparisonYears}-Year Savings</h4>
            <div className="flex justify-between items-center mt-2">
              <span className="text-green-700">Total Savings:</span>
              <span className="text-2xl font-bold text-green-700">${costs.savings.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4">
        <Button onClick={handleSaveAnalysis}>
          Save Financial Analysis
        </Button>
      </CardFooter>
    </Card>
  );
}
