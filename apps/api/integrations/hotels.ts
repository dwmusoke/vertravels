/**
 * Hotels API Integrations
 * Multiple providers: HotelsTON, Agoda, Hotelbeds, Ratehawk, Rezlive, Kiwi
 */

// ==================== HOTELSTON API ====================

interface HotelsTONConfig {
  apiKey: string
  apiSecret: string
  environment: 'test' | 'live'
}

interface HotelsTONSearch {
  checkin: string
  checkout: string
  adultCount: number
  childCount?: number
  childAges?: number[]
  hotelIds?: string[]
  cityCode?: string
  countryCode?: string
  latitude?: number
  longitude?: number
  radius?: number
  currency: string
  language: string
}

interface HotelsTONHotel {
  hotelId: string
  name: string
  starRating: number
  address: {
    street: string
    city: string
    country: string
    postalCode: string
  }
  location: {
    latitude: number
    longitude: number
  }
  description: string
  amenities: string[]
  images: string[]
  rooms: HotelsTONRoom[]
}

interface HotelsTONRoom {
  roomId: string
  name: string
  description: string
  maxOccupancy: number
  bedType: string
  amenities: string[]
  price: {
    total: number
    base: number
    taxes: number
    currency: string
  }
  cancellationPolicy: string
  paymentType: 'PAY_NOW' | 'PAY_AT_HOTEL'
}

export class HotelsTONAPI {
  private baseUrl: string
  private apiKey: string
  private apiSecret: string

  constructor(config: HotelsTONConfig) {
    this.baseUrl = config.environment === 'live'
      ? 'https://api.hotels-ton.com'
      : 'https://test-api.hotels-ton.com'
    this.apiKey = config.apiKey
    this.apiSecret = config.apiSecret
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const timestamp = Date.now()
    const signature = await this.generateSignature(timestamp)

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        'X-Timestamp': timestamp.toString(),
        'X-Signature': signature,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HotelsTON API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  }

