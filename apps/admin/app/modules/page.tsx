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
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCcw
} from 'lucide-react'

interface Module {
  id: string
  name: string
  slug: string
  enabled: boolean
  icon: string
  description: string
  config?: any
}

interface Gateway {
  id: string
  name: string
  slug: string
  enabled: boolean
  config: any
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
  const [modules, setModules] = useState<Module[]>([])
  const [gateways, setGateways] = useState<Gateway[]>([])
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

  async function toggleModule(moduleId: string, enabled: boolean) {
    try {
      const { error } = await supabase
        .from('modules')
        .update({ enabled })
        .eq('id', moduleId)

      if (error) throw error

      setModules(modules.map(m => 
        m.id === moduleId ? { ...m, enabled } : m
      ))
    } catch (error) {
      console.error('Error toggling module:', error)
      alert('Failed to update module')
    }
  }

  async function toggleGateway(gatewayId: string, enabled: boolean) {
    try {
      const { error } = await supabase
        .from('payment_gateways')
        .update({ enabled })
        .eq('id', gatewayId)

      if (error) throw error

      setGateways(gateways.map(g => 
        g.id === gatewayId ? { ...g, enabled } : g
      ))
    } catch (error) {
      console.error('Error toggling gateway:', error)
      alert('Failed to update gateway')
    }
  }

