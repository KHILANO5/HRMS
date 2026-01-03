// Attendance Model
import { DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export interface AttendanceAttributes {
  id: string;
  employeeId: string;
  attendanceDate: Date;
  checkInTime?: string;
  checkOutTime?: string;
  workHours?: number;
  extraHours?: number;
  status: 'present' | 'absent' | 'leave' | 'half_day';
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const initAttendanceModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'Attendance',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'employee_id',
        references: {
          model: 'employees',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      attendanceDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'attendance_date',
      },
      checkInTime: {
        type: DataTypes.TIME,
        allowNull: true,
        field: 'check_in_time',
      },
      checkOutTime: {
        type: DataTypes.TIME,
        allowNull: true,
        field: 'check_out_time',
      },
      workHours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: 'work_hours',
      },
      extraHours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: 'extra_hours',
      },
      status: {
        type: DataTypes.ENUM('present', 'absent', 'leave', 'half_day'),
        allowNull: false,
        defaultValue: 'absent',
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'attendance',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['employee_id'] },
        { fields: ['attendance_date'] },
        { fields: ['status'] },
        { fields: ['created_at'] },
        {
          fields: ['employee_id', 'attendance_date'],
          unique: true,
        },
      ],
    }
  );
};
