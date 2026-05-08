# User, Roles & Agency Management System

## Overview

Complete user management system with role-based access control (RBAC) and agency/branch support.

---

## Database Schema

### Migration 0016: User Roles & Agencies

Run this migration first:
```sql
-- File: packages/database/migrations/0016-user-roles-agencies.sql
```

### Tables

#### 1. `user_roles`
Predefined roles with permissions:
- **Super Admin** - Full access to everything
- **Agency Admin** - Manage users, bookings, invoices, quotations
- **Manager** - Read users, manage bookings & quotations
- **Agent** - Create bookings & quotations
- **Accountant** - Manage invoices, receipts, statements

#### 2. `agencies`
Agency/branch offices:
- Hierarchy support (parent_agency_id)
- Commission rates
- Contact information
- Status tracking

#### 3. `user_agency_assignments`
Maps users to agencies with specific roles.

#### 4. `permission_logs`
Audit trail for permission checks.

#### 5. `user_activity_log`
User activity tracking.

---

## Default Roles

| Role | Permissions |
|------|-------------|
| **super_admin** | `{"all": true}` |
| **agency_admin** | Users (R,C,U), Bookings (R,C,U,D), Invoices (R,C,U), Quotations (R,C,U), Reports (R) |
| **manager** | Users (R), Bookings (R,C,U), Invoices (R,C), Quotations (R,C,U), Reports (R) |
| **agent** | Bookings (R,C), Quotations (R,C), Customers (R,C) |
| **accountant** | Invoices (R,C,U), Receipts (R,C), Statements (R,C), Reports (R) |

Legend: R=Read, C=Create, U=Update, D=Delete

---

## Creating Users

### Via Admin Panel

1. Navigate to `/admin/users`
2. Click "New User" button
3. Fill in details:
   - Email (required)
   - Password (required for new users)
   - First Name, Last Name
   - Phone
   - Employee ID
   - Department
   - Role (dropdown)
   - Agency (dropdown)
   - Status (active/suspended/banned)
4. Click "Create User"

### Via SQL

```sql
-- Create user in auth_users
INSERT INTO auth_users (email, password_hash, status)
VALUES ('john@vertravels.com', 'hashed_password', 'active')
RETURNING id;

-- Create profile
INSERT INTO user_profiles (user_id, fname, lname, phone, department, employee_id)
VALUES ('user-uuid', 'John', 'Doe', '+256700123456', 'Sales', 'EMP-001');

-- Assign role
INSERT INTO user_role_assignments (user_id, role_id)
VALUES ('user-uuid', 3); -- 3 = Manager role

-- Assign to agency
INSERT INTO user_agency_assignments (user_id, agency_id, role_in_agency)
VALUES ('user-uuid', 'agency-uuid', 'Sales Agent');
```

---

## Creating Agencies

### Via SQL

```sql
INSERT INTO agencies (
  agency_code,
  agency_name,
  contact_person,
  email,
  phone,
  address,
  city,
  country,
  status,
  commission_rate
) VALUES (
  'AGY-001',
  'VerTravels Kampala',
  'Jane Smith',
  'kampala@vertravels.com',
  '+256 414 123456',
  'Plot 123, Kampala Road',
  'Kampala',
  'Uganda',
  'active',
  10.00
);
```

---

## Checking Permissions

### In Client Components

```typescript
import { createClient } from "@/lib/supabase/client";

async function checkPermission(userId: string, resource: string, action: string) {
  const supabase = createClient();
  
  const { data } = await supabase.rpc('check_user_permission', {
    p_user_id: userId,
    p_resource: resource,
    p_action: action,
  });
  
  return data; // true or false
}

// Usage
const canEditBooking = await checkPermission(userId, 'bookings', 'update');
```

### In Server Components

```typescript
import { createClient } from "@/lib/supabase/server";

async function getUserRole(userId: string) {
  const supabase = createClient();
  
  const { data } = await supabase.rpc('get_user_role', {
    p_user_id: userId,
  });
  
  return data?.[0]; // { role_name, role_slug, permissions }
}
```

---

## Row Level Security (RLS)

### Example Policies

