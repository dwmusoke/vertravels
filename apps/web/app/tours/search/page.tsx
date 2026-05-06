import { Suspense } from 'react';

export default function ToursSearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-yellow-500 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Tour Search Results</h1>
          <p className="mt-2 opacity-90">Discover amazing experiences and activities</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <p className="text-sm text-muted-foreground">Tour filters coming soon...</p>
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="bg-card rounded-lg border p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Tour Search Results</h2>
              <p className="text-muted-foreground">
                Tour search functionality is being prepared. Check back soon!
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
