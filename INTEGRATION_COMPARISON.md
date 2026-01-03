# DAYFLOW HRMS - Frontend-Backend Integration Analysis
**Generated:** January 3, 2026  
**Status:** Pre-Integration Review  
**Purpose:** Identify gaps and prepare for frontend-backend connection

---

## 📋 Executive Summary

| Category | Frontend Status | Backend Status | Match Status |
|----------|----------------|----------------|--------------|
| **Authentication** | ✅ Complete | ✅ Complete | ⚠️ **CREDENTIAL MISMATCH** |
| **Employee CRUD** | ✅ Complete | ✅ 86% Working | ✅ Compatible |
| **Attendance** | ✅ Complete | ⚠️ 50% (Read only) | ❌ **Missing Check-in/out** |
| **Leave Management** | ✅ Complete | ⚠️ 50% Working | ⚠️ Bugs to fix |
| **Salary** | ✅ Complete | ⚠️ 50% Working | ⚠️ Update broken |
| **Dashboard Stats** | ✅ Complete | ❌ Not Implemented | ❌ **CRITICAL MISSING** |
| **Profile** | ✅ Complete | ✅ Complete | ✅ Compatible |

**Overall Compatibility:** 65%  
**Blocking Issues:** 4 Critical  
**Action Items:** 12 High Priority

---

## 🚨 Critical Issues (Blocks Integration)

### 1. Credential Mismatch ⚠️ HIGH PRIORITY

**Frontend Credentials:**
```typescript
// client/src/pages/auth/LoginPage.tsx (Line 15-18)
const DUMMY_USERS = {
  admin: { 
    email: 'admin@company.com',      // ❌ WRONG
    password: 'Admin@123',            // ❌ WRONG
    role: 'admin' 
  },
  employee: { 
    email: 'employee@company.com',    // ❌ WRONG
    password: 'Employee@123',          // ❌ WRONG
    role: 'employee' 
  }
}
```

**Backend Database:**
```sql
-- database/seeds/sample-data.sql
Admin:
  email: 'admin@dayflow.com'          -- ✅ CORRECT
  password: 'Password@123'             -- ✅ CORRECT
  hash: '$2a$10$LWwPGY4km2l6Z/0B8JSsTurDj26dmGB8FE0N5iu1mF7AmyRI22RFG'

Employee:
  email: 'john.doe@dayflow.com'       -- ✅ CORRECT
  password: 'Password@123'             -- ✅ CORRECT
```

**Impact:** 🔴 CRITICAL - Login will fail

**Solution Options:**
```diff
Option A: Update Frontend to match Backend (RECOMMENDED)
+ admin@dayflow.com / Password@123
+ john.doe@dayflow.com / Password@123

Option B: Update Backend database to match Frontend
- Change emails in users table
- Update sample-data.sql
```

**Action Required:** Update frontend LoginPage.tsx with correct credentials

---

### 2. Missing Check-in/Check-out APIs ❌ CRITICAL

**Frontend Requirements:**
```typescript
// client/src/pages/employee/CheckInsPage.tsx
POST /api/v1/attendance/checkin
Body: {
  checkInTime: "09:15:00",
  location: { lat: number, lng: number },
  remarks: string
}

POST /api/v1/attendance/checkout
Body: {
  checkOutTime: "18:30:00",
  remarks: string
}
```

**Backend Status:** ❌ NOT IMPLEMENTED

**Impact:** 🔴 CRITICAL - Employee check-in/out feature won't work

**Required Implementation:**
```typescript
// server/src/controllers/attendanceController.ts
export const checkIn = async (req: AuthRequest, res: Response) => {
  // 1. Get employee from JWT token
  // 2. Check if already checked in today
  // 3. Create attendance record with status='present'
  // 4. Mark as 'late' if after 9:30 AM
  // 5. Store location if provided
}

export const checkOut = async (req: AuthRequest, res: Response) => {
  // 1. Get employee from JWT token
  // 2. Find today's attendance record
  // 3. Update check_out_time
  // 4. Calculate work_hours = checkout - checkin
  // 5. Calculate extra_hours if > 9 hours
}
```

**Routes to Add:**
```typescript
// server/src/routes/attendance.ts
router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
```

---

### 3. Missing Dashboard Stats APIs ❌ CRITICAL

**Frontend Requirements:**

