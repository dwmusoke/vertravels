'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@vertravels/ui';
import { Slider } from '@vertravels/ui';
import { Checkbox } from '@vertravels/ui';
import { Button } from '@vertravels/ui';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@vertravels/ui';
import { Filter, X } from 'lucide-react';

export function SearchFilters() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    stops: [] as string[],
    airlines: [] as string[],
    departureTime: '',
    arrivalTime: '',
    cabinClass: [],
  });

  const airlines = [
    { code: 'AA', name: 'American Airlines' },
    { code: 'DL', name: 'Delta Air Lines' },
    { code: 'UA', name: 'United Airlines' },
    { code: 'BA', name: 'British Airways' },
    { code: 'LH', name: 'Lufthansa' },
    { code: 'AF', name: 'Air France' },
    { code: 'EK', name: 'Emirates' },
    { code: 'QR', name: 'Qatar Airways' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilters({
            priceRange: [0, 2000],
            stops: [],
            airlines: [],
            departureTime: '',
            arrivalTime: '',
            cabinClass: [],
          })}
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Price Range */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-medium">Price Range</h3>
          <div className="space-y-2">
            <Slider
              value={filters.priceRange}
              min={0}
              max={2000}
              step={50}
              onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}+</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stops */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <h3 className="font-medium">Stops</h3>
          {['Non-stop', '1 Stop', '2+ Stops'].map((stop) => (
            <label key={stop} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={filters.stops.includes(stop)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({ ...filters, stops: [...filters.stops, stop] });
                  } else {
                    setFilters({ ...filters, stops: filters.stops.filter(s => s !== stop) });
                  }
                }}
              />
              <span className="text-sm">{stop}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Airlines */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <h3 className="font-medium">Airlines</h3>
          {airlines.map((airline) => (
            <label key={airline.code} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={filters.airlines.includes(airline.code)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({ ...filters, airlines: [...filters.airlines, airline.code] });
                  } else {
                    setFilters({ ...filters, airlines: filters.airlines.filter(a => a !== airline.code) });
                  }
                }}
              />
              <span className="text-sm">{airline.name}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Departure Time */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <h3 className="font-medium">Departure Time</h3>
          <Select
            value={filters.departureTime}
            onValueChange={(value) => setFilters({ ...filters, departureTime: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
              <SelectItem value="evening">Evening (6PM - 12AM)</SelectItem>
              <SelectItem value="night">Night (12AM - 6AM)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Apply Button */}
      <Button className="w-full">
        <Filter className="mr-2 h-4 w-4" />
        Apply Filters
      </Button>
    </div>
  );
}
