/**
 * Main Navigation Header
 * Professional, modern header with mega menu, search, and user actions
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@vertravels/ui'
import { Button } from '@vertravels/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@vertravels/ui'
import { Badge } from '@vertravels/ui'
import {
  Plane,
  Hotel,
  MapPin,
  Car,
  FileText,
  Search,
  Menu,
  X,
  User,
  Globe,
  Moon,
  Sun,
  Bell,
  Heart,
  ShoppingCart,
  ChevronDown,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react'

const moduleLinks = [
  { name: 'Flights', href: '/flights', icon: Plane, color: 'text-sky-600', bgColor: 'bg-sky-50' },
  { name: 'Hotels', href: '/hotels', icon: Hotel, color: 'text-green-600', bgColor: 'bg-green-50' },
  { name: 'Tours', href: '/tours', icon: MapPin, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { name: 'Cars', href: '/cars', icon: Car, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { name: 'Visa', href: '/visa', icon: FileText, color: 'text-pink-600', bgColor: 'bg-pink-50' }
]

const quickLinks = [
  { name: 'My Bookings', href: '/account/bookings', icon: ShoppingCart },
  { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
  { name: 'Account', href: '/account/dashboard', icon: User },
  { name: 'Support', href: '/support', icon: MessageCircle }
]

export function MainHeader() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Bar - Contact Info */}
      <div className="bg-gray-900 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-sky-400 transition-colors">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </a>
            <a href="mailto:support@vertravels.com" className="flex items-center gap-2 hover:text-sky-400 transition-colors">
              <Mail className="w-4 h-4" />
              <span>support@vertravels.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/support" className="hover:text-sky-400 transition-colors">Support</Link>
            <Link href="/about" className="hover:text-sky-400 transition-colors">About Us</Link>
            <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
              <Globe className="w-4 h-4" />
              <span>EN</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
        )}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
                  VerTravels
                </span>
                <p className="text-xs text-gray-500 -mt-1">Your Journey, Our Priority</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {moduleLinks.map((module) => (
                <div
                  key={module.name}
                  className="relative group"
                  onMouseEnter={() => setActiveModule(module.name)}
                  onMouseLeave={() => setActiveModule(null)}
                >
                  <Link
                    href={module.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                      pathname.startsWith(module.href)
                        ? `${module.bgColor} ${module.color}`
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <module.icon className="w-4 h-4" />
                    <span>{module.name}</span>
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {activeModule === module.name && (
                    <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden opacity-0 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className={`p-4 ${module.bgColor}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${module.color}`}>
                            <module.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className={`font-bold ${module.color}`}>{module.name}</h3>
                            <p className="text-sm text-gray-600">Find the best {module.name.toLowerCase()} deals</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 grid grid-cols-2 gap-3">
                        <Link href={`${module.href}/search`} className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <Search className="w-5 h-5 text-gray-400 mb-2" />
                          <p className="font-medium text-sm">Search {module.name}</p>
                          <p className="text-xs text-gray-500">Find best deals</p>
                        </Link>
                        <Link href={`${module.href}/deals`} className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <Badge className="mb-2">Hot</Badge>
                          <p className="font-medium text-sm">Special Offers</p>
                          <p className="text-xs text-gray-500">Save up to 40%</p>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations, hotels..."
                  className="w-64 pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>

              {/* Language/Currency */}
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="w-4 h-4" />
                USD
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500">
                  3
                </Badge>
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500">
                  2
                </Badge>
              </Button>

              {/* User Menu */}
              {isLoggedIn ? (
                <div className="flex items-center gap-3 pl-3 border-l">
                  <Link href="/account/dashboard">
                    <Avatar className="w-9 h-9 border-2 border-sky-500">
                      <AvatarImage src="/avatar.jpg" />
                      <AvatarFallback className="bg-sky-100 text-sky-600">JD</AvatarFallback>
                    </Avatar>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2 pl-3 border-l">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white shadow-lg shadow-sky-500/30">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Module Links */}
              {moduleLinks.map((module) => (
                <Link
                  key={module.name}
                  href={module.href}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg transition-colors',
                    pathname.startsWith(module.href)
                      ? `${module.bgColor} ${module.color}`
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${module.color}`}>
                    <module.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{module.name}</span>
                </Link>
              ))}

              <div className="border-t pt-4 space-y-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <link.icon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                ))}
              </div>

              <div className="border-t pt-4 flex flex-col gap-2">
                {!isLoggedIn ? (
                  <>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full bg-gradient-to-r from-sky-600 to-teal-600 text-white">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/account/dashboard">
                    <Button className="w-full">My Account</Button>
                  </Link>
                )}
              </div>

              <div className="border-t pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">English</span>
                </div>
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Dark Mode</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

export default MainHeader