**A. Admin Dashboard Stats:**
```typescript
// client/src/pages/admin/AdminDashboard.tsx (Line 15-30)
GET /api/v1/dashboard/admin/stats

Expected Response: {
  totalEmployees: 248,
  presentToday: 234,
  absentToday: 6,
  onLeaveToday: 8,
  pendingLeaveRequests: 12,
  newEmployeesThisMonth: 5,
  recentLeaveRequests: [...],
  recentEmployees: [...]
}
```

**B. Employee Dashboard Stats:**
```typescript
// client/src/pages/employee/EmployeeDashboard.tsx
GET /api/v1/dashboard/employee/stats

Expected Response: {
  checkInStatus: { time, status, date },
  monthlyAttendance: { presentDays, absentDays, leaveDays, percentage },
  leaveBalance: { paid: {...}, sick: {...} },
  pendingActions: {...},
  recentAttendance: [...],
  recentLeaveRequests: [...]
}
```

**Backend Status:** ❌ NOT IMPLEMENTED

**Impact:** 🔴 CRITICAL - Dashboard pages will show mock data only

**Action Required:** Implement both dashboard endpoints

---

### 4. Leave Approval Bug 🐛 HIGH PRIORITY

**Frontend:**
```typescript
// client/src/pages/admin/LeavePage.tsx (Line 145-160)
PATCH /api/v1/leaves/requests/:id
Body: {
  status: 'approved',
  adminRemarks: 'Approved'
}
```

**Backend Status:** ⚠️ Returns HTML error instead of JSON

**Test Result:**
```
❌ Approve Leave Request
Error: Invalid JSON response (HTML error page)
Reason: PATCH method routing issue
```

**Impact:** 🔴 HIGH - Admins cannot approve/reject leaves

**Action Required:** Fix PATCH route handler in leaveController

---

## ⚠️ High Priority Issues

### 5. Salary Update Not Saving 🐛

**Frontend:**
```typescript
// client/src/pages/admin/EditSalaryPage.tsx
PUT /api/v1/salary/:employeeId
Body: {
  basicPay: 65000,
  hra: 16000,
  allowances: 6000,
  pfContribution: 7800,
  taxDeduction: 9000,
  effectiveFrom: "2026-02-01"
}
```

**Backend Status:** ⚠️ API exists but update not reflected in database

**Test Result:**
```
❌ Update Salary
Error: Basic pay not updated in DB
Reason: Update logic or DB transaction issue
```

**Impact:** 🟡 HIGH - Cannot modify employee salaries

**Action Required:** Debug salary update controller

---

### 6. Missing Profile Update API ⚠️

**Frontend:**
```typescript
// client/src/pages/employee/ProfilePage.tsx
// client/src/pages/admin/AdminProfilePage.tsx
PUT /api/v1/profile/me
Body: {
  phone: string,
  address: {...},
  emergencyContact: {...}
}
```

**Backend Status:** Only picture/resume upload exists

**Impact:** 🟡 MEDIUM - Cannot edit profile information

**Action Required:** Implement PUT /api/v1/profile/me endpoint

---

## 📊 Database Schema Validation

### Current Schema vs Frontend Requirements

#### ✅ Compatible Tables (No Changes Needed)

**1. users table:**
```sql
✅ id VARCHAR(36)
✅ email VARCHAR(255) UNIQUE
✅ password_hash VARCHAR(255)
✅ role ENUM('admin', 'employee')
✅ is_active BOOLEAN
✅ is_first_login BOOLEAN
✅ last_login TIMESTAMP
✅ created_at, updated_at TIMESTAMP
```
**Status:** Fully supports frontend auth features

---

**2. employees table:**
```sql
✅ id VARCHAR(36)
✅ user_id VARCHAR(36) UNIQUE FK
✅ employee_code VARCHAR(50) UNIQUE
✅ first_name VARCHAR(100)
✅ last_name VARCHAR(100)
✅ phone VARCHAR(20)
✅ department VARCHAR(100)
✅ designation VARCHAR(100)
✅ date_of_joining DATE
✅ profile_picture LONGTEXT
✅ is_active BOOLEAN
✅ created_at, updated_at TIMESTAMP
```
**Status:** Fully supports frontend employee features

---

**3. employee_addresses table:**
```sql
✅ id VARCHAR(36)
✅ employee_id VARCHAR(36) UNIQUE FK
✅ street VARCHAR(255)
✅ city VARCHAR(100)
✅ state VARCHAR(100)
✅ zip_code VARCHAR(20)
✅ country VARCHAR(100)
✅ created_at, updated_at TIMESTAMP
```
**Status:** Matches frontend address form fields

