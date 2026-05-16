-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0026: Clients CRM + Contact Inquiries
-- ========================================

-- Clients / CRM table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_code VARCHAR(20) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(200),
    job_title VARCHAR(100),
    location VARCHAR(200),
    country VARCHAR(100),
    source VARCHAR(50) DEFAULT 'direct',
    status VARCHAR(20) DEFAULT 'active',
    tags TEXT[],
    notes TEXT,
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(14,2) DEFAULT 0,
    last_booking_date TIMESTAMP WITH TIME ZONE,
    assigned_agency_id UUID REFERENCES agencies(id),
    assigned_user_id UUID REFERENCES auth_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact inquiries (website form submissions)
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    source VARCHAR(50) DEFAULT 'website',
    status VARCHAR(20) DEFAULT 'new',
    assigned_to UUID REFERENCES auth_users(id),
    reply_message TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    replied_by UUID REFERENCES auth_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries DISABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_agency ON clients(assigned_agency_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON contact_inquiries(email);
