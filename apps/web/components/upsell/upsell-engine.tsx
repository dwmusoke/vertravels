/**
 * Upselling & Cross-selling Engine
 * Intelligent product recommendations during booking flow
 */

'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { Checkbox } from '@/components/ui'
import {
  Luggage,
  Armchair,
  Utensils,
  Shield,
  Car,
  Wine,
  Wifi,
  Tv,
  Coffee,
  Plane,
  Hotel,
  Ticket,
  Clock,
  CheckCircle,
  Star,
  Zap,
  Percent
} from 'lucide-react'

interface UpsellItem {
  id: string
  type: 'seat' | 'baggage' | 'meal' | 'insurance' | 'transfer' | 'upgrade' | 'lounge' | 'priority' | 'amenity' | 'activity'
  name: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  icon: React.ReactNode
  popular?: boolean
  recommended?: boolean
  category: 'flights' | 'hotels' | 'cars' | 'general'
  features?: string[]
}

interface UpsellEngineProps {
  bookingType: 'flight' | 'hotel' | 'car' | 'package'
  basePrice: number
  currency?: string
  passengerCount?: number
  nights?: number
  onAddonsChange?: (addons: SelectedAddon[]) => void
}

interface SelectedAddon {
  id: string
  quantity: number
  price: number
}