---

**4. emergency_contacts table:**
```sql
✅ id VARCHAR(36)
✅ employee_id VARCHAR(36) UNIQUE FK
✅ name VARCHAR(150)
✅ relationship VARCHAR(50)
✅ phone VARCHAR(20)
✅ created_at, updated_at TIMESTAMP
```
**Status:** Matches frontend emergency contact form

---

**5. attendance table:**
```sql
✅ id VARCHAR(36)
✅ employee_id VARCHAR(36) FK
✅ attendance_date DATE
✅ check_in_time TIME
✅ check_out_time TIME
✅ work_hours DECIMAL(5,2)
✅ extra_hours DECIMAL(5,2)
✅ status ENUM('present', 'absent', 'leave', 'half_day')
✅ remarks TEXT
✅ created_at, updated_at TIMESTAMP
✅ UNIQUE (employee_id, attendance_date)
```
**Status:** Fully supports frontend attendance features

**Frontend Status Mapping:**
```typescript
Frontend: 'Present' | 'Absent' | 'Late' | 'On Leave'
Database: 'present' | 'absent' | 'leave' | 'half_day'

Note: Frontend uses 'Late' but DB uses 'present' with check_in_time > 09:30
```

---

**6. leave_balances table:**
```sql
✅ id VARCHAR(36)
✅ employee_id VARCHAR(36) FK
✅ leave_type ENUM('paid', 'sick')
✅ total_allocated INT
✅ used INT
✅ remaining INT
✅ year INT
✅ created_at, updated_at TIMESTAMP
✅ UNIQUE (employee_id, leave_type, year)
```
**Status:** Matches frontend leave balance display

**Frontend Mapping:**
```typescript
Frontend: paidLeave, sickLeave
Database: leave_type='paid', leave_type='sick'
✅ Compatible
```

---

**7. leave_requests table:**
```sql
✅ id VARCHAR(36)
✅ employee_id VARCHAR(36) FK
✅ leave_type ENUM('paid', 'sick')
✅ start_date DATE
✅ end_date DATE
✅ number_of_days INT
✅ reason TEXT
✅ attachment_url LONGTEXT
✅ status ENUM('pending', 'approved', 'rejected')
✅ admin_remarks TEXT
✅ approved_by VARCHAR(36) FK
✅ approved_at TIMESTAMP
✅ created_at, updated_at TIMESTAMP
```
**Status:** Fully supports frontend leave request features

**Frontend Status Mapping:**
```typescript
Frontend: 'Pending' | 'Approved' | 'Rejected'
Database: 'pending' | 'approved' | 'rejected'
✅ Compatible (case-insensitive comparison)
```

---

**8. salaries table:**
```sql
✅ id VARCHAR(36)
✅ employee_id VARCHAR(36) FK
✅ basic_pay DECIMAL(12,2)
✅ hra DECIMAL(12,2)
✅ allowances DECIMAL(12,2)
✅ pf_contribution DECIMAL(12,2)
✅ tax_deduction DECIMAL(12,2)
✅ gross_salary DECIMAL(12,2)
✅ net_salary DECIMAL(12,2)
✅ effective_from DATE
✅ effective_to DATE
✅ is_active BOOLEAN
✅ created_at, updated_at TIMESTAMP
```
**Status:** Matches frontend salary form

**Frontend Additional Fields (EditSalaryPage.tsx):**
```typescript
specialAllowance: number       // ⚠️ Not in DB
transportAllowance: number     // ⚠️ Not in DB
medicalAllowance: number       // ⚠️ Not in DB
otherAllowances: number        // ✅ Maps to 'allowances'
professionalTax: number        // ⚠️ Not in DB
incomeTax: number              // ✅ Maps to 'tax_deduction'
otherDeductions: number        // ⚠️ Not in DB
```

**Solution:** Use `salary_components` table for detailed breakdown:
```sql
✅ salary_components table exists
✅ component_name VARCHAR(100)
✅ component_type ENUM('earning', 'deduction')
✅ amount DECIMAL(12,2)
```

---

**9. departments table:**
```sql
✅ id VARCHAR(36)
✅ name VARCHAR(100) UNIQUE
✅ description TEXT
✅ head_id VARCHAR(36) FK
✅ is_active BOOLEAN
✅ created_at, updated_at TIMESTAMP
```
**Status:** Supports frontend department dropdown

