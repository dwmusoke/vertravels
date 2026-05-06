'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@vertravels/ui';
import { Button } from '@vertravels/ui';
import { Plane, Hotel, Map, Car, PlusCircle } from 'lucide-react';
import Link from 'next/link';

const quickActions = [
  {
    title: 'Book Flight',
    href: '/flights',
    icon: Plane,
    description: 'Search flights',
  },
  {
    title: 'Book Hotel',
    href: '/hotels',
    icon: Hotel,
    description: 'Find accommodations',
  },
  {
    title: 'Book Tour',
    href: '/tours',
    icon: Map,
    description: 'Explore activities',
  },
  {
    title: 'Rent Car',
    href: '/cars',
    icon: Car,
    description: 'Find car rentals',
  },
];

export function QuickActions() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3 px-4"
            >
              <action.icon className="mr-3 h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Button>
          </Link>
        ))}

        <div className="pt-3 border-t">
          <Link href="/account/bookings">
            <Button variant="ghost" className="w-full justify-start">
              <PlusCircle className="mr-3 h-4 w-4" />
              New Booking
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
