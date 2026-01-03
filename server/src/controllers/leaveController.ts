import { Response } from 'express';
import { body, query } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse, paginationMeta } from '../utils/response';
import { Op } from 'sequelize';

export const getLeaveBalanceValidation = [
  query('employeeId').optional().isUUID(),
  query('year').optional().isInt({ min: 2000, max: 2100 }),
];

export const getLeaveBalance = async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId, year } = req.query;
    const targetYear = year ? parseInt(year as string) : new Date().getFullYear();

    const { LeaveBalance, Employee } = req.app.locals.models;

    // Get employee ID for current user if not admin
    let targetEmployeeId = employeeId as string;
    if (req.user?.role !== 'admin') {
      const userEmployee = await Employee.findOne({ where: { userId: req.user?.userId } });
      if (!userEmployee) {
        return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
      }
      targetEmployeeId = userEmployee.id;
    }

    if (!targetEmployeeId) {
      return res.status(400).json(errorResponse('Employee ID is required', 'GEN_001'));
    }

    const balances = await LeaveBalance.findAll({
      where: {
        employeeId: targetEmployeeId,
        year: targetYear,
      },
    });

    res.json(
      successResponse('Leave balance retrieved successfully', {
        employeeId: targetEmployeeId,
        year: targetYear,
        balances,
      })
    );
  } catch (error: any) {
    console.error('Get leave balance error:', error);
    res.status(500).json(errorResponse('Failed to retrieve leave balance', 'GEN_003'));
  }
};

export const getLeaveRequestsValidation = [
  query('employeeId').optional().isUUID(),
  query('status').optional().isIn(['pending', 'approved', 'rejected']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

export const getLeaveRequests = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const { employeeId, status } = req.query;

    const { LeaveRequest, Employee } = req.app.locals.models;

    const whereClause: any = {};

    // Get employee ID for current user if not admin
    if (req.user?.role !== 'admin') {
      const userEmployee = await Employee.findOne({ where: { userId: req.user?.userId } });
      if (!userEmployee) {
        return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
      }
      whereClause.employeeId = userEmployee.id;
    } else if (employeeId) {
      whereClause.employeeId = employeeId;
    }

    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await LeaveRequest.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['employeeCode', 'firstName', 'lastName'],
        },
        {
          model: Employee,
          as: 'approver',
          attributes: ['firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(
      successResponse('Leave requests retrieved successfully', {
        requests: rows,
        pagination: paginationMeta(count, page, limit),
      })
    );
  } catch (error: any) {
    console.error('Get leave requests error:', error);
    res.status(500).json(errorResponse('Failed to retrieve leave requests', 'GEN_003'));
  }
};

export const createLeaveRequestValidation = [
  body('leaveType').isIn(['paid', 'sick']).withMessage('Leave type must be paid or sick'),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
  body('reason').notEmpty().withMessage('Reason is required'),
];

export const createLeaveRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const { LeaveRequest, LeaveBalance, Employee } = req.app.locals.models;

    // Get employee
    const employee = await Employee.findOne({ where: { userId: req.user?.userId } });
    if (!employee) {
      return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
    }

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Check leave balance
    const currentYear = new Date().getFullYear();
    const balance = await LeaveBalance.findOne({
      where: {
        employeeId: employee.id,
        leaveType,
        year: currentYear,
      },
    });

    if (!balance || balance.remaining < numberOfDays) {
      return res.status(400).json(
        errorResponse('Insufficient leave balance', 'LEAVE_002', {
          requested: numberOfDays,
          available: balance?.remaining || 0,
        })
      );
    }

    // Check for overlapping leave
    const overlapping = await LeaveRequest.findOne({
      where: {
        employeeId: employee.id,
        status: { [Op.in]: ['pending', 'approved'] },
        [Op.or]: [
          {
            startDate: { [Op.between]: [startDate, endDate] },
          },
          {
            endDate: { [Op.between]: [startDate, endDate] },
          },
        ],
      },
    });

    if (overlapping) {
      return res.status(400).json(
        errorResponse('Leave already exists for the requested dates', 'LEAVE_003', {
          existingLeave: {
            id: overlapping.id,
            startDate: overlapping.startDate,
            endDate: overlapping.endDate,
          },
        })
      );
    }

    // Create leave request
    const leaveRequest = await LeaveRequest.create({
      employeeId: employee.id,
      leaveType,
      startDate,
      endDate,
      numberOfDays,
      reason,
      status: 'pending',
    });

    res.status(201).json(
      successResponse('Leave request submitted successfully', {
        request: leaveRequest,
      })
    );
  } catch (error: any) {
    console.error('Create leave request error:', error);
    res.status(500).json(errorResponse('Failed to create leave request', 'GEN_003'));
  }
};