**Current Departments (sample-data.sql):**
- Engineering
- Human Resources
- Finance
- Marketing
- Sales

**Frontend Uses:**
- IT (⚠️ not in DB - same as Engineering?)
- HR (✅ Human Resources)
- Finance (✅)
- Marketing (✅)
- Sales (✅)
- Operations (⚠️ not in DB)

**Action Required:** Add missing departments or map frontend values

---

**10. designations table:**
```sql
✅ id VARCHAR(36)
✅ name VARCHAR(100) UNIQUE
✅ description TEXT
✅ department_id VARCHAR(36) FK
✅ level INT
✅ is_active BOOLEAN
✅ created_at, updated_at TIMESTAMP
```
**Status:** Supports frontend designation dropdown

**Current Designations (sample-data.sql):**
- CEO, CTO, Senior Software Engineer, Software Engineer
- HR Manager, HR Executive
- Senior Accountant, Accountant

---

#### ⚠️ Potential Issues

**1. Department Name Mismatch:**
```typescript
Frontend Mock: 'IT', 'Operations'
Database: 'Engineering', 'Human Resources', 'Finance', 'Marketing', 'Sales'

Solution: 
- Add 'IT' and 'Operations' to departments table
- Or map frontend 'IT' → 'Engineering'
```

**2. Salary Components Breakdown:**
```typescript
Frontend has detailed breakdown:
- specialAllowance, transportAllowance, medicalAllowance
- professionalTax, otherDeductions

Backend has aggregated:
- allowances (sum of all allowances)
- tax_deduction (sum of all taxes)

Solution: Use salary_components table for details
```

**3. Attendance Status Naming:**
```typescript
Frontend: 'Late' status
Database: No 'late' in ENUM, uses 'present' with late check_in_time

Solution: Backend logic checks if check_in_time > 09:30, 
          frontend displays as "Late" based on time
```

---

## 🔄 Field Mapping Reference

### Authentication
```typescript
Frontend                    Backend/Database
─────────────────────────────────────────────
email                    → users.email
password                 → users.password_hash (bcrypt)
role                     → users.role
isFirstLogin             → users.is_first_login
accessToken              → JWT (1h expiry)
refreshToken             → JWT (7d expiry)
```

### Employee
```typescript
Frontend                    Backend/Database
─────────────────────────────────────────────
id                       → employees.id
employeeCode             → employees.employee_code
firstName                → employees.first_name
lastName                 → employees.last_name
email                    → users.email (via user_id FK)
phone                    → employees.phone
department               → employees.department
designation              → employees.designation
dateOfJoining            → employees.date_of_joining
profilePicture           → employees.profile_picture
isActive                 → employees.is_active
workStatus               → Calculated from attendance table
```

### Address
```typescript
Frontend                    Backend/Database
─────────────────────────────────────────────
street                   → employee_addresses.street
city                     → employee_addresses.city
state                    → employee_addresses.state
zipCode                  → employee_addresses.zip_code
country                  → employee_addresses.country
```

### Emergency Contact
```typescript
Frontend                    Backend/Database
─────────────────────────────────────────────
emergencyContactName     → emergency_contacts.name
emergencyContactRelation → emergency_contacts.relationship
emergencyContactPhone    → emergency_contacts.phone
```

### Attendance
```typescript
Frontend                    Backend/Database
─────────────────────────────────────────────
date                     → attendance.attendance_date
checkIn                  → attendance.check_in_time
checkOut                 → attendance.check_out_time
workHours                → attendance.work_hours
overtime                 → attendance.extra_hours
status                   → attendance.status
remarks                  → attendance.remarks
```

### Leave
```typescript
Frontend                    Backend/Database
─────────────────────────────────────────────
leaveType                → leave_requests.leave_type
startDate                → leave_requests.start_date
endDate                  → leave_requests.end_date
numberOfDays             → leave_requests.number_of_days
reason                   → leave_requests.reason
attachmentUrl            → leave_requests.attachment_url
status                   → leave_requests.status
adminRemarks             → leave_requests.admin_remarks
approvedBy               → leave_requests.approved_by
approvedOn               → leave_requests.approved_at
appliedOn                → leave_requests.created_at
```

