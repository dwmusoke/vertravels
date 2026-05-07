"use client";

import { useState } from "react";
import { Settings, Save, Globe, Mail, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("VerTravels");
  const [supportEmail, setSupportEmail] = useState("support@vertravels.com");
  const [timezone, setTimezone] = useState("Africa/Kampala");
  const [currency, setCurrency] = useState("USD");

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </header>
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900">General Settings</h2>
          </div>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="Africa/Kampala">Africa/Kampala</option>
                  <option value="Africa/Nairobi">Africa/Nairobi</option>
                  <option value="Africa/Lagos">Africa/Lagos</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="UGX">UGX</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900">Email Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  Booking Confirmations
                </p>
                <p className="text-sm text-gray-500">
                  Send email on successful booking
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  Payment Notifications
                </p>
                <p className="text-sm text-gray-500">
                  Send email on payment received
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-gray-500">
                  Require 2FA for admin login
                </p>
              </div>
              <input type="checkbox" className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Session Timeout</p>
                <p className="text-sm text-gray-500">
                  Auto logout after inactivity
                </p>
              </div>
              <select className="px-3 py-1.5 border rounded-lg">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
