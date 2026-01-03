# Dayflow HRMS - API Contract Documentation

## Table of Contents
1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Authentication Endpoints](#authentication-endpoints)
4. [Employee Management Endpoints](#employee-management-endpoints)
5. [Attendance Endpoints](#attendance-endpoints)
6. [Leave Management Endpoints](#leave-management-endpoints)
7. [Salary Management Endpoints](#salary-management-endpoints)
8. [Profile Management Endpoints](#profile-management-endpoints)
9. [Error Codes](#error-codes)
10. [Data Models](#data-models)

---

## API Overview

### Base URL
```
Development: http://localhost:3000/api/v1
Production: https://api.dayflow.com/api/v1
```

### API Version
Current Version: `v1`

### Content Type
All requests and responses use `application/json` unless specified otherwise.

### Response Format
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {},
  "error": {}
}
```

---

## Authentication

### Authentication Method
JWT (JSON Web Token) based authentication

### Token Usage
Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Token Expiry
- Access Token: 1 hour
- Refresh Token: 7 days

---

## Authentication Endpoints

### 1. Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "employee",
      "isFirstLogin": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Response (First Time Login - 200):**
```json
{
  "success": true,
  "message": "First time login. Password change required",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "employee",
      "isFirstLogin": true
    },
    "requirePasswordChange": true,
    "tempToken": "temporary_token_for_password_change"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "AUTH_001",
    "details": "Email or password is incorrect"
  }
}
```

---

### 2. Change Password (First Login)

**Endpoint:** `POST /auth/change-password-first-login`

**Description:** Change password on first login

**Headers:**
```
Authorization: Bearer <temp_token>
```

**Request Body:**
```json
{
  "currentPassword": "temporaryPassword",
  "newPassword": "NewSecurePassword123",
  "confirmPassword": "NewSecurePassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

### 3. Change Password

**Endpoint:** `POST /auth/change-password`

**Description:** Change password for authenticated user

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewSecurePassword123",
  "confirmPassword": "NewSecurePassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 4. Refresh Token

**Endpoint:** `POST /auth/refresh-token`

**Description:** Get new access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 5. Logout

**Endpoint:** `POST /auth/logout`

**Description:** Logout user and invalidate tokens

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Employee Management Endpoints

### 1. Get All Employees

**Endpoint:** `GET /employees`

**Description:** Get list of all employees

**Access:** Admin, Employee (limited info)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
?page=1&limit=10&department=IT&search=john
```

**Response (Success - 200):**
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
        "email": "john.doe@company.com",
        "phone": "+1234567890",
        "department": "IT",
        "designation": "Software Engineer",
        "profilePicture": "https://cdn.example.com/profiles/john.jpg",
        "workStatus": "present",
        "dateOfJoining": "2024-01-15"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

### 2. Get Employee by ID

**Endpoint:** `GET /employees/:id`

**Description:** Get detailed employee information

**Access:** Admin (full), Employee (own profile only)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Employee details retrieved successfully",
  "data": {
    "id": "uuid",
    "employeeCode": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "phone": "+1234567890",
    "department": "IT",
    "designation": "Software Engineer",
    "dateOfJoining": "2024-01-15",
    "profilePicture": "https://cdn.example.com/profiles/john.jpg",
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
    },
    "workStatus": "present",
    "isActive": true
  }
}
```

---

### 3. Create Employee (Admin Only)

**Endpoint:** `POST /employees`

**Description:** Create new employee account

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "phone": "+1234567890",
  "department": "IT",
  "designation": "Software Engineer",
  "dateOfJoining": "2024-01-15",
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
  },
  "salary": {
    "basicPay": 50000,
    "hra": 10000,
    "allowances": 5000,
    "pfContribution": 6000,
    "taxDeduction": 8000
  },
  "leaveAllocation": {
    "paidLeave": 15,
    "sickLeave": 10
  }
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Employee created successfully. Credentials sent to email.",
  "data": {
    "employee": {
      "id": "uuid",
      "employeeCode": "EMP001",
      "email": "john.doe@company.com",
      "temporaryPassword": "TempPass123" // Only in response, not stored
    }
  }
}
```

---

### 4. Update Employee

**Endpoint:** `PUT /employees/:id`

**Description:** Update employee information

**Access:** Admin (full), Employee (limited fields)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (Employee):**
```json
{
  "phone": "+1234567890",
  "address": {
    "street": "456 New St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "country": "USA"
  },
  "profilePicture": "base64_or_url"
}
```

**Request Body (Admin):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "department": "Engineering",
  "designation": "Senior Software Engineer",
  "address": {},
  "emergencyContact": {},
  "isActive": true
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "employee": {
      // Updated employee object
    }
  }
}
```

---

### 5. Delete/Deactivate Employee (Admin Only)

**Endpoint:** `DELETE /employees/:id`

**Description:** Soft delete (deactivate) employee

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Employee deactivated successfully"
}
```

---

## Attendance Endpoints

### 1. Get Attendance Records

**Endpoint:** `GET /attendance`

**Description:** Get attendance records

**Access:** Admin (all), Employee (own only)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
?employeeId=uuid&startDate=2024-01-01&endDate=2024-01-31&page=1&limit=30
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Attendance records retrieved successfully",
  "data": {
    "records": [
      {
        "id": "uuid",
        "employeeId": "uuid",
        "date": "2024-01-15",
        "checkInTime": "09:00:00",
        "checkOutTime": "18:00:00",
        "workHours": "09:00",
        "extraHours": "01:00",
        "status": "present"
      }
    ],
    "summary": {
      "totalWorkingDays": 22,
      "daysPresent": 20,
      "daysAbsent": 0,
      "daysOnLeave": 2,
      "totalWorkHours": "180:00",
      "totalExtraHours": "15:00"
    },
    "pagination": {
      "total": 22,
      "page": 1,
      "limit": 30,
      "totalPages": 1
    }
  }
}
```

---

### 2. Get Attendance by Date

**Endpoint:** `GET /attendance/date/:date`

**Description:** Get attendance for specific date (Admin only)

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Daily attendance retrieved successfully",
  "data": {
    "date": "2024-01-15",
    "summary": {
      "totalEmployees": 50,
      "present": 45,
      "absent": 2,
      "onLeave": 3
    },
    "records": [
      {
        "employeeId": "uuid",
        "employeeName": "John Doe",
        "checkInTime": "09:00:00",
        "checkOutTime": "18:00:00",
        "status": "present"
      }
    ]
  }
}
```

---

### 3. Mark Attendance (Future Feature)

**Endpoint:** `POST /attendance/check-in`

**Description:** Check-in attendance

**Access:** Employee

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "timestamp": "2024-01-15T09:00:00Z",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Check-in recorded successfully",
  "data": {
    "attendanceId": "uuid",
    "checkInTime": "09:00:00"
  }
}
```

---

### 4. Check-out (Future Feature)

**Endpoint:** `POST /attendance/check-out`

**Description:** Check-out attendance

**Access:** Employee

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "timestamp": "2024-01-15T18:00:00Z"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Check-out recorded successfully",
  "data": {
    "attendanceId": "uuid",
    "checkOutTime": "18:00:00",
    "workHours": "09:00",
    "extraHours": "01:00"
  }
}
```

---

## Leave Management Endpoints

### 1. Get Leave Balance

**Endpoint:** `GET /leaves/balance`

**Description:** Get leave balance for employee

**Access:** Admin (any employee), Employee (own only)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
?employeeId=uuid&year=2024
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Leave balance retrieved successfully",
  "data": {
    "employeeId": "uuid",
    "year": 2024,
    "balances": [
      {
        "leaveType": "paid",
        "totalAllocated": 15,
        "used": 5,
        "remaining": 10
      },
      {
        "leaveType": "sick",
        "totalAllocated": 10,
        "used": 2,
        "remaining": 8
      }
    ]
  }
}
```

---

### 2. Get Leave Requests

**Endpoint:** `GET /leaves/requests`

**Description:** Get leave requests

**Access:** Admin (all), Employee (own only)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
?employeeId=uuid&status=pending&page=1&limit=10
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Leave requests retrieved successfully",
  "data": {
    "requests": [
      {
        "id": "uuid",
        "employeeId": "uuid",
        "employeeName": "John Doe",
        "leaveType": "paid",
        "startDate": "2024-02-01",
        "endDate": "2024-02-03",
        "numberOfDays": 3,
        "reason": "Family vacation",
        "attachmentUrl": null,
        "status": "pending",
        "adminRemarks": null,
        "createdAt": "2024-01-20T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

### 3. Create Leave Request

**Endpoint:** `POST /leaves/requests`

**Description:** Submit new leave request

**Access:** Employee

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
leaveType: "sick"
startDate: "2024-02-01"
endDate: "2024-02-03"
reason: "Medical emergency"
attachment: [file] (required for sick leave)
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Leave request submitted successfully",
  "data": {
    "request": {
      "id": "uuid",
      "employeeId": "uuid",
      "leaveType": "sick",
      "startDate": "2024-02-01",
      "endDate": "2024-02-03",
      "numberOfDays": 3,
      "reason": "Medical emergency",
      "attachmentUrl": "https://cdn.example.com/attachments/medical-cert.pdf",
      "status": "pending",
      "createdAt": "2024-01-20T10:00:00Z"
    }
  }
}
```

**Response (Error - Insufficient Balance - 400):**
```json
{
  "success": false,
  "message": "Insufficient leave balance",
  "error": {
    "code": "LEAVE_002",
    "details": {
      "requested": 3,
      "available": 2
    }
  }
}
```

**Response (Error - Overlapping Dates - 400):**
```json
{
  "success": false,
  "message": "Leave already exists for the requested dates",
  "error": {
    "code": "LEAVE_003",
    "details": {
      "existingLeave": {
        "id": "uuid",
        "startDate": "2024-02-01",
        "endDate": "2024-02-05"
      }
    }
  }
}
```

---

### 4. Update Leave Request Status (Admin Only)

**Endpoint:** `PATCH /leaves/requests/:id`

**Description:** Approve or reject leave request

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "status": "approved",
  "adminRemarks": "Approved. Enjoy your vacation!"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Leave request updated successfully",
  "data": {
    "request": {
      "id": "uuid",
      "status": "approved",
      "adminRemarks": "Approved. Enjoy your vacation!",
      "approvedBy": "admin-uuid",
      "approvedAt": "2024-01-21T14:30:00Z"
    }
  }
}
```

---

### 5. Cancel Leave Request

**Endpoint:** `DELETE /leaves/requests/:id`

**Description:** Cancel pending leave request

**Access:** Employee (own only, pending status only)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Leave request cancelled successfully"
}
```

---

### 6. Get Leave History

**Endpoint:** `GET /leaves/history`

**Description:** Get leave history

**Access:** Admin (any employee), Employee (own only)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
?employeeId=uuid&year=2024&page=1&limit=10
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Leave history retrieved successfully",
  "data": {
    "history": [
      {
        "id": "uuid",
        "leaveType": "paid",
        "startDate": "2024-01-10",
        "endDate": "2024-01-12",
        "numberOfDays": 3,
        "status": "approved",
        "adminRemarks": "Approved",
        "createdAt": "2024-01-05T10:00:00Z",
        "approvedAt": "2024-01-06T15:00:00Z"
      }
    ],
    "pagination": {
      "total": 8,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

## Salary Management Endpoints

### 1. Get Salary Information

**Endpoint:** `GET /salary/:employeeId`

**Description:** Get salary details for employee

**Access:** Admin (full details), Employee (limited/own only)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - Admin - 200):**
```json
{
  "success": true,
  "message": "Salary information retrieved successfully",
  "data": {
    "employeeId": "uuid",
    "basicPay": 50000,
    "hra": 10000,
    "allowances": 5000,
    "grossSalary": 65000,
    "pfContribution": 6000,
    "taxDeduction": 8000,
    "netSalary": 51000,
    "monthlySalary": 51000,
    "yearlySalary": 612000,
    "effectiveFrom": "2024-01-01",
    "components": [
      {
        "name": "Basic Pay",
        "amount": 50000,
        "type": "earning"
      },
      {
        "name": "HRA",
        "amount": 10000,
        "type": "earning"
      },
      {
        "name": "Special Allowance",
        "amount": 5000,
        "type": "earning"
      },
      {
        "name": "PF Contribution",
        "amount": 6000,
        "type": "deduction"
      },
      {
        "name": "Tax Deduction",
        "amount": 8000,
        "type": "deduction"
      }
    ]
  }
}
```

**Response (Success - Employee - 200):**
```json
{
  "success": true,
  "message": "Salary information retrieved successfully",
  "data": {
    "monthlySalary": 51000,
    "yearlySalary": 612000
  }
}
```

---

### 2. Update Salary (Admin Only)

**Endpoint:** `PUT /salary/:employeeId`

**Description:** Update employee salary structure

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "basicPay": 55000,
  "hra": 11000,
  "allowances": 6000,
  "pfContribution": 6600,
  "taxDeduction": 9000,
  "effectiveFrom": "2024-02-01"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Salary updated successfully",
  "data": {
    "employeeId": "uuid",
    "basicPay": 55000,
    "hra": 11000,
    "allowances": 6000,
    "grossSalary": 72000,
    "pfContribution": 6600,
    "taxDeduction": 9000,
    "netSalary": 56400,
    "effectiveFrom": "2024-02-01"
  }
}
```

---

## Profile Management Endpoints

### 1. Get Current User Profile

**Endpoint:** `GET /profile/me`

**Description:** Get authenticated user's profile

**Access:** All authenticated users

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "john.doe@company.com",
      "role": "employee"
    },
    "employee": {
      "id": "uuid",
      "employeeCode": "EMP001",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "department": "IT",
      "designation": "Software Engineer",
      "dateOfJoining": "2024-01-15",
      "profilePicture": "https://cdn.example.com/profiles/john.jpg",
      "address": {},
      "emergencyContact": {}
    }
  }
}
```

---

### 2. Update Profile Picture

**Endpoint:** `POST /profile/picture`

**Description:** Upload/update profile picture

**Access:** All authenticated users

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
profilePicture: [file]
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile picture updated successfully",
  "data": {
    "profilePictureUrl": "https://cdn.example.com/profiles/john.jpg"
  }
}
```

