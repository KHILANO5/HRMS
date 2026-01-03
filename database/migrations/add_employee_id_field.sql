-- Add employee_id and joining_date columns to employees table

-- Add employee_id column (for login ID like OINIPA20260001)
ALTER TABLE employees 
ADD COLUMN employee_id VARCHAR(50) UNIQUE AFTER employee_code;

-- Add joining_date column (separate from date_of_joining for clarity)
ALTER TABLE employees 
ADD COLUMN joining_date DATE AFTER date_of_joining;

-- Update existing employees to set joining_date same as date_of_joining
UPDATE employees 
SET joining_date = date_of_joining 
WHERE joining_date IS NULL;

-- You can also update existing employees to have proper employee_id format
-- But this requires running the login ID generation for each employee
-- This can be done through a script if needed
