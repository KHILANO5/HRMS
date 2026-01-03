# Dayflow – Human Resource Management System (HRMS)

> **Every workday, perfectly aligned.**

A complete, production-ready HRMS platform with automatic credential generation, email delivery, and role-based access control.

---

## 🚀 Project Overview

**Dayflow** is a modern Human Resource Management System (HRMS) that digitizes and streamlines core HR operations including:

- 🔐 **Automated Employee Onboarding** - Auto-generated login IDs and passwords sent via email
- 👥 **Employee Management** - Complete CRUD operations with role-based access
- 📊 **Leave Management** - Request, approve, and track employee leaves
- 📈 **Dashboard Analytics** - Real-time insights for admins and employees
- 🔒 **Secure Authentication** - JWT-based auth with automatic token refresh

### Tech Stack

**Frontend:**
- React 18.3 + TypeScript
- Vite 7.3 (Build Tool)
- TailwindCSS (Styling)
- Lucide React (Icons)

**Backend:**
- Node.js + Express.js + TypeScript
- MySQL 8.0 (Database)
- Sequelize ORM
- JWT Authentication
- Nodemailer (Email Service)

**Key Features:**
- Automatic login ID generation (e.g., OINIPA20260001)
- Random secure password generation
- Email delivery of credentials to new employees
- Role-based dashboards (Admin & Employee)
- Real-time data synchronization

---

## 📋 Table of Contents

