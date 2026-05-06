'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card } from '@vertravels/ui'
import { Button } from '@vertravels/ui'
import { Badge } from '@vertravels/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Plane,
  Hotel,
  MapPin,
  Car,
  FileText,
  Download,
  Mail,
  Printer,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  User,
  CreditCard,
  MapPin as MapPinIcon
} from 'lucide-react'

interface Booking {
  id: string
  booking_ref: string
  module_type: string
  status: string
  total_amount: number
  currency: string
  booking_date: string
  travel_date: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  passenger_name?: string
  passenger_email?: string
  passenger_phone?: string
  hotel_name?: string
  hotel_address?: string
  tour_name?: string
  tour_location?: string
  car_name?: string
  pickup_location?: string
  dropoff_location?: string
  visa_type?: string
  destination?: string
  payment_method?: string
  payment_status?: string
  notes?: string
  cancellation_policy?: string
  itinerary?: any
  room_type?: string
  guests?: number
  nights?: number
  duration?: number
  car_type?: string
  transmission?: string
  flight_details?: any
}

const moduleIcons: Record<string, React.ReactNode> = {
  flights: <Plane className="w-6 h-6" />,
  hotels: <Hotel className="w-6 h-6" />,
  tours: <MapPin className="w-6 h-6" />,
  cars: <Car className="w-6 h-6" />,
  visa: <FileText className="w-6 h-6" />
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' }> = {
  confirmed: { label: 'Confirmed', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  cancelled: { label: 'Cancelled', variant: 'error' },
  completed: { label: 'Completed', variant: 'info' },
  refunded: { label: 'Refunded', variant: 'info' }
}

export default function InvoicePage({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooking()
  }, [params.id])

  async function fetchBooking() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_ref', params.id)
        .single()

      if (error) throw error

      setBooking(data as Booking)
    } catch (error) {
      console.error('Error fetching booking:', error)
    } finally {
      setLoading(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  async function handleEmailInvoice() {
    const email = prompt('Enter email address to send invoice:')
    if (!email) return

    try {
      // In production, this would call an API endpoint to send the invoice
      alert('Invoice sent to ' + email)
    } catch (error) {
      console.error('Error sending invoice:', error)
      alert('Failed to send invoice. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-4">
            The booking you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/account/bookings">View My Bookings</a>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Action Buttons - Hidden when printing */}
        <div className="flex justify-end gap-2 mb-6 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleEmailInvoice}>
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button asChild>
            <a href="/account/bookings">Back to Bookings</a>
          </Button>
        </div>

        {/* Invoice */}
        <Card className="p-8 print:shadow-none print:border">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">VerTravels</h1>
                  <p className="text-sm text-gray-600">Your Trusted Travel Partner</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <p>123 Travel Street</p>
                <p>Travel City, TC 12345</p>
                <p>support@vertravels.com</p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-sky-600 mb-2">INVOICE</h2>
              <p className="text-gray-600">#{booking.booking_ref}</p>
              <Badge className="mt-2" variant={statusConfig[booking.status]?.variant || 'info'}>
                {statusConfig[booking.status]?.label || booking.status}
              </Badge>
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Information
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{booking.customer_name}</p>
                <p>{booking.customer_email}</p>
                {booking.customer_phone && <p>{booking.customer_phone}</p>}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Booking Information
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Booking Date: <span className="font-medium text-gray-900">{formatDate(booking.booking_date)}</span></p>
                <p>Travel Date: <span className="font-medium text-gray-900">{formatDate(booking.travel_date)}</span></p>
                <p>Booking Ref: <span className="font-medium text-gray-900">#{booking.booking_ref}</span></p>
              </div>
            </div>
          </div>

          {/* Module Specific Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                booking.module_type === 'flights' ? 'bg-sky-100 text-sky-600' :
                booking.module_type === 'hotels' ? 'bg-green-100 text-green-600' :
                booking.module_type === 'tours' ? 'bg-yellow-100 text-yellow-600' :
                booking.module_type === 'cars' ? 'bg-purple-100 text-purple-600' :
                'bg-pink-100 text-pink-600'
              }`}>
                {moduleIcons[booking.module_type]}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 capitalize">{booking.module_type} Booking</h3>
                <p className="text-sm text-gray-600">
                  {booking.module_type === 'flights' && booking.passenger_name}
                  {booking.module_type === 'hotels' && booking.hotel_name}
                  {booking.module_type === 'tours' && booking.tour_name}
                  {booking.module_type === 'cars' && booking.car_name}
                  {booking.module_type === 'visa' && `${booking.visa_type} - ${booking.destination}`}
                </p>
              </div>
            </div>

            {/* Module Specific Details */}
            {booking.module_type === 'hotels' && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Hotel</p>
                  <p className="font-medium text-gray-900">{booking.hotel_name}</p>
                </div>
                {booking.hotel_address && (
                  <div>
                    <p className="text-gray-600">Address</p>
                    <p className="font-medium text-gray-900">{booking.hotel_address}</p>
                  </div>
                )}
                {booking.room_type && (
                  <div>
                    <p className="text-gray-600">Room Type</p>
                    <p className="font-medium text-gray-900">{booking.room_type}</p>
                  </div>
                )}
                {booking.guests && (
                  <div>
                    <p className="text-gray-600">Guests</p>
                    <p className="font-medium text-gray-900">{booking.guests}</p>
                  </div>
                )}
                {booking.nights && (
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{booking.nights} nights</p>
                  </div>
                )}
              </div>
            )}

            {booking.module_type === 'flights' && booking.flight_details && (
              <div className="text-sm">
                <p className="text-gray-600 mb-2">Flight Itinerary</p>
                <pre className="bg-white rounded p-3 text-gray-900 overflow-x-auto">
                  {JSON.stringify(booking.flight_details, null, 2)}
                </pre>
              </div>
            )}

            {booking.module_type === 'cars' && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                {booking.pickup_location && (
                  <div>
                    <p className="text-gray-600">Pickup Location</p>
                    <p className="font-medium text-gray-900">{booking.pickup_location}</p>
                  </div>
                )}
                {booking.dropoff_location && (
                  <div>
                    <p className="text-gray-600">Drop-off Location</p>
                    <p className="font-medium text-gray-900">{booking.dropoff_location}</p>
                  </div>
                )}
                {booking.car_type && (
                  <div>
                    <p className="text-gray-600">Car Type</p>
                    <p className="font-medium text-gray-900">{booking.car_type}</p>
                  </div>
                )}
                {booking.transmission && (
                  <div>
                    <p className="text-gray-600">Transmission</p>
                    <p className="font-medium text-gray-900 capitalize">{booking.transmission}</p>
                  </div>
                )}
              </div>
            )}

            {booking.module_type === 'tours' && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                {booking.tour_location && (
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{booking.tour_location}</p>
                  </div>
                )}
                {booking.duration && (
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{booking.duration} days</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Information */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium text-gray-900 capitalize">{booking.payment_method || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Payment Status</span>
                <Badge variant={booking.payment_status === 'paid' ? 'success' : 'warning'}>
                  {booking.payment_status || 'Pending'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total Amount</span>
              <span className="text-3xl font-bold text-sky-600">
                {formatCurrency(booking.total_amount, booking.currency || 'USD')}
              </span>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-700">{booking.notes}</p>
            </div>
          )}

          {/* Cancellation Policy */}
          {booking.cancellation_policy && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h3>
              <p className="text-sm text-gray-700">{booking.cancellation_policy}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
            <p className="mb-2">Thank you for booking with VerTravels!</p>
            <p>For any questions or support, please contact us at support@vertravels.com</p>
            <p className="mt-4 text-xs">
              This is a computer-generated invoice. No signature required.
            </p>
          </div>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border {
            border: 1px solid #e5e7eb !important;
          }
        }
      `}</style>
    </div>
  )
}