---

### 3. Upload Resume

**Endpoint:** `POST /profile/resume`

**Description:** Upload/update resume

**Access:** All authenticated users

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
resume: [file]
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "resumeUrl": "https://cdn.example.com/resumes/john_doe_resume.pdf"
  }
}
```

---

## Error Codes

### Authentication Errors (AUTH_XXX)
| Code | Description |
|------|-------------|
| AUTH_001 | Invalid credentials |
| AUTH_002 | Token expired |
| AUTH_003 | Invalid token |
| AUTH_004 | Account disabled |
| AUTH_005 | Password change required |
| AUTH_006 | Unauthorized access |
| AUTH_007 | Session timeout |

### Employee Management Errors (EMP_XXX)
| Code | Description |
|------|-------------|
| EMP_001 | Employee not found |
| EMP_002 | Duplicate email |
| EMP_003 | Invalid employee data |
| EMP_004 | Cannot delete employee with active records |
| EMP_005 | Insufficient permissions |

### Attendance Errors (ATT_XXX)
| Code | Description |
|------|-------------|
| ATT_001 | Attendance record not found |
| ATT_002 | Already checked in |
| ATT_003 | Not checked in yet |
| ATT_004 | Invalid attendance date |

### Leave Errors (LEAVE_XXX)
| Code | Description |
|------|-------------|
| LEAVE_001 | Leave request not found |
| LEAVE_002 | Insufficient leave balance |
| LEAVE_003 | Overlapping leave dates |
| LEAVE_004 | Invalid leave dates |
| LEAVE_005 | Attachment required |
| LEAVE_006 | Cannot cancel approved/rejected leave |
| LEAVE_007 | Past date leave not allowed |

### Salary Errors (SAL_XXX)
| Code | Description |
|------|-------------|
| SAL_001 | Salary information not found |
| SAL_002 | Invalid salary components |
| SAL_003 | Unauthorized access to salary data |

### File Upload Errors (FILE_XXX)
| Code | Description |
|------|-------------|
| FILE_001 | File size too large |
| FILE_002 | Invalid file type |
| FILE_003 | Upload failed |

### General Errors (GEN_XXX)
| Code | Description |
|------|-------------|
| GEN_001 | Validation error |
| GEN_002 | Database error |
| GEN_003 | Internal server error |
| GEN_004 | Service unavailable |

---

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'employee';
  isActive: boolean;
  isFirstLogin: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Employee Model
```typescript
interface Employee {
  id: string;
  userId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
  designation: string;
  dateOfJoining: Date;
  profilePicture?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}
