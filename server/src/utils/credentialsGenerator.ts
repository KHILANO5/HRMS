import Employee from '../../../database/models/Employee';
import { Op } from 'sequelize';

/**
 * Generate random password with specified length
 * Includes uppercase, lowercase, numbers, and special characters
 */
export function generateRandomPassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '@#$%&*!';
    
    const allChars = uppercase + lowercase + numbers + special;
    
    let password = '';
    
    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Generate Login ID in format: OI + JODO + 2022 + 0001
 * OI = Odoo India (Company Name - first two letters)
 * JODO = First two letters of first name + first two letters of last name
 * 2022 = Year of joining
 * 0001 = Serial number for that year
 */
export async function generateLoginId(
    firstName: string,
    lastName: string,
    joiningDate: Date
): Promise<string> {
    // Company prefix (Odoo India)
    const companyPrefix = 'OI';
    
    // Get first two letters of first and last name (uppercase)
    const firstNamePrefix = firstName.substring(0, 2).toUpperCase();
    const lastNamePrefix = lastName.substring(0, 2).toUpperCase();
    const nameCode = firstNamePrefix + lastNamePrefix;
    
    // Get year of joining
    const year = joiningDate.getFullYear();
    
    // Find the last employee with this year to get the next serial number
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59);
    
    // Count employees joined in the same year
    const count = await Employee.count({
        where: {
            joiningDate: {
                [Op.between]: [yearStart, yearEnd]
            }
        }
    });
    
    // Serial number (incremented by 1, padded to 4 digits)
    const serialNumber = (count + 1).toString().padStart(4, '0');
    
    // Combine all parts
    const loginId = `${companyPrefix}${nameCode}${year}${serialNumber}`;
    
    return loginId;
}

/**
 * Validate if login ID already exists
 */
export async function isLoginIdUnique(loginId: string): Promise<boolean> {
    const existing = await Employee.findOne({
        where: { employeeId: loginId }
    });
    return !existing;
}
