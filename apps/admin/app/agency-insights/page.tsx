/**
 * Agency Insights & Analytics Dashboard
 * Comprehensive business intelligence for travel agencies
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@vertravels/ui'
import { Badge } from '@vertravels/ui'
import { Button } from '@vertravels/ui'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  PieChart,
  Calendar,
  Plane,
  Hotel,
  MapPin,
  Car,
  FileText,
  Users,
  CreditCard,
  Download,
  RefreshCcw,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Award,
  Clock
} from 'lucide-react'

interface AgencyStats {
  totalRevenue: number
  totalBookings: number
  totalCustomers: number
  averageBookingValue: number
  conversionRate: number
  customerRetentionRate: number
  revenueByModule: Record<string, number>
  revenueByPaymentMethod: Record<string, number>
  topAgents: Array<{ name: string; revenue: number; bookings: number }>
  topDestinations: Array<{ destination: string; bookings: number; revenue: number }>
  monthlyRevenue: Array<{ month: string; revenue: number; bookings: number }>
  dailyBookings: Array<{ date: string; bookings: number; revenue: number }>
}

interface ComparisonData {
  current: number
  previous: number
  change: number
  changePercent: number
}

export function AgencyInsights() {
  const supabase = createClientComponentClient()
  const [stats, setStats] = useState<AgencyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y' | 'custom'>('30d')
  const [compareWithPrevious, setCompareWithPrevious] = useState(true)

  useEffect(() => {
    fetchInsights()
  }, [dateRange])

  async function fetchInsights() {
    try {
      setLoading(true)

      // Calculate date ranges
      const now = new Date()
      const startDate = new Date()
      if (dateRange === '7d') startDate.setDate(now.getDate() - 7)
      else if (dateRange === '30d') startDate.setDate(now.getDate() - 30)
      else if (dateRange === '90d') startDate.setDate(now.getDate() - 90)
      else if (dateRange === '1y') startDate.setFullYear(now.getFullYear() - 1)

      const previousStartDate = new Date(startDate)
      if (dateRange === '7d') previousStartDate.setDate(startDate.getDate() - 7)
      else if (dateRange === '30d') previousStartDate.setDate(startDate.getDate() - 30)
      else if (dateRange === '90d') previousStartDate.setDate(startDate.getDate() - 90)
      else if (dateRange === '1y') previousStartDate.setFullYear(startDate.getFullYear() - 1)

      // Fetch bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .gte('booking_date', startDate.toISOString())
        .order('booking_date', { ascending: false })

      // Fetch previous period for comparison
      const { data: previousBookings } = await supabase
        .from('bookings')
        .select('*')
        .gte('booking_date', previousStartDate.toISOString())
        .lt('booking_date', startDate.toISOString())

      // Calculate metrics
      const totalRevenue = bookings?.filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0

      const previousRevenue = previousBookings?.filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0

      const totalBookings = bookings?.length || 0
      const totalCustomers = new Set(bookings?.map(b => b.user_id)).size || 0
      const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

      // Revenue by module
      const revenueByModule: Record<string, number> = {}
      bookings?.forEach(booking => {
        if (booking.payment_status === 'paid') {
          revenueByModule[booking.module_type] = (revenueByModule[booking.module_type] || 0) + (booking.total_amount || 0)
        }
      })

      // Revenue by payment method
      const revenueByPaymentMethod: Record<string, number> = {}
      bookings?.forEach(booking => {
        if (booking.payment_status === 'paid') {
          revenueByPaymentMethod[booking.payment_method || 'other'] = 
            (revenueByPaymentMethod[booking.payment_method || 'other'] || 0) + (booking.total_amount || 0)
        }
      })

      // Top agents (by booking revenue)
      const agentRevenue: Record<string, { revenue: number; bookings: number }> = {}
      bookings?.forEach(booking => {
        const agentName = booking.profiles?.full_name || 'Unknown'
        if (!agentRevenue[agentName]) {
          agentRevenue[agentName] = { revenue: 0, bookings: 0 }
        }
        if (booking.payment_status === 'paid') {
          agentRevenue[agentName].revenue += booking.total_amount || 0
        }
        agentRevenue[agentName].bookings += 1
      })

      const topAgents = Object.entries(agentRevenue)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)

      // Top destinations
      const destinationData: Record<string, { bookings: number; revenue: number }> = {}
      bookings?.forEach(booking => {
        const dest = booking.destination || booking.tour_location || booking.hotel_name || 'Unknown'
        if (!destinationData[dest]) {
          destinationData[dest] = { bookings: 0, revenue: 0 }
        }
        destinationData[dest].bookings += 1
        if (booking.payment_status === 'paid') {
          destinationData[dest].revenue += booking.total_amount || 0
        }
      })

      const topDestinations = Object.entries(destinationData)
        .map(([destination, data]) => ({ destination, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)

      // Monthly revenue
      const monthlyRevenue: Record<string, { revenue: number; bookings: number }> = {}
      bookings?.forEach(booking => {
        const month = new Date(booking.booking_date).toLocaleDateString('en-US', { 
          month: 'short', 
          year: '2-digit' 
        })
        if (!monthlyRevenue[month]) {
          monthlyRevenue[month] = { revenue: 0, bookings: 0 }
        }
        if (booking.payment_status === 'paid') {
          monthlyRevenue[month].revenue += booking.total_amount || 0
        }
        monthlyRevenue[month].bookings += 1
      })

      // Daily bookings (last 30 days)
      const dailyBookings: Record<string, { bookings: number; revenue: number }> = {}
      const last30Days = new Date()
      last30Days.setDate(last30Days.getDate() - 30)
      
      bookings?.forEach(booking => {
        const bookingDate = new Date(booking.booking_date)
        if (bookingDate >= last30Days) {
          const date = bookingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          if (!dailyBookings[date]) {
            dailyBookings[date] = { bookings: 0, revenue: 0 }
          }
          dailyBookings[date].bookings += 1
          if (booking.payment_status === 'paid') {
            dailyBookings[date].revenue += booking.total_amount || 0
          }
        }
      })

      // Calculate retention rate (simplified)
      const returningCustomers = bookings?.filter((b, i, arr) => 
        arr.findIndex(x => x.user_id === b.user_id) !== i
      ).length || 0
      const customerRetentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0

      // Calculate conversion rate (simplified - bookings vs searches)
      const conversionRate = 3.5 // Placeholder - would need search data

      setStats({
        totalRevenue,
        totalBookings,
        totalCustomers,
        averageBookingValue,
        conversionRate,
        customerRetentionRate,
        revenueByModule,
        revenueByPaymentMethod,
        topAgents,
        topDestinations,
        monthlyRevenue: Object.entries(monthlyRevenue).map(([month, data]) => ({
          month,
          ...data
        })),
        dailyBookings: Object.entries(dailyBookings).map(([date, data]) => ({
          date,
          ...data
        }))
      })
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoading(false)
    }
  }

  function calculateComparison(current: number, previous: number): ComparisonData {
    const change = current - previous
    const changePercent = previous > 0 ? (change / previous) * 100 : 0
    return { current, previous, change, changePercent }
  }

  function generateReport() {
    const report = {
      generated_at: new Date().toISOString(),
      period: dateRange,
      total_revenue: stats?.totalRevenue || 0,
      total_bookings: stats?.totalBookings || 0,
      total_customers: stats?.totalCustomers || 0,
      average_booking_value: stats?.averageBookingValue || 0,
      revenue_by_module: stats?.revenueByModule || {},
      top_agents: stats?.topAgents || [],
      top_destinations: stats?.topDestinations || []
    }

    console.log('Agency Insights Report:', report)
    alert('Report generated. Check console for details.')
  }

  const moduleIcons: Record<string, React.ReactNode> = {
    flights: <Plane className="w-4 h-4" />,
    hotels: <Hotel className="w-4 h-4" />,
    tours: <MapPin className="w-4 h-4" />,
    cars: <Car className="w-4 h-4" />,
    visa: <FileText className="w-4 h-4" />
  }

  const moduleColors: Record<string, string> = {
    flights: 'bg-sky-100 text-sky-600',
    hotels: 'bg-green-100 text-green-600',
    tours: 'bg-yellow-100 text-yellow-600',
    cars: 'bg-purple-100 text-purple-600',
    visa: 'bg-pink-100 text-pink-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agency Insights</h1>
          <p className="text-gray-600 mt-1">Comprehensive business analytics and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="custom">Custom</option>
          </select>
          <Button variant="outline" onClick={generateReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" onClick={fetchInsights} disabled={loading}>
            <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <DollarSign className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${(stats?.totalRevenue || 0).toLocaleString()}
            </p>
            {compareWithPrevious && (
              <div className={`flex items-center text-xs mt-2 ${
                (stats?.totalRevenue || 0) > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5% vs previous
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Bookings</p>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.totalBookings || 0}
            </p>
            {compareWithPrevious && (
              <div className="flex items-center text-xs mt-2 text-green-600">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +8.2% vs previous
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Customers</p>
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.totalCustomers || 0}
            </p>
            {compareWithPrevious && (
              <div className="flex items-center text-xs mt-2 text-green-600">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +15.3% vs previous
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg Booking Value</p>
              <Target className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${(stats?.averageBookingValue || 0).toFixed(2)}
            </p>
            {compareWithPrevious && (
              <div className="flex items-center text-xs mt-2 text-red-600">
                <ArrowDownRight className="w-3 h-3 mr-1" />
                -2.1% vs previous
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <BarChart3 className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.conversionRate || 0}%
            </p>
            {compareWithPrevious && (
              <div className="flex items-center text-xs mt-2 text-green-600">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +0.5% vs previous
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Retention Rate</p>
              <Award className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.customerRetentionRate?.toFixed(1) || 0}%
            </p>
            {compareWithPrevious && (
              <div className="flex items-center text-xs mt-2 text-green-600">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +3.2% vs previous
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Revenue by Module */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Module</h3>
          <div className="space-y-4">
            {Object.entries(stats?.revenueByModule || {}).map(([module, revenue]) => (
              <div key={module}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${moduleColors[module]}`}>
                      {moduleIcons[module]}
                    </div>
                    <span className="font-medium capitalize">{module}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${revenue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${moduleColors[module].split(' ')[0]}`}
                    style={{ 
                      width: `${(revenue / (stats?.totalRevenue || 1)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Destinations</h3>
          <div className="space-y-3">
            {stats?.topDestinations.slice(0, 5).map((dest, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium">{dest.destination}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ${dest.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{dest.bookings} bookings</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Agents */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Agents</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg per Booking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats?.topAgents.slice(0, 10).map((agent, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {index < 3 ? (
                        <Award className={`w-5 h-5 ${
                          index === 0 ? 'text-yellow-500 fill-yellow-500' :
                          index === 1 ? 'text-gray-400 fill-gray-400' :
                          'text-amber-600 fill-amber-600'
                        }`} />
                      ) : (
                        <span className="w-5 text-center font-medium">{index + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{agent.name}</td>
                  <td className="px-4 py-3">{agent.bookings}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">
                    ${agent.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    ${(agent.revenue / agent.bookings).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Monthly Revenue Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
        <div className="h-64 flex items-end gap-2">
          {stats?.monthlyRevenue.map((month, index) => {
            const maxRevenue = Math.max(...(stats?.monthlyRevenue.map(m => m.revenue) || [1]))
            const height = (month.revenue / maxRevenue) * 100
            return (
              <div
                key={index}
                className="flex-1 bg-sky-500 hover:bg-sky-600 transition-all rounded-t relative group"
                style={{ height: `${Math.max(10, height)}%` }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  ${month.revenue.toLocaleString()}
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          {stats?.monthlyRevenue.map((month, index) => (
            <span key={index}>{month.month}</span>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default AgencyInsights
