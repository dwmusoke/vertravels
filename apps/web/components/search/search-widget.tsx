'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { Plane, Hotel, Map, Car } from 'lucide-react';
import { FlightsSearch } from './flights-search';
import { HotelsSearch } from './hotels-search';
import { ToursSearch } from './tours-search';
import { CarsSearch } from './cars-search';

interface SearchWidgetProps {
  className?: string;
}

export function SearchWidget({ className }: SearchWidgetProps) {
  const [activeTab, setActiveTab] = useState('flights');

  const tabs = [
    { id: 'flights', label: 'Flights', icon: Plane, color: 'text-blue-600' },
    { id: 'hotels', label: 'Hotels', icon: Hotel, color: 'text-green-600' },
    { id: 'tours', label: 'Tours', icon: Map, color: 'text-yellow-600' },
    { id: 'cars', label: 'Cars', icon: Car, color: 'text-purple-600' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="flights" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab Navigation */}
        <div className="bg-card rounded-t-lg border-b">
          <TabsList className="bg-transparent h-auto p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 px-6 py-4 data-[state=active]:bg-background data-[state=active]:border-t data-[state=active]:border-l data-[state=active]:border-r data-[state=active]:rounded-t-lg data-[state=active]:border-b-0 rounded-none border border-transparent"
              >
                <tab.icon className={`h-5 w-5 ${tab.color}`} />
                <span className="font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="bg-card rounded-b-lg border border-t-0 p-6">
          <TabsContent value="flights" className="mt-0">
            <FlightsSearch />
          </TabsContent>
          <TabsContent value="hotels" className="mt-0">
            <HotelsSearch />
          </TabsContent>
          <TabsContent value="tours" className="mt-0">
            <ToursSearch />
          </TabsContent>
          <TabsContent value="cars" className="mt-0">
            <CarsSearch />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