export function UpsellEngine({
  bookingType,
  basePrice,
  currency = 'USD',
  passengerCount = 1,
  nights = 1,
  onAddonsChange
}: UpsellEngineProps) {
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([])

  // Flight upsells
  const flightUpsells: UpsellItem[] = [
    {
      id: 'seat_extra_legroom',
      type: 'seat',
      name: 'Extra Legroom Seat',
      description: 'Up to 6 inches more legroom for comfortable travel',
      price: 79,
      currency,
      icon: <Armchair className="w-5 h-5" />,
      popular: true,
      category: 'flights',
      features: ['Up to 6" extra legroom', 'Priority boarding', 'Dedicated overhead space']
    },
    {
      id: 'seat_premium',
      type: 'seat',
      name: 'Premium Economy Seat',
      description: 'Wider seats with enhanced comfort and amenities',
      price: 199,
      originalPrice: 299,
      currency,
      icon: <Armchair className="w-5 h-5" />,
      recommended: true,
      category: 'flights',
      features: ['Wider seat', 'Extra recline', 'Premium meal', 'Amenity kit']
    },
    {
      id: 'baggage_extra_23kg',
      type: 'baggage',
      name: 'Extra Checked Bag (23kg)',
      description: 'Additional checked baggage allowance',
      price: 60,
      currency,
      icon: <Luggage className="w-5 h-5" />,
      category: 'flights'
    },
    {
      id: 'baggage_extra_32kg',
      type: 'baggage',
      name: 'Heavy Bag (32kg)',
      description: 'For heavier luggage needs',
      price: 100,
      currency,
      icon: <Luggage className="w-5 h-5" />,
      category: 'flights'
    },
    {
      id: 'meal_special',
      type: 'meal',
      name: 'Premium Meal Selection',
      description: 'Chef-curated meals with beverage pairing',
      price: 35,
      currency,
      icon: <Utensils className="w-5 h-5" />,
      category: 'flights',
      features: ['Choice of 3 meals', 'Complimentary wine', 'Dessert included']
    },
    {
      id: 'insurance_comprehensive',
      type: 'insurance',
      name: 'Comprehensive Travel Insurance',
      description: 'Full coverage for trip cancellation, medical, and baggage',
      price: basePrice * 0.08,
      currency,
      icon: <Shield className="w-5 h-5" />,
      recommended: true,
      category: 'general',
      features: ['Trip cancellation', 'Medical coverage up to $100,000', 'Baggage protection', '24/7 assistance']
    },
    {
      id: 'insurance_basic',
      type: 'insurance',
      name: 'Basic Travel Insurance',
      description: 'Essential coverage for your trip',
      price: basePrice * 0.04,
      currency,
      icon: <Shield className="w-5 h-5" />,
      category: 'general',
      features: ['Trip cancellation', 'Medical coverage up to $50,000']
    },
    {
      id: 'lounge_access',
      type: 'lounge',
      name: 'Airport Lounge Access',
      description: 'Relax in premium lounges before your flight',
      price: 45,
      currency,
      icon: <Coffee className="w-5 h-5" />,
      popular: true,
      category: 'flights',
      features: ['Complimentary food & drinks', 'WiFi', 'Showers', 'Quiet environment']
    },
    {
      id: 'priority_boarding',
      type: 'priority',
      name: 'Priority Boarding',
      description: 'Board first and settle in comfortably',
      price: 25,
      currency,
      icon: <Zap className="w-5 h-5" />,
      category: 'flights'
    },
    {
      id: 'wifi_flight',
      type: 'amenity',
      name: 'In-Flight WiFi',
      description: 'Stay connected during your flight',
      price: 19,
      currency,
      icon: <Wifi className="w-5 h-5" />,
      category: 'flights'
    },
    {
      id: 'entertainment_premium',
      type: 'amenity',
      name: 'Premium Entertainment',
      description: 'Access to premium movies and TV shows',
      price: 12,
      currency,
      icon: <Tv className="w-5 h-5" />,
      category: 'flights'
    },
    {
      id: 'transfer_private',
      type: 'transfer',
      name: 'Private Airport Transfer',
      description: 'Luxury car service to/from airport',
      price: 89,
      currency,
      icon: <Car className="w-5 h-5" />,
      category: 'general',
      features: ['Meet & greet', 'Flight tracking', '60 min free waiting', 'Luxury vehicle']
    }
  ]

  // Hotel upsells
  const hotelUpsells: UpsellItem[] = [
    {
      id: 'room_upgrade_deluxe',
      type: 'upgrade',
      name: 'Deluxe Room Upgrade',
      description: 'Upgrade to a larger room with better views',
      price: 50 * nights,
      currency,
      icon: <Star className="w-5 h-5" />,
      popular: true,
      category: 'hotels',
      features: ['Larger room size', 'Better view', 'Premium amenities', 'Late checkout']
    },
    {
      id: 'room_upgrade_suite',
      type: 'upgrade',
      name: 'Suite Upgrade',
      description: 'Luxury suite with separate living area',
      price: 150 * nights,
      originalPrice: 250 * nights,
      currency,
      icon: <Star className="w-5 h-5" />,
      recommended: true,
      category: 'hotels',
      features: ['Separate living room', 'Premium view', 'Butler service', 'Complimentary minibar']
    },
    {
      id: 'breakfast_included',
      type: 'meal',
      name: 'Daily Breakfast',
      description: 'Start your day with a delicious breakfast',
      price: 25 * nights * passengerCount,
      currency,
      icon: <Coffee className="w-5 h-5" />,
      popular: true,
      category: 'hotels'
    },
    {
      id: 'insurance_hotel',
      type: 'insurance',
      name: 'Booking Protection',
      description: 'Free cancellation up to 24 hours before check-in',
      price: basePrice * 0.05,
      currency,
      icon: <Shield className="w-5 h-5" />,
      category: 'hotels',
      features: ['Free cancellation', 'Date change flexibility', 'Price protection']
    },
    {
      id: 'spa_credit',
      type: 'amenity',
      name: 'Spa Credit',
      description: 'Relax with spa treatments',
      price: 100,
      currency,
      icon: <Wine className="w-5 h-5" />,
      category: 'hotels'
    },
    {
      id: 'airport_transfer_hotel',
      type: 'transfer',
      name: 'Airport Transfer',
      description: 'Convenient transportation to/from hotel',
      price: 45,
      currency,
      icon: <Car className="w-5 h-5" />,
      category: 'hotels'
    },
    {
      id: 'early_checkin',
      type: 'amenity',
      name: 'Early Check-in',
      description: 'Check in from 10 AM instead of 3 PM',
      price: 30,
      currency,
      icon: <Clock className="w-5 h-5" />,
      category: 'hotels'
    },
    {
      id: 'late_checkout',
      type: 'amenity',
      name: 'Late Check-out',
      description: 'Check out at 4 PM instead of 11 AM',
      price: 30,
      currency,
      icon: <Clock className="w-5 h-5" />,
      category: 'hotels'
    }
  ]

  // Car rental upsells
  const carUpsells: UpsellItem[] = [
    {
      id: 'car_upgrade',
      type: 'upgrade',
      name: 'Vehicle Upgrade',
      description: 'Upgrade to a higher car category',
      price: 35,
      currency,
      icon: <Car className="w-5 h-5" />,
      popular: true,
      category: 'cars'
    },
    {
      id: 'gps_navigation',
      type: 'amenity',
      name: 'GPS Navigation',
      description: 'Never get lost with built-in navigation',
      price: 12,
      currency,
      icon: <Ticket className="w-5 h-5" />,
      category: 'cars'
    },
    {
      id: 'child_seat',
      type: 'amenity',
      name: 'Child Seat',
      description: 'Safe and comfortable for your child',
      price: 10,
      currency,
      icon: <Armchair className="w-5 h-5" />,
      category: 'cars'
    },
    {
      id: 'additional_driver',
      type: 'amenity',
      name: 'Additional Driver',
      description: 'Share driving responsibilities',
      price: 15,
      currency,
      icon: <Ticket className="w-5 h-5" />,
      category: 'cars'
    },
    {
      id: 'insurance_cdw',
      type: 'insurance',
      name: 'Collision Damage Waiver',
      description: 'Reduce your liability in case of damage',
      price: 25,
      currency,
      icon: <Shield className="w-5 h-5" />,
      recommended: true,
      category: 'cars'
    },
    {
      id: 'insurance_pai',
      type: 'insurance',
      name: 'Personal Accident Insurance',
      description: 'Coverage for medical expenses',
      price: 8,
      currency,
      icon: <Shield className="w-5 h-5" />,
      category: 'cars'
    },
    {
      id: 'fuel_prepaid',
      type: 'amenity',
      name: 'Prepaid Fuel',
      description: 'Return the car with any fuel level',
      price: 45,
      currency,
      icon: <Wine className="w-5 h-5" />,
      category: 'cars'
    }
  ]

  // Get relevant upsells based on booking type
  const getRelevantUpsells = () => {
    switch (bookingType) {
      case 'flight':
        return flightUpsells
      case 'hotel':
        return hotelUpsells
      case 'car':
        return carUpsells
      case 'package':
        return [...flightUpsells, ...hotelUpsells, ...carUpsells]
      default:
        return []
    }
  }

  const relevantUpsells = getRelevantUpsells()

  // Calculate totals
  const calculateTotal = () => {
    return selectedAddons.reduce((total, addon) => {
      const upsell = relevantUpsells.find(u => u.id === addon.id)
      return total + (upsell?.price || 0) * addon.quantity
    }, 0)
  }

  const handleToggle = (upsellId: string) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.id === upsellId)
      if (exists) {
        const updated = prev.filter(a => a.id !== upsellId)
        onAddonsChange?.(updated)
        return updated
      } else {
        const updated = [...prev, { id: upsellId, quantity: 1, price: 0 }]
        onAddonsChange?.(updated)
        return updated
      }
    })
  }

  const isSelected = (id: string) => selectedAddons.some(a => a.id === id)

  const totalSavings = relevantUpsells
    .filter(u => u.originalPrice && isSelected(u.id))
    .reduce((total, u) => total + ((u.originalPrice || 0) - u.price), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Enhance Your Trip</h3>
        {totalSavings > 0 && (
          <Badge variant="success" className="bg-green-100 text-green-700">
            Save ${totalSavings.toFixed(2)}
          </Badge>
        )}
      </div>

      {/* Recommended Section */}
      {relevantUpsells.some(u => u.recommended) && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            Recommended for You
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relevantUpsells
              .filter(u => u.recommended)
              .map(upsell => (
                <UpsellCard
                  key={upsell.id}
                  upsell={upsell}
                  selected={isSelected(upsell.id)}
                  onToggle={() => handleToggle(upsell.id)}
                />
              ))}
          </div>
        </div>
      )}

      {/* Popular Section */}
      {relevantUpsells.some(u => u.popular && !u.recommended) && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500" />
            Popular Add-ons
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relevantUpsells
              .filter(u => u.popular && !u.recommended)
              .map(upsell => (
                <UpsellCard
                  key={upsell.id}
                  upsell={upsell}
                  selected={isSelected(upsell.id)}
                  onToggle={() => handleToggle(upsell.id)}
                />
              ))}
          </div>
        </div>
      )}

      {/* All Add-ons Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">All Add-ons</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {relevantUpsells
            .filter(u => !u.popular && !u.recommended)
            .map(upsell => (
              <UpsellCard
                key={upsell.id}
                upsell={upsell}
                selected={isSelected(upsell.id)}
                onToggle={() => handleToggle(upsell.id)}
              />
            ))}
        </div>
      </div>

      {/* Summary */}
      {selectedAddons.length > 0 && (
        <Card className="p-4 bg-sky-50 border-sky-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Selected Add-ons ({selectedAddons.length})</p>
              <p className="text-2xl font-bold text-sky-600">
                ${calculateTotal().toFixed(2)}
              </p>
            </div>
            <Button className="bg-sky-600 hover:bg-sky-700">
              Add to Booking
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

// Individual Upsell Card Component
function UpsellCard({
  upsell,
  selected,
  onToggle
}: {
  upsell: UpsellItem
  selected: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
        selected
          ? 'border-sky-500 bg-sky-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <Checkbox checked={selected} onChange={onToggle} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${
                selected ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {upsell.icon}
              </div>
              <div>
                <h5 className="font-medium text-gray-900">{upsell.name}</h5>
                {upsell.popular && (
                  <Badge variant="warning" className="text-xs">Popular</Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              {upsell.originalPrice && (
                <p className="text-sm text-gray-500 line-through">
                  ${upsell.originalPrice.toFixed(2)}
                </p>
              )}
              <p className={`font-semibold ${
                selected ? 'text-sky-600' : 'text-gray-900'
              }`}>
                ${upsell.price.toFixed(2)}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{upsell.description}</p>
          {upsell.features && (
            <ul className="mt-2 space-y-1">
              {upsell.features.map((feature, i) => (
                <li key={i} className="text-xs text-gray-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default UpsellEngine
