'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Card } from '@vertravels/ui'
import { Button } from '@vertravels/ui'
import { Input } from '@vertravels/ui'
import { Label } from '@vertravels/ui'
import { Select } from '@vertravels/ui'
import { Badge } from '@vertravels/ui'
import { PaymentGatewaySelector } from '@/components/payment/payment-gateway-selector'
import { formatCurrency } from '@/lib/utils'
import { useSupabase } from '@/components/providers/supabase-provider'
import {
  FileText,
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
  Plane,
  Users,
  Building,
  Passport
} from 'lucide-react'

interface Visa {
  id: string
  destination: string
  visa_type: string
  description: string
  processing_time: number
  processing_time_unit: string
  validity: number
  validity_unit: string
  stay_duration: number
  stay_duration_unit: string
  entry_type: string
  price: number
  currency: string
  rating: number
  review_count: number
  image: string
  images: string[]
  available: boolean
  requirements: string[]
  features: string[]
  embassy_info: string
}

interface BookingData {
  visa_id: string
  visa_type: string
  destination: string
  travel_date: string
  applicant_name: string
  applicant_email: string
  applicant_phone: string
  passport_number: string
  passport_expiry: string
  nationality: string
  date_of_birth: string
  gender: string
  occupation: string
  employer: string
  special_requests: string
  payment_method: string
}

