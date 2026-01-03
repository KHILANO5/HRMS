# Employee Credentials & Email System Implementation

## Overview
Implemented automatic login ID generation and email delivery system for employee credentials.

## 🔧 Installation Required

### 1. Install Nodemailer Package
```bash
cd "e:\odoo final\server"
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### 2. Run Database Migration
Execute the SQL migration to add new fields:
```bash
mysql -u root -p hrms_db < "e:\odoo final\database\migrations\add_employee_id_field.sql"
```

Or manually in MySQL:
```sql
ALTER TABLE employees ADD COLUMN employee_id VARCHAR(50) UNIQUE AFTER employee_code;
ALTER TABLE employees ADD COLUMN joining_date DATE AFTER date_of_joining;
UPDATE employees SET joining_date = date_of_joining WHERE joining_date IS NULL;
```

### 3. Restart Backend Server
After installation and migration, restart your backend server.

## 📧 Email Configuration
Added to `server/.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=nishitsavaliya5@gmail.com
EMAIL_PASSWORD=tqhvsbxurnjkhtsw
EMAIL_FROM=nishitsavaliya5@gmail.com
```

## 🔑 Login ID Format
Format: `OI + [First2Letters][Last2Letters] + [Year] + [Serial]`

### Example:
- **Employee Name:** Nishit Patel
- **Joining Date:** January 3, 2026
- **Serial Number:** 0001 (first employee joining in 2026)
- **Generated Login ID:** `OINIPA20260001`

### Breakdown:
- `OI` = Odoo India (Company Name)
- `NIPA` = **NI**shit + **PA**tel
- `2026` = Year of Joining
- `0001` = Serial number (auto-incremented per year)

## 🔐 Password Generation
- **Length:** 12 characters
- **Includes:**
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special characters (@#$%&*!)
- **Example:** `A7m@3Kp#9Zx!`

## 📂 New Files Created

### 1. Email Service (`server/src/services/emailService.ts`)
- Configures nodemailer transport
- Sends beautiful HTML emails
- `sendCredentialsEmail()` method for employee onboarding

### 2. Credentials Generator (`server/src/utils/credentialsGenerator.ts`)
- `generateLoginId()` - Creates unique login IDs
- `generateRandomPassword()` - Creates secure random passwords
- `isLoginIdUnique()` - Validates login ID uniqueness

### 3. Database Migration (`database/migrations/add_employee_id_field.sql`)
- Adds `employee_id` column for login IDs
- Adds `joining_date` column for ID generation

## 📝 Modified Files

### 1. Employee Controller (`server/src/controllers/employeeController.ts`)
**Changes in `createEmployee` function:**
- Generates login ID based on first name, last name, and joining date
- Generates random secure password
- Sends credentials email automatically
- Stores `employeeId` (login ID) in database

### 2. Employee Model (`database/models/Employee.ts`)
**Added fields:**
- `employeeId: string` - Stores generated login ID
- `joiningDate: Date` - Used for login ID generation

### 3. Environment Config (`server/.env`)
**Added:**
- Email SMTP configuration
- Gmail credentials for sending emails

## 🚀 How It Works

### When Creating New Employee:

1. **Admin fills form** on Add Employee page with:
   - First Name: Nishit
   - Last Name: Patel
   - Email: employee@example.com
   - Joining Date: 2026-01-03
   - Other details...

2. **Backend processes:**
   ```
   Step 1: Generate Login ID
   → OINIPA20260001
   
   Step 2: Generate Random Password
   → A7m@3Kp#9Zx!
   
   Step 3: Hash Password
   → bcrypt hash stored in database
   
   Step 4: Create Employee Record
   → employeeId: OINIPA20260001
   → employeeCode: OINIPA20260001
   
   Step 5: Send Email
   → To: employee@example.com
   → Subject: 🔑 Your Dayflow HRMS Login Credentials
   → Contains: Login ID + Temporary Password
   ```

