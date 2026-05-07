'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Hotel, Calendar, Users, MapPin, Star, CreditCard, Download, Phone, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface HotelBookingDetailsProps {
  bookingRef: string;
}

export function HotelBookingDetails({ bookingRef }: HotelBookingDetailsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [hotel, setHotel] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const supabase = createClient();
        
        // Fetch booking
        const { data: bookingData, error: bookingError } = await supabase
          .from('hotels_bookings')
          .select('*')
          .eq('booking_ref_no', bookingRef)
          .single();

        if (bookingError) throw bookingError;
        setBooking(bookingData);

        // Fetch hotel details
        if (bookingData.hotel_id) {
          const { data: hotelData } = await supabase
            .from('hotels')
            .select('*')
            .eq('id', bookingData.hotel_id)
            .single();
          
          if (hotelData) setHotel(hotelData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingRef]);

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
          We couldn't find a booking with reference {bookingRef}
        </p>
        <Button onClick={() => router.push('/account/bookings')}>
          View My Bookings
        </Button>
      </div>
    );
  }

  const checkIn = new Date(booking.check_in_date);
  const checkOut = new Date(booking.check_out_date);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

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
              <CardTitle className="text-2xl">Hotel Booking</CardTitle>
              <p className="text-muted-foreground">Reference: {booking.booking_ref_no}</p>
            </div>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Hotel Information */}
      {hotel && (
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Hotel Image */}
              <div className="md:col-span-1">
                <div className="h-48 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {hotel.images?.[0] ? (
                    <img 
                      src={hotel.images[0]} 
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Hotel className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Hotel Details */}
              <div className="md:col-span-2 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold">{hotel.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(hotel.stars || 0)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      {hotel.rating && (
                        <span className="text-sm text-muted-foreground">
                          {hotel.rating} ({hotel.review_count || 0} reviews)
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline">{booking.number_of_rooms} Room(s)</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
                  </div>
                  {hotel.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{hotel.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Booking Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Check-in</p>
                <p className="text-lg font-semibold">
                  {checkIn.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-muted-foreground">From 2:00 PM</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Check-out</p>
                <p className="text-lg font-semibold">
                  {checkOut.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-muted-foreground">Until 11:00 AM</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-lg font-semibold">{nights} night{nights > 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Guests</p>
                <p className="text-lg font-semibold">
                  {booking.number_of_guests} guest{booking.number_of_guests > 1 ? 's' : ''}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Booking Date</p>
                <p className="text-lg font-semibold">
                  {new Date(booking.booking_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guest Information */}
      {booking.guest_info && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Guest Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(booking.guest_info as any[]).map((guest: any, index: number) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {guest.fname} {guest.lname}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      {guest.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{guest.email}</span>
                        </div>
                      )}
                      {guest.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{guest.phone}</span>
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
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-primary">
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
            {booking.confirmation_code && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hotel Confirmation</span>
                <span className="font-medium">{booking.confirmation_code}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        {booking.booking_status === 'confirmed' && booking.payment_status === 'paid' ? (
          <>
            <Button className="flex-1" onClick={() => router.push(`/invoice/${booking.booking_ref_no}`)}>
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
            <Button variant="outline" className="flex-1">
              Contact Hotel
            </Button>
          </>
        ) : booking.payment_status === 'unpaid' ? (
          <Button 
            className="w-full"
            onClick={() => router.push(`/payment?booking_ref=${booking.booking_ref_no}&amount=${booking.total_price}&currency=${booking.currency}`)}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Complete Payment
          </Button>
        ) : null}
      </div>
    </div>
  );
}
