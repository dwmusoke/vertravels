-- ========================================
-- VERTRAVELS SEED DATA
-- Migration 0010: Initial Data
-- PostgreSQL (Supabase)
-- ========================================

-- ========================================
-- CURRENCIES
-- ========================================

INSERT INTO currencies (name, code, symbol, rate, country_iso, status, "default") VALUES
('US Dollar', 'USD', '$', 1.0, 'US', true, true),
('Euro', 'EUR', '€', 0.92, 'EU', true, false),
('British Pound', 'GBP', '£', 0.79, 'GB', true, false),
('Canadian Dollar', 'CAD', 'C$', 1.36, 'CA', true, false),
('Australian Dollar', 'AUD', 'A$', 1.52, 'AU', true, false),
('Japanese Yen', 'JPY', '¥', 150.0, 'JP', true, false),
('Chinese Yuan', 'CNY', '¥', 7.24, 'CN', true, false),
('Indian Rupee', 'INR', '₹', 83.12, 'IN', true, false),
('UAE Dirham', 'AED', 'د.إ', 3.67, 'AE', true, false),
('Saudi Riyal', 'SAR', '﷼', 3.75, 'SA', true, false),
('Nigerian Naira', 'NGN', '₦', 907.5, 'NG', true, false),
('South African Rand', 'ZAR', 'R', 18.95, 'ZA', true, false),
('Kenyan Shilling', 'KES', 'KSh', 157.5, 'KE', true, false),
('Brazilian Real', 'BRL', 'R$', 4.97, 'BR', true, false),
('Mexican Peso', 'MXN', '$', 17.15, 'MX', true, false),
('Swiss Franc', 'CHF', 'Fr', 0.88, 'CH', true, false),
('Singapore Dollar', 'SGD', 'S$', 1.34, 'SG', true, false),
('Turkish Lira', 'TRY', '₺', 32.15, 'TR', true, false),
('Russian Ruble', 'RUB', '₽', 92.5, 'RU', true, false),
('Thai Baht', 'THB', '฿', 35.75, 'TH', true, false);

-- ========================================
-- LANGUAGES
-- ========================================

INSERT INTO languages (name, code, native_name, flag_emoji, direction, status, "default") VALUES
('English', 'en', 'English', '🇺🇸', 'ltr', true, true),
('Arabic', 'ar', 'العربية', '🇸🇦', 'rtl', true, false),
('Spanish', 'es', 'Español', '🇪🇸', 'ltr', true, false),
('French', 'fr', 'Français', '🇫🇷', 'ltr', true, false),
('German', 'de', 'Deutsch', '🇩🇪', 'ltr', true, false),
('Italian', 'it', 'Italiano', '🇮🇹', 'ltr', true, false),
('Portuguese', 'pt', 'Português', '🇵🇹', 'ltr', true, false),
('Chinese', 'zh', '中文', '🇨🇳', 'ltr', true, false),
('Japanese', 'ja', '日本語', '🇯🇵', 'ltr', true, false),
('Russian', 'ru', 'Русский', '🇷🇺', 'ltr', true, false),
('Turkish', 'tr', 'Türkçe', '🇹🇷', 'ltr', true, false),
('Dutch', 'nl', 'Nederlands', '🇳🇱', 'ltr', true, false);

-- ========================================
-- MODULES
-- ========================================

INSERT INTO modules (name, slug, type, active, status, module_color, icon, "order") VALUES
('Flights', 'flights', 'flights', true, true, '#3B82F6', 'plane', 1),
('Hotels', 'hotels', 'hotels', true, true, '#10B981', 'hotel', 2),
('Tours', 'tours', 'tours', true, true, '#F59E0B', 'map', 3),
('Cars', 'cars', 'cars', true, true, '#8B5CF6', 'car', 4),
('Visa', 'visa', 'visa', true, true, '#EC4899', 'passport', 5),
('Blogs', 'blogs', 'extra', true, true, '#06B6D4', 'book', 6);

-- ========================================
-- PAYMENT GATEWAYS
-- ========================================

INSERT INTO payment_gateways (name, slug, c1, c2, c3, c4, c5, dev_mode, status, "default", "order") VALUES
('Stripe', 'stripe', 
 'pk_test_stripe_public_key', 
 'sk_test_stripe_secret_key', 
 'test_card_4242424242424242', 
 '12/34 - 123', 
 'Any future date', 
 true, true, false, 1),

