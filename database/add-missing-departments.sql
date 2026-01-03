-- =============================================
-- ADD MISSING DEPARTMENTS
-- Run this script manually in MySQL to add missing departments
-- =============================================

USE hrms_db;

-- Add missing departments (IT, Operations, Admin)
INSERT INTO departments (id, name, description, is_active, created_at, updated_at)
VALUES 
(UUID(), 'IT', 'Information Technology and Support', TRUE, NOW(), NOW()),
(UUID(), 'Operations', 'Operations and Logistics', TRUE, NOW(), NOW()),
(UUID(), 'Admin', 'Administration and Management', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Verify departments
SELECT id, name, description, is_active FROM departments ORDER BY name;
