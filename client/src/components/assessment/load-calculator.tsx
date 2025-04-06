import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useFacility } from '@/lib/facility-context';
import { useToast } from '@/hooks/use-toast';

export function LoadCalculator() {
  const [peakKw, setPeakKw] = useState(67);
  const [backupHours, setBackupHours] = useState(12);
  const [batterySize, setBatterySize] = useState(peakKw * backupHours);
  const { selectedFacility, updateProgress } = useFacility();
  const { toast } = useToast();

  useEffect(() => {
    // Calculate battery size (kWh) whenever peak kW or backup hours change
    setBatterySize(peakKw * backupHours);
  }, [peakKw, backupHours]);

  const handleSliderChange = (value: number[]) => {
    setBackupHours(value[0]);
  };

  const handlePeakKwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setPeakKw(value);
    }
  };

  const handleSaveEstimates = () => {
    // In a real app, this would save the estimates to the facility data
    updateProgress('assessment', true);
    
    toast({
      title: "Estimates saved",
      description: `Battery size estimate: ${batterySize} kWh has been saved.`,
      duration: 3000,
    });
  };

  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-800">Critical Load Calculator</h2>
        <p className="text-gray-500">
          Estimate your backup power requirements based on peak load and required backup time.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="peak-kw" className="text-gray-700">Peak Demand (kW)</Label>
          <div className="flex items-center mt-2">
            <Input
              id="peak-kw"
              type="number"
              min="0"
              step="0.1"
              value={peakKw}
              onChange={handlePeakKwChange}
              className="w-32"
            />
            <span className="ml-2 text-gray-500">kilowatts</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Enter your facility's peak power demand
          </p>
        </div>
        
        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="backup-hours" className="text-gray-700">Required Backup Time</Label>
            <span className="text-lg font-medium text-gray-800">{backupHours} hours</span>
          </div>
          <Slider
            id="backup-hours"
            min={4}
            max={24}
            step={1}
            value={[backupHours]}
            onValueChange={handleSliderChange}
            className="mt-2"
          />
          <p className="mt-1 text-sm text-gray-500">
            AB 2511 requires a minimum of 10 hours, we recommend 12+ hours
          </p>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Estimated Battery Size:</span>
            <span className="text-2xl font-bold text-primary-600">{batterySize} kWh</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            This is the minimum battery capacity needed to power your critical loads.
          </p>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4">
        <Button onClick={handleSaveEstimates}>
          Save Estimates
        </Button>
      </CardFooter>
    </Card>
  );
}
