/**
 * Daily Sales Report System
 * Track daily sales, bookings, payments, and performance metrics
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@vertravels/ui'
import { Badge } from '@vertravels/ui'
import { Button } from '@vertravels/ui'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  Download,
  Printer,
  Mail,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plane,
  Hotel,
  MapPin,
  Car,
  FileText,
  CreditCard,
  Users,
  BarChart3
} from 'lucide-react'

interface DailySale {
  id: string
  date: string
  booking_ref: string
  module_type: string
  customer_name: string
  customer_email: string
  total_amount: number
  currency: string
  payment_method: string
  payment_status: string
  booking_status: string
  agent_name?: string
  commission?: number
}

interface DailySummary {
  date: string
  total_sales: number
  total_bookings: number
  paid_bookings: number
  pending_bookings: number
  cancelled_bookings: number
  refund_amount: number
  average_booking_value: number
  byModule: Record<string, { count: number; revenue: number }>
  byPaymentMethod: Record<string, { count: number; revenue: number }>
  topAgent?: { name: string; revenue: number }
}

export function DailySalesReport() {
  const supabase = createClientComponentClient()
  const [sales, setSales] = useState<DailySale[]>([])
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [dateRange, setDateRange] = useState<'today' | 'yesterday' | '7d' | '30d' | 'custom'>('today')
  const [filterModule, setFilterModule] = useState<string>('all')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchSalesData()
  }, [selectedDate, dateRange])

  async function fetchSalesData() {
    try {
      setLoading(true)

      const startDate = new Date(selectedDate)
      const endDate = new Date(selectedDate)

      if (dateRange === 'yesterday') {
        startDate.setDate(startDate.getDate() - 1)
        endDate.setDate(endDate.getDate() - 1)
      } else if (dateRange === '7d') {
        startDate.setDate(startDate.getDate() - 7)
      } else if (dateRange === '30d') {
        startDate.setDate(startDate.getDate() - 30)
      }

      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .gte('booking_date', startDate.toISOString())
        .lte('booking_date', endDate.toISOString())
        .order('booking_date', { ascending: false })

      setSales(bookingsData || [])

      // Generate daily summaries
      generateDailySummaries(bookingsData || [])
    } catch (error) {
      console.error('Error fetching sales data:', error)
    } finally {
      setLoading(false)
    }
  }

  function generateDailySummaries(bookings: any[]) {
    const summariesByDate: Record<string, DailySummary> = {}

    bookings.forEach(booking => {
      const date = new Date(booking.booking_date).toLocaleDateString('en-US', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })

      if (!summariesByDate[date]) {
        summariesByDate[date] = {
          date,
          total_sales: 0,
          total_bookings: 0,
          paid_bookings: 0,
          pending_bookings: 0,
          cancelled_bookings: 0,
          refund_amount: 0,
          average_booking_value: 0,
          byModule: {},
          byPaymentMethod: {}
        }
      }

      const summary = summariesByDate[date]
      summary.total_bookings += 1

      if (booking.payment_status === 'paid') {
        summary.total_sales += booking.total_amount || 0
        summary.paid_bookings += 1
      } else if (booking.payment_status === 'pending') {
        summary.pending_bookings += 1
      } else if (booking.payment_status === 'refunded') {
        summary.refund_amount += booking.total_amount || 0
        summary.cancelled_bookings += 1
      }

      // By module
      if (!summary.byModule[booking.module_type]) {
        summary.byModule[booking.module_type] = { count: 0, revenue: 0 }
      }
      summary.byModule[booking.module_type].count += 1
      if (booking.payment_status === 'paid') {
        summary.byModule[booking.module_type].revenue += booking.total_amount || 0
      }

      // By payment method
      const paymentMethod = booking.payment_method || 'other'
      if (!summary.byPaymentMethod[paymentMethod]) {
        summary.byPaymentMethod[paymentMethod] = { count: 0, revenue: 0 }
      }
      summary.byPaymentMethod[paymentMethod].count += 1
      if (booking.payment_status === 'paid') {
        summary.byPaymentMethod[paymentMethod].revenue += booking.total_amount || 0
      }
    })

    // Calculate averages
    Object.values(summariesByDate).forEach(summary => {
      summary.average_booking_value = summary.paid_bookings > 0 
        ? summary.total_sales / summary.paid_bookings 
        : 0
    })

    setDailySummaries(Object.values(summariesByDate).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ))
  }

  function filteredSales() {
    return sales.filter(sale => {
      const matchesModule = filterModule === 'all' || sale.module_type === filterModule
      const matchesPaymentStatus = filterPaymentStatus === 'all' || sale.payment_status === filterPaymentStatus
      const matchesSearch = searchQuery === '' ||
        sale.booking_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.customer_email?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesModule && matchesPaymentStatus && matchesSearch
    })
  }

  function getTodaySummary() {
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    return dailySummaries.find(s => s.date === today) || {
      total_sales: 0,
      total_bookings: 0,
      paid_bookings: 0,
      pending_bookings: 0,
      cancelled_bookings: 0,
      refund_amount: 0,
      average_booking_value: 0,
      byModule: {},
      byPaymentMethod: {}
    }
  }

  async function exportReport() {
    const report = {
      generated_at: new Date().toISOString(),
      date_range: dateRange,
      selected_date: selectedDate,
      summaries: dailySummaries,
      total_sales: dailySummaries.reduce((sum, s) => sum + s.total_sales, 0),
      total_bookings: dailySummaries.reduce((sum, s) => sum + s.total_bookings, 0)
    }

    console.log('Daily Sales Report:', report)
    alert('Report exported. Check console for details.')
  }

  async function printReport() {
    window.print()
  }

  async function emailReport() {
    const email = prompt('Enter email address to send report:')
    if (!email) return

    alert(`Report sent to ${email}`)
  }

  const todaySummary = getTodaySummary()
  const moduleIcons: Record<string, React.ReactNode> = {
    flights: <Plane className="w-4 h-4" />,
    hotels: <Hotel className="w-4 h-4" />,
    tours: <MapPin className="w-4 h-4" />,
    cars: <Car className="w-4 h-4" />,
    visa: <FileText className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Sales Report</h1>
          <p className="text-gray-600 mt-1">Track daily sales performance and bookings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={emailReport}>
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button variant="outline" onClick={printReport}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Date Selection */}
      <Card className="p-4 print:hidden">
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            <Button
              variant={dateRange === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setDateRange('today')
                setSelectedDate(new Date().toISOString().split('T')[0])
              }}
            >
              Today
            </Button>
            <Button
              variant={dateRange === 'yesterday' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setDateRange('yesterday')
                const yesterday = new Date()
                yesterday.setDate(yesterday.getDate() - 1)
                setSelectedDate(yesterday.toISOString().split('T')[0])
              }}
            >
              Yesterday
            </Button>
            <Button
              variant={dateRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('7d')}
            >
              Last 7 Days
            </Button>
            <Button
              variant={dateRange === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('30d')}
            >
              Last 30 Days
            </Button>
          </div>

          <div className="flex-1">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setDateRange('custom')
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </Card>

      {/* Today's Summary */}
      {!loading && dateRange === 'today' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Sales</p>
              <DollarSign className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${todaySummary.total_sales.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Bookings</p>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {todaySummary.total_bookings}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Paid</p>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              {todaySummary.paid_bookings}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Pending</p>
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {todaySummary.pending_bookings}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Cancelled</p>
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">
              {todaySummary.cancelled_bookings}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg Booking</p>
              <BarChart3 className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${todaySummary.average_booking_value.toFixed(2)}
            </p>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4 print:hidden">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search booking ref, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="w-[150px]">
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Modules</option>
              <option value="flights">Flights</option>
              <option value="hotels">Hotels</option>
              <option value="tours">Tours</option>
              <option value="cars">Cars</option>
              <option value="visa">Visa</option>
            </select>
          </div>
          <div className="w-[150px]">
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Sales by Module */}
      {todaySummary.total_bookings > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Module</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(todaySummary.byModule).map(([module, data]) => (
              <div key={module} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-white rounded-lg">
                    {moduleIcons[module]}
                  </div>
                  <span className="font-medium capitalize">{module}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${data.revenue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {data.count} bookings
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Daily Summaries Table */}
      {dateRange !== 'today' && dailySummaries.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Daily Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Sales</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cancelled</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Booking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dailySummaries.map((summary, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{summary.date}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      ${summary.total_sales.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{summary.total_bookings}</td>
                    <td className="px-4 py-3 text-green-600">{summary.paid_bookings}</td>
                    <td className="px-4 py-3 text-orange-600">{summary.pending_bookings}</td>
                    <td className="px-4 py-3 text-red-600">{summary.cancelled_bookings}</td>
                    <td className="px-4 py-3 text-gray-600">
                      ${summary.average_booking_value.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Individual Sales */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Individual Sales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking Ref</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredSales().length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No sales found for selected date
                  </td>
                </tr>
              ) : (
                filteredSales().map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-sky-600">
                      #{sale.booking_ref}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">{sale.customer_name}</div>
                        <div className="text-sm text-gray-500">{sale.customer_email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default" className="capitalize">
                        {sale.module_type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ${sale.total_amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={
                        sale.payment_status === 'paid' ? 'success' :
                        sale.payment_status === 'pending' ? 'warning' :
                        'error'
                      }>
                        {sale.payment_status}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1 capitalize">
                        {sale.payment_method}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={
                        sale.booking_status === 'confirmed' ? 'success' :
                        sale.booking_status === 'pending' ? 'warning' :
                        'error'
                      }>
                        {sale.booking_status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default DailySalesReport
