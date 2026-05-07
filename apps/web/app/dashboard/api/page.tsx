"use client";

import { useState } from "react";
import { Key, Save, RefreshCw, CheckCircle, XCircle } from "lucide-react";

const apis = [
  {
    name: "Amadeus API",
    description: "Flight search and booking",
    status: "Connected",
    key: "amadeus",
  },
  {
    name: "Booking.com API",
    description: "Hotel search and booking",
    status: "Connected",
    key: "booking",
  },
  {
    name: "Viator API",
    description: "Tours and activities",
    status: "Disconnected",
    key: "viator",
  },
  {
    name: "Rentalcars API",
    description: "Car rental search",
    status: "Connected",
    key: "rentalcars",
  },
  {
    name: "Stripe API",
    description: "Payment processing",
    status: "Connected",
    key: "stripe",
  },
];

export default function ApiPage() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    amadeus: "demo_key_amadeus_xxx",
    booking: "demo_key_booking_xxx",
    viator: "",
    rentalcars: "demo_key_rentalcars_xxx",
    stripe: "demo_key_stripe_xxx",
  });

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">API Settings</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </header>
      <div className="p-6">
        <div className="grid gap-4">
          {apis.map((api) => (
            <div key={api.key} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{api.name}</h3>
                  <p className="text-sm text-gray-500">{api.description}</p>
                </div>
                <span
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                    api.status === "Connected"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {api.status === "Connected" ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {api.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKeys[api.key]}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, [api.key]: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
                  placeholder={`Enter ${api.name} API key`}
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
                  <RefreshCw className="w-3 h-3" />
                  Test Connection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