### Salary
```typescript
Frontend                    Backend/Database
─────────────────────────────────────────────
basicPay                 → salaries.basic_pay
hra                      → salaries.hra
allowances               → salaries.allowances (aggregated)
pfContribution           → salaries.pf_contribution
taxDeduction             → salaries.tax_deduction (aggregated)
grossSalary              → salaries.gross_salary (calculated)
netSalary                → salaries.net_salary (calculated)
effectiveFrom            → salaries.effective_from

// Detailed breakdown
specialAllowance         → salary_components (component_name, amount)
transportAllowance       → salary_components (component_name, amount)
medicalAllowance         → salary_components (component_name, amount)
professionalTax          → salary_components (component_name, amount)
```

---

## 📝 Integration Action Plan

### Phase 1: Fix Critical Blockers (Day 1)

#### Task 1.1: Fix Credential Mismatch ⚠️ CRITICAL
```typescript
File: client/src/pages/auth/LoginPage.tsx

Change:
- admin@company.com / Admin@123
- employee@company.com / Employee@123

To:
+ admin@dayflow.com / Password@123
+ john.doe@dayflow.com / Password@123
```

**Time Estimate:** 5 minutes  
**Priority:** 🔴 CRITICAL

---

#### Task 1.2: Implement Check-in API ❌ CRITICAL
```typescript
Files to create/modify:
1. server/src/controllers/attendanceController.ts
   - Add checkIn function
   - Add checkOut function

2. server/src/routes/attendance.ts
   - Add POST /checkin route
   - Add POST /checkout route

3. Test endpoints with Postman/curl
```

**Time Estimate:** 2-3 hours  
**Priority:** 🔴 CRITICAL

---

#### Task 1.3: Implement Admin Dashboard Stats API ❌ CRITICAL
```typescript
File: server/src/controllers/dashboardController.ts (new)

Create:
- getAdminStats() function
- Queries for: total employees, present/absent/leave counts,
  pending leave requests, recent employees, recent leaves

File: server/src/routes/dashboard.ts (new)
- GET /admin/stats route

File: server/src/index.ts
- Add dashboard routes
```

**Time Estimate:** 3-4 hours  
**Priority:** 🔴 CRITICAL

---

#### Task 1.4: Implement Employee Dashboard Stats API ❌ CRITICAL
```typescript
File: server/src/controllers/dashboardController.ts

Create:
- getEmployeeStats() function
- Queries for: check-in status, monthly attendance,
  leave balance, pending actions, recent records

File: server/src/routes/dashboard.ts
- GET /employee/stats route
```

**Time Estimate:** 2-3 hours  
**Priority:** 🔴 CRITICAL

---

### Phase 2: Fix High Priority Bugs (Day 2)

#### Task 2.1: Fix Leave Approval PATCH Bug 🐛
```typescript
File: server/src/controllers/leaveController.ts

Debug:
- Check PATCH route handler
- Verify updateLeaveRequestStatus function
- Ensure JSON response, not HTML
- Test with curl/Postman
```

**Time Estimate:** 1-2 hours  
**Priority:** 🔴 HIGH

---

#### Task 2.2: Fix Salary Update Bug 🐛
```typescript
File: server/src/controllers/salaryController.ts

Debug:
- Check updateSalary function
- Verify database transaction
- Ensure new record is created (not updated)
- Test salary update flow
```

**Time Estimate:** 1-2 hours  
**Priority:** 🔴 HIGH

---

#### Task 2.3: Implement Profile Update API
```typescript
File: server/src/controllers/profileController.ts

Create:
- updateProfile() function
- Allow editing: phone, address, emergency contact

File: server/src/routes/profile.ts
- Add PUT /me route
```

**Time Estimate:** 1-2 hours  
**Priority:** 🟡 MEDIUM

---

### Phase 3: Database Adjustments (Day 2)

#### Task 3.1: Add Missing Departments
```sql
File: database/seeds/sample-data.sql

INSERT INTO departments (name, description, is_active) VALUES
('IT', 'Information Technology', TRUE),
('Operations', 'Operations Department', TRUE);
```

**Time Estimate:** 10 minutes  
**Priority:** 🟡 MEDIUM

---

#### Task 3.2: Update Sample Credentials (Optional)
```sql
File: database/seeds/sample-data.sql

Option: Update emails to match frontend
- Change admin@dayflow.com → admin@company.com
- Change john.doe@dayflow.com → employee@company.com

OR keep backend as-is and update frontend (RECOMMENDED)
```

**Time Estimate:** 5 minutes  
**Priority:** 🟢 LOW (if Task 1.1 done)

---

### Phase 4: Frontend API Integration (Day 3)