('PayPal', 'paypal', 
 'paypal_client_id', 
 'paypal_secret', 
 'sb-test-facilitator@email.com', 
 'test_password', 
 NULL, 
 true, true, false, 2),

('Flutterwave', 'flutterwave', 
 'FLWPUBK_TEST-flutterwave_public_key', 
 'FLWSECK_TEST-flutterwave_secret_key', 
 'FLW_ENCRYPTION_KEY', 
 NULL, 
 NULL, 
 true, true, false, 3),

('Bank Transfer', 'bank-transfer', 
 'Account Holder: VerTravels Ltd', 
 'Bank: First Bank', 
 'Account: 1234567890', 
 'IBAN: NG123456789', 
 'Sort Code: 123456', 
 false, true, false, 4),

('Pay Later', 'pay-later', 
 NULL, NULL, NULL, NULL, NULL, 
 false, true, false, 5),

('Wallet Balance', 'wallet-balance', 
 NULL, NULL, NULL, NULL, NULL, 
 false, true, false, 6);

-- ========================================
-- USER ROLES
-- ========================================

INSERT INTO user_roles (role_name, role_slug, permissions) VALUES
('Super Admin', 'super_admin', '{"all": true}'),
('Admin', 'admin', '{"dashboard": true, "bookings": true, "users": true, "modules": true, "settings": true}'),
('Manager', 'manager', '{"dashboard": true, "bookings": true, "users": false, "modules": false, "settings": false}'),
('Agent', 'agent', '{"dashboard": true, "bookings": true, "users": false, "modules": false, "settings": false}'),
('Customer', 'customer', '{"bookings": "own", "profile": true}');

-- ========================================
-- CMS PAGES
-- ========================================

INSERT INTO cms (page_name, page_slug, page_content, meta_title, meta_description, status, show_in_footer) VALUES
('About Us', 'about-us', 
 '<h1>About VerTravels</h1><p>VerTravels is your trusted travel companion, offering the best deals on flights, hotels, tours, car rentals, and visa services worldwide.</p>',
 'About VerTravels - Your Travel Partner',
 'Learn more about VerTravels and our mission to make travel accessible to everyone.',
 true, true),

('Terms of Service', 'terms-of-service',
 '<h1>Terms of Service</h1><p>Please read these terms carefully before using our services.</p>',
 'Terms of Service - VerTravels',
 'Terms and conditions for using VerTravels services.',
 true, true),

('Privacy Policy', 'privacy-policy',
 '<h1>Privacy Policy</h1><p>We respect your privacy and are committed to protecting your personal information.</p>',
 'Privacy Policy - VerTravels',
 'Our privacy policy and how we handle your data.',
 true, true),

('Contact Us', 'contact-us',
 '<h1>Contact Us</h1><p>Get in touch with our support team.</p><p>Email: support@vertravels.com</p><p>Phone: +1-800-VERTRAVELS</p>',
 'Contact Us - VerTravels Support',
 'Contact VerTravels customer support.',
 true, true);

-- ========================================
-- BLOG CATEGORIES
-- ========================================

INSERT INTO blog_categories (cat_name, cat_slug, "order") VALUES
('Travel Tips', 'travel-tips', 1),
('Destinations', 'destinations', 2),
('Food & Dining', 'food-dining', 3),
('Adventure', 'adventure', 4),
('Culture', 'culture', 5),
('Budget Travel', 'budget-travel', 6);

-- ========================================
-- EMAIL TEMPLATES
-- ========================================

INSERT INTO email_templates (template_name, template_slug, subject, body_html, variables, status, language) VALUES
('Booking Confirmation', 'booking-confirmation', 
 'Booking Confirmation - {{booking_ref}}',
 '<html><body><h1>Booking Confirmed!</h1><p>Dear {{customer_name}},</p><p>Your booking {{booking_ref}} has been confirmed.</p></body></html>',
 '[{"name": "customer_name", "description": "Customer name"}, {"name": "booking_ref", "description": "Booking reference"}, {"name": "booking_details", "description": "Booking details"}]',
 true, 'en'),

('Payment Received', 'payment-received',
 'Payment Received - {{amount}}',
 '<html><body><h1>Payment Received</h1><p>Thank you for your payment of {{amount}}.</p></body></html>',
 '[{"name": "amount", "description": "Payment amount"}, {"name": "transaction_id", "description": "Transaction ID"}]',
 true, 'en'),

