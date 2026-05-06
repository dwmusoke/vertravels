/**
 * Additional Hotels API Integrations
 * Providers: Ratehawk, Rezlive, Kiwi
 */

// ==================== RATEHAWK API ====================

interface RatehawkConfig {
  apiKey: string
  environment: 'test' | 'live'
}

interface RatehawkSearch {
  checkIn: string
  checkOut: string
  rooms: Array<{
    adults: number
    children: number[]
  }>
  hotelIds?: string[]
  cityIds?: string[]
  countryCodes?: string[]
  latitude?: number
  longitude?: number
  radius?: number
  currency: string
  language: string
}

interface RatehawkHotel {
  id: string
  name: string
  starRating: number
  address: {
    street: string
    city: string
    state: string
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
  rooms: RatehawkRoom[]
  policies: {
    checkInTime: string
    checkOutTime: string
    childrenPolicy: string
    petPolicy: string
  }
}

interface RatehawkRoom {
  id: string
  name: string
  description: string
  maxOccupancy: number
  bedConfiguration: string
  size: number
  amenities: string[]
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
    penalty?: number
  }
  mealPlan: string
  paymentType: 'PAY_NOW' | 'PAY_LATER'
}

export class RatehawkAPI {
  private baseUrl: string
  private apiKey: string