#### Task 4.1: Create API Client
```typescript
File: client/src/utils/api.ts (new)

Create:
- Axios instance with baseURL
- Request interceptor (add auth token)
- Response interceptor (handle 401, refresh token)
```

**Time Estimate:** 30 minutes  
**Priority:** 🔴 HIGH

---

#### Task 4.2: Create API Services
```typescript
Files to create:
- client/src/services/authService.ts
- client/src/services/employeeService.ts
- client/src/services/attendanceService.ts
- client/src/services/leaveService.ts
- client/src/services/salaryService.ts
- client/src/services/profileService.ts
- client/src/services/dashboardService.ts
```

**Time Estimate:** 2-3 hours  
**Priority:** 🔴 HIGH

---

#### Task 4.3: Replace Mock Data with API Calls
```typescript
Files to update (17 pages):
1. LoginPage.tsx - Replace DUMMY_USERS with authService.login()
2. AdminDashboard.tsx - Replace mock stats with dashboardService
3. EmployeesPage.tsx - Replace MOCK_EMPLOYEES with employeeService
4. AddEmployeePage.tsx - Uncomment API call
5. EditEmployeePage.tsx - Uncomment API calls
6. ViewEmployeePage.tsx - Add API call
7. AttendancePage.tsx - Replace MOCK_ATTENDANCE with attendanceService
8. LeavePage.tsx - Replace MOCK_LEAVE_REQUESTS with leaveService
9. EditSalaryPage.tsx - Replace mock with salaryService
10. AdminProfilePage.tsx - Add API calls
11. EmployeeDashboard.tsx - Replace mock with dashboardService
12. CheckInsPage.tsx - Replace mock with attendanceService
13. LeaveRequestPage.tsx - Replace mock with leaveService
14. ProfilePage.tsx - Add API calls
15. employee/AttendancePage.tsx - Add API calls
16. ChangePasswordFirstLogin.tsx - Uncomment API call
17. HomePage.tsx - No API needed
```

**Time Estimate:** 6-8 hours  
**Priority:** 🔴 HIGH

---

### Phase 5: Testing & Validation (Day 4)

#### Task 5.1: Test All API Endpoints
```bash
- Test login flow (admin & employee)
- Test password change (first login & regular)
- Test employee CRUD operations
- Test attendance check-in/out
- Test leave request & approval
- Test salary operations
- Test profile updates
- Test dashboard stats
```

**Time Estimate:** 4-5 hours  
**Priority:** 🔴 HIGH

---

#### Task 5.2: Test Frontend-Backend Integration
```bash
- Login with real credentials
- Create new employee
- Check-in/out as employee
- Request leave as employee
- Approve leave as admin
- Update salary as admin
- Edit profile
- Verify dashboard stats
```

**Time Estimate:** 3-4 hours  
**Priority:** 🔴 HIGH

---

#### Task 5.3: Error Handling & Edge Cases
```bash
- Test invalid credentials
- Test expired tokens
- Test insufficient leave balance
- Test overlapping leave dates
- Test double check-in prevention
- Test role-based access control
- Test network errors
- Test form validations
```

**Time Estimate:** 2-3 hours  
**Priority:** 🟡 MEDIUM

---

## 🔧 Quick Start Integration Guide

### Step 1: Update Frontend Credentials (5 min)
```typescript
// client/src/pages/auth/LoginPage.tsx
const DUMMY_USERS = {
  admin: { 
    email: 'admin@dayflow.com',        // ✅ UPDATED
    password: 'Password@123',           // ✅ UPDATED
    role: 'admin' 
  },
  employee: { 
    email: 'john.doe@dayflow.com',     // ✅ UPDATED
    password: 'Password@123',           // ✅ UPDATED
    role: 'employee' 
  }
}
```

### Step 2: Add Missing Departments (10 min)
```sql
-- Run in MySQL
USE hrms_db;

INSERT INTO departments (id, name, description, is_active) VALUES
(UUID(), 'IT', 'Information Technology Department', TRUE),
(UUID(), 'Operations', 'Operations and Logistics', TRUE);
```

