import { Response } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/response';

export const getSalary = async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId } = req.params;
    const { Salary, SalaryComponent, Employee } = req.app.locals.models;

    // Check permissions
    if (req.user?.role !== 'admin') {
      const userEmployee = await Employee.findOne({ where: { userId: req.user?.userId } });
      if (!userEmployee || userEmployee.id !== employeeId) {
        return res.status(403).json(errorResponse('Unauthorized access to salary data', 'SAL_003'));
      }
    }

    const salary = await Salary.findOne({
      where: { employeeId, isActive: true },
      include: [
        {
          model: SalaryComponent,
          as: 'components',
        },
      ],
    });

    if (!salary) {
      return res.status(404).json(errorResponse('Salary information not found', 'SAL_001'));
    }

    // Return limited data for employees
    if (req.user?.role !== 'admin') {
      return res.json(
        successResponse('Salary information retrieved successfully', {
          monthlySalary: salary.netSalary,
          yearlySalary: salary.netSalary * 12,
        })
      );
    }

    // Return full data for admin
    res.json(
      successResponse('Salary information retrieved successfully', {
        employeeId,
        basicPay: salary.basicPay,
        hra: salary.hra,
        allowances: salary.allowances,
        grossSalary: salary.grossSalary,
        pfContribution: salary.pfContribution,
        taxDeduction: salary.taxDeduction,
        netSalary: salary.netSalary,
        monthlySalary: salary.netSalary,
        yearlySalary: salary.netSalary * 12,
        effectiveFrom: salary.effectiveFrom,
        components: salary.components,
      })
    );
  } catch (error: any) {
    console.error('Get salary error:', error);
    res.status(500).json(errorResponse('Failed to retrieve salary information', 'GEN_003'));
  }
};

export const updateSalaryValidation = [
  body('basicPay').isNumeric().withMessage('Basic pay must be a number'),
  body('hra').isNumeric().withMessage('HRA must be a number'),
  body('allowances').isNumeric().withMessage('Allowances must be a number'),
  body('pfContribution').isNumeric().withMessage('PF contribution must be a number'),
  body('taxDeduction').isNumeric().withMessage('Tax deduction must be a number'),
  body('effectiveFrom').isISO8601().withMessage('Valid effective date required'),
];

export const updateSalary = async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId } = req.params;
    const { basicPay, hra, allowances, pfContribution, taxDeduction, effectiveFrom } = req.body;
    const { Salary } = req.app.locals.models;

    const grossSalary = basicPay + hra + allowances;
    const netSalary = grossSalary - pfContribution - taxDeduction;

    // Deactivate old salary
    await Salary.update({ isActive: false }, { where: { employeeId, isActive: true } });

    // Create new salary record
    const newSalary = await Salary.create({
      employeeId,
      basicPay,
      hra,
      allowances,
      pfContribution,
      taxDeduction,
      grossSalary,
      netSalary,
      effectiveFrom,
      isActive: true,
    });

    res.json(
      successResponse('Salary updated successfully', {
        employeeId,
        basicPay,
        hra,
        allowances,
        grossSalary,
        pfContribution,
        taxDeduction,
        netSalary,
        effectiveFrom,
      })
    );
  } catch (error: any) {
    console.error('Update salary error:', error);
    res.status(500).json(errorResponse('Failed to update salary', 'GEN_003'));
  }
};
