"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Hotel,
  Calendar,
  Users,
  Search,
  MapPin,
  Plane,
  Car,
  Map,
  Home,
  Star,
  Wifi,
  Coffee,
  Car as CarIcon,
  Dumbbell,
  Waves,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const destinations = [
  { name: "Kampala", count: "45 hotels", image: "https://images.unsplash.com/photo-1557142046-c704a3aec804?w=600&q=80" },
  { name: "Entebbe", count: "28 hotels", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80" },
  { name: "Jinja", count: "18 hotels", image: "https://images.unsplash.com/photo-1568379697888-3c5a06e8602f?w=600&q=80" },
  { name: "Murchison Falls", count: "12 hotels", image: "https://images.unsplash.com/photo-1496417263034-38ec4f0d665a?w=600&q=80" },
  { name: "Kigali", count: "35 hotels", image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&q=80" },
  { name: "Nairobi", count: "52 hotels", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80" },
];

export default function HotelsPage() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    destination: "",
    checkin: "",
    checkout: "",
    rooms: "1",
    guests: "2",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchData);
    router.push(`/hotels/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 h-[72px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-sm">
              <Hotel className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">VerTravels</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/flights" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">Flights</Link>
            <Link href="/hotels" className="px-4 py-2 rounded-lg text-sm font-semibold text-emerald-600 bg-emerald-50">Hotels</Link>
            <Link href="/tours" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">Tours</Link>
            <Link href="/cars" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">Cars</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors">
              USD
            </button>
            <Link href="/login" className="h-9 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center">Sign In</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-700 via-teal-600 to-sky-700 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
            alt="Hotel background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg text-white/80 max-w-xl mb-8">
            From luxury resorts to budget-friendly stays — discover accommodation that suits your style.
          </p>

          {/* Search Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-5 max-w-4xl">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-500" />
                    <input
                      type="text"
                      placeholder="City, Hotel, or Landmark"
                      value={searchData.destination}
                      onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-500" />
                    <input
                      type="date"
                      value={searchData.checkin}
                      onChange={(e) => setSearchData({ ...searchData, checkin: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-500" />
                    <input
                      type="date"
                      value={searchData.checkout}
                      onChange={(e) => setSearchData({ ...searchData, checkout: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Rooms</label>
                  <select
                    value={searchData.rooms}
                    onChange={(e) => setSearchData({ ...searchData, rooms: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? "Room" : "Rooms"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Guests</label>
                  <select
                    value={searchData.guests}
                    onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm text-sm"
                  >
                    <Search className="w-4.5 h-4.5" />
                    Search Hotels
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-center gap-6">
          <Link href="/flights" className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium text-sm"><Plane className="w-4 h-4" /> Flights</Link>
          <Link href="/hotels" className="flex items-center gap-2 text-emerald-600 font-semibold text-sm"><Hotel className="w-4 h-4" /> Hotels</Link>
          <Link href="/tours" className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm"><Map className="w-4 h-4" /> Tours</Link>
          <Link href="/cars" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm"><CarIcon className="w-4 h-4" /> Cars</Link>
        </div>
      </div>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Explore</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-0.5">Popular Destinations</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {destinations.map((dest) => (
            <Link
              key={dest.name}
              href={`/hotels/search?destination=${dest.name}`}
              className="group relative h-36 rounded-xl overflow-hidden"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-sm font-bold text-white">{dest.name}</h3>
                <p className="text-[11px] text-white/70">{dest.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Amenities */}
      <section className="bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Filter by</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">Popular Amenities</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Wifi, label: "Free WiFi", color: "text-sky-600", bg: "bg-sky-50 hover:bg-sky-100" },
              { icon: Coffee, label: "Breakfast", color: "text-amber-600", bg: "bg-amber-50 hover:bg-amber-100" },
              { icon: Waves, label: "Pool", color: "text-cyan-600", bg: "bg-cyan-50 hover:bg-cyan-100" },
              { icon: Dumbbell, label: "Gym", color: "text-rose-600", bg: "bg-rose-50 hover:bg-rose-100" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={`/hotels/search?amenity=${item.label.toLowerCase().replace(/\s+/g, "")}`}
                  className={`${item.bg} p-4 rounded-xl flex items-center gap-3 transition-all border border-transparent hover:border-slate-200`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Book With Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 md:p-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Why Book With VerTravels</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Star, title: "Best Price Guarantee", desc: "We match any lower price" },
              { icon: Sparkles, title: "Curated Selection", desc: "Handpicked premium properties" },
              { icon: Calendar, title: "Free Cancellation", desc: "Cancel up to 24h before" },
              { icon: Users, title: "24/7 Support", desc: "Dedicated travel assistance" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