export default function VisaBookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { session } = useSupabase()
  const supabase = createClientComponentClient()
  const [visa, setVisa] = useState<Visa | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [formData, setFormData] = useState<BookingData>({
    visa_id: params.id,
    visa_type: '',
    destination: '',
    travel_date: '',
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    passport_number: '',
    passport_expiry: '',
    nationality: '',
    date_of_birth: '',
    gender: '',
    occupation: '',
    employer: '',
    special_requests: '',
    payment_method: ''
  })

  useEffect(() => {
    fetchVisa()
    if (session?.user) {
      fetchUserProfile()
    }
  }, [params.id, session])

  async function fetchVisa() {
    try {
      const { data, error } = await supabase
        .from('visas')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setVisa(data as Visa)
      
      if (data) {
        setFormData(prev => ({
          ...prev,
          visa_type: data.visa_type,
          destination: data.destination
        }))
      }
    } catch (error) {
      console.error('Error fetching visa:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchUserProfile() {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, email, phone, nationality, date_of_birth, gender, occupation')
        .eq('id', session?.user?.id)
        .single()

      if (data) {
        setFormData(prev => ({
          ...prev,
          applicant_name: data.full_name || '',
          applicant_email: data.email || '',
          applicant_phone: data.phone || '',
          nationality: data.nationality || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          occupation: data.occupation || ''
        }))
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  async function handleBooking() {
    if (!session) {
      router.push(`/login?redirect=/visa/${params.id}`)
      return
    }

    if (!formData.travel_date) {
      alert('Please select your planned travel date')
      return
    }

    if (!formData.applicant_name || !formData.applicant_email || !formData.passport_number) {
      alert('Please fill in all required fields')
      return
    }

    if (!formData.passport_expiry) {
      alert('Please enter passport expiry date')
      return
    }

    // Check passport validity (should be valid for at least 6 months)
    const expiry = new Date(formData.passport_expiry)
    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
    
    if (expiry < sixMonthsFromNow) {
      alert('Your passport must be valid for at least 6 months from your travel date')
      return
    }

    setShowPayment(true)
  }

  async function confirmBooking(paymentDetails: any) {
    try {
      setProcessing(true)

      const bookingRef = 'VISA' + Date.now().toString().slice(-6)

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          booking_ref: bookingRef,
          user_id: session?.user?.id,
          module_type: 'visa',
          visa_id: params.id,
          visa_type: formData.visa_type,
          destination: formData.destination,
          travel_date: formData.travel_date,
          applicant_name: formData.applicant_name,
          applicant_email: formData.applicant_email,
          applicant_phone: formData.applicant_phone,
          passport_number: formData.passport_number,
          passport_expiry: formData.passport_expiry,
          nationality: formData.nationality,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          occupation: formData.occupation,
          employer: formData.employer,
          special_requests: formData.special_requests,
          total_amount: visa?.price || 0,
          currency: visa?.currency || 'USD',
          payment_method: paymentDetails.gateway,
          payment_status: 'pending',
          status: 'pending',
          processing_time: `${visa?.processing_time} ${visa?.processing_time_unit}`,
          validity: `${visa?.validity} ${visa?.validity_unit}`,
          entry_type: visa?.entry_type
        })
        .select()
        .single()

      if (error) throw error

      const paymentParams = new URLSearchParams({
        amount: (visa?.price || 0).toString(),
        currency: visa?.currency || 'USD',
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
          <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visa details...</p>
        </div>
      </div>
    )
  }

  if (!visa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Visa Not Found</h1>
          <p className="text-gray-600 mb-4">
            The visa you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/visa">Browse Visas</a>
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
          {/* Visa Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero */}
            <Card className="overflow-hidden">
              <div className="relative h-64 md:h-80">
                <img
                  src={visa.image || '/placeholder-visa.jpg'}
                  alt={`${visa.visa_type} for ${visa.destination}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="success">Available</Badge>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{visa.destination}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {visa.destination} {visa.visa_type} Visa
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{visa.rating}</span>
                    <span className="text-gray-600">({visa.review_count} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      {visa.processing_time} {visa.processing_time_unit} processing
                    </span>
                  </div>
                </div>
                <p className="text-gray-700">{visa.description}</p>
              </div>
            </Card>

            {/* Visa Details Grid */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Visa Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Clock className="w-5 h-5 text-pink-600 mb-2" />
                  <p className="text-xs text-gray-500">Processing Time</p>
                  <p className="font-semibold">{visa.processing_time} {visa.processing_time_unit}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Calendar className="w-5 h-5 text-pink-600 mb-2" />
                  <p className="text-xs text-gray-500">Validity</p>
                  <p className="font-semibold">{visa.validity} {visa.validity_unit}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Users className="w-5 h-5 text-pink-600 mb-2" />
                  <p className="text-xs text-gray-500">Stay Duration</p>
                  <p className="font-semibold">{visa.stay_duration} {visa.stay_duration_unit}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <FileText className="w-5 h-5 text-pink-600 mb-2" />
                  <p className="text-xs text-gray-500">Entry Type</p>
                  <p className="font-semibold capitalize">{visa.entry_type}</p>
                </div>
              </div>
            </Card>

            {/* Requirements */}
            {visa.requirements?.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Required Documents
                </h2>
                <ul className="space-y-3">
                  {visa.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Features */}
            {visa.features?.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Features</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {visa.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Embassy Info */}
            {visa.embassy_info && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Embassy Information
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{visa.embassy_info}</p>
              </Card>
            )}
          </div>

          {/* Application Form */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-4">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-pink-600">
                    {formatCurrency(visa.price, visa.currency || 'USD')}
                  </span>
                  <span className="text-gray-600">total</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="travel_date">Planned Travel Date *</Label>
                  <Input
                    id="travel_date"
                    type="date"
                    value={formData.travel_date}
                    onChange={(e) => setFormData({ ...formData, travel_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="applicant_name">Full Name (as in passport) *</Label>
                  <Input
                    id="applicant_name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.applicant_name}
                    onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="applicant_email">Email *</Label>
                  <Input
                    id="applicant_email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.applicant_email}
                    onChange={(e) => setFormData({ ...formData, applicant_email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="applicant_phone">Phone</Label>
                  <Input
                    id="applicant_phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.applicant_phone}
                    onChange={(e) => setFormData({ ...formData, applicant_phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="passport_number">Passport Number *</Label>
                  <Input
                    id="passport_number"
                    type="text"
                    placeholder="A12345678"
                    value={formData.passport_number}
                    onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="passport_expiry">Passport Expiry Date *</Label>
                  <Input
                    id="passport_expiry"
                    type="date"
                    value={formData.passport_expiry}
                    onChange={(e) => setFormData({ ...formData, passport_expiry: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Select
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  >
                    <option value="">Select nationality</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IN">India</option>
                    <option value="CN">China</option>
                    <option value="NG">Nigeria</option>
                    <option value="KE">Kenya</option>
                    <option value="ZA">South Africa</option>
                    <option value="OTHER">Other</option>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    type="text"
                    placeholder="Software Engineer"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="employer">Employer</Label>
                  <Input
                    id="employer"
                    type="text"
                    placeholder="Company Name"
                    value={formData.employer}
                    onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="special_requests">Special Requests</Label>
                  <textarea
                    id="special_requests"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Any special requirements or questions..."
                    value={formData.special_requests}
                    onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                  />
                </div>

                {/* Price Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Visa Fee</span>
                    <span className="font-medium">
                      {formatCurrency(visa.price, visa.currency || 'USD')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">Included</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="text-pink-600">
                      {formatCurrency(visa.price, visa.currency || 'USD')}
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
                    {processing ? 'Processing...' : session ? 'Proceed to Payment' : 'Login to Apply'}
                  </Button>
                ) : (
                  <PaymentGatewaySelector
                    amount={visa.price}
                    currency={visa.currency || 'USD'}
                    onConfirm={confirmBooking}
                    onCancel={() => setShowPayment(false)}
                  />
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                  <Shield className="w-4 h-4" />
                  <span>Secure application with SSL encryption</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Passport must be valid for at least 6 months</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
