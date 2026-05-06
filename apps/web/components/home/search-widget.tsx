"use client";

import { useState } from "react";
import { Button, Input, Card } from "@/components/ui";
import { Search, Plane, Hotel, MapPin, Car } from "lucide-react";

export function SearchWidget() {
  const [activeTab, setActiveTab] = useState<
    "flights" | "hotels" | "tours" | "cars"
  >("flights");

  return (
    <Card className="max-w-4xl mx-auto -mt-20 shadow-xl">
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab("flights")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "flights"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plane className="h-4 w-4" />
            Flights
          </button>
          <button
            onClick={() => setActiveTab("hotels")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "hotels"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Hotel className="h-4 w-4" />
            Hotels
          </button>
          <button
            onClick={() => setActiveTab("tours")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "tours"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapPin className="h-4 w-4" />
            Tours
          </button>
          <button
            onClick={() => setActiveTab("cars")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "cars"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Car className="h-4 w-4" />
            Cars
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "flights" && (
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">From</label>
              <Input placeholder="Departure city" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">To</label>
              <Input placeholder="Destination" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Departure
              </label>
              <Input type="date" />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        )}

        {activeTab === "hotels" && (
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Destination
              </label>
              <Input placeholder="City or hotel" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Check-in</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Check-out
              </label>
              <Input type="date" />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        )}

        {activeTab === "tours" && (
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Destination
              </label>
              <Input placeholder="Where to?" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <Input type="date" />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        )}

        {activeTab === "cars" && (
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Pick-up</label>
              <Input placeholder="Location" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Pick-up Date
              </label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Drop-off Date
              </label>
              <Input type="date" />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