### Step 3: Implement Check-in API (2-3 hours)
```typescript
// server/src/controllers/attendanceController.ts
export const checkIn = async (req: AuthRequest, res: Response) => {
  try {
    const { checkInTime, location, remarks } = req.body;
    const { Employee, Attendance } = req.app.locals.models;
    
    const employee = await Employee.findOne({ 
      where: { userId: req.user?.userId } 
    });
    
    if (!employee) {
      return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // Check if already checked in
    const existing = await Attendance.findOne({
      where: { employeeId: employee.id, attendanceDate: today }
    });
    
    if (existing) {
      return res.status(400).json(errorResponse('Already checked in today', 'ATT_002'));
    }
    
    // Determine status (late if after 9:30 AM)
    const checkInHour = parseInt(checkInTime.split(':')[0]);
    const checkInMinute = parseInt(checkInTime.split(':')[1]);
    const isLate = checkInHour > 9 || (checkInHour === 9 && checkInMinute > 30);
    
    const attendance = await Attendance.create({
      employeeId: employee.id,
      attendanceDate: today,
      checkInTime,
      status: 'present',
      remarks: isLate ? `Late check-in. ${remarks || ''}` : remarks,
    });
    
    res.status(201).json(
      successResponse('Checked in successfully', {
        attendanceId: attendance.id,
        checkInTime,
        date: today,
        isLate,
      })
    );
  } catch (error: any) {
    console.error('Check-in error:', error);
    res.status(500).json(errorResponse('Failed to check in', 'GEN_003'));
  }
};

export const checkOut = async (req: AuthRequest, res: Response) => {
  try {
    const { checkOutTime, remarks } = req.body;
    const { Employee, Attendance } = req.app.locals.models;
    
    const employee = await Employee.findOne({ 
      where: { userId: req.user?.userId } 
    });
    
    if (!employee) {
      return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    const attendance = await Attendance.findOne({
      where: { employeeId: employee.id, attendanceDate: today }
    });
    
    if (!attendance) {
      return res.status(400).json(errorResponse('Must check in first', 'ATT_003'));
    }
    
    if (attendance.checkOutTime) {
      return res.status(400).json(errorResponse('Already checked out', 'ATT_004'));
    }
    
    // Calculate work hours
    const checkIn = new Date(`1970-01-01T${attendance.checkInTime}`);
    const checkOut = new Date(`1970-01-01T${checkOutTime}`);
    const diffMs = checkOut.getTime() - checkIn.getTime();
    const workHours = (diffMs / (1000 * 60 * 60)).toFixed(2);
    
    // Calculate extra hours (if > 9 hours)
    const extraHours = parseFloat(workHours) > 9 
      ? (parseFloat(workHours) - 9).toFixed(2) 
      : '0.00';
    
    await attendance.update({
      checkOutTime,
      workHours: parseFloat(workHours),
      extraHours: parseFloat(extraHours),
      remarks: remarks || attendance.remarks,
    });
    
    res.json(
      successResponse('Checked out successfully', {
        attendanceId: attendance.id,
        checkInTime: attendance.checkInTime,
        checkOutTime,
        workHours,
        extraHours,
      })
    );
  } catch (error: any) {
    console.error('Check-out error:', error);
    res.status(500).json(errorResponse('Failed to check out', 'GEN_003'));
  }
};
```

### Step 4: Add Routes (5 min)
```typescript
// server/src/routes/attendance.ts
import { checkIn, checkOut } from '../controllers/attendanceController';

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
```

### Step 5: Test APIs (30 min)
```bash
# Check-in
curl -X POST http://localhost:3000/api/v1/attendance/checkin \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"checkInTime":"09:15:00","remarks":"On time"}'

# Check-out
curl -X POST http://localhost:3000/api/v1/attendance/checkout \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"checkOutTime":"18:30:00","remarks":"Good day"}'
```

---

## 📊 Database Changes Summary

### Required Changes:
```sql
-- 1. Add missing departments
INSERT INTO departments (id, name, description, is_active) VALUES
(UUID(), 'IT', 'Information Technology', TRUE),
(UUID(), 'Operations', 'Operations Department', TRUE);

-- Verify
SELECT * FROM departments;
```

### Optional Changes:
```sql
-- 2. Update credentials to match frontend (NOT RECOMMENDED)
UPDATE users SET email = 'admin@company.com' 
WHERE email = 'admin@dayflow.com';

UPDATE users SET email = 'employee@company.com' 
WHERE email = 'john.doe@dayflow.com';

-- Update corresponding employees
UPDATE employees e
JOIN users u ON e.user_id = u.id
SET e.email = u.email;
```

### No Changes Needed:
- ✅ All table structures are compatible
- ✅ All column types are correct
- ✅ All foreign keys are properly defined
- ✅ All indexes are in place
- ✅ All ENUM values match frontend

