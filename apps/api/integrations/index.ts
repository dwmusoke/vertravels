/**
 * Third-Party Integration Provider Layer
 * Unified interface for all travel content providers
 */

import { createDuffelAPI, DuffelAPI } from './duffel'
import { createHotelsTONAPI, createAgodaAPI, createHotelbedsAPI, HotelsTONAPI, AgodaAPI, HotelbedsAPI } from './hotels'
import { createRatehawkAPI, createRezliveAPI, createKiwiAPI, RatehawkAPI, RezliveAPI, KiwiAPI } from './hotels-extended'
import { createViatorAPI, createTiqetsAPI, ViatorAPI, TiqetsAPI } from './tours'

// ==================== CONFIGURATION ====================

export interface IntegrationConfig {
  // Flights
  duffel?: {
    enabled: boolean
    apiKey: string
    environment: 'test' | 'live'
    priority: number
  }

  // Hotels
  hotelston?: {
    enabled: boolean
    apiKey: string
    apiSecret: string
    environment: 'test' | 'live'
    priority: number
  }
  agoda?: {
    enabled: boolean
    apiKey: string
    partnerId: string
    environment: 'test' | 'live'
    priority: number
  }
  hotelbeds?: {
    enabled: boolean
    apiKey: string
    secret: string
    environment: 'test' | 'live'
    priority: number
  }
  ratehawk?: {
    enabled: boolean
    apiKey: string
    environment: 'test' | 'live'
    priority: number
  }
  rezlive?: {
    enabled: boolean
    apiKey: string
    username: string
    password: string
    environment: 'test' | 'live'
    priority: number
  }
  kiwi?: {
    enabled: boolean
    apiKey: string
    environment: 'test' | 'live'
    priority: number
  }

  // Tours
  viator?: {
    enabled: boolean
    apiKey: string
    partnerId: string
    environment: 'test' | 'live'
    priority: number
  }
  tiqets?: {
    enabled: boolean
    apiKey: string
    environment: 'test' | 'live'
    priority: number
  }
}

// ==================== FLIGHTS INTEGRATION ====================

export class FlightsIntegration {
  private providers: Map<string, DuffelAPI>

  constructor(config: IntegrationConfig) {
    this.providers = new Map()

    if (config.duffel?.enabled) {
      this.providers.set('duffel', createDuffelAPI(config.duffel))
    }
  }

  /**
   * Search flights across all enabled providers
   * Returns results sorted by provider priority
   */
  async searchFlights(params: {
    origin: string
    destination: string
    departureDate: string
    returnDate?: string
    adults: number
    children?: number
    infants?: number
    cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first'
  }): Promise<Array<{
    provider: string
    offers: any[]
  }>> {
    const results = []

    for (const [providerName, provider] of this.providers.entries()) {
      try {
        const offers = await provider.searchFlights({
          origin: params.origin,
          destination: params.destination,
          departure_date: params.departureDate,
          return_date: params.returnDate,
          adults: params.adults,
          children: params.children,
          infants: params.infants,
          cabin_class: params.cabinClass,
        })

        results.push({
          provider: providerName,
          offers: offers.map(offer => ({
            ...offer,
            provider: providerName,
          })),
        })
      } catch (error) {
        console.error(`Error searching ${providerName}:`, error)
      }
    }

    // Sort by provider priority (configured in IntegrationConfig)
    return results
  }

  /**
   * Get airports from all providers
   */
  async searchAirports(query: string): Promise<Array<{
    provider: string
    id: string
    name: string
    iataCode: string
    city: string
    country: string
  }>> {
    const results = []

    for (const [providerName, provider] of this.providers.entries()) {
      try {
        const airports = await provider.getAirports(query)
        results.push({
          provider: providerName,
          airports: airports.map(airport => ({
            ...airport,
            provider: providerName,
          })),
        })
      } catch (error) {
        console.error(`Error fetching airports from ${providerName}:`, error)
      }
    }

    return results
  }

  /**
   * Create booking with specified provider
   */
  async createBooking(provider: string, params: any): Promise<any> {
    const providerApi = this.providers.get(provider)
    if (!providerApi) {
      throw new Error(`Provider ${provider} not available`)
    }

    return await providerApi.createOrder(params)
  }
}

