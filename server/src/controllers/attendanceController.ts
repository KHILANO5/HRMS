import { Response } from 'express';
import { query } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse, paginationMeta } from '../utils/response';
import { Op } from 'sequelize';

export const getAttendanceValidation = [
  query('employeeId').optional().isUUID().withMessage('Valid employee ID required'),
  query('startDate').optional().isISO8601().withMessage('Valid start date required'),
  query('endDate').optional().isISO8601().withMessage('Valid end date required'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

export const getAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    const offset = (page - 1) * limit;
    const { employeeId, startDate, endDate } = req.query;

    const { Attendance, Employee } = req.app.locals.models;

    // Get employee ID for current user if not admin
    let targetEmployeeId = employeeId as string;
    if (req.user?.role !== 'admin') {
      const userEmployee = await Employee.findOne({ where: { userId: req.user?.userId } });
      if (!userEmployee) {
        return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
      }
      targetEmployeeId = userEmployee.id;
    }

    const whereClause: any = {};
    if (targetEmployeeId) {
      whereClause.employeeId = targetEmployeeId;
    }
    if (startDate && endDate) {
      whereClause.attendanceDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    const { count, rows } = await Attendance.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        {
          model: Employee,
          attributes: ['employeeCode', 'firstName', 'lastName'],
        },
      ],
      order: [['attendanceDate', 'DESC']],
    });

    // Calculate summary
    const summary = {
      totalWorkingDays: count,
      daysPresent: rows.filter(r => r.status === 'present').length,
      daysAbsent: rows.filter(r => r.status === 'absent').length,
      daysOnLeave: rows.filter(r => r.status === 'leave').length,
      totalWorkHours: rows.reduce((sum, r) => sum + (parseFloat(r.workHours) || 0), 0).toFixed(2),
      totalExtraHours: rows.reduce((sum, r) => sum + (parseFloat(r.extraHours) || 0), 0).toFixed(2),
    };

    res.json(
      successResponse('Attendance records retrieved successfully', {
        records: rows,
        summary,
        pagination: paginationMeta(count, page, limit),
      })
    );
  } catch (error: any) {
    console.error('Get attendance error:', error);
    res.status(500).json(errorResponse('Failed to retrieve attendance', 'GEN_003'));
  }
};

export const getAttendanceByDate = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.params;
    const { Attendance, Employee } = req.app.locals.models;

    const records = await Attendance.findAll({
      where: { attendanceDate: date },
      include: [
        {
          model: Employee,
          attributes: ['id', 'employeeCode', 'firstName', 'lastName'],
        },
      ],
    });

    const totalEmployees = await Employee.count({ where: { isActive: true } });

    const summary = {
      date,
      totalEmployees,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      onLeave: records.filter(r => r.status === 'leave').length,
    };

    res.json(
      successResponse('Daily attendance retrieved successfully', {
        date,
        summary,
        records,
      })
    );
  } catch (error: any) {
    console.error('Get attendance by date error:', error);
    res.status(500).json(errorResponse('Failed to retrieve attendance', 'GEN_003'));
  }
};
