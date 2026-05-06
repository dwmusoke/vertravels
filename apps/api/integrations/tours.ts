/**
 * Tours API Integrations
 * Providers: Viator, Tiqets
 */

// ==================== VIATOR API ====================

interface ViatorConfig {
  apiKey: string
  partnerId: string
  environment: 'test' | 'live'
}

interface ViatorSearch {
  destinationId?: string
  productIds?: string[]
  startDate: string
  endDate?: string
  paxQuantity: {
    adult: number
    child?: number
    infant?: number
  }
  currency: string
  language: string
}

interface ViatorProduct {
  productCode: string
  name: string
  description: string
  shortDescription: string
  duration: string
  durationType: 'HOURS' | 'DAYS'
  location: {
    name: string
    address: string
    city: string
    country: string
    latitude: number
    longitude: number
  }
  category: string
  subcategory: string
  images: string[]
  rating: number
  reviewCount: number
  priceFrom: {
    amount: number
    currency: string
  }
  availability: ViatorAvailability[]
  inclusions: string[]
  exclusions: string[]
  itinerary: ViatorItineraryItem[]
  cancellationPolicy: string
}

interface ViatorAvailability {
  date: string
  startTime: string
  endTime: string
  available: boolean
  price: {
    adult: number
    child: number
    infant: number
    currency: string
  }
}

interface ViatorItineraryItem {
  title: string
  description: string
  duration?: string
  location?: string
}

export class ViatorAPI {
  private baseUrl: string
  private apiKey: string
  private partnerId: string

  constructor(config: ViatorConfig) {
    this.baseUrl = config.environment === 'live'
      ? 'https://api.viator.com'
      : 'https://api.sandbox.viator.com'
    this.apiKey = config.apiKey
    this.partnerId = config.partnerId
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'viator-api-key': this.apiKey,
        'viator-partner-id': this.partnerId,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Viator API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  }

