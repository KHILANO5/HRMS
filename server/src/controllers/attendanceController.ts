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

export const checkIn = async (req: AuthRequest, res: Response) => {
  try {
    const { checkInTime, location, remarks } = req.body;
    const { Employee, Attendance } = req.app.locals.models;
    
    // Get employee from JWT token
    const employee = await Employee.findOne({ 
      where: { userId: req.user?.userId } 
    });
    
    if (!employee) {
      return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // Check if already checked in today
    const existing = await Attendance.findOne({
      where: { employeeId: employee.id, attendanceDate: today }
    });
    
    if (existing) {
      return res.status(400).json(errorResponse('Already checked in today', 'ATT_002'));
    }
    
    // Determine if late (after 9:30 AM)
    const time = checkInTime || new Date().toTimeString().split(' ')[0];
    const [hours, minutes] = time.split(':').map(Number);
    const isLate = hours > 9 || (hours === 9 && minutes > 30);
    
    // Create attendance record
    const attendance = await Attendance.create({
      employeeId: employee.id,
      attendanceDate: today,
      checkInTime: time,
      status: 'present',
      remarks: isLate ? `Late check-in. ${remarks || ''}`.trim() : remarks,
    });
    
    res.status(201).json(
      successResponse('Checked in successfully', {
        attendanceId: attendance.id,
        checkInTime: time,
        date: today,
        isLate,
        status: 'present'
      })
    );
  } catch (error: any) {
    console.error('Check-in error:', error);
    res.status(500).json(errorResponse('Failed to check in', 'GEN_003'));
  }
};

export const checkOut = async (req: AuthRequest, res: Response) => {
  try {
    const { checkOutTime, remarks } = req.body;
    const { Employee, Attendance } = req.app.locals.models;
    
    // Get employee from JWT token
    const employee = await Employee.findOne({ 
      where: { userId: req.user?.userId } 
    });
    
    if (!employee) {
      return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // Find today's attendance record
    const attendance = await Attendance.findOne({
      where: { employeeId: employee.id, attendanceDate: today }
    });
    
    if (!attendance) {
      return res.status(400).json(errorResponse('Must check in first', 'ATT_003'));
    }
    
    if (attendance.checkOutTime) {
      return res.status(400).json(errorResponse('Already checked out today', 'ATT_004'));
    }
    
    // Calculate work hours
    const time = checkOutTime || new Date().toTimeString().split(' ')[0];
    const checkInDate = new Date(`1970-01-01T${attendance.checkInTime}`);
    const checkOutDate = new Date(`1970-01-01T${time}`);
    const diffMs = checkOutDate.getTime() - checkInDate.getTime();
    const workHours = (diffMs / (1000 * 60 * 60)).toFixed(2);
    
    // Calculate extra hours (if > 9 hours)
    const extraHours = parseFloat(workHours) > 9 
      ? (parseFloat(workHours) - 9).toFixed(2) 
      : '0.00';
    
    // Update attendance record
    await attendance.update({
      checkOutTime: time,
      workHours: parseFloat(workHours),
      extraHours: parseFloat(extraHours),
      remarks: remarks || attendance.remarks,
    });
    
    res.json(
      successResponse('Checked out successfully', {
        attendanceId: attendance.id,
        checkInTime: attendance.checkInTime,
        checkOutTime: time,
        workHours,
        extraHours,
      })
    );
  } catch (error: any) {
    console.error('Check-out error:', error);
    res.status(500).json(errorResponse('Failed to check out', 'GEN_003'));
  }
};
