"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@vertravels/ui";
import { Badge } from "@vertravels/ui";
import { Button } from "@vertravels/ui";
import { ArrowRight, Plane, Hotel, Map, Car } from "lucide-react";
import Link from "next/link";

const bookings = [
  {
    id: "VT-2024-001",
    type: "flights",
    title: "New York to Paris",
    date: "Jan 15, 2024",
    status: "confirmed",
    amount: "$850",
    icon: Plane,
  },
  {
    id: "VT-2024-002",
    type: "hotels",
    title: "Hotel Le Marais, Paris",
    date: "Jan 15-20, 2024",
    status: "confirmed",
    amount: "$650",
    icon: Hotel,
  },
  {
    id: "VT-2024-003",
    type: "tours",
    title: "Paris City Tour",
    date: "Jan 16, 2024",
    status: "pending",
    amount: "$120",
    icon: Map,
  },
  {
    id: "VT-2024-004",
    type: "cars",
    title: "Car Rental - Paris",
    date: "Jan 15-20, 2024",
    status: "confirmed",
    amount: "$280",
    icon: Car,
  },
];

function getModuleColor(
  type: string,
): "default" | "flights" | "hotels" | "tours" | "cars" | "visa" {
  const colors: Record<
    string,
    "default" | "flights" | "hotels" | "tours" | "cars" | "visa"
  > = {
    flights: "flights",
    hotels: "hotels",
    tours: "tours",
    cars: "cars",
  };
  return colors[type] || "default";
}

export function RecentBookings() {
  return (
    <Card className="md:col-span-5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Bookings</CardTitle>
        <Link href="/account/bookings">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card"
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <booking.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{booking.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.id} • {booking.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={getModuleColor(booking.type)}>
                  {booking.status}
                </Badge>
                <span className="font-medium">{booking.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