  /**
   * Search for tour products
   */
  async searchProducts(params: ViatorSearch): Promise<ViatorProduct[]> {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      paxQuantity_adult: params.paxQuantity.adult.toString(),
      currency: params.currency,
      language: params.language,
    })

    if (params.destinationId) {
      queryParams.append('destinationId', params.destinationId)
    }

    if (params.productIds?.length) {
      queryParams.append('productIds', params.productIds.join(','))
    }

    if (params.endDate) {
      queryParams.append('endDate', params.endDate)
    }

    if (params.paxQuantity.child) {
      queryParams.append('paxQuantity_child', params.paxQuantity.child.toString())
    }

    if (params.paxQuantity.infant) {
      queryParams.append('paxQuantity_infant', params.paxQuantity.infant.toString())
    }

    return await this.request(`/products/search?${queryParams.toString()}`)
  }

  /**
   * Get product details by code
   */
  async getProductDetails(productCode: string): Promise<ViatorProduct> {
    return await this.request(`/products/${productCode}`)
  }

  /**
   * Check availability for a product
   */
  async checkAvailability(params: {
    productCode: string
    date: string
    paxQuantity: {
      adult: number
      child?: number
      infant?: number
    }
  }): Promise<ViatorAvailability[]> {
    return await this.request(`/availability/${params.productCode}?date=${params.date}`)
  }

  /**
   * Create a booking
   */
  async createBooking(params: {
    productCode: string
    travelDate: string
    startTime: string
    paxQuantity: {
      adult: number
      child?: number
      infant?: number
    }
    leadTraveler: {
      firstName: string
      lastName: string
      email: string
      phone: {
        countryCode: string
        number: string
      }
    }
    travelers: Array<{
      firstName: string
      lastName: string
      age?: number
    }>
    payment: {
      cardNumber: string
      expiryMonth: string
      expiryYear: string
      cvv: string
      cardholderName: string
    }
    specialRequirements?: string
  }): Promise<{
    bookingReference: string
    confirmationNumber: string
    status: 'CONFIRMED' | 'PENDING' | 'FAILED'
    totalAmount: number
    currency: string
    voucherUrl: string
  }> {
    return await this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  /**
   * Get booking details
   */
  async getBookingDetails(bookingReference: string): Promise<{
    bookingReference: string
    confirmationNumber: string
    status: string
    productName: string
    travelDate: string
    travelers: any[]
    totalAmount: number
    currency: string
    voucherUrl: string
  }> {
    return await this.request(`/bookings/${bookingReference}`)
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingReference: string, reason?: string): Promise<{
    status: string
    refundAmount: number
    currency: string
    cancellationFee: number
    refundType: 'FULL' | 'PARTIAL' | 'NONE'
  }> {
    return await this.request(`/bookings/${bookingReference}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }

  /**
   * Get destinations
   */
  async getDestinations(searchTerm?: string): Promise<Array<{
    destinationId: string
    name: string
    type: 'CITY' | 'REGION' | 'COUNTRY'
    country: string
  }>> {
    const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''
    return await this.request(`/destinations${query}`)
  }

  /**
   * Get product categories
   */
  async getCategories(): Promise<Array<{
    categoryId: string
    name: string
    subcategories: Array<{
      subcategoryId: string
      name: string
    }>
  }>> {
    return await this.request('/categories')
  }
}

// ==================== TIQETS API ====================

interface TiqetsConfig {
  apiKey: string
  environment: 'test' | 'live'
}

interface TiqetsSearch {
  query?: string
  city?: string
  country?: string
  startDate?: string
  endDate?: string
  visitors: {
    adult: number
    child?: number
    baby?: number
  }
  currency: string
  language: string
}

interface TiqetsProduct {
  id: string
  name: string
  description: string
  shortDescription: string
  location: {
    name: string
    address: string
    city: string
    country: string
    latitude: number
    longitude: number
  }
  category: string
  images: string[]
  rating: number
  reviewCount: number
  priceFrom: {
    amount: number
    currency: string
  }
  duration: string
  validity: string
  availability: TiqetsAvailability[]
  highlights: string[]
  importantInfo: string[]
  cancellationPolicy: string
}

interface TiqetsAvailability {
  date: string
  timeSlots: Array<{
    startTime: string
    endTime: string
    available: boolean
    price: {
      adult: number
      child: number
      baby: number
      currency: string
    }
  }>
}

export class TiqetsAPI {
  private baseUrl: string
  private apiKey: string

  constructor(config: TiqetsConfig) {
    this.baseUrl = config.environment === 'live'
      ? 'https://api.tiqets.com'
      : 'https://api.sandbox.tiqets.com'
    this.apiKey = config.apiKey
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Tiqets API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data
  }

  /**
   * Search for attractions and tickets
   */
  async searchProducts(params: TiqetsSearch): Promise<TiqetsProduct[]> {
    const queryParams = new URLSearchParams({
      visitors_adult: params.visitors.adult.toString(),
      currency: params.currency,
      language: params.language,
    })

    if (params.query) {
      queryParams.append('query', params.query)
    }

    if (params.city) {
      queryParams.append('city', params.city)
    }

    if (params.country) {
      queryParams.append('country', params.country)
    }

    if (params.startDate) {
      queryParams.append('start_date', params.startDate)
    }

    if (params.endDate) {
      queryParams.append('end_date', params.endDate)
    }

    if (params.visitors.child) {
      queryParams.append('visitors_child', params.visitors.child.toString())
    }

    if (params.visitors.baby) {
      queryParams.append('visitors_baby', params.visitors.baby.toString())
    }

    return await this.request(`/v4/products?${queryParams.toString()}`)
  }

  /**
   * Get product details
   */
  async getProductDetails(productId: string): Promise<TiqetsProduct> {
    return await this.request(`/v4/products/${productId}`)
  }

  /**
   * Get available time slots
   */
  async getTimeSlots(params: {
    productId: string
    date: string
    visitors: {
      adult: number
      child?: number
      baby?: number
    }
  }): Promise<TiqetsAvailability> {
    const queryParams = new URLSearchParams({
      date: params.date,
      visitors_adult: params.visitors.adult.toString(),
    })

    if (params.visitors.child) {
      queryParams.append('visitors_child', params.visitors.child.toString())
    }

    if (params.visitors.baby) {
      queryParams.append('visitors_baby', params.visitors.baby.toString())
    }

    return await this.request(`/v4/products/${params.productId}/availability?${queryParams.toString()}`)
  }

  /**
   * Create an order
   */
  async createOrder(params: {
    productId: string
    date: string
    timeSlotId?: string
    visitors: {
      adult: number
      child?: number
      baby?: number
    }
    customer: {
      firstName: string
      lastName: string
      email: string
      phone?: string
      country: string
    }
    payment: {
      cardNumber: string
      expiryMonth: string
      expiryYear: string
      cvv: string
      cardholderName: string
    }
    specialRequirements?: string
  }): Promise<{
    orderId: string
    orderNumber: string
    status: 'CONFIRMED' | 'PENDING' | 'FAILED'
    totalAmount: number
    currency: string
    tickets: Array<{
      ticketId: string
      qrCode: string
      barcode: string
      validFrom: string
      validUntil: string
    }>
  }> {
    return await this.request('/v4/orders', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  /**
   * Get order details
   */
  async getOrderDetails(orderId: string): Promise<{
    orderId: string
    orderNumber: string
    status: string
    productName: string
    date: string
    visitors: any[]
    totalAmount: number
    currency: string
    tickets: any[]
  }> {
    return await this.request(`/v4/orders/${orderId}`)
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<{
    status: string
    refundAmount: number
    currency: string
    cancellationFee: number
    refundType: 'FULL' | 'PARTIAL' | 'NONE'
  }> {
    return await this.request(`/v4/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }

  /**
   * Get cities
   */
  async getCities(countryCode?: string): Promise<Array<{
    id: string
    name: string
    countryCode: string
    productCount: number
  }>> {
    const query = countryCode ? `?country=${countryCode}` : ''
    return await this.request(`/v4/cities${query}`)
  }

  /**
   * Get countries
   */
  async getCountries(): Promise<Array<{
    code: string
    name: string
    productCount: number
  }>> {
    return await this.request('/v4/countries')
  }
}

// Export factory functions
export function createViatorAPI(config: ViatorConfig): ViatorAPI {
  return new ViatorAPI(config)
}

export function createTiqetsAPI(config: TiqetsConfig): TiqetsAPI {
  return new TiqetsAPI(config)
}