// ==================== HOTELS INTEGRATION ====================

export class HotelsIntegration {
  private providers: Map<string, HotelsTONAPI | AgodaAPI | HotelbedsAPI | RatehawkAPI | RezliveAPI | KiwiAPI>
  private priorities: Map<string, number>

  constructor(config: IntegrationConfig) {
    this.providers = new Map()
    this.priorities = new Map()

    if (config.hotelston?.enabled) {
      this.providers.set('hotelston', createHotelsTONAPI(config.hotelston))
      this.priorities.set('hotelston', config.hotelston.priority || 1)
    }

    if (config.agoda?.enabled) {
      this.providers.set('agoda', createAgodaAPI(config.agoda))
      this.priorities.set('agoda', config.agoda.priority || 2)
    }

    if (config.hotelbeds?.enabled) {
      this.providers.set('hotelbeds', createHotelbedsAPI(config.hotelbeds))
      this.priorities.set('hotelbeds', config.hotelbeds.priority || 3)
    }

    if (config.ratehawk?.enabled) {
      this.providers.set('ratehawk', createRatehawkAPI(config.ratehawk))
      this.priorities.set('ratehawk', config.ratehawk.priority || 4)
    }

    if (config.rezlive?.enabled) {
      this.providers.set('rezlive', createRezliveAPI(config.rezlive))
      this.priorities.set('rezlive', config.rezlive.priority || 5)
    }

    if (config.kiwi?.enabled) {
      this.providers.set('kiwi', createKiwiAPI(config.kiwi))
      this.priorities.set('kiwi', config.kiwi.priority || 6)
    }
  }

  /**
   * Search hotels across all enabled providers
   * Merges and deduplicates results
   */
  async searchHotels(params: {
    checkIn: string
    checkOut: string
    adults: number
    children?: number[]
    cityId?: string
    latitude?: number
    longitude?: number
    radius?: number
  }): Promise<Array<{
    provider: string
    hotels: any[]
  }>> {
    const results = []

    // Sort providers by priority
    const sortedProviders = Array.from(this.providers.entries()).sort(
      (a, b) => (this.priorities.get(a[0]) || 999) - (this.priorities.get(b[0]) || 999)
    )

    for (const [providerName, provider] of sortedProviders) {
      try {
        let hotels: any[] = []

        if (providerName === 'hotelston') {
          hotels = await (provider as HotelsTONAPI).searchHotels({
            checkin: params.checkIn,
            checkout: params.checkOut,
            adultCount: params.adults,
            childCount: params.children?.length || 0,
            childAges: params.children,
            currency: 'USD',
            language: 'en',
          })
        } else if (providerName === 'agoda') {
          hotels = await (provider as AgodaAPI).searchHotels({
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            rooms: 1,
            adults: params.adults,
            children: params.children?.length || 0,
            radius: params.radius || 50,
            currency: 'USD',
            languageCode: 'en',
          })
        } else if (providerName === 'hotelbeds') {
          hotels = await (provider as HotelbedsAPI).searchHotels({
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            occupancy: [{ adults: params.adults, children: params.children?.length || 0 }],
            currency: 'USD',
          })
        } else if (providerName === 'ratehawk') {
          hotels = await (provider as RatehawkAPI).searchHotels({
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            rooms: [{ adults: params.adults, children: params.children?.length || 0 }],
            currency: 'USD',
            language: 'en',
          })
        } else if (providerName === 'rezlive') {
          hotels = await (provider as RezliveAPI).searchHotels({
            checkInDate: params.checkIn,
            checkOutDate: params.checkOut,
            adultCount: params.adults,
            childCount: params.children?.length || 0,
            childAges: params.children,
            currencyCode: 'USD',
            languageCode: 'en',
          })
        } else if (providerName === 'kiwi') {
          hotels = await (provider as KiwiAPI).searchHotels({
            checkin: params.checkIn,
            checkout: params.checkOut,
            adults: params.adults,
            children: params.children,
            radius: params.radius,
            currency: 'USD',
            language: 'en',
          })
        }

        results.push({
          provider: providerName,
          hotels: hotels.map(hotel => ({
            ...hotel,
            provider: providerName,
          })),
        })
      } catch (error) {
        console.error(`Error searching ${providerName}:`, error)
      }
    }

    return results
  }

