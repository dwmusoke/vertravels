/**
 * Professional Footer
 * Comprehensive footer with links, contact info, social media, and trust badges
 */

'use client'

import Link from 'next/link'
import {
  Plane,
  Hotel,
  MapPin,
  Car,
  FileText,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin as MapPinIcon,
  CreditCard,
  Shield,
  Award,
  Globe
} from 'lucide-react'

const companyLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Careers', href: '/careers' },
  { name: 'Press', href: '/press' },
  { name: 'Blog', href: '/blog' },
  { name: 'Partnerships', href: '/partnerships' },
  { name: 'Affiliates', href: '/affiliates' }
]

const supportLinks = [
  { name: 'Help Center', href: '/help' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Cookie Policy', href: '/cookies' }
]

const travelLinks = [
  { name: 'Flight Booking', href: '/flights' },
  { name: 'Hotel Booking', href: '/hotels' },
  { name: 'Tour Packages', href: '/tours' },
  { name: 'Car Rental', href: '/cars' },
  { name: 'Visa Services', href: '/visa' },
  { name: 'Travel Insurance', href: '/insurance' }
]

const destinations = [
  { name: 'Dubai', href: '/destinations/dubai' },
  { name: 'Paris', href: '/destinations/paris' },
  { name: 'London', href: '/destinations/london' },
  { name: 'New York', href: '/destinations/new-york' },
  { name: 'Tokyo', href: '/destinations/tokyo' },
  { name: 'Singapore', href: '/destinations/singapore' }
]

const paymentMethods = [
  { name: 'Visa', icon: '💳' },
  { name: 'Mastercard', icon: '💳' },
  { name: 'PayPal', icon: '🅿️' },
  { name: 'Stripe', icon: '💳' },
  { name: 'Bank Transfer', icon: '🏦' },
  { name: 'Wallet', icon: '👛' }
]

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  { name: 'YouTube', href: 'https://youtube.com', icon: Youtube }
]

export function MainFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">VerTravels</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted travel partner for unforgettable journeys. Book flights, hotels, tours, and more with confidence.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href="tel:+1234567890" className="flex items-center gap-3 hover:text-sky-400 transition-colors">
                <Phone className="w-5 h-5 text-sky-500" />
                <span>+1 (555) 123-4567</span>
              </a>
              <a href="mailto:support@vertravels.com" className="flex items-center gap-3 hover:text-sky-400 transition-colors">
                <Mail className="w-5 h-5 text-sky-500" />
                <span>support@vertravels.com</span>
              </a>
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-5 h-5 text-sky-500" />
                <span>123 Travel Street, Travel City, TC 12345</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-sky-600 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-sky-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-sky-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Travel Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {travelLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-sky-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-white font-semibold mb-4">Destinations</h3>
            <ul className="space-y-2">
              {destinations.map((dest) => (
                <li key={dest.name}>
                  <Link href={dest.href} className="hover:text-sky-400 transition-colors">
                    {dest.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Trust Badges & Payment */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-sky-500" />
                <span className="text-sm">Secure Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-sky-500" />
                <span className="text-sm">Best Price Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-sky-500" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Payment Methods:</span>
              <div className="flex gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-sm"
                    title={method.name}
                  >
                    {method.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} VerTravels. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="hover:text-sky-400 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-sky-400 transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="hover:text-sky-400 transition-colors">
                Cookies
              </Link>
              <Link href="/sitemap" className="hover:text-sky-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default MainFooter
