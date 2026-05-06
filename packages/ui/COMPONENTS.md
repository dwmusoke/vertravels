# 🎨 VerTravels UI Component Library

**Status:** ✅ Complete (25+ Components)  
**Stack:** React + TypeScript + Radix UI + Tailwind CSS  
**Accessibility:** WCAG 2.1 AA Compliant

---

## 📦 Installation

The UI library is located in `packages/ui` and is automatically available in both `apps/web` and `apps/admin` through the monorepo workspace.

```bash
# Install dependencies
pnpm install
```

---

## 🎯 Available Components

### **Form Components (10)**

| Component | Description | Props | Example |
|-----------|-------------|-------|---------|
| **Button** | Multi-variant button with loading state | `variant`, `size`, `loading`, `asChild` | [See below](#button) |
| **Input** | Text input with label, error, icon support | `label`, `error`, `icon`, `rightElement` | [See below](#input) |
| **Textarea** | Multi-line text input | `label`, `error`, `rows` | [See below](#textarea) |
| **Select** | Dropdown select with Radix UI | `label`, `error`, `options`, `placeholder` | [See below](#select) |
| **Checkbox** | Accessible checkbox | `label`, `checked`, `onCheckedChange` | [See below](#checkbox) |
| **Switch** | Toggle switch | `label`, `checked`, `onCheckedChange`, `description` | [See below](#switch) |
| **RadioGroup** | Radio button group | `value`, `onValueChange`, `options` | - |
| **Label** | Form label | Standard label props | - |
| **DatePicker** | Date picker with calendar | `date`, `onSelect`, `minDate`, `maxDate` | [See below](#datepicker) |
| **Calendar** | Standalone calendar | DayPicker props | - |

### **Layout Components (5)**

| Component | Description | Props |
|-----------|-------------|-------|
| **Card** | Content card with header, footer | `className`, `children` |
| **Tabs** | Tabbed interface | `defaultValue`, `value`, `tabs` |
| **Separator** | Visual divider | `orientation` |
| **ScrollArea** | Custom scrollable area | `type`, `orientation` |
| **Popover** | Popover content container | `align`, `sideOffset` |

### **Display Components (6)**

| Component | Description | Variants |
|-----------|-------------|----------|
| **Badge** | Status/tag badge | `default`, `secondary`, `destructive`, `success`, `warning`, `info`, `flights`, `hotels`, `tours`, `cars`, `visa` |
| **Avatar** | User avatar with fallback | `size` (sm, md, lg, xl), `src`, `fallback` |
| **Skeleton** | Loading skeleton | Standard div props |
| **Table** | Data table | Standard table props |
| **Progress** | Progress bar | `value`, `max` |
| **Accordion** | Collapsible content | Standard accordion props |

### **Navigation Components (3)**

| Component | Description | Props |
|-----------|-------------|-------|
| **DropdownMenu** | Context menu | `trigger`, `items`, `align`, `sideOffset` |
| **Pagination** | Pagination controls | `currentPage`, `totalPages`, `onPageChange` |
| **Command** | Command palette (cmdk) | Standard cmdk props |

### **Feedback Components (4)**

| Component | Description | Variants |
|-----------|-------------|----------|
| **Dialog** | Modal dialog | `open`, `onOpenChange`, `title`, `description`, `trigger`, `footer` |
| **Toast** | Notification toast | `variant` (default, destructive, success, warning, info) |
| **Alert** | Alert message | `variant` (default, destructive, success, warning, info) |
| **Tooltip** | Tooltip on hover | `content`, `side`, `delayDuration` |

---

## 📖 Usage Examples

### **Button**

```tsx
import { Button } from '@vertravels/ui';

// Default button
<Button>Click me</Button>

// With variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
<Button size="icon"><SearchIcon /></Button>

// Loading state
<Button loading>Loading...</Button>

// As child (renders as anchor)
<Button asChild>
  <a href="/link">Link</a>
</Button>
```

### **Input**

```tsx
import { Input } from '@vertravels/ui';
import { Search } from 'lucide-react';

// Basic input
<Input placeholder="Enter text" />

// With label
<Input label="Email" type="email" placeholder="you@example.com" />

// With error
<Input label="Username" error="Username is required" />

// With icon
<Input 
  icon={<Search className="h-4 w-4" />} 
  placeholder="Search..." 
/>

// With right element
<Input 
  placeholder="Enter code"
  rightElement={<Button size="sm">Send</Button>}
/>
```

### **Select**

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@vertravels/ui';

<Select value={currency} onValueChange={setCurrency}>
  <SelectTrigger>
    <SelectValue placeholder="Select currency" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="usd">USD</SelectItem>
    <SelectItem value="eur">EUR</SelectItem>
    <SelectItem value="gbp">GBP</SelectItem>
  </SelectContent>
</Select>
```

### **DatePicker**

```tsx
import { DatePicker } from '@vertravels/ui';

<DatePicker
  label="Check-in Date"
  date={checkInDate}
  onSelect={setCheckInDate}
  minDate={new Date()}
  error={errors.checkInDate}
/>
```

### **Dialog**

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@vertravels/ui';
import { Button } from '@vertravels/ui';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <div>Dialog content here...</div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### **Card**

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@vertravels/ui';
import { Button } from '@vertravels/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### **Badge**

```tsx
import { Badge } from '@vertravels/ui';

// Standard variants
<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Error</Badge>

// Module-specific badges
<Badge variant="flights">Flight</Badge>
<Badge variant="hotels">Hotel</Badge>
<Badge variant="tours">Tour</Badge>
<Badge variant="cars">Car</Badge>
<Badge variant="visa">Visa</Badge>
```

### **Table**

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@vertravels/ui';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell><Badge variant="success">Active</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### **Toast**

```tsx
import { Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription, ToastAction } from '@vertravels/ui';
import { useToast } from '@/hooks/use-toast';

// In your component
const { toast } = useToast();

toast({
  title: "Booking Confirmed!",
  description: "Your booking has been confirmed successfully.",
  variant: "success",
  action: <ToastAction altText="View">View</ToastAction>,
});

// In your root layout
<ToastProvider>
  {/* your app */}
  <ToastViewport />
</ToastProvider>
```

### **Alert**

```tsx
import { Alert, AlertTitle, AlertDescription } from '@vertravels/ui';
import { CheckCircle, AlertCircle } from 'lucide-react';

<Alert variant="success">
  <CheckCircle className="h-4 w-4" />
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your operation was completed successfully.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Something went wrong. Please try again.
  </AlertDescription>
</Alert>
```

### **Tabs**

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@vertravels/ui';

<Tabs defaultValue="flights">
  <TabsList>
    <TabsTrigger value="flights">Flights</TabsTrigger>
    <TabsTrigger value="hotels">Hotels</TabsTrigger>
    <TabsTrigger value="cars">Cars</TabsTrigger>
  </TabsList>
  <TabsContent value="flights">
    <FlightsSearch />
  </TabsContent>
  <TabsContent value="hotels">
    <HotelsSearch />
  </TabsContent>
  <TabsContent value="cars">
    <CarsSearch />
  </TabsContent>
</Tabs>
```

### **Avatar**

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@vertravels/ui';

// With image
<Avatar src="/user.jpg" alt="John Doe" size="lg" />

// With fallback (shows initials)
<Avatar fallback="John Doe" size="md" />

// Sizes: sm, md, lg, xl
```

---

## 🎨 Design Tokens

### **Colors**

```ts
// Primary (VerTravels Blue)
primary-50 to primary-900: #eff6ff to #0c4a6e

// Secondary (Ocean Teal)
secondary-500 to secondary-700: #14B8A6 to #0f766e

// Accent (Sunset Orange)
accent-500 to accent-700: #F97316 to #c2410c

// Module Colors
flights: #3B82F6 (Blue)
hotels: #10B981 (Emerald)
tours: #F59E0B (Amber)
cars: #8B5CF6 (Violet)
visa: #EC4899 (Pink)
blogs: #06B6D4 (Cyan)
```

### **Typography**

```ts
// Fonts
heading: 'Plus Jakarta Sans'
body: 'Inter'

// Sizes
xs: 0.75rem (12px)
sm: 0.875rem (14px)
base: 1rem (16px)
lg: 1.125rem (18px)
xl: 1.25rem (20px)
2xl: 1.5rem (24px)
3xl: 1.875rem (30px)
4xl: 2.25rem (36px)
5xl: 3rem (48px)
```

### **Spacing**

Based on Tailwind's default spacing scale (4px grid):
- 1 = 4px
- 2 = 8px
- 3 = 12px
- 4 = 16px
- 6 = 24px
- 8 = 32px
- 10 = 40px
- 12 = 48px

---

## 🔧 Utilities

### **cn()** - Class Name Merger

```ts
import { cn } from '@vertravels/ui';

<div className={cn('base-class', condition && 'conditional-class', className)} />
```

### **formatCurrency()**

```ts
import { formatCurrency } from '@vertravels/ui';

formatCurrency(1234.56, 'USD', 'en-US'); // $1,234.56
formatCurrency(1234.56, 'EUR', 'de-DE'); // 1.234,56 €
```

### **formatDate()**

```ts
import { formatDate } from '@vertravels/ui';

formatDate(new Date(), 'en-US'); // January 15, 2024
formatDate(new Date(), 'ar-SA'); // ١٥ يناير، ٢٠٢٤
```

### **formatRelativeTime()**

```ts
import { formatRelativeTime } from '@vertravels/ui';

formatRelativeTime(new Date(Date.now() - 3600000)); // 1 hour ago
formatRelativeTime(new Date(Date.now() - 86400000)); // 1 day ago
```

### **truncate()**

```ts
import { truncate } from '@vertravels/ui';

truncate('Long text here...', 20); // Long text here...
```

### **getInitials()**

```ts
import { getInitials } from '@vertravels/ui';

getInitials('John Doe'); // JD
getInitials('Mary Jane Watson'); // MW
```

---

## ♿ Accessibility

All components follow WCAG 2.1 AA guidelines:

- ✅ Keyboard navigation support
- ✅ ARIA labels and roles
- ✅ Focus management
- ✅ Screen reader compatible
- ✅ Color contrast compliance
- ✅ Reduced motion support

---

## 📱 Responsive Design

All components are mobile-first and responsive:

```tsx
// Example: Responsive grid with cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <Card key={item.id}>{item.name}</Card>
  ))}
</div>
```

---

## 🎯 Best Practices

1. **Always use the `cn()` utility** for merging classes
2. **Use semantic variants** (destructive for delete, success for confirm)
3. **Provide labels** for form inputs for accessibility
4. **Use loading states** for async actions
5. **Show error messages** clearly with the `error` prop
6. **Use appropriate sizes** (sm for compact, lg for hero sections)
7. **Test with keyboard** navigation
8. **Consider dark mode** in your designs

---

## 🔄 Adding New Components

To add a new component:

1. Create folder in `packages/ui/components/ComponentName`
2. Create `index.tsx` with component
3. Export from `packages/ui/components/index.ts`
4. Document in this file
5. Test in both web and admin apps

---

## 📊 Component Status

| Component | Status | Tests | Docs |
|-----------|--------|-------|------|
| Button | ✅ Complete | ✅ | ✅ |
| Input | ✅ Complete | ✅ | ✅ |
| Select | ✅ Complete | ✅ | ✅ |
| Dialog | ✅ Complete | ✅ | ✅ |
| Card | ✅ Complete | ✅ | ✅ |
| Table | ✅ Complete | ✅ | ✅ |
| Badge | ✅ Complete | ✅ | ✅ |
| Avatar | ✅ Complete | ✅ | ✅ |
| DatePicker | ✅ Complete | ✅ | ✅ |
| Toast | ✅ Complete | ✅ | ✅ |
| Alert | ✅ Complete | ✅ | ✅ |
| Tabs | ✅ Complete | ✅ | ✅ |
| Switch | ✅ Complete | ✅ | ✅ |
| Checkbox | ✅ Complete | ✅ | ✅ |
| DropdownMenu | ✅ Complete | ✅ | ✅ |
| Textarea | ✅ Complete | ✅ | ✅ |
| Label | ✅ Complete | ✅ | ✅ |
| Skeleton | ✅ Complete | ✅ | ✅ |
| Calendar | ✅ Complete | ✅ | ✅ |
| Popover | ✅ Complete | ✅ | ✅ |
| **Total** | **20/20** | **✅** | **✅** |

---

## 🎉 Summary

**25+ Components** | **100% TypeScript** | **Fully Accessible** | **Dark Mode Ready**

The VerTravels UI component library provides a complete set of accessible, reusable components for building modern travel booking interfaces.

---

*Built with Radix UI primitives and Tailwind CSS*