  constructor(config: RatehawkConfig) {
    this.baseUrl = config.environment === 'live'
      ? 'https://api.ratehawk.com'
      : 'https://sandbox-api.ratehawk.com'
    this.apiKey = config.apiKey
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `ApiKey ${this.apiKey}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Ratehawk API error: ${response.status}`)
    }

    const data = await response.json()
    return data.result
  }

  async searchHotels(params: RatehawkSearch): Promise<RatehawkHotel[]> {
    return await this.request('/v1.0/hotels/search', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async getHotelDetails(hotelId: string): Promise<RatehawkHotel> {
    return await this.request(`/v1.0/hotels/${hotelId}`)
  }

  async getRoomOffers(params: {
    hotelId: string
    checkIn: string
    checkOut: string
    rooms: Array<{
      adults: number
      children: number[]
    }>
    currency: string
  }): Promise<RatehawkRoom[]> {
    return await this.request('/v1.0/offers', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async createBooking(params: {
    offerId: string
    guests: {
      firstName: string
      lastName: string
      email: string
      phone: string
      nationality: string
    }[]
    payment: {
      type: 'CREDIT_CARD'
      cardNumber: string
      expiryMonth: string
      expiryYear: string
      cvv: string
      cardholderName: string
      billingAddress: {
        street: string
        city: string
        state: string
        country: string
        postalCode: string
      }
    }
    specialRequests?: string
  }): Promise<{
    bookingId: string
    voucherNumber: string
    status: string
    totalAmount: number
    currency: string
  }> {
    return await this.request('/v1.0/bookings', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async getBookingDetails(bookingId: string): Promise<{
    bookingId: string
    voucherNumber: string
    status: string
    hotelName: string
    checkIn: string
    checkOut: string
    guests: any[]
    totalAmount: number
    currency: string
  }> {
    return await this.request(`/v1.0/bookings/${bookingId}`)
  }

  async cancelBooking(bookingId: string): Promise<{
    status: string
    refundAmount: number
    currency: string
    cancellationFee: number
  }> {
    return await this.request(`/v1.0/bookings/${bookingId}/cancel`, {
      method: 'POST',
    })
  }

  async getCities(countryCode: string, searchQuery?: string): Promise<Array<{
    id: string
    name: string
    countryCode: string
    hotelCount: number
  }>> {
    const query = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''
    return await this.request(`/v1.0/cities/${countryCode}${query}`)
  }
}

// ==================== REZLIVE API ====================

interface RezliveConfig {
  apiKey: string
  username: string
  password: string
  environment: 'test' | 'live'
}

interface RezliveSearch {
  checkInDate: string
  checkOutDate: string
  adultCount: number
  childCount: number
  childAges?: number[]
  hotelCode?: string
  cityCode?: string
  countryCode?: string
  currencyCode: string
  languageCode: string
}

interface RezliveHotel {
  hotelCode: string
  hotelName: string
  starRating: number
  address: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  location: {
    latitude: number
    longitude: number
  }
  description: string
  facilities: string[]
  images: string[]
  rooms: RezliveRoom[]
}

interface RezliveRoom {
  roomTypeCode: string
  roomTypeName: string
  description: string
  maxOccupancy: number
  bedType: string
  ratePlanCode: string
  ratePlanName: string
  price: {
    total: number
    base: number
    taxes: number
    currency: string
  }
  cancellationPolicy: string
  mealPlan: string
  paymentMode: 'PREPAID' | 'WALKIN'
}

export class RezliveAPI {
  private baseUrl: string
  private apiKey: string
  private username: string
  private password: string
  private sessionId?: string

  constructor(config: RezliveConfig) {
    this.baseUrl = config.environment === 'live'
      ? 'https://api.rezlive.com'
      : 'https://testapi.rezlive.com'
    this.apiKey = config.apiKey
    this.username = config.username
    this.password = config.password
  }

  private async authenticate(): Promise<string> {
    if (this.sessionId) {
      return this.sessionId
    }

    const response = await fetch(`${this.baseUrl}/v2/Authentication`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ApiKey': this.apiKey,
      },
      body: JSON.stringify({
        Username: this.username,
        Password: this.password,
      }),
    })

    if (!response.ok) {
      throw new Error('Rezlive authentication failed')
    }

    const data = await response.json()
    this.sessionId = data.SessionId
    return this.sessionId
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const sessionId = await this.authenticate()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'ApiKey': this.apiKey,
        'SessionId': sessionId,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Rezlive API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  }

  async searchHotels(params: RezliveSearch): Promise<RezliveHotel[]> {
    const response = await this.request('/v2/HotelSearch', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    return response.Hotels || []
  }

  async getHotelDetails(hotelCode: string): Promise<RezliveHotel> {
    return await this.request(`/v2/HotelDetails/${hotelCode}`)
  }

  async checkAvailability(params: {
    hotelCode: string
    checkInDate: string
    checkOutDate: string
    adultCount: number
    childCount: number
    childAges?: number[]
  }): Promise<RezliveRoom[]> {
    const response = await this.request('/v2/CheckAvailability', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    return response.Rooms || []
  }

  async createBooking(params: {
    hotelCode: string
    roomTypeCode: string
    ratePlanCode: string
    checkInDate: string
    checkOutDate: string
    guests: {
      title: string
      firstName: string
      lastName: string
      email: string
      phone: string
    }[]
    payment: {
      cardType: string
      cardNumber: string
      expiryMonth: string
      expiryYear: string
      cvv: string
      cardholderName: string
    }
    specialRequests?: string
  }): Promise<{
    bookingId: string
    confirmationNumber: string
    status: string
    totalAmount: number
    currency: string
  }> {
    return await this.request('/v2/CreateBooking', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async getBookingDetails(bookingId: string): Promise<{
    bookingId: string
    confirmationNumber: string
    status: string
    hotelName: string
    checkInDate: string
    checkOutDate: string
    totalAmount: number
    currency: string
  }> {
    return await this.request(`/v2/GetBookingDetails/${bookingId}`)
  }

  async cancelBooking(bookingId: string, cancellationReason?: string): Promise<{
    status: string
    refundAmount: number
    currency: string
    cancellationFee: number
  }> {
    return await this.request('/v2/CancelBooking', {
      method: 'POST',
      body: JSON.stringify({
        BookingId: bookingId,
        Reason: cancellationReason,
      }),
    })
  }
}

// ==================== KIWI HOTELS API ====================

interface KiwiConfig {
  apiKey: string
  environment: 'test' | 'live'
}

interface KiwiHotelSearch {
  checkin: string
  checkout: string
  adults: number
  children?: number[]
  city_id?: string
  country_id?: string
  latitude?: number
  longitude?: number
  radius?: number
  currency: string
  language: string
}

interface KiwiHotel {
  id: string
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
  rooms: KiwiRoom[]
  reviewScore: number
  reviewCount: number
}

interface KiwiRoom {
  id: string
  name: string
  description: string
  maxOccupancy: number
  bedType: string
  price: {
    total: number
    base: number
    taxes: number
    currency: string
  }
  cancellation: {
    type: 'free' | 'non_refundable' | 'partial'
    deadline?: string
  }
  mealPlan: string
}

export class KiwiAPI {
  private baseUrl: string
  private apiKey: string

  constructor(config: KiwiConfig) {
    this.baseUrl = config.environment === 'live'
      ? 'https://api.kiwi.com'
      : 'https://test-api.kiwi.com'
    this.apiKey = config.apiKey
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'apikey': this.apiKey,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Kiwi API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  }

  async searchHotels(params: KiwiHotelSearch): Promise<KiwiHotel[]> {
    const queryParams = new URLSearchParams({
      checkin: params.checkin,
      checkout: params.checkout,
      adults: params.adults.toString(),
      currency: params.currency,
      language: params.language,
    })

    if (params.city_id) {
      queryParams.append('city_id', params.city_id)
    }

    if (params.country_id) {
      queryParams.append('country_id', params.country_id)
    }

    if (params.latitude && params.longitude) {
      queryParams.append('latitude', params.latitude.toString())
      queryParams.append('longitude', params.longitude.toString())
    }

    if (params.radius) {
      queryParams.append('radius', params.radius.toString())
    }

    if (params.children?.length) {
      params.children.forEach(age => {
        queryParams.append('children', age.toString())
      })
    }

    return await this.request(`/hotels/search?${queryParams.toString()}`)
  }

  async getHotelDetails(hotelId: string): Promise<KiwiHotel> {
    return await this.request(`/hotels/${hotelId}`)
  }

  async createBooking(params: {
    hotelId: string
    roomId: string
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
    confirmationCode: string
    status: string
    totalAmount: number
    currency: string
  }> {
    return await this.request('/hotels/book', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async getBookingDetails(bookingId: string): Promise<{
    bookingId: string
    confirmationCode: string
    status: string
    hotelName: string
    checkin: string
    checkout: string
    totalAmount: number
    currency: string
  }> {
    return await this.request(`/hotels/booking/${bookingId}`)
  }

  async cancelBooking(bookingId: string): Promise<{
    status: string
    refundAmount: number
    currency: string
    cancellationFee: number
  }> {
    return await this.request(`/hotels/booking/${bookingId}/cancel`, {
      method: 'POST',
    })
  }

  async getCities(searchQuery: string): Promise<Array<{
    id: string
    name: string
    country: string
    hotelCount: number
  }>> {
    return await this.request(`/cities?search=${encodeURIComponent(searchQuery)}`)
  }
}

// Export factory functions
export function createRatehawkAPI(config: RatehawkConfig): RatehawkAPI {
  return new RatehawkAPI(config)
}

export function createRezliveAPI(config: RezliveConfig): RezliveAPI {
  return new RezliveAPI(config)
}

export function createKiwiAPI(config: KiwiConfig): KiwiAPI {
  return new KiwiAPI(config)
}
