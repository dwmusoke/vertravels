/**
 * Duffel API Integration for Flights
 * 
 * Duffel provides access to airline content through their New Distribution Capability (NDC) API
 * Docs: https://duffel.com/docs/
 */

interface DuffelConfig {
  apiKey: string
  environment: 'test' | 'live'
}

interface DuffelFlightSearch {
  origin: string
  destination: string
  departure_date: string
  return_date?: string
  adults: number
  children?: number
  infants?: number
  cabin_class?: 'economy' | 'premium_economy' | 'business' | 'first'
}

interface DuffelFlightOffer {
  id: string
  total_price: string
  base_currency: string
  slices: Array<{
    origin: string
    destination: string
    departure: string
    arrival: string
    duration: string
    segments: Array<{
      operating_airline: {
        name: string
        code: string
      }
      flight_number: string
      aircraft: {
        name: string
      }
      origin: {
        name: string
        city: string
        iata_code: string
      }
      destination: {
        name: string
        city: string
        iata_code: string
      }
      departure: string
      arrival: string
      duration: string
    }>
  }>
  passengers: Array<{
    type: 'adult' | 'child' | 'infant'
    cabin_class: string
  }>
}

export class DuffelAPI {
  private baseUrl: string
  private apiKey: string

  constructor(config: DuffelConfig) {
    this.baseUrl = config.environment === 'live' 
      ? 'https://api.duffel.com' 
      : 'https://test.api.duffel.com'
    this.apiKey = config.apiKey
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Duffel-Version': 'beta',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ errors: [{ message: 'Request failed' }] }))
      throw new Error(error.errors?.[0]?.message || 'Duffel API request failed')
    }

    const data = await response.json()
    return data.data
  }

  /**
   * Search for flight offers
   */
  async searchFlights(params: DuffelFlightSearch): Promise<DuffelFlightOffer[]> {
    // Create flight search
    const searchResult = await this.request<{ id: string }>('/air/flight_offers/searches', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          origin: params.origin,
          destination: params.destination,
          departure_date: params.departure_date,
          return_date: params.return_date,
          adults: params.adults,
          children: params.children,
          infants: params.infants,
          cabin_class: params.cabin_class || 'economy',
        },
      }),
      method: 'POST',
    })

    // Get the offers from the search
    const offers = await this.request<DuffelFlightOffer[]>(
      `/air/flight_offers/searches/${searchResult.id}/offers`
    )

    return offers
  }

  /**
   * Get a specific flight offer
   */
  async getOffer(offerId: string): Promise<DuffelFlightOffer> {
    return await this.request<DuffelFlightOffer>(`/air/flight_offers/${offerId}`)
  }

  /**
   * Create an order (booking)
   */
  async createOrder(params: {
    offer_id: string
    passengers: Array<{
      family_name: string
      given_name: string
      type: 'adult' | 'child' | 'infant'
      born_on?: string
      gender?: 'male' | 'female' | 'other'
      email?: string
      phone_number?: string
    }>
    payments?: Array<{
      type: 'balance' | 'card'
      card_vendor?: string
      card_number?: string
      expiry_year?: string
      expiry_month?: string
      cvc?: string
      currency?: string
      amount?: string
    }>
  }): Promise<{
    id: string
    status: string
    total_amount: string
    currency: string
    booking_reference: string
  }> {
    return await this.request('/air/orders', {
      method: 'POST',
      body: JSON.stringify({
        data: params,
      }),
    })
  }

  /**
   * Get an order by ID
   */
  async getOrder(orderId: string): Promise<{
    id: string
    status: string
    total_amount: string
    currency: string
    booking_reference: string
    slices: any[]
    passengers: any[]
  }> {
    return await this.request(`/air/orders/${orderId}`)
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<{
    id: string
    status: string
    refund_amount: string
    currency: string
  }> {
    return await this.request(`/air/orders/${orderId}/actions/cancel`, {
      method: 'POST',
    })
  }

  /**
   * Get airlines list
   */
  async getAirlines(): Promise<Array<{
    id: string
    name: string
    iata_code: string
  }>> {
    return await this.request('/air/airlines')
  }

  /**
   * Get airports by search term
   */
  async getAirports(searchTerm: string): Promise<Array<{
    id: string
    name: string
    iata_code: string
    city: string
    country: string
  }>> {
    return await this.request(`/air/locations?term=${encodeURIComponent(searchTerm)}`)
  }
}

// Export singleton instance creator
export function createDuffelAPI(config: DuffelConfig): DuffelAPI {
  return new DuffelAPI(config)
}
