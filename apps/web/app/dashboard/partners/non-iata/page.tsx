"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  X,
  Building2,
  Phone,
  Mail,
  Globe,
  CreditCard,
  Clock,
  CheckCircle,
} from "lucide-react";

interface Partner {
  id: string;
  name: string;
  type: "non_iata" | "sub_agent";
  email: string;
  phone: string;
  location: string;
  commission: number;
  creditLimit: number;
  currentBalance: number;
  status: "active" | "suspended";
  bookings: number;
  pnrAccess: boolean;
}

const partners: Partner[] = [
  {
    id: "P001",
    name: "Kampala Travel Hub",
    type: "non_iata",
    email: "info@kampalatravel.com",
    phone: "+256 701 111111",
    location: "Kampala, Uganda",
    commission: 12,
    creditLimit: 5000,
    currentBalance: 2300,
    status: "active",
    bookings: 45,
    pnrAccess: true,
  },
  {
    id: "P002",
    name: "Jinja Tours Ltd",
    type: "non_iata",
    email: "bookings@jinjatours.co.ug",
    phone: "+256 702 222222",
    location: "Jinja, Uganda",
    commission: 10,
    creditLimit: 3000,
    currentBalance: 500,
    status: "active",
    bookings: 28,
    pnrAccess: true,
  },
  {
    id: "P003",
    name: "Mbarara Agency",
    type: "sub_agent",
    email: "mbarara@travelagency.ug",
    phone: "+256 703 333333",
    location: "Mbarara, Uganda",
    commission: 8,
    creditLimit: 1500,
    currentBalance: 1200,
    status: "active",
    bookings: 12,
    pnrAccess: false,
  },
  {
    id: "P004",
    name: "Gulu Safari Services",
    type: "non_iata",
    email: "safari@gulu.co.ug",
    phone: "+256 704 444444",
    location: "Gulu, Uganda",
    commission: 15,
    creditLimit: 8000,
    currentBalance: 7800,
    status: "suspended",
    bookings: 67,
    pnrAccess: true,
  },
];

export default function NonIataPartnersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.includes(search);
    const matchesFilter =
      filter === "all" || p.type === filter || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Non-IATA Partners & Agents
            </h1>
            <p className="text-sm text-gray-500">
              Manage sub-agents and PNR access
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg">
            <Plus className="w-4 h-4" /> Add Partner
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Partners</p>
            <p className="text-2xl font-bold">{partners.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {partners.filter((p) => p.status === "active").length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Credit Used</p>
            <p className="text-2xl font-bold text-amber-600">
              ${partners.reduce((s, p) => s + p.currentBalance, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-2xl font-bold">
              {partners.reduce((s, p) => s + p.bookings, 0)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search partners..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All</option>
              <option value="non_iata">Non-IATA</option>
              <option value="sub_agent">Sub-Agent</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Partner
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Commission
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Credit
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  PNR Access
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((partner) => (
                <tr key={partner.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{partner.name}</p>
                    <p className="text-xs text-gray-500">{partner.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">{partner.location}</td>
                  <td className="px-4 py-3">
                    <span className="text-green-600 font-medium">
                      {partner.commission}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm">
                        ${partner.currentBalance} / ${partner.creditLimit}
                      </p>
                      <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1">
                        <div
                          className={`h-1.5 rounded-full ${partner.currentBalance / partner.creditLimit > 0.8 ? "bg-red-500" : "bg-green-500"}`}
                          style={{
                            width: `${(partner.currentBalance / partner.creditLimit) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {partner.pnrAccess ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" /> Enabled
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">Disabled</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        partner.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {partner.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 text-sky-600 hover:bg-sky-50 rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
