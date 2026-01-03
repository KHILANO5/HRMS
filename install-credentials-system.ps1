Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Employee Credentials System Installation" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install nodemailer
Write-Host "[1/3] Installing nodemailer package..." -ForegroundColor Yellow
Set-Location "e:\odoo final\server"
npm install nodemailer
npm install --save-dev @types/nodemailer

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Nodemailer installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install nodemailer" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Run database migration
Write-Host "[2/3] Running database migration..." -ForegroundColor Yellow
Write-Host "Please run this SQL manually in MySQL:" -ForegroundColor Cyan
Write-Host ""
Write-Host "ALTER TABLE employees ADD COLUMN employee_id VARCHAR(50) UNIQUE AFTER employee_code;" -ForegroundColor White
Write-Host "ALTER TABLE employees ADD COLUMN joining_date DATE AFTER date_of_joining;" -ForegroundColor White
Write-Host "UPDATE employees SET joining_date = date_of_joining WHERE joining_date IS NULL;" -ForegroundColor White
Write-Host ""
Write-Host "Or run: mysql -u root -p hrms_db < database/migrations/add_employee_id_field.sql" -ForegroundColor White
Write-Host ""
$confirmation = Read-Host "Have you run the migration? (y/n)"

if ($confirmation -ne 'y') {
    Write-Host "⚠ Please run the database migration before continuing" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Database migration completed" -ForegroundColor Green
Write-Host ""

# Step 3: Instructions
Write-Host "[3/3] Final steps..." -ForegroundColor Yellow
Write-Host "✓ Email configuration added to .env" -ForegroundColor Green
Write-Host "✓ Email service created" -ForegroundColor Green
Write-Host "✓ Login ID generator created" -ForegroundColor Green
Write-Host "✓ Employee controller updated" -ForegroundColor Green
Write-Host ""

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Installation Complete!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart your backend server" -ForegroundColor White
Write-Host "2. Create a new employee from the frontend" -ForegroundColor White
Write-Host "3. Check the employee's email for credentials" -ForegroundColor White
Write-Host ""
Write-Host "Login ID Format: OINIPA20260001" -ForegroundColor Cyan
Write-Host "  OI = Odoo India" -ForegroundColor Gray
Write-Host "  NIPA = First 2 of name + First 2 of surname" -ForegroundColor Gray
Write-Host "  2026 = Year of joining" -ForegroundColor Gray
Write-Host "  0001 = Serial number" -ForegroundColor Gray
Write-Host ""
Write-Host "Documentation: CREDENTIALS_SYSTEM_DOCS.md" -ForegroundColor Cyan
Write-Host ""
