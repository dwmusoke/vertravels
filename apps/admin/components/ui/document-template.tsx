"use client";

import { companyInfo } from "@/lib/company-info";
import { Phone, Mail, MapPin, Globe, Building2 } from "lucide-react";

interface DocumentTemplateProps {
  type: "invoice" | "quotation" | "voucher" | "receipt" | "statement";
  documentNumber: string;
  date: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function DocumentTemplate({
  type,
  documentNumber,
  date,
  children,
  footer,
}: DocumentTemplateProps) {
  return (
    <div className="bg-white max-w-4xl mx-auto p-8 print:p-0">
      {/* Header */}
      <div className="border-b-2 border-sky-600 pb-6 mb-6">
        <div className="flex justify-between items-start">
          {/* Company Logo & Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-600 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-3xl font-bold text-white">V</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {companyInfo.name}
              </h1>
              <p className="text-sm text-gray-600">{companyInfo.tagline}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <Building2 className="w-3 h-3" />
                <span>IATA: {companyInfo.registration.iata}</span>
                <span className="mx-1">•</span>
                <span>TIN: {companyInfo.registration.tin}</span>
              </div>
            </div>
          </div>

          {/* Document Info */}
          <div className="text-right">
            <h2 className="text-3xl font-bold text-sky-600 uppercase">
              {type}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Number:</strong> {documentNumber}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Date:</strong> {new Date(date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Company Contact Details - Top Right */}
      <div className="flex justify-end mb-6">
        <div className="text-right text-sm text-gray-600 space-y-1">
          <div className="flex items-center justify-end gap-2">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span>{companyInfo.address.street}, {companyInfo.address.city}</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Phone className="w-4 h-4 text-sky-600" />
            <span>{companyInfo.contact.phone}</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Mail className="w-4 h-4 text-sky-600" />
            <span>{companyInfo.contact.email}</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Globe className="w-4 h-4 text-sky-600" />
            <span>{companyInfo.website}</span>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="mb-8">
        {children}
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-200 pt-6 mt-8">
        {footer && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            {footer}
          </div>
        )}

        {/* Company Footer */}
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <p className="font-semibold text-gray-900 mb-2">Contact Information</p>
            <p>{companyInfo.address.street}</p>
            <p>{companyInfo.address.postalCode}</p>
            <p>{companyInfo.address.city}, {companyInfo.address.country}</p>
            <p className="mt-2">Tel: {companyInfo.contact.phone}</p>
            <p>Email: {companyInfo.contact.email}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-2">Banking Details</p>
            <p>{companyInfo.banking.bankName}</p>
            <p>Account: {companyInfo.banking.accountName}</p>
            <p>Account No: {companyInfo.banking.accountNumber}</p>
            <p>SWIFT: {companyInfo.banking.swiftCode}</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <div>
            <p>{companyInfo.name} | Reg: {companyInfo.registration.registrationNumber}</p>
            <p>IATA: {companyInfo.registration.iata} | TIN: {companyInfo.registration.tin}</p>
          </div>
          <div className="text-right">
            <p>{companyInfo.website}</p>
            <p>{companyInfo.businessHours.emergency}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Invoice Specific Footer
export function InvoiceFooter({ dueDate, total }: { dueDate: string; total: number }) {
  return (
    <div className="space-y-2">
      <p className="font-semibold text-gray-900">Payment Terms:</p>
      <p className="text-sm text-gray-700">
        {documentFooter.invoices.terms}
      </p>
      <p className="text-sm text-gray-700">
        <strong>Due Date:</strong> {new Date(dueDate).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-700 mt-3 italic">
        {documentFooter.invoices.notes}
      </p>
    </div>
  );
}

// Quotation Specific Footer
export function QuotationFooter() {
  return (
    <div className="space-y-2">
      <p className="font-semibold text-gray-900">Validity & Terms:</p>
      <p className="text-sm text-gray-700">
        {documentFooter.quotations.validity}
      </p>
      <p className="text-sm text-gray-700">
        {documentFooter.quotations.terms}
      </p>
    </div>
  );
}

// Voucher Specific Footer
export function VoucherFooter() {
  return (
    <div className="space-y-2">
      <p className="font-semibold text-gray-900">Important Information:</p>
      <p className="text-sm text-gray-700">
        {documentFooter.vouchers.terms}
      </p>
      <p className="text-sm text-gray-700">
        {documentFooter.vouchers.support}
      </p>
    </div>
  );
}

// Receipt Specific Footer
export function ReceiptFooter() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-700 italic">
        {documentFooter.receipts.notes}
      </p>
      <p className="text-sm text-gray-700">
        Thank you for your business!
      </p>
    </div>
  );
}

// Helper for document footer texts
const documentFooter = {
  invoices: {
    terms: "Payment is due within 14 days of invoice date. Late payments may incur a 2% monthly interest charge.",
    notes: "Thank you for choosing VerTravels. We appreciate your business!",
  },
  quotations: {
    validity: "This quotation is valid for 30 days from the date of issue.",
    terms: "Prices are subject to availability at the time of booking. Terms and conditions apply.",
  },
  vouchers: {
    terms: "Please present this voucher at the time of service. Valid for the date and service specified only.",
    support: "For any queries, please contact our 24/7 support team.",
  },
  receipts: {
    notes: "This is an official receipt. Please retain for your records.",
  },
};