---

## ✅ Integration Checklist

### Backend Preparation
- [ ] Add IT & Operations departments to database
- [ ] Implement POST /api/v1/attendance/checkin
- [ ] Implement POST /api/v1/attendance/checkout
- [ ] Implement GET /api/v1/dashboard/admin/stats
- [ ] Implement GET /api/v1/dashboard/employee/stats
- [ ] Fix PATCH /api/v1/leaves/requests/:id bug
- [ ] Fix PUT /api/v1/salary/:employeeId bug
- [ ] Implement PUT /api/v1/profile/me
- [ ] Test all endpoints with Postman
- [ ] Verify CORS settings for localhost:5173

### Frontend Preparation
- [ ] Update LoginPage.tsx credentials
- [ ] Create client/src/utils/api.ts
- [ ] Create all service files (7 services)
- [ ] Update LoginPage.tsx with API call
- [ ] Update AdminDashboard.tsx with API call
- [ ] Update EmployeesPage.tsx with API call
- [ ] Uncomment AddEmployeePage.tsx API call
- [ ] Uncomment EditEmployeePage.tsx API calls
- [ ] Add ViewEmployeePage.tsx API call
- [ ] Update AttendancePage.tsx with API call
- [ ] Update LeavePage.tsx with API call
- [ ] Update EditSalaryPage.tsx with API call
- [ ] Add AdminProfilePage.tsx API calls
- [ ] Update EmployeeDashboard.tsx with API call
- [ ] Update CheckInsPage.tsx with API calls
- [ ] Update LeaveRequestPage.tsx with API calls
- [ ] Add ProfilePage.tsx API calls
- [ ] Uncomment ChangePasswordFirstLogin.tsx API call

### Testing
- [ ] Test login flow (admin)
- [ ] Test login flow (employee)
- [ ] Test first-time password change
- [ ] Test employee CRUD operations
- [ ] Test check-in/out flow
- [ ] Test leave request & approval
- [ ] Test salary update
- [ ] Test profile updates
- [ ] Test admin dashboard stats
- [ ] Test employee dashboard stats
- [ ] Test role-based access control
- [ ] Test error handling
- [ ] Test token refresh
- [ ] Test logout

### Deployment
- [ ] Update .env with production values
- [ ] Configure CORS for production domain
- [ ] Set up SSL/TLS
- [ ] Configure database backups
- [ ] Set up monitoring
- [ ] Configure logging
- [ ] Test production build

---

## 🎯 Estimated Timeline

| Phase | Tasks | Time | Priority |
|-------|-------|------|----------|
| **Phase 1** | Fix Critical Blockers | 8-12 hours | 🔴 CRITICAL |
| **Phase 2** | Fix High Priority Bugs | 3-5 hours | 🔴 HIGH |
| **Phase 3** | Database Adjustments | 30 minutes | 🟡 MEDIUM |
| **Phase 4** | Frontend Integration | 8-11 hours | 🔴 HIGH |
| **Phase 5** | Testing & Validation | 9-12 hours | 🔴 HIGH |
| **Total** | All Phases | **28-40 hours** | - |

**Realistic Estimate:** 4-5 working days (8 hours/day)

---

## 📞 Support & References

### Documentation Files
- [CLIENT_FEATURES_DOCUMENTATION.md](./CLIENT_FEATURES_DOCUMENTATION.md) - Frontend complete reference
- [SERVER_API_DOCUMENTATION.md](./SERVER_API_DOCUMENTATION.md) - Backend complete reference
- [TEST_RESULTS.md](./server/TEST_RESULTS.md) - Backend test results
- [API_CONTRACT.md](./doc/API_CONTRACT.md) - API specifications

### Database
- Schema: [database/schema.sql](./database/schema.sql)
- Sample Data: [database/seeds/sample-data.sql](./database/seeds/sample-data.sql)
- Models: [database/models/](./database/models/)

### Quick Commands
```bash
# Start Backend
cd server
npm run dev

# Start Frontend
cd client
npm run dev

# Database Migration
cd database
npm run migrate

# Run Tests
cd server
node test-backend-e2e.js  # (if exists)
```

---

**Document Generated:** January 3, 2026  
**Integration Status:** Pre-Integration  
**Ready to Connect:** After Phase 1-2 completion (11-17 hours)  
**Full Integration:** After Phase 1-5 completion (28-40 hours)