('Password Reset', 'password-reset',
 'Reset Your Password',
 '<html><body><h1>Password Reset Request</h1><p>Click the link to reset your password: {{reset_link}}</p></body></html>',
 '[{"name": "reset_link", "description": "Password reset link"}]',
 true, 'en'),

('Welcome Email', 'welcome-email',
 'Welcome to VerTravels!',
 '<html><body><h1>Welcome!</h1><p>Thank you for joining VerTravels. Start exploring amazing travel deals.</p></body></html>',
 '[{"name": "customer_name", "description": "Customer name"}]',
 true, 'en');

-- ========================================
-- SETTINGS
-- ========================================

INSERT INTO settings (setting_key, setting_value, setting_type) VALUES
('site_name', '{"en": "VerTravels", "ar": "فيرترافيلز"}', 'json'),
('site_url', '{"value": "https://vertravels.com"}', 'json'),
('admin_url', '{"value": "https://admin.vertravels.com"}', 'json'),
('contact_email', '{"value": "support@vertravels.com"}', 'json'),
('contact_phone', '{"value": "+1-800-VERTRAVELS"}', 'json'),
('social_media', '{"facebook": "https://facebook.com/vertravels", "twitter": "https://twitter.com/vertravels", "instagram": "https://instagram.com/vertravels"}', 'json'),
('default_currency', '{"code": "USD"}', 'json'),
('default_language', '{"code": "en"}', 'json'),
('booking_settings', '{"auto_confirm": true, "send_email": true, "send_sms": false}', 'json'),
('payment_settings', '{"enable_wallet": true, "enable_partial_payment": false}', 'json');

-- ========================================
-- AIRLINES (Sample Data)
-- ========================================

INSERT INTO flights_airlines (code, name, country, status) VALUES
('AA', 'American Airlines', 'United States', true),
('DL', 'Delta Air Lines', 'United States', true),
('UA', 'United Airlines', 'United States', true),
('BA', 'British Airways', 'United Kingdom', true),
('LH', 'Lufthansa', 'Germany', true),
('AF', 'Air France', 'France', true),
('EK', 'Emirates', 'United Arab Emirates', true),
('QR', 'Qatar Airways', 'Qatar', true),
('SQ', 'Singapore Airlines', 'Singapore', true),
('TK', 'Turkish Airlines', 'Turkey', true);

-- ========================================
-- AIRPORTS (Sample Data - Major Airports)
-- ========================================

INSERT INTO flights_airports (code, name, city, country, country_code, latitude, longitude, status) VALUES
('JFK', 'John F. Kennedy International Airport', 'New York', 'United States', 'US', 40.6413, -73.7781, true),
('LAX', 'Los Angeles International Airport', 'Los Angeles', 'United States', 'US', 33.9416, -118.4085, true),
('LHR', 'Heathrow Airport', 'London', 'United Kingdom', 'GB', 51.4700, -0.4543, true),
('DXB', 'Dubai International Airport', 'Dubai', 'United Arab Emirates', 'AE', 25.2532, 55.3657, true),
('CDG', 'Charles de Gaulle Airport', 'Paris', 'France', 'FR', 49.0097, 2.5479, true),
('FRA', 'Frankfurt Airport', 'Frankfurt', 'Germany', 'DE', 50.0379, 8.5622, true),
('SIN', 'Singapore Changi Airport', 'Singapore', 'Singapore', 'SG', 1.3644, 103.9915, true),
('HND', 'Haneda Airport', 'Tokyo', 'Japan', 'JP', 35.5494, 139.7798, true),
('IST', 'Istanbul Airport', 'Istanbul', 'Turkey', 'TR', 41.2753, 28.7519, true),
('DOH', 'Hamad International Airport', 'Doha', 'Qatar', 'QA', 25.2731, 51.6080, true);

-- ========================================
-- LOCATIONS (Sample Cities)
-- ========================================

INSERT INTO locations (city, city_slug, country, status, "order") VALUES
('Paris', 'paris', 'France', true, 1),
('London', 'london', 'United Kingdom', true, 2),
('New York', 'new-york', 'United States', true, 3),
('Dubai', 'dubai', 'United Arab Emirates', true, 4),
('Tokyo', 'tokyo', 'Japan', true, 5),
('Singapore', 'singapore', 'Singapore', true, 6),
('Barcelona', 'barcelona', 'Spain', true, 7),
('Rome', 'rome', 'Italy', true, 8),
('Bangkok', 'bangkok', 'Thailand', true, 9),
('Istanbul', 'istanbul', 'Turkey', true, 10);

