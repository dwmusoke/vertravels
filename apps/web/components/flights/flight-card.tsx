"use client";

import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Plane, Clock, Zap, Shield, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  stopover?: string;
  price: number;
  currency: string;
  cabinClass: string;
  available: boolean;
}

interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
  onDetails?: (flight: Flight) => void;
}

export function FlightCard({ flight, onSelect, onDetails }: FlightCardProps) {
  const departureTime = new Date(flight.departure);
  const arrivalTime = new Date(flight.arrival);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Airline Info */}
          <div className="lg:col-span-2 flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plane className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{flight.airline}</p>
              <p className="text-sm text-muted-foreground">
                {flight.flightNumber}
              </p>
            </div>
          </div>

          {/* Flight Route */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-2xl font-bold">{flight.origin}</p>
                <p className="text-sm text-muted-foreground">
                  {format(departureTime, "h:mm a")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(departureTime, "MMM dd")}
                </p>
              </div>

              <div className="flex-1 px-4">
                <div className="relative">
                  <div className="border-t-2 border-dashed border-muted-foreground/50" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-1">
                  {flight.duration}
                  {flight.stops === 0
                    ? " • Non-stop"
                    : ` • ${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                  {flight.stopover && ` (${flight.stopover})`}
                </p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold">{flight.destination}</p>
                <p className="text-sm text-muted-foreground">
                  {format(arrivalTime, "h:mm a")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(arrivalTime, "MMM dd")}
                </p>
              </div>
            </div>
          </div>

          {/* Cabin Class */}
          <div className="lg:col-span-2 flex items-center">
            <Badge
              variant={
                flight.cabinClass === "business" ? "default" : "secondary"
              }
            >
              {flight.cabinClass === "economy" && "Economy"}
              {flight.cabinClass === "premium" && "Premium Economy"}
              {flight.cabinClass === "business" && "Business"}
              {flight.cabinClass === "first" && "First Class"}
            </Badge>
          </div>

          {/* Price & Booking */}
          <div className="lg:col-span-3 flex flex-col items-end justify-center space-y-2">
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                ${flight.price.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">per person</p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDetails?.(flight)}
              >
                <Zap className="h-4 w-4 mr-1" />
                Details
              </Button>
              <Button size="sm" onClick={() => onSelect?.(flight)}>
                Select
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>Free cancellation</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
