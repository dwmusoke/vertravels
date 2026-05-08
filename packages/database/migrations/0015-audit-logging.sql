-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0015: Audit Logging System
-- PostgreSQL (Supabase)
-- ========================================

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(100) NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    user_id UUID REFERENCES auth.users(id),
    user_email VARCHAR(255),
    changes JSONB,
    old_values JSONB,
    new_values JSONB,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_changes ON audit_logs USING GIN(changes);

-- Comments
COMMENT ON TABLE audit_logs IS 'Audit trail for all data changes across the system';
COMMENT ON COLUMN audit_logs.changes IS 'Field-level changes: {field: {old, new}}';
COMMENT ON COLUMN audit_logs.old_values IS 'Complete old record state (for DELETE)';
COMMENT ON COLUMN audit_logs.new_values IS 'Complete new record state (for INSERT)';

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read audit logs
CREATE POLICY "Authenticated users can view audit logs"
    ON audit_logs
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow system to insert audit logs (via service role)
CREATE POLICY "System can insert audit logs"
    ON audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Function to get audit log for a specific record
CREATE OR REPLACE FUNCTION get_record_audit_log(p_table_name VARCHAR, p_record_id UUID)
RETURNS TABLE (
    id UUID,
    action VARCHAR,
    user_email VARCHAR,
    changes JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.id,
        al.action,
        al.user_email,
        al.changes,
        al.created_at
    FROM audit_logs al
    WHERE al.table_name = p_table_name 
      AND al.record_id = p_record_id::VARCHAR
    ORDER BY al.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