3. **Employee receives email** with:
   - Beautiful HTML template
   - Login ID: `OINIPA20260001`
   - Temporary Password: `A7m@3Kp#9Zx!`
   - Login button link
   - Security instructions

4. **Employee logs in:**
   - Uses Login ID instead of email
   - Uses temporary password
   - System forces password change on first login

## 📧 Email Template Features

The email includes:
- ✅ Professional gradient header
- ✅ Employee name personalization
- ✅ Credential boxes with copy buttons
- ✅ Security warnings
- ✅ Direct login button
- ✅ Responsive design
- ✅ Company branding

## 🔒 Security Features

1. **Random Password Generation**
   - Cryptographically secure
   - Meets complexity requirements
   - Different every time

2. **First Login Password Change**
   - `isFirstLogin: true` flag set
   - Forces password change on first access

3. **Password Hashing**
   - bcrypt with salt rounds
   - Never stored in plain text

4. **Email Encryption**
   - Gmail OAuth/App Password
   - STARTTLS on port 587

5. **Unique Login IDs**
   - Database unique constraint
   - Validation before creation

## 🧪 Testing

### Test Creating Employee:
```bash
POST http://localhost:3000/api/v1/employees/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "firstName": "Test",
  "lastName": "Employee",
  "email": "test@example.com",
  "phone": "9876543210",
  "department": "Engineering",
  "designation": "Developer",
  "dateOfJoining": "2026-01-03"
}
```

### Expected Response:
```json
{
  "success": true,
  "message": "Employee created successfully. Credentials sent to email.",
  "data": {
    "employee": {
      "id": "uuid...",
      "loginId": "OITEEM20260002",
      "employeeCode": "OITEEM20260002",
      "email": "test@example.com",
      "message": "Login credentials have been sent to the employee email address"
    }
  }
}
```

### Check Email:
- Log into test@example.com
- Find email with subject "🔑 Your Dayflow HRMS Login Credentials"
- Verify login ID and password are present

### Test Login:
```bash
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "<password_from_email>"
}
```

## 🐛 Troubleshooting

### Email Not Sending?
1. Check Gmail settings - App Password must be enabled
2. Verify `.env` EMAIL_* variables are correct
3. Check server logs for email errors
4. Ensure nodemailer is installed

### Login ID Already Exists?
- Serial number auto-increments
- Each year resets serial to 0001
- Unique constraint prevents duplicates

### Can't Install Nodemailer?
```bash
# Try clearing npm cache
npm cache clean --force

# Install again
npm install nodemailer --save
```

## 📈 Future Enhancements

1. **SMS Notifications**
   - Send credentials via SMS too
   - Use Twilio or similar service

2. **QR Code Login**
   - Generate QR code with credentials
   - Employee can scan to auto-fill

3. **Custom Email Templates**
   - Allow HR to customize email design
   - Multiple language support

4. **Bulk Employee Creation**
   - Upload CSV with employee data
   - Auto-generate and email all credentials

5. **Credential Regeneration**
   - Reset password and email new one
   - Regenerate login ID if needed

## 📞 Support

If you encounter any issues:
1. Check the console logs (frontend & backend)
2. Verify all environment variables
3. Ensure database migrations ran successfully
4. Test email configuration separately

## ✅ Checklist Before Going Live

- [ ] Install nodemailer package
- [ ] Run database migration
- [ ] Configure production email service
- [ ] Update `.env` with production values
- [ ] Test employee creation
- [ ] Verify email delivery
- [ ] Test login with generated credentials
- [ ] Test password change on first login
- [ ] Backup database before deployment

## 🎉 Benefits

- ✅ Automated credential generation
- ✅ Professional email delivery
- ✅ Secure random passwords
- ✅ Unique, memorable login IDs
- ✅ Reduces manual work
- ✅ Better security
- ✅ Improved employee onboarding experience
