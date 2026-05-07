"use client";

export type UserRole =
  | "super_admin"
  | "agency_admin"
  | "manager"
  | "user"
  | "agent"
  | "corporate_admin"
  | "corporate_user";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  type: "agency" | "corporate" | "sub_agent";
  logo?: string;
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  country: string;
  currency: string;
  timezone: string;
  settings: TenantSettings;
  createdAt: string;
  status: "active" | "suspended" | "trial";
}

export interface TenantSettings {
  allowBooking: boolean;
  allowCreditBooking: boolean;
  requireApproval: boolean;
  commissionRate: number;
  paymentTerms: number;
  autoTicketIssuance: boolean;
  emailNotifications: boolean;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  status: "active" | "inactive" | "suspended";
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
}

export interface CorporateAccount {
  id: string;
  tenantId: string;
  companyName: string;
  companyRegNo: string;
  taxId: string;
  billingAddress: string;
  creditLimit: number;
  usedCredit: number;
  contacts: CorporateContact[];
  status: "active" | "pending" | "suspended";
}

export interface CorporateContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  canBook: boolean;
  canApprove: boolean;
}

export const defaultTenant: Tenant = {
  id: "default",
  name: "VerTravels Platform",
  slug: "vertravels",
  type: "agency",
  primaryColor: "#0ea5e9",
  secondaryColor: "#6366f1",
  contactEmail: "support@vertravels.com",
  contactPhone: "+256 123 456789",
  address: "Kampala, Uganda",
  country: "Uganda",
  currency: "USD",
  timezone: "Africa/Kampala",
  settings: {
    allowBooking: true,
    allowCreditBooking: true,
    requireApproval: false,
    commissionRate: 10,
    paymentTerms: 30,
    autoTicketIssuance: true,
    emailNotifications: true,
  },
  createdAt: "2026-01-01",
  status: "active",
};

export const rolePermissions: Record<UserRole, string[]> = {
  super_admin: ["*"],
  agency_admin: [
    "manage_tenants",
    "manage_users",
    "manage_bookings",
    "manage_inventory",
    "view_reports",
    "manage_settings",
    "manage_finance",
  ],
  manager: [
    "manage_bookings",
    "manage_users",
    "view_reports",
    "manage_inventory",
    "approve_bookings",
  ],
  user: ["create_bookings", "view_own_bookings", "view_inventory"],
  agent: ["create_bookings", "view_own_bookings", "view_commission"],
  corporate_admin: [
    "manage_corporate",
    "create_bookings",
    "approve_bookings",
    "view_corporate_reports",
  ],
  corporate_user: ["create_bookings", "view_own_bookings"],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  const perms = rolePermissions[role];
  return perms.includes("*") || perms.includes(permission);
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    super_admin: "Super Admin",
    agency_admin: "Agency Admin",
    manager: "Manager",
    user: "User",
    agent: "Agent",
    corporate_admin: "Corporate Admin",
    corporate_user: "Corporate User",
  };
  return labels[role];
}

export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    super_admin: "bg-red-100 text-red-700",
    agency_admin: "bg-purple-100 text-purple-700",
    manager: "bg-blue-100 text-blue-700",
    user: "bg-green-100 text-green-700",
    agent: "bg-amber-100 text-amber-700",
    corporate_admin: "bg-indigo-100 text-indigo-700",
    corporate_user: "bg-cyan-100 text-cyan-700",
  };
  return colors[role];
}

export const tenants: Tenant[] = [
  {
    id: "tenant-001",
    name: "Kampala Travel Hub",
    slug: "kampala-travel",
    type: "agency",
    primaryColor: "#0ea5e9",
    secondaryColor: "#8b5cf6",
    contactEmail: "info@kampalatravel.com",
    contactPhone: "+256 701 111111",
    address: "Kampala Road, Uganda",
    country: "Uganda",
    currency: "USD",
    timezone: "Africa/Kampala",
    settings: {
      allowBooking: true,
      allowCreditBooking: true,
      requireApproval: false,
      commissionRate: 12,
      paymentTerms: 30,
      autoTicketIssuance: true,
      emailNotifications: true,
    },
    createdAt: "2026-01-15",
    status: "active",
  },
  {
    id: "tenant-002",
    name: "Safari Tours Uganda",
    slug: "safari-tours",
    type: "agency",
    primaryColor: "#22c55e",
    secondaryColor: "#f59e0b",
    contactEmail: "bookings@safaritours.co.ug",
    contactPhone: "+256 702 222222",
    address: "Jinja Road, Uganda",
    country: "Uganda",
    currency: "USD",
    timezone: "Africa/Kampala",
    settings: {
      allowBooking: true,
      allowCreditBooking: false,
      requireApproval: true,
      commissionRate: 15,
      paymentTerms: 14,
      autoTicketIssuance: false,
      emailNotifications: true,
    },
    createdAt: "2026-02-01",
    status: "active",
  },
  {
    id: "tenant-003",
    name: "Export Uganda Ltd",
    slug: "export-uganda",
    type: "corporate",
    primaryColor: "#ef4444",
    secondaryColor: "#3b82f6",
    contactEmail: "travel@exportug.com",
    contactPhone: "+256 703 333333",
    address: "Industrial Area, Uganda",
    country: "Uganda",
    currency: "USD",
    timezone: "Africa/Kampala",
    settings: {
      allowBooking: true,
      allowCreditBooking: true,
      requireApproval: true,
      commissionRate: 0,
      paymentTerms: 45,
      autoTicketIssuance: true,
      emailNotifications: true,
    },
    createdAt: "2026-03-01",
    status: "active",
  },
];