```sql
-- Users can only view their own agency's bookings
CREATE POLICY "Users view own agency bookings"
ON bookings
FOR SELECT
TO authenticated
USING (
  agency_id = (
    SELECT agency_id 
    FROM user_agency_assignments 
    WHERE user_id = auth.uid()
    LIMIT 1
  )
);

-- Admins can view all bookings
CREATE POLICY "Admins view all bookings"
ON bookings
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_role_assignments ura
    JOIN user_roles ur ON ura.role_id = ur.id
    WHERE ura.user_id = auth.uid()
    AND ur.role_slug IN ('super_admin', 'agency_admin')
  )
);
```

---

## Activity Logging

### Log User Action

```typescript
import { createClient } from "@/lib/supabase/client";

async function logActivity(userId: string, action: string, description: string, metadata?: any) {
  const supabase = createClient();
  
  await supabase.from('user_activity_log').insert({
    user_id: userId,
    action,
    description,
    metadata,
    ip_address: await getUserIP(),
    user_agent: navigator.userAgent,
  });
}

// Usage
await logActivity(userId, 'booking_created', 'Created new booking BKG-123', {
  booking_id: 'booking-uuid',
  amount: 1500,
});
```

---

## Users Page Features

### `/admin/users`

- View all users with details
- Filter by status and role
- Search by email/name
- Inline edit form (expandable row)
- Create new users
- Suspend/activate users
- Toggle email verification
- Delete users
- Assign roles
- Assign to agencies

### User Details Displayed

- Email
- Full name
- Phone
- Role (with color badge)
- Agency
- Status (active/suspended/banned)
- Email verification status
- Last login
- Created date

---

## Helper Functions

### Get User's Agency

```sql
SELECT * FROM get_user_agency('user-uuid');
-- Returns: agency_id, agency_name, agency_code, role_in_agency
```

### Get User's Role

```sql
SELECT * FROM get_user_role('user-uuid');
-- Returns: role_name, role_slug, permissions
```

### Check Permission

```sql
SELECT check_user_permission('user-uuid', 'bookings', 'update');
-- Returns: true or false
```

---

## Migration Steps

1. **Run Migration 0016:**
   ```bash
   # In Supabase SQL Editor
   # Copy contents of packages/database/migrations/0016-user-roles-agencies.sql
   ```

2. **Create First Agency Admin:**
   ```sql
   -- Create super admin user
   INSERT INTO auth_users (email, password_hash, status, email_verified)
   VALUES ('admin@vertravels.com', 'hashed_password', 'active', true);
   
   -- Assign super admin role
   INSERT INTO user_role_assignments (user_id, role_id)
   VALUES ('user-uuid', 1); -- 1 = super_admin
   ```

3. **Create Initial Agencies:**
   ```sql
   INSERT INTO agencies (agency_code, agency_name, status)
   VALUES 
     ('HQ-001', 'VerTravels HQ', 'active'),
     ('AGY-001', 'Kampala Branch', 'active'),
     ('AGY-002', 'Entebbe Branch', 'active');
   ```

---

## Security Best Practices

1. **Always hash passwords** before storing
2. **Use RLS policies** on all sensitive tables
3. **Log permission checks** for audit
4. **Implement rate limiting** on auth endpoints
5. **Use HTTPS** for all communications
6. **Enable MFA** for admin accounts
7. **Regular access reviews** - remove inactive users
8. **Principle of least privilege** - give minimum required permissions

---

## Troubleshooting

### User Can't Access Resource

1. Check user's role: `SELECT * FROM get_user_role('user-id');`
2. Check role permissions: `SELECT permissions FROM user_roles WHERE id = role_id;`
3. Check RLS policies on the table
4. Check permission logs: `SELECT * FROM permission_logs WHERE user_id = 'user-id' ORDER BY created_at DESC LIMIT 10;`

### User Not Showing in List

1. Check user status: `SELECT status FROM auth_users WHERE id = 'user-id';`
2. Check if user is in correct agency
3. Check RLS policies

---

## API Integration

### Create User Endpoint

```typescript
// apps/admin/app/api/users/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('auth_users')
    .insert({
      email: body.email,
      password_hash: await hashPassword(body.password),
      status: body.status || 'active',
    })
    .select('id')
    .single();
    
  return Response.json({ data, error });
}
```

---

## Next Steps

1. Run migration 0016
2. Create initial admin user
3. Create agencies
4. Test user creation
5. Test role assignment
6. Test permission checking
7. Add more RLS policies as needed
