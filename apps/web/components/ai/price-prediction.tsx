/**
 * AI Price Prediction
 * Predicts whether flight/hotel prices will increase or decrease
 * Uses historical data and machine learning patterns
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@vertravels/ui'
import { Badge } from '@vertravels/ui'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Clock, BarChart3 } from 'lucide-react'

interface PricePrediction {
  currentPrice: number
  predictedPrice: number
  confidence: number
  trend: 'up' | 'down' | 'stable'
  bestTimeToBook: string
  priceHistory: Array<{
    date: string
    price: number
  }>
  factors: string[]
  recommendation: string
}

interface PricePredictionProps {
  route?: string
  travelDate: string
  currentPrice: number
  currency?: string
  type?: 'flight' | 'hotel'
}

export function PricePrediction({
  route = 'JFK → LHR',
  travelDate,
  currentPrice,
  currency = 'USD',
  type = 'flight'
}: PricePredictionProps) {
  const [prediction, setPrediction] = useState<PricePrediction | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    generatePrediction()
  }, [route, travelDate, currentPrice])

  async function generatePrediction() {
    setLoading(true)
    
    // Simulate AI prediction (in production, this would call ML API)
    // Using historical patterns and seasonal trends
    
    const baseFluctuation = 0.15 // 15% typical fluctuation
    const seasonalFactor = getSeasonalFactor(travelDate)
    const demandFactor = getDemandFactor(travelDate)
    const daysUntilTravel = getDaysUntilTravel(travelDate)
    
    // Calculate prediction
    let predictedChange = 0
    
    // Prices typically increase closer to travel date
    if (daysUntilTravel < 30) {
      predictedChange += 0.10 // +10% in last month
    } else if (daysUntilTravel < 60) {
      predictedChange += 0.05 // +5% in 1-2 months
    } else {
      predictedChange -= 0.05 // -5% if booking early
    }
    
    // Seasonal adjustments
    predictedChange += seasonalFactor
    
    // Demand adjustments
    predictedChange += demandFactor
    
    // Add some randomness
    predictedChange += (Math.random() - 0.5) * 0.10
    
    const predictedPrice = currentPrice * (1 + predictedChange)
    const confidence = Math.min(0.95, Math.max(0.60, 0.85 - Math.abs(predictedChange)))
    
    // Determine trend
    let trend: 'up' | 'down' | 'stable'
    if (predictedChange > 0.03) trend = 'up'
    else if (predictedChange < -0.03) trend = 'down'
    else trend = 'stable'
    
    // Generate factors
    const factors: string[] = []
    if (daysUntilTravel < 30) factors.push('Booking window closing')
    if (seasonalFactor > 0.05) factors.push('Peak travel season')
    if (seasonalFactor < -0.05) factors.push('Off-peak season')
    if (demandFactor > 0.05) factors.push('High demand period')
    if (daysUntilTravel > 90) factors.push('Early booking discount')
    factors.push('Historical price patterns')
    
    // Generate recommendation
    let recommendation = ''
    if (trend === 'up' && confidence > 0.75) {
      recommendation = `Prices are expected to rise by ${Math.abs(predictedChange * 100).toFixed(0)}%. Book now to save $${(predictedPrice - currentPrice).toFixed(0)}.`
    } else if (trend === 'down' && confidence > 0.75) {
      recommendation = `Prices may drop by ${Math.abs(predictedChange * 100).toFixed(0)}%. Consider waiting or set a price alert.`
    } else {
      recommendation = 'Prices are stable. Good time to book if you find a convenient option.'
    }
    
    // Generate price history (simulated)
    const priceHistory = []
    const today = new Date()
    for (let i = 30; i >= 0; i -= 5) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const historicalPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.10)
      priceHistory.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Math.round(historicalPrice)
      })
    }
    
    // Calculate best time to book
    const bestTime = daysUntilTravel > 60 
      ? 'Book within next 2 weeks'
      : daysUntilTravel > 30
      ? 'Book now - prices rising soon'
      : 'Book immediately - limited availability'
    
    setPrediction({
      currentPrice,
      predictedPrice: Math.round(predictedPrice),
      confidence,
      trend,
      bestTimeToBook: bestTime,
      priceHistory,
      factors,
      recommendation
    })
    
    setLoading(false)
  }

  function getSeasonalFactor(date: string): number {
    const month = new Date(date).getMonth()
    // Peak seasons (summer, holidays)
    if ([5, 6, 7, 11].includes(month)) return 0.08
    // Shoulder seasons
    if ([3, 4, 8, 9].includes(month)) return 0.02
    // Off-peak
    return -0.05
  }

  function getDemandFactor(date: string): number {
    const dayOfWeek = new Date(date).getDay()
    // Weekends are higher demand
    if ([0, 5, 6].includes(dayOfWeek)) return 0.05
    return 0
  }

  function getDaysUntilTravel(date: string): number {
    const travel = new Date(date)
    const today = new Date()
    const diff = travel.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    )
  }

  if (!prediction) return null

  return (
    <Card className="p-4 bg-gradient-to-br from-white to-sky-50 border-sky-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-sky-600" />
          <h3 className="font-semibold text-gray-900">Price Prediction</h3>
        </div>
        <Badge variant={prediction.trend === 'up' ? 'error' : prediction.trend === 'down' ? 'success' : 'warning'}>
          {prediction.trend === 'up' ? 'Rising' : prediction.trend === 'down' ? 'Falling' : 'Stable'}
        </Badge>
      </div>

      {/* Main Prediction */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Current Price</p>
          <p className="text-2xl font-bold text-gray-900">
            ${prediction.currentPrice.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Predicted Price</p>
          <div className="flex items-center gap-2">
            <p className={`text-2xl font-bold ${
              prediction.trend === 'up' ? 'text-red-600' :
              prediction.trend === 'down' ? 'text-green-600' :
              'text-gray-900'
            }`}>
              ${prediction.predictedPrice.toLocaleString()}
            </p>
            {prediction.trend === 'up' ? (
              <TrendingUp className="w-5 h-5 text-red-600" />
            ) : prediction.trend === 'down' ? (
              <TrendingDown className="w-5 h-5 text-green-600" />
            ) : (
              <Minus className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Confidence</span>
          <span className="font-medium">{(prediction.confidence * 100).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              prediction.confidence > 0.8 ? 'bg-green-500' :
              prediction.confidence > 0.6 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${prediction.confidence * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Recommendation */}
      <div className={`p-3 rounded-lg mb-4 ${
        prediction.trend === 'up' ? 'bg-red-50 border border-red-200' :
        prediction.trend === 'down' ? 'bg-green-50 border border-green-200' :
        'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-start gap-2">
          {prediction.trend === 'up' ? (
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          ) : prediction.trend === 'down' ? (
            <Clock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          )}
          <p className={`text-sm ${
            prediction.trend === 'up' ? 'text-red-800' :
            prediction.trend === 'down' ? 'text-green-800' :
            'text-yellow-800'
          }`}>
            {prediction.recommendation}
          </p>
        </div>
      </div>

      {/* Best Time to Book */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Clock className="w-4 h-4" />
        <span>Best time to book: <strong className="text-gray-900">{prediction.bestTimeToBook}</strong></span>
      </div>

      {/* Price History Chart */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Price History (30 days)</span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-sky-600 hover:underline"
          >
            {showDetails ? 'Hide details' : 'View details'}
          </button>
        </div>
        <div className="h-24 flex items-end gap-1">
          {prediction.priceHistory.map((point, index) => {
            const maxPrice = Math.max(...prediction.priceHistory.map(p => p.price))
            const minPrice = Math.min(...prediction.priceHistory.map(p => p.price))
            const height = ((point.price - minPrice) / (maxPrice - minPrice + 1)) * 100
            return (
              <div
                key={index}
                className="flex-1 bg-sky-200 hover:bg-sky-400 transition-colors rounded-t"
                style={{ height: `${Math.max(10, height)}%` }}
                title={`${point.date}: $${point.price}`}
              />
            )
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Factors */}
      {showDetails && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Price Factors</h4>
          <ul className="space-y-1">
            {prediction.factors.map((factor, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Price Alert */}
      <div className="border-t pt-4 mt-4">
        <button className="w-full py-2 text-sm text-sky-600 hover:bg-sky-50 rounded-lg transition-colors flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Set Price Alert
        </button>
      </div>
    </Card>
  )
}

export default PricePrediction
