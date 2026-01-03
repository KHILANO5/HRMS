import { Response } from 'express';
import { body, query } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse, paginationMeta } from '../utils/response';
import { generateTemporaryPassword, hashPassword } from '../utils/auth';
import { Op } from 'sequelize';

export const getAllEmployeesValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

export const getAllEmployees = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;
    const department = req.query.department as string;

    const { Employee, User, EmployeeAddress, EmergencyContact } = req.app.locals.models;

    const whereClause: any = { isActive: true };

    if (department) {
      whereClause.department = department;
    }

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { employeeCode: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Employee.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        {
          model: User,
          as: 'user',
          attributes: req.user?.role === 'admin' ? ['email', 'role', 'isActive'] : ['email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(
      successResponse('Employees retrieved successfully', {
        employees: rows,
        pagination: paginationMeta(count, page, limit),
      })
    );
  } catch (error: any) {
    console.error('Get employees error:', error);
    res.status(500).json(errorResponse('Failed to retrieve employees', 'GEN_003'));
  }
};

export const getEmployeeById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { Employee, User, EmployeeAddress, EmergencyContact } = req.app.locals.models;

    // Check if user can access this employee
    if (req.user?.role !== 'admin') {
      const userEmployee = await Employee.findOne({ where: { userId: req.user?.userId } });
      if (!userEmployee || userEmployee.id !== id) {
        return res.status(403).json(errorResponse('Unauthorized access', 'EMP_005'));
      }
    }

    const employee = await Employee.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'role', 'isActive'],
        },
        {
          model: EmployeeAddress,
          as: 'address',
        },
        {
          model: EmergencyContact,
          as: 'emergencyContact',
        },
      ],
    });

    if (!employee) {
      return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
    }

    res.json(successResponse('Employee details retrieved successfully', employee));
  } catch (error: any) {
    console.error('Get employee error:', error);
    res.status(500).json(errorResponse('Failed to retrieve employee', 'GEN_003'));
  }
};

export const createEmployeeValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone('any'),
  body('department').notEmpty().withMessage('Department is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('dateOfJoining').isISO8601().withMessage('Valid date of joining is required'),
];

export const createEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, email, phone, department, designation, dateOfJoining, address, emergencyContact, salary, leaveAllocation } = req.body;
    const { User, Employee, EmployeeAddress, EmergencyContact, Salary, LeaveBalance } = req.app.locals.models;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json(errorResponse('Email already exists', 'EMP_002'));
    }

    // Generate temporary password
    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await hashPassword(temporaryPassword);

    // Create user
    const user = await User.create({
      email,
      passwordHash: hashedPassword,
      role: 'employee',
      isActive: true,
      isFirstLogin: true,
    });

    // Generate employee code
    const empCount = await Employee.count();
    const employeeCode = `EMP${String(empCount + 1).padStart(3, '0')}`;

    // Create employee
    const employee = await Employee.create({
      userId: user.id,
      employeeCode,
      firstName,
      lastName,
      phone,
      department,
      designation,
      dateOfJoining,
      isActive: true,
    });

    // Create address if provided
    if (address) {
      await EmployeeAddress.create({
        employeeId: employee.id,
        ...address,
      });
    }

    // Create emergency contact if provided
    if (emergencyContact) {
      await EmergencyContact.create({
        employeeId: employee.id,
        ...emergencyContact,
      });
    }

    // Create salary if provided
    if (salary) {
      const { basicPay, hra, allowances, pfContribution, taxDeduction } = salary;
      const grossSalary = basicPay + hra + allowances;
      const netSalary = grossSalary - pfContribution - taxDeduction;

      await Salary.create({
        employeeId: employee.id,
        basicPay,
        hra,
        allowances,
        pfContribution,
        taxDeduction,
        grossSalary,
        netSalary,
        effectiveFrom: dateOfJoining,
        isActive: true,
      });
    }

    // Create leave balances
    const currentYear = new Date().getFullYear();
    await LeaveBalance.create({
      employeeId: employee.id,
      leaveType: 'paid',
      totalAllocated: leaveAllocation?.paidLeave || 15,
      used: 0,
      remaining: leaveAllocation?.paidLeave || 15,
      year: currentYear,
    });

    await LeaveBalance.create({
      employeeId: employee.id,
      leaveType: 'sick',
      totalAllocated: leaveAllocation?.sickLeave || 10,
      used: 0,
      remaining: leaveAllocation?.sickLeave || 10,
      year: currentYear,
    });

    res.status(201).json(
      successResponse('Employee created successfully. Credentials sent to email.', {
        employee: {
          id: employee.id,
          employeeCode,
          email,
          temporaryPassword, // In production, send via email
        },
      })
    );
  } catch (error: any) {
    console.error('Create employee error:', error);
    res.status(500).json(errorResponse('Failed to create employee', 'GEN_003'));
  }
};

export const updateEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { Employee, EmployeeAddress, EmergencyContact } = req.app.locals.models;

    // Check permissions
    if (req.user?.role !== 'admin') {
      const userEmployee = await Employee.findOne({ where: { userId: req.user?.userId } });
      if (!userEmployee || userEmployee.id !== id) {
        return res.status(403).json(errorResponse('Unauthorized access', 'EMP_005'));
      }
      
      // Employees can only update limited fields
      const { phone, address, profilePicture } = req.body;
      await Employee.update({ phone, profilePicture }, { where: { id } });

      if (address) {
        await EmployeeAddress.upsert({ employeeId: id, ...address });
      }
    } else {
      // Admin can update all fields
      const { firstName, lastName, phone, department, designation, address, emergencyContact, isActive, profilePicture } = req.body;
      
      await Employee.update(
        { firstName, lastName, phone, department, designation, isActive, profilePicture },
        { where: { id } }
      );

      if (address) {
        await EmployeeAddress.upsert({ employeeId: id, ...address });
      }

      if (emergencyContact) {
        await EmergencyContact.upsert({ employeeId: id, ...emergencyContact });
      }
    }

    const updatedEmployee = await Employee.findByPk(id, {
      include: [
        { model: EmployeeAddress, as: 'address' },
        { model: EmergencyContact, as: 'emergencyContact' },
      ],
    });

    res.json(successResponse('Employee updated successfully', { employee: updatedEmployee }));
  } catch (error: any) {
    console.error('Update employee error:', error);
    res.status(500).json(errorResponse('Failed to update employee', 'GEN_003'));
  }
};

export const deleteEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { Employee } = req.app.locals.models;

    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
    }

    // Soft delete
    await employee.update({ isActive: false });

    res.json(successResponse('Employee deactivated successfully'));
  } catch (error: any) {
    console.error('Delete employee error:', error);
    res.status(500).json(errorResponse('Failed to deactivate employee', 'GEN_003'));
  }
};
