# Dayflow HRMS - Team Development Guide

Welcome to the Dayflow HRMS project! This guide will help your team navigate the project structure, understand the workflow, and collaborate effectively.

---

## 1. Project Overview

**Dayflow** is a role-based Human Resource Management System (HRMS) that digitalizes core HR operations:
- Employee onboarding & management
- Attendance tracking
- Leave management
- Salary visibility
- Profile management

**Key Features:**
- Dual Role System (Admin/HR and Employee)
- JWT-based authentication
- Real-time data synchronization
- Role-based access control (RBAC)

---

## 2. Project Structure

```
HRMS/
├── doc/                          # Documentation
│   ├── API_CONTRACT.md          # API specifications (Frontend-Backend Contract)
│   └── TEAM_GUIDE.md            # This file
│
├── database/                     # Database layer
│   ├── connection.ts            # DB connection setup
│   ├── index.ts                 # Database exports
│   ├── migrate.ts               # Migration scripts
│   ├── schema.sql               # Database schema
│   │
│   ├── models/                  # Typescript models
│   │   ├── Employee.ts
│   │   ├── User.ts
│   │   ├── Attendance.ts
│   │   ├── LeaveRequest.ts
│   │   ├── LeaveBalance.ts
│   │   ├── Salary.ts
│   │   ├── SalaryComponent.ts
│   │   ├── Department.ts
│   │   ├── Designation.ts
│   │   ├── EmergencyContact.ts
│   │   ├── EmployeeAddress.ts
│   │   └── AuditLog.ts
│   │
│   └── seeds/                   # Sample data
│       └── sample-data.sql
│
├── server/                       # Backend API (Node.js/Express)
│   ├── routes/                  # API endpoints
│   ├── controllers/             # Business logic
│   ├── middleware/              # Auth, validation, etc
│   └── ...
│
├── client/                       # Frontend (React/Vue/Angular)
│   └── ...
│
├── README.md                     # Project overview
└── .gitignore
```

---

## 3. Tech Stack

- **Backend:** Node.js + Express.js + TypeScript
- **Frontend:** React/Vue (TBD)
- **Database:** PostgreSQL/MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Version Control:** Git

---

## 4. Development Workflow

### 4.1 Backend Development

**Responsible Team Member:** Backend Lead

**Steps:**
1. Review `doc/API_CONTRACT.md` for endpoint specifications
2. Implement endpoints in `server/` following the contract
3. Use models from `database/models/` for data structure
4. Test all endpoints before passing to frontend team
5. Document any deviations from the API contract

**Key Files:**
- `database/schema.sql` - Database structure
- `database/connection.ts` - DB connection setup
- `database/models/*.ts` - Data models

### 4.2 Frontend Development

**Responsible Team Member:** Frontend Lead

**Steps:**
1. Study `doc/API_CONTRACT.md` to understand backend endpoints
2. Create UI components based on user roles (Admin/Employee)
3. Implement API calls matching the contract
4. Test frontend with backend endpoints
5. Handle error responses as per API contract

**Key Reference:**
- `doc/API_CONTRACT.md` - Use this as your development contract

### 4.3 Integration

**Steps:**
1. Ensure backend follows API_CONTRACT.md exactly
2. Ensure frontend consumes APIs as documented
3. Test end-to-end user workflows
4. Fix any contract mismatches
5. Deploy together

---

## 5. Team Roles & Responsibilities

| Role | Responsibility |
|------|---|
| **Backend Lead** | Implement APIs, manage database, ensure API_CONTRACT compliance |
| **Frontend Lead** | Build UI, consume APIs, manage client-side logic |
| **Database Admin** | Schema design, migrations, seed data management |
| **QA Lead** | Test integration, validate workflows, catch bugs |
| **Project Lead** | Coordinate team, resolve blockers, track progress |

---

## 6. Development Guidelines

### 6.1 Before You Start

- [ ] Read the full `README.md`
- [ ] Study `API_CONTRACT.md` (Backend & Frontend)
- [ ] Understand the database schema in `database/schema.sql`
- [ ] Check the models in `database/models/`

