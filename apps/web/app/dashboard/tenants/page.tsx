"use client";

import { useState } from "react";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Upload,
  Palette,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
} from "lucide-react";
import { tenants, Tenant, defaultTenant } from "@/lib/tenant/types";

export default function TenantsPage() {
  const [currentTenant, setCurrentTenant] = useState<Tenant>(defaultTenant);
  const [activeTab, setActiveTab] = useState<"tenants" | "users" | "roles">(
    "tenants",
  );

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Multi-Tenant Management
            </h1>
            <p className="text-sm text-gray-500">
              Manage agencies, branding & access control
            </p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Tenants</p>
            <p className="text-2xl font-bold">{tenants.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Agencies</p>
            <p className="text-2xl font-bold text-sky-600">
              {tenants.filter((t) => t.type === "agency").length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Corporates</p>
            <p className="text-2xl font-bold text-purple-600">
              {tenants.filter((t) => t.type === "corporate").length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {tenants.filter((t) => t.status === "active").length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b flex">
            {["tenants", "users", "roles"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 font-medium capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-sky-600 text-sky-600"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "tenants" && (
            <div className="p-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Tenant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Contact
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
                  {tenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: tenant.primaryColor }}
                          >
                            {tenant.name[0]}
                          </div>
                          <div>
                            <p className="font-medium">{tenant.name}</p>
                            <p className="text-xs text-gray-500">
                              {tenant.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            tenant.type === "agency"
                              ? "bg-sky-100 text-sky-700"
                              : tenant.type === "corporate"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {tenant.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <p>{tenant.contactEmail}</p>
                        <p className="text-gray-500">{tenant.contactPhone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            tenant.status === "active"
                              ? "bg-green-100 text-green-700"
                              : tenant.status === "suspended"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {tenant.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="p-1 text-sky-600 hover:bg-sky-50 rounded">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:bg-gray-100 rounded">
                            <Palette className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "users" && (
            <div className="p-6">
              <p className="text-gray-500 text-center py-8">
                User management with tenant isolation
              </p>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    name: "Agency Admin",
                    color: "bg-purple-100 text-purple-700",
                    desc: "Full access to agency",
                  },
                  {
                    name: "Manager",
                    color: "bg-blue-100 text-blue-700",
                    desc: "Manage bookings & users",
                  },
                  {
                    name: "User",
                    color: "bg-green-100 text-green-700",
                    desc: "Create bookings",
                  },
                  {
                    name: "Agent",
                    color: "bg-amber-100 text-amber-700",
                    desc: "Commission-based",
                  },
                  {
                    name: "Corporate Admin",
                    color: "bg-indigo-100 text-indigo-700",
                    desc: "Corporate account",
                  },
                  {
                    name: "Corporate User",
                    color: "bg-cyan-100 text-cyan-700",
                    desc: "Book on behalf",
                  },
                ].map((role) => (
                  <div key={role.name} className="border rounded-lg p-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${role.color}`}
                    >
                      {role.name}
                    </span>
                    <p className="text-sm text-gray-500 mt-2">{role.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
