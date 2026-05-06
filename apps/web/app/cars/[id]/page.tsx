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
  Car,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Star,
  Shield,
  CreditCard,
  ChevronLeft,
  Fuel,
  Settings,
  Users
} from 'lucide-react'

interface CarRental {
  id: string
  name: string
  description: string
  car_type: string
  transmission: string
  fuel_type: string
  seats: number
  doors: number
  luggage_capacity: number
  min_price: number
  currency: string
  rating: number
  review_count: number
  image: string
  images: string[]
  available: boolean
  cancellation_policy: string
  features: string[]
  pickup_location: string
  dropoff_location: string
}

interface BookingData {
  car_id: string
  pickup_date: string
  dropoff_date: string
  pickup_location: string
  dropoff_location: string
  driver_age: number
  customer_name: string
  customer_email: string
  customer_phone: string
  driver_license: string
  special_requests: string
  payment_method: string
}

export default function CarBookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { session } = useSupabase()
  const supabase = createClientComponentClient()
  const [car, setCar] = useState<CarRental | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [formData, setFormData] = useState<BookingData>({
    car_id: params.id,
    pickup_date: '',
    dropoff_date: '',
    pickup_location: '',
    dropoff_location: '',
    driver_age: 25,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    driver_license: '',
    special_requests: '',
    payment_method: ''
  })

  useEffect(() => {
    fetchCar()
    if (session?.user) {
      fetchUserProfile()
    }
  }, [params.id, session])

  async function fetchCar() {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setCar(data as CarRental)
      
      // Set default locations
      if (data) {
        setFormData(prev => ({
          ...prev,
          pickup_location: data.pickup_location || '',
          dropoff_location: data.dropoff_location || ''
        }))
      }
    } catch (error) {
      console.error('Error fetching car:', error)
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

  function calculateDays() {
    if (!formData.pickup_date || !formData.dropoff_date) return 0
    const pickup = new Date(formData.pickup_date)
    const dropoff = new Date(formData.dropoff_date)
    const diff = dropoff.getTime() - pickup.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return Math.max(1, days)
  }

  function calculateTotal() {
    if (!car) return 0
    const days = calculateDays()
    return car.min_price * days
  }

  async function handleBooking() {
    if (!session) {
      router.push(`/login?redirect=/cars/${params.id}`)
      return
    }

    if (!formData.pickup_date || !formData.dropoff_date) {
      alert('Please select pickup and drop-off dates')
      return
    }

    if (!formData.customer_name || !formData.customer_email || !formData.driver_license) {
      alert('Please fill in all required fields')
      return
    }

    if (formData.driver_age < 18) {
      alert('Driver must be at least 18 years old')
      return
    }

    setShowPayment(true)
  }

  async function confirmBooking(paymentDetails: any) {
    try {
      setProcessing(true)

      const bookingRef = 'CAR' + Date.now().toString().slice(-6)
      const days = calculateDays()

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          booking_ref: bookingRef,
          user_id: session?.user?.id,
          module_type: 'cars',
          car_id: params.id,
          car_name: car?.name,
          car_type: car?.car_type,
          pickup_location: formData.pickup_location,
          dropoff_location: formData.dropoff_location,
          pickup_date: formData.pickup_date,
          dropoff_date: formData.dropoff_date,
          duration: days,
          driver_age: formData.driver_age,
          driver_license: formData.driver_license,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          special_requests: formData.special_requests,
          total_amount: calculateTotal(),
          currency: car?.currency || 'USD',
          payment_method: paymentDetails.gateway,
          payment_status: 'pending',
          status: 'pending',
          cancellation_policy: car?.cancellation_policy,
          transmission: car?.transmission,
          fuel_type: car?.fuel_type
        })
        .select()
        .single()

      if (error) throw error

      const paymentParams = new URLSearchParams({
        amount: calculateTotal().toString(),
        currency: car?.currency || 'USD',
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
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading car details...</p>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Car Not Found</h1>
          <p className="text-gray-600 mb-4">
            The car you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/cars">Browse Cars</a>
          </Button>
        </Card>
      </div>
    )
  }

  const days = calculateDays()

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
          {/* Car Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <Card className="overflow-hidden">
              <div className="relative h-64 md:h-80">
                <img
                  src={car.image || '/placeholder-car.jpg'}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="success">Available</Badge>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 capitalize">{car.car_type}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{car.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{car.rating}</span>
                    <span className="text-gray-600">({car.review_count} reviews)</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{car.description}</p>

                {/* Car Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Seats</p>
                      <p className="font-medium">{car.seats}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Transmission</p>
                      <p className="font-medium capitalize">{car.transmission}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Fuel</p>
                      <p className="font-medium capitalize">{car.fuel_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Luggage</p>
                      <p className="font-medium">{car.luggage_capacity}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Features */}
            {car.features?.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Features & Amenities</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {car.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Cancellation Policy */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Cancellation Policy</h2>
              <p className="text-gray-700">{car.cancellation_policy}</p>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-4">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-purple-600">
                    {formatCurrency(car.min_price, car.currency || 'USD')}
                  </span>
                  <span className="text-gray-600">per day</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="pickup_date">Pick-up Date *</Label>
                    <Input
                      id="pickup_date"
                      type="date"
                      value={formData.pickup_date}
                      onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dropoff_date">Drop-off Date *</Label>
                    <Input
                      id="dropoff_date"
                      type="date"
                      value={formData.dropoff_date}
                      onChange={(e) => setFormData({ ...formData, dropoff_date: e.target.value })}
                      min={formData.pickup_date || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {days > 0 && (
                  <div className="text-sm text-center text-gray-600 bg-gray-50 py-2 rounded">
                    Rental duration: <span className="font-semibold">{days} day{days > 1 ? 's' : ''}</span>
                  </div>
                )}

                <div>
                  <Label htmlFor="pickup_location">Pick-up Location *</Label>
                  <Input
                    id="pickup_location"
                    type="text"
                    placeholder="Airport, Hotel, Address..."
                    value={formData.pickup_location}
                    onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="dropoff_location">Drop-off Location *</Label>
                  <Input
                    id="dropoff_location"
                    type="text"
                    placeholder="Airport, Hotel, Address..."
                    value={formData.dropoff_location}
                    onChange={(e) => setFormData({ ...formData, dropoff_location: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="driver_age">Driver Age *</Label>
                  <Input
                    id="driver_age"
                    type="number"
                    min="18"
                    max="99"
                    value={formData.driver_age}
                    onChange={(e) => setFormData({ ...formData, driver_age: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <Label htmlFor="driver_license">Driver License Number *</Label>
                  <Input
                    id="driver_license"
                    type="text"
                    placeholder="Enter license number"
                    value={formData.driver_license}
                    onChange={(e) => setFormData({ ...formData, driver_license: e.target.value })}
                  />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="GPS, child seat, additional driver..."
                    value={formData.special_requests}
                    onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                  />
                </div>

                {/* Price Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {days} day{days > 1 ? 's' : ''} × {formatCurrency(car.min_price, car.currency || 'USD')}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(car.min_price * days, car.currency || 'USD')}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="text-purple-600">
                      {formatCurrency(calculateTotal(), car.currency || 'USD')}
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
                    currency={car.currency || 'USD'}
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
