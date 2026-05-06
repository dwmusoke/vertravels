"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { Plane, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Plane className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">VerTravels</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/flights"
            className="text-sm font-medium hover:text-primary"
          >
            Flights
          </Link>
          <Link
            href="/hotels"
            className="text-sm font-medium hover:text-primary"
          >
            Hotels
          </Link>
          <Link
            href="/tours"
            className="text-sm font-medium hover:text-primary"
          >
            Tours
          </Link>
          <Link href="/cars" className="text-sm font-medium hover:text-primary">
            Cars
          </Link>
          <Link href="/visa" className="text-sm font-medium hover:text-primary">
            Visa
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4">
          <nav className="flex flex-col space-y-4">
            <Link href="/flights" className="text-sm font-medium">
              Flights
            </Link>
            <Link href="/hotels" className="text-sm font-medium">
              Hotels
            </Link>
            <Link href="/tours" className="text-sm font-medium">
              Tours
            </Link>
            <Link href="/cars" className="text-sm font-medium">
              Cars
            </Link>
            <Link href="/visa" className="text-sm font-medium">
              Visa
            </Link>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Link href="/login">
                <Button variant="ghost" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
