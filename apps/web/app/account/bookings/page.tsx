'use client'

import { useEffect, useState, use } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useSupabase } from '@/components/providers/supabase-provider'
import { AccountLayout } from '@/components/layout/account-layout'
import { Card } from '@vertravels/ui'
import { Badge } from '@vertravels/ui'
import { Button } from '@vertravels/ui'
import { Select } from '@vertravels/ui'
import { DatePicker } from '@vertravels/ui'
import { Skeleton } from '@vertravels/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import {
  Plane,
  Hotel,
  MapPin,
  Car,
  FileText,
  Calendar,
  DollarSign,
  Download,
  Eye,
  XCircle,
  CheckCircle,
  Clock,
  Filter,
  Search
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
  passenger_name?: string
  hotel_name?: string
  tour_name?: string
  car_name?: string
  visa_type?: string
  destination?: string
}

const moduleIcons: Record<string, React.ReactNode> = {
  flights: <Plane className="w-4 h-4" />,
  hotels: <Hotel className="w-4 h-4" />,
  tours: <MapPin className="w-4 h-4" />,
  cars: <Car className="w-4 h-4" />,
  visa: <FileText className="w-4 h-4" />
}

const moduleLabels: Record<string, string> = {
  flights: 'Flight',
  hotels: 'Hotel',
  tours: 'Tour',
  cars: 'Car',
  visa: 'Visa'
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' }> = {
  confirmed: { label: 'Confirmed', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  cancelled: { label: 'Cancelled', variant: 'error' },
  completed: { label: 'Completed', variant: 'info' },
  refunded: { label: 'Refunded', variant: 'info' }
}

export default function AccountBookingsPage({ searchParams }: { searchParams: { module?: string } }) {
  const searchParamsObj = useSearchParams()
  const { session } = useSupabase()
  const supabase = createClientComponentClient()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filterModule, setFilterModule] = useState<string>(searchParams.module || searchParamsObj.get('module') || 'all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    if (session) {
      fetchBookings()
    }
  }, [session, filterModule, filterStatus, dateFrom, dateTo])

  async function fetchBookings() {
    try {
      setLoading(true)
      
      let query = supabase
        .from('bookings')
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .eq('user_id', session?.user?.id)
        .order('booking_date', { ascending: false })

      if (filterModule !== 'all') {
        query = query.eq('module_type', filterModule)
      }

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      if (dateFrom) {
        query = query.gte('booking_date', dateFrom)
      }

      if (dateTo) {
        query = query.lte('booking_date', dateTo)
      }

      const { data, error } = await query

      if (error) throw error

      const formattedBookings: Booking[] = (data || []).map((booking: any) => ({
        id: booking.id,
        booking_ref: booking.booking_ref,
        module_type: booking.module_type,
        status: booking.status,
        total_amount: booking.total_amount,
        currency: booking.currency || 'USD',
        booking_date: booking.booking_date,
        travel_date: booking.travel_date || booking.check_in_date || booking.start_date || booking.departure_date,
        customer_name: booking.profiles?.full_name || 'N/A',
        customer_email: booking.profiles?.email || booking.customer_email,
        passenger_name: booking.passenger_name,
        hotel_name: booking.hotel_name,
        tour_name: booking.tour_name,
        car_name: booking.car_name,
        visa_type: booking.visa_type,
        destination: booking.destination
      }))

      setBookings(formattedBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  function getBookingTitle(booking: Booking): string {
    switch (booking.module_type) {
      case 'flights':
        return booking.passenger_name || `Flight ${booking.booking_ref}`
      case 'hotels':
        return booking.hotel_name || `Hotel ${booking.booking_ref}`
      case 'tours':
        return booking.tour_name || `Tour ${booking.booking_ref}`
      case 'cars':
        return booking.car_name || `Car ${booking.booking_ref}`
      case 'visa':
        return booking.visa_type || `Visa ${booking.booking_ref}`
      default:
        return booking.booking_ref
    }
  }

  function filteredBookings() {
    if (!searchQuery) return bookings
    
    const query = searchQuery.toLowerCase()
    return bookings.filter(booking =>
      booking.booking_ref.toLowerCase().includes(query) ||
      getBookingTitle(booking).toLowerCase().includes(query) ||
      booking.destination?.toLowerCase().includes(query) ||
      booking.customer_email?.toLowerCase().includes(query)
    )
  }

  async function handleCancelBooking(bookingId: string) {
    if (!confirm('Are you sure you want to cancel this booking? Cancellation fees may apply.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (error) throw error

      fetchBookings()
    } catch (error) {
      console.error('Error cancelling booking:', error)
      alert('Failed to cancel booking. Please contact support.')
    }
  }

  return (
    <AccountLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">View and manage all your travel bookings</p>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="w-[180px]">
              <Select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="w-full"
              >
                <option value="all">All Modules</option>
                <option value="flights">Flights</option>
                <option value="hotels">Hotels</option>
                <option value="tours">Tours</option>
                <option value="cars">Cars</option>
                <option value="visa">Visa</option>
              </Select>
            </div>

            <div className="w-[180px]">
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </Select>
            </div>

            <div className="w-[150px]">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="From"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            <div className="w-[150px]">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="To"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {(filterModule !== 'all' || filterStatus !== 'all' || dateFrom || dateTo || searchQuery) && (
              <Button
                variant="outline"
                onClick={() => {
                  setFilterModule('all')
                  setFilterStatus('all')
                  setDateFrom('')
                  setDateTo('')
                  setSearchQuery('')
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </Card>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-48 h-4" />
                    <Skeleton className="w-32 h-3" />
                  </div>
                  <Skeleton className="w-24 h-8" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredBookings().length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterModule !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Start by making your first booking'}
            </p>
            {!searchQuery && filterModule === 'all' && filterStatus === 'all' && (
              <Button asChild>
                <a href="/">Search for Travel</a>
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredBookings().map((booking) => (
              <Card key={booking.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  {/* Module Icon */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    booking.module_type === 'flights' ? 'bg-sky-100 text-sky-600' :
                    booking.module_type === 'hotels' ? 'bg-green-100 text-green-600' :
                    booking.module_type === 'tours' ? 'bg-yellow-100 text-yellow-600' :
                    booking.module_type === 'cars' ? 'bg-purple-100 text-purple-600' :
                    'bg-pink-100 text-pink-600'
                  }`}>
                    {moduleIcons[booking.module_type]}
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {moduleLabels[booking.module_type]}
                      </span>
                      <Badge variant={statusConfig[booking.status]?.variant || 'info'}>
                        {statusConfig[booking.status]?.label || booking.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate">
                      {getBookingTitle(booking)}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(booking.travel_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {formatCurrency(booking.total_amount, booking.currency)}
                      </span>
                      <span>#{booking.booking_ref}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/invoice/${booking.booking_ref}`}>
                        <Download className="w-4 h-4 mr-1" />
                        Invoice
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/${booking.module_type}/${booking.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </a>
                    </Button>
                    {booking.status === 'confirmed' || booking.status === 'pending' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {!loading && bookings.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
              <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-gray-600 mb-1">Confirmed</div>
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-gray-600 mb-1">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-gray-600 mb-1">Total Spent</div>
              <div className="text-2xl font-bold text-sky-600">
                {formatCurrency(
                  bookings
                    .filter(b => b.status !== 'cancelled')
                    .reduce((sum, b) => sum + b.total_amount, 0),
                  'USD'
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </AccountLayout>
  )
}
