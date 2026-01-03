# Quick Setup Guide

## 📋 Prerequisites Done ✅

- ✅ Nodemailer installed
- ✅ Email service configured
- ✅ Login ID generator created
- ✅ Employee controller updated
- ✅ Employee model updated

## 🚀 Final Steps

### 1. Install @types/nodemailer

```bash
cd server
npm install --save-dev @types/nodemailer
```

### 2. Run Database Migration

Open MySQL Workbench or MySQL CLI and run:

```sql
USE hrms_db;

ALTER TABLE employees 
ADD COLUMN employee_id VARCHAR(50) UNIQUE AFTER employee_code;

ALTER TABLE employees 
ADD COLUMN joining_date DATE AFTER date_of_joining;

UPDATE employees 
SET joining_date = date_of_joining 
WHERE joining_date IS NULL;
```

### 3. Restart Backend Server

Stop current server (Ctrl+C) and restart:

```bash
cd server
npm run dev
```

## ✨ Test It Out

1. Login as admin: `admin@dayflow.com` / `Password@123`
2. Go to **Employees** → **Add Employee**
3. Fill in employee details with a **real email address**
4. Click **Save**
5. **Check the email inbox** - you'll receive credentials!

### Example:
- First Name: Test
- Last Name: User
- Email: your-email@gmail.com
- Department: Engineering
- Designation: Developer
- Date of Joining: 2026-01-03

**Generated:**
- Login ID: `OITEUS20260001`
- Password: Random 12-char password (e.g., `Xk9@mP3#7Zy!`)
- Email sent automatically with beautiful HTML template!

## 📧 Email Configuration

Already configured in `server/.env`:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=nishitsavaliya5@gmail.com
EMAIL_PASSWORD=tqhvsbxurnjkhtsw
EMAIL_FROM=nishitsavaliya5@gmail.com
```

## 🎉 You're All Set!

The system now automatically:
1. ✅ Generates unique login IDs
2. ✅ Creates secure random passwords
3. ✅ Sends beautiful emails to new employees
4. ✅ Forces password change on first login

Happy coding! 🚀
