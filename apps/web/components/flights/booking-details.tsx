'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Plane, Clock, MapPin, Calendar, Users, CreditCard, Download, Share2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function FlightBookingDetails() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('flights_bookings')
          .select('*')
          .eq('booking_ref_no', params.id)
          .single();

        if (error) throw error;
        setBooking(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBooking();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Booking Not Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find a booking with reference {params.id}
        </p>
        <Button onClick={() => router.push('/account/bookings')}>
          View My Bookings
        </Button>
      </div>
    );
  }

  const flightDetails = booking.flight_details as any[] || [];
  const guestInfo = booking.guest_info as any[] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Booking Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={booking.booking_status === 'confirmed' ? 'success' : 'warning'}>
                  {booking.booking_status}
                </Badge>
                <Badge variant={booking.payment_status === 'paid' ? 'success' : 'secondary'}>
                  {booking.payment_status}
                </Badge>
              </div>
              <CardTitle className="text-2xl">Flight Booking</CardTitle>
              <p className="text-muted-foreground">Reference: {booking.booking_ref_no}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Flight Itinerary */}
      {flightDetails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Flight Itinerary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {flightDetails.map((flight, index) => (
              <div key={index} className="border-b pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Plane className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{flight.airline}</p>
                      <p className="text-sm text-muted-foreground">Flight {flight.flight_number}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{flight.class || 'Economy'}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{flight.from}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(flight.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(flight.departure).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{flight.duration || '7h 00m'}</p>
                      <p className="text-xs text-muted-foreground">
                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-bold">{flight.to}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(flight.arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(flight.arrival).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Passenger Information */}
      {guestInfo.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Passenger Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {guestInfo.map((guest: any, index: number) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {guest.fname} {guest.lname}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>{' '}
                        <span className="font-medium capitalize">{guest.type || 'Adult'}</span>
                      </div>
                      {guest.passport && (
                        <div>
                          <span className="text-muted-foreground">Passport:</span>{' '}
                          <span className="font-medium">{guest.passport}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-semibold">
                {booking.currency} {Number(booking.total_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium capitalize">{booking.payment_gateway || 'Not specified'}</span>
            </div>
            {booking.transaction_id && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-medium text-xs">{booking.transaction_id}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking Date</span>
              <span className="font-medium">
                {new Date(booking.booking_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        {booking.booking_status === 'confirmed' && booking.payment_status === 'paid' && (
          <>
            <Button className="flex-1" onClick={() => router.push(`/invoice/${booking.booking_ref_no}`)}>
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
            <Button variant="outline" className="flex-1">
              Cancel Booking
            </Button>
          </>
        )}
        {booking.payment_status === 'unpaid' && (
          <Button 
            className="flex-1"
            onClick={() => router.push(`/payment?booking_ref=${booking.booking_ref_no}&amount=${booking.total_price}&currency=${booking.currency}`)}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Complete Payment
          </Button>
        )}
      </div>
    </div>
  );
}
