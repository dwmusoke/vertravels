/**
 * Partnership & Affiliate Management System
 * Manage sub-agents, affiliates, B2B partners, and commission structures
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@vertravels/ui'
import { Badge } from '@vertravels/ui'
import { Button } from '@vertravels/ui'
import { Input } from '@vertravels/ui'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Users,
  Building2,
  Handshake,
  Percent,
  DollarSign,
  TrendingUp,
  Gift,
  Link,
  Copy,
  CheckCircle,
  Mail,
  Phone,
  Globe,
  Calendar,
  Star,
  Award,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react'

interface Partner {
  id: string
  type: 'affiliate' | 'sub_agent' | 'b2b' | 'corporate' | 'wholesaler'
  company_name: string
  contact_name: string
  email: string
  phone: string
  website?: string
  status: 'active' | 'pending' | 'suspended' | 'terminated'
  commission_rate: number
  commission_type: 'percentage' | 'fixed' | 'tiered'
  total_bookings: number
  total_revenue: number
  total_commission: number
  pending_commission: number
  paid_commission: number
  joined_date: string
  last_booking_date?: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  referral_code: string
  api_key?: string
  white_label_enabled: boolean
}

interface CommissionTier {
  name: string
  minRevenue: number
  maxRevenue?: number
  commissionRate: number
  bonusRate?: number
}

const commissionTiers: CommissionTier[] = [
  { name: 'Bronze', minRevenue: 0, maxRevenue: 10000, commissionRate: 5 },
  { name: 'Silver', minRevenue: 10000, maxRevenue: 50000, commissionRate: 8, bonusRate: 2 },
  { name: 'Gold', minRevenue: 50000, maxRevenue: 100000, commissionRate: 12, bonusRate: 3 },
  { name: 'Platinum', minRevenue: 100000, commissionRate: 15, bonusRate: 5 }
]

export function PartnershipManager() {
  const supabase = createClientComponentClient()
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchPartners()
  }, [])

  async function fetchPartners() {
    try {
      setLoading(true)

      const { data: partnersData } = await supabase
        .from('partners')
        .select('*')
        .order('joined_date', { ascending: false })

      setPartners(partnersData || [])
    } catch (error) {
      console.error('Error fetching partners:', error)
    } finally {
      setLoading(false)
    }
  }

  function filteredPartners() {
    return partners.filter(partner => {
      const matchesType = filterType === 'all' || partner.type === filterType
      const matchesStatus = filterStatus === 'all' || partner.status === filterStatus
      const matchesSearch = searchQuery === '' ||
        partner.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.email.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesType && matchesStatus && matchesSearch
    })
  }

  function calculatePartnerStats() {
    const totalPartners = partners.length
    const activePartners = partners.filter(p => p.status === 'active').length
    const totalRevenue = partners.reduce((sum, p) => sum + p.total_revenue, 0)
    const totalCommission = partners.reduce((sum, p) => sum + p.total_commission, 0)
    const pendingCommission = partners.reduce((sum, p) => sum + p.pending_commission, 0)

    return {
      totalPartners,
      activePartners,
      totalRevenue,
      totalCommission,
      pendingCommission
    }
  }

  async function copyReferralLink(code: string) {
    const link = `${typeof window !== 'undefined' ? window.location.origin}/ref/${code}`
    await navigator.clipboard.writeText(link)
    alert('Referral link copied to clipboard!')
  }

  async function generatePayoutReport() {
    alert('Generating commission payout report...')
    // In production, generate PDF/CSV report
  }

  const stats = calculatePartnerStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partnership Management</h1>
          <p className="text-gray-600 mt-1">Manage affiliates, sub-agents, and B2B partners</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generatePayoutReport}>
            <Download className="w-4 h-4 mr-2" />
            Payout Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Partner
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Partners</p>
              <p className="text-2xl font-bold">{stats.totalPartners}</p>
              <p className="text-xs text-green-600">{stats.activePartners} active</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${(stats.totalRevenue / 1000).toFixed(1)}k
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Percent className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Commission</p>
              <p className="text-2xl font-bold text-purple-600">
                ${(stats.totalCommission / 1000).toFixed(1)}k
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Payout</p>
              <p className="text-2xl font-bold text-orange-600">
                ${(stats.pendingCommission / 1000).toFixed(1)}k
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Top Tier</p>
              <p className="text-2xl font-bold text-pink-600">
                {partners.filter(p => p.tier === 'platinum').length}
              </p>
              <p className="text-xs text-gray-500">Platinum partners</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Commission Tiers */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Commission Structure
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {commissionTiers.map((tier, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                tier.name === 'Bronze' ? 'border-amber-700 bg-amber-50' :
                tier.name === 'Silver' ? 'border-gray-400 bg-gray-50' :
                tier.name === 'Gold' ? 'border-yellow-400 bg-yellow-50' :
                'border-sky-400 bg-sky-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Award className={`w-5 h-5 ${
                  tier.name === 'Bronze' ? 'text-amber-700' :
                  tier.name === 'Silver' ? 'text-gray-600' :
                  tier.name === 'Gold' ? 'text-yellow-600' :
                  'text-sky-600'
                }`} />
                <h3 className="font-semibold">{tier.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {tier.minRevenue === 0 ? 'Start' : `$${(tier.minRevenue / 1000).toFixed(0)}k`}
                {tier.maxRevenue ? ` - $${(tier.maxRevenue / 1000).toFixed(0)}k` : '+'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{tier.commissionRate}%</p>
              <p className="text-xs text-gray-600">base commission</p>
              {tier.bonusRate && (
                <p className="text-xs text-green-600 mt-1">+{tier.bonusRate}% bonus</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="w-[150px]">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Types</option>
              <option value="affiliate">Affiliates</option>
              <option value="sub_agent">Sub-Agents</option>
              <option value="b2b">B2B Partners</option>
              <option value="corporate">Corporate</option>
              <option value="wholesaler">Wholesalers</option>
            </select>
          </div>
          <div className="w-[150px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Partners Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referral Code</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredPartners().length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No partners found
                  </td>
                </tr>
              ) : (
                filteredPartners().map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">{partner.company_name}</div>
                        <div className="text-sm text-gray-500">{partner.contact_name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3" /> {partner.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={
                        partner.type === 'affiliate' ? 'info' :
                        partner.type === 'sub_agent' ? 'default' :
                        partner.type === 'b2b' ? 'success' :
                        'warning'
                      }>
                        {partner.type.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className={`w-4 h-4 ${
                          partner.tier === 'bronze' ? 'text-amber-700 fill-amber-700' :
                          partner.tier === 'silver' ? 'text-gray-600 fill-gray-600' :
                          partner.tier === 'gold' ? 'text-yellow-600 fill-yellow-600' :
                          'text-sky-600 fill-sky-600'
                        }`} />
                        <span className="capitalize text-sm">{partner.tier}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={
                        partner.status === 'active' ? 'success' :
                        partner.status === 'pending' ? 'warning' :
                        'error'
                      }>
                        {partner.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{partner.commission_rate}%</div>
                      <div className="text-xs text-gray-500 capitalize">{partner.commission_type}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        ${(partner.total_revenue / 1000).toFixed(1)}k
                      </div>
                      <div className="text-xs text-gray-500">
                        {partner.total_bookings} bookings
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {partner.referral_code}
                        </code>
                        <button
                          onClick={() => copyReferralLink(partner.referral_code)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => {
                          setSelectedPartner(partner)
                          setShowDetails(true)
                        }}>
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <DollarSign className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Partner Details Modal */}
      {showDetails && selectedPartner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedPartner.company_name}</h2>
                  <p className="text-gray-600">{selectedPartner.contact_name}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)}>
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedPartner.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedPartner.phone}</span>
                    </div>
                    {selectedPartner.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span>{selectedPartner.website}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Joined: {new Date(selectedPartner.joined_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Partnership Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <Badge className="ml-2">{selectedPartner.type}</Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <Badge className="ml-2">{selectedPartner.status}</Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Tier:</span>
                      <Badge className="ml-2">{selectedPartner.tier}</Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Commission:</span>
                      <span className="ml-2 font-medium">{selectedPartner.commission_rate}%</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-3">Performance</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold">{selectedPartner.total_bookings}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${(selectedPartner.total_revenue / 1000).toFixed(1)}k
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Commission</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ${(selectedPartner.total_commission / 1000).toFixed(1)}k
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-3">Payout Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-600">Paid Commission</p>
                      <p className="text-2xl font-bold text-green-700">
                        ${(selectedPartner.paid_commission / 1000).toFixed(1)}k
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm text-orange-600">Pending Commission</p>
                      <p className="text-2xl font-bold text-orange-700">
                        ${(selectedPartner.pending_commission / 1000).toFixed(1)}k
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t">
                <Button className="flex-1">Process Payout</Button>
                <Button variant="outline" className="flex-1">Edit Partner</Button>
                <Button variant="outline" onClick={() => setShowDetails(false)}>Close</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default PartnershipManager
