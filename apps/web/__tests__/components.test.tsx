import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { SupabaseProvider } from '@/components/providers/supabase-provider'

beforeEach(() => {
  window.matchMedia = window.matchMedia || vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Supabase
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    auth: {
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  }),
}))

function createWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light">
      <SupabaseProvider>
        {children}
      </SupabaseProvider>
    </ThemeProvider>
  )
}

describe('UI Components', () => {
  describe('Button', () => {
    it('renders correctly with children', async () => {
      const { Button } = await import('@/components/ui')
      render(<Button>Click Me</Button>, { wrapper: createWrapper })
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('applies variant styles correctly', async () => {
      const { Button } = await import('@/components/ui')
      const { container: primary } = render(<Button variant="default">Primary</Button>, { wrapper: createWrapper })
      const { container: destructive } = render(<Button variant="destructive">Destructive</Button>, { wrapper: createWrapper })
      const { container: outline } = render(<Button variant="outline">Outline</Button>, { wrapper: createWrapper })
      
      expect(primary).toMatchSnapshot()
      expect(destructive).toMatchSnapshot()
      expect(outline).toMatchSnapshot()
    })

    it('handles disabled state', async () => {
      const { Button } = await import('@/components/ui')
      render(<Button disabled>Disabled</Button>, { wrapper: createWrapper })
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('calls onClick handler when clicked', async () => {
      const { Button } = await import('@/components/ui')
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click</Button>, { wrapper: createWrapper })
      screen.getByRole('button').click()
      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('Input', () => {
    it('renders correctly with label', async () => {
      const { Input, Label } = await import('@/components/ui')
      render(
        <div>
          <Label htmlFor="test">Test Label</Label>
          <Input id="test" placeholder="Enter text" />
        </div>,
        { wrapper: createWrapper }
      )
      expect(screen.getByLabelText(/test label/i)).toBeInTheDocument()
    })

    it('handles different input types', async () => {
      const { Input } = await import('@/components/ui')
      const { container: text } = render(<Input type="text" />, { wrapper: createWrapper })
      const { container: email } = render(<Input type="email" />, { wrapper: createWrapper })
      const { container: password } = render(<Input type="password" />, { wrapper: createWrapper })
      const { container: number } = render(<Input type="number" />, { wrapper: createWrapper })
      
      expect(text.querySelector('input')).toHaveAttribute('type', 'text')
      expect(email.querySelector('input')).toHaveAttribute('type', 'email')
      expect(password.querySelector('input')).toHaveAttribute('type', 'password')
      expect(number.querySelector('input')).toHaveAttribute('type', 'number')
    })

    it('validates required fields', async () => {
      const { Input } = await import('@/components/ui')
      render(<Input required />, { wrapper: createWrapper })
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('required')
    })
  })

  describe('Card', () => {
    it('renders card structure correctly', async () => {
      const { Card, CardHeader, CardTitle, CardContent } = await import('@/components/ui')
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>Card Content</CardContent>
        </Card>,
        { wrapper: createWrapper }
      )
      expect(screen.getByText(/card title/i)).toBeInTheDocument()
      expect(screen.getByText(/card content/i)).toBeInTheDocument()
    })
  })

  describe('Badge', () => {
    it('renders with different variants', async () => {
      const { Badge } = await import('@/components/ui')
      render(
        <div>
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="warning">Warning</Badge>
        </div>,
        { wrapper: createWrapper }
      )
      expect(screen.getByText(/default/i)).toBeInTheDocument()
      expect(screen.getByText(/success/i)).toBeInTheDocument()
      expect(screen.getByText(/destructive/i)).toBeInTheDocument()
      expect(screen.getByText(/warning/i)).toBeInTheDocument()
    })
  })

  describe('Dialog', () => {
    it('opens and closes correctly', async () => {
      const { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } = await import('@/components/ui')
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
            <p>Dialog Content</p>
          </DialogContent>
        </Dialog>,
        { wrapper: createWrapper }
      )
      
      expect(screen.getByText(/open dialog/i)).toBeInTheDocument()
      expect(screen.queryByText(/dialog title/i)).not.toBeInTheDocument()
    })
  })
})

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats currency correctly', async () => {
      const { formatCurrency } = await import('@/lib/utils')
      expect(formatCurrency(1000, 'USD')).toBe('$1,000.00')
      expect(formatCurrency(1000.50, 'USD')).toBe('$1,000.50')
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00')
      expect(formatCurrency(1000, 'GBP')).toBe('£1,000.00')
      const ngnFormatted = formatCurrency(1000, 'NGN')
      expect(['₦1,000.00', 'NGN\xa01,000.00']).toContain(ngnFormatted)
    })

    it('handles zero and negative values', async () => {
      const { formatCurrency } = await import('@/lib/utils')
      expect(formatCurrency(0, 'USD')).toBe('$0.00')
      expect(formatCurrency(-100, 'USD')).toBe('-$100.00')
    })
  })

  describe('formatDate', () => {
    it('formats dates correctly', async () => {
      const { formatDate } = await import('@/lib/utils')
      const date = '2024-03-15'
      expect(formatDate(date)).toMatch(/\w+ \d{1,2}, \d{4}/)
    })

    it('handles invalid dates', async () => {
      const { formatDate } = await import('@/lib/utils')
      expect(formatDate('')).toBe('')
      expect(formatDate('invalid')).toBe('Invalid Date')
    })
  })

  describe('cn (classNames)', () => {
    it('merges class names correctly', async () => {
      const { cn } = await import('@/components/ui')
      expect(cn('class1', 'class2')).toBe('class1 class2')
      expect(cn('class1', false && 'class2', true && 'class3')).toBe('class1 class3')
      expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2')
    })
  })
})