1. [Problem Statement](#problem-statement)
2. [User Roles](#user-roles--access-control)
3. [Quick Start](#-quick-start)
4. [Features](#-key-features)
5. [Authentication](#-authentication)
6. [Employee Onboarding](#-automated-employee-onboarding)
7. [API Documentation](#api-documentation)
8. [Project Structure](#project-structure)

---

## 🎯 Problem Statement

Most small to mid-scale organizations still rely on:

- Manual attendance tracking
- Email/WhatsApp based leave approvals
- Scattered employee data
- Poor visibility into employee work status

**Dayflow solves this** by providing a centralized, role-based HRMS platform with automated onboarding and real-time data management.

---

## 👥 User Roles & Access Control

### Roles

| Role | Description |
|------|-------------|
| **Admin/HR** | Manages employees, attendance, leave approvals, salary structures |
| **Employee** | Views own profile, requests leave, views personal data |

### Access Matrix

| Feature | Admin | Employee |
|---------|-------|----------|
| Self Sign-Up | ❌ No | ❌ No |
| Login | ✅ Yes | ✅ Yes |
| Add Employee | ✅ Yes | ❌ No |
| View All Employees | ✅ Yes | 👀 Limited |
| View Own Profile | ✅ Yes | ✅ Yes |
| Edit Profile | ✅ Full | ⚠️ Limited |
| View Attendance | ✅ All | ✅ Own |
| Request Leave | ❌ No | ✅ Yes |
| Approve/Reject Leave | ✅ Yes | ❌ No |
| View Salary | ✅ All | ✅ Own |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MySQL 8.0
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd "odoo final"
```

2. **Install dependencies**
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. **Configure environment**
```bash
# server/.env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hrms_db
DB_USER=root
DB_PASSWORD=root
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (for credential delivery)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

4. **Setup database**
```bash
# Create database
mysql -u root -p
CREATE DATABASE hrms_db;
USE hrms_db;
source database/schema.sql;
source database/seeds/sample-data.sql;
```

5. **Run the application**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Default Admin: admin@dayflow.com / Password@123

---

## ✨ Key Features

### 1. Automated Employee Onboarding

When admin creates a new employee:
- ✅ **Auto-generates Login ID** (Format: OINIPA20260001)
  - OI = Company prefix (Odoo India)
  - NIPA = First 2 letters of first + last name
  - 2026 = Year of joining
  - 0001 = Serial number (auto-incremented)
- ✅ **Generates secure random password** (12 chars, mixed case, numbers, symbols)
- ✅ **Sends beautiful HTML email** with credentials automatically
- ✅ **Forces password change** on first login

### 2. Real-time Dashboards

**Admin Dashboard:**
- Total employees count
- Leave requests pending approval
- Recent employee additions
- Quick actions

**Employee Dashboard:**
- Leave balance (Paid & Sick)
- Recent leave requests
- Personal statistics

### 3. Leave Management
- Submit leave requests with date range
- Leave type selection (Paid/Sick/Casual)
- Auto-calculation of leave days
- Admin approval workflow
- Leave balance tracking

### 4. Employee Management
- Complete CRUD operations
- Profile management
- Address & emergency contacts
- Salary information
- Document uploads

---

## 🔐 Authentication

### Login Flow

1. User enters email and password
2. System validates credentials
3. JWT token issued (1h expiry)
4. Refresh token issued (7d expiry)
5. User redirected to role-based dashboard

### Security Features

- JWT-based authentication
- Automatic token refresh
- Password hashing with bcrypt
- First-login password change requirement
- Role-based route protection

### No Public Registration

- ❌ Employees cannot self-register
- ✅ Only admin can create employee accounts
- ✅ Prevents unauthorized access
- ✅ Maintains data integrity

---

## 📧 Automated Employee Onboarding

### How It Works

```typescript
// When admin creates employee:
1. Generate Login ID: OINIPA20260001
   - Parse first/last name
   - Extract joining year
   - Auto-increment serial number

2. Generate Random Password
   - 12 characters minimum
   - Mixed: uppercase, lowercase, numbers, symbols
   - Cryptographically secure

3. Send Email to Employee
   - Beautiful HTML template
   - Login ID clearly displayed
   - Temporary password
   - Security instructions
   - Direct login link

4. Store in Database
   - Hash password with bcrypt
   - Set isFirstLogin: true
   - Store all employee data
```

### Email Template Preview

```
Subject: 🔑 Your Dayflow HRMS Login Credentials

Dear [Employee Name],

Your employee account has been created successfully!

Login ID: OINIPA20260001
Temporary Password: Xk9@mP3#7Zy!

[Login to Portal Button]

⚠️ Security Notice:
- Change your password after first login
- Keep credentials confidential
```

---
---

## 📁 Project Structure

```
odoo final/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin pages
│   │   │   ├── employee/   # Employee pages
│   │   │   └── auth/       # Login pages
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main app component
│   ├── package.json
│   └── vite.config.ts
│
├── server/                  # Backend Node.js application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   │   └── emailService.ts  # Email delivery
│   │   ├── utils/          # Helper functions
│   │   │   └── credentialsGenerator.ts  # Login ID & password generation
│   │   └── index.ts        # Server entry point
│   ├── .env                # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── database/               # Database files
│   ├── models/            # Sequelize models
│   ├── schema.sql         # Database schema
│   └── seeds/             # Sample data
│
├── doc/                   # Documentation
│   ├── API_CONTRACT.md    # API documentation
│   └── TEAM_GUIDE.md      # Development guide
│
├── README.md              # This file
└── INTEGRATION_COMPLETE.md  # Integration guide
```

---

## 🔌 API Documentation

### Authentication Endpoints

```
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/change-password
```

### Employee Endpoints

```
GET    /api/v1/employees          # Get all employees (Admin)
GET    /api/v1/employees/:id      # Get employee by ID
POST   /api/v1/employees          # Create employee (Admin)
PUT    /api/v1/employees/:id      # Update employee
DELETE /api/v1/employees/:id      # Delete employee (Admin)
```

### Leave Endpoints

```
GET    /api/v1/leaves             # Get all leaves (Admin)
GET    /api/v1/leaves/my          # Get my leaves (Employee)
POST   /api/v1/leaves             # Create leave request
PUT    /api/v1/leaves/:id/status  # Approve/reject (Admin)
```

### Dashboard Endpoints

```
GET /api/v1/dashboard/admin       # Admin statistics
GET /api/v1/dashboard/employee    # Employee statistics
```

**Full API documentation:** See [doc/API_CONTRACT.md](doc/API_CONTRACT.md)

---

## 🛠️ Development

### Running Tests
```bash
cd server
npm test
```

### Building for Production
```bash
# Frontend
cd client
npm run build

# Backend
cd server
npm run build
```

### Database Migrations
```bash
# Run migrations
cd database
mysql -u root -p hrms_db < schema.sql
```

---

## 🌟 Key Implementation Details

### 1. Login ID Generation Algorithm

```typescript
// Format: OI + [Name] + [Year] + [Serial]
// Example: OINIPA20260001

const generateLoginId = async (firstName, lastName, joiningDate) => {
  const companyPrefix = 'OI';  // Odoo India
  const nameCode = firstName.substring(0, 2) + lastName.substring(0, 2);
  const year = joiningDate.getFullYear();
  const serial = await getNextSerialNumber(year);  // Auto-increment
  
  return `${companyPrefix}${nameCode.toUpperCase()}${year}${serial}`;
};
```

### 2. Password Generation

```typescript
const generateRandomPassword = (length = 12) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '@#$%&*!';
  
  // Ensure at least one of each type
  // Random shuffle
  // Return secure password
};
```

### 3. Email Service Configuration

```typescript
// server/src/services/emailService.ts
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

await transporter.sendMail({
  to: employee.email,
  subject: '🔑 Your Dayflow HRMS Login Credentials',
  html: beautifulHtmlTemplate
});
```

---

## 🔐 Security Best Practices

1. **JWT Tokens**: Short-lived access tokens (1h), longer refresh tokens (7d)
2. **Password Hashing**: bcrypt with salt rounds
3. **Environment Variables**: Sensitive data in .env (not committed)
4. **CORS**: Configured for specific origins only
5. **Input Validation**: express-validator on all endpoints
6. **SQL Injection Prevention**: Sequelize ORM parameterized queries
7. **XSS Protection**: React's built-in escaping
8. **First Login**: Forced password change for new employees

---

## 📝 Environment Variables Reference

### Backend (.env)
```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hrms_db
DB_USER=root
DB_PASSWORD=root
DB_SYNC=false

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Email (Gmail App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173
```

---

## 🐛 Troubleshooting

### Email Not Sending?

1. **Enable Gmail App Password**:
   - Go to Google Account → Security → 2-Step Verification
   - Generate App Password for "Mail"
   - Use that password in EMAIL_PASSWORD

2. **Check SMTP Settings**:
   - Host: smtp.gmail.com
   - Port: 587 (TLS)
   - Verify EMAIL_USER and EMAIL_PASSWORD in .env

### Database Connection Issues?

```bash
# Check MySQL is running
mysql --version

# Test connection
mysql -u root -p
USE hrms_db;
SHOW TABLES;
```

### Port Already in Use?

```bash
# Kill process on port 3000 (backend)
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Kill process on port 5173 (frontend)
netstat -ano | findstr :5173
taskkill /PID <pid> /F
```

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Upload dist/ folder
```

### Backend (Railway/Render)
```bash
cd server
npm run build
# Deploy dist/ folder
# Set environment variables
```

### Database (PlanetScale/Railway)
- Export schema.sql
- Import to cloud MySQL instance
- Update DB_ variables in .env

---

## 👥 Contributors

Built with ❤️ for modern HR management

---

## 📄 License

This project is developed as a working MVP for demonstration purposes.

---

## 📚 Additional Documentation

- [API Contract](doc/API_CONTRACT.md) - Complete API documentation
- [Team Guide](doc/TEAM_GUIDE.md) - Development guidelines
- [Integration Guide](INTEGRATION_COMPLETE.md) - Frontend-Backend integration

---

## 🎉 Demo Credentials

**Admin Account:**
- Email: admin@dayflow.com
- Password: Password@123

**Employee Account:**
- Email: john.doe@dayflow.com
- Password: Password@123

---

**Built with React + TypeScript + Node.js + MySQL**

*Every workday, perfectly aligned.* ✨

---

### 7.3 Salary Info (Admin Only)

**Visible Only to Admin**

**Includes:**

* Monthly salary
* Yearly salary
* Salary components:

  * Basic Pay
  * HRA
  * Allowances
  * PF Contribution
  * Tax Deduction
* Working days / hours

**Rules:**

* Employees cannot edit salary
* Employees may see limited summary (optional)

---

### 7.4 Attendance Tab (Admin)

**Features:**

* Filter by:

  * Date
  * Day
* View attendance of all employees
* Daily attendance summary

---

### 7.5 Time Off Management (Admin)

#### 7.5.1 Leave Requests Tab

* View all leave requests
* Actions:

  * Approve
  * Reject
* Admin can add remarks

**On Action:**

* Employee notified
* Leave balance updated
* Attendance updated automatically

---

#### 7.5.2 Allocation Tab

* Displays:

  * Approved leaves
  * Rejected leaves
  * Leave history per employee

---

## 8. System Validations & Edge Cases

* Role-based route protection
* Unauthorized URL access blocked
* Deleted employee cannot login
* Session timeout handling
* Attachment size/type validation
* Network failure handling
* Empty state UI (no data scenarios)

---

## 9. Non-Functional Requirements

* Secure authentication
* Scalable database design
* Responsive UI
* Clean role separation
* Audit-friendly data flow