  /**
   * Create booking with specified provider
   */
  async createBooking(provider: string, params: any): Promise<any> {
    const providerApi = this.providers.get(provider)
    if (!providerApi) {
      throw new Error(`Provider ${provider} not available`)
    }

    // Provider-specific booking creation
    if (provider === 'hotelston') {
      return await (providerApi as HotelsTONAPI).bookRoom(params)
    } else if (provider === 'agoda') {
      return await (providerApi as AgodaAPI).createBooking(params)
    } else if (provider === 'hotelbeds') {
      return await (providerApi as HotelbedsAPI).createBooking(params)
    } else if (provider === 'ratehawk') {
      return await (providerApi as RatehawkAPI).createBooking(params)
    } else if (provider === 'rezlive') {
      return await (providerApi as RezliveAPI).createBooking(params)
    } else if (provider === 'kiwi') {
      return await (providerApi as KiwiAPI).createBooking(params)
    }

    throw new Error(`Booking not supported for provider ${provider}`)
  }
}

// ==================== TOURS INTEGRATION ====================

export class ToursIntegration {
  private providers: Map<string, ViatorAPI | TiqetsAPI>
  private priorities: Map<string, number>

  constructor(config: IntegrationConfig) {
    this.providers = new Map()
    this.priorities = new Map()

    if (config.viator?.enabled) {
      this.providers.set('viator', createViatorAPI(config.viator))
      this.priorities.set('viator', config.viator.priority || 1)
    }

    if (config.tiqets?.enabled) {
      this.providers.set('tiqets', createTiqetsAPI(config.tiqets))
      this.priorities.set('tiqets', config.tiqets.priority || 2)
    }
  }

  /**
   * Search tours across all enabled providers
   */
  async searchTours(params: {
    destinationId?: string
    query?: string
    startDate: string
    endDate?: string
    adults: number
    children?: number
    infants?: number
  }): Promise<Array<{
    provider: string
    products: any[]
  }>> {
    const results = []

    const sortedProviders = Array.from(this.providers.entries()).sort(
      (a, b) => (this.priorities.get(a[0]) || 999) - (this.priorities.get(b[0]) || 999)
    )

    for (const [providerName, provider] of sortedProviders) {
      try {
        let products: any[] = []

        if (providerName === 'viator') {
          products = await (provider as ViatorAPI).searchProducts({
            destinationId: params.destinationId,
            startDate: params.startDate,
            endDate: params.endDate,
            paxQuantity: {
              adult: params.adults,
              child: params.children,
              infant: params.infants,
            },
            currency: 'USD',
            language: 'en',
          })
        } else if (providerName === 'tiqets') {
          products = await (provider as TiqetsAPI).searchProducts({
            query: params.query,
            startDate: params.startDate,
            endDate: params.endDate,
            visitors: {
              adult: params.adults,
              child: params.children,
            },
            currency: 'USD',
            language: 'en',
          })
        }

        results.push({
          provider: providerName,
          products: products.map(product => ({
            ...product,
            provider: providerName,
          })),
        })
      } catch (error) {
        console.error(`Error searching ${providerName}:`, error)
      }
    }

    return results
  }

  /**
   * Create booking with specified provider
   */
  async createBooking(provider: string, params: any): Promise<any> {
    const providerApi = this.providers.get(provider)
    if (!providerApi) {
      throw new Error(`Provider ${provider} not available`)
    }

    if (provider === 'viator') {
      return await (providerApi as ViatorAPI).createBooking(params)
    } else if (provider === 'tiqets') {
      return await (providerApi as TiqetsAPI).createOrder(params)
    }

    throw new Error(`Booking not supported for provider ${provider}`)
  }
}

// ==================== MAIN INTEGRATION MANAGER ====================

export class IntegrationManager {
  public flights: FlightsIntegration
  public hotels: HotelsIntegration
  public tours: ToursIntegration

  constructor(config: IntegrationConfig) {
    this.flights = new FlightsIntegration(config)
    this.hotels = new HotelsIntegration(config)
    this.tours = new ToursIntegration(config)
  }
}

// Factory function
export function createIntegrationManager(config: IntegrationConfig): IntegrationManager {
  return new IntegrationManager(config)
}
