# Dayflow HRMS - Quick API Reference

## 🔐 Authentication Required
All endpoints except login and refresh-token require:
```
Authorization: Bearer <access_token>
```

---

## 📋 Quick Endpoint List

### Authentication (`/api/v1/auth`)
```http
POST   /auth/login                         # Login
POST   /auth/change-password               # Change password
POST   /auth/change-password-first-login   # First login password change
POST   /auth/refresh-token                 # Get new access token
POST   /auth/logout                        # Logout
```

### Employees (`/api/v1/employees`)
```http
GET    /employees                          # List all (paginated)
GET    /employees/:id                      # Get by ID
POST   /employees                          # Create (Admin only)
PUT    /employees/:id                      # Update
DELETE /employees/:id                      # Delete (Admin only)
```

**Query params for GET /employees:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name
- `department` - Filter by department

### Attendance (`/api/v1/attendance`)
```http
GET    /attendance                         # Get records
GET    /attendance/date/:date              # Daily summary (Admin only)
```

**Query params:**
- `employeeId` - Filter by employee (UUID)
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `page` - Page number
- `limit` - Items per page

### Leave Management (`/api/v1/leaves`)
```http
GET    /leaves/balance                     # Get leave balance
GET    /leaves/requests                    # Get leave requests
GET    /leaves/history                     # Get leave history
POST   /leaves/requests                    # Create request
PATCH  /leaves/requests/:id                # Approve/Reject (Admin only)
DELETE /leaves/requests/:id                # Cancel request
```

**Query params:**
- `employeeId` - Filter by employee
- `year` - Filter by year (default: current)
- `status` - Filter by status (pending/approved/rejected)
- `page` - Page number
- `limit` - Items per page

### Salary (`/api/v1/salary`)
```http
GET    /salary/:employeeId                 # Get salary info
PUT    /salary/:employeeId                 # Update salary (Admin only)
```

**Note:** Employees see limited info, Admin sees full breakdown

### Profile (`/api/v1/profile`)
```http
GET    /profile/me                         # Get current user profile
POST   /profile/picture                    # Upload profile picture
POST   /profile/resume                     # Upload resume
```

**File upload requirements:**
- Profile picture: JPEG, PNG, GIF (max 5MB)
- Resume: PDF, DOC, DOCX (max 10MB)
- Use `multipart/form-data` content type

---

## 🧪 Testing with cURL

### 1. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dayflow.com","password":"Password@123"}'
```

### 2. Get All Employees
```bash
curl -X GET "http://localhost:3000/api/v1/employees?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Get Leave Balance
```bash
curl -X GET "http://localhost:3000/api/v1/leaves/balance?year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create Leave Request
```bash
curl -X POST http://localhost:3000/api/v1/leaves/requests \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "leaveType": "paid",
    "startDate": "2026-01-20",
    "endDate": "2026-01-22",
    "reason": "Family vacation"
  }'
```

### 5. Upload Profile Picture
```bash
curl -X POST http://localhost:3000/api/v1/profile/picture \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "profilePicture=@/path/to/image.jpg"
```

---

## 🧪 Testing with PowerShell

### 1. Login
```powershell
$body = @{
    email = "admin@dayflow.com"
    password = "Password@123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$token = $response.data.tokens.accessToken
Write-Host "Token: $token"
```

### 2. Get Employees
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/employees" `
    -Method GET `
    -Headers $headers | ConvertTo-Json -Depth 10
```

### 3. Create Leave Request
```powershell
$body = @{
    leaveType = "paid"
    startDate = "2026-01-20"
    endDate = "2026-01-22"
    reason = "Family vacation"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/leaves/requests" `
    -Method POST `
    -Headers $headers `
    -ContentType "application/json" `
    -Body $body | ConvertTo-Json -Depth 10
```

---

## 📝 Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "items": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  },
  "error": null
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid credentials",
  "data": null,
  "error": {
    "code": "AUTH_001",
    "details": "Email or password is incorrect"
  }
}
```

---

## 🔑 Test Accounts

```
Admin Account:
  Email: admin@dayflow.com
  Password: Password@123
  Role: admin

Employee Account:
  Email: john.doe@dayflow.com
  Password: Password@123
  Role: employee
```

---

## 🚀 Server Status

Health Check:
```bash
curl http://localhost:3000/health
```

Expected Response:
```json
{
  "success": true,
  "message": "Server is running",
  "data": {
    "uptime": 123.45,
    "database": "connected"
  },
  "error": null
}
```

---

**Happy Testing! 🎉**
