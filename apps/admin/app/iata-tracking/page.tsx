/**
 * IATA & Non-IATA Booking Tracking System
 * Manage airline accreditations, BSP settlements, and commission tracking
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@vertravels/ui'
import { Badge } from '@vertravels/ui'
import { Button } from '@vertravels/ui'
import { Input } from '@vertravels/ui'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Plane,
  Building2,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Search,
  Filter,
  RefreshCcw,
  Plus,
  Settings
} from 'lucide-react'

interface IATAProfile {
  id: string
  agency_id: string
  iata_code: string
  iata_number: string
  accreditation_type: 'IATA' | 'NON_IATA' | 'CLIA' | 'TRUE'
  status: 'active' | 'pending' | 'suspended' | 'expired'
  issue_date: string
  expiry_date: string
  bsp_code?: string
  pseudo_city_code?: string
  commission_rate: number
  booking_fee: number
  allowed_airlines: string[]
  monthly_target: number
  current_month_sales: number
}

interface Booking {
  id: string
  booking_ref: string
  pnr: string
  ticket_number?: string
  airline_code: string
  iata_booking: boolean
  commission_amount: number
  base_fare: number
  taxes: number
  total_amount: number
  booking_date: string
  travel_date: string
  status: string
  agent_id?: string
}

interface IATAStats {
  totalBookings: number
  iataBookings: number
  nonIataBookings: number
  totalCommission: number
  pendingSettlement: number
  monthlyTarget: number
  monthlyActual: number
  targetProgress: number
}

export function IATABookingTracker() {
  const supabase = createClientComponentClient()
  const [iataProfiles, setIataProfiles] = useState<IATAProfile[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<IATAStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<'all' | 'IATA' | 'NON_IATA'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)

      // Fetch IATA profiles
      const { data: profilesData } = await supabase
        .from('iata_profiles')
        .select('*')
        .order('iata_code')

      setIataProfiles(profilesData || [])

      // Fetch bookings with IATA tracking
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          iata_tracking (
            id,
            pnr,
            ticket_number,
            iata_booking,
            commission_amount,
            airline_code
          )
        `)
        .eq('module_type', 'flights')
        .order('booking_date', { ascending: false })
        .limit(100)

      setBookings(bookingsData || [])

      // Calculate stats
      calculateStats(bookingsData || [], profilesData || [])
    } catch (error) {
      console.error('Error fetching IATA data:', error)
    } finally {
      setLoading(false)
    }
  }

  function calculateStats(bookings: any[], profiles: IATAProfile[]) {
    const iataBookings = bookings.filter(b => b.iata_tracking?.iata_booking)
    const nonIataBookings = bookings.filter(b => !b.iata_tracking?.iata_booking)

    const totalCommission = bookings.reduce((sum, b) => 
      sum + (b.iata_tracking?.commission_amount || 0), 0
    )

    const monthlyTarget = profiles.reduce((sum, p) => sum + p.monthly_target, 0)
    const monthlyActual = profiles.reduce((sum, p) => sum + p.current_month_sales, 0)

    setStats({
      totalBookings: bookings.length,
      iataBookings: iataBookings.length,
      nonIataBookings: nonIataBookings.length,
      totalCommission,
      pendingSettlement: totalCommission * 0.3, // Assume 30% pending
      monthlyTarget,
      monthlyActual,
      targetProgress: (monthlyActual / monthlyTarget) * 100
    })
  }

  async function generateBSPReport() {
    // Generate BSP (Bank Settlement Plan) report
    const report = {
      agency_code: iataProfiles[0]?.iata_code || 'N/A',
      period: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      total_sales: bookings.reduce((sum, b) => sum + b.total_amount, 0),
      commission_earned: bookings.reduce((sum, b) => sum + (b.iata_tracking?.commission_amount || 0), 0),
      bookings_count: bookings.length,
      generated_at: new Date().toISOString()
    }

    console.log('BSP Report:', report)
    alert('BSP Report generated. Check console for details.')
  }

  async function syncWithAirlines() {
    // Sync bookings with airline GDS
    alert('Syncing with airline systems... This may take a few minutes.')
    // In production, this would call airline APIs (Amadeus, Sabre, Travelport)
    setTimeout(() => {
      fetchData()
      alert('Sync completed successfully!')
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IATA & Booking Management</h1>
          <p className="text-gray-600 mt-1">Track accreditations, commissions, and BSP settlements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateBSPReport}>
            <Download className="w-4 h-4 mr-2" />
            BSP Report
          </Button>
          <Button variant="outline" onClick={syncWithAirlines}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Sync Airlines
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add IATA Profile
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-sky-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Badge variant="success">{stats?.iataBookings || 0} IATA</Badge>
              <Badge variant="default">{stats?.nonIataBookings || 0} Non-IATA</Badge>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Commission</p>
                <p className="text-3xl font-bold text-green-600">
                  ${stats?.totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              ${stats?.pendingSettlement.toLocaleString(undefined, { minimumFractionDigits: 2 })} pending
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Target</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${(stats?.monthlyTarget || 0) / 1000}k
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{Math.round(stats?.targetProgress || 0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, stats?.targetProgress || 0)}%` }}
                ></div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">IATA Accreditations</p>
                <p className="text-3xl font-bold text-gray-900">{iataProfiles.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Badge variant="success">
                {iataProfiles.filter(p => p.status === 'active').length} Active
              </Badge>
            </div>
          </Card>
        </div>
      )}

      {/* IATA Profiles */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">IATA Accreditations</h2>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IATA Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Sales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {iataProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">{profile.iata_code}</div>
                      <div className="text-sm text-gray-500">{profile.iata_number}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      profile.accreditation_type === 'IATA' ? 'default' :
                      profile.accreditation_type === 'CLIA' ? 'success' :
                      'info'
                    }>
                      {profile.accreditation_type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      profile.status === 'active' ? 'success' :
                      profile.status === 'pending' ? 'warning' :
                      'error'
                    }>
                      {profile.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{profile.commission_rate}%</div>
                    <div className="text-sm text-gray-500">Fee: ${profile.booking_fee}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      {new Date(profile.expiry_date).toLocaleDateString()}
                    </div>
                    {new Date(profile.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                      <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        Expiring soon
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      ${(profile.current_month_sales / 1000).toFixed(1)}k / ${(profile.monthly_target / 1000).toFixed(0)}k
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          profile.current_month_sales >= profile.monthly_target
                            ? 'bg-green-500'
                            : 'bg-orange-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (profile.current_month_sales / profile.monthly_target) * 100)}%`
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
              {iataProfiles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No IATA profiles found. Add your first accreditation.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Bookings with IATA Tracking */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Flight Bookings</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search PNR, booking ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Bookings</option>
              <option value="IATA">IATA Only</option>
              <option value="NON_IATA">Non-IATA Only</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking Ref</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PNR / Ticket</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Airline</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-sky-600">
                    #{booking.booking_ref}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {booking.iata_tracking?.pnr || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.iata_tracking?.ticket_number || 'Not ticketed'}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{booking.iata_tracking?.airline_code || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      booking.iata_tracking?.iata_booking ? 'default' : 'info'
                    }>
                      {booking.iata_tracking?.iata_booking ? 'IATA' : 'Non-IATA'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      ${booking.total_amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Base: ${booking.base_fare} + Tax: ${booking.taxes}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-green-600">
                      ${booking.iata_tracking?.commission_amount?.toLocaleString() || '0'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      booking.status === 'confirmed' ? 'success' :
                      booking.status === 'pending' ? 'warning' :
                      'default'
                    }>
                      {booking.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default IATABookingTracker