  private async generateSignature(timestamp: number): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(`${timestamp}${this.apiSecret}`)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  async searchHotels(params: HotelsTONSearch): Promise<HotelsTONHotel[]> {
    return await this.request('/v2/hotels/search', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async getHotelDetails(hotelId: string): Promise<HotelsTONHotel> {
    return await this.request(`/v2/hotels/${hotelId}`)
  }

  async checkAvailability(params: {
    hotelId: string
    checkin: string
    checkout: string
    adultCount: number
    childCount?: number
  }): Promise<HotelsTONRoom[]> {
    return await this.request('/v2/availability/check', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async bookRoom(params: {
    roomId: string
    hotelId: string
    checkin: string
    checkout: string
    guests: {
      firstName: string
      lastName: string
      email: string
      phone: string
    }[]
    payment: {
      cardNumber: string
      expiryMonth: string
      expiryYear: string
      cvv: string
      cardholderName: string
    }
  }): Promise<{
    bookingId: string
    confirmationNumber: string
    status: string
    totalAmount: number
    currency: string
  }> {
    return await this.request('/v2/bookings/create', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async cancelBooking(bookingId: string): Promise<{
    status: string
    refundAmount: number
    currency: string
  }> {
    return await this.request(`/v2/bookings/${bookingId}/cancel`, {
      method: 'POST',
    })
  }
}

// ==================== AGODA API ====================

interface AgodaConfig {
  apiKey: string
  partnerId: string
  environment: 'test' | 'live'
}

interface AgodaSearch {
  checkIn: string
  checkOut: string
  rooms: number
  adults: number
  children: number[]
  cityId?: number
  hotelIds?: number[]
  latitude?: number
  longitude?: number
  radius: number
  currency: string
  languageCode: string
}

interface AgodaHotel {
  hotelId: number
  name: string
  starRating: number
  address: string
  city: string
  country: string
  latitude: number
  longitude: number
  description: string
  facilities: string[]
  images: string[]
  rooms: AgodaRoom[]
  reviewScore: number
  reviewCount: number
}

interface AgodaRoom {
  roomId: string
  name: string
  description: string
  maxOccupancy: number
  bedType: string
  roomSize: number
  price: {
    total: number
    base: number
    taxes: number
    fees: number
    currency: string
  }
  cancellation: {
    type: 'FREE_CANCELLATION' | 'NON_REFUNDABLE' | 'PARTIAL_REFUND'
    deadline?: string
  }
  mealPlan: string
}

export class AgodaAPI {
  private baseUrl: string
  private apiKey: string
  private partnerId: string

  constructor(config: AgodaConfig) {
    this.baseUrl = config.environment === 'live'
      ? 'https://api.agoda.com'
      : 'https://test-api.agoda.com'
    this.apiKey = config.apiKey
    this.partnerId = config.partnerId
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        'X-Partner-ID': this.partnerId,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Agoda API error: ${response.status}`)
    }

    const data = await response.json()
    return data.result
  }

  async searchHotels(params: AgodaSearch): Promise<AgodaHotel[]> {
    return await this.request('/hotels/v2/search', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async getHotelDetails(hotelId: number): Promise<AgodaHotel> {
    return await this.request(`/hotels/v2/details/${hotelId}`)
  }

  async getRoomAvailability(params: {
    hotelId: number
    checkIn: string
    checkOut: string
    rooms: number
    adults: number
    children: number[]
  }): Promise<AgodaRoom[]> {
    return await this.request('/rooms/v2/availability', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async createBooking(params: {
    roomId: string
    hotelId: number
    checkIn: string
    checkOut: string
    guests: {
      title: string
      firstName: string
      lastName: string
      email: string
      phone: string
    }[]
    specialRequests?: string
    payment: {
      type: 'CREDIT_CARD' | 'DEBIT_CARD'
      cardNumber: string
      expiryMonth: string
      expiryYear: string
      cvv: string
      cardholderName: string
    }
  }): Promise<{
    bookingId: string
    confirmationCode: string
    status: string
    totalAmount: number
    currency: string
  }> {
    return await this.request('/bookings/v2/create', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async getBookingDetails(bookingId: string): Promise<{
    bookingId: string
    confirmationCode: string
    status: string
    hotelName: string
    checkIn: string
    checkOut: string
    guests: any[]
    totalAmount: number
    currency: string
  }> {
    return await this.request(`/bookings/v2/details/${bookingId}`)
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<{
    status: string
    refundAmount: number
    currency: string
    cancellationFee: number
  }> {
    return await this.request(`/bookings/v2/cancel/${bookingId}`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }
}

// ==================== HOTELBEDS API ====================

interface HotelbedsConfig {
  apiKey: string
  secret: string
  environment: 'test' | 'live'
}

interface HotelbedsSearch {
  checkIn: string
  checkOut: string
  occupancy: Array<{
    adults: number
    children?: number[]
  }>
  hotels?: string[]
  categories?: string[]
  destinations?: string[]
  currency: string
}

interface HotelbedsHotel {
  code: string
  name: string
  category: string
  address: {
    street: string
    city: string
    country: string
  }
  location: {
    latitude: number
    longitude: number
  }
  description: string
  facilities: string[]
  images: string[]
  rates: HotelbedsRate[]
}

interface HotelbedsRate {
  rateKey: string
  roomCode: string
  roomName: string
  board: string
  price: {
    total: number
    base: number
    taxes: number
    currency: string
  }
  cancellationPolicy: {
    type: 'FREE' | 'NON_REFUNDABLE'
    deadline?: string
    penalty?: number
  }
  paymentType: 'AT_HOTEL' | 'NOW'
}

export class HotelbedsAPI {
  private baseUrl: string
  private apiKey: string
  private secret: string
  private token?: string
  private tokenExpiry?: number

  constructor(config: HotelbedsConfig) {
    this.baseUrl = config.environment === 'live'
      ? 'https://api.hotelbeds.com'
      : 'https://test-api.hotelbeds.com'
    this.apiKey = config.apiKey
    this.secret = config.secret
  }

  private async getToken(): Promise<string> {
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token
    }

    const response = await fetch(`${this.baseUrl}/hotel-api/v3/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': await this.generateSignature(),
      },
    })

    if (!response.ok) {
      throw new Error('Hotelbeds authentication failed')
    }

    const data = await response.json()
    this.token = data.token
    this.tokenExpiry = Date.now() + (data.expiry - 60) * 1000 // Refresh 1 minute before expiry
    return this.token
  }

  private async generateSignature(): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(`${this.apiKey}${this.secret}${Date.now()}`)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getToken()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': await this.generateSignature(),
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Hotelbeds API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  }

  async searchHotels(params: HotelbedsSearch): Promise<HotelbedsHotel[]> {
    const response = await this.request('/hotel-api/v3/hotels', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    return response.hotels || []
  }

  async createBooking(params: {
    rateKey: string
    holder: {
      name: string
      surname: string
      email: string
      phone: string
    }
    guests: {
      category: 'ADULT' | 'CHILD'
      age?: number
    }[]
    payment: {
      type: 'CREDIT_CARD'
      cardNumber: string
      expiryMonth: string
      expiryYear: string
      cvv: string
      cardholderName: string
    }
  }): Promise<{
    bookingReference: string
    status: string
    totalAmount: number
    currency: string
  }> {
    return await this.request('/booking-api/v3/bookings', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async getBookingDetails(bookingReference: string): Promise<{
    bookingReference: string
    status: string
    hotelName: string
    checkIn: string
    checkOut: string
    totalAmount: number
    currency: string
  }> {
    return await this.request(`/booking-api/v3/bookings/${bookingReference}`)
  }

  async cancelBooking(bookingReference: string): Promise<{
    status: string
    refundAmount: number
    currency: string
    cancellationFee: number
  }> {
    return await this.request(`/booking-api/v3/bookings/${bookingReference}/cancel`, {
      method: 'DELETE',
    })
  }
}

// Export factory functions
export function createHotelsTONAPI(config: HotelsTONConfig): HotelsTONAPI {
  return new HotelsTONAPI(config)
}

export function createAgodaAPI(config: AgodaConfig): AgodaAPI {
  return new AgodaAPI(config)
}

export function createHotelbedsAPI(config: HotelbedsConfig): HotelbedsAPI {
  return new HotelbedsAPI(config)
}
