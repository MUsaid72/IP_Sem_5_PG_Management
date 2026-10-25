name-- =====================================================================
-- Hostel & PG Management System ("StayEase")
-- Complete MySQL Database Schema and Seed Data
-- =====================================================================

CREATE DATABASE IF NOT EXISTS hostel_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hostel_management;

-- 1. Owners Table
CREATE TABLE IF NOT EXISTS owners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    hostel_name VARCHAR(255),
    address VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    college_or_company VARCHAR(255),
    assigned_room_id INT NULL,
    assigned_room_number VARCHAR(50) NULL,
    monthly_rent DOUBLE DEFAULT 0.0,
    rent_status VARCHAR(20) DEFAULT 'DUE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL UNIQUE,
    room_type VARCHAR(100) NOT NULL,
    rent_amount DOUBLE NOT NULL,
    security_deposit DOUBLE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    amenities VARCHAR(1000),
    description VARCHAR(2000),
    image_url VARCHAR(1000),
    owner_id INT NOT NULL DEFAULT 1,
    current_tenant_id INT NULL,
    current_tenant_name VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Tenant Applications Table
CREATE TABLE IF NOT EXISTS tenant_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    tenant_name VARCHAR(255),
    tenant_email VARCHAR(255),
    tenant_phone VARCHAR(50),
    room_id INT NOT NULL,
    room_number VARCHAR(50),
    rent_amount DOUBLE NOT NULL,
    message VARCHAR(1000),
    status VARCHAR(30) DEFAULT 'PENDING',
    application_date VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Rent Payments Table
CREATE TABLE IF NOT EXISTS rent_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    tenant_name VARCHAR(255),
    room_id INT NOT NULL,
    room_number VARCHAR(50),
    amount DOUBLE NOT NULL,
    month VARCHAR(50),
    payment_date VARCHAR(50),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    status VARCHAR(30) DEFAULT 'PAID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    tenant_name VARCHAR(255),
    room_number VARCHAR(50),
    category VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description VARCHAR(2000),
    priority VARCHAR(30) DEFAULT 'MEDIUM',
    status VARCHAR(30) DEFAULT 'OPEN',
    owner_notes VARCHAR(2000),
    created_date VARCHAR(50),
    resolved_date VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================================
-- Initial Seed Data
-- =====================================================================

INSERT IGNORE INTO owners (id, name, email, phone, password, hostel_name, address)
VALUES (1, 'Vikram Malhotra', 'owner@hostel.com', '+91 98765 43210', 'password123', 'Shree Sai Royal PG & Hostels', 'Plot 42, Knowledge Park III, Greater Noida');

INSERT IGNORE INTO tenants (id, name, email, phone, password, college_or_company, assigned_room_id, assigned_room_number, monthly_rent, rent_status)
VALUES 
(1, 'Rahul Sharma', 'tenant@college.edu', '+91 98111 22334', 'password123', 'Computer Science - Sem 5', 102, 'B-201', 7500.0, 'PAID'),
(2, 'Priya Patel', 'priya@college.edu', '+91 98222 33445', 'password123', 'Information Technology - Sem 5', 103, 'C-302', 6500.0, 'DUE');

INSERT IGNORE INTO rooms (id, room_number, room_type, rent_amount, security_deposit, status, amenities, description, image_url, owner_id, current_tenant_id, current_tenant_name)
VALUES 
(101, 'A-101', 'Single Sharing', 9500.0, 10000.0, 'AVAILABLE', 'Attached Washroom, Air Conditioning, High-speed Wi-Fi, Study Desk, Balcony', 'Spacious premium single-sharing room on the 1st floor with ample natural sunlight and garden view.', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80', 1, NULL, NULL),
(102, 'B-201', 'Double Sharing', 7500.0, 8000.0, 'OCCUPIED', 'Air Conditioning, Wi-Fi, Balcony, Attached Washroom, Wardrobes', 'Deluxe double sharing room currently leased to Rahul Sharma.', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80', 1, 1, 'Rahul Sharma'),
(103, 'C-302', 'Double Sharing', 6500.0, 7000.0, 'OCCUPIED', 'Ceiling Fan, High-speed Wi-Fi, Attached Washroom, Personal Study Tables', 'Standard double-sharing room currently leased to Priya Patel.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80', 1, 2, 'Priya Patel'),
(104, 'A-104', 'Single Sharing', 11500.0, 12000.0, 'AVAILABLE', 'Air Conditioning, Smart TV, Mini Fridge, Attached Luxury Bath, High-speed Wi-Fi', 'Executive single suite with premium wooden furnishings and housekeeping.', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80', 1, NULL, NULL),
(105, 'B-205', 'Triple Sharing', 5200.0, 6000.0, 'AVAILABLE', 'High-speed Wi-Fi, Balcony, Geyser, Triple Wardrobes, Power Backup', 'Budget-friendly spacious triple-sharing room ideal for college students.', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80', 1, NULL, NULL),
(106, 'D-401', 'Double Sharing', 6800.0, 7500.0, 'UNDER_MAINTENANCE', 'Air Conditioning, Wi-Fi, Attached Washroom', 'Scheduled for fresh painting, tile polishing, and AC servicing.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80', 1, NULL, NULL);

INSERT IGNORE INTO tenant_applications (id, tenant_id, tenant_name, tenant_email, tenant_phone, room_id, room_number, rent_amount, message, status, application_date)
VALUES 
(101, 1, 'Rahul Sharma', 'tenant@college.edu', '+91 98111 22334', 102, 'B-201', 7500.0, 'Requesting accommodation for academic year 2026-27.', 'APPROVED', '15 Oct 2026'),
(102, 2, 'Priya Patel', 'priya@college.edu', '+91 98222 33445', 103, 'C-302', 6500.0, 'Need quiet room for semester exam preparation.', 'APPROVED', '18 Oct 2026');

INSERT IGNORE INTO rent_payments (id, tenant_id, tenant_name, room_id, room_number, amount, month, payment_date, payment_method, transaction_id, status)
VALUES 
(1001, 1, 'Rahul Sharma', 102, 'B-201', 7500.0, 'August 2026', '02 Aug 2026', 'UPI', 'TXN-202608-9843', 'PAID'),
(1002, 1, 'Rahul Sharma', 102, 'B-201', 7500.0, 'September 2026', '03 Sep 2026', 'UPI', 'TXN-202609-1123', 'PAID'),
(1003, 1, 'Rahul Sharma', 102, 'B-201', 7500.0, 'October 2026', '05 Oct 2026', 'Net Banking', 'TXN-202610-4491', 'PAID');

INSERT IGNORE INTO complaints (id, tenant_id, tenant_name, room_number, category, title, description, priority, status, owner_notes, created_date, resolved_date)
VALUES 
(501, 2, 'Priya Patel', 'C-302', 'Wi-Fi', 'Intermittent Wi-Fi Disconnection', 'High latency and packet drops in Room C-302 during evening hours, affecting project submission.', 'MEDIUM', 'OPEN', 'Pending technician visit scheduled for Monday.', '23 Oct 2026', NULL),
(502, 1, 'Rahul Sharma', 'B-201', 'Plumbing', 'Bathroom Washbasin Valve Leaking', 'Water dripping slowly from the main basin valve.', 'HIGH', 'RESOLVED', 'Plumber replaced the internal washer and tested pressure.', '20 Oct 2026', '21 Oct 2026');
