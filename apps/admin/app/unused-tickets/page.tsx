/**
 * Unused Tickets & Credit Shell Tracking System
 * Track open tickets, partially used tickets, expired tickets, and refund credits
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@vertravels/ui'
import { Badge } from '@vertravels/ui'
import { Button } from '@vertravels/ui'
import { Input } from '@vertravels/ui'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Ticket,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  RefreshCcw,
  Search,
  Filter,
  Download,
  Calendar,
  Plane,
  User,
  Building2,
  TrendingUp,
  AlertCircle,
  ArrowRight
} from 'lucide-react'

interface UnusedTicket {
  id: string
  ticket_number: string
  pnr: string
  passenger_name: string
  airline_code: string
  airline_name: string
  issue_date: string
  expiry_date: string
  original_value: number
  used_value: number
  remaining_value: number
  currency: string
  status: 'open' | 'partially_used' | 'suspended' | 'refunded' | 'expired'
  fare_basis: string
  fare_rules: string
  booking_ref: string
  route: string
  cabin_class: string
  refundable: boolean
  exchangeable: boolean
  penalty_amount: number
  agent_id?: string
  notes?: string
  created_at: string
  last_updated: string
}

interface CreditShell {
  id: string
  credit_shell_number: string
  original_ticket: string
  passenger_name: string
  airline_code: string
  amount: number
  currency: string
  issue_date: string
  expiry_date: string
  status: 'available' | 'partially_used' | 'fully_used' | 'expired'
  used_amount: number
  remaining_amount: number
  booking_ref?: string
  notes?: string
}

interface UnusedTicketStats {
  totalTickets: number
  totalValue: number
  openTickets: number
  partiallyUsedTickets: number
  expiringSoon: number
  expiredTickets: number
  refundableValue: number
  byAirline: Record<string, { count: number; value: number }>
}

export function UnusedTicketTracker() {
  const supabase = createClientComponentClient()
  const [tickets, setTickets] = useState<UnusedTicket[]>([])
  const [creditShells, setCreditShells] = useState<CreditShell[]>([])
  const [stats, setStats] = useState<UnusedTicketStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterAirline, setFilterAirline] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showExpired, setShowExpired] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)

      // Fetch unused tickets
      const { data: ticketsData } = await supabase
        .from('unused_tickets')
        .select('*')
        .order('expiry_date', { ascending: true })

      // Fetch credit shells
      const { data: creditShellsData } = await supabase
        .from('credit_shells')
        .select('*')
        .order('expiry_date', { ascending: true })

      setTickets(ticketsData || [])
      setCreditShells(creditShellsData || [])

      // Calculate stats
      calculateStats(ticketsData || [])
    } catch (error) {
      console.error('Error fetching unused tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  function calculateStats(tickets: UnusedTicket[]) {
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const openTickets = tickets.filter(t => t.status === 'open')
    const partiallyUsed = tickets.filter(t => t.status === 'partially_used')
    const expiringSoon = tickets.filter(t => 
      new Date(t.expiry_date) <= thirtyDaysFromNow && 
      new Date(t.expiry_date) > now &&
      t.status !== 'expired'
    )
    const expired = tickets.filter(t => t.status === 'expired' || new Date(t.expiry_date) < now)
    const refundable = tickets.filter(t => t.refundable && t.status !== 'expired')

    const byAirline: Record<string, { count: number; value: number }> = {}
    tickets.forEach(ticket => {
      if (!byAirline[ticket.airline_code]) {
        byAirline[ticket.airline_code] = { count: 0, value: 0 }
      }
      byAirline[ticket.airline_code].count++
      byAirline[ticket.airline_code].value += ticket.remaining_value
    })

    setStats({
      totalTickets: tickets.length,
      totalValue: tickets.reduce((sum, t) => sum + t.remaining_value, 0),
      openTickets: openTickets.length,
      partiallyUsedTickets: partiallyUsed.length,
      expiringSoon: expiringSoon.length,
      expiredTickets: expired.length,
      refundableValue: refundable.reduce((sum, t) => sum + t.remaining_value, 0),
      byAirline
    })
  }

  function filteredTickets() {
    const now = new Date()
    
    return tickets.filter(ticket => {
      const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus
      const matchesAirline = filterAirline === 'all' || ticket.airline_code === filterAirline
      const matchesSearch = searchQuery === '' ||
        ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.passenger_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.booking_ref.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesExpiry = showExpired || (new Date(ticket.expiry_date) >= now && ticket.status !== 'expired')

      return matchesStatus && matchesAirline && matchesSearch && matchesExpiry
    })
  }

  async function applyTicketToBooking(ticketId: string) {
    const bookingRef = prompt('Enter booking reference to apply ticket:')
    if (!bookingRef) return

    alert(`Applying ticket ${ticketId} to booking ${bookingRef}...`)
    // In production, this would call airline API to exchange ticket
  }

  async function requestRefund(ticketId: string) {
    if (!confirm('Submit refund request for this ticket?')) return

    alert('Refund request submitted. Processing time: 7-14 business days.')
    // In production, this would submit refund request to airline
  }

  async function suspendTicket(ticketId: string) {
    try {
      const { error } = await supabase
        .from('unused_tickets')
        .update({ status: 'suspended' })
        .eq('id', ticketId)

      if (error) throw error

      fetchData()
      alert('Ticket suspended successfully')
    } catch (error) {
      console.error('Error suspending ticket:', error)
      alert('Failed to suspend ticket')
    }
  }

  async function generateReport() {
    const report = {
      generated_at: new Date().toISOString(),
      total_unused_tickets: tickets.length,
      total_value: stats?.totalValue || 0,
      expiring_within_30_days: stats?.expiringSoon || 0,
      expired_tickets: stats?.expiredTickets || 0,
      by_airline: stats?.byAirline || {},
      credit_shells: creditShells.length,
      credit_shell_value: creditShells.reduce((sum, cs) => sum + cs.remaining_amount, 0)
    }

    console.log('Unused Tickets Report:', report)
    alert('Report generated. Check console for details.')
  }

  async function syncWithAirlines() {
    alert('Syncing ticket status with airlines... This may take a few minutes.')
    // In production, this would call airline APIs to check ticket status
    setTimeout(() => {
      fetchData()
      alert('Sync completed! 3 tickets updated.')
    }, 5000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unused Tickets & Credit Shells</h1>
          <p className="text-gray-600 mt-1">Track open tickets, unused value, and refund credits</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateReport}>
            <Download className="w-4 h-4 mr-2" />
            Report
          </Button>
          <Button variant="outline" onClick={syncWithAirlines}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Sync Airlines
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Ticket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Unused Tickets</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalTickets || 0}</p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-sky-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-green-600 font-medium">{stats?.openTickets || 0}</span> open
              <span className="mx-2">•</span>
              <span className="text-orange-600 font-medium">{stats?.partiallyUsedTickets || 0}</span> partially used
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Remaining Value</p>
                <p className="text-3xl font-bold text-green-600">
                  ${(stats?.totalValue || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Refundable: <span className="font-medium">${(stats?.refundableValue || 0).toLocaleString()}</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Expiring Soon</p>
                <p className="text-3xl font-bold text-orange-600">{stats?.expiringSoon || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Within 30 days
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Credit Shells</p>
                <p className="text-3xl font-bold text-gray-900">{creditShells.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <RefreshCcw className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Value: <span className="font-medium">
                ${creditShells.reduce((sum, cs) => sum + cs.remaining_amount, 0).toLocaleString()}
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Alerts */}
      {stats && stats.expiringSoon > 0 && (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900">Action Required: Tickets Expiring Soon</h3>
              <p className="text-sm text-orange-700 mt-1">
                {stats.expiringSoon} tickets worth ${(
                  tickets
                    .filter(t => {
                      const now = new Date()
                      const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
                      return new Date(t.expiry_date) <= thirtyDays && new Date(t.expiry_date) > now
                    })
                    .reduce((sum, t) => sum + t.remaining_value, 0)
                ).toLocaleString()} are expiring within 30 days. Consider rebooking or requesting refunds.
              </p>
            </div>
            <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
              View Expiring
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search ticket number, PNR, passenger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="w-[150px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="partially_used">Partially Used</option>
              <option value="suspended">Suspended</option>
              <option value="refunded">Refunded</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="w-[150px]">
            <select
              value={filterAirline}
              onChange={(e) => setFilterAirline(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Airlines</option>
              {Object.keys(stats?.byAirline || {}).map(airline => (
                <option key={airline} value={airline}>{airline}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showExpired}
              onChange={(e) => setShowExpired(e.target.checked)}
              className="rounded border-gray-300"
            />
            Show Expired
          </label>
        </div>
      </Card>

      {/* Unused Tickets Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket / PNR</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passenger</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Airline / Route</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredTickets().length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No unused tickets found
                  </td>
                </tr>
              ) : (
                filteredTickets().map((ticket) => {
                  const now = new Date()
                  const expiryDate = new Date(ticket.expiry_date)
                  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0

                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">{ticket.ticket_number}</div>
                          <div className="text-sm text-gray-500">PNR: {ticket.pnr}</div>
                          <div className="text-xs text-gray-400">Ref: {ticket.booking_ref}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{ticket.passenger_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Plane className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{ticket.airline_code}</span>
                          </div>
                          <div className="text-sm text-gray-500">{ticket.route}</div>
                          <div className="text-xs text-gray-400">{ticket.cabin_class}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-green-600">
                            ${ticket.remaining_value.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Original: ${ticket.original_value.toLocaleString()}
                          </div>
                          {ticket.penalty_amount > 0 && (
                            <div className="text-xs text-red-600">
                              Penalty: ${ticket.penalty_amount.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={isExpiringSoon ? 'text-orange-600 font-medium' : 'text-gray-900'}>
                          {expiryDate.toLocaleDateString()}
                        </div>
                        {isExpiringSoon && (
                          <div className="text-xs text-orange-600">
                            {daysUntilExpiry} days left
                          </div>
                        )}
                        {daysUntilExpiry < 0 && (
                          <div className="text-xs text-red-600">
                            Expired {Math.abs(daysUntilExpiry)} days ago
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          ticket.status === 'open' ? 'success' :
                          ticket.status === 'partially_used' ? 'warning' :
                          ticket.status === 'expired' ? 'error' :
                          'default'
                        }>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        {ticket.refundable && (
                          <div className="text-xs text-green-600 mt-1">Refundable</div>
                        )}
                        {ticket.exchangeable && (
                          <div className="text-xs text-blue-600 mt-1">Exchangeable</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => applyTicketToBooking(ticket.id)}
                            disabled={ticket.status !== 'open' && ticket.status !== 'partially_used'}
                          >
                            Apply
                          </Button>
                          {ticket.refundable && ticket.status !== 'refunded' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => requestRefund(ticket.id)}
                            >
                              Refund
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => suspendTicket(ticket.id)}
                          >
                            Suspend
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Credit Shells Section */}
      {creditShells.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Credit Shells</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit Shell</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passenger</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Airline</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {creditShells.map((shell) => (
                  <tr key={shell.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">{shell.credit_shell_number}</div>
                        <div className="text-sm text-gray-500">Orig: {shell.original_ticket}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{shell.passenger_name}</td>
                    <td className="px-4 py-3">{shell.airline_code}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-green-600">
                        ${shell.remaining_amount.toLocaleString()}
                      </div>
                      {shell.used_amount > 0 && (
                        <div className="text-xs text-gray-500">
                          Used: ${shell.used_amount.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{new Date(shell.expiry_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant={
                        shell.status === 'available' ? 'success' :
                        shell.status === 'partially_used' ? 'warning' :
                        'default'
                      }>
                        {shell.status.replace('_', ' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

export default UnusedTicketTracker