export const updateLeaveRequestValidation = [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('adminRemarks').optional().isString(),
];

export const updateLeaveRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;
    const { LeaveRequest, LeaveBalance, Employee } = req.app.locals.models;

    // Get admin employee
    const adminEmployee = await Employee.findOne({ where: { userId: req.user?.userId } });
    if (!adminEmployee) {
      return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
    }

    const leaveRequest = await LeaveRequest.findByPk(id);

    if (!leaveRequest) {
      return res.status(404).json(errorResponse('Leave request not found', 'LEAVE_001'));
    }

    if (leaveRequest.status !== 'pending') {
      return res.status(400).json(errorResponse('Leave request already processed', 'LEAVE_006'));
    }

    // Update leave request
    await leaveRequest.update({
      status,
      adminRemarks,
      approvedBy: adminEmployee.id,
      approvedAt: new Date(),
    });

    // Update leave balance if approved
    if (status === 'approved') {
      const balance = await LeaveBalance.findOne({
        where: {
          employeeId: leaveRequest.employeeId,
          leaveType: leaveRequest.leaveType,
          year: new Date().getFullYear(),
        },
      });

      if (balance) {
        await balance.update({
          used: balance.used + leaveRequest.numberOfDays,
          remaining: balance.remaining - leaveRequest.numberOfDays,
        });
      }
    }

    res.json(
      successResponse('Leave request updated successfully', {
        request: leaveRequest,
      })
    );
  } catch (error: any) {
    console.error('Update leave request error:', error);
    res.status(500).json(errorResponse('Failed to update leave request', 'GEN_003'));
  }
};

export const deleteLeaveRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { LeaveRequest, Employee } = req.app.locals.models;

    const employee = await Employee.findOne({ where: { userId: req.user?.userId } });
    if (!employee) {
      return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
    }

    const leaveRequest = await LeaveRequest.findByPk(id);

    if (!leaveRequest) {
      return res.status(404).json(errorResponse('Leave request not found', 'LEAVE_001'));
    }

    if (leaveRequest.employeeId !== employee.id) {
      return res.status(403).json(errorResponse('Unauthorized access', 'EMP_005'));
    }

    if (leaveRequest.status !== 'pending') {
      return res.status(400).json(errorResponse('Cannot cancel approved/rejected leave', 'LEAVE_006'));
    }

    await leaveRequest.destroy();

    res.json(successResponse('Leave request cancelled successfully'));
  } catch (error: any) {
    console.error('Delete leave request error:', error);
    res.status(500).json(errorResponse('Failed to cancel leave request', 'GEN_003'));
  }
};

export const getLeaveHistoryValidation = [
  query('employeeId').optional().isUUID(),
  query('year').optional().isInt({ min: 2000, max: 2100 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

export const getLeaveHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId, year, page = 1, limit = 10 } = req.query;
    const targetYear = year ? parseInt(year as string) : new Date().getFullYear();
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const { LeaveRequest, Employee } = req.app.locals.models;

    // Get employee ID for current user if not admin
    let targetEmployeeId = employeeId as string;
    if (req.user?.role !== 'admin') {
      const userEmployee = await Employee.findOne({ where: { userId: req.user?.userId } });
      if (!userEmployee) {
        return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
      }
      targetEmployeeId = userEmployee.id;
    }

    if (!targetEmployeeId) {
      return res.status(400).json(errorResponse('Employee ID is required', 'GEN_001'));
    }

    const whereClause: any = {
      employeeId: targetEmployeeId,
      status: { [Op.ne]: 'pending' }, // Only approved or rejected
    };

    // Filter by year if provided
    if (year) {
      whereClause.startDate = {
        [Op.gte]: new Date(`${targetYear}-01-01`),
        [Op.lte]: new Date(`${targetYear}-12-31`),
      };
    }

    const { count, rows: history } = await LeaveRequest.findAndCountAll({
      where: whereClause,
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        'leaveType',
        'startDate',
        'endDate',
        'numberOfDays',
        'reason',
        'status',
        'adminRemarks',
        'createdAt',
        'approvedAt',
      ],
    });

    res.json(
      successResponse('Leave history retrieved successfully', {
        history,
        pagination: paginationMeta(count, pageNum, limitNum),
      })
    );
  } catch (error: any) {
    console.error('Get leave history error:', error);
    res.status(500).json(errorResponse('Failed to retrieve leave history', 'GEN_003'));
  }
};
