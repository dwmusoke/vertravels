'use client';

import { Card, CardContent } from '@vertravels/ui';
import { Calendar, DollarSign, Plane, Hotel } from 'lucide-react';

export function DashboardStats() {
  // These would be fetched from the API
  const stats = [
    {
      title: 'Total Bookings',
      value: '12',
      icon: Calendar,
      change: '+2 this month',
      changeType: 'positive',
    },
    {
      title: 'Total Spent',
      value: '$4,250',
      icon: DollarSign,
      change: '+$350 this month',
      changeType: 'positive',
    },
    {
      title: 'Upcoming Trips',
      value: '3',
      icon: Plane,
      change: 'Next: Paris in 5 days',
      changeType: 'neutral',
    },
    {
      title: 'Loyalty Points',
      value: '8,500',
      icon: Hotel,
      change: '500 points to Gold status',
      changeType: 'positive',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
