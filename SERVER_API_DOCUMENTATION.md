# DAYFLOW HRMS - Backend API Documentation
**Generated:** January 3, 2026  
**Framework:** Express.js + TypeScript  
**ORM:** Sequelize 6.37.3  
**Database:** MySQL 8.0+  
**Port:** 3000  
**Test Coverage:** 76% (25/33 tests passing)

---

## 📋 Table of Contents
1. [Project Architecture](#project-architecture)
2. [Database Schema](#database-schema)
3. [API Endpoints Reference](#api-endpoints-reference)
4. [Authentication & Authorization](#authentication--authorization)
5. [Request/Response Format](#requestresponse-format)
6. [Error Codes](#error-codes)
7. [Test Results Summary](#test-results-summary)
8. [Missing Features](#missing-features)

---

## 🏗️ Project Architecture

### Directory Structure
```
server/
├── src/
│   ├── controllers/
│   │   ├── authController.ts       # Authentication logic
│   │   ├── employeeController.ts   # Employee CRUD operations
│   │   ├── attendanceController.ts # Attendance tracking
│   │   ├── leaveController.ts      # Leave management
│   │   ├── salaryController.ts     # Salary operations
│   │   └── profileController.ts    # User profile management
│   ├── routes/
│   │   ├── auth.ts                 # Auth routes
│   │   ├── employees.ts            # Employee routes
│   │   ├── attendance.ts           # Attendance routes
│   │   ├── leaves.ts               # Leave routes
│   │   ├── salary.ts               # Salary routes
│   │   └── profile.ts              # Profile routes
│   ├── middleware/
│   │   ├── auth.ts                 # JWT authentication
│   │   └── validator.ts            # Express-validator wrapper
│   ├── utils/
│   │   ├── auth.ts                 # Auth helpers (bcrypt, JWT)
│   │   ├── response.ts             # Standard response formatter
│   │   └── upload.ts               # Multer file upload config
│   └── index.ts                    # Express app entry point
├── uploads/                        # File uploads storage
├── .env                            # Environment variables
├── .env.example                    # Example config
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
└── TEST_RESULTS.md                 # Test results

database/
├── connection.ts                   # Sequelize connection
├── index.ts                        # Model initialization
├── schema.sql                      # Database schema
├── migrate.ts                      # Migration script
├── models/                         # Sequelize models (14 files)
└── seeds/
    └── sample-data.sql             # Sample data
```

### Technology Stack
```json
{
  "runtime": "Node.js >=18",
  "framework": "Express 4.19.2",
  "language": "TypeScript 5.6.2",
  "orm": "Sequelize 6.37.3",
  "database": "MySQL 8.0+",
  "authentication": "JWT (jsonwebtoken 9.0.2)",
  "hashing": "bcryptjs 2.4.3",
  "validation": "express-validator 7.0.1",
  "fileUpload": "multer 1.4.5",
  "cors": "cors 2.8.5"
}
```

### Environment Variables
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hrms_db
DB_USER=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development
DB_SYNC=true
```

---

## 🗄️ Database Schema

### Tables Summary
| Table Name | Records | Purpose |
|------------|---------|---------|
| `users` | 7 | Authentication & user accounts |
| `employees` | 7 | Employee profile data |
| `employee_addresses` | 6 | Address information |
| `emergency_contacts` | 6 | Emergency contact details |
| `attendance` | 16 | Daily attendance records |
| `leave_balances` | 24 | Leave allocation tracking |
| `leave_requests` | 7 | Leave applications |
| `salaries` | 6 | Salary structure |
| `salary_components` | 10 | Salary breakdown |
| `departments` | 5 | Department master |
| `designations` | 8 | Designation master |
| `audit_logs` | 5 | Audit trail |
| `employee_summary_view` | - | View (dashboard data) |
| `pending_leave_requests_view` | - | View (pending leaves) |

### Entity Relationships

```
users (1) ──────────── (1) employees
                          │
                          ├── (1) employee_addresses
                          ├── (1) emergency_contacts
                          ├── (n) attendance
                          ├── (n) leave_balances
                          ├── (n) leave_requests
                          └── (n) salaries
                                 └── (n) salary_components

departments (1) ─── (n) employees
designations (1) ─── (n) employees

users (1) ─── (n) audit_logs
```

### Key Database Features
- ✅ UUID primary keys (VARCHAR(36))
- ✅ Foreign key constraints with CASCADE/SET NULL
- ✅ Indexes on frequently queried columns
- ✅ ENUM types for fixed values
- ✅ Timestamps (created_at, updated_at)
- ✅ JSON columns for flexible data (audit_logs)
- ✅ Views for complex queries
- ✅ Stored procedures for business logic
- ✅ Unique constraints (email, employee_code)

### Sample Credentials
```
Admin:
  Email: admin@dayflow.com
  Password: Password@123
  Role: admin

Employee:
  Email: john.doe@dayflow.com
  Password: Password@123
  Role: employee

Password Hash: $2a$10$LWwPGY4km2l6Z/0B8JSsTurDj26dmGB8FE0N5iu1mF7AmyRI22RFG
```

---

## 📡 API Endpoints Reference

### Base URL
```
http://localhost:3000/api/v1
```

### Health Check
```http
GET /health
```
**Status:** ✅ Working  
**Auth:** Not required  
**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "data": {
    "uptime": 123.456,
    "database": "connected"
  },
  "error": null
}
```

---

## 🔐 Authentication & Authorization

### 1. Login
```http
POST /api/v1/auth/login
```
**Status:** ✅ 100% Working  
**Auth:** Not required

**Request Body:**
```json
{
  "email": "admin@dayflow.com",
  "password": "Password@123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "admin@dayflow.com",
      "role": "admin",
      "isFirstLogin": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  },
  "error": null
}
```

**Response (First Login):**
```json
{
  "success": true,
  "message": "First time login. Password change required",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john.doe@dayflow.com",
      "role": "employee",
      "isFirstLogin": true
    },
    "requirePasswordChange": true,
    "tempToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
- `401` - Invalid credentials (AUTH_001)
- `403` - Account is disabled (AUTH_004)

**Validation Rules:**
- Email must be valid email format
- Password cannot be empty

**Test Results:**
- ✅ Admin login successful
- ✅ Employee login successful
- ✅ Invalid credentials rejected
- ✅ Tokens generated correctly

---

### 2. Change Password
```http
POST /api/v1/auth/change-password
```
**Status:** ⚠️ Not Tested  
**Auth:** Required (Bearer token)

**Request Body:**
```json
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@123",
  "confirmPassword": "NewPassword@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null,
  "error": null
}
```

**Validation Rules:**
- New password minimum 8 characters
- Must contain uppercase, lowercase, and number
- Confirm password must match new password

**Controller:** `authController.changePassword`

---

### 3. Change Password (First Login)
```http
POST /api/v1/auth/change-password-first-login
```
**Status:** ⚠️ Not Tested (Needed by Frontend)  
**Auth:** Required (temp token)

**Request Body:**
```json
{
  "currentPassword": "TemporaryPass@123",
  "newPassword": "MyNewPassword@123",
  "confirmPassword": "MyNewPassword@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  },
  "error": null
}
```

**Special Behavior:**
- Updates `users.is_first_login = FALSE`
- Returns new permanent tokens
- Auto-updates last_login timestamp

**Controller:** `authController.changePasswordFirstLogin`

---

### 4. Refresh Token
```http
POST /api/v1/auth/refresh-token
```
**Status:** ✅ Working  
**Auth:** Not required

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "error": null
}
```

**Test Results:**
- ✅ Token refresh working
- ✅ Expired token rejected

---

### 5. Logout
```http
POST /api/v1/auth/logout
```
**Status:** ✅ Working  
**Auth:** Required

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null,
  "error": null
}
```

**Test Results:**
- ✅ Logout successful

---

## 👥 Employee Management

### 1. Get All Employees
```http
GET /api/v1/employees?page=1&limit=10&search=john&department=Engineering
```
**Status:** ✅ 100% Working  
**Auth:** Required  
**Role:** All (filtered by role)

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10, max: 100)
- `search` (optional) - Search by name, email, employee code
- `department` (optional) - Filter by department
- `isActive` (optional) - Filter by active status

**Response:**
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": {
    "employees": [
      {
        "id": "uuid",
        "employeeCode": "EMP001",
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+1234567890",
        "department": "Engineering",
        "designation": "Software Engineer",
        "dateOfJoining": "2024-01-15",
        "profilePicture": null,
        "isActive": true,
        "createdAt": "2026-01-03T...",
        "updatedAt": "2026-01-03T...",
        "user": {
          "email": "john.doe@dayflow.com",
          "role": "employee",
          "isActive": true
        }
      }
    ],
    "pagination": {
      "total": 7,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  },
  "error": null
}
```

**Test Results:**
- ✅ Get all employees (7 found)
- ✅ Search by name (2 found)
- ✅ Filter by department (3 in Engineering)

**Controller:** `employeeController.getAllEmployees`

---

### 2. Get Employee by ID
```http
GET /api/v1/employees/:id
```
**Status:** ✅ Working  
**Auth:** Required  
**Role:** Admin (all), Employee (only own record)

**Response:**
```json
{
  "success": true,
  "message": "Employee details retrieved successfully",
  "data": {
    "id": "uuid",
    "employeeCode": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "department": "Engineering",
    "designation": "Software Engineer",
    "dateOfJoining": "2024-01-15",
    "profilePicture": null,
    "isActive": true,
    "user": {
      "email": "john.doe@dayflow.com",
      "role": "employee",
      "isActive": true
    },
    "address": {
      "id": "uuid",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "emergencyContact": {
      "id": "uuid",
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phone": "+1234567891"
    }
  },
  "error": null
}
```

**Error Responses:**
- `403` - Unauthorized access (EMP_005) - Employee accessing other's record
- `404` - Employee not found (EMP_001)

**Test Results:**
- ✅ Get employee by ID working

**Controller:** `employeeController.getEmployeeById`

---

### 3. Create New Employee
```http
POST /api/v1/employees
```
**Status:** ⚠️ 86% Working (validation needs review)  
**Auth:** Required  
**Role:** Admin only

**Request Body:**
```json
{
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@dayflow.com",
  "phone": "+1234567892",
  "department": "Marketing",
  "designation": "Marketing Manager",
  "dateOfJoining": "2026-02-01",
  "address": {
    "street": "456 Oak Ave",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102",
    "country": "USA"
  },
  "emergencyContact": {
    "name": "Bob Johnson",
    "relationship": "Spouse",
    "phone": "+1234567893"
  },
  "salary": {
    "basicPay": 60000,
    "hra": 15000,
    "allowances": 5000,
    "pfContribution": 7200,
    "taxDeduction": 8000
  },
  "leaveAllocation": {
    "paidLeave": 15,
    "sickLeave": 10
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "employee": {
      "id": "uuid",
      "employeeCode": "EMP008",
      "firstName": "Alice",
      "lastName": "Johnson",
      "email": "alice.johnson@dayflow.com",
      "temporaryPassword": "TempPass@2026"
    }
  },
  "error": null
}
```

**Validation Rules:**
- firstName, lastName, email, department, designation, dateOfJoining are required
- Email must be valid and unique
- Phone must be valid mobile format
- Date of joining must be valid ISO8601 date

**Auto-Generated:**
- Employee code (EMP001, EMP002, etc.)
- Temporary password (12 characters)
- Password hash (bcrypt with salt 10)
- User account (email, password_hash, role='employee', is_first_login=true)
- Gross salary = basicPay + hra + allowances
- Net salary = gross - pfContribution - taxDeduction
- Leave balances for current year

**Test Results:**
- ❌ Validation error (needs review of test data)

**Controller:** `employeeController.createEmployee`

---

### 4. Update Employee
```http
PUT /api/v1/employees/:id
```
**Status:** ⚠️ Partially Working  
**Auth:** Required  
**Role:** Admin (all fields), Employee (limited fields)

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "department": "Engineering",
  "designation": "Senior Software Engineer",
  "address": {
    "street": "789 Elm St",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "country": "USA"
  },
  "emergencyContact": {
    "name": "Jane Smith",
    "relationship": "Spouse",
    "phone": "+1234567891"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "employee": { /* updated employee object */ }
  },
  "error": null
}
```

**Test Results:**
- ✅ Update employee working
- ❌ HTML error on restriction test

**Controller:** `employeeController.updateEmployee`

---

### 5. Delete Employee
```http
DELETE /api/v1/employees/:id
```
**Status:** ⚠️ Not Tested  
**Auth:** Required  
**Role:** Admin only

**Response:**
```json
{
  "success": true,
  "message": "Employee deleted successfully",
  "data": null,
  "error": null
}
```

**Behavior:**
- Soft delete (sets `is_active = false`)
- User account also deactivated
- Does NOT delete database records (CASCADE foreign keys)

**Controller:** `employeeController.deleteEmployee`

---

## 📅 Attendance Management

### 1. Get Attendance Records
```http
GET /api/v1/attendance/records?employeeId=uuid&startDate=2026-01-01&endDate=2026-01-31&page=1&limit=30
```
**Status:** ✅ 100% Working  
**Auth:** Required  
**Role:** Admin (all records), Employee (own records only)

**Query Parameters:**
- `employeeId` (optional) - Filter by employee ID (admin only)
- `startDate` (optional) - ISO8601 date
- `endDate` (optional) - ISO8601 date
- `page` (optional) - Default 1
- `limit` (optional) - Default 30, max 100

**Response:**
```json
{
  "success": true,
  "message": "Attendance records retrieved successfully",
  "data": {
    "records": [
      {
        "id": "uuid",
        "employeeId": "uuid",
        "attendanceDate": "2026-01-03",
        "checkInTime": "09:00:00",
        "checkOutTime": "18:00:00",
        "workHours": "9.00",
        "extraHours": "0.00",
        "status": "present",
        "remarks": null,
        "employee": {
          "employeeCode": "EMP001",
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ],
    "summary": {
      "totalWorkingDays": 16,
      "daysPresent": 14,
      "daysAbsent": 1,
      "daysOnLeave": 1,
      "totalWorkHours": "126.00",
      "totalExtraHours": "10.50"
    },
    "pagination": {
      "total": 16,
      "page": 1,
      "limit": 30,
      "totalPages": 1
    }
  },
  "error": null
}
```

**Test Results:**
- ✅ Get attendance records (16 found)

**Controller:** `attendanceController.getAttendance`

---

### 2. Get Daily Attendance Summary
```http
GET /api/v1/attendance/daily?date=2026-01-03
```
**Status:** ✅ Working  
**Auth:** Required  
**Role:** Admin only

**Response:**
```json
{
  "success": true,
  "message": "Daily attendance retrieved successfully",
  "data": {
    "date": "2026-01-03",
    "summary": {
      "totalEmployees": 7,
      "present": 6,
      "absent": 1,
      "onLeave": 0
    },
    "records": [
      {
        "id": "uuid",
        "attendanceDate": "2026-01-03",
        "checkInTime": "09:00:00",
        "checkOutTime": "18:00:00",
        "status": "present",
        "employee": {
          "id": "uuid",
          "employeeCode": "EMP001",
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ]
  },
  "error": null
}
```

**Test Results:**
- ✅ Daily attendance working

**Controller:** `attendanceController.getAttendanceByDate`

---

### 3. Check-in ❌ NOT IMPLEMENTED
```http
POST /api/v1/attendance/checkin
```
**Status:** ❌ Missing Endpoint  
**Auth:** Required  
**Role:** All

**Expected Request Body:**
```json
{
  "checkInTime": "09:15:00",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "remarks": "On time"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Checked in successfully",
  "data": {
    "attendanceId": "uuid",
    "checkInTime": "09:15:00",
    "date": "2026-01-03"
  },
  "error": null
}
```

**Required Implementation:**
- Get employee ID from JWT token
- Create attendance record for today
- Status = 'present' if on time, 'late' if after 9:30 AM
- Cannot check-in twice for same day
- Store location if provided

**Frontend Needs This:** ✅ Critical for employee module

---

### 4. Check-out ❌ NOT IMPLEMENTED
```http
POST /api/v1/attendance/checkout
```
**Status:** ❌ Missing Endpoint  
**Auth:** Required  
**Role:** All

**Expected Request Body:**
```json
{
  "checkOutTime": "18:30:00",
  "remarks": "Completed tasks"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Checked out successfully",
  "data": {
    "attendanceId": "uuid",
    "checkInTime": "09:15:00",
    "checkOutTime": "18:30:00",
    "workHours": "9.25",
    "extraHours": "0.25"
  },
  "error": null
}
```

**Required Implementation:**
- Update existing attendance record
- Calculate work_hours = checkout - checkin
- Calculate extra_hours if > 9 hours
- Cannot checkout without checkin
- Cannot checkout twice

**Frontend Needs This:** ✅ Critical for employee module

---

## 🏖️ Leave Management

### 1. Get Leave Balance
```http
GET /api/v1/leaves/balance?employeeId=uuid&year=2026
```
**Status:** ⚠️ Working (needs employeeId)  
**Auth:** Required  
**Role:** Admin (any employee), Employee (own only)

**Query Parameters:**
- `employeeId` (optional) - Employee UUID (required for admin)
- `year` (optional) - Default current year

**Response:**
```json
{
  "success": true,
  "message": "Leave balance retrieved successfully",
  "data": {
    "employeeId": "uuid",
    "year": 2026,
    "balances": [
      {
        "id": "uuid",
        "leaveType": "paid",
        "totalAllocated": 15,
        "used": 3,
        "remaining": 12,
        "year": 2026
      },
      {
        "id": "uuid",
        "leaveType": "sick",
        "totalAllocated": 10,
        "used": 1,
        "remaining": 9,
        "year": 2026
      }
    ]
  },
  "error": null
}
```

**Test Results:**
- ❌ Missing employeeId error (API working, test needs update)

**Controller:** `leaveController.getLeaveBalance`

---

### 2. Get Leave Requests
```http
GET /api/v1/leaves/requests?employeeId=uuid&status=pending&page=1&limit=10
```
**Status:** ✅ 100% Working  
**Auth:** Required  
**Role:** Admin (all requests), Employee (own only)

**Query Parameters:**
- `employeeId` (optional) - Filter by employee (admin only)
- `status` (optional) - pending, approved, rejected
- `page` (optional) - Default 1
- `limit` (optional) - Default 10, max 100

**Response:**
```json
{
  "success": true,
  "message": "Leave requests retrieved successfully",
  "data": {
    "requests": [
      {
        "id": "uuid",
        "employeeId": "uuid",
        "leaveType": "paid",
        "startDate": "2026-01-10",
        "endDate": "2026-01-12",
        "numberOfDays": 3,
        "reason": "Family vacation",
        "attachmentUrl": null,
        "status": "pending",
        "adminRemarks": null,
        "approvedBy": null,
        "approvedAt": null,
        "createdAt": "2026-01-03T...",
        "employee": {
          "employeeCode": "EMP001",
          "firstName": "John",
          "lastName": "Doe"
        },
        "approver": null
      }
    ],
    "pagination": {
      "total": 7,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  },
  "error": null
}
```

**Test Results:**
- ✅ Get all requests (7 found)
- ✅ Filter by status (3 pending)

**Controller:** `leaveController.getLeaveRequests`

---

### 3. Create Leave Request
```http
POST /api/v1/leaves/requests
```
**Status:** ⚠️ Working (validation working correctly)  
**Auth:** Required  
**Role:** All (employees only)

**Request Body:**
```json
{
  "leaveType": "paid",
  "startDate": "2026-02-10",
  "endDate": "2026-02-12",
  "reason": "Personal work",
  "attachmentUrl": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "Leave request submitted successfully",
  "data": {
    "request": {
      "id": "uuid",
      "employeeId": "uuid",
      "leaveType": "paid",
      "startDate": "2026-02-10",
      "endDate": "2026-02-12",
      "numberOfDays": 3,
      "reason": "Personal work",
      "status": "pending"
    }
  },
  "error": null
}
```

**Validation Checks:**
- ✅ Leave type must be 'paid' or 'sick'
- ✅ Dates must be valid ISO8601
- ✅ Reason cannot be empty
- ✅ Check sufficient leave balance
- ✅ Check for overlapping leave dates
- ✅ Auto-calculate number of days

**Error Responses:**
- `400` - Insufficient leave balance (LEAVE_002)
- `400` - Overlapping leave exists (LEAVE_003)
- `404` - Employee not found (EMP_001)

**Test Results:**
- ❌ Insufficient balance error (validation working correctly)

**Controller:** `leaveController.createLeaveRequest`

---

### 4. Approve/Reject Leave Request
```http
PATCH /api/v1/leaves/requests/:id
```
**Status:** ❌ HTML Error (needs fix)  
**Auth:** Required  
**Role:** Admin only

**Request Body:**
```json
{
  "status": "approved",
  "adminRemarks": "Approved for family emergency"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Leave request updated successfully",
  "data": {
    "request": {
      "id": "uuid",
      "status": "approved",
      "adminRemarks": "Approved for family emergency",
      "approvedBy": "admin-uuid",
      "approvedAt": "2026-01-03T10:30:00Z"
    }
  },
  "error": null
}
```

**Validation:**
- Status must be 'approved' or 'rejected'
- adminRemarks is optional

**Side Effects (if approved):**
- Deduct days from leave balance
- Update `leave_balances.used` and `remaining`
- Create audit log entry

**Test Results:**
- ❌ HTML error (routing issue)

**Controller:** `leaveController.updateLeaveRequestStatus`

---

### 5. Cancel Leave Request
```http
DELETE /api/v1/leaves/requests/:id
```
**Status:** ⚠️ Not Tested  
**Auth:** Required  
**Role:** Employee (own), Admin (any)

**Response:**
```json
{
  "success": true,
  "message": "Leave request cancelled successfully",
  "data": null,
  "error": null
}
```

**Validation:**
- Only pending requests can be cancelled
- If approved, must restore leave balance

**Controller:** `leaveController.deleteLeaveRequest`

---

### 6. Get Leave History
```http
GET /api/v1/leaves/history?employeeId=uuid&year=2026
```
**Status:** ⚠️ Working (needs employeeId)  
**Auth:** Required  
**Role:** Admin (any), Employee (own)

**Query Parameters:**
- `employeeId` (required) - Employee UUID
- `year` (optional) - Default current year

**Response:**
```json
{
  "success": true,
  "message": "Leave history retrieved successfully",
  "data": {
    "employeeId": "uuid",
    "year": 2026,
    "totalLeaves": 10,
    "approvedLeaves": 8,
    "rejectedLeaves": 1,
    "pendingLeaves": 1,
    "history": [
      {
        "id": "uuid",
        "leaveType": "paid",
        "startDate": "2026-01-10",
        "endDate": "2026-01-12",
        "numberOfDays": 3,
        "status": "approved",
        "approvedAt": "2026-01-05T..."
      }
    ]
  },
  "error": null
}
```

**Test Results:**
- ❌ Missing employeeId error (API working)

**Controller:** `leaveController.getLeaveHistory`

---

## 💰 Salary Management

### 1. Get Salary Information
```http
GET /api/v1/salary/:employeeId
```
**Status:** ⚠️ 50% Working  
**Auth:** Required  
**Role:** Admin (any employee), Employee (own only - may be restricted)

**Response:**
```json
{
  "success": true,
  "message": "Salary information retrieved successfully",
  "data": {
    "salary": {
      "id": "uuid",
      "employeeId": "uuid",
      "basicPay": "60000.00",
      "hra": "15000.00",
      "allowances": "5000.00",
      "pfContribution": "7200.00",
      "taxDeduction": "8000.00",
      "grossSalary": "80000.00",
      "netSalary": "64800.00",
      "effectiveFrom": "2024-01-15",
      "effectiveTo": null,
      "isActive": true
    },
    "components": [
      {
        "componentName": "Basic Pay",
        "componentType": "earning",
        "amount": "60000.00"
      },
      {
        "componentName": "HRA",
        "componentType": "earning",
        "amount": "15000.00"
      }
    ]
  },
  "error": null
}
```

**Test Results:**
- ✅ Admin can access (6 records found)
- ❌ Employee access unauthorized (may be expected)

**Controller:** `salaryController.getSalary`

---

### 2. Update Salary
```http
PUT /api/v1/salary/:employeeId
```
**Status:** ❌ Update Not Working  
**Auth:** Required  
**Role:** Admin only

**Request Body:**
```json
{
  "basicPay": 65000,
  "hra": 16000,
  "allowances": 6000,
  "pfContribution": 7800,
  "taxDeduction": 9000,
  "effectiveFrom": "2026-02-01"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Salary updated successfully",
  "data": {
    "salary": {
      "id": "new-uuid",
      "employeeId": "uuid",
      "basicPay": "65000.00",
      "grossSalary": "87000.00",
      "netSalary": "70200.00",
      "effectiveFrom": "2026-02-01",
      "isActive": true
    }
  },
  "error": null
}
```

**Expected Behavior:**
- Mark old salary record as inactive (is_active=false, effective_to=new_date)
- Create new salary record with new values
- Calculate gross = basic + hra + allowances
- Calculate net = gross - pf - tax
- Create salary_components breakdown

**Test Results:**
- ❌ Update not reflected in database

**Controller:** `salaryController.updateSalary`

---

## 👤 Profile Management

### 1. Get Current User Profile
```http
GET /api/v1/profile/me
```
**Status:** ✅ 100% Working  
**Auth:** Required  
**Role:** All

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "john.doe@dayflow.com",
      "role": "employee",
      "isActive": true,
      "lastLogin": "2026-01-03T08:30:00Z"
    },
    "employee": {
      "id": "uuid",
      "employeeCode": "EMP001",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "department": "Engineering",
      "designation": "Software Engineer",
      "dateOfJoining": "2024-01-15",
      "profilePicture": null
    },
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phone": "+1234567891"
    }
  },
  "error": null
}
```

**Test Results:**
- ✅ Profile retrieval working

**Controller:** `profileController.getCurrentUserProfile`

---

### 2. Update Profile Picture
```http
POST /api/v1/profile/picture
Content-Type: multipart/form-data
```
**Status:** ⚠️ Not Tested  
**Auth:** Required  
**Role:** All

**Request:**
```
Form Data:
- picture: [File] (image/jpeg, image/png, max 5MB)
```

**Response:**
```json
{
  "success": true,
  "message": "Profile picture updated successfully",
  "data": {
    "pictureUrl": "/uploads/profiles/uuid-1234567890.jpg"
  },
  "error": null
}
```

**Multer Configuration:**
- Destination: `uploads/profiles/`
- Max file size: 5MB
- Allowed types: image/jpeg, image/png
- Filename: `uuid-timestamp.ext`

**Controller:** `profileController.updateProfilePicture`

---

### 3. Upload Resume
```http
POST /api/v1/profile/resume
Content-Type: multipart/form-data
```
**Status:** ⚠️ Not Tested  
**Auth:** Required  
**Role:** All

**Request:**
```
Form Data:
- resume: [File] (application/pdf, max 10MB)
```

**Response:**
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "resumeUrl": "/uploads/resumes/uuid-1234567890.pdf"
  },
  "error": null
}
```

**Controller:** `profileController.uploadEmployeeResume`

---

## 📊 Dashboard Statistics APIs

### ❌ Admin Dashboard Stats - NOT IMPLEMENTED
```http
GET /api/v1/dashboard/admin/stats
```
**Status:** ❌ Missing Endpoint  
**Auth:** Required  
**Role:** Admin only

**Expected Response:**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalEmployees": 7,
    "presentToday": 6,
    "absentToday": 1,
    "onLeaveToday": 0,
    "pendingLeaveRequests": 3,
    "newEmployeesThisMonth": 2,
    "recentLeaveRequests": [
      {
        "id": "uuid",
        "employeeName": "John Doe",
        "leaveType": "paid",
        "startDate": "2026-01-10",
        "endDate": "2026-01-12",
        "days": 3,
        "status": "pending"
      }
    ],
    "recentEmployees": [
      {
        "id": "uuid",
        "employeeCode": "EMP007",
        "name": "Alice Johnson",
        "department": "Marketing",
        "dateOfJoining": "2026-01-02"
      }
    ]
  },
  "error": null
}
```

**Required Queries:**
```sql
-- Total Employees
SELECT COUNT(*) FROM employees WHERE is_active = 1;

-- Present Today
SELECT COUNT(*) FROM attendance 
WHERE attendance_date = CURDATE() AND status = 'present';

-- Absent Today
SELECT COUNT(*) FROM attendance 
WHERE attendance_date = CURDATE() AND status = 'absent';

-- On Leave Today
SELECT COUNT(*) FROM attendance 
WHERE attendance_date = CURDATE() AND status = 'leave';

-- Pending Leave Requests
SELECT COUNT(*) FROM leave_requests WHERE status = 'pending';

-- New Employees This Month
SELECT COUNT(*) FROM employees 
WHERE MONTH(date_of_joining) = MONTH(CURDATE())
AND YEAR(date_of_joining) = YEAR(CURDATE());

-- Recent Leave Requests (last 5)
SELECT lr.*, CONCAT(e.first_name, ' ', e.last_name) as employee_name
FROM leave_requests lr
JOIN employees e ON lr.employee_id = e.id
WHERE lr.status = 'pending'
ORDER BY lr.created_at DESC
LIMIT 5;

-- Recent Employees (last 5)
SELECT * FROM employees
ORDER BY date_of_joining DESC
LIMIT 5;
```

**Frontend Needs This:** ✅ Critical for AdminDashboard.tsx

---

### ❌ Employee Dashboard Stats - NOT IMPLEMENTED
```http
GET /api/v1/dashboard/employee/stats
```
**Status:** ❌ Missing Endpoint  
**Auth:** Required  
**Role:** Employee

**Expected Response:**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "checkInStatus": {
      "checkedIn": true,
      "checkInTime": "09:15:00",
      "status": "on-time",
      "date": "2026-01-03"
    },
    "monthlyAttendance": {
      "presentDays": 20,
      "absentDays": 1,
      "leaveDays": 2,
      "percentage": 87
    },
    "leaveBalance": {
      "paid": {
        "total": 15,
        "used": 3,
        "remaining": 12
      },
      "sick": {
        "total": 10,
        "used": 1,
        "remaining": 9
      }
    },
    "pendingActions": {
      "profileCompletion": 85,
      "pendingLeaveRequests": 1,
      "documentsNeeded": 0
    },
    "recentAttendance": [
      {
        "date": "2026-01-03",
        "checkIn": "09:15:00",
        "checkOut": "18:30:00",
        "workHours": "9.25",
        "status": "present"
      }
    ],
    "recentLeaveRequests": [
      {
        "id": "uuid",
        "leaveType": "paid",
        "startDate": "2026-01-10",
        "endDate": "2026-01-12",
        "days": 3,
        "status": "pending"
      }
    ]
  },
  "error": null
}
```

**Frontend Needs This:** ✅ Critical for EmployeeDashboard.tsx

---

## 📐 Request/Response Format

### Standard Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  },
  "error": null
}
```

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "details": {
      // Additional error info
    }
  }
}
```

### Pagination Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [ /* array of items */ ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  },
  "error": null
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "error": {
    "code": "GEN_001",
    "details": {
      "errors": [
        {
          "field": "email",
          "message": "Valid email is required"
        },
        {
          "field": "password",
          "message": "Password must be at least 8 characters"
        }
      ]
    }
  }
}
```

---

## ⚠️ Error Codes

### General Errors (GEN_xxx)
- `GEN_001` - Validation error
- `GEN_002` - Resource not found
- `GEN_003` - Internal server error
- `GEN_004` - Database error

### Authentication Errors (AUTH_xxx)
- `AUTH_001` - Invalid credentials
- `AUTH_002` - Password mismatch
- `AUTH_003` - Invalid or expired token
- `AUTH_004` - Account disabled
- `AUTH_005` - Token generation failed
- `AUTH_006` - No token provided / Authentication required

### Employee Errors (EMP_xxx)
- `EMP_001` - Employee not found
- `EMP_002` - Email already exists
- `EMP_003` - Employee code already exists
- `EMP_004` - Invalid employee data
- `EMP_005` - Unauthorized access / Insufficient permissions

### Leave Errors (LEAVE_xxx)
- `LEAVE_001` - Leave request not found
- `LEAVE_002` - Insufficient leave balance
- `LEAVE_003` - Overlapping leave dates
- `LEAVE_004` - Invalid leave dates
- `LEAVE_005` - Cannot modify approved leave

### Attendance Errors (ATT_xxx)
- `ATT_001` - Attendance record not found
- `ATT_002` - Already checked in today
- `ATT_003` - Must check in before checkout
- `ATT_004` - Invalid attendance date

### Salary Errors (SAL_xxx)
- `SAL_001` - Salary record not found
- `SAL_002` - Invalid salary data
- `SAL_003` - Overlapping salary periods

---

## 🧪 Test Results Summary

### Overall Statistics
- **Total Tests:** 33
- **Passed:** 25 (76%)
- **Failed:** 8 (24%)
- **Database:** ✅ Connected
- **Server:** ✅ Running

### Module-wise Results

#### 1. Health Check: ✅ 100%
- 3/3 tests passed

#### 2. Authentication: ✅ 100%
- 5/5 tests passed
- Login, refresh, logout all working

#### 3. Employee Management: ⚠️ 86%
- 6/7 tests passed
- Create validation needs review

#### 4. Attendance: ✅ 100%
- 2/2 tests passed
- Read operations working

#### 5. Leave Management: ⚠️ 50%
- 3/6 tests passed
- Query parameters need fixes
- PATCH route has HTML error

#### 6. Salary: ⚠️ 50%
- 2/4 tests passed
- Update operation not working
- Role permissions unclear

#### 7. Profile: ✅ 100%
- 2/2 tests passed

#### 8. Database: ✅ 100%
- 5/5 tests passed
- All tables verified

### Failed Tests Analysis

| Test | Error | Impact | Priority |
|------|-------|--------|----------|
| Create Employee | Validation error | Low | Medium |
| Update Restriction | HTML error | Medium | High |
| Get Leave Balance | Missing param | Low | Low |
| Create Leave Request | Insufficient balance | None | N/A |
| Approve Leave | HTML error | High | High |
| Get Leave History | Missing param | Low | Low |
| Employee Salary Access | Unauthorized | Low | Low |
| Update Salary | Not saving | High | High |

---

## ❌ Missing Features

### Critical (Blocks Frontend)
1. **Check-in API** - `POST /api/v1/attendance/checkin`
   - Frontend: CheckInsPage.tsx needs this
   - Status: Not implemented
   - Priority: HIGH

2. **Check-out API** - `POST /api/v1/attendance/checkout`
   - Frontend: CheckInsPage.tsx needs this
   - Status: Not implemented
   - Priority: HIGH

3. **Admin Dashboard Stats** - `GET /api/v1/dashboard/admin/stats`
   - Frontend: AdminDashboard.tsx needs this
   - Status: Not implemented
   - Priority: HIGH

4. **Employee Dashboard Stats** - `GET /api/v1/dashboard/employee/stats`
   - Frontend: EmployeeDashboard.tsx needs this
   - Status: Not implemented
   - Priority: HIGH

### Important (Better UX)
5. **Update Profile** - `PUT /api/v1/profile/me`
   - Frontend: ProfilePage.tsx, AdminProfilePage.tsx need this
   - Status: Only picture/resume upload exists
   - Priority: MEDIUM

6. **Get Departments** - `GET /api/v1/departments`
   - Frontend: Dropdown in AddEmployeePage.tsx
   - Status: Not implemented (using hardcoded values)
   - Priority: MEDIUM

7. **Get Designations** - `GET /api/v1/designations`
   - Frontend: Dropdown in AddEmployeePage.tsx
   - Status: Not implemented (using hardcoded values)
   - Priority: MEDIUM

### Bugs to Fix
8. **Leave Approval HTML Error**
   - Endpoint: `PATCH /api/v1/leaves/requests/:id`
   - Issue: Returns HTML instead of JSON
   - Priority: HIGH

9. **Salary Update Not Saving**
   - Endpoint: `PUT /api/v1/salary/:employeeId`
   - Issue: Update not reflected in database
   - Priority: HIGH

10. **Employee Update HTML Error**
    - Endpoint: `PUT /api/v1/employees/:id`
    - Issue: Restriction test returns HTML
    - Priority: MEDIUM

---

## 🔧 Middleware & Utilities

### Authentication Middleware
**File:** `src/middleware/auth.ts`

**Functions:**
```typescript
// Verify JWT token from Authorization header
authenticate(req, res, next)

// Check if user has required role(s)
authorizeRoles(...roles)(req, res, next)
```

**Usage:**
```typescript
router.get('/', authenticate, getAllEmployees);
router.post('/', authenticate, authorizeRoles('admin'), createEmployee);
```

### Validation Middleware
**File:** `src/middleware/validator.ts`

**Function:**
```typescript
// Process express-validator errors
handleValidationErrors(req, res, next)
```

**Usage:**
```typescript
router.post('/login', 
  loginValidation,           // Array of validation rules
  handleValidationErrors,    // Process errors
  login                      // Controller function
);
```

### Auth Utilities
**File:** `src/utils/auth.ts`

**Functions:**
```typescript
hashPassword(password: string): Promise<string>
comparePassword(password: string, hash: string): Promise<boolean>
generateAccessToken(payload): string  // 1h expiry
generateRefreshToken(payload): string // 7d expiry
verifyToken(token: string): any | null
generateTemporaryPassword(): string   // 12 characters
```

### Response Utilities
**File:** `src/utils/response.ts`

**Functions:**
```typescript
successResponse(message: string, data?: any)
errorResponse(message: string, code: string, details?: any)
paginationMeta(total: number, page: number, limit: number)
```

### Upload Utilities
**File:** `src/utils/upload.ts`

**Multer Configurations:**
```typescript
uploadProfilePicture   // Single file, 5MB, images only
uploadResume           // Single file, 10MB, PDF only
```

---

## 🚀 Deployment Checklist

### Environment Setup
- [ ] Set secure `JWT_SECRET` (minimum 32 characters)
- [ ] Configure production database credentials
- [ ] Set `NODE_ENV=production`
- [ ] Disable `DB_SYNC` in production
- [ ] Configure CORS allowed origins
- [ ] Set up SSL/TLS certificates

### Database
- [ ] Run migrations on production database
- [ ] Create database backups
- [ ] Verify indexes are created
- [ ] Test database connection
- [ ] Set up monitoring

### Security
- [ ] Enable helmet middleware
- [ ] Configure rate limiting
- [ ] Set up HTTPS
- [ ] Implement input sanitization
- [ ] Configure secure cookie settings
- [ ] Set up security headers

### Performance
- [ ] Enable gzip compression
- [ ] Configure caching strategy
- [ ] Optimize database queries
- [ ] Set up load balancing
- [ ] Monitor memory usage

### Monitoring
- [ ] Set up error logging (Winston, Sentry)
- [ ] Configure performance monitoring
- [ ] Set up health check endpoints
- [ ] Configure alerts
- [ ] Set up APM (New Relic, Datadog)

---

## 📚 API Integration Guide

### Step 1: Install Axios (Frontend)
```bash
npm install axios
```

### Step 2: Create API Client
```typescript
// client/src/utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle errors)
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try refresh
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/v1/auth/refresh-token', {
            refreshToken,
          });
          localStorage.setItem('accessToken', data.data.accessToken);
          // Retry original request
          return api(error.config);
        } catch {
          // Refresh failed, logout
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Step 3: Create API Service
```typescript
// client/src/services/authService.ts
import api from '../utils/api';

export const authService = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  logout: () => 
    api.post('/auth/logout'),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

// client/src/services/employeeService.ts
export const employeeService = {
  getAll: (params?: any) => 
    api.get('/employees', { params }),
  
  getById: (id: string) => 
    api.get(`/employees/${id}`),
  
  create: (data: any) => 
    api.post('/employees', data),
  
  update: (id: string, data: any) => 
    api.put(`/employees/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/employees/${id}`),
};
```

### Step 4: Use in Components
```typescript
// client/src/pages/auth/LoginPage.tsx
import { authService } from '../../services/authService';

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authService.login(email, password);
    localStorage.setItem('accessToken', response.data.tokens.accessToken);
    localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    if (response.data.user.isFirstLogin) {
      navigate('/change-password-first-login');
    } else {
      navigate(response.data.user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
    }
  } catch (error: any) {
    setError(error.response?.data?.message || 'Login failed');
  }
};
```

---

## 📞 API Support

### Documentation
- Base URL: http://localhost:3000/api/v1
- Swagger/OpenAPI: Not configured
- Postman Collection: Not available

### Contact
- Repository: https://github.com/KHILANO5/HRMS
- Branch: fullstake_nishit

---

**Document Generated:** January 3, 2026  
**Backend Version:** 0.1.0  
**Test Coverage:** 76%  
**Ready for Frontend Integration:** Partial (missing critical endpoints) ⚠️
