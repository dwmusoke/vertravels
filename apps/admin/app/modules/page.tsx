'use client'

import { useEffect, useState } from 'react'
import { createClient } from "@/lib/supabase/client";
import { Card, Button, Badge, Input, Label, Switch } from '@vertravels/ui'
import {
  Plane,
  Hotel,
  MapPin,
  Car,
  FileText,
  Settings,
  Key,
  Save,
  Eye,
  EyeOff,
  RefreshCcw
} from 'lucide-react'

const MODULE_LABELS: Record<string, string> = {
  flights: "Flight booking engine with multi-GDS support (Amadeus, Travelport, Kiwi)",
  hotels: "Hotel booking platform with major providers (Hotelbeds, Ratehawk, Rezlive)",
  tours: "Tours and activities marketplace (Viator, Tiqets)",
  cars: "Car rental booking system",
  visa: "Visa application processing",
  blogs: "Blog and content management system",
}

const moduleIcons: Record<string, React.ReactNode> = {
  flights: <Plane className="w-5 h-5" />,
  hotels: <Hotel className="w-5 h-5" />,
  tours: <MapPin className="w-5 h-5" />,
  cars: <Car className="w-5 h-5" />,
  visa: <FileText className="w-5 h-5" />
}

export default function AdminModulesPage() {
  const supabase = createClient()
  const [modules, setModules] = useState<any[]>([])
  const [gateways, setGateways] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const { data: modulesData } = await supabase
        .from('modules')
        .select('*')
        .order('name')

      const { data: gatewaysData } = await supabase
        .from('payment_gateways')
        .select('*')
        .order('name')

      setModules(modulesData || [])
      setGateways(gatewaysData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleModule(moduleId: number, active: boolean) {
    try {
      const { error } = await supabase
        .from('modules')
        .update({ active })
        .eq('id', moduleId)

      if (error) throw error

      setModules(modules.map(m =>
        m.id === moduleId ? { ...m, active } : m
      ))
    } catch (error) {
      console.error('Error toggling module:', error)
      alert('Failed to update module')
    }
  }

  async function toggleGateway(gatewayId: number, status: boolean) {
    try {
      const { error } = await supabase
        .from('payment_gateways')
        .update({ status })
        .eq('id', gatewayId)

      if (error) throw error

      setGateways(gateways.map(g =>
        g.id === gatewayId ? { ...g, status } : g
      ))
    } catch (error) {
      console.error('Error toggling gateway:', error)
      alert('Failed to update gateway')
    }
  }

  async function updateModuleSettings(moduleId: number, settings: any) {
    try {
      setSaving(true)
      const { error } = await supabase
        .from('modules')
        .update({ settings })
        .eq('id', moduleId)

      if (error) throw error

      setModules(modules.map(m =>
        m.id === moduleId ? { ...m, settings } : m
      ))

      alert('Module configuration saved successfully')
    } catch (error) {
      console.error('Error updating settings:', error)
      alert('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  async function updateGatewayCredentials(gatewayId: number, data: any) {
    try {
      setSaving(true)
      const { error } = await supabase
        .from('payment_gateways')
        .update(data)
        .eq('id', gatewayId)

      if (error) throw error

      setGateways(gateways.map(g =>
        g.id === gatewayId ? { ...g, ...data } : g
      ))

      alert('Gateway configuration saved successfully')
    } catch (error) {
      console.error('Error updating gateway:', error)
      alert('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  function toggleApiKeyVisibility(key: string) {
    setShowApiKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Module Management</h1>
        <p className="text-gray-600 mt-1">Configure and manage travel modules and payment gateways</p>
      </div>

      {/* Modules Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Travel Modules
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {modules.map((module) => (
            <Card key={module.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    module.active ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {moduleIcons[module.slug] || <Settings className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{module.name}</h3>
                      <Badge variant={module.active ? 'success' : 'destructive'}>
                        {module.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {MODULE_LABELS[module.slug] || `${module.name} module`}
                    </p>

                    {/* Module Configuration */}
                    {module.slug === 'flights' && (
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Duffel API Key</Label>
                            <div className="flex gap-2">
                              <Input
                                type={showApiKeys[`duffel_${module.id}`] ? 'text' : 'password'}
                                defaultValue={module.settings?.duffel_api_key || ''}
                                placeholder="dk_test_..."
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleApiKeyVisibility(`duffel_${module.id}`)}
                              >
                                {showApiKeys[`duffel_${module.id}`] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label>Environment</Label>
                            <select
                              defaultValue={module.settings?.environment || 'test'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="test">Test</option>
                              <option value="live">Live</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {['Amadeus', 'Travelport', 'Kiwi'].map((provider) => (
                            <div key={provider}>
                              <Label>
                                <input
                                  type="checkbox"
                                  defaultChecked={module.settings?.providers?.[provider.toLowerCase()] !== false}
                                  className="mr-2"
                                />
                                {provider}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {module.slug === 'hotels' && (
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>HotelsTON API Key</Label>
                            <Input
                              type="password"
                              defaultValue={module.settings?.hotelston_api_key || ''}
                              placeholder="API key"
                            />
                          </div>
                          <div>
                            <Label>Agoda API Key</Label>
                            <Input
                              type="password"
                              defaultValue={module.settings?.agoda_api_key || ''}
                              placeholder="API key"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {['Hotelbeds', 'Ratehawk', 'Rezlive'].map((provider) => (
                            <div key={provider}>
                              <Label>
                                <input
                                  type="checkbox"
                                  defaultChecked={module.settings?.providers?.[provider.toLowerCase()] !== false}
                                  className="mr-2"
                                />
                                {provider}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {module.slug === 'tours' && (
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Viator API Key</Label>
                            <Input
                              type="password"
                              defaultValue={module.settings?.viator_api_key || ''}
                              placeholder="API key"
                            />
                          </div>
                          <div>
                            <Label>Tiqets API Key</Label>
                            <Input
                              type="password"
                              defaultValue={module.settings?.tiqets_api_key || ''}
                              placeholder="API key"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {(module.slug === 'flights' || module.slug === 'hotels' || module.slug === 'tours') && (
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            updateModuleSettings(module.id, module.settings || {})
                          }}
                          disabled={saving}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Configuration
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCcw className="w-4 h-4 mr-2" />
                          Test Connection
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Label className="text-sm">Module Status</Label>
                    <div className="mt-2">
                      <Switch
                        checked={module.active}
                        onCheckedChange={(checked) => toggleModule(module.id, checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Gateways Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Payment Gateways
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gateways.map((gateway) => (
            <Card key={gateway.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{gateway.name}</h3>
                    <Badge variant={gateway.status ? 'success' : 'destructive'}>
                      {gateway.status ? 'Active' : 'Inactive'}
                    </Badge>
                    {gateway.dev_mode && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                        Dev Mode
                      </span>
                    )}
                  </div>
                </div>
                <Switch
                  checked={gateway.status}
                  onCheckedChange={(checked) => toggleGateway(gateway.id, checked)}
                />
              </div>

              {gateway.slug === 'stripe' && (
                <div className="space-y-3">
                  <div>
                    <Label>Publishable Key</Label>
                    <Input
                      type="text"
                      defaultValue={gateway.c1 || ''}
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div>
                    <Label>Secret Key</Label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        defaultValue={gateway.c2 || ''}
                        placeholder="sk_test_..."
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleApiKeyVisibility(`stripe_${gateway.id}`)}
                      >
                        {showApiKeys[`stripe_${gateway.id}`] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Webhook Secret</Label>
                    <Input
                      type="password"
                      defaultValue={gateway.c3 || ''}
                      placeholder="whsec_..."
                    />
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => {
                      const inputs = document.querySelectorAll(`#stripe-${gateway.id} input`);
                      updateGatewayCredentials(gateway.id, {
                        c1: (inputs[0] as HTMLInputElement)?.value,
                        c2: (inputs[1] as HTMLInputElement)?.value,
                        c3: (inputs[2] as HTMLInputElement)?.value,
                      })
                    }}
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              )}

              {gateway.slug === 'flutterwave' && (
                <div className="space-y-3">
                  <div>
                    <Label>Public Key</Label>
                    <Input
                      type="text"
                      defaultValue={gateway.c1 || ''}
                      placeholder="FLWPUBK_TEST-..."
                    />
                  </div>
                  <div>
                    <Label>Secret Key</Label>
                    <Input
                      type="password"
                      defaultValue={gateway.c2 || ''}
                      placeholder="FLWSECK_TEST-..."
                    />
                  </div>
                  <div>
                    <Label>Encryption Key</Label>
                    <Input
                      type="password"
                      defaultValue={gateway.c3 || ''}
                    />
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => {
                      const inputs = document.querySelectorAll(`#flutterwave-${gateway.id} input`);
                      updateGatewayCredentials(gateway.id, {
                        c1: (inputs[0] as HTMLInputElement)?.value,
                        c2: (inputs[1] as HTMLInputElement)?.value,
                        c3: (inputs[2] as HTMLInputElement)?.value,
                      })
                    }}
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              )}

              {gateway.slug === 'paypal' && (
                <div className="space-y-3">
                  <div>
                    <Label>Client ID</Label>
                    <Input
                      type="text"
                      defaultValue={gateway.c1 || ''}
                      placeholder="Client ID"
                    />
                  </div>
                  <div>
                    <Label>Client Secret</Label>
                    <Input
                      type="password"
                      defaultValue={gateway.c2 || ''}
                      placeholder="Client Secret"
                    />
                  </div>
                  <div>
                    <Label>Environment</Label>
                    <select
                      defaultValue={gateway.dev_mode ? 'sandbox' : 'live'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="sandbox">Sandbox</option>
                      <option value="live">Live</option>
                    </select>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => {
                      const inputs = document.querySelectorAll(`#paypal-${gateway.id} input`);
                      updateGatewayCredentials(gateway.id, {
                        c1: (inputs[0] as HTMLInputElement)?.value,
                        c2: (inputs[1] as HTMLInputElement)?.value,
                      })
                    }}
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              )}

              {gateway.slug === 'bank-transfer' && (
                <div className="space-y-3">
                  <div>
                    <Label>Account Holder</Label>
                    <Input
                      type="text"
                      defaultValue={gateway.c1 || ''}
                      placeholder="Account Holder Name"
                    />
                  </div>
                  <div>
                    <Label>Bank Name</Label>
                    <Input
                      type="text"
                      defaultValue={gateway.c2 || ''}
                      placeholder="Bank Name"
                    />
                  </div>
                  <div>
                    <Label>Account Number</Label>
                    <Input
                      type="text"
                      defaultValue={gateway.c3 || ''}
                      placeholder="Account Number"
                    />
                  </div>
                  <div>
                    <Label>IBAN</Label>
                    <Input
                      type="text"
                      defaultValue={gateway.c4 || ''}
                      placeholder="IBAN"
                    />
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => {
                      const inputs = document.querySelectorAll(`#bank-${gateway.id} input`);
                      updateGatewayCredentials(gateway.id, {
                        c1: (inputs[0] as HTMLInputElement)?.value,
                        c2: (inputs[1] as HTMLInputElement)?.value,
                        c3: (inputs[2] as HTMLInputElement)?.value,
                        c4: (inputs[3] as HTMLInputElement)?.value,
                      })
                    }}
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              )}

              {(gateway.slug === 'pay-later' || gateway.slug === 'wallet-balance') && (
                <p className="text-sm text-gray-500 italic">
                  {gateway.slug === 'pay-later'
                    ? 'Pay Later allows customers to book now and pay within a specified period. No configuration required.'
                    : 'Wallet Balance enables customers to pay using their stored wallet funds. No configuration required.'}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