export const users: User[] = [
  {
    id: "user-001",
    tenantId: "tenant-001",
    email: "admin@kampalatravel.com",
    firstName: "James",
    lastName: "Okello",
    phone: "+256 701 111111",
    role: "agency_admin",
    status: "active",
    permissions: ["manage_bookings", "manage_users", "view_reports"],
    lastLogin: "2026-05-20T10:30:00Z",
    createdAt: "2026-01-15",
  },
  {
    id: "user-002",
    tenantId: "tenant-001",
    email: "manager@kampalatravel.com",
    firstName: "Sarah",
    lastName: "Nakato",
    phone: "+256 701 111112",
    role: "manager",
    status: "active",
    permissions: ["manage_bookings", "view_reports"],
    lastLogin: "2026-05-19T14:20:00Z",
    createdAt: "2026-02-01",
  },
  {
    id: "user-003",
    tenantId: "tenant-001",
    email: "agent@kampalatravel.com",
    firstName: "John",
    lastName: "Moses",
    phone: "+256 701 111113",
    role: "agent",
    status: "active",
    permissions: ["create_bookings", "view_own_bookings"],
    lastLogin: "2026-05-20T09:15:00Z",
    createdAt: "2026-02-15",
  },
  {
    id: "user-004",
    tenantId: "tenant-003",
    email: "travel@exportug.com",
    firstName: "Michael",
    lastName: "Opiyo",
    phone: "+256 703 333333",
    role: "corporate_admin",
    status: "active",
    permissions: ["manage_corporate", "create_bookings", "approve_bookings"],
    lastLogin: "2026-05-18T16:45:00Z",
    createdAt: "2026-03-01",
  },
];

export const corporateAccounts: CorporateAccount[] = [
  {
    id: "corp-001",
    tenantId: "tenant-001",
    companyName: "Export Uganda Ltd",
    companyRegNo: "UG-2020-001234",
    taxId: "TAX-UG-123456",
    billingAddress: "Industrial Area, Kampala, Uganda",
    creditLimit: 50000,
    usedCredit: 12500,
    contacts: [
      {
        id: "contact-001",
        name: "Michael Opiyo",
        email: "travel@exportug.com",
        phone: "+256 703 333333",
        isPrimary: true,
        canBook: true,
        canApprove: true,
      },
      {
        id: "contact-002",
        name: "Grace Atim",
        email: "grace@exportug.com",
        phone: "+256 703 333334",
        isPrimary: false,
        canBook: true,
        canApprove: false,
      },
    ],
    status: "active",
  },
  {
    id: "corp-002",
    tenantId: "tenant-001",
    companyName: "Kampala Corporate Solutions",
    companyRegNo: "UG-2019-005678",
    taxId: "TAX-UG-789012",
    billingAddress: "Downtown Kampala, Uganda",
    creditLimit: 30000,
    usedCredit: 28000,
    contacts: [
      {
        id: "contact-003",
        name: "David Wasswa",
        email: "david@kcscorp.ug",
        phone: "+256 704 444444",
        isPrimary: true,
        canBook: true,
        canApprove: true,
      },
    ],
    status: "active",
  },
];

export function getTenantUsers(tenantId: string): User[] {
  return users.filter((u) => u.tenantId === tenantId);
}

export function getTenantCorporates(tenantId: string): CorporateAccount[] {
  return corporateAccounts.filter((c) => c.tenantId === tenantId);
}

export function getCurrentTenant(): Tenant {
  return defaultTenant;
}
