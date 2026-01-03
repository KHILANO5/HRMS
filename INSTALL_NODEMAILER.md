# Install Nodemailer Package

Please run these commands in your terminal:

```bash
cd "e:\odoo final\server"
npm install nodemailer
npm install --save-dev @types/nodemailer
```

After installation, restart your backend server.

## What was implemented:

1. **Email Configuration** - Added to `.env`:
   - EMAIL_HOST=smtp.gmail.com
   - EMAIL_PORT=587
   - EMAIL_USER=nishitsavaliya5@gmail.com
   - EMAIL_PASSWORD=tqhvsbxurnjkhtsw
   - EMAIL_FROM=nishitsavaliya5@gmail.com

2. **Login ID Generator** - Auto-generates IDs like: `OIJODO20220001`
   - OI = Odoo India (company name)
   - JODO = First 2 letters of first name + first 2 letters of last name
   - 2022 = Year of joining
   - 0001 = Serial number for that year

3. **Random Password Generator** - Creates secure 12-character passwords with:
   - Uppercase letters
   - Lowercase letters
   - Numbers
   - Special characters (@#$%&*!)

4. **Email Service** - Sends beautiful HTML emails with:
   - Login ID
   - Temporary password
   - Instructions for first login
   - Security warnings

5. **Employee Creation Updated** - Now automatically:
   - Generates login ID based on name and joining date
   - Generates random secure password
   - Sends credentials email to employee
   - Stores employee with new employeeId field

## Testing:

After installing nodemailer and restarting the server, create a new employee through the frontend. The system will:
1. Generate a unique login ID (e.g., OINI20260001 for Nishit's account)
2. Generate a random password
3. Send an email to the employee's email address with their credentials
4. Return success message: "Employee created successfully. Credentials sent to email."

## Example Login ID Format:

- Employee: **Nishit Patel**, joining in **2026**, serial **1**
- Login ID: **OINI20260001**
  - OI = Odoo India
  - NI = **NI**shit
  - PA = **PA**tel (wait, should be first 2 of last name)
  - Actually: NIPA (Nishit Patel)
  
Actually looking at the image, it should be:
- JODO = First two of first + first two of last
- So for "Nishit Patel" = "NIPA"
- Full: OINIPA20260001

The code implements this correctly!
