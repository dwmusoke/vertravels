"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Settings,
  Save,
  RefreshCw,
  Building2,
  Mail,
  Palette,
  Globe,
  Upload,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";

type Tab = "general" | "branding" | "agencies" | "email";

export default function SettingsPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<Record<string, any>>({});
  const [agencies, setAgencies] = useState<any[]>([]);
  const [emailSettings, setEmailSettings] = useState<any>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [editingAgency, setEditingAgency] = useState<any>(null);
  const [showAgencyForm, setShowAgencyForm] = useState(false);

  const [agencyForm, setAgencyForm] = useState({
    agency_name: "",
    agency_code: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    currency: "USD",
    commission_rate: "0",
  });

  const [branding, setBranding] = useState({
    logo_url: "",
    favicon_url: "",
    primary_color: "#0ea5e9",
    secondary_color: "#8b5cf6",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    try {
      setLoading(true);
      const [settingsRes, agenciesRes, emailRes] = await Promise.all([
        supabase.from("settings").select("*"),
        supabase.from("agencies").select("*").order("agency_name"),
        supabase.from("email_settings").select("*").limit(1).single(),
      ]);

      const settingsMap: Record<string, any> = {};
      (settingsRes.data || []).forEach((s: any) => {
        settingsMap[s.setting_key] = s.setting_value;
      });
      setSettings(settingsMap);
      setAgencies(agenciesRes.data || []);
      setEmailSettings(emailRes.data || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSetting(key: string, value: any) {
    try {
      setSaving(true);
      const { error } = await supabase.from("settings").upsert(
        { setting_key: key, setting_value: value, setting_type: typeof value },
        { onConflict: "setting_key" }
      );
      if (error) throw error;
      setSettings((prev) => ({ ...prev, [key]: value }));
    } catch (error: any) {
      console.error("Error saving setting:", error);
      alert("Failed to save: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveEmailSettings() {
    try {
      setSaving(true);
      const { error } = await supabase
        .from("email_settings")
        .upsert(emailSettings, { onConflict: "id" });
      if (error) throw error;
      alert("Email settings saved");
    } catch (error: any) {
      alert("Failed to save: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveAgency(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      const data = {
        agency_name: agencyForm.agency_name,
        agency_code: agencyForm.agency_code,
        contact_person: agencyForm.contact_person,
        email: agencyForm.email,
        phone: agencyForm.phone,
        address: agencyForm.address,
        city: agencyForm.city,
        country: agencyForm.country,
        currency: agencyForm.currency,
        commission_rate: parseFloat(agencyForm.commission_rate) || 0,
      };

      if (editingAgency) {
        const { error } = await supabase
          .from("agencies")
          .update(data)
          .eq("id", editingAgency.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("agencies").insert([data]);
        if (error) throw error;
      }

      setShowAgencyForm(false);
      setEditingAgency(null);
      resetAgencyForm();
      const { data: agenciesData } = await supabase
        .from("agencies")
        .select("*")
        .order("agency_name");
      setAgencies(agenciesData || []);
    } catch (error: any) {
      alert("Failed to save agency: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteAgency(id: string) {
    if (!confirm("Delete this agency?")) return;
    try {
      await supabase.from("agencies").delete().eq("id", id);
      setAgencies(agencies.filter((a) => a.id !== id));
    } catch (error: any) {
      alert("Failed to delete: " + error.message);
    }
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleEditAgency(agency: any) {
    setEditingAgency(agency);
    setAgencyForm({
      agency_name: agency.agency_name,
      agency_code: agency.agency_code || "",
      contact_person: agency.contact_person || "",
      email: agency.email || "",
      phone: agency.phone || "",
      address: agency.address || "",
      city: agency.city || "",
      country: agency.country || "",
      currency: agency.currency || "USD",
      commission_rate: agency.commission_rate?.toString() || "0",
    });
    setShowAgencyForm(true);
  }

  function resetAgencyForm() {
    setAgencyForm({
      agency_name: "",
      agency_code: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "Uganda",
      currency: "USD",
      commission_rate: "0",
    });
  }

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "general", label: "General", icon: Globe },
    { key: "branding", label: "Branding", icon: Palette },
    { key: "agencies", label: "Agencies", icon: Building2 },
    { key: "email", label: "Email", icon: Mail },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage application settings and branding</p>
      </div>

      <div className="flex gap-6">
        <div className="w-56 shrink-0">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.key
                      ? "bg-sky-50 text-sky-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            {activeTab === "general" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">General Settings</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.site_name?.en || "VerTravels"}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          site_name: { ...prev.site_name, en: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site URL
                    </label>
                    <input
                      type="url"
                      value={settings.site_url?.value || ""}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          site_url: { value: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.contact_email?.value || ""}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          contact_email: { value: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.contact_phone?.value || ""}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          contact_phone: { value: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Currency
                    </label>
                    <select
                      value={settings.default_currency?.code || "USD"}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          default_currency: { code: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="UGX">UGX</option>
                      <option value="KES">KES</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Language
                    </label>
                    <select
                      value={settings.default_language?.code || "en"}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          default_language: { code: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="en">English</option>
                      <option value="ar">Arabic</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Social Media</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Facebook</label>
                      <input
                        type="url"
                        value={settings.social_media?.facebook || ""}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            social_media: { ...prev.social_media, facebook: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Twitter</label>
                      <input
                        type="url"
                        value={settings.social_media?.twitter || ""}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            social_media: { ...prev.social_media, twitter: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Instagram</label>
                      <input
                        type="url"
                        value={settings.social_media?.instagram || ""}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            social_media: { ...prev.social_media, instagram: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => saveSetting("site_name", settings.site_name)}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                >
                  <Save className="w-4 h-4" />
                  Save General Settings
                </button>
              </div>
            )}

            {activeTab === "branding" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Branding</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Logo
                    </label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="max-h-24 mx-auto mb-3"
                        />
                      ) : (
                        <div className="text-gray-400 mb-3">
                          <Upload className="w-8 h-8 mx-auto" />
                        </div>
                      )}
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-sm">
                        <Upload className="w-4 h-4" />
                        Choose Logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Favicon
                    </label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <div className="text-gray-400 mb-3">
                        <Upload className="w-8 h-8 mx-auto" />
                      </div>
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-sm">
                        <Upload className="w-4 h-4" />
                        Choose Favicon
                        <input type="file" accept="image/*" className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={branding.primary_color}
                        onChange={(e) =>
                          setBranding({ ...branding, primary_color: e.target.value })
                        }
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={branding.primary_color}
                        onChange={(e) =>
                          setBranding({ ...branding, primary_color: e.target.value })
                        }
                        className="flex-1 px-3 py-2 border rounded-lg font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={branding.secondary_color}
                        onChange={(e) =>
                          setBranding({ ...branding, secondary_color: e.target.value })
                        }
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={branding.secondary_color}
                        onChange={(e) =>
                          setBranding({ ...branding, secondary_color: e.target.value })
                        }
                        className="flex-1 px-3 py-2 border rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-sm font-medium mb-3">Preview</h3>
                  <div
                    className="p-6 rounded-lg text-white text-center"
                    style={{ backgroundColor: branding.primary_color }}
                  >
                    <p className="text-lg font-bold">VerTravels</p>
                    <p className="text-sm opacity-80">Travel Management System</p>
                    <div className="flex gap-2 justify-center mt-3">
                      <span
                        className="px-3 py-1 rounded text-sm"
                        style={{ backgroundColor: branding.secondary_color }}
                      >
                        Button
                      </span>
                      <span className="px-3 py-1 rounded text-sm border border-white/50">
                        Outline
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => saveSetting("branding", branding)}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                >
                  <Save className="w-4 h-4" />
                  Save Branding
                </button>
              </div>
            )}

            {activeTab === "agencies" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Agencies / Tenants</h2>
                  <button
                    onClick={() => {
                      resetAgencyForm();
                      setEditingAgency(null);
                      setShowAgencyForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                  >
                    <Plus className="w-4 h-4" />
                    New Agency
                  </button>
                </div>

                {showAgencyForm && (
                  <form onSubmit={saveAgency} className="p-4 bg-gray-50 rounded-lg border">
                    <h3 className="font-medium mb-4">
                      {editingAgency ? "Edit Agency" : "New Agency"}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Agency Name *
                        </label>
                        <input
                          type="text"
                          value={agencyForm.agency_name}
                          onChange={(e) =>
                            setAgencyForm({ ...agencyForm, agency_name: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Agency Code
                        </label>
                        <input
                          type="text"
                          value={agencyForm.agency_code}
                          onChange={(e) =>
                            setAgencyForm({ ...agencyForm, agency_code: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          value={agencyForm.contact_person}
                          onChange={(e) =>
                            setAgencyForm({ ...agencyForm, contact_person: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={agencyForm.email}
                          onChange={(e) =>
                            setAgencyForm({ ...agencyForm, email: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={agencyForm.phone}
                          onChange={(e) =>
                            setAgencyForm({ ...agencyForm, phone: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={agencyForm.city}
                          onChange={(e) =>
                            setAgencyForm({ ...agencyForm, city: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={agencyForm.country}
                          onChange={(e) =>
                            setAgencyForm({ ...agencyForm, country: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Currency
                        </label>
                        <select
                          value={agencyForm.currency}
                          onChange={(e) =>
                            setAgencyForm({ ...agencyForm, currency: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="UGX">UGX</option>
                          <option value="KES">KES</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          value={agencyForm.address}
                          onChange={(e) =>
                            setAgencyForm({ ...agencyForm, address: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Commission Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={agencyForm.commission_rate}
                          onChange={(e) =>
                            setAgencyForm({ ...agencyForm, commission_rate: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4 pt-4 border-t">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                      >
                        {editingAgency ? "Update" : "Create"} Agency
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAgencyForm(false);
                          setEditingAgency(null);
                        }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Agency
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Code
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {agencies.map((agency) => (
                        <tr key={agency.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-medium">{agency.agency_name}</p>
                            <p className="text-xs text-gray-500">{agency.city}, {agency.country}</p>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <p>{agency.contact_person || "—"}</p>
                            <p className="text-xs text-gray-500">{agency.email}</p>
                          </td>
                          <td className="px-4 py-3 text-sm font-mono">
                            {agency.agency_code || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              agency.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {agency.status || "active"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditAgency(agency)}
                                className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteAgency(agency.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              >
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
            )}

            {activeTab === "email" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Email Settings</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mail Driver
                    </label>
                    <select
                      value={emailSettings.email_driver || "smtp"}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, email_driver: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="smtp">SMTP</option>
                      <option value="sendmail">Sendmail</option>
                      <option value="mailgun">Mailgun</option>
                      <option value="ses">Amazon SES</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Encryption
                    </label>
                    <select
                      value={emailSettings.email_encryption || "tls"}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, email_encryption: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={emailSettings.email_host || ""}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, email_host: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      value={emailSettings.email_port || 587}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, email_port: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={emailSettings.email_username || ""}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, email_username: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={emailSettings.email_password || ""}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, email_password: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Name
                    </label>
                    <input
                      type="text"
                      value={emailSettings.email_from_name || ""}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, email_from_name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="VerTravels"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Email
                    </label>
                    <input
                      type="email"
                      value={emailSettings.email_from_email || ""}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, email_from_email: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="noreply@vertravels.com"
                    />
                  </div>
                </div>

                <button
                  onClick={saveEmailSettings}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                >
                  <Save className="w-4 h-4" />
                  Save Email Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
