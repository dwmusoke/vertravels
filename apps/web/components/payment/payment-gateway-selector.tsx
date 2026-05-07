'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { RadioGroup, RadioGroupItem } from '@/components/ui';
import { Label } from '@/components/ui';
import { CreditCard, Wallet, Building, Smartphone, Check } from 'lucide-react';
import { cn } from '@/components/ui';

interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  devMode?: boolean;
}

interface PaymentGatewaySelectorProps {
  selectedGateway?: string;
  onGatewaySelect: (gateway: string) => void;
  amount: number;
  currency: string;
}

export function PaymentGatewaySelector({
  selectedGateway,
  onGatewaySelect,
  amount,
  currency,
}: PaymentGatewaySelectorProps) {
  const [processing, setProcessing] = useState<string | null>(null);

  const gateways: PaymentGateway[] = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      logo: '/gateways/stripe.png',
      description: 'Pay securely with your card',
      icon: <CreditCard className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      logo: '/gateways/flutterwave.png',
      description: 'Cards, Mobile Money, Bank Transfer',
      icon: <Smartphone className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      logo: '/gateways/paypal.png',
      description: 'Pay with your PayPal account',
      icon: <Wallet className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      logo: '/gateways/bank.png',
      description: 'Direct bank transfer',
      icon: <Building className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'wallet',
      name: 'Wallet Balance',
      logo: '/gateways/wallet.png',
      description: 'Pay from your wallet',
      icon: <Wallet className="h-5 w-5" />,
      enabled: true,
    },
  ];

  const handleSelect = (gatewayId: string) => {
    onGatewaySelect(gatewayId);
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Select Payment Method</h3>
        <p className="text-sm text-muted-foreground">
          Choose your preferred payment method to complete the booking
        </p>
      </div>

      <RadioGroup value={selectedGateway} onValueChange={handleSelect}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gateways.map((gateway) => (
            <Card
              key={gateway.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                selectedGateway === gateway.id
                  ? 'border-primary bg-primary/5 ring-2 ring-primary'
                  : 'border-muted'
              )}
              onClick={() => handleSelect(gateway.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <RadioGroupItem
                    value={gateway.id}
                    id={gateway.id}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          {gateway.icon}
                        </div>
                        <div>
                          <Label
                            htmlFor={gateway.id}
                            className="font-semibold cursor-pointer"
                          >
                            {gateway.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {gateway.description}
                          </p>
                        </div>
                      </div>
                      {selectedGateway === gateway.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>

      {/* Payment Summary */}
      <Card className="mt-6 bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total Amount</p>
              <p className="text-xs text-muted-foreground">
                Including all taxes and fees
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {currency} {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
