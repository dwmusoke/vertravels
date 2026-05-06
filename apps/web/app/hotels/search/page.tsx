import { Suspense } from 'react';
import { SearchResults } from '@/components/hotels/search-results';
import { SearchFilters } from '@/components/hotels/search-filters';

export default function HotelsSearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-green-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Hotel Search Results</h1>
          <p className="mt-2 opacity-90">Find the perfect accommodation for your stay</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <Suspense fallback={<div>Loading filters...</div>}>
              <SearchFilters />
            </Suspense>
          </aside>

          <main className="lg:col-span-3 space-y-4">
            <Suspense fallback={<div>Loading hotels...</div>}>
              <SearchResults />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
