"use client";

// VerTravels Company Information
export const companyInfo = {
  name: "VerTravels Ltd.",
  tagline: "Your Trusted Travel Partner",
  logo: "/logo.png", // Replace with actual logo path
  
  // Contact Information
  address: {
    street: "Plot 123, Kampala Road",
    city: "Kampala",
    country: "Uganda",
    postalCode: "P.O. Box 12345",
  },
  
  contact: {
    phone: "+256 414 123456",
    mobile: "+256 700 123456",
    fax: "+256 414 123457",
    email: "info@vertravels.com",
    support: "support@vertravels.com",
    sales: "sales@vertravels.com",
  },
  
  // Company Registration
  registration: {
    tin: "123456789",
    iata: "12-3 45678",
    license: "TAL/123456",
    registrationNumber: "876543",
  },
  
  // Online Presence
  website: "www.vertravels.com",
  social: {
    facebook: "facebook.com/vertravels",
    twitter: "twitter.com/vertravels",
    instagram: "instagram.com/vertravels",
    linkedin: "linkedin.com/company/vertravels",
  },
  
  // Banking Information
  banking: {
    bankName: "Stanbic Bank Uganda",
    accountName: "VerTravels Ltd.",
    accountNumber: "9030000123456",
    swiftCode: "SBICUGKX",
    branch: "Kampala Road Branch",
  },
  
  // Business Hours
  businessHours: {
    weekdays: "Monday - Friday: 8:00 AM - 6:00 PM",
    saturday: "Saturday: 9:00 AM - 1:00 PM",
    sunday: "Sunday & Public Holidays: Closed",
    emergency: "24/7 Emergency Support: +256 700 123456",
  },
};

// Document Footer Text
export const documentFooter = {
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

// Email Signatures
export const emailSignatures = {
  general: `
Best Regards,

VerTravels Team
${companyInfo.name}
${companyInfo.address.street}, ${companyInfo.address.city}
Tel: ${companyInfo.contact.phone} | Email: ${companyInfo.contact.email}
Web: ${companyInfo.website}
`,
  sales: `
Best Regards,

Sales Department
${companyInfo.name}
Tel: ${companyInfo.contact.sales}
Email: ${companyInfo.contact.sales}
`,
  support: `
Best Regards,

Support Team
${companyInfo.name}
24/7 Emergency: ${companyInfo.contact.mobile}
Email: ${companyInfo.contact.support}
`,
};
