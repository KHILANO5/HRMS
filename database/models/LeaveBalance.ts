// Leave Balance Model
import { DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export interface LeaveBalanceAttributes {
  id: string;
  employeeId: string;
  leaveType: 'paid' | 'sick';
  totalAllocated: number;
  used: number;
  remaining: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

export const initLeaveBalanceModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'LeaveBalance',
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
      totalAllocated: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'total_allocated',
      },
      used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      remaining: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'leave_balances',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['employee_id'] },
        { fields: ['leave_type'] },
        { fields: ['year'] },
        {
          fields: ['employee_id', 'leave_type', 'year'],
          unique: true,
        },
      ],
    }
  );
};
