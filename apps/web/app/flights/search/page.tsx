import { Suspense } from 'react';
import { SearchResults } from '@/components/flights/search-results';
import { SearchFilters } from '@/components/flights/search-filters';
import { FlightCard } from '@/components/flights/flight-card';

export default function FlightsSearchPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Flight Search Results</h1>
          <p className="mt-2 opacity-90">Find the best flights for your journey</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<div>Loading filters...</div>}>
              <SearchFilters />
            </Suspense>
          </aside>

          {/* Results */}
          <main className="lg:col-span-3 space-y-4">
            <Suspense fallback={<div>Loading flights...</div>}>
              <SearchResults />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
