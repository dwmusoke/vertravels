'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Card } from '@vertravels/ui'
import { Button } from '@vertravels/ui'
import { Input } from '@vertravels/ui'
import { Label } from '@vertravels/ui'
import { Badge } from '@vertravels/ui'
import { PaymentGatewaySelector } from '@/components/payment/payment-gateway-selector'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useSupabase } from '@/components/providers/supabase-provider'
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Star,
  Shield,
  CreditCard,
  ChevronLeft
} from 'lucide-react'

interface Tour {
  id: string
  name: string
  description: string
  location: string
  address: string
  duration: number
  duration_type: string
  category: string
  min_price: number
  currency: string
  rating: number
  review_count: number
  image: string
  images: string[]
  available: boolean
  cancellation_policy: string
  highlights: string[]
  includes: string[]
  excludes: string[]
  itinerary: any[]
}

interface BookingData {
  tour_id: string
  tour_date: string
  adults: number
  children: number
  infants: number
  customer_name: string
  customer_email: string
  customer_phone: string
  special_requests: string
  payment_method: string
}

export default function TourBookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { session } = useSupabase()
  const supabase = createClientComponentClient()
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [formData, setFormData] = useState<BookingData>({
    tour_id: params.id,
    tour_date: '',
    adults: 2,
    children: 0,
    infants: 0,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    special_requests: '',
    payment_method: ''
  })

  useEffect(() => {
    fetchTour()
    if (session?.user) {
      fetchUserProfile()
    }
  }, [params.id, session])

  async function fetchTour() {
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setTour(data as Tour)
    } catch (error) {
      console.error('Error fetching tour:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchUserProfile() {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', session?.user?.id)
        .single()

      if (data) {
        setFormData(prev => ({
          ...prev,
          customer_name: data.full_name || '',
          customer_email: data.email || '',
          customer_phone: data.phone || ''
        }))
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  function calculateTotal() {
    if (!tour) return 0
    const guests = formData.adults + formData.children
    return tour.min_price * guests
  }

  async function handleBooking() {
    if (!session) {
      router.push(`/login?redirect=/tours/${params.id}`)
      return
    }

    if (!formData.tour_date) {
      alert('Please select a tour date')
      return
    }

    if (!formData.customer_name || !formData.customer_email) {
      alert('Please fill in all required fields')
      return
    }

    setShowPayment(true)
  }

  async function confirmBooking(paymentDetails: any) {
    try {
      setProcessing(true)

      const bookingRef = 'TOUR' + Date.now().toString().slice(-6)

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          booking_ref: bookingRef,
          user_id: session?.user?.id,
          module_type: 'tours',
          tour_id: params.id,
          tour_name: tour?.name,
          tour_location: tour?.location,
          travel_date: formData.tour_date,
          adults: formData.adults,
          children: formData.children,
          infants: formData.infants,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          special_requests: formData.special_requests,
          total_amount: calculateTotal(),
          currency: tour?.currency || 'USD',
          payment_method: paymentDetails.gateway,
          payment_status: 'pending',
          status: 'pending',
          cancellation_policy: tour?.cancellation_policy,
          itinerary: tour?.itinerary
        })
        .select()
        .single()

      if (error) throw error

      // Redirect to payment
      const paymentParams = new URLSearchParams({
        amount: calculateTotal().toString(),
        currency: tour?.currency || 'USD',
        gateway: paymentDetails.gateway,
        booking_id: data.id,
        booking_ref: bookingRef,
        redirect_url: window.location.origin + '/payment/success'
      })

      router.push(`/payment?${paymentParams.toString()}`)
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tour details...</p>
        </div>
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tour Not Found</h1>
          <p className="text-gray-600 mb-4">
            The tour you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/tours">Browse Tours</a>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tour Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <Card className="overflow-hidden">
              <div className="relative h-64 md:h-80">
                <img
                  src={tour.image || '/placeholder-tour.jpg'}
                  alt={tour.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="success">Available</Badge>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{tour.location}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{tour.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{tour.rating}</span>
                    <span className="text-gray-600">({tour.review_count} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{tour.duration} {tour.duration_type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 capitalize">{tour.category}</span>
                  </div>
                </div>
                <p className="text-gray-700">{tour.description}</p>
              </div>
            </Card>

            {/* Highlights */}
            {tour.highlights?.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tour Highlights</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tour.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* What's Included */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {tour.includes?.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Excluded
                  </h3>
                  <ul className="space-y-2">
                    {tour.excludes?.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Cancellation Policy */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Cancellation Policy</h2>
              <p className="text-gray-700">{tour.cancellation_policy}</p>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-4">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-sky-600">
                    {formatCurrency(tour.min_price, tour.currency || 'USD')}
                  </span>
                  <span className="text-gray-600">per person</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="tour_date">Tour Date *</Label>
                  <Input
                    id="tour_date"
                    type="date"
                    value={formData.tour_date}
                    onChange={(e) => setFormData({ ...formData, tour_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="adults">Adults</Label>
                    <Input
                      id="adults"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.adults}
                      onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="children">Children</Label>
                    <Input
                      id="children"
                      type="number"
                      min="0"
                      max="10"
                      value={formData.children}
                      onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="infants">Infants</Label>
                    <Input
                      id="infants"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.infants}
                      onChange={(e) => setFormData({ ...formData, infants: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="customer_name">Full Name *</Label>
                  <Input
                    id="customer_name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="customer_email">Email *</Label>
                  <Input
                    id="customer_email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="customer_phone">Phone</Label>
                  <Input
                    id="customer_phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="special_requests">Special Requests</Label>
                  <textarea
                    id="special_requests"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Any special requirements or questions..."
                    value={formData.special_requests}
                    onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                  />
                </div>

                {/* Price Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {formData.adults + formData.children} Guest(s) × {formatCurrency(tour.min_price, tour.currency || 'USD')}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(calculateTotal(), tour.currency || 'USD')}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="text-sky-600">
                      {formatCurrency(calculateTotal(), tour.currency || 'USD')}
                    </span>
                  </div>
                </div>

                {!showPayment ? (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleBooking}
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : session ? 'Proceed to Payment' : 'Login to Book'}
                  </Button>
                ) : (
                  <PaymentGatewaySelector
                    amount={calculateTotal()}
                    currency={tour.currency || 'USD'}
                    onConfirm={confirmBooking}
                    onCancel={() => setShowPayment(false)}
                  />
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                  <Shield className="w-4 h-4" />
                  <span>Secure booking with SSL encryption</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