```

### Attendance Model
```typescript
interface Attendance {
  id: string;
  employeeId: string;
  date: Date;
  checkInTime: string;
  checkOutTime?: string;
  workHours?: string;
  extraHours?: string;
  status: 'present' | 'absent' | 'leave' | 'half_day';
  createdAt: Date;
  updatedAt: Date;
}
```

### Leave Request Model
```typescript
interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: 'paid' | 'sick';
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  reason: string;
  attachmentUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminRemarks?: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Leave Balance Model
```typescript
interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveType: 'paid' | 'sick';
  totalAllocated: number;
  used: number;
  remaining: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Salary Model
```typescript
interface Salary {
  id: string;
  employeeId: string;
  basicPay: number;
  hra: number;
  allowances: number;
  pfContribution: number;
  taxDeduction: number;
  grossSalary: number;
  netSalary: number;
  effectiveFrom: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Rate Limiting

All endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **Read operations**: 100 requests per minute
- **Write operations**: 30 requests per minute
- **File uploads**: 10 requests per minute

When rate limit is exceeded:
```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "error": {
    "code": "RATE_LIMIT",
    "retryAfter": 60
  }
}
```

---

## Pagination

All list endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Pagination response format:
```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## Versioning

API versioning is handled through the URL path:
- Current version: `/api/v1/`
- Future versions will be: `/api/v2/`, `/api/v3/`, etc.

Deprecated versions will be supported for at least 6 months before removal.

---

## Support & Contact

For API support, please contact:
- Email: api-support@dayflow.com
- Documentation: https://docs.dayflow.com
- Status Page: https://status.dayflow.com

---

**Last Updated:** January 3, 2026
**API Version:** v1.0.0
