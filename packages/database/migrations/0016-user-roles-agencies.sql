-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0016: User Roles & Agency Management
-- Enhanced roles, agencies, and permissions
-- ========================================

-- ========================================
-- 1. ENHANCED ROLES & PERMISSIONS
-- ========================================

-- Insert default roles if not exists
INSERT INTO user_roles (role_name, role_slug, permissions) VALUES
('Super Admin', 'super_admin', '{"all": true}'::jsonb),
('Agency Admin', 'agency_admin', '{"users": ["read", "create", "update"], "bookings": ["read", "create", "update", "delete"], "invoices": ["read", "create", "update"], "quotations": ["read", "create", "update"], "reports": ["read"]}'::jsonb),
('Manager', 'manager', '{"users": ["read"], "bookings": ["read", "create", "update"], "invoices": ["read", "create"], "quotations": ["read", "create", "update"], "reports": ["read"]}'::jsonb),
('Agent', 'agent', '{"bookings": ["read", "create"], "quotations": ["read", "create"], "customers": ["read", "create"]}'::jsonb),
('Accountant', 'accountant', '{"invoices": ["read", "create", "update"], "receipts": ["read", "create"], "statements": ["read", "create"], "reports": ["read"]}'::jsonb)
ON CONFLICT (role_slug) DO UPDATE SET
  role_name = EXCLUDED.role_name,
  permissions = EXCLUDED.permissions;

-- ========================================
-- 2. AGENCY/BRANCH MANAGEMENT
-- ========================================

-- Agencies table
CREATE TABLE IF NOT EXISTS agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_code VARCHAR(20) UNIQUE,
    agency_name VARCHAR(100) NOT NULL,
    parent_agency_id UUID REFERENCES agencies(id),
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    commission_rate DECIMAL(5,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-Agency assignments
CREATE TABLE IF NOT EXISTS user_agency_assignments (
    user_id UUID REFERENCES auth_users(id) ON DELETE CASCADE,
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    role_in_agency VARCHAR(50),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES auth_users(id),
    PRIMARY KEY (user_id, agency_id)
);

-- ========================================
-- 3. ENHANCED USER PROFILES
-- ========================================

-- Add agency_id to user_profiles if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'agency_id'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN agency_id UUID REFERENCES agencies(id);
    END IF;
END $$;

-- Add employee_id to user_profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'employee_id'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN employee_id VARCHAR(50);
    END IF;
END $$;

-- Add department to user_profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'department'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN department VARCHAR(100);
    END IF;
END $$;

-- ========================================
-- 4. PERMISSIONS LOGGING
-- ========================================

-- Permission usage log
CREATE TABLE IF NOT EXISTS permission_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth_users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id UUID,
    allowed BOOLEAN NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_permission_logs_user ON permission_logs(user_id);
CREATE INDEX idx_permission_logs_action ON permission_logs(action);
CREATE INDEX idx_permission_logs_created ON permission_logs(created_at);

-- ========================================
-- 5. ACTIVITY LOG
-- ========================================

-- User activity log
CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth_users(id),
    action VARCHAR(100) NOT NULL,
    description TEXT,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_activity_user ON user_activity_log(user_id);
CREATE INDEX idx_user_activity_action ON user_activity_log(action);
CREATE INDEX idx_user_activity_created ON user_activity_log(created_at DESC);

-- ========================================
-- 6. HELPER FUNCTIONS
-- ========================================

-- Function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(
    p_user_id UUID,
    p_resource VARCHAR,
    p_action VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
    v_permissions JSONB;
    v_has_permission BOOLEAN;
BEGIN
    -- Get user permissions from role
    SELECT COALESCE(ur.permissions, '{}'::jsonb)
    INTO v_permissions
    FROM user_role_assignments ura
    JOIN user_roles ur ON ura.role_id = ur.id
    WHERE ura.user_id = p_user_id
    LIMIT 1;
    
    -- Check if user has super admin role
    IF v_permissions->>'all' = 'true' THEN
        RETURN TRUE;
    END IF;
    
    -- Check specific permission
    v_has_permission := COALESCE(
        (v_permissions->p_resource)->>p_action IS NOT NULL,
        FALSE
    );
    
    RETURN v_has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's primary role
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID)
RETURNS TABLE (
    role_name VARCHAR,
    role_slug VARCHAR,
    permissions JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT ur.role_name, ur.role_slug, ur.permissions
    FROM user_role_assignments ura
    JOIN user_roles ur ON ura.role_id = ur.id
    WHERE ura.user_id = p_user_id
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's agency
CREATE OR REPLACE FUNCTION get_user_agency(p_user_id UUID)
RETURNS TABLE (
    agency_id UUID,
    agency_name VARCHAR,
    agency_code VARCHAR,
    role_in_agency VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT a.id, a.agency_name, a.agency_code, uaa.role_in_agency
    FROM user_agency_assignments uaa
    JOIN agencies a ON uaa.agency_id = a.id
    WHERE uaa.user_id = p_user_id
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 7. RLS POLICIES
-- ========================================

-- Enable RLS on agencies
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can view active agencies
CREATE POLICY "Users can view active agencies"
    ON agencies
    FOR SELECT
    TO authenticated
    USING (status = 'active');

-- Policy: Only admins can modify agencies
CREATE POLICY "Admins can manage agencies"
    ON agencies
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN user_roles ur ON ura.role_id = ur.id
            WHERE ura.user_id = auth.uid()
            AND ur.role_slug IN ('super_admin', 'agency_admin')
        )
    );

-- Enable RLS on user_activity_log
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own activity
CREATE POLICY "Users can view own activity"
    ON user_activity_log
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Policy: Admins can view all activity
CREATE POLICY "Admins can view all activity"
    ON user_activity_log
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

-- ========================================
-- 8. COMMENTS
-- ========================================

COMMENT ON TABLE agencies IS 'Agency/branch offices with hierarchy support';
COMMENT ON TABLE user_agency_assignments IS 'Maps users to their assigned agencies';
COMMENT ON TABLE permission_logs IS 'Logs permission checks for audit';
COMMENT ON TABLE user_activity_log IS 'User activity tracking';
COMMENT ON FUNCTION check_user_permission IS 'Check if user has permission for action';
COMMENT ON FUNCTION get_user_role IS 'Get user primary role';
COMMENT ON FUNCTION get_user_agency IS 'Get user assigned agency';
