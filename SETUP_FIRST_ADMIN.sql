-- ========================================
-- SETUP SCRIPT: Create First Admin User
-- Run this in Supabase SQL Editor
-- ========================================

-- Step 1: Create the admin user
-- This will return the user ID
INSERT INTO auth_users (email, password_hash, status, email_verified)
VALUES (
  'admin@vertravels.com',
  '$2a$10$YourHashedPasswordHere', -- Replace with actual hashed password
  'active',
  true
)
RETURNING id;

-- Step 2: Copy the UUID from above and use it here
-- Replace 'YOUR-USER-ID-HERE' with the actual UUID
INSERT INTO user_role_assignments (user_id, role_id)
VALUES ('YOUR-USER-ID-HERE', 1); -- 1 = super_admin role

-- ========================================
-- ALTERNATIVE: All-in-One with CTE
-- ========================================

WITH new_user AS (
  INSERT INTO auth_users (email, password_hash, status, email_verified)
  VALUES (
    'admin@vertravels.com',
    '$2a$10$YourHashedPasswordHere',
    'active',
    true
  )
  RETURNING id
)
INSERT INTO user_role_assignments (user_id, role_id)
SELECT id, 1 FROM new_user;

-- ========================================
-- CREATE AGENCY
-- ========================================

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
  'HQ-001',
  'VerTravels HQ',
  'Admin User',
  'admin@vertravels.com',
  '+256 414 123456',
  'Plot 123, Kampala Road',
  'Kampala',
  'Uganda',
  'active',
  0.00
);

-- ========================================
-- ASSIGN USER TO AGENCY (Optional)
-- ========================================

-- After creating user and agency, assign them:
WITH new_user AS (
  INSERT INTO auth_users (email, password_hash, status, email_verified)
  VALUES (
    'john@vertravels.com',
    '$2a$10$YourHashedPasswordHere',
    'active',
    true
  )
  RETURNING id
),
agency AS (
  SELECT id FROM agencies WHERE agency_code = 'HQ-001' LIMIT 1
)
INSERT INTO user_agency_assignments (user_id, agency_id, role_in_agency)
SELECT nu.id, a.id, 'Manager'
FROM new_user nu, agency a;

-- ========================================
-- QUICK START: Complete Setup
-- ========================================

-- Run migration 0016 first, then this:

-- 1. Create Super Admin
WITH admin_user AS (
  INSERT INTO auth_users (email, password_hash, status, email_verified, created_at)
  VALUES (
    'admin@vertravels.com',
    '$2a$10$YourHashedPasswordHere', -- CHANGE THIS!
    'active',
    true,
    NOW()
  )
  RETURNING id
)
INSERT INTO user_role_assignments (user_id, role_id)
SELECT id, 1 FROM admin_user;

-- 2. Create Head Office Agency
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
  created_at
) VALUES (
  'HQ-001',
  'VerTravels Headquarters',
  'System Admin',
  'admin@vertravels.com',
  '+256 414 123456',
  'Plot 123, Kampala Road',
  'Kampala',
  'Uganda',
  'active',
  NOW()
);

-- 3. Create sample branch agencies
INSERT INTO agencies (agency_code, agency_name, city, country, status) VALUES
  ('AGY-001', 'Entebbe Branch', 'Entebbe', 'Uganda', 'active'),
  ('AGY-002', 'Gulu Branch', 'Gulu', 'Uganda', 'active'),
  ('AGY-003', 'Mbarara Branch', 'Mbarara', 'Uganda', 'active');

-- 4. Verify setup
SELECT 
  au.email,
  au.status,
  ur.role_name,
  a.agency_name
FROM auth_users au
LEFT JOIN user_role_assignments ura ON au.id = ura.user_id
LEFT JOIN user_roles ur ON ura.role_id = ur.id
LEFT JOIN user_profiles up ON au.id = up.user_id
LEFT JOIN agencies a ON up.agency_id = a.id
WHERE au.email = 'admin@vertravels.com';
