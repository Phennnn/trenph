import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Zap } from 'lucide-react';

// This component receives all station data as a prop
export default function PlannerForm({ stationsData, onPlanCalculated }) {
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');
  const [line, setLine] = useState('LRT Line 1'); // Default line

  const handleCalculate = () => {
    // In a real app, you would call your prediction API here
    console.log(`Calculating route from ${startStation} to ${endStation} on ${line}`);
    // Then call the function passed from the parent to update the map
    onPlanCalculated({ start: startStation, end: endStation, line: line });
  };
  
  // Get stations for the currently selected line
  const availableStations = stationsData[line] || [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Plan Your Journey</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Select Line</label>
          <Select value={line} onValueChange={setLine}>
            <SelectTrigger>
              <SelectValue placeholder="Select a train line" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(stationsData).map(lineName => (
                <SelectItem key={lineName} value={lineName}>{lineName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Start Station</label>
          <Select onValueChange={setStartStation}>
            <SelectTrigger>
              <SelectValue placeholder="Select your starting point" />
            </SelectTrigger>
            <SelectContent>
              {availableStations.map(station => (
                <SelectItem key={station.id} value={station.name}>{station.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center">
            <Button variant="ghost" size="icon">
                <ArrowRightLeft className="h-4 w-4" />
            </Button>
        </div>

        <div>
          <label className="text-sm font-medium">Destination Station</label>
          <Select onValueChange={setEndStation}>
            <SelectTrigger>
              <SelectValue placeholder="Select your destination" />
            </SelectTrigger>
            <SelectContent>
              {availableStations.map(station => (
                <SelectItem key={station.id} value={station.name}>{station.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleCalculate} className="w-full bg-indigo-600 hover:bg-indigo-700">
          <Zap className="mr-2 h-4 w-4" />
          Calculate & Predict
        </Button>
      </div>
    </div>
  );
}