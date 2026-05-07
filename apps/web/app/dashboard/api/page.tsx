"use client";

import { useState } from "react";
import {
  Key,
  Save,
  RefreshCw,
  CheckCircle,
  XCircle,
  ToggleRight,
  ToggleLeft,
  Plug,
  Unplug,
} from "lucide-react";

interface ProviderConfig {
  name: string;
  description: string;
  provider: string;
  baseUrl: string;
  enabled: boolean;
  hasApiKey: boolean;
  logo: string;
}

const defaultProviders: ProviderConfig[] = [
  {
    name: "Duffel API",
    provider: "duffel",
    baseUrl: "https://api.duffel.com/v1",
    description: "Global flight search and booking",
    enabled: false,
    hasApiKey: true,
    logo: "✈️",
  },
  {
    name: "Amadeus API",
    provider: "amadeus",
    baseUrl: "https://api.amadeus.com/v1",
    description: "Flight search and booking",
    enabled: false,
    hasApiKey: true,
    logo: "🌍",
  },
  {
    name: "Travelport API",
    provider: "travelport",
    baseUrl: "https://api.travelport.com",
    description: "Flight search and booking (GDS)",
    enabled: false,
    hasApiKey: true,
    logo: "🌐",
  },
  {
    name: "Hotelbeds API",
    provider: "hotelbeds",
    baseUrl: "https://api.hotelbeds.com/hotel-api/1.0",
    description: "Hotel inventory from Hotelbeds",
    enabled: false,
    hasApiKey: true,
    logo: "🏨",
  },
  {
    name: "Viator API",
    provider: "viator",
    baseUrl: "https://api.viator.com/v3",
    description: "Tours and activities",
    enabled: false,
    hasApiKey: true,
    logo: "🎫",
  },
  {
    name: "Rentalcars API",
    provider: "rentalcars",
    baseUrl: "https://api.rentalcars.com/partners",
    description: "Car rental search",
    enabled: false,
    hasApiKey: true,
    logo: "🚗",
  },
  {
    name: "Internal Database",
    provider: "internal",
    baseUrl: "Built-in",
    description: "Your own inventory from dashboard",
    enabled: true,
    hasApiKey: false,
    logo: "💾",
  },
];

export default function ApiPage() {
  const [providers, setProviders] =
    useState<ProviderConfig[]>(defaultProviders);
  const [apiKeys, setApiKeys] = useState<
    Record<string, { key: string; secret: string }>
  >({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleProvider = (provider: string) => {
    setProviders(
      providers.map((p) =>
        p.provider === provider ? { ...p, enabled: !p.enabled } : p,
      ),
    );
  };

  const updateApiKey = (provider: string, key: string, secret: string = "") => {
    setApiKeys({ ...apiKeys, [provider]: { key, secret } });
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              API Integration Settings
            </h1>
            <p className="text-sm text-gray-500">
              Configure external flight, hotel, and car providers
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
              saving
                ? "bg-gray-400"
                : saved
                  ? "bg-green-600"
                  : "bg-sky-600 hover:bg-sky-700"
            } text-white`}
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-900">Flight Providers</h2>
          </div>
          <div className="divide-y">
            {providers
              .filter((p) =>
                ["duffel", "amadeus", "travelport", "internal"].includes(
                  p.provider,
                ),
              )
              .map((provider) => (
                <div key={provider.provider} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{provider.logo}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {provider.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              provider.enabled
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {provider.enabled ? "Active" : "Disabled"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {provider.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {provider.hasApiKey && provider.enabled && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="API Key"
                            value={apiKeys[provider.provider]?.key || ""}
                            onChange={(e) =>
                              updateApiKey(provider.provider, e.target.value)
                            }
                            className="w-64 px-3 py-2 border rounded-lg text-sm"
                          />
                          <input
                            type="password"
                            placeholder="API Secret (optional)"
                            value={apiKeys[provider.provider]?.secret || ""}
                            onChange={(e) =>
                              updateApiKey(
                                provider.provider,
                                apiKeys[provider.provider]?.key || "",
                                e.target.value,
                              )
                            }
                            className="w-64 px-3 py-2 border rounded-lg text-sm"
                          />
                        </div>
                      )}
                      <button
                        onClick={() => toggleProvider(provider.provider)}
                        className={`p-2 rounded-lg ${
                          provider.enabled
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {provider.enabled ? (
                          <ToggleRight className="w-6 h-6" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-900">Hotel Providers</h2>
          </div>
          <div className="divide-y">
            {providers
              .filter((p) => ["hotelbeds", "internal"].includes(p.provider))
              .map((provider) => (
                <div key={provider.provider} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{provider.logo}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {provider.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              provider.enabled
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {provider.enabled ? "Active" : "Disabled"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {provider.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {provider.hasApiKey && provider.enabled && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="API Key"
                            value={apiKeys[provider.provider]?.key || ""}
                            onChange={(e) =>
                              updateApiKey(provider.provider, e.target.value)
                            }
                            className="w-64 px-3 py-2 border rounded-lg text-sm"
                          />
                        </div>
                      )}
                      <button
                        onClick={() => toggleProvider(provider.provider)}
                        className={`p-2 rounded-lg ${
                          provider.enabled
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {provider.enabled ? (
                          <ToggleRight className="w-6 h-6" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-900">Tour Providers</h2>
          </div>
          <div className="divide-y">
            {providers
              .filter((p) => ["viator", "internal"].includes(p.provider))
              .map((provider) => (
                <div key={provider.provider} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{provider.logo}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {provider.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              provider.enabled
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {provider.enabled ? "Active" : "Disabled"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {provider.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {provider.hasApiKey && provider.enabled && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="API Key"
                            value={apiKeys[provider.provider]?.key || ""}
                            onChange={(e) =>
                              updateApiKey(provider.provider, e.target.value)
                            }
                            className="w-64 px-3 py-2 border rounded-lg text-sm"
                          />
                        </div>
                      )}
                      <button
                        onClick={() => toggleProvider(provider.provider)}
                        className={`p-2 rounded-lg ${
                          provider.enabled
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {provider.enabled ? (
                          <ToggleRight className="w-6 h-6" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-900">Car Providers</h2>
          </div>
          <div className="divide-y">
            {providers
              .filter((p) => ["rentalcars", "internal"].includes(p.provider))
              .map((provider) => (
                <div key={provider.provider} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{provider.logo}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {provider.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              provider.enabled
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {provider.enabled ? "Active" : "Disabled"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {provider.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {provider.hasApiKey && provider.enabled && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="API Key"
                            value={apiKeys[provider.provider]?.key || ""}
                            onChange={(e) =>
                              updateApiKey(provider.provider, e.target.value)
                            }
                            className="w-64 px-3 py-2 border rounded-lg text-sm"
                          />
                        </div>
                      )}
                      <button
                        onClick={() => toggleProvider(provider.provider)}
                        className={`p-2 rounded-lg ${
                          provider.enabled
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {provider.enabled ? (
                          <ToggleRight className="w-6 h-6" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