### 6.2 Coding Standards

- **Naming:** camelCase for variables, PascalCase for classes
- **Type Safety:** Use TypeScript for all files
- **Error Handling:** Follow error codes in API_CONTRACT.md
- **Comments:** Document complex logic
- **Git:** Write clear commit messages

### 6.3 API Development Rules

**Backend MUST follow these rules:**
- All endpoints must match `API_CONTRACT.md` exactly
- Response format must be: `{ success, message, data, error }`
- Use JWT for authentication
- Implement all error codes from contract
- Validate all inputs before processing
- Log all important actions in AuditLog

**Frontend MUST follow these rules:**
- All API calls must use the endpoints from `API_CONTRACT.md`
- Handle all error codes properly
- Display user-friendly error messages
- Implement role-based UI (Admin vs Employee)
- Store JWT securely (HttpOnly cookies preferred)

### 6.4 Testing & Validation

**Before Integration:**
1. Backend: Test each endpoint with Postman/Insomnia
2. Frontend: Test with mock APIs first, then real backend
3. Database: Verify schema with seed data
4. Security: Test authentication & authorization

---

## 7. Database Models

**Employee-related:**
- User.ts - Login credentials
- Employee.ts - Employee master data
- EmployeeAddress.ts - Address info
- EmergencyContact.ts - Emergency contacts

**HR Operations:**
- Attendance.ts - Daily attendance records
- LeaveRequest.ts - Leave requests
- LeaveBalance.ts - Annual/monthly leave balance

**Organization:**
- Department.ts - Department master
- Designation.ts - Job titles

**Compensation:**
- Salary.ts - Salary records
- SalaryComponent.ts - Salary components (base, TA, DA, etc)

**Audit:**
- AuditLog.ts - Track all changes for compliance

---

## 8. API Contract Overview

The `API_CONTRACT.md` file contains:

1. **Authentication Endpoints** - Login, logout, token refresh
2. **Employee Management** - CRUD operations on employees
3. **Attendance** - Mark attendance, view records
4. **Leave Management** - Request leave, approve/reject
5. **Salary Management** - View salary slips, components
6. **Profile** - View/edit own profile

**Status Codes:**
- `200` - Success
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

---

## 9. Quick Start

### Backend Setup
```bash
cd server
npm install
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Database Setup
```bash
# Run migrations
npm run migrate

# Seed sample data (optional)
npm run seed
```

---

## 10. Common Workflows

### Adding a New Employee (Admin)
1. Backend: POST `/api/v1/employees/` with employee data
2. Create User account automatically
3. Frontend: Show success message
4. Verify in employee list

### Requesting Leave (Employee)
1. Frontend: POST `/api/v1/leave/request` with dates
2. Backend: Validate leave balance, create request
3. Admin gets notification
4. Admin can approve/reject via API
5. Employee sees updated status

### Marking Attendance (Employee)
1. Frontend: POST `/api/v1/attendance/mark` with checkin
2. Backend: Record timestamp, validate employee
3. Frontend: Show confirmation
4. Employee can view in attendance history

---

## 11. Troubleshooting

**Backend not starting?**
- Check database connection in `database/connection.ts`
- Verify environment variables are set
- Ensure database server is running

**Frontend can't connect to backend?**
- Check base URL in API calls matches backend URL
- Verify CORS settings on backend
- Check network tab in browser console

**Database schema issues?**
- Rerun migrations: `npm run migrate`
- Check `database/schema.sql` for errors
- Verify all models match schema

---

## 12. Communication

**Daily Standup:** Report blockers and progress
**Code Reviews:** Submit PRs for review before merging
**Documentation:** Update this guide if processes change
**Issues:** Create tickets with clear descriptions

---

## 13. Success Metrics

- ✅ All API endpoints implemented per contract
- ✅ Frontend-Backend integration working
- ✅ All user workflows tested
- ✅ Database migrations successful
- ✅ No blocking errors in production
- ✅ Security checks passed
- ✅ Performance acceptable

---

**Good luck! Let's build Dayflow together! 🚀**
