/**
 * Loyalty Points & Rewards System
 * Tier-based loyalty program with points earning and redemption
 */

'use client'

import { useState } from 'react'
import { Card } from '@vertravels/ui'
import { Badge } from '@vertravels/ui'
import { Button } from '@vertravels/ui'
import { Progress } from '@vertravels/ui'
import {
  Star,
  Trophy,
  Gift,
  Percent,
  Plane,
  Hotel,
  Car,
  Ticket,
  Crown,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react'

interface LoyaltyProgramProps {
  userId: string
  currentPoints: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  lifetimePoints: number
  pointsToNextTier: number
}

interface Tier {
  name: string
  icon: React.ReactNode
  color: string
  benefits: string[]
  pointsMultiplier: number
  nextTierPoints?: number
}

const tiers: Record<string, Tier> = {
  bronze: {
    name: 'Bronze',
    icon: <Award className="w-5 h-5" />,
    color: 'from-amber-700 to-amber-900',
    benefits: [
      'Earn 1 point per $1 spent',
      'Free seat selection',
      'Priority email support',
      'Birthday bonus: 500 points'
    ],
    pointsMultiplier: 1,
    nextTierPoints: 10000
  },
  silver: {
    name: 'Silver',
    icon: <Star className="w-5 h-5" />,
    color: 'from-gray-400 to-gray-600',
    benefits: [
      'Earn 1.5 points per $1 spent',
      'Free checked bag',
      'Priority boarding',
      'Room upgrades (subject to availability)',
      'Birthday bonus: 1,000 points'
    ],
    pointsMultiplier: 1.5,
    nextTierPoints: 25000
  },
  gold: {
    name: 'Gold',
    icon: <Trophy className="w-5 h-5" />,
    color: 'from-yellow-400 to-yellow-600',
    benefits: [
      'Earn 2 points per $1 spent',
      '2 free checked bags',
      'Lounge access',
      'Guaranteed room upgrades',
      'Late checkout (2 PM)',
      'Birthday bonus: 2,500 points',
      'Annual companion pass'
    ],
    pointsMultiplier: 2,
    nextTierPoints: 50000
  },
  platinum: {
    name: 'Platinum',
    icon: <Crown className="w-5 h-5" />,
    color: 'from-sky-400 to-blue-600',
    benefits: [
      'Earn 3 points per $1 spent',
      'Unlimited free bags',
      'Unlimited lounge access',
      'Automatic suite upgrades',
      'Late checkout (4 PM)',
      'Personal travel concierge',
      'Birthday bonus: 5,000 points',
      'Annual companion pass + 2 guest passes',
      'Exclusive platinum events'
    ],
    pointsMultiplier: 3
  }
}

const rewards = [
  {
    id: 1,
    name: '$10 Flight Discount',
    points: 2500,
    icon: <Plane className="w-5 h-5" />,
    category: 'flights',
    description: 'Save $10 on any flight booking'
  },
  {
    id: 2,
    name: '$25 Hotel Discount',
    points: 6000,
    icon: <Hotel className="w-5 h-5" />,
    category: 'hotels',
    description: 'Save $25 on hotel stays'
  },
  {
    id: 3,
    name: 'Free Car Rental Day',
    points: 8000,
    icon: <Car className="w-5 h-5" />,
    category: 'cars',
    description: 'Get one day free on car rentals'
  },
  {
    id: 4,
    name: '$50 Travel Voucher',
    points: 12000,
    icon: <Ticket className="w-5 h-5" />,
    category: 'general',
    description: 'Use on any booking'
  },
  {
    id: 5,
    name: 'Airport Lounge Pass',
    points: 5000,
    icon: <Zap className="w-5 h-5" />,
    category: 'perks',
    description: 'One-time lounge access'
  },
  {
    id: 6,
    name: '10% Off Tours',
    points: 3000,
    icon: <Percent className="w-5 h-5" />,
    category: 'tours',
    description: 'Discount on tour bookings'
  },
  {
    id: 7,
    name: 'Room Upgrade',
    points: 7500,
    icon: <Gift className="w-5 h-5" />,
    category: 'hotels',
    description: 'Complimentary room upgrade'
  },
  {
    id: 8,
    name: '$100 Premium Voucher',
    points: 24000,
    icon: <Gift className="w-5 h-5" />,
    category: 'general',
    description: 'Premium travel voucher'
  }
]

export function LoyaltyProgram({
  userId,
  currentPoints,
  tier: userTier,
  lifetimePoints,
  pointsToNextTier
}: LoyaltyProgramProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'earn' | 'redeem'>('overview')
  const tier = tiers[userTier]

  const progressToNextTier = tier.nextTierPoints
    ? ((currentPoints % tier.nextTierPoints) / (tier.nextTierPoints / 100)) * 100
    : 100

  return (
    <Card className="p-6">
      {/* Header Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('earn')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'earn'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Earn Points
        </button>
        <button
          onClick={() => setActiveTab('redeem')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'redeem'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Redeem Rewards
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Tier Card */}
          <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${tier.color} p-6 text-white`}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-lg">
                    {tier.icon}
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Current Tier</p>
                    <h3 className="text-2xl font-bold">{tier.name} Member</h3>
                  </div>
                </div>
                <Crown className="w-12 h-12 opacity-20" />
              </div>

              {/* Points Display */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm opacity-90">Available Points</p>
                  <p className="text-3xl font-bold">{currentPoints.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Lifetime Points</p>
                  <p className="text-3xl font-bold">{lifetimePoints.toLocaleString()}</p>
                </div>
              </div>

              {/* Progress to Next Tier */}
              {tier.nextTierPoints && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress to {tiers[Object.keys(tiers)[Object.keys(tiers).indexOf(userTier) + 1] as keyof typeof tiers]?.name || 'Platinum'}</span>
                    <span>{Math.round(progressToNextTier)}%</span>
                  </div>
                  <Progress value={progressToNextTier} className="h-2 bg-white/20" />
                  <p className="text-xs mt-1 opacity-90">
                    {pointsToNextTier.toLocaleString()} points until next tier
                  </p>
                </div>
              )}
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>
          </div>

          {/* Tier Benefits */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-sky-600" />
              Your Benefits
            </h4>
            <ul className="space-y-2">
              {tier.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-sky-600">{tier.pointsMultiplier}x</p>
              <p className="text-xs text-gray-600 mt-1">Points Multiplier</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {Math.round(currentPoints * tier.pointsMultiplier * 0.01)}
              </p>
              <p className="text-xs text-gray-600 mt-1">Dollar Value</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {Math.floor(currentPoints / 2500)}
              </p>
              <p className="text-xs text-gray-600 mt-1">Rewards Available</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'earn' && (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">How to Earn Points</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <Plane className="w-5 h-5 text-sky-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Flight Bookings</p>
                  <p className="text-sm text-gray-600">Earn {tier.pointsMultiplier}x points per $1</p>
                </div>
                <Badge variant="success">{tier.pointsMultiplier}x</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Hotel className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Hotel Bookings</p>
                  <p className="text-sm text-gray-600">Earn {tier.pointsMultiplier}x points per $1</p>
                </div>
                <Badge variant="success">{tier.pointsMultiplier}x</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Car className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Car Rentals</p>
                  <p className="text-sm text-gray-600">Earn {tier.pointsMultiplier}x points per $1</p>
                </div>
                <Badge variant="success">{tier.pointsMultiplier}x</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Ticket className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Tours & Activities</p>
                  <p className="text-sm text-gray-600">Earn {tier.pointsMultiplier}x points per $1</p>
                </div>
                <Badge variant="success">{tier.pointsMultiplier}x</Badge>
              </div>
            </div>
          </div>

          {/* Bonus Opportunities */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Bonus Opportunities
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm p-2 bg-green-50 rounded">
                <Gift className="w-4 h-4 text-green-600" />
                <span>Refer a friend: <strong>5,000 points</strong></span>
              </li>
              <li className="flex items-center gap-2 text-sm p-2 bg-green-50 rounded">
                <Gift className="w-4 h-4 text-green-600" />
                <span>Write a review: <strong>200 points</strong></span>
              </li>
              <li className="flex items-center gap-2 text-sm p-2 bg-green-50 rounded">
                <Gift className="w-4 h-4 text-green-600" />
                <span>Complete profile: <strong>500 points</strong></span>
              </li>
              <li className="flex items-center gap-2 text-sm p-2 bg-green-50 rounded">
                <Gift className="w-4 h-4 text-green-600" />
                <span>Birthday bonus: <strong>{userTier === 'bronze' ? '500' : userTier === 'silver' ? '1,000' : userTier === 'gold' ? '2,500' : '5,000'} points</strong></span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'redeem' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900">Available Rewards</h4>
            <Badge>{currentPoints.toLocaleString()} points available</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rewards.map((reward) => {
              const canAfford = currentPoints >= reward.points
              return (
                <div
                  key={reward.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    canAfford
                      ? 'border-green-200 bg-green-50 hover:border-green-300'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      canAfford ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {reward.icon}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{reward.name}</h5>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-sm font-semibold ${
                          canAfford ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {reward.points.toLocaleString()} points
                        </span>
                        <Button
                          size="sm"
                          disabled={!canAfford}
                          className={canAfford ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          Redeem
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Card>
  )
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default LoyaltyProgram
