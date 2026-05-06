/**
 * Fare Optimization & Intelligence System
 * AI-powered fare comparison, historical analysis, and best fare recommendations
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
  Calendar,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  RefreshCcw,
  Star,
  Zap,
  Target,
  ArrowRight,
  Info
} from 'lucide-react'

interface FareData {
  id: string
  route: string
  origin: string
  destination: string
  airline_code: string
  airline_name: string
  fare_basis: string
  cabin_class: 'economy' | 'premium_economy' | 'business' | 'first'
  fare_type: 'published' | 'consolidator' | 'negotiated' | 'corporate'
  base_fare: number
  taxes: number
  total_fare: number
  currency: string
  booking_class: string
  seats_available: number
  fare_rules: {
    refundable: boolean
    exchangeable: boolean
    advance_purchase: number
    min_stay: number
    max_stay: number
    cancellation_penalty: number
    change_penalty: number
  }
  valid_from: string
  valid_until: string
  blackouts?: string[]
  created_at: string
}

interface FareHistory {
  date: string
  fare: number
  seats_available: number
}

interface FareInsight {
  type: 'low' | 'good' | 'high' | 'very_high'
  message: string
  confidence: number
  recommendation: string
  savings: number
}

interface FareComparison {
  current_fare: number
  average_fare: number
  lowest_fare: number
  highest_fare: number
  percentile: number
  trend: 'rising' | 'falling' | 'stable'
  best_time_to_book: string
  predicted_change: number
}

interface FareOptimizationProps {
  route?: string
  origin?: string
  destination?: string
  travelDate?: string
  returnDate?: string
  cabinClass?: string
  passengers?: number
}

export function FareOptimizer({
  route = 'JFK → LHR',
  origin = 'JFK',
  destination = 'LHR',
  travelDate,
  returnDate,
  cabinClass = 'economy',
  passengers = 1
}: FareOptimizationProps) {
  const supabase = createClientComponentClient()
  const [fares, setFares] = useState<FareData[]>([])
  const [fareHistory, setFareHistory] = useState<FareHistory[]>([])
  const [comparison, setComparison] = useState<FareComparison | null>(null)
  const [insight, setInsight] = useState<FareInsight | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFare, setSelectedFare] = useState<FareData | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)

  useEffect(() => {
    analyzeFares()
  }, [origin, destination, cabinClass])

  async function analyzeFares() {
    try {
      setLoading(true)

      // Fetch current fares for route
      const { data: faresData } = await supabase
        .from('fares')
        .select('*')
        .eq('origin', origin)
        .eq('destination', destination)
        .eq('cabin_class', cabinClass)
        .gte('valid_until', new Date().toISOString())
        .order('total_fare', { ascending: true })
        .limit(50)

      setFares(faresData || [])

      // Fetch historical data
      const { data: historyData } = await supabase
        .from('fare_history')
        .select('*')
        .eq('origin', origin)
        .eq('destination', destination)
        .eq('cabin_class', cabinClass)
        .order('date', { ascending: false })
        .limit(90)

      setFareHistory(historyData || [])

      // Calculate comparison metrics
      if (faresData && faresData.length > 0) {
        calculateComparison(faresData, historyData || [])
        generateInsight(faresData, historyData || [])
      }
    } catch (error) {
      console.error('Error analyzing fares:', error)
    } finally {
      setLoading(false)
    }
  }

  function calculateComparison(currentFares: FareData[], history: FareHistory[]) {
    const currentFare = currentFares[0]?.total_fare || 0
    const fares = currentFares.map(f => f.total_fare)
    const historicalFares = history.map(h => h.fare)
    const allFares = [...fares, ...historicalFares]

    const averageFare = allFares.reduce((sum, f) => sum + f, 0) / allFares.length
    const lowestFare = Math.min(...allFares)
    const highestFare = Math.max(...allFares)

    // Calculate percentile
    const sortedFares = [...allFares].sort((a, b) => a - b)
    const percentile = (sortedFares.filter(f => f < currentFare).length / sortedFares.length) * 100

    // Determine trend
    const recentFares = history.slice(0, 14)
    const olderFares = history.slice(14, 30)
    const recentAvg = recentFares.reduce((sum, f) => sum + f.fare, 0) / recentFares.length
    const olderAvg = olderFares.reduce((sum, f) => sum + f.fare, 0) / olderFares.length

    let trend: 'rising' | 'falling' | 'stable'
    if (recentAvg > olderAvg * 1.05) trend = 'rising'
    else if (recentAvg < olderAvg * 0.95) trend = 'falling'
    else trend = 'stable'

    // Predict change
    const predictedChange = trend === 'rising' ? 0.08 : trend === 'falling' ? -0.05 : 0

    setComparison({
      current_fare: currentFare,
      average_fare: averageFare,
      lowest_fare: lowestFare,
      highest_fare: highestFare,
      percentile,
      trend,
      best_time_to_book: getBestTimeToBook(trend),
      predicted_change: predictedChange
    })
  }

  function generateInsight(currentFares: FareData[], history: FareHistory[]) {
    const currentFare = currentFares[0]?.total_fare || 0
    const historicalAvg = history.reduce((sum, h) => sum + h.fare, 0) / history.length
    const lowestHistorical = Math.min(...history.map(h => h.fare))

    const percentDifference = ((currentFare - historicalAvg) / historicalAvg) * 100

    let insight: FareInsight

    if (currentFare <= lowestHistorical * 1.05) {
      insight = {
        type: 'low',
        message: 'Excellent Fare! This is near the lowest price we\'ve seen.',
        confidence: 0.95,
        recommendation: 'Book now - this is an exceptional deal!',
        savings: historicalAvg - currentFare
      }
    } else if (currentFare <= historicalAvg * 0.95) {
      insight = {
        type: 'good',
        message: 'Good Fare! Below average price for this route.',
        confidence: 0.85,
        recommendation: 'This is a good price. Book if it fits your schedule.',
        savings: historicalAvg - currentFare
      }
    } else if (currentFare <= historicalAvg * 1.10) {
      insight = {
        type: 'high',
        message: 'Fair Fare. Slightly above average.',
        confidence: 0.75,
        recommendation: 'Consider waiting or setting a price alert.',
        savings: 0
      }
    } else {
      insight = {
        type: 'very_high',
        message: 'High Fare! Significantly above average.',
        confidence: 0.90,
        recommendation: 'Wait for prices to drop or consider alternative dates.',
        savings: 0
      }
    }

    setInsight(insight)
  }

  function getBestTimeToBook(trend: string): string {
    switch (trend) {
      case 'rising':
        return 'Book now - prices are increasing'
      case 'falling':
        return 'Wait 3-7 days for better prices'
      default:
        return 'Prices are stable - book when convenient'
    }
  }

  function getInsightColor(type: string) {
    switch (type) {
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'good':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'very_high':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  function getInsightIcon(type: string) {
    switch (type) {
      case 'low':
        return <CheckCircle className="w-6 h-6" />
      case 'good':
        return <Star className="w-6 h-6" />
      case 'high':
        return <Info className="w-6 h-6" />
      case 'very_high':
        return <AlertTriangle className="w-6 h-6" />
      default:
        return <Info className="w-6 h-6" />
    }
  }

  const bestFare = fares[0]
  const savings = bestFare ? fares[fares.length - 1]?.total_fare - bestFare.total_fare : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fare Optimization</h1>
          <p className="text-gray-600 mt-1">AI-powered fare analysis and recommendations</p>
        </div>
        <Button onClick={analyzeFares} disabled={loading} variant="outline">
          <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Fare Insight Banner */}
      {insight && (
        <Card className={`p-6 border-2 ${getInsightColor(insight.type)}`}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/50 rounded-lg">
              {getInsightIcon(insight.type)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">{insight.message}</h3>
              <p className="text-sm mb-3">{insight.recommendation}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                </div>
                {insight.savings > 0 && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Save ${insight.savings.toFixed(2)} vs average</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Fare Comparison Stats */}
      {comparison && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Fare</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${comparison.current_fare.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Lowest Seen</p>
                <p className="text-2xl font-bold text-green-600">
                  ${comparison.lowest_fare.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Fare</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${comparison.average_fare.toLocaleString()}
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
                <p className="text-sm text-gray-600">Recommendation</p>
                <p className="text-sm font-medium text-gray-900">
                  {comparison.best_time_to_book}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Price Trend Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Price Trend (90 Days)
        </h3>
        <div className="h-48 flex items-end gap-1">
          {fareHistory.slice(0, 60).map((point, index) => {
            const maxFare = Math.max(...fareHistory.map(h => h.fare))
            const minFare = Math.min(...fareHistory.map(h => h.fare))
            const height = ((point.fare - minFare) / (maxFare - minFare + 1)) * 100
            const isToday = index === 0
            
            return (
              <div
                key={index}
                className={`flex-1 rounded-t transition-all ${
                  isToday ? 'bg-sky-500' :
                  point.fare <= minFare * 1.05 ? 'bg-green-500' :
                  point.fare >= maxFare * 0.95 ? 'bg-red-500' :
                  'bg-gray-300'
                } hover:opacity-80`}
                style={{ height: `${Math.max(10, height)}%` }}
                title={`${point.date}: $${point.fare.toLocaleString()}`}
              />
            )
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>60 days ago</span>
          <span>Today</span>
        </div>
        {comparison && (
          <div className={`mt-4 p-3 rounded-lg ${
            comparison.trend === 'rising' ? 'bg-red-50 text-red-700' :
            comparison.trend === 'falling' ? 'bg-green-50 text-green-700' :
            'bg-gray-50 text-gray-700'
          }`}>
            <div className="flex items-center gap-2">
              {comparison.trend === 'rising' ? (
                <TrendingUp className="w-4 h-4" />
              ) : comparison.trend === 'falling' ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <BarChart3 className="w-4 h-4" />
              )}
              <span className="font-medium capitalize">
                Prices are {comparison.trend}
              </span>
              <span className="text-sm">
                (Predicted: {comparison.predicted_change >= 0 ? '+' : ''}{(comparison.predicted_change * 100).toFixed(0)}% in next 7 days)
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Fare Comparison Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Available Fares</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              {showAnalysis ? 'Hide' : 'Show'} Analysis
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Airline</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fare Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cabin</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Fare</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taxes</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rules</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
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
              ) : fares.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No fares found for this route
                  </td>
                </tr>
              ) : (
                fares.map((fare, index) => {
                  const isBest = index === 0
                  const isLowest = fare.total_fare === Math.min(...fares.map(f => f.total_fare))
                  
                  return (
                    <tr
                      key={fare.id}
                      className={`hover:bg-gray-50 ${isBest ? 'bg-green-50' : ''}`}
                      onClick={() => setSelectedFare(fare)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {isBest && (
                            <Star className="w-4 h-4 text-green-600 fill-green-600" />
                          )}
                          {isLowest && !isBest && (
                            <Zap className="w-4 h-4 text-orange-600" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{fare.airline_name}</div>
                            <div className="text-xs text-gray-500">{fare.airline_code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          fare.fare_type === 'negotiated' ? 'success' :
                          fare.fare_type === 'corporate' ? 'default' :
                          'info'
                        }>
                          {fare.fare_type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize">{fare.cabin_class.replace('_', ' ')}</span>
                        <div className="text-xs text-gray-500">{fare.booking_class}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        ${fare.base_fare.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        ${fare.taxes.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">
                          ${fare.total_fare.toLocaleString()}
                        </div>
                        {isBest && (
                          <div className="text-xs text-green-600">Best Value</div>
                        )}
                        {isLowest && !isBest && (
                          <div className="text-xs text-orange-600">Lowest Price</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            {fare.fare_rules.refundable ? (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                            )}
                            <span className={fare.fare_rules.refundable ? 'text-green-600' : 'text-red-600'}>
                              {fare.fare_rules.refundable ? 'Refundable' : 'Non-refundable'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {fare.fare_rules.exchangeable ? (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                            )}
                            <span className={fare.fare_rules.exchangeable ? 'text-green-600' : 'text-red-600'}>
                              {fare.fare_rules.exchangeable ? 'Exchangeable' : 'Non-exchangeable'}
                            </span>
                          </div>
                          <div className="text-gray-500">
                            Change: ${fare.fare_rules.change_penalty}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" className={isBest ? 'bg-green-600 hover:bg-green-700' : ''}>
                          Select
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Fare Analysis Panel */}
      {showAnalysis && selectedFare && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fare Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Fare Details</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Fare Basis:</dt>
                  <dd className="font-medium">{selectedFare.fare_basis}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Booking Class:</dt>
                  <dd className="font-medium">{selectedFare.booking_class}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Advance Purchase:</dt>
                  <dd className="font-medium">{selectedFare.fare_rules.advance_purchase} days</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Min Stay:</dt>
                  <dd className="font-medium">{selectedFare.fare_rules.min_stay} days</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Max Stay:</dt>
                  <dd className="font-medium">{selectedFare.fare_rules.max_stay} days</dd>
                </div>
              </dl>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Penalties</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Cancellation:</dt>
                  <dd className="font-medium text-red-600">
                    ${selectedFare.fare_rules.cancellation_penalty}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Change Fee:</dt>
                  <dd className="font-medium text-orange-600">
                    ${selectedFare.fare_rules.change_penalty}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Seats Available:</dt>
                  <dd className="font-medium">
                    {selectedFare.seats_available}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Card>
      )}

      {/* Money Saving Tips */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Money Saving Tips
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <li className="flex items-start gap-2 text-sm text-blue-800">
            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Book 6-8 weeks in advance for international flights</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-blue-800">
            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Fly on Tuesdays and Wednesdays for lower fares</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-blue-800">
            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Consider nearby airports for better deals</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-blue-800">
            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Set price alerts to catch fare drops</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-blue-800">
            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Be flexible with dates - use fare calendar</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-blue-800">
            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Book connecting flights for potential savings</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}

export default FareOptimizer
