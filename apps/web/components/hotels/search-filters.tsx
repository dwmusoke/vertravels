'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui';
import { Slider } from '@/components/ui';
import { Checkbox } from '@/components/ui';
import { Button } from '@/components/ui';
import { Star, Filter, X } from 'lucide-react';

export function SearchFilters() {
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    stars: [] as string[],
    rating: 0,
    amenities: [] as string[],
    propertyType: [],
  });

  const amenities = [
    { id: 'wifi', label: 'Free WiFi' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'parking', label: 'Parking' },
    { id: 'gym', label: 'Fitness Center' },
    { id: 'pool', label: 'Swimming Pool' },
    { id: 'spa', label: 'Spa' },
    { id: 'pet', label: 'Pet Friendly' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilters({
            priceRange: [0, 500],
            stars: [],
            rating: 0,
            amenities: [],
            propertyType: [],
          })}
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Price Range */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-medium">Price Range (per night)</h3>
          <Slider
            value={filters.priceRange}
            min={0}
            max={500}
            step={10}
            onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}+</span>
          </div>
        </CardContent>
      </Card>

      {/* Star Rating */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <h3 className="font-medium">Star Rating</h3>
          {[5, 4, 3, 2].map((stars) => (
            <label key={stars} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={filters.stars.includes(stars.toString())}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({ ...filters, stars: [...filters.stars, stars.toString()] });
                  } else {
                    setFilters({ ...filters, stars: filters.stars.filter(s => s !== stars.toString()) });
                  }
                }}
              />
              <div className="flex">
                {[...Array(stars)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Guest Rating */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <h3 className="font-medium">Guest Rating</h3>
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => setFilters({ ...filters, rating })}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm">{rating}+ stars</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <h3 className="font-medium">Amenities</h3>
          {amenities.map((amenity) => (
            <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={filters.amenities.includes(amenity.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({ ...filters, amenities: [...filters.amenities, amenity.id] });
                  } else {
                    setFilters({ ...filters, amenities: filters.amenities.filter(a => a !== amenity.id) });
                  }
                }}
              />
              <span className="text-sm">{amenity.label}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Button className="w-full">
        <Filter className="mr-2 h-4 w-4" />
        Apply Filters
      </Button>
    </div>
  );
}