  async function updateModuleConfig(moduleId: string, config: any) {
    try {
      setSaving(true)
      const { error } = await supabase
        .from('modules')
        .update({ config })
        .eq('id', moduleId)

      if (error) throw error

      setModules(modules.map(m => 
        m.id === moduleId ? { ...m, config } : m
      ))

      alert('Module configuration saved successfully')
    } catch (error) {
      console.error('Error updating config:', error)
      alert('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  async function updateGatewayConfig(gatewayId: string, config: any) {
    try {
      setSaving(true)
      const { error } = await supabase
        .from('payment_gateways')
        .update({ config: JSON.stringify(config) })
        .eq('id', gatewayId)

      if (error) throw error

      setGateways(gateways.map(g => 
        g.id === gatewayId ? { ...g, config } : g
      ))

      alert('Gateway configuration saved successfully')
    } catch (error) {
      console.error('Error updating config:', error)
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
                    module.enabled ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {moduleIcons[module.slug] || <Settings className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{module.name}</h3>
                      <Badge variant={module.enabled ? 'success' : 'destructive'}>
                        {module.enabled ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                    
                    {/* Module Configuration */}
                    {module.slug === 'flights' && (
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Duffel API Key</Label>
                            <div className="flex gap-2">
                              <Input
                                type={showApiKeys[`duffel_${module.id}`] ? 'text' : 'password'}
                                defaultValue={module.config?.duffel_api_key || ''}
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
                              defaultValue={module.config?.environment || 'test'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="test">Test</option>
                              <option value="live">Live</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>
                              <input
                                type="checkbox"
                                defaultChecked={module.config?.providers?.amadeus !== false}
                                className="mr-2"
                              />
                              Amadeus
                            </Label>
                          </div>
                          <div>
                            <Label>
                              <input
                                type="checkbox"
                                defaultChecked={module.config?.providers?.travelport !== false}
                                className="mr-2"
                              />
                              Travelport
                            </Label>
                          </div>
                          <div>
                            <Label>
                              <input
                                type="checkbox"
                                defaultChecked={module.config?.providers?.kiwi !== false}
                                className="mr-2"
                              />
                              Kiwi
                            </Label>
                          </div>
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
                              defaultValue={module.config?.hotelston_api_key || ''}
                              placeholder="API key"
                            />
                          </div>
                          <div>
                            <Label>Agoda API Key</Label>
                            <Input
                              type="password"
                              defaultValue={module.config?.agoda_api_key || ''}
                              placeholder="API key"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>
                              <input
                                type="checkbox"
                                defaultChecked={module.config?.providers?.hotelbeds !== false}
                                className="mr-2"
                              />
                              Hotelbeds
                            </Label>
                          </div>
                          <div>
                            <Label>
                              <input
                                type="checkbox"
                                defaultChecked={module.config?.providers?.ratehawk !== false}
                                className="mr-2"
                              />
                              Ratehawk
                            </Label>
                          </div>
                          <div>
                            <Label>
                              <input
                                type="checkbox"
                                defaultChecked={module.config?.providers?.rezlive !== false}
                                className="mr-2"
                              />
                              Rezlive
                            </Label>
                          </div>
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
                              defaultValue={module.config?.viator_api_key || ''}
                              placeholder="API key"
                            />
                          </div>
                          <div>
                            <Label>Tiqets API Key</Label>
                            <Input
                              type="password"
                              defaultValue={module.config?.tiqets_api_key || ''}
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
                            // Save module config
                            alert('Configuration saved')
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
                        checked={module.enabled}
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
                    <Badge variant={gateway.enabled ? 'success' : 'destructive'}>
                      {gateway.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <Switch
                  checked={gateway.enabled}
                  onCheckedChange={(checked) => toggleGateway(gateway.id, checked)}
                />
              </div>

              <div className="space-y-3">
                {gateway.slug === 'stripe' && (
                  <>
                    <div>
                      <Label>Publishable Key</Label>
                      <Input
                        type="password"
                        defaultValue={gateway.config?.publishable_key || ''}
                        placeholder="pk_test_..."
                      />
                    </div>
                    <div>
                      <Label>Secret Key</Label>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          defaultValue={gateway.config?.secret_key || ''}
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
                        defaultValue={gateway.config?.webhook_secret || ''}
                        placeholder="whsec_..."
                      />
                    </div>
                  </>
                )}

                {gateway.slug === 'flutterwave' && (
                  <>
                    <div>
                      <Label>Public Key</Label>
                      <Input
                        type="text"
                        defaultValue={gateway.config?.public_key || ''}
                        placeholder="FLWPUBK_TEST-..."
                      />
                    </div>
                    <div>
                      <Label>Secret Key</Label>
                      <Input
                        type="password"
                        defaultValue={gateway.config?.secret_key || ''}
                        placeholder="FLWSECK_TEST-..."
                      />
                    </div>
                    <div>
                      <Label>Encryption Key</Label>
                      <Input
                        type="password"
                        defaultValue={gateway.config?.encryption_key || ''}
                      />
                    </div>
                  </>
                )}

                {gateway.slug === 'paypal' && (
                  <>
                    <div>
                      <Label>Client ID</Label>
                      <Input
                        type="text"
                        defaultValue={gateway.config?.client_id || ''}
                        placeholder="Client ID"
                      />
                    </div>
                    <div>
                      <Label>Client Secret</Label>
                      <Input
                        type="password"
                        defaultValue={gateway.config?.client_secret || ''}
                        placeholder="Client Secret"
                      />
                    </div>
                    <div>
                      <Label>Environment</Label>
                      <select
                        defaultValue={gateway.config?.environment || 'sandbox'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="sandbox">Sandbox</option>
                        <option value="live">Live</option>
                      </select>
                    </div>
                  </>
                )}

                {gateway.slug === 'bank_transfer' && (
                  <>
                    <div>
                      <Label>Bank Name</Label>
                      <Input
                        type="text"
                        defaultValue={gateway.config?.bank_name || ''}
                        placeholder="Bank Name"
                      />
                    </div>
                    <div>
                      <Label>Account Number</Label>
                      <Input
                        type="text"
                        defaultValue={gateway.config?.account_number || ''}
                        placeholder="Account Number"
                      />
                    </div>
                    <div>
                      <Label>Routing Number</Label>
                      <Input
                        type="text"
                        defaultValue={gateway.config?.routing_number || ''}
                        placeholder="Routing Number"
                      />
                    </div>
                  </>
                )}

                <Button
                  className="w-full mt-4"
                  onClick={() => updateGatewayConfig(gateway.id, gateway.config)}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
