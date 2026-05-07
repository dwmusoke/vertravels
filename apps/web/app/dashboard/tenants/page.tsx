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
  Image,
  Check,
} from "lucide-react";
import { tenants, Tenant, defaultTenant } from "@/lib/tenant/types";

export default function TenantsPage() {
  const [currentTenant, setCurrentTenant] = useState<Tenant>(defaultTenant);
  const [activeTab, setActiveTab] = useState<
    "tenants" | "users" | "roles" | "branding"
  >("tenants");
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const BrandingEditor = () => {
    const tenant = editingTenant || defaultTenant;
    return (
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Company Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                defaultValue={tenant.name}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL)
              </label>
              <input
                type="text"
                defaultValue={tenant.slug}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Your booking URL: vertravels.com/{tenant.slug}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  defaultValue={tenant.contactEmail}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  defaultValue={tenant.contactPhone}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                defaultValue={tenant.address}
                className="w-full px-3 py-2 border rounded-lg"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  defaultValue={tenant.country}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option>Uganda</option>
                  <option>Kenya</option>
                  <option>Tanzania</option>
                  <option>Rwanda</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  defaultValue={tenant.currency}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="UGX">UGX - Ugandan Shilling</option>
                  <option value="KES">KES - Kenyan Shilling</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Branding & Logo
          </h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-xl p-6 text-center">
              {previewLogo || tenant.logo ? (
                <div className="relative inline-block">
                  <img
                    src={previewLogo || tenant.logo}
                    alt="Logo preview"
                    className="h-20 mx-auto object-contain"
                  />
                  <button
                    onClick={() => setPreviewLogo(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Image className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">
                    Upload your company logo
                  </p>
                  <label className="inline-block mt-2 px-4 py-2 bg-sky-600 text-white rounded-lg cursor-pointer hover:bg-sky-700">
                    <Upload className="w-4 h-4 inline mr-2" />
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">
                    PNG, JPG up to 2MB. Recommended: 200x60px
                  </p>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    defaultValue={tenant.primaryColor}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    defaultValue={tenant.primaryColor}
                    className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    defaultValue={tenant.secondaryColor}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    defaultValue={tenant.secondaryColor}
                    className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: tenant.primaryColor }}
                  >
                    {tenant.name[0]}
                  </div>
                  <div>
                    <p
                      className="font-bold text-lg"
                      style={{ color: tenant.primaryColor }}
                    >
                      {tenant.name}
                    </p>
                    <p className="text-sm text-gray-500">Booking Portal</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    className="px-4 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: tenant.primaryColor }}
                  >
                    Search Flights
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg font-medium border"
                    style={{
                      borderColor: tenant.secondaryColor,
                      color: tenant.secondaryColor,
                    }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveBranding = () => {
    setEditingTenant(null);
    setPreviewLogo(null);
  };

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
            {["tenants", "users", "roles", "branding"].map((tab) => (
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

          {activeTab === "branding" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Agency Branding</h3>
                  <p className="text-sm text-gray-500">
                    Configure your agency's logo, colors, and appearance
                  </p>
                </div>
                <div className="flex gap-2">
                  {editingTenant && (
                    <>
                      <button
                        onClick={() => {
                          setEditingTenant(null);
                          setPreviewLogo(null);
                        }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveBranding}
                        className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </>
                  )}
                  {!editingTenant && (
                    <button
                      onClick={() => setEditingTenant(defaultTenant)}
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Branding
                    </button>
                  )}
                </div>
              </div>
              <BrandingEditor />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
