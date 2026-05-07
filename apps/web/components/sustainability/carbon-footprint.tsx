/**
 * Carbon Footprint Calculator
 * Calculate and offset carbon emissions for travel
 * Modern sustainability feature that competitors lack
 */

'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import {
  Leaf,
  TreeDeciduous,
  Zap,
  Car,
  Plane,
  Droplets,
  Recycle,
  Info,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

interface CarbonFootprintProps {
  type: 'flight' | 'hotel' | 'car' | 'package'
  distance?: number // km (for flights/cars)
  nights?: number // for hotels
  carType?: 'economy' | 'standard' | 'suv' | 'luxury'
  flightClass?: 'economy' | 'business' | 'first'
  showOffset?: boolean
}

interface CarbonData {
  emissions: number // kg CO2
  equivalent: {
    trees: number // trees needed to offset for a year
    carMiles: number // miles driven by average car
    homes: number // homes powered for a day
  }
  offsetCost: number // USD
  rating: 'low' | 'medium' | 'high' | 'very_high'
}

export function CarbonFootprintCalculator({
  type,
  distance = 5000,
  nights = 5,
  carType = 'standard',
  flightClass = 'economy',
  showOffset = true
}: CarbonFootprintProps) {
  const [offsetSelected, setOffsetSelected] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const carbonData = calculateCarbonFootprint()

  function calculateCarbonFootprint(): CarbonData {
    let emissions = 0

    if (type === 'flight') {
      // Flight emissions per km per passenger
      const baseEmission = 0.115 // kg CO2 per km (economy)
      const classMultiplier = {
        economy: 1,
        business: 2.5,
        first: 4
      }
      emissions = distance * baseEmission * classMultiplier[flightClass]
    } else if (type === 'hotel') {
      // Hotel emissions per night
      const baseEmission = 20 // kg CO2 per night (average hotel)
      emissions = nights * baseEmission
    } else if (type === 'car') {
      // Car emissions per km
      const emissionRates = {
        economy: 0.089,
        standard: 0.120,
        suv: 0.195,
        luxury: 0.250
      }
      emissions = distance * emissionRates[carType]
    } else if (type === 'package') {
      // Combined package
      const flightEmission = (distance || 5000) * 0.115
      const hotelEmission = (nights || 5) * 20
      const carEmission = (distance || 5000) * 0.120 * 0.3 // Assume 30% driving
      emissions = flightEmission + hotelEmission + carEmission
    }

    // Calculate equivalents
    const trees = emissions / 22 // One tree absorbs ~22 kg CO2 per year
    const carMiles = emissions / 0.404 // Average car emits 0.404 kg CO2 per mile
    const homes = emissions / 48 // Average home uses 48 kg CO2 per day

    // Calculate offset cost ($15 per ton = $0.015 per kg)
    const offsetCost = emissions * 0.015

    // Determine rating
    let rating: CarbonData['rating']
    if (emissions < 100) rating = 'low'
    else if (emissions < 500) rating = 'medium'
    else if (emissions < 1000) rating = 'high'
    else rating = 'very_high'

    return {
      emissions: Math.round(emissions),
      equivalent: {
        trees: Math.round(trees * 10) / 10,
        carMiles: Math.round(carMiles),
        homes: Math.round(homes)
      },
      offsetCost: Math.round(offsetCost * 100) / 100,
      rating
    }
  }

  const ratingColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    very_high: 'bg-red-100 text-red-700'
  }

  const ratingLabels = {
    low: 'Low Impact',
    medium: 'Medium Impact',
    high: 'High Impact',
    very_high: 'Very High Impact'
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Carbon Footprint</h3>
        </div>
        <Badge className={ratingColors[carbonData.rating]}>
          {ratingLabels[carbonData.rating]}
        </Badge>
      </div>

      {/* Main Emissions */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900 mb-1">
          {carbonData.emissions.toLocaleString()} <span className="text-lg font-normal text-gray-600">kg CO₂</span>
        </div>
        <p className="text-sm text-gray-600">Estimated carbon emissions for your trip</p>
      </div>

      {/* Environmental Equivalents */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-white rounded-lg">
          <TreeDeciduous className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{carbonData.equivalent.trees}</p>
          <p className="text-xs text-gray-600">Trees for 1 year</p>
        </div>
        <div className="text-center p-3 bg-white rounded-lg">
          <Car className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{carbonData.equivalent.carMiles.toLocaleString()}</p>
          <p className="text-xs text-gray-600">Car miles driven</p>
        </div>
        <div className="text-center p-3 bg-white rounded-lg">
          <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{carbonData.equivalent.homes}</p>
          <p className="text-xs text-gray-600">Homes powered (day)</p>
        </div>
      </div>

      {/* Emission Breakdown */}
      {showDetails && (
        <div className="mb-6 space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Emission Breakdown</h4>
          <div className="space-y-2">
            {type === 'flight' && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Plane className="w-4 h-4 text-sky-600" />
                  <span className="text-gray-600">Flight ({distance.toLocaleString()} km)</span>
                  <span className="ml-auto font-medium">{carbonData.emissions} kg</span>
                </div>
                {flightClass !== 'economy' && (
                  <p className="text-xs text-gray-500 ml-6">
                    {flightClass} class emits {(flightClass === 'business' ? 2.5 : 4)}x more than economy
                  </p>
                )}
              </>
            )}
            {type === 'hotel' && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 text-orange-600">🏨</div>
                <span className="text-gray-600">Hotel ({nights} nights)</span>
                <span className="ml-auto font-medium">{carbonData.emissions} kg</span>
              </div>
            )}
            {type === 'car' && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-600">Car rental ({distance.toLocaleString()} km)</span>
                  <span className="ml-auto font-medium">{carbonData.emissions} kg</span>
                </div>
                <p className="text-xs text-gray-500 ml-6 capitalize">
                  {carType} class vehicle
                </p>
              </>
            )}
            {type === 'package' && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Plane className="w-4 h-4 text-sky-600" />
                  <span className="text-gray-600">Flights</span>
                  <span className="ml-auto font-medium">{Math.round(carbonData.emissions * 0.65)} kg</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 text-orange-600">🏨</div>
                  <span className="text-gray-600">Hotel</span>
                  <span className="ml-auto font-medium">{Math.round(carbonData.emissions * 0.20)} kg</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-600">Car rental</span>
                  <span className="ml-auto font-medium">{Math.round(carbonData.emissions * 0.15)} kg</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-green-600 hover:underline flex items-center gap-1 mb-6"
      >
        <Info className="w-3 h-3" />
        {showDetails ? 'Hide details' : 'View breakdown'}
      </button>

      {/* Carbon Offset */}
      {showOffset && (
        <div className="border-t border-green-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Recycle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Offset Your Emissions</span>
            </div>
            <span className="text-lg font-bold text-green-600">
              ${carbonData.offsetCost.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Support verified carbon offset projects including reforestation, renewable energy, and community initiatives.
          </p>
          <Button
            className={`w-full ${offsetSelected ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
            onClick={() => setOffsetSelected(!offsetSelected)}
          >
            {offsetSelected ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Carbon Offset Added
              </>
            ) : (
              <>
                <Leaf className="w-4 h-4 mr-2" />
                Add Carbon Offset
              </>
            )}
          </Button>
          {offsetSelected && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              ${carbonData.offsetCost.toFixed(2)} will be added to your total
            </p>
          )}
        </div>
      )}

      {/* Eco Tips */}
      <div className="mt-4 p-3 bg-green-100 rounded-lg">
        <h4 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-1">
          <Leaf className="w-3 h-3" />
          Eco Tips
        </h4>
        <ul className="text-xs text-green-800 space-y-1">
          {type === 'flight' && (
            <>
              <li>• Choose economy class for lower emissions</li>
              <li>• Direct flights produce less CO₂ than connections</li>
              <li>• Pack light to reduce aircraft weight</li>
            </>
          )}
          {type === 'hotel' && (
            <>
              <li>• Reuse towels to save water and energy</li>
              <li>• Turn off AC/lights when leaving room</li>
              <li>• Choose eco-certified hotels</li>
            </>
          )}
          {type === 'car' && (
            <>
              <li>• Choose economy or hybrid vehicles</li>
              <li>• Maintain steady speeds for better efficiency</li>
              <li>• Combine trips to reduce driving</li>
            </>
          )}
          {type === 'package' && (
            <>
              <li>• Consider train travel for short distances</li>
              <li>• Book eco-certified accommodations</li>
              <li>• Use public transport at destination</li>
            </>
          )}
        </ul>
      </div>
    </Card>
  )
}

export default CarbonFootprintCalculator
