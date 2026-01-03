// Leave Request Model
import { DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export interface LeaveRequestAttributes {
  id: string;
  employeeId: string;
  leaveType: 'paid' | 'sick';
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  reason: string;
  attachmentUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminRemarks?: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const initLeaveRequestModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'LeaveRequest',
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
      leaveType: {
        type: DataTypes.ENUM('paid', 'sick'),
        allowNull: false,
        field: 'leave_type',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'end_date',
      },
      numberOfDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'number_of_days',
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attachmentUrl: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        field: 'attachment_url',
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
      adminRemarks: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'admin_remarks',
      },
      approvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'approved_by',
        references: {
          model: 'employees',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'approved_at',
      },
    },
    {
      tableName: 'leave_requests',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['employee_id'] },
        { fields: ['leave_type'] },
        { fields: ['status'] },
        { fields: ['start_date'] },
        { fields: ['end_date'] },
        { fields: ['created_at'] },
      ],
    }
  );
};
