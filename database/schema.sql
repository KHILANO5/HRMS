-- Dayflow HRMS Database Schema
-- MySQL 8.0+
-- Created: January 3, 2026

-- =============================================
-- DATABASE CREATION
-- =============================================

CREATE DATABASE IF NOT EXISTS hrms_db;
USE hrms_db;

-- =============================================
-- USERS TABLE
-- =============================================
-- Stores authentication and basic user information
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee') NOT NULL DEFAULT 'employee',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_first_login BOOLEAN NOT NULL DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_is_active (is_active),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- EMPLOYEES TABLE
-- =============================================
-- Stores employee profile information
CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL UNIQUE,
  employee_code VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(100) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  date_of_joining DATE NOT NULL,
  profile_picture LONGTEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_employee_code (employee_code),
  INDEX idx_department (department),
  INDEX idx_date_of_joining (date_of_joining),
  INDEX idx_is_active (is_active),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- EMPLOYEE ADDRESSES TABLE
-- =============================================
-- Stores detailed address information for employees
CREATE TABLE IF NOT EXISTS employee_addresses (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  employee_id VARCHAR(36) NOT NULL UNIQUE,
  street VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  INDEX idx_employee_id (employee_id),
  INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- EMERGENCY CONTACTS TABLE
-- =============================================
-- Stores emergency contact information for employees
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  employee_id VARCHAR(36) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  relationship VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  INDEX idx_employee_id (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- ATTENDANCE TABLE
-- =============================================
-- Stores daily attendance records for employees
CREATE TABLE IF NOT EXISTS attendance (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  employee_id VARCHAR(36) NOT NULL,
  attendance_date DATE NOT NULL,
  check_in_time TIME,
  check_out_time TIME,
  work_hours DECIMAL(5, 2),
  extra_hours DECIMAL(5, 2),
  status ENUM('present', 'absent', 'leave', 'half_day') NOT NULL DEFAULT 'absent',
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE KEY unique_employee_date (employee_id, attendance_date),
  INDEX idx_employee_id (employee_id),
  INDEX idx_attendance_date (attendance_date),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- LEAVE BALANCE TABLE
-- =============================================
-- Stores annual leave allocation and usage for employees
CREATE TABLE IF NOT EXISTS leave_balances (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  employee_id VARCHAR(36) NOT NULL,
  leave_type ENUM('paid', 'sick') NOT NULL,
  total_allocated INT NOT NULL,
  used INT NOT NULL DEFAULT 0,
  remaining INT NOT NULL,
  year INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE KEY unique_employee_leave_year (employee_id, leave_type, year),
  INDEX idx_employee_id (employee_id),
  INDEX idx_leave_type (leave_type),
  INDEX idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- LEAVE REQUESTS TABLE
-- =============================================
-- Stores leave request applications from employees
CREATE TABLE IF NOT EXISTS leave_requests (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  employee_id VARCHAR(36) NOT NULL,
  leave_type ENUM('paid', 'sick') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  number_of_days INT NOT NULL,
  reason TEXT NOT NULL,
  attachment_url LONGTEXT,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  admin_remarks TEXT,
  approved_by VARCHAR(36),
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES employees(id) ON DELETE SET NULL,
  INDEX idx_employee_id (employee_id),
  INDEX idx_leave_type (leave_type),
  INDEX idx_status (status),
  INDEX idx_start_date (start_date),
  INDEX idx_end_date (end_date),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SALARIES TABLE
-- =============================================
-- Stores salary structure and details for employees
CREATE TABLE IF NOT EXISTS salaries (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  employee_id VARCHAR(36) NOT NULL,
  basic_pay DECIMAL(12, 2) NOT NULL,
  hra DECIMAL(12, 2) DEFAULT 0,
  allowances DECIMAL(12, 2) DEFAULT 0,
  pf_contribution DECIMAL(12, 2) DEFAULT 0,
  tax_deduction DECIMAL(12, 2) DEFAULT 0,
  gross_salary DECIMAL(12, 2) NOT NULL,
  net_salary DECIMAL(12, 2) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  INDEX idx_employee_id (employee_id),
  INDEX idx_effective_from (effective_from),
  INDEX idx_is_active (is_active),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SALARY COMPONENTS TABLE (Optional)
-- =============================================
-- Stores breakdown of salary components for better tracking
CREATE TABLE IF NOT EXISTS salary_components (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  salary_id VARCHAR(36) NOT NULL,
  component_name VARCHAR(100) NOT NULL,
  component_type ENUM('earning', 'deduction') NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (salary_id) REFERENCES salaries(id) ON DELETE CASCADE,
  INDEX idx_salary_id (salary_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- DEPARTMENTS TABLE
-- =============================================
-- Stores department master data
CREATE TABLE IF NOT EXISTS departments (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  head_id VARCHAR(36),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (head_id) REFERENCES employees(id) ON DELETE SET NULL,
  INDEX idx_name (name),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- DESIGNATIONS TABLE
-- =============================================
-- Stores designation/job title master data
CREATE TABLE IF NOT EXISTS designations (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  department_id VARCHAR(36),
  level INT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  INDEX idx_name (name),
  INDEX idx_department_id (department_id),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- AUDIT LOG TABLE
-- =============================================
-- Stores audit trail for important actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id VARCHAR(36),
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_entity_type (entity_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- CREATE INDEXES FOR COMMON QUERIES
-- =============================================

-- Indexes for better query performance on frequently searched columns
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_attendance_employee_month ON attendance(employee_id, attendance_date);
CREATE INDEX idx_leave_requests_status_date ON leave_requests(status, start_date);
CREATE INDEX idx_salaries_employee_active ON salaries(employee_id, is_active);

-- =============================================
-- STORED PROCEDURES (Optional)
-- =============================================

-- Procedure to calculate remaining leave balance
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS update_leave_balance(
  IN p_employee_id VARCHAR(36),
  IN p_leave_type VARCHAR(10),
  IN p_year INT,
  IN p_days_used INT
)
BEGIN
  UPDATE leave_balances
  SET 
    used = used + p_days_used,
    remaining = total_allocated - (used + p_days_used),
    updated_at = CURRENT_TIMESTAMP
  WHERE 
    employee_id = p_employee_id 
    AND leave_type = p_leave_type 
    AND year = p_year;
END //

DELIMITER ;

-- =============================================
-- VIEWS (Optional)
-- =============================================

-- View for employee dashboard - overall summary
CREATE OR REPLACE VIEW employee_summary_view AS
SELECT 
  e.id,
  e.employee_code,
  CONCAT(e.first_name, ' ', e.last_name) AS full_name,
  e.designation,
  e.department,
  u.email,
  u.role,
  e.date_of_joining,
  (SELECT COUNT(*) FROM attendance WHERE employee_id = e.id AND MONTH(attendance_date) = MONTH(CURDATE()) AND status = 'present') AS current_month_present,
  (SELECT COUNT(*) FROM attendance WHERE employee_id = e.id AND MONTH(attendance_date) = MONTH(CURDATE()) AND status = 'absent') AS current_month_absent,
  (SELECT remaining FROM leave_balances WHERE employee_id = e.id AND year = YEAR(CURDATE()) AND leave_type = 'paid' LIMIT 1) AS remaining_paid_leave,
  (SELECT remaining FROM leave_balances WHERE employee_id = e.id AND year = YEAR(CURDATE()) AND leave_type = 'sick' LIMIT 1) AS remaining_sick_leave
FROM employees e
LEFT JOIN users u ON e.user_id = u.id
WHERE e.is_active = TRUE;

-- View for pending leave requests
CREATE OR REPLACE VIEW pending_leave_requests_view AS
SELECT 
  lr.id,
  lr.employee_id,
  CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
  e.department,
  lr.leave_type,
  lr.start_date,
  lr.end_date,
  lr.number_of_days,
  lr.reason,
  lr.status,
  lr.created_at
FROM leave_requests lr
LEFT JOIN employees e ON lr.employee_id = e.id
WHERE lr.status = 'pending'
ORDER BY lr.created_at DESC;

-- =============================================
-- NOTE: Seed data is NOT included in the schema file
-- Use database/seeds/sample-data.sql for sample data
-- =============================================

-- =============================================
-- COMMENTS
-- =============================================

ALTER TABLE users COMMENT = 'Core user authentication and role management';
ALTER TABLE employees COMMENT = 'Employee profile and personal information';
ALTER TABLE attendance COMMENT = 'Daily attendance tracking records';
ALTER TABLE leave_balances COMMENT = 'Annual leave allocation and tracking';
ALTER TABLE leave_requests COMMENT = 'Employee leave applications and approvals';
ALTER TABLE salaries COMMENT = 'Salary structure and compensation details';
ALTER TABLE audit_logs COMMENT = 'System audit trail for compliance and troubleshooting';

-- =============================================
-- END OF SCHEMA
-- =============================================
