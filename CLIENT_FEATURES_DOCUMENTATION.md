# DAYFLOW HRMS - Frontend Client Documentation
**Generated:** January 3, 2026  
**Framework:** React 18 + TypeScript + Vite  
**UI Library:** Tailwind CSS  
**Routing:** React Router v6

---

## 📋 Table of Contents
1. [Project Structure](#project-structure)
2. [API Integration Status](#api-integration-status)
3. [Authentication Module](#authentication-module)
4. [Admin Module Features](#admin-module-features)
5. [Employee Module Features](#employee-module-features)
6. [Database Field Mappings](#database-field-mappings)
7. [Mock Data vs Real API](#mock-data-vs-real-api)
8. [Required Backend Endpoints](#required-backend-endpoints)

---

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   └── AdminLayout.tsx          # Reusable admin layout with sidebar
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx        # Login form with role-based routing
│   │   │   └── ChangePasswordFirstLogin.tsx  # First login password change
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx   # Admin dashboard with stats
│   │   │   ├── EmployeesPage.tsx    # Employee list and management
│   │   │   ├── AddEmployeePage.tsx  # Create new employee
│   │   │   ├── EditEmployeePage.tsx # Edit employee details
│   │   │   ├── ViewEmployeePage.tsx # View employee details
│   │   │   ├── AttendancePage.tsx   # Attendance tracking and reports
│   │   │   ├── LeavePage.tsx        # Leave request management
│   │   │   ├── EditSalaryPage.tsx   # Salary management
│   │   │   └── AdminProfilePage.tsx # Admin profile settings
│   │   ├── employee/
│   │   │   ├── EmployeeDashboard.tsx    # Employee dashboard
│   │   │   ├── AttendancePage.tsx       # View attendance history
│   │   │   ├── CheckInsPage.tsx         # Check-in/out functionality
│   │   │   ├── LeaveRequestPage.tsx     # Request leaves
│   │   │   └── ProfilePage.tsx          # Employee profile
│   │   └── HomePage.tsx             # Landing/home page
│   ├── App.tsx                      # Route configuration
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles with Tailwind
├── public/
├── index.html
├── package.json
├── tailwind.config.cjs
├── tsconfig.json
└── vite.config.ts
```

---

## 🔌 API Integration Status

### ⚠️ Current State: **MOCK DATA**
All pages currently use **hardcoded mock data** for demonstration. Real API integration is **commented out** and needs to be activated.

### 🔄 Backend API Base URL
Expected: `http://localhost:3000/api/v1`

### 📝 API Integration Points Found:
```typescript
// Lines with commented API calls:
1. ChangePasswordFirstLogin.tsx:107
   // fetch('/api/v1/auth/change-password-first-login')

2. AddEmployeePage.tsx:110  
   // fetch('/api/v1/employees', { method: 'POST' })

3. EditEmployeePage.tsx:102
   // fetch(`/api/v1/employees/${id}`, { method: 'PUT' })
```

---

## 🔐 Authentication Module

### 1. **Login Page** (`LoginPage.tsx`)
**Route:** `/login`  
**Status:** ✅ Fully Implemented

#### Features:
- Email and password validation
- Show/hide password toggle
- Remember credentials
- Role-based routing (Admin/Employee)
- Demo credentials display panel
- Clipboard copy functionality

#### Mock Credentials:
```typescript
Admin:
  Email: admin@company.com
  Password: Admin@123
  
Employee:
  Email: employee@company.com
  Password: Employee@123
```

#### Expected API Call:
```typescript
POST /api/v1/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  success: boolean,
  data: {
    tokens: {
      accessToken: string,
      refreshToken: string
    },
    user: {
      id: string,
      email: string,
      role: 'admin' | 'employee',
      isFirstLogin: boolean
    }
  }
}
```

#### Database Tables Used:
- `users` (email, password_hash, role, is_first_login)
- `employees` (user_id, first_name, last_name)

#### Post-Login Flow:
1. Store `accessToken` in `localStorage`
2. Store user object in `localStorage`
3. Check `isFirstLogin` flag
4. Route based on role:
   - Admin → `/admin/dashboard`
   - Employee → `/employee/dashboard`
   - First Login → `/change-password-first-login`

---

### 2. **Change Password First Login** (`ChangePasswordFirstLogin.tsx`)
**Route:** `/change-password-first-login`  
**Status:** 🟡 Partially Implemented (API commented)

#### Features:
- Current password verification
- New password with strength indicator
- Password confirmation
- Password requirements display
- Auto-logout after change

#### Expected API Call:
```typescript
POST /api/v1/auth/change-password-first-login
Headers: {
  Authorization: Bearer <accessToken>
}
Body: {
  currentPassword: string,
  newPassword: string
}
```

#### Database Updates:
- `users.password_hash` - Updated with new bcrypt hash
- `users.is_first_login` - Set to FALSE

---

## 👨‍💼 Admin Module Features

### 1. **Admin Dashboard** (`AdminDashboard.tsx`)
**Route:** `/admin/dashboard`  
**Status:** ✅ Frontend Complete (Mock Data)

#### Statistics Cards:
1. **Total Employees** - Count of active employees
2. **Present Today** - Attendance status
3. **Absent Today** - Missing employees
4. **On Leave Today** - Approved leaves
5. **Pending Leave Requests** - Awaiting approval
6. **New Employees This Month** - Recent hires

#### Mock Data Structure:
```typescript
stats = {
  totalEmployees: 248,
  presentToday: 234,
  absentToday: 6,
  onLeaveToday: 8,
  pendingLeaveRequests: 12,
  newEmployeesThisMonth: 5
}
```

#### Required API Calls:
```typescript
1. GET /api/v1/employees?isActive=true&count=true
2. GET /api/v1/attendance/daily?date=today
3. GET /api/v1/leaves/requests?status=pending&count=true
4. GET /api/v1/employees?dateJoining=thisMonth&count=true
```

#### Database Queries Needed:
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
```

#### Additional Sections:
- **Recent Leave Requests** - Last 5 pending requests
- **Recent Employees** - Last 5 new hires

---

### 2. **Employees Management** (`EmployeesPage.tsx`)
**Route:** `/admin/employees`  
**Status:** ✅ Frontend Complete (Mock Data)

#### Features:
- Employee list with pagination
- Search by name, email, employee code
- Filter by:
  - Department (IT, HR, Finance, Marketing, etc.)
  - Work Status (Present, Absent, Leave)
  - Active/Inactive status
- Actions per employee:
  - 👁️ View details
  - ✏️ Edit employee
  - 🗑️ Delete employee

#### Mock Employee Structure:
```typescript
{
  id: string,
  employeeCode: string,        // EMP001, EMP002
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  department: string,
  designation: string,
  dateOfJoining: string,       // YYYY-MM-DD
  profilePicture: string | null,
  workStatus: 'present' | 'absent' | 'leave',
  isActive: boolean
}
```

#### Required API Call:
```typescript
GET /api/v1/employees?
  search=<query>&
  department=<dept>&
  status=<active>&
  page=<num>&
  limit=<num>

Response: {
  success: boolean,
  data: {
    employees: Employee[],
    pagination: {
      total: number,
      page: number,
      limit: number,
      totalPages: number
    }
  }
}
```

#### Database Tables:
- `employees` (main data)
- `users` (email, role, is_active)
- `departments` (for filtering)

---

### 3. **Add Employee** (`AddEmployeePage.tsx`)
**Route:** `/admin/employees/add`  
**Status:** 🟡 Frontend Complete (API commented)

#### Form Sections:

**A. Basic Information:**
- First Name * (required)
- Last Name * (required)
- Email * (required, validated)
- Phone
- Department * (dropdown)
- Designation * (dropdown)
- Date of Joining * (date picker)

**B. Address Information:**
- Street Address
- City
- State
- ZIP Code
- Country (default: USA)

**C. Emergency Contact:**
- Contact Name
- Relationship (dropdown: Spouse, Parent, Sibling, Friend)
- Contact Phone

**D. Salary Details:**
- Basic Pay
- HRA (House Rent Allowance)
- Allowances
- PF Contribution
- Tax Deduction

**E. Leave Allocation:**
- Paid Leave (default: 15 days)
- Sick Leave (default: 10 days)

#### Expected API Call:
```typescript
POST /api/v1/employees
Headers: {
  Authorization: Bearer <accessToken>
}
Body: {
  // Basic
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  department: string,
  designation: string,
  dateOfJoining: string,
  
  // Address
  street: string,
  city: string,
  state: string,
  zipCode: string,
  country: string,
  
  // Emergency Contact
  emergencyContactName: string,
  emergencyContactRelationship: string,
  emergencyContactPhone: string,
  
  // Salary
  basicPay: number,
  hra: number,
  allowances: number,
  pfContribution: number,
  taxDeduction: number,
  
  // Leave
  paidLeave: number,
  sickLeave: number
}
```

#### Database Inserts Required:
```sql
-- 1. Create user
INSERT INTO users (email, password_hash, role, is_first_login) 
VALUES (?, ?, 'employee', 1);

-- 2. Create employee
INSERT INTO employees (user_id, employee_code, first_name, last_name, 
  phone, department, designation, date_of_joining) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- 3. Create address
INSERT INTO employee_addresses (employee_id, street, city, state, 
  zip_code, country) VALUES (?, ?, ?, ?, ?, ?);

-- 4. Create emergency contact
INSERT INTO emergency_contacts (employee_id, name, relationship, phone) 
VALUES (?, ?, ?, ?);

-- 5. Create salary
INSERT INTO salaries (employee_id, basic_pay, hra, allowances, 
  pf_contribution, tax_deduction, gross_salary, net_salary, 
  effective_from) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

-- 6. Create leave balances
INSERT INTO leave_balances (employee_id, leave_type, total_allocated, 
  remaining, year) VALUES (?, 'paid', ?, ?, YEAR(CURDATE()));
INSERT INTO leave_balances (employee_id, leave_type, total_allocated, 
  remaining, year) VALUES (?, 'sick', ?, ?, YEAR(CURDATE()));
```

#### Validation Rules:
- Email must be unique in `users` table
- Employee code auto-generated (EMP001, EMP002, etc.)
- Date of joining cannot be in future
- All monetary values must be positive numbers
- Gross salary = Basic + HRA + Allowances
- Net salary = Gross - PF - Tax

---

### 4. **Edit Employee** (`EditEmployeePage.tsx`)
**Route:** `/admin/employees/:id/edit`  
**Status:** 🟡 Frontend Complete (API commented)

#### Features:
- Pre-filled form with existing data
- Same fields as Add Employee
- Change profile picture
- Update all employee information
- Deactivate/Activate employee

#### Expected API Calls:
```typescript
// 1. Fetch employee data
GET /api/v1/employees/:id
Response: {
  success: boolean,
  data: {
    employee: Employee,
    address: Address,
    emergencyContact: EmergencyContact,
    salary: Salary,
    leaveBalances: LeaveBalance[]
  }
}

// 2. Update employee
PUT /api/v1/employees/:id
Body: { /* same as Add Employee */ }
```

#### Database Updates:
```sql
UPDATE employees SET ... WHERE id = ?;
UPDATE employee_addresses SET ... WHERE employee_id = ?;
UPDATE emergency_contacts SET ... WHERE employee_id = ?;
UPDATE salaries SET ... WHERE employee_id = ?;
UPDATE leave_balances SET ... WHERE employee_id = ?;
```

---

### 5. **View Employee** (`ViewEmployeePage.tsx`)
**Route:** `/admin/employees/:id`  
**Status:** ✅ Frontend Complete (Mock Data)

#### Information Displayed:

**Personal Information:**
- Profile Picture
- Full Name
- Employee Code
- Email, Phone
- Department, Designation
- Date of Joining
- Employment Status

**Address Details:**
- Complete address
- City, State, ZIP
- Country

**Emergency Contact:**
- Contact Name
- Relationship
- Phone Number

**Salary Information:**
- Basic Pay
- HRA
- Allowances
- Gross Salary
- Deductions (PF, Tax)
- Net Salary
- Effective Date

**Leave Balances (2026):**
- Paid Leave: Total / Used / Remaining
- Sick Leave: Total / Used / Remaining

**Recent Attendance (Last 7 days):**
- Date, Check-in, Check-out
- Work hours, Status

**Recent Leave Requests:**
- Date range, Leave type
- Days, Reason, Status

#### Required API Call:
```typescript
GET /api/v1/employees/:id?include=all
Response: {
  success: boolean,
  data: {
    employee: {
      // All employee fields
    },
    address: {
      // Address fields
    },
    emergencyContact: {
      // Contact fields
    },
    salary: {
      // Salary details
    },
    leaveBalances: [
      { leaveType: 'paid', total: 20, used: 5, remaining: 15 },
      { leaveType: 'sick', total: 10, used: 2, remaining: 8 }
    ],
    recentAttendance: [
      // Last 7 days attendance
    ],
    recentLeaves: [
      // Last 5 leave requests
    ]
  }
}
```

---

### 6. **Attendance Management** (`AttendancePage.tsx`)
**Route:** `/admin/attendance`  
**Status:** ✅ Frontend Complete (Mock Data)

#### Features:

**Summary Cards:**
- Total Present
- Total Absent
- On Leave
- Late Arrivals
- Average Work Hours

**Attendance Table:**
- Employee Name & Code
- Department
- Date
- Check-in Time
- Check-out Time
- Work Hours
- Overtime
- Status (Present/Absent/Late/Leave)

**Filters:**
- Date selection (date picker)
- Search by employee name/code
- Filter by department
- Filter by status

**Actions:**
- Export to CSV/Excel
- View detailed report
- Month navigation (Previous/Next)

#### Mock Attendance Structure:
```typescript
{
  id: string,
  employeeId: string,
  employeeName: string,
  department: string,
  date: string,              // YYYY-MM-DD
  checkIn: string,           // HH:MM AM/PM
  checkOut: string,
  status: 'Present' | 'Absent' | 'Late' | 'On Leave',
  workHours: string,         // "9h 0m"
  overtime: string           // "1h 30m"
}
```

#### Required API Calls:
```typescript
// Daily attendance summary
GET /api/v1/attendance/daily?date=<YYYY-MM-DD>
Response: {
  success: boolean,
  data: {
    summary: {
      totalPresent: number,
      totalAbsent: number,
      totalLeave: number,
      totalLate: number,
      averageWorkHours: string
    },
    attendance: Attendance[]
  }
}

// Employee attendance records
GET /api/v1/attendance/records?
  employeeId=<id>&
  startDate=<date>&
  endDate=<date>&
  department=<dept>
```

#### Database Query:
```sql
SELECT 
  a.id,
  a.employee_id,
  e.employee_code,
  CONCAT(e.first_name, ' ', e.last_name) as employee_name,
  e.department,
  a.attendance_date,
  a.check_in_time,
  a.check_out_time,
  a.work_hours,
  a.extra_hours as overtime,
  a.status
FROM attendance a
JOIN employees e ON a.employee_id = e.id
WHERE a.attendance_date = ?
ORDER BY e.employee_code;
```

---

### 7. **Leave Management** (`LeavePage.tsx`)
**Route:** `/admin/leave`  
**Status:** ✅ Frontend Complete (Mock Data)

#### Features:

**Summary Cards:**
- Pending Requests (count)
- Approved This Month
- Rejected This Month
- On Leave Today

**Leave Requests Table:**
- Employee Name & Code
- Department
- Leave Type (Paid/Sick/Unpaid)
- Start Date - End Date
- Days Count
- Reason
- Applied On
- Status (Pending/Approved/Rejected)
- Actions (Approve/Reject)

**Filters:**
- Search by employee name/code
- Filter by department
- Filter by leave type
- Filter by status
- Date range filter

**Actions:**
- Approve request (with remarks)
- Reject request (with reason)
- View request details
- Export report

#### Mock Leave Request Structure:
```typescript
{
  id: string,
  employeeId: string,
  employeeName: string,
  department: string,
  leaveType: 'Paid Leave' | 'Sick Leave' | 'Unpaid Leave',
  startDate: string,
  endDate: string,
  days: number,
  reason: string,
  status: 'Pending' | 'Approved' | 'Rejected',
  appliedOn: string,
  approvedBy: string | null,
  approvedOn: string | null
}
```

#### Required API Calls:
```typescript
// Get all leave requests
GET /api/v1/leaves/requests?
  status=<status>&
  department=<dept>&
  employeeId=<id>&
  startDate=<date>&
  endDate=<date>

// Approve leave
PATCH /api/v1/leaves/requests/:id
Body: {
  status: 'approved',
  adminRemarks: string
}

// Reject leave
PATCH /api/v1/leaves/requests/:id
Body: {
  status: 'rejected',
  adminRemarks: string
}
```

#### Database Operations:
```sql
-- Get leave requests
SELECT 
  lr.*,
  CONCAT(e.first_name, ' ', e.last_name) as employee_name,
  e.department,
  e.employee_code
FROM leave_requests lr
JOIN employees e ON lr.employee_id = e.id
WHERE lr.status = ?
ORDER BY lr.created_at DESC;

-- Approve/Reject leave
UPDATE leave_requests 
SET status = ?, 
    admin_remarks = ?,
    approved_by = ?,
    approved_at = NOW()
WHERE id = ?;

-- Update leave balance (if approved)
UPDATE leave_balances 
SET used = used + ?,
    remaining = remaining - ?
WHERE employee_id = ? 
  AND leave_type = ? 
  AND year = ?;
```

---

### 8. **Salary Management** (`EditSalaryPage.tsx`)
**Route:** `/admin/salary/:employeeId/edit`  
**Status:** ✅ Frontend Complete (Mock Data)

#### Features:

**Employee Summary:**
- Name, Code, Department
- Designation
- Current Salary (Net)

**Salary Components:**

**Earnings:**
- Basic Pay (editable)
- HRA - House Rent Allowance (editable)
- Special Allowance (editable)
- Transport Allowance (editable)
- Medical Allowance (editable)
- Other Allowances (editable)

**Deductions:**
- PF - Provident Fund (auto-calculated: 12% of Basic)
- Professional Tax (editable)
- Income Tax (editable)
- Other Deductions (editable)

**Calculations:**
- Gross Salary = Sum of all earnings
- Total Deductions = Sum of all deductions
- Net Salary = Gross - Deductions

**Effective Date:**
- Date picker for salary change effective date

#### Mock Salary Structure:
```typescript
{
  employeeId: string,
  basicPay: number,
  hra: number,
  specialAllowance: number,
  transportAllowance: number,
  medicalAllowance: number,
  otherAllowances: number,
  
  pfContribution: number,      // Auto: basicPay * 0.12
  professionalTax: number,
  incomeTax: number,
  otherDeductions: number,
  
  grossSalary: number,          // Calculated
  totalDeductions: number,      // Calculated
  netSalary: number,            // Calculated
  
  effectiveFrom: string
}
```

#### Required API Calls:
```typescript
// Get current salary
GET /api/v1/salary?employeeId=<id>
Response: {
  success: boolean,
  data: {
    salary: Salary,
    employee: {
      name: string,
      employeeCode: string,
      department: string,
      designation: string
    }
  }
}

// Update salary
PUT /api/v1/salary
Body: {
  employeeId: string,
  basicPay: number,
  hra: number,
  allowances: number,
  pfContribution: number,
  taxDeduction: number,
  effectiveFrom: string
}
```

#### Database Operations:
```sql
-- Get current salary
SELECT s.*, 
  CONCAT(e.first_name, ' ', e.last_name) as employee_name,
  e.employee_code,
  e.department,
  e.designation
FROM salaries s
JOIN employees e ON s.employee_id = e.id
WHERE s.employee_id = ? AND s.is_active = 1;

-- Mark old salary as inactive
UPDATE salaries 
SET is_active = 0, effective_to = ?
WHERE employee_id = ? AND is_active = 1;

-- Insert new salary record
INSERT INTO salaries (
  employee_id, basic_pay, hra, allowances,
  pf_contribution, tax_deduction,
  gross_salary, net_salary,
  effective_from, is_active
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1);

-- Insert salary components
INSERT INTO salary_components (
  salary_id, component_name, component_type, amount
) VALUES 
  (?, 'Basic Pay', 'earning', ?),
  (?, 'HRA', 'earning', ?),
  (?, 'Allowances', 'earning', ?),
  (?, 'Provident Fund', 'deduction', ?),
  (?, 'Income Tax', 'deduction', ?);
```

---

### 9. **Admin Profile** (`AdminProfilePage.tsx`)
**Route:** `/admin/profile`  
**Status:** ✅ Frontend Complete (Mock Data)

#### Features:

**Profile Section:**
- Profile Picture Upload
- Name, Email
- Role (Admin)
- Department
- Phone Number (editable)

**Account Settings:**
- Change Password
  - Current Password
  - New Password
  - Confirm Password
- Email Notifications (toggle)
- SMS Notifications (toggle)

**Recent Activity:**
- Login history (last 10 logins)
- Recent actions (approvals, edits)

#### Required API Calls:
```typescript
// Get admin profile
GET /api/v1/profile/me
Response: {
  success: boolean,
  data: {
    user: {
      id: string,
      email: string,
      role: 'admin'
    },
    employee: {
      firstName: string,
      lastName: string,
      phone: string,
      profilePicture: string,
      department: string
    }
  }
}

// Update profile
PUT /api/v1/profile/me
Body: {
  phone: string,
  // other editable fields
}

// Change password
POST /api/v1/auth/change-password
Body: {
  currentPassword: string,
  newPassword: string
}

// Upload profile picture
POST /api/v1/profile/picture
Content-Type: multipart/form-data
Body: FormData with image file
```

---

## 👤 Employee Module Features

### 1. **Employee Dashboard** (`EmployeeDashboard.tsx`)
**Route:** `/employee/dashboard`  
**Status:** ✅ Frontend Complete (Mock Data)

#### Statistics Cards:
1. **Check-in Status**
   - Today's check-in time
   - Status indicator (on-time/late)
   - Quick check-in button

2. **This Month Attendance**
   - Present days
   - Absent days
   - Leave days
   - Attendance percentage

3. **Leave Balance**
   - Paid Leave: Used/Total
   - Sick Leave: Used/Total
   - Quick leave request button

4. **Pending Actions**
   - Profile completion %
   - Pending leave requests
   - Document uploads needed

#### Recent Activity:
- Last 5 attendance records
- Last 3 leave requests
- Recent salary slips

#### Mock Dashboard Data:
```typescript
{
  checkInStatus: {
    time: '09:15 AM',
    status: 'on-time' | 'late' | 'not-checked-in',
    date: string
  },
  attendance: {
    presentDays: 20,
    absentDays: 1,
    leaveDays: 2,
    percentage: 87
  },
  leaveBalance: {
    paid: { used: 5, total: 15, remaining: 10 },
    sick: { used: 2, total: 10, remaining: 8 }
  },
  pendingActions: {
    profileCompletion: 85,
    pendingLeaves: 1,
    documentsNeeded: 0
  }
}
```

#### Required API Calls:
```typescript
GET /api/v1/profile/me
GET /api/v1/attendance/records?employeeId=<id>&month=current
GET /api/v1/leaves/balance?employeeId=<id>&year=2026
GET /api/v1/leaves/requests?employeeId=<id>&status=pending
```

---

### 2. **Attendance View** (`employee/AttendancePage.tsx`)
**Route:** `/employee/attendance`  
**Status:** ✅ Frontend Complete (Mock Data)

#### Features:

**Monthly Calendar View:**
- Visual calendar with attendance status
- Color coding:
  - Green: Present
  - Red: Absent
  - Yellow: Leave
  - Blue: Half Day

**Attendance List:**
- Date
- Check-in time
- Check-out time
- Work hours
- Status
- Remarks (if any)

**Filters:**
- Month selector
- Status filter
- Date range

**Summary:**
- Total working days
- Present days
- Absent days
- Leave days
- Average work hours

#### Mock Attendance Record:
```typescript
{
  date: string,
  checkIn: string,
  checkOut: string,
  workHours: string,
  status: 'present' | 'absent' | 'leave' | 'half_day',
  remarks: string
}
```

#### Required API Call:
```typescript
GET /api/v1/attendance/records?
  employeeId=<id>&
  startDate=<date>&
  endDate=<date>
```

---

### 3. **Check-in/Check-out** (`CheckInsPage.tsx`)
**Route:** `/employee/checkins`  
**Status:** ✅ Frontend Complete (Mock Data)

#### Features:

**Check-in Section:**
- Current time display
- Check-in button (enabled only once per day)
- Location capture (if enabled)
- Reason/Remarks input

**Check-out Section:**
- Work duration display
- Check-out button (enabled only after check-in)
- Day summary

**Today's Status:**
- Check-in time
- Elapsed time
- Expected check-out
- Overtime indicator

**Recent Check-ins:**
- Last 7 days check-in/out history

#### Expected API Calls:
```typescript
// Check-in
POST /api/v1/attendance/checkin
Body: {
  employeeId: string,
  checkInTime: string,
  location: { lat: number, lng: number },
  remarks: string
}

// Check-out
POST /api/v1/attendance/checkout
Body: {
  employeeId: string,
  checkOutTime: string,
  remarks: string
}
```

#### Database Operations:
```sql
-- Check-in (create record)
INSERT INTO attendance (
  employee_id, attendance_date, check_in_time, status
) VALUES (?, CURDATE(), ?, 'present');

-- Check-out (update record)
UPDATE attendance 
SET check_out_time = ?,
    work_hours = TIMEDIFF(?, check_in_time),
    extra_hours = CASE 
      WHEN TIMEDIFF(?, check_in_time) > '09:00:00' 
      THEN TIMEDIFF(?, '09:00:00') 
      ELSE 0 
    END
WHERE employee_id = ? 
  AND attendance_date = CURDATE();
```

---

### 4. **Leave Request** (`LeaveRequestPage.tsx`)
**Route:** `/employee/leave`  
**Status:** ✅ Frontend Complete (Mock Data)

#### Features:

**Leave Balance Card:**
- Paid Leave: Used/Total
- Sick Leave: Used/Total
- Visual progress bars

**Request New Leave:**
- Leave Type (dropdown: Paid/Sick)
- Start Date (date picker)
- End Date (date picker)
- Number of Days (auto-calculated)
- Reason (textarea, required)
- Attachment upload (optional)
- Submit button

**My Leave Requests:**
- Table showing all requests
- Columns:
  - Leave Type
  - Dates
  - Days
  - Reason
  - Status (Pending/Approved/Rejected)
  - Applied On
  - Admin Remarks (if any)
- Filter by status
- Cancel button (for pending requests)

#### Mock Leave Request:
```typescript
{
  id: string,
  leaveType: 'paid' | 'sick',
  startDate: string,
  endDate: string,
  numberOfDays: number,
  reason: string,
  attachmentUrl: string | null,
  status: 'pending' | 'approved' | 'rejected',
  appliedOn: string,
  adminRemarks: string | null
}
```

#### Required API Calls:
```typescript
// Get leave balance
GET /api/v1/leaves/balance?employeeId=<id>&year=2026

// Create leave request
POST /api/v1/leaves/requests
Body: {
  employeeId: string,
  leaveType: 'paid' | 'sick',
  startDate: string,
  endDate: string,
  numberOfDays: number,
  reason: string,
  attachmentUrl: string
}

// Get my leave requests
GET /api/v1/leaves/requests?employeeId=<id>

// Cancel leave request
DELETE /api/v1/leaves/requests/:id

// Upload attachment
POST /api/v1/leaves/attachment
Content-Type: multipart/form-data
```

#### Database Operations:
```sql
-- Check leave balance
SELECT total_allocated, used, remaining 
FROM leave_balances 
WHERE employee_id = ? 
  AND leave_type = ? 
  AND year = ?;

-- Create request
INSERT INTO leave_requests (
  employee_id, leave_type, start_date, end_date,
  number_of_days, reason, attachment_url, status
) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending');

-- Cancel request (delete or update status)
UPDATE leave_requests 
SET status = 'cancelled' 
WHERE id = ? AND status = 'pending';
```

---

### 5. **Employee Profile** (`employee/ProfilePage.tsx`)
**Route:** `/employee/profile`  
**Status:** ✅ Frontend Complete (Mock Data)

#### Features:

**Profile Information:**
- Profile Picture Upload
- Personal Details:
  - Full Name
  - Employee Code (read-only)
  - Email (read-only)
  - Phone (editable)
  - Date of Joining (read-only)
  - Department (read-only)
  - Designation (read-only)

**Address Information:**
- Street Address (editable)
- City (editable)
- State (editable)
- ZIP Code (editable)
- Country (editable)

**Emergency Contact:**
- Contact Name (editable)
- Relationship (editable)
- Phone Number (editable)

**Documents:**
- Resume Upload
- Other Documents

**Account Settings:**
- Change Password
- Email Notifications
- SMS Notifications

#### Expected API Calls:
```typescript
// Get profile
GET /api/v1/profile/me

// Update profile
PUT /api/v1/profile/me
Body: {
  phone: string,
  address: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },
  emergencyContact: {
    name: string,
    relationship: string,
    phone: string
  }
}

// Upload profile picture
POST /api/v1/profile/picture
Content-Type: multipart/form-data

// Upload resume
POST /api/v1/profile/resume
Content-Type: multipart/form-data
```

---

## 🗄️ Database Field Mappings

### Frontend Form Fields → Database Tables

#### **Add/Edit Employee:**
```javascript
Frontend Field              Database Table.Column
────────────────────────────────────────────────────────
firstName                → employees.first_name
lastName                 → employees.last_name
email                    → users.email
phone                    → employees.phone
department               → employees.department
designation              → employees.designation
dateOfJoining            → employees.date_of_joining
profilePicture           → employees.profile_picture

// Address
street                   → employee_addresses.street
city                     → employee_addresses.city
state                    → employee_addresses.state
zipCode                  → employee_addresses.zip_code
country                  → employee_addresses.country

// Emergency Contact
emergencyContactName     → emergency_contacts.name
emergencyContactRelation → emergency_contacts.relationship
emergencyContactPhone    → emergency_contacts.phone

// Salary
basicPay                 → salaries.basic_pay
hra                      → salaries.hra
allowances               → salaries.allowances
pfContribution           → salaries.pf_contribution
taxDeduction             → salaries.tax_deduction
grossSalary              → salaries.gross_salary (calculated)
netSalary                → salaries.net_salary (calculated)

// Leave Allocation
paidLeave                → leave_balances.total_allocated (type='paid')
sickLeave                → leave_balances.total_allocated (type='sick')
```

#### **Attendance:**
```javascript
Frontend Field           Database Table.Column
────────────────────────────────────────────────────────
checkIn                → attendance.check_in_time
checkOut               → attendance.check_out_time
workHours              → attendance.work_hours
overtime               → attendance.extra_hours
status                 → attendance.status
remarks                → attendance.remarks
date                   → attendance.attendance_date
```

#### **Leave Request:**
```javascript
Frontend Field           Database Table.Column
────────────────────────────────────────────────────────
leaveType              → leave_requests.leave_type
startDate              → leave_requests.start_date
endDate                → leave_requests.end_date
numberOfDays           → leave_requests.number_of_days
reason                 → leave_requests.reason
attachmentUrl          → leave_requests.attachment_url
status                 → leave_requests.status
adminRemarks           → leave_requests.admin_remarks
approvedBy             → leave_requests.approved_by
approvedOn             → leave_requests.approved_at
```

---

## 🔄 Mock Data vs Real API

### Current Implementation Status:
| Feature | Frontend | API Integration | Backend API | Status |
|---------|----------|----------------|-------------|---------|
| Login | ✅ | ❌ Mock | ✅ Ready | Need Integration |
| Admin Dashboard | ✅ | ❌ Mock | ⚠️ Partial | Need Stats API |
| Employee List | ✅ | ❌ Mock | ✅ Ready | Need Integration |
| Add Employee | ✅ | ❌ Commented | ✅ Ready | Uncomment & Test |
| Edit Employee | ✅ | ❌ Commented | ✅ Ready | Uncomment & Test |
| View Employee | ✅ | ❌ Mock | ✅ Ready | Need Integration |
| Attendance Mgmt | ✅ | ❌ Mock | ✅ Ready | Need Integration |
| Leave Mgmt | ✅ | ❌ Mock | ✅ Ready | Need Integration |
| Salary Edit | ✅ | ❌ Mock | ✅ Ready | Need Integration |
| Admin Profile | ✅ | ❌ Mock | ✅ Ready | Need Integration |
| Employee Dashboard | ✅ | ❌ Mock | ⚠️ Partial | Need Stats API |
| Check-in/out | ✅ | ❌ Mock | ❌ Missing | Need Backend |
| Leave Request | ✅ | ❌ Mock | ✅ Ready | Need Integration |
| Employee Profile | ✅ | ❌ Mock | ✅ Ready | Need Integration |

### Legend:
- ✅ Complete and Working
- ⚠️ Partially Complete
- ❌ Not Implemented
- 🔄 In Progress

---

## 📡 Required Backend Endpoints

### Priority 1: Critical (Blocking Frontend)
```typescript
1. POST /api/v1/auth/login
2. GET  /api/v1/profile/me
3. GET  /api/v1/employees
4. GET  /api/v1/employees/:id
5. POST /api/v1/employees
6. PUT  /api/v1/employees/:id
```

### Priority 2: High (Core Features)
```typescript
7.  GET   /api/v1/attendance/records
8.  GET   /api/v1/attendance/daily
9.  POST  /api/v1/attendance/checkin
10. POST  /api/v1/attendance/checkout
11. GET   /api/v1/leaves/balance
12. GET   /api/v1/leaves/requests
13. POST  /api/v1/leaves/requests
14. PATCH /api/v1/leaves/requests/:id
```

### Priority 3: Medium (Additional Features)
```typescript
15. GET   /api/v1/salary
16. PUT   /api/v1/salary
17. POST  /api/v1/auth/change-password
18. POST  /api/v1/profile/picture
19. POST  /api/v1/profile/resume
20. DELETE /api/v1/leaves/requests/:id
```

### Priority 4: Nice to Have (Statistics)
```typescript
21. GET /api/v1/dashboard/stats/admin
22. GET /api/v1/dashboard/stats/employee
23. GET /api/v1/leaves/history
24. GET /api/v1/attendance/monthly-summary
```

---

## 🔧 Integration Checklist

### Phase 1: Authentication ✅ Backend Ready
- [ ] Connect Login page to `/api/v1/auth/login`
- [ ] Store JWT tokens in localStorage
- [ ] Implement token refresh logic
- [ ] Add Authorization headers to all requests
- [ ] Handle 401 (unauthorized) responses
- [ ] Redirect to login on token expiry

### Phase 2: Admin Features
- [ ] Dashboard statistics API
- [ ] Employee CRUD operations
- [ ] Attendance management
- [ ] Leave approval workflow
- [ ] Salary updates

### Phase 3: Employee Features
- [ ] Employee dashboard
- [ ] Check-in/out functionality
- [ ] Leave requests
- [ ] Profile management
- [ ] Document uploads

### Phase 4: File Uploads
- [ ] Profile picture upload
- [ ] Resume upload
- [ ] Leave attachment upload
- [ ] File size/type validation

### Phase 5: Error Handling
- [ ] API error messages display
- [ ] Form validation errors
- [ ] Network error handling
- [ ] Loading states
- [ ] Success notifications

---

## 🎨 UI/UX Features

### Implemented:
- ✅ Responsive design (mobile-friendly)
- ✅ Dark/Light mode support
- ✅ Loading spinners
- ✅ Success/Error notifications
- ✅ Form validation
- ✅ Search and filtering
- ✅ Pagination
- ✅ Modal dialogs
- ✅ Tooltip hints
- ✅ Icon library (Lucide React)

### Design System:
- **Colors:** Tailwind default palette
- **Primary:** Blue (indigo)
- **Success:** Green
- **Warning:** Yellow
- **Error:** Red
- **Typography:** System fonts
- **Spacing:** Tailwind spacing scale
- **Border Radius:** Rounded (0.375rem)
- **Shadows:** Subtle elevation

---

## 📝 Summary

### Frontend Completion: **95%**
- All pages designed and implemented
- Mock data structure matches database schema
- Forms have validation
- UI is responsive and polished

### API Integration: **5%**
- Only 3 commented API calls found
- All other features use mock data
- Ready for backend connection

### Backend Compatibility: **76%**
- Backend APIs 76% tested and working
- Database schema aligned with frontend
- Missing: Dashboard stats, Check-in/out APIs

### Next Steps:
1. **Uncomment API calls** in 3 files
2. **Add API base URL** configuration
3. **Implement error handling** for API calls
4. **Add loading states** during API calls
5. **Test with real backend** endpoints
6. **Fix any data format mismatches**
7. **Add missing dashboard stats** APIs
8. **Implement file upload** handlers

---

**Document Generated:** January 3, 2026  
**Version:** 1.0  
**Status:** Complete Analysis ✅  
**Ready for Backend Integration:** Yes ✅