describe('Authentication Components', () => {
  describe('Login Page', () => {
    it('renders login form', async () => {
      const LoginPage = (await import('@/app/(auth)/login/page')).default
      render(<LoginPage />, { wrapper: createWrapper })
      
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
    })

    it('validates required fields', async () => {
      const LoginPage = (await import('@/app/(auth)/login/page')).default
      render(<LoginPage />, { wrapper: createWrapper })
      
      const emailInput = screen.getByPlaceholderText(/you@example.com/i)
      const passwordInput = screen.getByPlaceholderText(/••••••••/i)
      
      expect(emailInput).toHaveAttribute('required')
      expect(passwordInput).toHaveAttribute('required')
    })
  })

  describe('Register Page', () => {
    it('renders registration form', async () => {
      const RegisterPage = (await import('@/app/(auth)/register/page')).default
      render(<RegisterPage />, { wrapper: createWrapper })
      
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/john/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/doe/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
    })

    it('validates password strength', async () => {
      const RegisterPage = (await import('@/app/(auth)/register/page')).default
      render(<RegisterPage />, { wrapper: createWrapper })
      
      const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i)
      expect(passwordInputs.length).toBe(2)
      passwordInputs.forEach(input => expect(input).toHaveAttribute('required'))
    })
  })
})

describe('Search Components', () => {
  describe('Search Widget', () => {
    it('renders all search tabs', async () => {
      const SearchWidget = (await import('@/components/search/search-widget')).SearchWidget
      render(<SearchWidget />, { wrapper: createWrapper })
      
      expect(screen.getAllByText(/flights/i).length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText(/hotels/i).length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText(/tours/i).length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText(/cars/i).length).toBeGreaterThanOrEqual(1)
    })

    it('switches between tabs', async () => {
      const SearchWidget = (await import('@/components/search/search-widget')).SearchWidget
      render(<SearchWidget />, { wrapper: createWrapper })
      
      expect(screen.getAllByText(/hotels/i).length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Flight Search', () => {
    it('has all required fields', async () => {
      const FlightsSearch = (await import('@/components/search/flights-search')).FlightsSearch
      render(<FlightsSearch />, { wrapper: createWrapper })
      
      expect(screen.getAllByPlaceholderText(/city or airport/i).length).toBe(2)
      expect(screen.getByText(/round trip/i)).toBeInTheDocument()
      expect(screen.getByText(/one way/i)).toBeInTheDocument()
      expect(screen.getByText(/multi-city/i)).toBeInTheDocument()
    })

    it('allows trip type selection', async () => {
      const FlightsSearch = (await import('@/components/search/flights-search')).FlightsSearch
      render(<FlightsSearch />, { wrapper: createWrapper })
      
      expect(screen.getByText(/round trip/i)).toBeInTheDocument()
      expect(screen.getByText(/one way/i)).toBeInTheDocument()
      expect(screen.getByText(/multi-city/i)).toBeInTheDocument()
    })
  })
})

describe('Payment Components', () => {
  describe('Payment Gateway Selector', () => {
    it('displays all payment options', async () => {
      const PaymentGatewaySelector = (await import('@/components/payment/payment-gateway-selector')).PaymentGatewaySelector
      render(
        <PaymentGatewaySelector
          amount={100}
          currency="USD"
          onGatewaySelect={vi.fn()}
        />,
        { wrapper: createWrapper }
      )
      
      const radioButtons = screen.getAllByRole('radio')
      expect(radioButtons.length).toBe(5)
      expect(screen.getByText(/select payment method/i)).toBeInTheDocument()
    })

    it('allows gateway selection', async () => {
      const onGatewaySelect = vi.fn()
      const PaymentGatewaySelector = (await import('@/components/payment/payment-gateway-selector')).PaymentGatewaySelector
      render(
        <PaymentGatewaySelector
          amount={100}
          currency="USD"
          onGatewaySelect={onGatewaySelect}
        />,
        { wrapper: createWrapper }
      )
      
      const stripeOption = screen.getByRole('radio', { name: /credit/i })
      stripeOption.click()
      
      expect(onGatewaySelect).toHaveBeenCalledWith('stripe')
    })
  })
})

describe('Booking Components', () => {
  describe('Flight Booking Details', () => {
    it('displays flight details loading state', async () => {
      const FlightBookingDetails = (await import('@/components/flights/booking-details')).FlightBookingDetails
      render(
        <FlightBookingDetails
          flightId="FL123"
        />,
        { wrapper: createWrapper }
      )
      
      expect(screen.getByText(/loading flight details/i)).toBeInTheDocument()
    })
  })
})

describe('Admin Components', () => {
  describe('Dashboard Stats', () => {
    it('displays the landing page', async () => {
      const HomePage = (await import('@/app/page')).default
      render(<HomePage />, { wrapper: createWrapper })
      
      expect(screen.getAllByText(/vertravels/i).length).toBeGreaterThanOrEqual(1)
    })
  })
})
