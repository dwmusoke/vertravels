/**
 * Expenses Management System
 * Track operational expenses, categorize spending, and manage budgets
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@vertravels/ui'
import { Badge } from '@vertravels/ui'
import { Button } from '@vertravels/ui'
import { Input } from '@vertravels/ui'
import { Label } from '@vertravels/ui'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  Filter,
  Search,
  Calendar,
  CreditCard,
  Receipt,
  Building2,
  Users,
  Zap,
  Globe,
  Phone,
  Monitor,
  Briefcase,
  Car,
  Coffee,
  AlertCircle,
  CheckCircle,
  XCircle,
  PieChart,
  BarChart3
} from 'lucide-react'

interface Expense {
  id: string
  category: string
  subcategory?: string
  amount: number
  currency: string
  date: string
  vendor: string
  description: string
  payment_method: string
  status: 'pending' | 'approved' | 'paid' | 'rejected'
  receipt_url?: string
  employee_name?: string
  employee_id?: string
  project?: string
  booking_ref?: string
  notes?: string
  approved_by?: string
  approved_at?: string
  paid_at?: string
  created_at: string
  created_by: string
}

interface ExpenseCategory {
  name: string
  icon: React.ReactNode
  color: string
  budget?: number
  spent: number
  remaining: number
  percentage: number
}

interface ExpenseStats {
  totalExpenses: number
  pendingExpenses: number
  approvedExpenses: number
  paidExpenses: number
  rejectedExpenses: number
  byCategory: Record<string, number>
  byMonth: Array<{ month: string; amount: number }>
  topVendors: Array<{ vendor: string; amount: number }>
}

const expenseCategories = [
  { name: 'Office', icon: <Building2 className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
  { name: 'Salaries', icon: <Users className="w-5 h-5" />, color: 'bg-green-100 text-green-600' },
  { name: 'Utilities', icon: <Zap className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Marketing', icon: <Globe className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' },
  { name: 'Technology', icon: <Monitor className="w-5 h-5" />, color: 'bg-pink-100 text-pink-600' },
  { name: 'Travel', icon: <Plane className="w-5 h-5" />, color: 'bg-sky-100 text-sky-600' },
  { name: 'Transport', icon: <Car className="w-5 h-5" />, color: 'bg-orange-100 text-orange-600' },
  { name: 'Meals', icon: <Coffee className="w-5 h-5" />, color: 'bg-amber-100 text-amber-600' },
  { name: 'Professional', icon: <Briefcase className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Telecom', icon: <Phone className="w-5 h-5" />, color: 'bg-teal-100 text-teal-600' },
  { name: 'Other', icon: <Receipt className="w-5 h-5" />, color: 'bg-gray-100 text-gray-600' }
]

export function ExpensesManager() {
  const supabase = createClientComponentClient()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [stats, setStats] = useState<ExpenseStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y' | 'custom'>('30d')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchExpenses()
  }, [dateRange])

  async function fetchExpenses() {
    try {
      setLoading(true)

      const startDate = new Date()
      if (dateRange === '7d') startDate.setDate(startDate.getDate() - 7)
      else if (dateRange === '30d') startDate.setDate(startDate.getDate() - 30)
      else if (dateRange === '90d') startDate.setDate(startDate.getDate() - 90)
      else if (dateRange === '1y') startDate.setFullYear(startDate.getFullYear() - 1)

      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', startDate.toISOString())
        .order('date', { ascending: false })

      setExpenses(expensesData || [])
      calculateStats(expensesData || [])
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  function calculateStats(expensesData: Expense[]) {
    const totalExpenses = expensesData.reduce((sum, e) => sum + e.amount, 0)
    const pendingExpenses = expensesData.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0)
    const approvedExpenses = expensesData.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0)
    const paidExpenses = expensesData.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0)
    const rejectedExpenses = expensesData.filter(e => e.status === 'rejected').reduce((sum, e) => sum + e.amount, 0)

    const byCategory: Record<string, number> = {}
    expensesData.forEach(expense => {
      byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount
    })

    const byMonth: Record<string, number> = {}
    expensesData.forEach(expense => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      byMonth[month] = (byMonth[month] || 0) + expense.amount
    })

    const vendorAmounts: Record<string, number> = {}
    expensesData.forEach(expense => {
      vendorAmounts[expense.vendor] = (vendorAmounts[expense.vendor] || 0) + expense.amount
    })

    const topVendors = Object.entries(vendorAmounts)
      .map(([vendor, amount]) => ({ vendor, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)

    setStats({
      totalExpenses,
      pendingExpenses,
      approvedExpenses,
      paidExpenses,
      rejectedExpenses,
      byCategory,
      byMonth: Object.entries(byMonth).map(([month, amount]) => ({ month, amount })),
      topVendors
    })
  }

  function filteredExpenses() {
    return expenses.filter(expense => {
      const matchesCategory = filterCategory === 'all' || expense.category === filterCategory
      const matchesStatus = filterStatus === 'all' || expense.status === filterStatus
      const matchesSearch = searchQuery === '' ||
        expense.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.employee_name?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesStatus && matchesSearch
    })
  }

  async function approveExpense(expenseId: string) {
    try {
      const { error } = await supabase
        .from('expenses')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', expenseId)

      if (error) throw error
      fetchExpenses()
    } catch (error) {
      console.error('Error approving expense:', error)
      alert('Failed to approve expense')
    }
  }

  async function rejectExpense(expenseId: string) {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return

    try {
      const { error } = await supabase
        .from('expenses')
        .update({ 
          status: 'rejected',
          notes: reason
        })
        .eq('id', expenseId)

      if (error) throw error
      fetchExpenses()
    } catch (error) {
      console.error('Error rejecting expense:', error)
    }
  }

  async function markAsPaid(expenseId: string) {
    try {
      const { error } = await supabase
        .from('expenses')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', expenseId)

      if (error) throw error
      fetchExpenses()
    } catch (error) {
      console.error('Error marking as paid:', error)
    }
  }

  function getCategoryIcon(category: string) {
    return expenseCategories.find(c => c.name === category)?.icon || <Receipt className="w-5 h-5" />
  }

  function getCategoryColor(category: string) {
    return expenseCategories.find(c => c.name === category)?.color || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses Management</h1>
          <p className="text-gray-600 mt-1">Track and manage operational expenses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${(stats?.totalExpenses || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-orange-600">
                  ${(stats?.pendingExpenses || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${(stats?.approvedExpenses || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Paid</p>
                <p className="text-3xl font-bold text-green-600">
                  ${(stats?.paidExpenses || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  ${(stats?.rejectedExpenses || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Expenses by Category */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Expenses by Category
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {expenseCategories.map((category) => {
            const spent = stats?.byCategory[category.name] || 0
            const percentage = stats?.totalExpenses ? (spent / stats.totalExpenses) * 100 : 0
            
            if (spent === 0) return null
            
            return (
              <div
                key={category.name}
                className="p-4 rounded-lg border-2 hover:border-gray-300 transition-colors cursor-pointer"
                onClick={() => setFilterCategory(category.name)}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${category.color}`}>
                  {category.icon}
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">{category.name}</p>
                <p className="text-lg font-bold text-gray-900">${spent.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of total</p>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Monthly Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Monthly Expense Trend
        </h3>
        <div className="h-48 flex items-end gap-2">
          {stats?.byMonth.map((month, index) => {
            const maxAmount = Math.max(...stats.byMonth.map(m => m.amount))
            const height = (month.amount / maxAmount) * 100
            return (
              <div
                key={index}
                className="flex-1 bg-orange-500 hover:bg-orange-600 transition-all rounded-t relative group"
                style={{ height: `${Math.max(10, height)}%` }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  ${month.amount.toLocaleString()}
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          {stats?.byMonth.map((month, index) => (
            <span key={index}>{month.month}</span>
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
                placeholder="Search vendor, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="w-[150px]">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Categories</option>
              {expenseCategories.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="w-[150px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Expenses Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
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
              ) : filteredExpenses().length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No expenses found
                  </td>
                </tr>
              ) : (
                filteredExpenses().map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor(expense.category)}`}>
                          {getCategoryIcon(expense.category)}
                        </div>
                        <span className="font-medium capitalize">{expense.category}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{expense.vendor}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {expense.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {expense.employee_name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ${expense.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={
                        expense.status === 'paid' ? 'success' :
                        expense.status === 'approved' ? 'default' :
                        expense.status === 'pending' ? 'warning' :
                        'error'
                      }>
                        {expense.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {expense.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => approveExpense(expense.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => rejectExpense(expense.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {expense.status === 'approved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => markAsPaid(expense.id)}
                          >
                            Mark Paid
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          View
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

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Expense</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                  ✕
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category *</Label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="">Select category</option>
                      {expenseCategories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Amount *</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date *</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Vendor *</Label>
                    <Input type="text" placeholder="Company name" />
                  </div>
                </div>
                <div>
                  <Label>Description *</Label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Expense description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Employee</Label>
                    <Input type="text" placeholder="Employee name" />
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                      <option value="check">Check</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Receipt</Label>
                  <Input type="file" accept="image/*,.pdf" />
                </div>
                <div>
                  <Label>Notes</Label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Additional notes"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Save Expense</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ExpensesManager
