-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0008: API Management & Translations
-- PostgreSQL (Supabase)
-- ========================================

-- ========================================
-- 10. API MANAGEMENT
-- ========================================

-- API keys
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    api_secret VARCHAR(255),
    user_id UUID REFERENCES backend_users(id),
    permissions JSONB DEFAULT '{}', -- {flights: {read: true, write: false}, ...}
    rate_limit INTEGER DEFAULT 1000, -- requests per hour
    rate_limit_remaining INTEGER DEFAULT 1000,
    rate_limit_reset TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API logs
CREATE TABLE api_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES api_keys(id),
    endpoint VARCHAR(255),
    method VARCHAR(10), -- GET, POST, PUT, DELETE
    request_body JSONB,
    response_status INTEGER,
    response_body JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API permissions
CREATE TABLE api_permissions (
    id SERIAL PRIMARY KEY,
    permission_name VARCHAR(100) UNIQUE NOT NULL,
    module VARCHAR(50), -- flights, hotels, tours, cars, visa, bookings, payments
    action VARCHAR(20), -- read, write, delete
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limits history
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES api_keys(id),
    endpoint VARCHAR(255),
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    window_end TIMESTAMP WITH TIME ZONE,
    UNIQUE(api_key_id, endpoint, window_start)
);

-- ========================================
-- 11. TRANSLATIONS & LOCALIZATION
-- ========================================

-- Translation keys
CREATE TABLE translation_keys (
    id SERIAL PRIMARY KEY,
    key_name VARCHAR(255) UNIQUE NOT NULL,
    module VARCHAR(50), -- frontend, admin, flights, hotels, tours, cars, visa, payment, common
    context VARCHAR(100), -- button, label, error, success, etc.
    default_value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Translations
CREATE TABLE translations (
    id SERIAL PRIMARY KEY,
    translation_key_id INTEGER REFERENCES translation_keys(id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES languages(id),
    translation_value TEXT NOT NULL,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(translation_key_id, language_id)
);

-- Translation parameters (for dynamic values)
CREATE TABLE translation_params (
    id SERIAL PRIMARY KEY,
    param_key VARCHAR(255) UNIQUE NOT NULL,
    param_type VARCHAR(50), -- string, number, boolean, json
    default_value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 12. EMAIL & NOTIFICATIONS
-- ========================================

-- Email settings
CREATE TABLE email_settings (
    id SERIAL PRIMARY KEY,
    email_driver VARCHAR(50) DEFAULT 'smtp', -- smtp, sendgrid, ses, resend
    email_host VARCHAR(255),
    email_port INTEGER DEFAULT 587,
    email_username VARCHAR(255),
    email_password VARCHAR(255),
    email_encryption VARCHAR(20) DEFAULT 'tls',
    email_from_name VARCHAR(255),
    email_from_email VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email templates
CREATE TABLE email_templates (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(100) UNIQUE NOT NULL,
    template_slug VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255),
    body_html TEXT,
    body_text TEXT,
    variables JSONB, -- [{name: "user_name", description: "User's first name"}, ...]
    status BOOLEAN DEFAULT true,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 13. LOGS & AUDIT
-- ========================================

-- System logs
CREATE TABLE logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_ip VARCHAR(50),
    type VARCHAR(100), -- login, logout, booking, payment, admin_action, etc.
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit trail
CREATE TABLE audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100),
    record_id UUID,
    action VARCHAR(20), -- insert, update, delete
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    user_email VARCHAR(255),
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Error logs
CREATE TABLE error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_type VARCHAR(100),
    error_message TEXT,
    stack_trace TEXT,
    url VARCHAR(500),
    user_id UUID,
    user_agent TEXT,
    ip_address VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================

CREATE INDEX idx_api_keys_key ON api_keys(api_key);
CREATE INDEX idx_api_keys_status ON api_keys(status);
CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_logs_key ON api_logs(api_key_id);
CREATE INDEX idx_api_logs_created ON api_logs(created_at);
CREATE INDEX idx_api_logs_endpoint ON api_logs(endpoint);
CREATE INDEX idx_api_permissions_module ON api_permissions(module);

CREATE INDEX idx_translation_keys_name ON translation_keys(key_name);
CREATE INDEX idx_translation_keys_module ON translation_keys(module);
CREATE INDEX idx_translations_key ON translations(translation_key_id);
CREATE INDEX idx_translations_lang ON translations(language_id);

CREATE INDEX idx_logs_type ON logs(type);
CREATE INDEX idx_logs_created ON logs(created_at);
CREATE INDEX idx_audit_trail_table ON audit_trail(table_name);
CREATE INDEX idx_audit_trail_created ON audit_trail(created_at);
CREATE INDEX idx_error_logs_type ON error_logs(error_type);
CREATE INDEX idx_error_logs_created ON error_logs(created_at);

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE api_keys IS 'API keys for third-party integrations';
COMMENT ON TABLE api_logs IS 'API request/response logs';
COMMENT ON TABLE api_permissions IS 'Available API permissions';
COMMENT ON TABLE rate_limits IS 'API rate limit tracking';
COMMENT ON TABLE translation_keys IS 'Translation key definitions';
COMMENT ON TABLE translations IS 'Translated text by language';
COMMENT ON TABLE translation_params IS 'Dynamic translation parameters';
COMMENT ON TABLE email_settings IS 'Email service configuration';
COMMENT ON TABLE email_templates IS 'Email template library';
COMMENT ON TABLE logs IS 'System activity logs';
COMMENT ON TABLE audit_trail IS 'Database change audit trail';
COMMENT ON TABLE error_logs IS 'Application error logs';