-- ========================================
-- HOTEL SUGGESTIONS
-- ========================================

INSERT INTO hotels_suggestions (city, status, "order") VALUES
('Paris', true, 1),
('London', true, 2),
('New York', true, 3),
('Dubai', true, 4),
('Tokyo', true, 5),
('Singapore', true, 6),
('Barcelona', true, 7),
('Rome', true, 8),
('Bangkok', true, 9),
('Istanbul', true, 10);

-- ========================================
-- TOUR SUGGESTIONS
-- ========================================

INSERT INTO tours_suggestions (city, status, "order") VALUES
('Paris', true, 1),
('London', true, 2),
('Rome', true, 3),
('Barcelona', true, 4),
('Tokyo', true, 5),
('Bangkok', true, 6),
('Istanbul', true, 7),
('Dubai', true, 8),
('New York', true, 9),
('Singapore', true, 10);

-- ========================================
-- CAR SUGGESTIONS
-- ========================================

INSERT INTO cars_suggestions (city_airport, status, "order") VALUES
('JFK', true, 1),
('LAX', true, 2),
('LHR', true, 3),
('DXB', true, 4),
('CDG', true, 5),
('FRA', true, 6),
('SIN', true, 7),
('HND', true, 8),
('IST', true, 9),
('DOH', true, 10);

-- ========================================
-- SAMPLE ADMIN USER
-- ========================================

-- Note: This is a sample. In production, create users through the application with proper password hashing.
-- Password: admin123 (hashed with bcrypt)
INSERT INTO backend_users (email, password_hash, fname, lname, status) VALUES
('admin@vertravels.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS3MebAJu', 'VerTravels', 'Admin', 'active');

-- ========================================
-- API PERMISSIONS
-- ========================================

INSERT INTO api_permissions (permission_name, module, action, description) VALUES
('flights.read', 'flights', 'read', 'Read flight data'),
('flights.write', 'flights', 'write', 'Create/update flights'),
('flights.delete', 'flights', 'delete', 'Delete flights'),
('hotels.read', 'hotels', 'read', 'Read hotel data'),
('hotels.write', 'hotels', 'write', 'Create/update hotels'),
('hotels.delete', 'hotels', 'delete', 'Delete hotels'),
('tours.read', 'tours', 'read', 'Read tour data'),
('tours.write', 'tours', 'write', 'Create/update tours'),
('tours.delete', 'tours', 'delete', 'Delete tours'),
('cars.read', 'cars', 'read', 'Read car rental data'),
('cars.write', 'cars', 'write', 'Create/update car rentals'),
('cars.delete', 'cars', 'delete', 'Delete car rentals'),
('visa.read', 'visa', 'read', 'Read visa data'),
('visa.write', 'visa', 'write', 'Create/update visa applications'),
('bookings.read', 'bookings', 'read', 'Read bookings'),
('bookings.write', 'bookings', 'write', 'Create/update bookings'),
('bookings.delete', 'bookings', 'delete', 'Cancel bookings'),
('users.read', 'users', 'read', 'Read user data'),
('users.write', 'users', 'write', 'Create/update users');

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE currencies IS 'Seeded with 20 major world currencies';
COMMENT ON TABLE languages IS 'Seeded with 12 supported languages';
COMMENT ON TABLE modules IS 'Seeded with 6 core modules';
COMMENT ON TABLE payment_gateways IS 'Seeded with 6 payment gateways including Flutterwave';
COMMENT ON TABLE user_roles IS 'Seeded with 5 user roles';
COMMENT ON TABLE cms IS 'Seeded with 4 essential pages';
COMMENT ON TABLE blog_categories IS 'Seeded with 6 blog categories';
COMMENT ON TABLE email_templates IS 'Seeded with 4 essential email templates';
COMMENT ON TABLE flights_airlines IS 'Seeded with 10 major airlines';
COMMENT ON TABLE flights_airports IS 'Seeded with 10 major international airports';
COMMENT ON TABLE locations IS 'Seeded with 10 popular destinations';
